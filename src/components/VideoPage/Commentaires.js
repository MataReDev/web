import React, { useState, useContext } from "react";
import { AppContext } from "./AppContext";

function getAuthToken() {
  return localStorage.getItem('authToken');
}

function Commentaires() {
  const [commentaire, setCommentaire] = useState("");

  const handleCommentaireSubmit = (event) => {
    event.preventDefault();

    if (authToken) {
      fetch("/api/addcommentaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ commentaire }),
      })
        .then((response) => response.json())
        .then((data) => {
          // TODO: Traiter la réponse de l'API
        });
    }
  };

  return (
    <div className="border border-black p-5 rounded-xl h-fit w-full">
      <h1 className="font-bold">Commentaires</h1>
      <div className="flex flex-col gap-2">
          Ajouter un Commentaires :
        <form className="flex gap-5">
          <input type="text" name="commentaire" className="bg-gray-200 w-3/4 rounded-xl p-2" placeholder="Ecrivez du texte ici ..." />
          <input type="submit" value="Envoyer" className="w-1/4 rounded-xl border border-black hover:bg-gray-200" />
        </form>
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="border border-black p-3 rounded-lg">
            Auteur - Date
            <div>
                Contenu du commentaire
            </div>
        </div>
        <div className="border border-black p-3 rounded-lg">
            Auteur - Date
            <div>
                Contenu du commentaire
            </div>
        </div>
        <div className="border border-black p-3 rounded-lg">
            Auteur - Date
            <div>
                Contenu du commentaire
            </div>
        </div>
      </div>
    </div>
  );
}

export default Commentaires;
