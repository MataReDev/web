import React, { useState, useEffect } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

const ScrollArrow = () => {
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    setShowScroll(window.pageYOffset > 0);
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, []);

  return (
    <div className="flex items-center justify-end mr-4">
      <ArrowUpIcon
        className="fixed bg-slate-200 border-4 border-white text-opacity-50 rounded-2xl w-12 h-10 bottom-5 z-50 cursor-pointer opacity-75"
        onClick={scrollTop}
        style={{ height: 40, width: 40, display: showScroll ? "flex" : "none" }}
      />
    </div>
  );
};

export default ScrollArrow;
