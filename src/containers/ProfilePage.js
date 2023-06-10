import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import makeRequest from "../Utils/RequestUtils";
import secureLocalStorage from "react-secure-storage";

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

function ProfilePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleProfileImageChange = function (event) {
    setProfileImage(URL.createObjectURL(event.target.files[0]));
  };

  function checkLocalStorage() {
    const storedValue = secureLocalStorage.getItem("user");

    if (storedValue === null) {
      return false;
    }

    setUsername(storedValue.username);
    setEmail(storedValue.email);

    return true;
  }

  useEffect(() => {
    checkLocalStorage();
  }, []);

  const handleSave = () => {
    const body = {
      username: username,
      email: email,
    };

    if (password) body.password = password;
    
    makeRequest(`api/users/update`, "PUT", null, body, null, true)
      .then((data) => {
        toast.error(
          `Ton profil a bien été mit à jour ${data.username} :)`,
          toastOptions
        );
      })
      .catch((error) => {
        toast.error(
          `Une erreur est survenu lors de la mise à jour de ton profil, Veuillez réessayer.. ${error.message}`,
          toastOptions
        );
      });

  };

  return (
    <div className="max-w-xl mx-auto my-4 p-4 bg-white rounded-md">
      <Helmet>
        <meta charSet="utf-8" />
        <title>iSee - Profile</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">Profile Page</h1>
      <div className="mb-4">
        <label className="block font-medium mb-2">Username:</label>
        <input
          className="px-4 py-2 rounded-lg border border-gray-300 w-full"
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Email:</label>
        <input
          className="px-4 py-2 rounded-lg border border-gray-300 w-full"
          type="email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Password:</label>
        <input
          className="px-4 py-2 rounded-lg border border-gray-300 w-full"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Profile Image:</label>
        <input
          className="hidden"
          type="file"
          onChange={handleProfileImageChange}
        />
        <div className="flex items-center">
          <button
            className="bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-medium mr-2"
            onClick={""}
          >
            Choose Image
          </button>
          <div>
            {profileImage && (
              <img
                src={profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
            )}
          </div>
        </div>
      </div>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={handleSave}
      >
        Save Changes
      </button>
    </div>
  );
}

export default ProfilePage;
