import React, { Component } from "react";
import LoginSignupForm from "../components/LoginSignupForm";

class LoginPage extends Component {
  render() {
    return (
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4">Connexion / Inscription</h1>
        <LoginSignupForm />
      </div>
    );
  }
}

export default LoginPage;
