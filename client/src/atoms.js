import { atom } from "recoil";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const userAtom = atom({
  key: "userAtom",
  default: "",
});

export const tokenAtom = atom({
  key: "tokenAtom",
  default: cookies.get("jwt_auth_token"),
});

export const documentsAtom = atom({
  key: "documentsAtom",
  default: [],
});
