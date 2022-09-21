import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import {login} from "../utils/AuthService"

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    if (email && password) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  }, [email, password, buttonEnabled]);

  const loginUser = async () => {
    try {
      await login(email, password);
      navigate('/')
      window.location.reload(false)
    } catch (error) {
      setErrorMessage(error)
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-100">
      <form
        className="p-10 bg-white rounded-xl drop-shadow-xl space-y-3"
        onSubmit={submitHandler}
      >
        <h1 className="text-blue-700 text-3xl text-center">Sign In</h1>
        <p
          className={`text-red-600 text-sm text-center ${
            errorMessage ? "opacity-100" : "opacity-0"
          }`}
        >
          emailかパスワードが間違っています
        </p>
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <a
          href="/forgot/"
          className="mt-2 text-sm font-semibold text-indigo-500 hover:text-indigo-700"
        >
          Forgot password?
        </a>
        <Button title="Login" disabled={!buttonEnabled} />
      </form>
    </div>
  );
}

export default LoginPage;
