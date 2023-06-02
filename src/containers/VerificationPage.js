import React, { useEffect, useState } from "react";
import makeRequest from "../Utils/RequestUtils";

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
       ).then(() => {           
             setVerificationStatus("Votre adresse a bien été enregistrée.");          
         })
         .catch((error) => {
           setVerificationStatus(
             "Une erreur s'est produite lors de la vérification. Veuillez réessayer."
           );
         });

    } else {
      setVerificationStatus("Token manquant dans l'URL.");
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
