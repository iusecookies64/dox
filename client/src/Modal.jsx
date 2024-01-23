import React from "react";

export default function Modal({ question, setResponse }) {
  return (
    <div className="fixed top-0 left-0 h-dvh w-dvw bg-black bg-opacity-50 z-50 flex items-center justify-center text-slate-700 select-none">
      <div className="px-6 py-4 bg-slate-100 text-xl shadow-lg animate-zoomin">
        <div className="mb-4 max-w-[350px]">{question}</div>
        <div className="flex w-full justify-between">
          <div
            className="cursor-pointer hover:bg-opacity-50 active:scale-[0.95]"
            onClick={() => setResponse(true)}
          >
            Yes
          </div>
          <div
            className="cursor-pointer hover:bg-opacity-50 active:scale-[0.95]"
            onClick={() => setResponse(false)}
          >
            No
          </div>
        </div>
      </div>
    </div>
  );
}
