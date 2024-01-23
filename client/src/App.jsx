import { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import { userAtom, tokenAtom, documentsAtom } from "./atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function App() {
  const setUser = useSetRecoilState(userAtom);
  const token = useRecoilValue(tokenAtom);
  axios.defaults.baseURL = "https://dox.iusecookies64.xyz";
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.headers.get["Content-Type"] =
    "application/x-www-form-urlencoded";

  useEffect(() => {
    console.log("running the thing");
    try {
      // decoding token, this also checks if token is valid or not
      const decoded = jwtDecode(token);
      // adding token to axios headers
      axios.defaults.headers.common["authorization"] = token;
      // set user data from decoded
      setUser(decoded.username);
    } catch (err) {
      setUser("");
      console.log("Invalid token");
    }
  }, [token]);

  return (
    <div className="min-h-dvh min-w-dvw bg-slate-100 print:bg-transparent">
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/document/:id" element={<TextEditor />} />
      </Routes>
    </div>
  );
}

export default App;
