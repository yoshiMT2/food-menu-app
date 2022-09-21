import React, { useEffect, useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import axios from "axios";
import { FORGOT_ENDPOINT } from "../utils/urls";

function ForgotPasswordPage() {
  const [formEmail, setFormEmail] = useState();
  const [buttonEnabled, setButtonEnabled] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [resetSuccess, setResetSuccess] = useState();

  useEffect(() => {
    if (formEmail) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  }, [formEmail]);

  const sendEmail = () => {
    const req_config = {
      headers: {
        "Content-type:": "application/json",
      },
    };
    const postRequest = async () => {
      try {
        const res = await axios.post(
          FORGOT_ENDPOINT,
          { email: formEmail },
          req_config
        );
        return res
      } catch (error) {
        setError(error);
      }
    };
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-100">
      <form
        className="p-10 bg-white rounded-xl drop-shadow-xl space-y-5"
        onSubmit={sendEmail}
      >
        <p className="text-center text-sm">パスワード再設定のリンクを送信</p>
        <InputField
          type="email"
          label="Email"
          value={formEmail}
          onChange={(e) => setFormEmail(e.target.value)}
        />
        <Button title="Reset Password" disabled={!buttonEnabled} />
      </form>
    </div>
  );
}
export default ForgotPasswordPage;
