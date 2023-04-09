import React, { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // logic to submit form data
  };

  return (
    <form
      onSubmit={handleSubmit}
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
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-black font-bold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        className="bg-white hover:bg-gray-300 border border-black focus:border-black active:bg-gray-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center"
      >
        Login
      </button>
    </form>
  );
}

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // logic to submit form data
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
      <button
        type="submit"
        className="bg-white hover:bg-gray-300 border border-black focus:border-black active:bg-gray-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center"
      >
        Signup
      </button>
    </form>
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
            className={`px-4 py-2 text-black border ${activeTab === 'login' ? 'border-black border-2 bg-gray-200' : 'bg-white border-black'} rounded mr-2`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            disabled={activeTab === "signup"}
            className={`px-4 py-2 text-black border ${activeTab === 'signup' ? 'border-black border-2 bg-gray-200' : 'bg-white border-black'} rounded`}
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