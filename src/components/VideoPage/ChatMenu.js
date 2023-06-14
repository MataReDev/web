import React, { useState } from "react";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  RocketTwoTone,
} from "@ant-design/icons";

const ChatMenu = () => {
  const [open, setOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const Menus = [
    { title: "Timoté" },
    { title: "Kévin" },
    { title: "Julien" },
    { title: "Mathys " },
    { title: "Martin" },
    { title: "Yoann" },
    { title: "Valentin " },
    { title: "Dimitry" },
    { title: "Timoté" },
    { title: "Kévin" },
    { title: "Julien" },
    { title: "Timoté" },
    { title: "Kévin" },
    { title: "Julien" },
    { title: "Timoté" },
    { title: "Kévin" },
    { title: "Julien" },
    { title: "Kévin" },
    { title: "Julien" },
    { title: "Timoté" },
    { title: "Kévin" },
    { title: "Julien" },
    { title: "Kévin" },
    { title: "Julien" },
    { title: "Timoté" },
    { title: "Kévin" },
    { title: "Julien" },
  ];

  return (
    <>
      <div className="relative flex justify-end">
        <div
          className={`absolute top-[-12px] right-[-12px] ${
            open ? "w-72 h-96" : "w-0 h-96"
          } bg-slate-500 rounded-r-xl transition-all duration-300`}
        >
          <div className="right-10 top-5 relative">
            {!open ? (
              <LeftCircleOutlined
                className="absolute top-2 right-2 text-black cursor-pointer"
                onClick={() => {
                  if (isTransitioning) return;
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setOpen(!open);
                    setIsTransitioning(false);
                  }, 300); // Temps de la transition en millisecondes
                }}
              />
            ) : (
              <RightCircleOutlined
                className="absolute top-2 right-2 text-black cursor-pointer"
                onClick={() => {
                  if (isTransitioning) return;
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setOpen(!open);
                    setIsTransitioning(false);
                  }, 300); // Temps de la transition en millisecondes
                }}
              />
            )}
          </div>

          <div className="flex gap-x-4 items-center">
            <h1
              className={`text-white origin-left font-medium text-xl duration-200 ${
                !open && "scale-0"
              }`}
            >
              Users
            </h1>
          </div>
          <ul className="pt-6 flex flex-col overflow-y-scroll overflow-hidden max-h-[calc(100%-40px)]">
            {Menus.map((Menu, index) => (
              <li
                key={index}
                className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-red-700 text-sm items-center gap-x-4
             ${index === 0 && "bg-light-white"} `}
              >
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  {Menu.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ChatMenu;
