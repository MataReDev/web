import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../Auth/authContext";
import Avatar from "../Avatar";
function ProfileMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const { logout,user } = useContext(AuthContext);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="relative" onClick={handleMenuToggle}>
      <button
        className="profile-icon rounded-full w-8 h-8 bg-black text-white flex items-center justify-center"
        aria-label="Menu"
      >
        {user.currentUser.logo_path ? (
          <img
            className="rounded-full max-h-10 border"
            src="https://yt3.ggpht.com/yti/AHXOFjWk3fA1QQQyPyV4tgkBuC2paUw8uE5ZsYLUFiCZQA=s88-c-k-c0x00ffffff-no-rj-mo"
            alt="Votre icône de profil"
          />
        ) : (
          <Avatar
            username={user.currentUser.username}
          />
        )}
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-4 w-40 bg-gray-200 rounded-lg shadow-xl z-10">
          <div className="m-2">
            <Link to="/chanel">
              <button className="w-full text-left hover:bg-gray-100 p-2 rounded-lg">
                Ma chaine
              </button>
            </Link>
            <Link to="/profile">
              <button className="w-full text-left hover:bg-gray-100 p-2 rounded-lg">
                Paramètres du compte
              </button>
            </Link>
            <hr className="border-gray-400" />
            <button
              onClick={handleLogout}
              className="w-full text-left hover:bg-gray-100 p-2 rounded-lg"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
