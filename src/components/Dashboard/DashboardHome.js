import React, { useState, useEffect } from "react";
import makeRequest from "../../Utils/RequestUtils";

import VideoChart from "./VideoChart"

function DashboardHome() {
  const [userCount, setUserCount] = useState("");
  const [videoCount, setVideoCount] = useState("");
  const [videoTotalSize, setVideoTotalSize] = useState("");
  const [videos, setVideos] = useState([]);
  

  const formatSize = (size) => {
    if (size < 1024) {
      return size + " octets";
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + " Ko";
    } else if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + " Mo";
    } else if (size < 1024 * 1024 * 1024 * 1024) {
      return (size / (1024 * 1024 * 1024)).toFixed(2) + " Go";
    } else {
      return (size / (1024 * 1024 * 1024 * 1024)).toFixed(2) + " To";
    }
  }
  

  useEffect(() => {
    getVideos();
    makeRequest("api/dashboard/getNbUser", "GET", null, null, null, true)
      .then((data) => {
        setUserCount(data.nbUsers);
      })
      .catch((error) => console.error(error));

    makeRequest("api/dashboard/getNbVideoUpload", "GET", null, null, null, true)
      .then((data) => {
        setVideoCount(data.nbVideos);
      })
      .catch((error) => console.error(error));

    makeRequest("api/dashboard/getSizeVideoUpload", "GET", null, null, null, true)
      .then((data) => {
        setVideoTotalSize(formatSize(data.totalSize))
      })
      .catch((error) => console.error(error))
  }, []);

  
  const getVideos = () => {
    makeRequest("api/videos/getAllAdmin", "GET", null, null, null, true)
      .then((data) => {
        setVideos(data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between gap-4 p-5">
        <div className="bg-white rounded-md shadow-md p-5 w-full md:w-1/3">
          <h2 className="text-lg font-bold mb-3">Comptes utilisateurs</h2>
          <p className="text-4xl font-bold">{userCount}</p>
        </div>
        <div className="bg-white rounded-md shadow-md p-5 w-full md:w-1/3">
          <h2 className="text-lg font-bold mb-3">Vidéos</h2>
          <p className="text-4xl font-bold">{videoCount}</p>
        </div>
        <div className="bg-white rounded-md shadow-md p-5 w-full md:w-1/3">
          <h2 className="text-lg font-bold mb-3">
            Taille vidéo totale
            <p className="text-4xl font-bold">{videoTotalSize}</p>
          </h2>
        </div>
      </div>
      <div className="p-10 bg-white rounded-md shadow-lg w-full">
        <VideoChart videos={videos}/>
      </div>
    </div>
  );
}

export default DashboardHome;
