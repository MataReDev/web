import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../index.css";
import ProfileMenu from "./ProfileMenu";
import logo from "../../img/Logo.svg";

import { AuthContext } from "../../Auth/authContext";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import makeRequest from "../../Utils/RequestUtils";
import VideoCallIcon from '@mui/icons-material/VideoCall';

library.add(faSearch);

function HeaderBar() {
  const { logout, user } = useContext(AuthContext);
  const isAdmin = user?.currentUser?.isAdmin;
  const location = useLocation();

  const [searchValue, setSearchValue] = useState("");

  const searchVideo = () => {
    window.location.href = `/search?query=${searchValue}`; // Redirige vers la page /search avec la valeur de recherche dans l'URL
  };

  return (
    <header className="sticky top-0 z-10 flex flex-row justify-items-center align-middle bg-white space-x-8 py-2 px-5">
      <Link
        to="/"
        className="flex flex-row justify-items-center align-middle bg-white space-x-8"
      >
        <img className="w-20 max-h-10" src={logo} alt="Logo" />
      </Link>
      <div className="search-bar justify-center flex relative w-96">
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full px-4 py-2 rounded-full shadow-sm focus:outline-none border-2 transition border-black focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchVideo();
            }
          }}
        />
        <button
          type="submit"
          onClick={searchVideo}
          className="absolute right-0 top-0 h-full flex items-center justify-center px-3 text-gray-400"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      {user.isAuthenticated ? (
        <div className="flex-grow justify-end flex gap-4">
          <div className="flex flex-row justify-center items-center">
            {isAdmin && (
              <Link
                to={"admin/dashboard"}
                className="px-4 py-2 h-10 m-1 font-bold hover:bg-gray-300 border border-black active:bg-gray-500 text-black rounded-lg"
              >
                Admin Dashboard
              </Link>
            )}
            <Link
              to={"/upload"}
              className="px-4 py-2 h-10 m-1 font-bold hover:bg-gray-300 border border-black active:bg-gray-500 text-black rounded-lg flex items-center"
            >
              <VideoCallIcon />
            </Link>
          </div>

          <ProfileMenu handleLogout={logout} />
        </div>
      ) : (
        <div className="login-button flex-grow justify-end flex items-center">
          <Link
            to={{ pathname: "/login"}} state={{ data: location.pathname }}  
            className="px-4 py-2 border border-black hover:bg-gray-300 focus:border focus:border-black active:bg-gray-500 text-black rounded-lg"
          >
            Se connecter
          </Link>
        </div>
      )}
    </header>
  );
}

export default HeaderBar;
