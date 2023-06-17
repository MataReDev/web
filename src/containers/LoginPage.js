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
      </div>
    );
  }
}

export default LoginPage;
