import React, { useContext, useState, useEffect } from "react";

import AuthContext from "../../Auth/authContext";
import makeRequest from "../../Utils/RequestUtils";

import VideoTable from "./PrivateVideoTable";

export default function PrivateChannel({ userId }) {
  const [videos, setVideos] = useState([]);

  // Exemple de récupération des vidéos depuis une API
  useEffect(() => {
    makeRequest(`api/videos/user/${userId}`, "GET", null, null, null, false)
      .then((data) => setVideos(data))
      .catch((error) => console.error(error));
  }, []);

  // Fonction de suppression d'une vidéo
  const handleDelete = (videoId) => {};

  // Fonction de modification de l'état d'une vidéo
  const handleStateChange = (videoId, newState) => {};

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
