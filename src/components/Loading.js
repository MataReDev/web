import React, { useEffect, useRef } from "react";
import gsap from "gsap";

import logo from "../img/Logo.svg";

const AnimatedLogo = (props) => {
  const { text } = props;
  const logoRef = useRef(null);
  const pathsRef = useRef([]);

  useEffect(() => {
    const logoImg = logoRef.current;
    logoImg.addEventListener("load", handleLogoLoad);

    return () => {
      logoImg.removeEventListener("load", handleLogoLoad);
    };
  }, []);

  const handleLogoLoad = () => {
    const paths = logoRef.current.contentDocument.querySelectorAll("path");
    pathsRef.current = Array.from(paths);

    // Animation de scintillement avec GSAP pour chaque path
    pathsRef.current.forEach((path) => {
      scintillation(path);
    });
  };

  // Animation de scintillement avec GSAP pour chaque path
  const scintillation = (path) => {
    gsap.to(path, {
      fill: "#ffffff", // Couleur vive
      repeat: 1,
      yoyo: true,
      duration: 0.5,
      onComplete: () => {
        gsap.set(path, { fill: "#000000" }); // Couleur sombre
        scintillation(path);
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center text-center">
        <object
          className="w-20 max-h-10"
          data={logo}
          type="image/svg+xml"
          ref={logoRef}
        />
        <p className="mt-4">{text}</p>
      </div>
    </div>
  );
};

export default AnimatedLogo;
