import React from "react";
import  {ResendVerificationEmail} from "../components/ResendVerificationEmailForm"; 
import { Helmet } from "react-helmet";


const ResendVerificationPage = () => {

  return (
    <div className="p-5">
      <Helmet>
        <meta charSet="utf-8" />
        <title>iSee - Resend verification Email</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">Resend verification Email</h1>
      <ResendVerificationEmail />
    </div>
  );
};

export default ResendVerificationPage;
