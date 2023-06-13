import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as faThumbsUpFull,
  faThumbsDown as faThumbsDownFull
} from "@fortawesome/free-solid-svg-icons";
import {
  faThumbsUp as faThumbsUpEmpty,
  faThumbsDown as faThumbsDownEmpty,
  faTrashAlt as faTrashAltEmpty,
} from "@fortawesome/free-regular-svg-icons";

import { AuthContext } from "../../Auth/authContext";
import makeRequest from "../../Utils/RequestUtils";

function Commentaires({ videoId }) {
  const [commentaire, setCommentaire] = useState("");
  const [commentaires, setCommentaires] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchCommentaires(videoId);
  }, [videoId]);

  const fetchCommentaires = async () => {
    await makeRequest(
      `api/comments/video/${videoId}`,
      "GET",
      null,
      null,
      null,
      false
    )
      .then((data) => {
        setCommentaires(data);
      })
      .catch((error) => console.error(error));
  };

  const handleCommentaireSubmit = async (event) => {
    event.preventDefault();
    if (commentaire && user.isAuthenticated) {
      const body = {
        videoId: videoId,
        content: commentaire,
      };

      await makeRequest("api/comments/add", "POST", null, body, null, true)
        .then((data) => {
          setCommentaires([...commentaires, data]);
        })
        .catch((error) => console.error(error));
    } else {
      alert("Veuillez vous connecter !");
    }
  };

  const updateCommentaire = (updatedCommentaire) => {
    const updatedCommentaires = commentaires.map((commentaire) =>
      commentaire._id === updatedCommentaire._id
        ? updatedCommentaire
        : commentaire
    );
    setCommentaires(updatedCommentaires);
  };

  const handleLikeCommentaire = (commentId) => {
    if (user.isAuthenticated) {
      makeRequest(
        `api/comments/like/${commentId}`,
        "PUT",
        null,
        null,
        null,
        true
      )
        .then((data) => {
          updateCommentaire(data);
        })
        .catch((error) => console.error(error));
    } else {
      alert("Veuillez vous connectez !");
    }
  };

  const handleDislikeCommentaire = (commentId) => {
    if (user.isAuthenticated) {
      makeRequest(
        `api/comments/dislike/${commentId}`,
        "PUT",
        null,
        null,
        null,
        true
      )
        .then((data) => {
          updateCommentaire(data);
        })
        .catch((error) => console.error(error));
    } else {
      alert("Veuillez vous connectez !");
    }
  };

  const handleDeleteCommentaire = (commentId) => {
    if (user.isAuthenticated) {
      makeRequest(
        `api/comments/delete/${commentId}`,
        "DELETE",
        null,
        null,
        null,
        true
      )
        .then((data) => {
          const updatedCommentaires = commentaires.filter(
            (commentaire) => commentaire._id !== commentId
          );
          setCommentaires(updatedCommentaires);
        })
        .catch((error) => console.error(error));
    } else {
      alert("Veuillez vous connectez !");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.toLocaleDateString();
    const hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    return `${day} - ${hours}:${minutes}`;
  };

  return (
    <div className="p-2 rounded-xl h-full">
      <h1 className="font-bold">Commentaires</h1>
      <div className="flex flex-col gap-2">
        Ajouter un Commentaire :
        <div className="flex gap-5">
          <input
            type="text"
            value={commentaire}
            onChange={(event) => setCommentaire(event.target.value)}
            className="bg-gray-200 w-3/4 rounded-xl p-2"
            placeholder="Ecrivez du texte ici ..."
          />
          <input
            value="Envoyer"
            type="submit"
            onClick={(event) => handleCommentaireSubmit(event)}
            className="w-1/4 rounded-xl border border-black hover:bg-gray-200"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 pt-2 mt-4 ">
        {commentaires &&
          commentaires.map(
            (commentaire, index) => (
              (
                <div
                  key={`${commentaire._id}-${index}`}
                  className="p-2 rounded-xl bg-gray-200"
                >
                  <div className="flex justify-between">
                    <div className="flex text-sm gap-2">
                      <div className="font-bold">
                        {commentaire.userId.username}
                      </div>
                      {formatTimestamp(commentaire.createdAt)}
                    </div>

                    <div
                      name="action-button"
                      className="flex gap-2 text-sm font-bold h-5"
                    >
                      <button
                        onClick={() => handleLikeCommentaire(commentaire._id)}
                        className="text-green-500 rounded-xl"
                      >
                        {commentaire.likes.includes(user.currentUser?.id) ? (
                          <FontAwesomeIcon
                            icon={faThumbsUpFull}
                            className="h-5"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faThumbsUpEmpty}
                            className="h-5"
                          />
                        )}

                        {commentaire.likesCount}
                      </button>
                      <button
                        onClick={() =>
                          handleDislikeCommentaire(commentaire._id)
                        }
                        className="text-red-500 rounded-xl"
                      >
                        {commentaire.dislikes.includes(user.currentUser?.id) ? (
                          <FontAwesomeIcon
                            icon={faThumbsDownFull}
                            className="h-5"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faThumbsDownEmpty}
                            className="h-5"
                          />
                        )}{" "}
                        {commentaire.dislikesCount}
                      </button>
                      {(user.currentUser?.id === commentaire.userId._id || user.currentUser?.isAdmin === true) && (
                        <button
                          onClick={() =>
                            handleDeleteCommentaire(commentaire._id)
                          }
                          className="text-gray-500 rounded-xl"
                        >
                          <FontAwesomeIcon
                            icon={faTrashAltEmpty}
                            className="h-5"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                  <hr className="border border-gray-400 m-2" />
                  <div>{commentaire.content}</div>
                </div>
              )
            )
          )}
      </div>
    </div>
  );
}

export default Commentaires;
