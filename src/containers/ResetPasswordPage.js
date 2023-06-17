import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  SendResetPassword,
  SendNewPassword,
} from "../components/ResetpasswordForm";
import { Helmet } from "react-helmet";
import AnimatedLogo from "../components/Loading";
const toastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

const ResetPasswordPage = () => {
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      setToken(token);
    }
    setLoading(false);
  }, []);

  return (
    <div className="p-5">
      <Helmet>
        <meta charSet="utf-8" />
        <title>iSee - Forgot Password</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      {loading ? (
        <AnimatedLogo />
      ) : (
        <> {!token ? <SendResetPassword /> : <SendNewPassword token={token} />}</>
      )}
    </div>
  );
};

export default ResetPasswordPage;
