import React from "react";

function Commentaires() {
  return (
    <div className="border border-black p-5 rounded-xl h-fit w-full">
      <titre className="font-bold">Commentaires</titre>
      <div className="flex flex-col gap-2">
          Ajouter un Commentaires :
        <form className="flex gap-5">
          <input type="text" name="name" className="bg-gray-200 w-3/4 rounded-xl p-2" placeholder="Ecrivez du texte ici ..." />
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
