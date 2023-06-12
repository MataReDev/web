import React, { createContext, useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    currentUser: undefined,
    isAuthenticated: false,
  });
      const navigate = useNavigate();

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

    await makeRequest("api/users/login", "POST", null, body, null, false)
      .then((tokens) => {
        const { xsrfToken, user } = tokens;

        if (user.isValidated) {
          setIsLoggedIn(true);
          localStorage.setItem("xsrfToken", xsrfToken);
          addToSecureLocalStorage("user", user);

          localStorage.setItem(
            "toastMessage",
            JSON.stringify({
              status: "success",
              message: `Content de te revoir ${user.username} 👋`,
            })
          );
          if (location.state?.data && location.state?.data !== "/login") {
            window.location.href = location.state?.data;
            navigate(`/${location.state?.data}`, { replace: true });
          } else {
            navigate("/", { replace: true });
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

    const formData = new FormData()

    formData.append("username", username)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("isAdmin", isAdmin)
    formData.append("logo", logo)


    // const body = {
    //   email: email.toString(),
    //   username: username.toString(),
    //   password: password.toString(),
    //   logo: logo,
    //   isAdmin: isAdmin,
    // };

    await makeRequest("api/users/register", "POST", null, formData, null, false)
      .then((data) => {
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
      })
      .catch((error) => {
        console.log("user : " + error);
        toast.error(
          "Une erreur est survenu durant l'enregistrement, veuillez retentez dans quelques minutes.",
          toastOptions
        );
      });

  
  };

  const logout = async () => {


        await makeRequest("api/users/logout", "POST", null, null, null, false)
          .then(() => {
            removeFromSecureLocalStorage("user");
            localStorage.removeItem("xsrfToken");
            setIsLoggedIn(false);
            toast("Reviens vite nous voir, tu nous manque déjà 👋 ");
          })
          .catch((error) => {
            console.log(error.message);
            removeFromSecureLocalStorage("user");
            localStorage.removeItem("xsrfToken");
            setIsLoggedIn(false);
            toast("Reviens vite nous voir, tu nous manque déjà 👋 ");
            toast.error(
              "Une erreur est survenu durant la déconexion, nous avons tout de même réussi à te déconnecter à bientôt.",
              toastOptions
            );
          });

    
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
