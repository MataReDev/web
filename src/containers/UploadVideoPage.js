import React, { useState } from "react";
import makeRequest from '../Utils/RequestUtils'
import { toast } from "react-toastify";

function UploadVideoPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);

    await makeRequest("api/videos/upload", "POST", null, formData, null, true)
      .then((data) => {
        const { user } = data;
        if (user) {
          localStorage.setItem(
            "toastMessage",
            JSON.stringify({
              status: "success",
              message: `Vidéo upload avec succès ${user.username} ! `,
            })
          );
          // Redirigez l'utilisateur vers la page de login
          window.location.href = "/login";
        }
      })
      .catch((error) => {
        console.log("user : " + error);
        toast.error(
          "Une erreur est survenu durant l'enregistrement, veuillez retentez dans quelques minutes.",
          toastOptions
        );
      });
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Ajouter une vidéo</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 ">
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
          <input type="file" accept="video/*" onChange={handleVideoChange} className="mt-1" />
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
    </div>
  );
}

export default UploadVideoPage;
