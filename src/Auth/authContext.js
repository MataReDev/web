import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useLocation } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

export const AuthContext = createContext();

var toBoolean = function (value) {
  var strValue = String(value).toLowerCase();
  strValue =
    !isNaN(strValue) &&
    strValue !== "0" &&
    strValue !== "" &&
    strValue !== "null" &&
    strValue !== "undefined"
      ? "1"
      : strValue;
  return strValue === "true" || strValue === "1" ? true : false;
};

const AuthProvider = (props) => {
   
  const [isLoggedIn, setIsLoggedIn] = useState(false
    //toBoolean(localStorage.getItem("isLoggedIn") )
  );
  const [user,setUser] = useState( {isAdmin  : false, currentUser:undefined} );

  const [email, setEmail] = useState("")

  const location = useLocation();
  
useEffect(() => {
  const userInformation = getCurrentUser();
  console.log("test user log " + userInformation?.username);
 
  if (userInformation) {
   setUser({ isAdmin: userInformation.isAdmin, currentUser: userInformation });
 }
 

},[])

const isAuthenticated =  () => {
const userInformation = secureLocalStorage.getItem("user")

if (!userInformation)
{
  return false;
}
  return true;
}

  const login = async (email, password) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const options = {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        email: email.toString(),
        password: password.toString(),
      }),
      headers: headers,
      credentials: "include",
    };

    await fetch("http://localhost:3001/api/users/login", options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erreur lors de l'authentification"); // Authentification échouée
        }
      })
      .then((tokens) => {
        const { xsrfToken, user } = tokens;
        console.log(xsrfToken);
        console.log("UserInfo "+user.username);
        setEmail(user.email);
        secureLocalStorage.setItem("user", user);
        localStorage.setItem("xsrfToken", xsrfToken);
        setIsLoggedIn(true);
        if (location.state?.data) {
          window.location.href = location.state?.data;
        } else {
          // Redirigez l'utilisateur vers la page d'accueil s'il n'y a pas de returnUrl
          window.location.href = "/";
        }
      })
      .catch(() => {
        throw new Error(
          "Une erreur est survenu durant l'authentification, veuillez retentez dans quelques minutes."
        );
      });
  };

  const register = async (email, password, isAdmin) => {
        const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const options = {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        email: email.toString(),
        password: password.toString(),
        isAdmin: false,
      }),
      headers: headers,
      credentials: "include",
    };

    await fetch("http://localhost:3001/api/users/register", options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erreur lors de l'authentification"); // Authentification échouée
        }
      })
      .then((tokens) => {
        const { xsrfToken } = tokens;
        localStorage.setItem("xsrfToken", JSON.stringify(xsrfToken));
        setIsLoggedIn(true);
        if (location.state?.data) {
          window.location.href = location.state?.data;
        } else {
          // Redirigez l'utilisateur vers la page d'accueil s'il n'y a pas de returnUrl
          window.location.href = "/";
        }
      })
      .catch(() => {
        throw new Error(
          "Une erreur est survenu durant l'enregistrement, veuillez retentez dans quelques minutes."
        );
      });
  };


  const logout = () => {
    //  authLogout();
    console.log("LOGOUT");
    secureLocalStorage.removeItem("user");
    //setIsLoggedIn(false);
  };

  const getCurrentUser = () => {
    return (secureLocalStorage.getItem("user"));
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, register, logout, user, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

function decodeToken() {
  // Lecture du cookie "access_token" qui contient le JWT
  console.log("Cookies", document.cookie);
  const jwt = Cookies.get("access_token");

  if (!jwt) 
  {
   //  window.location.href = "/login";
     return null;
  }
   
  // Décodage du JWT pour obtenir les informations de l'utilisateur
  const decodedJwt = jwt_decode(jwt);

  return decodedJwt;
}

// Fonction pour enregistrer un token d'authentification
// export function saveAuthToken(token) {
//   document.cookie = "authToken=" + token + "; path=/";
// }

// // Fonction pour supprimer un token d'authentification
// export function deleteAuthToken() {
//   document.cookie =
//     "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//   window.location.reload();
// }

// export function getAuthToken() {
//   const cookies = document.cookie.split(";");
//   for (let i = 0; i < cookies.length; i++) {
//     const cookie = cookies[i].trim();
//     if (cookie.startsWith("authToken=")) {
//       return cookie.substring("authToken=".length);
//     }
//   }
//   return null;
// }

export function getIsAdmin() {
  // const token = getAuthToken();
  // if (!token) {
  //   return false;
  // }
  const decodedToken = decodeToken();
  console.log("decoded: "+decodedToken);
  if (!decodedToken) 
      return false;

  if (decodedToken.isAdmin) {
    return true;
  } else {
    return false;
  }
}
