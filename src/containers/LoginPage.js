import React, { Component } from "react";
import { Helmet } from "react-helmet";

import LoginSignupForm from "../components/LoginSignupForm";

class LoginPage extends Component {
  render() {
    return (
      <div className="p-5">
        <Helmet>
          <meta charSet="utf-8" />
          <title>iSee - Login / Register</title>
        </Helmet>
        <h1 className="text-2xl font-bold mb-4">Login / Register</h1>
        <LoginSignupForm />

        <div className="text-center">
          <a
            href="/resetpassword"
            className="ml-4 inline-block hover:bg-gray-300 border border-black text-black py-2 px-4 rounded"
          >
            Forgot Password ?
          </a>
          <a
            href="/resendvericationemail"
            className="ml-4 inline-block hover:bg-gray-300 border border-black text-black py-2 px-4 rounded"
          >
            Resend Email
          </a>
        </div>
      </div>
    );
  }
}

export default LoginPage;
