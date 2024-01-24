import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "./atoms";
import axios from "axios";

export default function DocumentsPreviev({ documentObject }) {
  const username = useRecoilValue(userAtom);
  const [isEditing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(documentObject.title);
  const navigate = useNavigate();

  function goToPage() {
    navigate(`document/${documentObject["_id"]}`);
  }

  async function updateTitle() {
    if (!newTitle) {
      // setting back to old title
      setNewTitle(documentObject.title);
      setEditing(false);
      return;
    }

    try {
      await axios.post("/api/document/update-title", {
        documentId: documentObject["_id"],
        newTitle,
      });
      // success
      setEditing(false);
    } catch (err) {
      console.log("error in updating the title");
    }
  }

  useEffect(() => {
    const containerStyles =
      "bg-white text-[4px] min-h-48 min-w-36 absolute top-0 left-0 overflow-hidden";
    const container = document.getElementById(`quill-${documentObject["_id"]}`);
    container.innerHTML = "";
    const element = document.createElement("div");
    container.append(element);
    try {
      const quill = new Quill(element, { theme: "snow", readOnly: true });
      quill.setContents(documentObject.data);
      let previousClasses = container
        .querySelector(".ql-container")
        .getAttribute("class");
      container
        .querySelector(".ql-container")
        .setAttribute("class", `${previousClasses} ${containerStyles}`);
      container
        .querySelector(".ql-container")
        .setAttribute("style", `{border: none, overflow:hidden}`);
      container
        .querySelector(".ql-toolbar")
        .setAttribute("style", "display: none");
    } catch (err) {
      console.log(err);
    }
  });
  return (
    <div className="flex flex-col items-center cursor-pointer hover:bg-slate-300 mx-6 p-2 overflow-hidden relative">
      <div
        id={`quill-${documentObject["_id"]}`}
        className="h-48 w-36 relative overflow-hidden shadow-sm"
      ></div>
      <div
        className="h-[85%] w-full absolute top-0 left-0 bg-transparent z-10"
        onClick={goToPage}
      ></div>
      {isEditing ? (
        <input
          autoFocus
          type="text"
          placeholder="Title Value"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="outline-none border-none text-sm bg-transparent max-w-36 text-center"
          onBlur={updateTitle}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              updateTitle();
            }
          }}
        />
      ) : (
        <div
          className="text-sm"
          onClick={() => {
            if (username != documentObject.owner) return;
            setEditing(true);
          }}
        >
          {newTitle}
        </div>
      )}
    </div>
  );
}
