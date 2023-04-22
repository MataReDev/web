import React, { useState, useContext } from "react";
import { fakeCommentaire } from "./fakeCommentaires";

function getAuthToken() {
  return localStorage.getItem("authToken");
}

function Commentaires() {
  const [commentaire, setCommentaire] = useState("");
  const [commentaires, setCommentaires] = useState("");
  //pour tester l'affichage useState(fakeCommentaire)

  const handleCommentaireSubmit = (event) => {
    console.log("submit",commentaire);
    event.preventDefault();

    if (commentaire && getAuthToken()) {
      fetch(`/api/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ commentaire }),
      })
        .then((response) => response.json())
        .then((data) => {
          setCommentaire("");
          setCommentaires([...commentaires, data]);
        });
    }
  };

  const handleLikeCommentaire = (commentId) => {
    console.log("like");
    if (getAuthToken()) {
      fetch(`/api/comment/like/${commentId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedCommentaires = commentaires.map((commentaire) =>
            commentaire.id === data.id ? data : commentaire
          );
          setCommentaires(updatedCommentaires);
        });
    }
  };

  const handleDislikeCommentaire = (commentId) => {
    console.log("dislike");
    if (getAuthToken()) {
      fetch(`/api/comment/dislike/${commentId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedCommentaires = commentaires.map((commentaire) =>
            commentaire.id === data.id ? data : commentaire
          );
          setCommentaires(updatedCommentaires);
        });
    }
  };

  const handleDeleteCommentaire = (commentId) => {
    console.log("delete");
    if (getAuthToken()) {
      fetch(`/api/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedCommentaires = commentaires.filter(
            (commentaire) => commentaire.id !== commentId
          );
          setCommentaires(updatedCommentaires);
        });
    }
  };

  return (
    <div className="p-5 rounded-xl h-full">
      <h1 className="font-bold">Commentaires</h1>
      <div className="flex flex-col gap-2">
        Ajouter un Commentaire :
        <form className="flex gap-5" onSubmit={handleCommentaireSubmit}>
          <input
            type="text"
            value={commentaire}
            onChange={(event) => setCommentaire(event.target.value)}
            className="bg-gray-200 w-3/4 rounded-xl p-2"
            placeholder="Ecrivez du texte ici ..."
          />
          <input
            type="submit"
            value="Envoyer"
            className="w-1/4 rounded-xl border border-black hover:bg-gray-200"
          />
        </form>
      </div>
      <div className="flex flex-col gap-4 pt-5">
        {commentaires !== "" &&
          commentaires.map((commentaire) => (
          <div key={commentaire.id} className="p-2 rounded-xl bg-gray-200">
            {commentaire.auteur} - {commentaire.date}
            <div>{commentaire.contenu}</div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleLikeCommentaire(commentaire.id)}
                className="bg-green-500 text-white rounded-xl p-2"
              >
                J'aime ({commentaire.likes})
              </button>
              <button
                onClick={() => handleDislikeCommentaire(commentaire.id)}
                className="bg-red-500 text-white rounded-xl p-2"
              >
                Je n'aime pas ({commentaire.dislikes})
              </button>
              <button
                onClick={() => handleDeleteCommentaire(commentaire.id)}
                className="bg-gray-500 text-white rounded-xl p-2"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Commentaires;