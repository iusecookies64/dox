import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { tokenAtom } from "./atoms";
import axios from "axios";
import Cookies from "universal-cookie";

export default function FormPage() {
  const setToken = useSetRecoilState(tokenAtom);
  const cookies = new Cookies();
  const [login, setLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [invalidCredentials, setInvalidCredentials] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  function resetForm() {
    setFormData({ email: "", username: "", password: "" });
    setFormErrors({ email: "", username: "", password: "" });
  }

  function changeForm() {
    resetForm();
    setLogin(!login);
  }

  function inputChangeHandler(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function validateInput(e) {
    const { name, value } = e.target;
    if (name == "email") {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      // testing whether input is valid or not or not
      if (regex.test(value)) {
        console.log("email is valid");
        setFormErrors((formErrors) => {
          return { ...formErrors, email: "" };
        });
      } else {
        setFormErrors((formErrors) => {
          return { ...formErrors, email: "Enter a Valid Email" };
        });
      }
    } else if (name == "username") {
      if (!value) {
        setFormErrors((formErrors) => {
          return { ...formErrors, username: "Username is required" };
        });
      } else {
        setFormErrors((formErrors) => {
          return { ...formErrors, username: "" };
        });
      }
    } else {
      const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (regex.test(value)) {
        setFormErrors((formErrors) => {
          return { ...formErrors, password: "" };
        });
      } else {
        setFormErrors((formErrors) => {
          return {
            ...formErrors,
            password:
              "Password must be alteast 6 characters long and must contain atleast 1 capital letter and number",
          };
        });
      }
    }
  }

  async function submitHandler(e) {
    e.preventDefault();
    // checking if all inputs are valid
    const { email, username, password } = formErrors;
    if (email || username || password) return;
    if (login) {
      try {
        const response = await axios.post("/api/user/signin", formData);
        cookies.set("jwt_auth_token", response.data.token);
        setToken(response.data.token);
      } catch (err) {
        setInvalidCredentials("Invalid Credentials");
      }
    } else {
      try {
        await axios.post("/api/user/signup", formData);
        resetForm();
        setLogin(true);
        setSignupSuccess("Account Created Successfully, Now Log In");
        setTimeout(() => setSignupSuccess(""), 5000);
      } catch (err) {
        console.log("error in creating account");
      }
    }
  }

  return (
    <div className="min-h-dvh min-w-full flex flex-col md:flex-row items-center justify-start md:justify-evenly">
      <div>
        <h2 className="text-5xl mt-10 mb-48 md:my-6 font-extrabold underline">
          Dox
        </h2>
        <p className="hidden md:block">
          An easy to use collaborative document editing platform
        </p>
      </div>
      {login ? (
        <div className="bg-white shadow-lg flex flex-col items-center justify-center p-10">
          <div className="text-xl font-bold mb-6">Log In</div>
          <form className="flex flex-col items-center" onSubmit={submitHandler}>
            <input
              className="outline-none border-b-[1px] p-2 mb-2"
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={inputChangeHandler}
              onBlur={validateInput}
            />
            {formErrors.username && (
              <div className="text-sm text-red-700">{formErrors.username}</div>
            )}
            <input
              className="outline-none  border-b-[1px] p-2 mb-4"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={inputChangeHandler}
              onBlur={validateInput}
            />
            {formErrors.password && (
              <div className="text-sm text-red-700 max-w-60 mb-4">
                {formErrors.password}
              </div>
            )}
            <button className="px-4 py-2 mb-4 shadow-sm active:scale-95">
              Log In
            </button>
            {invalidCredentials && (
              <div className="text-sm text-red-700 max-w-60 mb-4">
                {invalidCredentials}
              </div>
            )}
            {signupSuccess && (
              <div className="text-sm text-green-500 max-w-60 mb-4">
                {signupSuccess}
              </div>
            )}
          </form>
          <div>
            <span className="text-slate-500 mr-2">Don't Have an Account?</span>{" "}
            <button onClick={changeForm}>Sign Up</button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg flex flex-col items-center justify-center p-10">
          <div className="text-xl font-bold mb-6">Create New Account</div>
          <form className="flex flex-col items-center" onSubmit={submitHandler}>
            <input
              className="outline-none border-b-[1px] p-2 mb-2"
              type="text"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={inputChangeHandler}
              onBlur={validateInput}
            />
            {formErrors.email && (
              <div className="text-sm text-red-700">{formErrors.email}</div>
            )}
            <input
              className="outline-none border-b-[1px] p-2 mb-2"
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={inputChangeHandler}
              onBlur={validateInput}
            />
            {formErrors.username && (
              <div className="text-sm text-red-700">{formErrors.username}</div>
            )}
            <input
              className="outline-none  border-b-[1px] p-2 mb-4"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={inputChangeHandler}
              onBlur={validateInput}
            />
            {formErrors.password && (
              <div className="text-sm text-red-700 max-w-60 mb-4">
                {formErrors.password}
              </div>
            )}
            <button className="px-4 py-2 mb-4 shadow-sm active:scale-95">
              Sign Up
            </button>
          </form>
          <div>
            <span className="text-slate-500 mr-2">
              Already Have an Account?
            </span>
            <button onClick={changeForm}>Log In</button>
          </div>
        </div>
      )}
    </div>
  );
}
