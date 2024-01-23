import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { documentsAtom, tokenAtom, userAtom } from "./atoms";
import Cookies from "universal-cookie";
import axios from "axios";
import DocumentsPreviev from "./DocumentsPreviev";
import Quill from "quill";

export default function Landing() {
  const cookies = new Cookies();
  const user = useRecoilValue(userAtom);
  const setToken = useSetRecoilState(tokenAtom);
  const [documents, setDocuments] = useRecoilState(documentsAtom);

  function logout() {
    // handling logout
    cookies.set("jwt_auth_token", "");
    setToken("");
  }
  async function createDocument() {
    try {
      const container = document.getElementById("quill-container");
      const element = document.createElement("div");
      container.append(element);
      const quill = new Quill(element, { theme: "snow" });
      const response = await axios.post(
        "/api/document/create",
        quill.getContents()
      );
      setDocuments([response.data, ...documents]);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    // getting all the documents data from server
    axios
      .get("/api/all-documents")
      .then((response) => {
        setDocuments(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      {/* top bar start */}
      <div className="flex p-4 justify-between items-center bg-white shadow-lg">
        <div className="text-2xl font-extrabold">Dox</div>
        <div>
          Welcome, {user}{" "}
          <button>
            <i
              className="fa-solid fa-right-from-bracket text-xl mx-4"
              onClick={logout}
            ></i>
          </button>
        </div>
      </div>
      {/* top bar end */}
      <div className="p-4 text-lg">
        <div className="mb-4">Previous Documents</div>
        <div className="flex flex-wrap">
          <div className="flex flex-col items-center cursor-pointer hover:bg-slate-300 mx-6 p-2">
            <div
              onClick={createDocument}
              className="h-48 w-36 p-2 flex items-center justify-center border-2 border-black text-5xl text-black cursor-pointer "
            >
              +
            </div>
            <div className="text-sm">New Document</div>
          </div>
          {documents.map((documentObject, indx) => {
            return (
              <DocumentsPreviev
                key={indx}
                documentObject={documentObject}
                indx={indx}
              />
            );
          })}
          {/* dummy container */}
          <div id="quill-container" className="hidden"></div>
        </div>
      </div>
    </div>
  );
}
