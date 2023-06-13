import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Auth/authContext";

import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Upload, Progress, Modal } from "antd";
import ImgCrop from "antd-img-crop";

 function checkEmail(email) {
   var re =
     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email);
 }

function LoginForm() {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkEmail(email)) {
      login(email, password);
    } else {
      setErrorMessage(
        "Email non valide, merci d'utiliser une autre adresse e-mail"
      );
    }
  };

  const handleInputFocus = () => {
    setErrorMessage("");
  };
 const handleKeyDown = (event) => {
   if (event.key === "Enter") {
     if (event.preventDefault) {
       event.preventDefault();
     }
     handleSubmit(event);
   }
 };

  return (
    <div
      onKeyDown={handleKeyDown}
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
        {user.isAuthenticated ? (
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
  const { register, user } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logo, setLogo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const config = {
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };

    try {
      console.log(file);
      setLogo(file);

      onSuccess("Ok");
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  const handleOnChange = ({ file, fileList, event }) => {
    setDefaultFileList(fileList);
  };

  // -------------- PREVIEW --------------- //

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleCancel = () => setPreviewOpen(false);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  // -------------------------------------- //

  const handleSubmit = (e) => {
        e.preventDefault();
        if (checkEmail(email)) {
          register(username, email, password, logo);
        } else {
          setErrorMessage(
            "Email non valide, merci d'utiliser une autre adresse e-mail"
          );
        }    
  };

 const handleKeyDown = (event) => {
   if (event.key === "Enter") {
     if (event.preventDefault) {
       event.preventDefault();
     }
     handleSubmit(event);
   }
 };
  return (
    <div
      onKeyDown={handleKeyDown}
      className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4 text-center">
        <ImgCrop rotationSlider>
          <Upload
            accept="image/png, image/jpeg, image/jpg"
            name="logo"
            listType="picture-circle"
            showUploadList={true}
            onPreview={handlePreview}
            onChange={handleOnChange}
            defaultFileList={defaultFileList}
            customRequest={uploadImage}
            multiple={false}
            maxCount={1}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Avatar</div>
            </div>
          </Upload>
        </ImgCrop>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={""}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>

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
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
      </div>
      {user.isAuthenticated ? (
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
