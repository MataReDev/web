import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./authContext";
import makeRequest from "../Utils/RequestUtils";

const PrivateRoute = () => {
  const { addToSecureLocalStorage } = useContext(AuthContext);
  useEffect(() => {
    const checkAuthentication = async () => {
        await makeRequest("api/users/checkIsAuth", "GET", null, null, null, true)
          .then((data) => {
            const { user } = data;
            if (user) {
              addToSecureLocalStorage("user", user);
            }
          })
          .catch((error) => {
            console.error(error);
            return (window.location.href = "/login");
          });
  }
    checkAuthentication();
  }, []);

  return <Outlet />;
};

export default PrivateRoute;
