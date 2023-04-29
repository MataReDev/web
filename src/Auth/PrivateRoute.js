import React, { useContext, useEffect } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "./authContext";

const PrivateRoute = () => {
  const { isLoggedIn, checkAuth } = useContext(AuthContext);

  console.log("check auth ",checkAuth() )
console.log("You are not logged in", isLoggedIn);
   if (isLoggedIn !== "true") {
    console.log("You are not logged in")
     return <Navigate to="/login" replace={true} />;
   }
   
    return <Outlet />;

};

export default PrivateRoute;
