import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import makeRequest from "../../Utils/RequestUtils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { Button, Modal, Box, Typography } from "@mui/material";

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

function DashboardVideo() {
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [open, setOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    getVideos();

    const toastMessage = localStorage.getItem("toastMessage");

    if (toastMessage) {
      const { status, message } = JSON.parse(toastMessage);

      //const status = localStorage.getItem("status");

      const toastOptionsMap = {
        success: toast.success,
        warning: toast.warning,
        info: toast.info,
      };

      if (message && status && toastOptionsMap[status]) {
        const toastFunction = toastOptionsMap[status];
        toastFunction(message, {
          ...toastOptions,
          onClose: () => {
            localStorage.removeItem("toastMessage");
          },
        });
      }
    }
  }, [page, perPage]);

  const getVideos = () => {
    makeRequest(
      `api/videos/getAllAdmin?page=${page}&perPage=${perPage}`,
      "get",
      null,
      null,
      null,
      true
    )
      .then((data) => {
        setVideos(data);
      })
      .catch((error) => console.error(error));
  };

  const confirmBlock = (userId) => {
    setSelectedVideoId(userId);
    setActionType("block");
    setShowConfirmModal(true);
  };

  const confirmUnblock = (userId) => {
    setSelectedVideoId(userId);
    setActionType("unblock");
    setShowConfirmModal(true);
  };

  const confirmDelete = (userId) => {
    setSelectedVideoId(userId);
    setActionType("delete");
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    switch (actionType) {
      case "unblock":
        makeRequest(
          `api/videos/admin/unblock/${selectedVideoId}`,
          "put",
          null,
          null,
          null,
          true
        )
          .then((data) => {
            getVideos();
            toast.success(data.message);
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      case "block":
        makeRequest(
          `api/videos/admin/block/${selectedVideoId}`,
          "put",
          null,
          null,
          null,
          true
        )
          .then((data) => {
            getVideos();
            toast.success(data.message);
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      case "delete":
        makeRequest(
          `api/videos/admin/delete/${selectedVideoId}`,
          "delete",
          null,
          null,
          null,
          true
        )
          .then((data) => {
            getVideos();
            toast.success(data.message);
          })
          .catch((error) => {
            console.error(error);
          });
        break;
    }
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1) {
      setPage(newPage);
    }
  };

  const handlePerPageChange = (event) => {
    const newPerPage = parseInt(event.target.value);
    setPage(1);
    setPerPage(newPerPage);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Videos</h2>
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200 border-b w-1/5">Title</th>
            <th className="py-2 px-4 bg-gray-200 border-b w-1/2">
              Description
            </th>
            <th className="py-2 px-4 bg-gray-200 border-b w-1/12">Status</th>
            <th className="py-2 px-4 bg-gray-200 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos?.map((video, index) => (
            <tr key={index}>
              <td className="py-2 px-4 w-1/5">
                <Link to={`/video/${video._id}`}>{video.title}</Link>
              </td>
              <td className="py-2 px-4 w-1/2 ">{video.description}</td>
              <td className="py-2 px-4 w-1/12 text-center">
                {(() => {
                  switch (video.state) {
                    case "Public":
                      return (
                        <span className="inline-block py-1 px-2 rounded bg-green-500 text-white">
                          Public
                        </span>
                      );
                    case "Unlisted":
                      return (
                        <span className="inline-block py-1 px-2 rounded bg-yellow-500 text-white">
                          Unlisted
                        </span>
                      );
                    case "Private":
                      return (
                        <span className="inline-block py-1 px-2 rounded bg-red-500 text-white">
                          Private
                        </span>
                      );
                    case "Blocked":
                      return (
                        <span className="inline-block py-1 px-2 rounded bg-gray-500 text-white">
                          Blocked
                        </span>
                      );
                    default:
                      return null;
                  }
                })()}
              </td>

              <td className="py-2 px-4 whitespace-no-wrap text-right text-sm leading-5 font-medium w-auto">
                <button
                  className="mr-2 text-green-600 hover:text-green-900 border border-green-600 hover:border-green-900 rounded-md px-3 py-1 m-1 hover:bg-green-200"
                  onClick={() => {
                    confirmUnblock(video._id);
                    handleOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faLockOpen} className="mr-1" />
                  Unblock
                </button>
                <button
                  className="text-gray-600 hover:text-gray-900 border border-gray-600 hover:border-gray-900 rounded-md px-3 py-1 m-1 hover:bg-gray-200"
                  onClick={() => {
                    confirmBlock(video._id);
                    handleOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faLock} className="mr-1" />
                  Block
                </button>
                <button
                  className="text-red-600 hover:text-red-900 border border-red-600 hover:border-red-900 rounded-md px-3 py-1 m-1 hover:bg-red-200"
                  onClick={() => {
                    confirmDelete(video._id);
                    handleOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center gap-5 mt-4">
        <div>
          <Button
            variant="contained"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous Page
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            disabled={videos.length < perPage}
            onClick={() => handlePageChange(page + 1)}
          >
            Next Page
          </Button>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Items per page:</span>
          <select
            className="p-2"
            value={perPage}
            onChange={handlePerPageChange}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      <Modal
        open={showConfirmModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Confirm Action
          </Typography>
          <Typography id="modal-modal-description" sx={{ mb: 2 }}>
            Are you sure you want to
            {actionType === "unblock" && " unblock"}
            {actionType === "block" && " block"}
            {actionType === "delete" && " delete"} the video?
          </Typography>
          <div className="mt-6 flex justify-end">
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmAction}
              sx={{ mr: 2 }}
            >
              Confirm
            </Button>
            <Button variant="contained" onClick={handleCancelAction}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default DashboardVideo;
