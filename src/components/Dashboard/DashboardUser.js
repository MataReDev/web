import React, { useState, useEffect } from "react";
import makeRequest from "../../Utils/RequestUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faClock,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { Button, Modal, Box, Typography, TextField } from "@mui/material";

import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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

function DashboardUser() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [open, setOpen] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [blockDate, setBlockDate] = useState(null);

  useEffect(() => {
    getUser();

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
  }, []);

  const getUser = () => {
    makeRequest("api/users/getAll", "GET", null, null, null, true)
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => console.error(error));
  };

  const confirmBlockTemporarily = (userId) => {
    setSelectedUserId(userId);
    setActionType("block_temporarily");
    setShowConfirmModal(true);
    setBlockReason("");
    setBlockDate(null);
  };

  const confirmUnBlock = (userId) => {
    setSelectedUserId(userId);
    setActionType("unban");
    setShowConfirmModal(true);
  };

  const confirmBlock = (userId) => {
    setSelectedUserId(userId);
    setActionType("block");
    setShowConfirmModal(true);
    setBlockReason("");
    setBlockDate(null);
  };

  const confirmDelete = (userId) => {
    setSelectedUserId(userId);
    setActionType("delete");
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    switch (actionType) {
      case "unban":
        makeRequest(
          `api/users/unbanUser/${selectedUserId}`,
          "put",
          null,
          null,
          null,
          true
        )
          .then((data) => {
            getUser();
            toast.success(data.message);
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      case "block_temporarily":
        const tempBlockValues = {
          userId: selectedUserId,
          banUntil: blockDate?.$d.getTime(),
          banReason: blockReason,
        };
        makeRequest(
          "api/users/banUser",
          "POST",
          null,
          tempBlockValues,
          null,
          true
        )
          .then((data) => {
            getUser();
            toast.success(data.message);
          })
          .catch((error) => console.error(error));
        break;

      case "block":
        const defBlockValues = {
          userId: selectedUserId,
          banUntil: "9999-12-31",
          banReason: blockReason,
        };
        console.log(defBlockValues);
        makeRequest(
          "api/users/banUser",
          "POST",
          null,
          defBlockValues,
          null,
          true
        )
          .then((data) => {
            console.log("ok");
            getUser();
            toast.success(data.message);
          })
          .catch((error) => {
            console.log("error");
            console.error(error);
          });
        break;
      case "delete":
        makeRequest(
          `api/users/delete/${selectedUserId}`,
          "DELETE",
          null,
          null,
          null,
          true
        )
          .then((data) => {
            getUser();
            toast.success(data.message);
          })
          .catch((error) => console.error(error));
        break;
      default:
    }

    setShowConfirmModal(false);
    setSelectedUserId(null);
    setActionType("");
  };

  const handleCancelAction = () => {
    // Annuler l'action en cours
    setOpen(false);
    setShowConfirmModal(false);
    setSelectedUserId(null);
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
      <h2 className="text-2xl font-bold mb-4">Utilisateurs</h2>
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200 border-b">Nom</th>
            <th className="py-2 px-4 bg-gray-200 border-b">Email</th>
            <th className="py-2 px-4 bg-gray-200 border-b">Etat</th>
            <th className="py-2 px-4 bg-gray-200 border-b">Raison</th>
            <th className="py-2 px-4 bg-gray-200 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 w-1/12">{user.username}</td>
              <td className="py-2 px-4 w-auto">{user.email}</td>
              <td className="py-2 px-4 w-auto text-center">
                {user.banReason && user.banUntil ? (
                  new Date() > new Date(user.banUntil) ? (
                    <span className="inline-block py-1 px-2 rounded bg-green-500 text-white">
                      Actif : Banissement fini
                    </span>
                  ) : (
                    <span className="inline-block py-1 px-2 rounded bg-red-500 text-white">
                      Banni jusqu'au {new Date(user.banUntil).toLocaleString()}
                    </span>
                  )
                ) : (
                  <span className="inline-block py-1 px-2 rounded bg-green-500 text-white">
                    Actif
                  </span>
                )}
              </td>
              <td className="w-1/12">{user.banReason}</td>

              <td className="py-2 px-4 whitespace-no-wrap text-right text-sm leading-5 font-medium w-2/5">
                <button
                  className="transition duration-300 ease-in-out text-green-600 hover:text-green-900 border border-green-600 hover:border-green-900 rounded-md px-3 py-1 m-1 hover:bg-green-200"
                  onClick={() => {
                    confirmUnBlock(user._id);
                    handleOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faUserCheck} className="mr-1" />
                  Débannir
                </button>
                <button
                  className="transition duration-300 ease-in-out text-blue-600 hover:text-blue-900 border border-blue-600 hover:border-blue-900 rounded-md px-3 py-1 m-1 hover:bg-blue-200"
                  onClick={() => {
                    confirmBlockTemporarily(user._id);
                    handleOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  Ban temporairement
                </button>
                <button
                  className="transition duration-300 ease-in-out text-gray-600 hover:text-gray-900 border border-gray-600 hover:border-gray-900 rounded-md px-3 py-1 m-1 hover:bg-gray-200"
                  onClick={() => {
                    confirmBlock(user._id);
                    handleOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faLock} className="mr-1" />
                  Bannir
                </button>
                <button
                  className="transition duration-300 ease-in-out text-red-600 hover:text-red-900 border border-red-600 hover:border-red-900 rounded-md px-3 py-1 m-1 hover:bg-red-200"
                  onClick={() => {
                    confirmDelete(user._id);
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
            Confirmer l'action
          </Typography>
          <Typography id="modal-modal-description" sx={{ mb: 2 }}>
            Êtes-vous sûr de vouloir {actionType === "unban" && "débannir"}
            {actionType === "block_temporarily" && "bloquer temporairement"}
            {actionType === "block" && "bloquer"}
            {actionType === "delete" && "supprimer"} l'utilisateur ?
          </Typography>
          {(actionType === "block_temporarily" || actionType === "block") && (
            <>
              <TextField
                label="Motif du blocage"
                value={blockReason}
                onChange={(event) => setBlockReason(event.target.value)}
                sx={{ mb: 2 }}
              />
              {actionType === "block_temporarily" && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={blockDate}
                    onChange={(newValue) => {
                      setBlockDate(newValue);
                    }}
                  />
                </LocalizationProvider>
              )}
            </>
          )}
          <div className="mt-6 flex justify-end">
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmAction}
              sx={{ mr: 2 }}
            >
              Confirmer
            </Button>
            <Button variant="contained" onClick={handleCancelAction}>
              Annuler
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default DashboardUser;
