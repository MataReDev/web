import React, { useState } from "react";
import { Link } from "react-router-dom";

import { deleteAuthToken } from "../../Auth/authContext";

function ProfileMenu() {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    deleteAuthToken();
  };

  return (
    <div className="relative">
      <button
        className="profile-icon rounded-full w-8 h-8 bg-black text-white flex items-center justify-center"
        aria-label="Menu"
        onClick={handleMenuToggle}
      >
        <img
          className="rounded-full max-h-10 border"
          src="https://yt3.ggpht.com/yti/AHXOFjWk3fA1QQQyPyV4tgkBuC2paUw8uE5ZsYLUFiCZQA=s88-c-k-c0x00ffffff-no-rj-mo"
          alt="Votre icône de profil"
        />
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-4 w-40 bg-gray-200 rounded-lg shadow-xl z-10">
          <div className="m-2">
            <button className="w-full text-left hover:bg-gray-100 p-2 rounded-lg">
              <Link to="/chanel">Ma chaine</Link>
            </button>
            <button className="w-full text-left hover:bg-gray-100 p-2 rounded-lg">
              <Link to="/profile">Paramètres du compte</Link>
            </button>
            <hr className="border-gray-400"/>
            <button onClick={handleLogout} className="w-full text-left hover:bg-gray-100 p-2 rounded-lg">
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
