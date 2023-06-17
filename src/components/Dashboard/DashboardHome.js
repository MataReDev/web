import React, { useState, useEffect } from "react";
import makeRequest from "../../Utils/RequestUtils";
import { Link } from "react-router-dom";

import VideoChart from "./VideoChart";

const DashboardHome = ({ setActiveTab }) => {
  const [userCount, setUserCount] = useState("");
  const [videoCount, setVideoCount] = useState("");
  const [videoTotalSize, setVideoTotalSize] = useState("");
  const [videos, setVideos] = useState([]);

  const formatSize = (size) => {
    if (size < 1024) {
      return size + " bytes";
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + " KB";
    } else if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + " MB";
    } else if (size < 1024 * 1024 * 1024 * 1024) {
      return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    } else {
      return (size / (1024 * 1024 * 1024 * 1024)).toFixed(2) + " TB";
    }
  };

  useEffect(() => {
    getVideos();
    makeRequest("api/dashboard/getNbUser", "GET", null, null, null, true)
      .then((data) => {
        if (data !== null) setUserCount(data.nbUsers);
      })
      .catch((error) => console.error(error));

    makeRequest("api/dashboard/getNbVideoUpload", "GET", null, null, null, true)
      .then((data) => {
        if (data !== null) setVideoCount(data.nbVideos);
      })
      .catch((error) => console.error(error));

    makeRequest(
      "api/dashboard/getSizeVideoUpload",
      "GET",
      null,
      null,
      null,
      true
    )
      .then((data) => {
        if (data !== null) setVideoTotalSize(formatSize(data.totalSize));
      })
      .catch((error) => console.error(error));
  }, []);

  const getVideos = () => {
    makeRequest("api/videos/getAllAdmin", "GET", null, null, null, true)
      .then((data) => {
        if (data !== null) setVideos(data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between gap-4 pb-5">
        <div
          className="bg-gray-100 rounded-lg shadow-lg p-5 w-full md:w-1/3 text-center"
          onClick={() => setActiveTab("users")}
        >
          <h2 className="text-lg font-bold mb-3">User Accounts</h2>
          <p className="text-4xl font-bold">{userCount}</p>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-lg p-5 w-full md:w-1/3 text-center"
          onClick={() => setActiveTab("videos")}>
          <h2 className="text-lg font-bold mb-3">Videos</h2>
          <p className="text-4xl font-bold">{videoCount}</p>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-lg p-5 w-full md:w-1/3 text-center">
          <h2 className="text-lg font-bold mb-3">
            Total Video Size
            <p className="text-4xl font-bold">{videoTotalSize}</p>
          </h2>
        </div>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg shadow-lg w-full">
        <VideoChart videos={videos} />
      </div>
    </div>
  );
};

export default DashboardHome;
