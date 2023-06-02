import React, { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const AuthContext = createContext();

const toastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};


function checkLocalStorage() {
  const storedValue = secureLocalStorage.getItem("user");


  if (storedValue === null) {
    return false;
  }

  return true;
}

const AuthProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    currentUser: undefined,
    isAuthenticated: false,
  });

  const location = useLocation();

  const handleStorageChange = (event) => {
    console.log("Event: ", event.key);
    if (event.key === "@secure.j.user") {
      if (event.newValue === null) {
        setUser({
          currentUser: undefined,
          isAuthenticated: false,
        });
      } else {
        console.log("User: " + event.newValue);
        const userInformation = event.newValue;
        setUser({
          currentUser: userInformation,
          isAuthenticated: true,
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);

    //Affichage d'un toast
    const toastMessage = localStorage.getItem("toastMessage");
    //const toastOptions = JSON.parse(localStorage.getItem("toastOptions"));

    if (toastMessage && toastOptions) {
      toast.success(toastMessage, {
        ...toastOptions,
        onClose: () => {
          localStorage.removeItem("toastMessage");
          //localStorage.removeItem("toastOptions");
        },
      });
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  //Permet d'ajouter au stockage local sécurisé et modifier le state user
  const addToSecureLocalStorage = (key, value) => {
    secureLocalStorage.setItem(key, value);
    const keySecure = `@secure.j.${key}`;
    handleStorageChange({ key: keySecure, newValue: value });
  };

  //Permet de supprimer le stockage local sécurisé et modifier state user
  const removeFromSecureLocalStorage = (key) => {
    secureLocalStorage.removeItem(key);
    const keySecure = `@secure.j.${key}`;
    handleStorageChange({ key: keySecure, newValue: null });
  };

  useEffect(() => {
    if (user.currentUser == null) {
      const userInformation = secureLocalStorage.getItem("user");
      console.log("isAuthenticated", userInformation);
      if (userInformation) {
        setUser({
          currentUser: userInformation,
          isAuthenticated: checkLocalStorage(),
        });
      }
    }
  }, []);

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

    await fetch("https://iseevision.fr/api/users/login", options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erreur lors de l'authentification."); // Authentification échouée
        }
      })
      .then((tokens) => {
        const { xsrfToken, user } = tokens;

        if (user.isValidated) {
          setIsLoggedIn(true);
          localStorage.setItem("xsrfToken", xsrfToken);
          addToSecureLocalStorage("user", user);

          localStorage.setItem(
            "toastMessage",
            `Content de te revoir ${user.username} 👋`
          );

          if (location.state?.data) {
            window.location.href = location.state?.data;
          } else {
            // Redirigez l'utilisateur vers la page d'accueil s'il n'y a pas de returnUrl
            window.location.href = "/";
          }
        } else {
          toast.warning(
            "Veuillez vérifier votre compte, si vous n'avez pas reçu de mail veuillez nous contacter !",
            toastOptions
          );
        }
      })
      .catch(() => {
        toast.error(
          "Une erreur est survenu durant l'authentification, vérifier vos identifiants ou veuillez retentez dans quelques minutes.",
          toastOptions
        );
      });
  };

  const register = async (username, email, password, isAdmin = false) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const options = {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        email: email.toString(),
        username: username.toString(),
        password: password.toString(),
        isAdmin: isAdmin,
      }),
      headers: headers,
      credentials: "include",
    };

    await fetch("https://iseevision.fr/api/users/register", options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erreur lors de l'authentification"); // Authentification échouée
        }
      })
      .then((tokens) => {
        const { user } = tokens;

        localStorage.setItem(
          "toastMessage",
          `Bienvenue parmis nous ${user.username} 👋 N'oublie pas de valider ton inscription ! `
        );

        // Redirigez l'utilisateur vers la page de login
        window.location.href = "/login";
      })
      .catch(() => {
        toast.error(
          "Une erreur est survenu durant l'enregistrement, veuillez retentez dans quelques minutes.",
          toastOptions
        );
      });
  };

  const logout = async () => {

     const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const options = {
      method: "POST",
      mode: "cors",
      headers: headers,
      credentials: "include",
    };

    await fetch("https://iseevision.fr/api/users/logout", options)
      .then((response) => {
        if (response.ok) {
          //TODO  authLogout();
          console.log("LOGOUT");
          removeFromSecureLocalStorage("user");
          toast("Reviens vite nous voir, tu nous manque déjà 👋 ");
        } else {
          throw new Error("Erreur lors de l'authentification."); // Authentification échouée
        }
      })

    
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        register,
        logout,
        user,
        addToSecureLocalStorage,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


