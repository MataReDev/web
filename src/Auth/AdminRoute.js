import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./authContext";
import makeRequest from "../Utils/RequestUtils";
import { FaSpinner } from "react-icons/fa";

const AdminRoute = () => {
  const { addToSecureLocalStorage, user } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      await makeRequest("api/users/checkIsAuth", "GET", null, null, null, true)
        .then((data) => {
          if (data !== null) {
            const { user } = data;
            if (user) {
              addToSecureLocalStorage("user", user);
              if (!user.isAdmin) {
                throw new Error("You don't have permission");
              } else setIsAuthenticated(true);
            } else window.location.href = "/404";
          } else window.location.href = "/404";
        })
        .catch((error) => {
          console.error(error);
          window.location.href = "/404";
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

export default AdminRoute;
