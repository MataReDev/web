import React, { useState, useContext } from "react";
import {fakeCommentaire} from './fakeCommentaires'
function getAuthToken() {
  return localStorage.getItem("authToken");
}

function Commentaires() {
  const [commentaire, setCommentaire] = useState("");
  const [commentaires, setCommentaires] = useState(fakeCommentaire);

  const handleCommentaireSubmit = (event) => {
    event.preventDefault();

    if (commentaire && getAuthToken()) {
      fetch("/api/addcommentaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        {commentaires.map((commentaire) => (
          <div key={commentaire.id} className="p-2 rounded-xl bg-gray-200">
            {commentaire.auteur} - {commentaire.date}
            <div>{commentaire.contenu}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Commentaires;