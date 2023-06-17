import React from "react";
import error404 from '../img/404_image.png';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">404 Error - Page not found</h1>
      <p className="text-xl mb-6">
      Sorry, the page you're looking for doesn't exist.
      </p>
      <img
        src={error404}
        alt="Page not found"
        className="w-2/3 h-auto mb-6"
      />
      {/* Autres éléments de conception ou de contenu que vous souhaitez ajouter */}
    </div>
  );
};

export default NotFoundPage;
