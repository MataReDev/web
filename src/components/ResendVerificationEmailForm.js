import React, { useState } from "react";
import makeRequest from "../Utils/RequestUtils";
import { toast } from "react-toastify";

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

function checkEmail(email) {
  var re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const ResendVerificationEmail = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (checkEmail(email)) {
      const body = { email: email };
      makeRequest(
        "api/users/resendVerificationEmail",
        "POST",
        null,
        body,
        null,
        false
      )
        .then((data) => {
          if (data !== null) {
            toast.success(
              "An email was send to your address mail.",
              toastOptions
            );
          }
        })
        .catch((error) => console.error(error));

      setEmail("");
    } else {
      toast.error(
        "Invalid email, please use another email address",
        toastOptions
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-full pt-10">
      <form onSubmit={handleSubmit} className="w-1/2">
        <div className="mb-4">
          <div className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Adresse e-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Resend the verification email
          </button>
        </div>
      </form>
    </div>
  );
};
