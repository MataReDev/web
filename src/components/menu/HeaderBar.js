import React, { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import "../../index.css";
import ProfileMenu from "./ProfileMenu";
import logo from "../../img/Logo.svg";

import { getAuthToken, deleteAuthToken, getIsAdmin } from "../../Auth/authContext";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faSearch);

function HeaderBar() {
  const [authToken, setAuthToken] = useState(getAuthToken());
  const isAdmin = getIsAdmin()
  const location = useLocation()
  console.log(isAdmin)

  useEffect(() => {
    setAuthToken(getAuthToken());
  }, []);  

  return (
    <header className="flex flex-row justify-items-center align-middle bg-white space-x-8 py-2 px-5">
      <Link
        to="/"
        className="flex flex-row justify-items-center align-middle bg-white space-x-8"
      >
        <img className="w-20 max-h-10" src={logo} alt="Logo" />
      </Link>
      <div className="search-bar flex-grow justify-center flex relative">
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full px-4 py-2 rounded-full shadow-sm focus:outline-none border-2 transition border-black focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute top-1/2 right-4 transform -translate-y-1/2"
        >
          <FontAwesomeIcon icon="search" className="text-gray-400" />
        </button>
      </div>
      {authToken ? (
        <div className="flex-grow justify-end flex gap-4 lg:max-w-fit">
          {isAdmin && (
            <div className="flex flex-row justify-center items-center">
              <Link
                to={"admin/dashboard"}
                className="px-4 py-2 font-bold hover:bg-gray-300 border border-black active:bg-gray-500 text-black rounded-lg"
              >
                Admin Dashboard
              </Link>
            </div>
          )}
          <ProfileMenu handleLogout={deleteAuthToken} />
        </div>
      ) : (
        <div className="login-button flex-grow justify-end flex items-center">
          <Link
            to={"login"}
            state={{ data: location.pathname }}
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
