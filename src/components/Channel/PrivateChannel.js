import React, { useContext, useState, useEffect } from "react";

import AuthContext from "../../Auth/authContext";
import makeRequest from "../../Utils/RequestUtils";

import VideoTable from "./VideoTable";

export default function PrivateChannel({ userId }) {
  const [videos, setVideos] = useState(null);
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  // Exemple de récupération des vidéos depuis une API
  useEffect(() => {
    getUserVideo(userId);
  }, []);

  const getUserVideo = async (userId) => {
    await makeRequest(
      `api/videos/user/${userId}?page=${page}&perPage=${perPage}`,
      "GET",
      null,
      null,
      null,
      true
    )
      .then((data) => setVideos(data))
      .catch((error) => console.error(error));
  };

  // Fonction de suppression d'une vidéo
  const handleDelete = (videoId) => {
    makeRequest(`api/videos/delete/${videoId}`,"DELETE",null,null,null,true)
  };

  // Fonction de modification de l'état d'une vidéo
  const handleStateChange = async (videoId, newState) => {
    await makeRequest(
      `api/videos/state/${videoId}`,
      "PUT",
      null,
      { state: newState },
      null,
      true
    )
    getUserVideo(userId)
  };

  return (
    <div>
      <h1 className="text-2xl font-bold m-8">Mes Vidéos</h1>
      <VideoTable
        videos={videos}
        handleDelete={handleDelete}
        handleStateChange={handleStateChange}
      />
    </div>
  );
}
