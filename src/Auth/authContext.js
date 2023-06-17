import React, { createContext, useState, useEffect } from "react";
import { useLocation, navigate, redirect, Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import makeRequest from "../Utils/RequestUtils";

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
  let initialUser = {
    currentUser: undefined,
    isAuthenticated: false,
  };

  if (initialUser.currentUser === null) {
    const userInformation = secureLocalStorage.getItem("user");
    if (userInformation) {
      initialUser = {
        currentUser: userInformation,
        isAuthenticated: checkLocalStorage(),
      };
    }
  }
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState(initialUser);

  const location = useLocation();

  const handleStorageChange = (event) => {
    if (event.key === "@secure.j.user") {
      if (event.newValue === null) {
        setUser({
          currentUser: undefined,
          isAuthenticated: false,
        });
      } else {
        const userInformation = event.newValue;
        setUser({
          currentUser: userInformation,
          isAuthenticated: true,
        });
      }
    }
  };

  useEffect(() => {
    const isRestrictedRoute =
      location.pathname.includes("/admin") ||
      location.pathname.includes("/profile");

    if (!isRestrictedRoute) {
      const checkAuthentication = async () => {
        makeRequest("api/users/checkIsAuth", "GET", null, null, null, true)
          .then((data) => {
            if (data !== null) {
              const { user } = data;
              if (user) {
                addToSecureLocalStorage("user", user);
                // setIsLoading(false);
              }
              setIsLoading(false);
            }
          })
          .catch((error) => console.error(error))
          .finally(() => {
            setIsLoading(false);
          });
      };

      if (user.currentUser) {
        checkAuthentication();
      } else {
        setIsLoading(false);
      }

      // if (user.currentUser?.expiresAt) {
      //   const currentTime = Date.now();
      //   const expiresAtDate = new Date(user.currentUser?.expiresAt);
      //   const refreshTokenExpired =
      //     expiresAtDate && currentTime > expiresAtDate.getTime();
      //   const refreshTokenExpiringSoon =
      //     expiresAtDate &&
      //     currentTime > expiresAtDate.getTime() - 19 * 60 * 1000;
      //   if (refreshTokenExpired || refreshTokenExpiringSoon) {
      //     checkAuthentication();
      //   }
      //   else{
      //     setIsLoading(false);
      //   }
      // }else
      // {
      //   setIsLoading(false);
      // }
    } else {
      setIsLoading(false);
    }
  }, [location]);

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);

    //Affichage d'un toast
    const toastMessage = localStorage.getItem("toastMessage");
    if (toastMessage) {
      const { status, message } = JSON.parse(toastMessage);

      //const status = localStorage.getItem("status");

      const toastOptionsMap = {
        success: toast.success,
        warning: toast.warning,
        info: toast.info,
        error: toast.error,
      };

      if (message && status && toastOptionsMap[status]) {
        const toastFunction = toastOptionsMap[status];
        toastFunction(message, {
          ...toastOptions,
          onClose: () => {
            localStorage.removeItem("toastMessage");
          },
        });
      }
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
      if (userInformation) {
        setUser({
          currentUser: userInformation,
          isAuthenticated: checkLocalStorage(),
        });
      }
    }
  }, []);

  const login = async (email, password) => {
    const body = {
      email: email.toString(),
      password: password.toString(),
    };

    makeRequest("api/users/login", "POST", null, body, null, false)
      .then((tokens) => {
        if (tokens !== null) {
          const { xsrfToken, user } = tokens;

          if (user.isValidated) {
            localStorage.setItem("xsrfToken", xsrfToken);
            addToSecureLocalStorage("user", user);

          localStorage.setItem(
            "toastMessage",
            JSON.stringify({
              status: "success",
              message: `Welcome back ${user.username} 👋`,
            })
          );
          if (location.state?.data && location.state?.data !== "/login") {
            window.location.replace(location.state?.data);
          } else {
             window.location.replace("/");
          }
        } else {
          toast.warning(
            "Please check your account, if you have not received an email please contact us !",
            toastOptions
          );
        }
      }
      })
      .catch((error) => {
        console.error("erreur ", error.message);
        // if (error.message?.includes("You're banned")) {
        //   toast.error(error.message, toastOptions);
        // } else {
        //   toast.error(
        //     "Une erreur est survenu durant l'authentification, vérifier vos identifiants ou veuillez retentez dans quelques minutes.",
        //     toastOptions
        //   );
        // }
      });
  };

  const register = async (username, email, password, logo, isAdmin = false) => {
    // const headers = new Headers();
    // headers.append("Content-Type", "application/json");

    // const options = {
    //   method: "POST",
    //   mode: "cors",
    //   body: JSON.stringify({
    //     email: email.toString(),
    //     username: username.toString(),
    //     password: password.toString(),
    //     isAdmin: isAdmin,
    //   }),
    //   headers: headers,
    //   credentials: "include",
    // };

    const formData = new FormData();

    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("isAdmin", isAdmin);
    formData.append("logo", logo);

    // const body = {
    //   email: email.toString(),
    //   username: username.toString(),
    //   password: password.toString(),
    //   logo: logo,
    //   isAdmin: isAdmin,
    // };

    makeRequest("api/users/register", "POST", null, formData, null, false)
      .then((data) => {
        if (data !== null) {
          const { user } = data;
          if (user) {
            localStorage.setItem(
              "toastMessage",
              JSON.stringify({
                status: "success",
                message: `Bienvenue parmis nous ${user.username} 👋 N'oublie pas de valider ton inscription ! `,
              })
            );
            // Redirigez l'utilisateur vers la page de login
            window.location.href = "/login";
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const logout = async () => {
    makeRequest("api/users/logout", "POST", null, null, null, false)
      .then(() => {
        removeFromSecureLocalStorage("user");
        localStorage.removeItem("xsrfToken");
        toast("Come back soon, we miss you already 👋 ");
      })
      .catch((error) => {
        console.error(error.message);
        removeFromSecureLocalStorage("user");
        localStorage.removeItem("xsrfToken");
        toast.info(
          "malgré l'erreur, nous avons tout de même réussi à te déconnecter à bientôt.",
          toastOptions
        );
      });
  };

  if (isLoading) {
    return <div>Loading...</div>; // Affichez un indicateur de chargement pendant que le contexte est en cours de chargement
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        logout,
        user,
        addToSecureLocalStorage,
        removeFromSecureLocalStorage,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
