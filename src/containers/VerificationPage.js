import React, { useEffect, useState } from "react";
import makeRequest from "../Utils/RequestUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const VerificationPage =  () => {
  const [verificationStatus, setVerificationStatus] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
   
    if (token) {

 const encodedToken = encodeURIComponent(token);
       makeRequest(
         `/api/users/verification?token=${encodedToken}`,
         "POST",
         null,
         null,
         null,
         false
       ).then((data) => { 
            localStorage.setItem(
              "toastMessage",
              `Ton addresse mail a bien été validée ! tu peux maintenant te connecter !`
            );      
                 window.location.href = "/login";
         })
         .catch((error) => {

toast.error(
  "Une erreur est survenu lors de la vérification, Veuillez réessayer..",
  toastOptions
)});

    } else {
        toast.error(
          "Url Invalide",
          toastOptions
        );
    }
  }, []);

  return (
    <div>
      <h1>Page de vérification</h1>
      <p>{verificationStatus}</p>
    </div>
  );
};

export default VerificationPage;
