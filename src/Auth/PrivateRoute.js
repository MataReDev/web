import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./authContext";

const PrivateRoute = () => {
    const { addToSecureLocalStorage } = useContext(AuthContext);
  useEffect(  () => {
    const checkAuthentication = async () => {
      console.log("Checking 1 ");
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
          "https://iseevision.fr/api/users/checkIsAuth",
          options
        );
            
        if (response.ok) {
          const {user} = await response.json();
          if (user) {
            console.log("UserInfo1 " + user.username);
            addToSecureLocalStorage("user", user);
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
