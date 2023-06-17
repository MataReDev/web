import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { AuthContext } from "../../Auth/authContext";
import Avatar from "../Avatar";

function ProfileMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    setShowMenu(false);
  }, [location]);

  return (
    <div className="relative" onClick={handleMenuToggle}>
      <button
        className="profile-icon rounded-full w-10 h-10 text-white flex items-center justify-center"
        aria-label="Menu"
      >
        {user.currentUser.logo ? (
          <img
            className="rounded-full max-h-10"
            src={user.currentUser.logo}
            alt={user.currentUser.username + "profile icon"}
          />
        ) : (
          <Avatar username={user.currentUser.username} />
        )}
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-4 w-40 bg-gray-200 rounded-lg shadow-xl z-10">
          <div className="m-2">
            <Link to={`/channel/${user.currentUser.username}`}>
              <button className="w-full text-left hover:bg-gray-100 p-2 rounded-lg">
                My Channel
              </button>
            </Link>
            <Link to="/profile">
              <button className="w-full text-left hover:bg-gray-100 p-2 rounded-lg">
                Account settings
              </button>
            </Link>
            <hr className="border-gray-400" />
            <button
              onClick={handleLogout}
              className="w-full text-left hover:bg-gray-100 p-2 rounded-lg"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;