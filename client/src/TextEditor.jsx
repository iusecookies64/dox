import React, { useCallback, useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { useRecoilValue } from "recoil";
import { userAtom } from "./atoms";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Modal from "./Modal";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

function TextEditor() {
  // checking if user is logged in before showing it the text-editor
  const username = useRecoilValue(userAtom);
  const navigate = useNavigate();
  // if logged in we define the code
  const { id: documentId } = useParams();
  console.log(documentId);
  const [documentObject, setObject] = useState(null);
  const [isEditor, setEditor] = useState(false);
  const [quill, setQuill] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showModal, setModal] = useState(false);
  const [modalMessage, setMessage] = useState("");
  const [responseFunction, setResponseFunction] = useState(null);
  const editorStyles =
    "outline-none bg-white w-[8.5in] min-h-[11in] p-[1in] m-4 shadow-lg print:shadow-none";
  const containerStyles =
    "min-h-dvh min-w-dvw border-none outline-none flex items-center justify-center ";
  const toolbatStyles =
    "sticky top-0 left-0 bg-slate-100 z-10 shadow-lg min-w-dvw print:hidden print:w-[6.5in] print:h-[9in] print:p-0 print:m-0 print:self-start";
  const addEditor = useCallback(
    (container) => {
      // if container not yer defined return
      if (!container) return;

      // removing all previous html
      container.innerHTML = "";

      // creating new editor instance
      const editor = document.createElement("div");
      container.append(editor);

      // creating new Quill instance inside the editor element
      const q = new Quill(editor, {
        theme: "snow",
        readOnly: !isEditor,
        modules: { toolbar: TOOLBAR_OPTIONS },
      });

      if (documentObject) q.setContents(documentObject.data);
      setQuill(q);

      // toolbar styles
      let previousClasses = container
        .querySelector(".ql-toolbar")
        .getAttribute("class");
      container
        .querySelector(".ql-toolbar")
        .setAttribute("class", `${previousClasses} ${toolbatStyles}`);
      container
        .querySelector(".ql-toolbar")
        .setAttribute("style", `border: none`);

      // editor styles
      previousClasses = container
        .querySelector(".ql-editor")
        .getAttribute("class");
      container
        .querySelector(".ql-editor")
        .setAttribute("class", `${previousClasses} ${editorStyles}`);

      // editor container styles
      previousClasses = container
        .querySelector(".ql-container")
        .getAttribute("class");
      container
        .querySelector(".ql-container")
        .setAttribute("class", `${previousClasses} ${containerStyles}`);
      container
        .querySelector(".ql-container")
        .setAttribute("style", `border: none`);
    },
    [documentObject, isEditor]
  );

  // checking if username is defined after 2 sec, if not then navigate back to home to login
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!username) navigate("/");
    }, 2000);
    return () => clearTimeout(timer);
  }, [username]);

  // setting up socket server & getting document data from server
  useEffect(() => {
    if (!username) return;
    const s = io("https://dox.iusecookies64.xyz");
    setSocket(s);

    // when connected getting document data
    s.on("connect", () => {
      s.emit("get-document-data", documentId, username);
    });
    s.on("document-data", (data) => {
      setObject(data);
      const indx = data.editors.findIndex((editor) => editor == username);
      if (indx != -1) {
        setEditor(true);
      }
    });
    return () => s.disconnect();
  }, [username]);

  // defining all communications
  useEffect(() => {
    if (!socket || !quill) return;

    // on text-change we emit the changes
    quill.on("text-change", (delta, oldDelta, source) => {
      if (source != "user") return;
      socket.emit("text-change", documentId, delta);
    });

    // on receive-change we update the editor
    socket.on("receive-change", (delta) => {
      quill.updateContents(delta);
    });

    if (documentObject.owner == username) {
      // if we are owner then only we listen to request access
      socket.on("request-access", (username) => {
        setMessage(`${username} is requesting editing access, give access?`);
        function fn(response) {
          if (response) {
            console.log("giving access");
            socket.emit("give-access", documentId, username);
          }
          setModal(false);
        }
        setResponseFunction(() => {
          return fn;
        });
        setModal(true);
      });
    }

    socket.on("new-editor", (editorName) => {
      if (editorName == username) {
        setEditor(true);
      }
      setObject((oldObject) => {
        return {
          ...oldObject,
          editors: [...oldObject.editors, editorName],
        };
      });
    });
  }, [socket, quill]);

  // sending data to database every 3 seconds
  useEffect(() => {
    if (!socket || !quill) return;
    const interval = setInterval(() => {
      socket.emit("update-db", documentId, quill.getContents());
    });

    return () => clearInterval(interval);
  }, [socket, quill]);

  function requestAccess() {
    if (!socket) return;
    socket.emit("request-access", documentId, username);
  }

  return (
    <div className="min-h-dvh min-w-dvw flex items-center justify-center relative">
      <div
        className="p-2 bg-white fixed top-2 left-2 select-none cursor-pointer rounded-md shadow-lg"
        onClick={() => navigate(-1)}
      >
        Go Back
      </div>
      {documentObject ? (
        <div ref={addEditor} id="editor-container"></div>
      ) : (
        <div>Loading</div>
      )}
      <div className="fixed top-0 right-0 p-6">
        {documentObject && (
          <div>
            <div className="mb-4">
              Owner: <br /> {documentObject.owner}
            </div>
            <div>
              <div>Editors:</div>
              {documentObject.editors.map((editor, indx) => (
                <div key={indx}>{editor}</div>
              ))}
            </div>
            {!isEditor && (
              <div
                className="bg-red-300 p-2 cursor-pointer my-4 text-sm"
                onClick={requestAccess}
              >
                Request Access
              </div>
            )}
          </div>
        )}
      </div>
      {showModal && (
        <Modal question={modalMessage} setResponse={responseFunction} />
      )}
    </div>
  );
}

export default TextEditor;
