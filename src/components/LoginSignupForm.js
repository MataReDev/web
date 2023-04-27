import React, { useEffect, useState } from "react";
import axios from "axios";

import { getAuthToken, saveAuthToken } from "../Auth/authContext";

function LoginForm() {
  const [authToken, setAuthToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setAuthToken(getAuthToken());
  }, [getAuthToken()]);

  function checkEmail(email) {
    var re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkEmail(email)) {
      axios
        .post("https://iseevision.fr/api/users/login", {
          email: email.toString(),
          password: password.toString(),
        })
        .then((response) => {
          saveAuthToken(response.data.token);
          setAuthToken(getAuthToken());
           const returnUrl = new URLSearchParams(window.location.search).get("returnUrl");
           if (returnUrl) {
             window.location.href = returnUrl;
           } else {
             // Redirigez l'utilisateur vers la page d'accueil s'il n'y a pas de returnUrl
             window.location.href = "/";
           }
        })
        .catch((error) => {
          console.log(error);
          setErrorMessage("Email ou mot de passe incorrect");
          setPassword("");
          
        });
    }
    else 
    {
      setErrorMessage("Email non reconnu, merci d'utiliser une autre adresse e-mail");
    }
  };

  const handleInputFocus = () => {
    setErrorMessage("");
  };

  return (
    <div
      className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <label htmlFor="email" className="block text-black font-bold mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleInputFocus}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-black font-bold mb-2">
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={handleInputFocus}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      <div>
        {authToken ? (
          <p>Vous êtes connecté !</p>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-white hover:bg-gray-300 border border-black focus:border-black active:bg-gray-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

function SignupForm() {
  const [authToken, setAuthToken] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  
  useEffect(() => {
    setAuthToken(getAuthToken());
  }, [getAuthToken()]);

  const handleSubmit = () => {
    axios
      .post("https://iseevision.fr/api/users/register", {
        email: email.toString(),
        username: username.toString(),
        password: password.toString(),
        isAdmin: false,
      })
      .then((response) => {
        saveAuthToken(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-700 font-bold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {authToken ? (
        <p>Vous êtes connecté !</p>
      ) : (
        <button
          onClick={handleSubmit}
          className="bg-white hover:bg-gray-300 border border-black focus:border-black active:bg-gray-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center"
        >
          Signup
        </button>
      )}
    </div>
  );
}

function LoginSignupForm() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="flex justify-center items-center h-full pt-10">
      <div className="w-1/2">
        <div className="mb-4">
          <button
            onClick={() => setActiveTab("login")}
            disabled={activeTab === "login"}
            className={`px-4 py-2 text-black border ${
              activeTab === "login"
                ? "border-black border-2 bg-gray-200"
                : "bg-white border-black"
            } rounded mr-2`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            disabled={activeTab === "signup"}
            className={`px-4 py-2 text-black border ${
              activeTab === "signup"
                ? "border-black border-2 bg-gray-200"
                : "bg-white border-black"
            } rounded`}
          >
            Signup
          </button>
        </div>
        {activeTab === "login" ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
}
export default LoginSignupForm;
