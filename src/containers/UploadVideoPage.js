import React, { useState,useContext } from "react";
import makeRequest from "../Utils/RequestUtils";
import { toast } from "react-toastify";
import { AuthContext } from "../Auth/authContext";
import Axios from "axios";

function UploadVideoPage() {

    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [showProgressBar, setProgressBarVisibility] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [state, setState] = useState("Public"); // État pour la valeur sélectionnée
  const [progress, setProgress] = useState(0);
  const {user} = useContext(AuthContext);
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

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleStateChange = (value) => {
    setState(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);
    formData.append("state", state);

    await makeRequest(
      "api/videos/upload",
      "POST",
      null,
      formData,
      null,
      true,
      onUploadProgress
    )
      .then((data) => {
        if (user) {
          localStorage.setItem(
            "toastMessage",
            JSON.stringify({
              status: "success",
              message: `Vidéo upload avec succès ${user.currentUser?.username} ! `,
            })
          );
          // Redirigez l'utilisateur vers la chaine
          window.location.href = `/channel/${user.currentUser?.username}`;
        }
      })
      .catch((error) => {
        console.log("user : " + error);
        toast.error(
          "Une erreur est survenue durant l'enregistrement, veuillez réessayer dans quelques minutes.",
          toastOptions
        );
      });


  
  };

  
  const onUploadProgress = (progressEvent) => {
    const progress = Math.round(
      (progressEvent.loaded / progressEvent.total) * 100
    );
    setProgress(progress);
  };

  return (
    <div className="p-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-5 mx-auto w-2/3"
      >
        <h1 className="text-2xl font-bold mb-4">Ajouter une vidéo</h1>
        <label className="block">
          <p className="font-bold">Confidentialité</p>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => handleStateChange("Public")}
              className={`border rounded-md py-2 px-4 ${
                state === "Public"
                  ? "bg-green-500 text-white"
                  : "bg-white text-green-500 border border-green-500"
              }`}
            >
              Public
            </button>
            <button
              type="button"
              onClick={() => handleStateChange("Unlisted")}
              className={`border rounded-md py-2 px-4 ${
                state === "Unlisted"
                  ? "bg-yellow-500 text-white"
                  : "bg-white text-yellow-500 border border-yellow-500"
              }`}
            >
              Non répertorié
            </button>
            <button
              type="button"
              onClick={() => handleStateChange("Private")}
              className={`border rounded-md py-2 px-4 ${
                state === "Private"
                  ? "bg-red-500 text-white"
                  : "bg-white text-red-500 border border-red-500"
              }`}
            >
              Privé
            </button>
          </div>
        </label>
        <label className="block">
          <p className="font-bold">Titre</p>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="border border-gray-400 rounded-md w-full p-2 mt-1"
          />
        </label>
        <label className="block">
          <p className="font-bold">Description</p>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            className="border border-gray-400 rounded-md w-full p-2 mt-1"
          />
        </label>
        <label className="block">
          <p className="font-bold">Fichier Vidéo</p>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="mt-1"
          />
        </label>
        <label className="block">
          <p className="font-bold">Miniature</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="mt-1"
          />
        </label>

        <button
          type="submit"
          className="bg-white border border-black text-black rounded-md py-2 px-4 mt-3 hover:bg-gray-300"
        >
          <p className="font-bold">Ajouter ma vidéo</p>
        </button>
      </form>
      <progress value={progress} max="100" />
    </div>
  );
}

export default UploadVideoPage;
