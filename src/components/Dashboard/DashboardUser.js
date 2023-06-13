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

function DashboardUser() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    makeRequest("api/users/getAll", "GET", null, null, null, true)
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const confirmBlockTemporarily = (userId) => {
    setSelectedUserId(userId);
    setActionType("block_temporarily");
    setShowConfirmModal(true);
  };

  const confirmBlock = (userId) => {
    setSelectedUserId(userId);
    setActionType("block");
    setShowConfirmModal(true);
  };

  const confirmDelete = (userId) => {
    setSelectedUserId(userId);
    setActionType("delete");
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    // Appeler l'API appropriée pour effectuer l'action en fonction de actionType et selectedUserId
    // ...

    // Fermer le modal de confirmation
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
            <th className="py-2 px-4 bg-gray-200 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 w-1/12">{user.username}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4 w-1/12"></td>
              <td className="py-2 px-4 whitespace-no-wrap text-right text-sm leading-5 font-medium w-2/5">
                <button
                  className="transition duration-300 ease-in-out text-green-600 hover:text-green-900 border border-green-600 hover:border-green-900 rounded-md px-3 py-1 m-1 hover:bg-green-200"
                  onClick={() => {
                    confirmBlockTemporarily(user.id);
                    handleOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faUserCheck} className="mr-1" />
                  Actif
                </button>
                <button
                  className="transition duration-300 ease-in-out text-blue-600 hover:text-blue-900 border border-blue-600 hover:border-blue-900 rounded-md px-3 py-1 m-1 hover:bg-blue-200"
                  onClick={() => {
                    confirmBlockTemporarily(user.id);
                    handleOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  Bloquer temporairement
                </button>
                <button
                  className="transition duration-300 ease-in-out text-gray-600 hover:text-gray-900 border border-gray-600 hover:border-gray-900 rounded-md px-3 py-1 m-1 hover:bg-gray-200"
                  onClick={() => {
                    confirmBlock(user.id);
                    handleOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faLock} className="mr-1" />
                  Bloquer
                </button>
                <button
                  className="transition duration-300 ease-in-out text-red-600 hover:text-red-900 border border-red-600 hover:border-red-900 rounded-md px-3 py-1 m-1 hover:bg-red-200"
                  onClick={() => {
                    confirmDelete(user.id);
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
        open={open}
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
            Êtes-vous sûr de vouloir{" "}
            {actionType === "block_temporarily" && "bloquer temporairement"}
            {actionType === "block" && "bloquer"}
            {actionType === "delete" && "supprimer"} l'utilisateur ?
          </Typography>
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
