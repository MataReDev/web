import React, { useState } from "react";
import makeRequest from "../Utils/RequestUtils";
import { toast } from "react-toastify";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
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

export const SendResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (checkEmail(email)) {
      const body = { email: email };
      makeRequest("api/users/forgetPassword", "POST", null, body, null, false)
        .then((data) => {
          if (data !== null) {
            toast.success(
              "An email was send to your address mail.",
              toastOptions
            );
          }
        })
        .catch((error) => console.error(error));

      setEmail(""); // Réinitialiser la valeur de l'e-mail après la soumission
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
            Réinitialiser le mot de passe
          </button>
        </div>
      </form>
    </div>
  );
};

export const SendNewPassword = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (props.token) {
        const token = props.token;
    const body = { password: password };

    makeRequest(
      `api/users/resetPassword/${token}`,
      "POST",
      null,
      body,
      null,
      false
    )
      .then((data) => {
        if (data !== null) {
        
             localStorage.setItem(
               "toastMessage",
               JSON.stringify({
                 status: "success",
                 message: `Your password has been changed`,
               })
             );
             window.location.href = "/login";
        }
      })
      .catch((error) => console.error(error));
    }
    else {
        toast.error("Invalid Url",toastOptions);
    }

  };

  return (
    <div className="flex justify-center items-center h-full pt-10">
      <form onSubmit={handleSubmit} className="w-1/2">
        <div className="bg-white shadow-lg rounded px-8 pt-6 pb-8 my-4">
          <label htmlFor="password" className="block text-black font-bold mb-2">
            New Password :
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 mr-2 mt-[34px] text-[#868686]"
          >
            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </button>
          <label htmlFor="password" className="block text-black font-bold mb-2">
            Confirm password :
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-0 top-0 mr-2 mt-[34px] text-[#868686]"
          >
            {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-white hover:bg-gray-300 border border-black focus:border-black active:bg-gray-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};
