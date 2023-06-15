import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import makeRequest from "../Utils/RequestUtils";
import secureLocalStorage from "react-secure-storage";
import { PlusOutlined, LoadingOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Upload, Modal } from "antd";
import ImgCrop from "antd-img-crop";

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
  const [logo, setLogo] = useState(null);

  const [defaultFileList, setDefaultFileList] = useState([]);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
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
    const formData = new FormData();

    formData.append("username", username);
    formData.append("email", email);
    formData.append("logo", logo);

    if (password) formData.password = password;

    makeRequest(`api/users/update`, "PUT", null, formData, null, true)
      .then((data) => {
        toast.success(
          `Ton profil a bien été mit à jour ${username} :)`,
          toastOptions
        );
        setTimeout(() => {
          window.location.reload(); // Reload the page after 3 seconds
        }, 4000);
      })
      .catch((error) => {
        toast.error(
          `Une erreur est survenu lors de la mise à jour de ton profil, Veuillez réessayer.. ${error.message}`,
          toastOptions
        );
      });
  };

  const uploadImage = async (options) => {
    const { onSuccess, onError, file } = options;

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

  return (
    <div className="max-w-xl mx-auto my-4 p-4 bg-white rounded-md">
      <Helmet>
        <meta charSet="utf-8" />
        <title>iSee - Profile</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">Profile Page</h1>
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
      <div className="mb-4 relative">
        <label className="block font-medium mb-2">Password:</label>
        <input
          className="px-4 py-2 rounded-lg border border-gray-300 w-full"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-0 top-0 mr-2 mt-[36px] text-[#868686]"
        >
          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </button>
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
