import React, { createContext, useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
export const AuthContext = createContext();

const AuthProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") || false
  );
    useEffect(() => {
      localStorage.setItem("isLoggedIn", isLoggedIn);
    }, [isLoggedIn]);

  const checkAuth = () => {
    return isLoggedIn;
  };
  const login = () => {
    console.log("LOGIN");
    setIsLoggedIn(true);
  };

  const logout = () => {
    //  authLogout();
        console.log("LOGOUT");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, checkAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


function decodeToken(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  const decoded = JSON.parse(atob(base64));
  return decoded;
}

// Fonction pour enregistrer un token d'authentification
export function saveAuthToken(token) {
  document.cookie = "authToken=" + token + "; path=/";
}

// Fonction pour supprimer un token d'authentification
export function deleteAuthToken() {
  document.cookie =
    "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.reload();
}

export function getAuthToken() {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("authToken=")) {
      return cookie.substring("authToken=".length);
    }
  }
  return null;
}

export function getUsernameFromToken() {
  const token = getAuthToken();
  if (!token) {
    console.error("Le JWT est absent dans les cookies.");
    return null;
  }
  const decodedToken = decodeToken(token);
  return decodedToken.username;
}

export function getIsAdmin() {
  const token = getAuthToken();
  if (!token) {
    return false;
  }
  const decodedToken = decodeToken(token);
  if (decodedToken.isAdmin) {
    return true;
  } else {
    return false;
  }
}
