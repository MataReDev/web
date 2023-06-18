import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import { Link } from "react-router-dom";

import { getUrl } from "../../Utils/GetUrl";

import {
  faEyeSlash,
  faLock,
  faGlobe,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const VideoTable = ({ videos, handleDelete, handleStateChange }) => {
  const handleShareVideo = (videoId, videoTitle) => {
    const defaultUrl = getUrl();

    if (navigator.share) {
      navigator
        .share({
          title: videoTitle,
          url: `${defaultUrl}video/${videoId}`,
        })
        .then(() => {
          // Vérifier si le lien a été partagé
          if (navigator.share) {
            toast.success("Video shared successfully");
          } else {
            // Le lien n'a pas été partagé
            toast.error("Error sharing video: Link not shared");
          }
        })
        .catch((error) => toast.error("Error sharing video:", error));
    } else {
      alert("Video sharing is not supported on this browser.");
    }
  };

  return (
    <div className="mx-10">
      <table className="min-w-full divide-y divide-gray-200 border solid border-gray-400 rounded-lg">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50">Video name</th>
            <th className="px-6 py-3 bg-gray-50">State</th>
            <th className="px-6 py-3 bg-gray-50">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {videos &&
            videos.map((video, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-no-wrap w-1/4">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm leading-5 font-medium text-gray-900">
                        <Link to={`/video/${video._id}`}>{video.title}</Link>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap w-1/4 text-center">
                  <span
                    className={`py-1 px-2 inline-flex leading-5  ${
                      video.state === "Unlisted"
                        ? "inline-block rounded bg-yellow-500 text-white"
                        : video.state === "Private"
                        ? "inline-block rounded bg-red-500 text-white"
                        : "inline-block rounded bg-green-500 text-white"
                    }`}
                  >
                    {video.state}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium w-1/2">
                  <button
                    onClick={() => handleShareVideo(video._id, video.title)}
                    className="text-gray-600 hover:text-black border border-gray-600 hover:border-black rounded-md px-3 py-1 m-1 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faShareAlt} className="mr-1" />
                    Share
                  </button>

                  <button
                    className="text-green-600 hover:text-green-900 border border-green-600 hover:border-green-900 rounded-md px-3 py-1 m-1 hover:bg-green-100"
                    onClick={() => handleStateChange(video._id, "Public")}
                  >
                    <FontAwesomeIcon icon={faGlobe} className="mr-1" />
                    Public
                  </button>
                  <button
                    className="text-yellow-600 hover:text-yellow-900 border border-yellow-600 hover:border-yellow-900 rounded-md px-3 py-1 m-1 hover:bg-yellow-100"
                    onClick={() => handleStateChange(video._id, "Unlisted")}
                  >
                    <FontAwesomeIcon icon={faEyeSlash} className="mr-1" />
                    Hide (Unlisted)
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-900 border border-gray-600 hover:border-gray-900 rounded-md px-3 py-1 m-1 hover:bg-gray-100"
                    onClick={() => handleStateChange(video._id, "Private")}
                  >
                    <FontAwesomeIcon icon={faLock} className="mr-1" />
                    Block (private)
                  </button>

                  <button
                    className="text-red-600 hover:text-red-900 border border-red-600 hover:border-red-900 rounded-md px-3 py-1 m-1 hover:bg-red-100"
                    onClick={() => handleDelete(video._id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default VideoTable;
