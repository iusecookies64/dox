import React, { useState } from "react";
import FormPage from "./FormPage.jsx";
import { useRecoilValue } from "recoil";
import { userAtom } from "./atoms.js";
import Landing from "./Landing.jsx";

export default function Home() {
  const user = useRecoilValue(userAtom);
  if (user) {
    return <Landing />;
  } else {
    return <FormPage />;
  }
}
