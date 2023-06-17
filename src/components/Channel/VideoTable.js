import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import { faEyeSlash, faLock, faGlobe } from "@fortawesome/free-solid-svg-icons";

const VideoTable = ({ videos, handleDelete, handleStateChange }) => {
  return (
    <div className="mx-10">
      <table className="min-w-full divide-y divide-gray-200 border solid border-gray-400 rounded-lg">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Video name
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              State
            </th>
            <th className="px-6 py-3 bg-gray-50">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {videos &&videos.map((video, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-no-wrap w-1/4">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      {video.title}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap w-1/4">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    video.state === "Unlisted"
                      ? "bg-yellow-100 text-yellow-800"
                      : video.state === "Private"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {video.state}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium w-1/2">
                <button
                  className="text-green-600 hover:text-green-900 border border-green-600 hover:border-green-900 rounded-md px-3 py-1 m-1 hover:bg-green-100"
                  onClick={() => handleStateChange(video._id, "Public")}
                >
                  <FontAwesomeIcon icon={faGlobe} className="mr-1" />
                  Public
                </button>
                <button
                  className="text-indigo-600 hover:text-indigo-900 border border-indigo-600 hover:border-indigo-900 rounded-md px-3 py-1 m-1 hover:bg-indigo-100"
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
