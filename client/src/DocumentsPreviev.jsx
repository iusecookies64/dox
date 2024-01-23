import React, { useEffect, useState } from "react";
import Quill from "quill";
import { useNavigate } from "react-router-dom";

export default function DocumentsPreviev({ documentObject, indx }) {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  function goToPage() {
    navigate(`document/${documentObject["_id"]}`);
  }

  useEffect(() => {
    const containerStyles =
      "bg-white text-[4px] min-h-48 min-w-36 absolute top-0 left-0 overflow-hidden";
    const container = document.getElementById(`quill-${indx}`);
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
    <div
      className="flex flex-col items-center cursor-pointer hover:bg-slate-300 mx-6 p-2 overflow-hidden relative"
      onClick={goToPage}
    >
      <div
        id={`quill-${indx}`}
        className="h-48 w-36 relative overflow-hidden shadow-sm"
      ></div>
      <div className="h-full w-full absolute top-0 left-0 bg-transparent z-10"></div>
      <div className="text-sm">{documentObject.title}</div>
    </div>
  );
}
