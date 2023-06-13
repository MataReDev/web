import React, { useState, useEffect } from "react";
import makeRequest from "../../Utils/RequestUtils";

import { Button, Modal, Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faClock,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

function DashboardVideo() {
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [open, setOpen] = useState(false);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    makeRequest("api/videos/getAllAdmin", "GET", null, null, null, true)
      .then((data) => {
        setVideos(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const confirmBlockTemporarily = (userId) => {
    setSelectedVideoId(userId);
    setActionType("block_temporarily");
    setShowConfirmModal(true);
  };

  const confirmBlock = (userId) => {
    setSelectedVideoId(userId);
    setActionType("block");
    setShowConfirmModal(true);
  };

  const confirmDelete = (userId) => {
    setSelectedVideoId(userId);
    setActionType("delete");
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    // Appeler l'API appropriée pour effectuer l'action en fonction de actionType et selectedUserId
    // ...

    // Fermer le modal de confirmation
    setShowConfirmModal(false);
    setSelectedVideoId(null);
    setActionType("");
  };

  const handleCancelAction = () => {
    // Annuler l'action en cours
    setOpen(false);
    setShowConfirmModal(false);
    setSelectedVideoId(null);
    setActionType("");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Vidéos</h2>
      <table>
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200 border-b">Titre</th>
            <th className="py-2 px-4 bg-gray-200 border-b">Description</th>
            <th className="py-2 px-4 bg-gray-200 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos?.map((video) => (
            <tr key={video.id}>
              <td className="py-2 px-4">{video.title}</td>
              <td className="py-2 px-4">{video.description}</td>
              <td className="py-2 px-4 whitespace-no-wrap text-right text-sm leading-5 font-medium w-2/5">
                <button
                  className="mr-2 text-green-600 hover:text-green-900 border border-green-600 hover:border-green-900 rounded-md px-3 py-1 m-1 hover:bg-green-200"
                  onClick={() => {
                    confirmBlockTemporarily(video._id);
                    handleOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faUserCheck} className="mr-1" />
                  Actif
                </button>
                <button
                  className="mr-2 text-blue-600 hover:text-blue-900 border border-blue-600 hover:border-blue-900 rounded-md px-3 py-1 m-1 hover:bg-blue-200"
                  onClick={() => {
                    confirmBlockTemporarily(video._id);
                    handleOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  Bloquer temporairement
                </button>
                <button
                  className="text-gray-600 hover:text-gray-900 border border-gray-600 hover:border-gray-900 rounded-md px-3 py-1 m-1 hover:bg-gray-200"
                  onClick={() => {
                    confirmBlock(video._id);
                    handleOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faLock} className="mr-1" />
                  Bloquer
                </button>
                <button
                  className="text-red-600 hover:text-red-900 border border-red-600 hover:border-red-900 rounded-md px-3 py-1 m-1 hover:bg-red-200"
                  onClick={() => {
                    confirmDelete(video._id);
                    handleOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardVideo;
