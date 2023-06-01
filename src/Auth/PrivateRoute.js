import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./authContext";
import secureLocalStorage from "react-secure-storage";

const PrivateRoute = () => {

  useEffect(() => {
    const checkAuthentication = async () => {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-xsrf-token", localStorage.getItem("xsrfToken"));
      const options = {
        method: "GET",
        mode: "cors",
        headers: headers,
        credentials: "include",
      };

      try {
        const response = await fetch(
          "http://localhost:3001/api/users/checkIsAuth",
          options
        );
            
        if (response.ok) {
          const user = await response.user
          if (user) {
            console.log("UserInfo " + user.username);
            secureLocalStorage.setItem("user", user);
          }
        } else {
            throw new Error("unauthorized request");       
        }
      } catch (error) {
        // Gérer l'erreur d'authentification ici
        console.error('error ',error);
        // Rediriger vers la page de connexion
        return window.location.href = "/login";
      }
    };

    checkAuthentication();
  }, []);

  return <Outlet />;
};

export default PrivateRoute;
