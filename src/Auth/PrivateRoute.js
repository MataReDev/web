import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./authContext";
import makeRequest from "../Utils/RequestUtils";
import { FaSpinner } from "react-icons/fa";

const PrivateRoute = () => {
  const { addToSecureLocalStorage, removeFromSecureLocalStorage } =
    useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      makeRequest("api/users/checkIsAuth", "GET", null, null, null, true)
        .then((data) => {
          if (data !== null) {
          const { user } = data;
          if (user) {
            addToSecureLocalStorage("user", user);
            setIsAuthenticated(true);
          } else 
          {
            removeFromSecureLocalStorage("user");
            window.location.href = "/login";
          }
        } else {
            removeFromSecureLocalStorage("user");
            window.location.href = "/login";
        } 
        })
        .catch((error) => {
          console.error(error);
          removeFromSecureLocalStorage("user");
          window.location.href = "/login";
        });
    };
    checkAuthentication();
  }, []);

  if (!isAuthenticated) {
    // Afficher un écran de chargement ou un message pendant la vérification de l'authentification
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
