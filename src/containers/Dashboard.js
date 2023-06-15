import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import makeRequest from "../Utils/RequestUtils";

import DashboardUser from "../components/Dashboard/DashboardUser";
import DashboardVideo from "../components/Dashboard/DashboardVideo";
import DashboardHome from "../components/Dashboard/DashboardHome";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");

  // Fonction pour changer d'onglet
  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "videos":
        return <DashboardVideo />;
      case "users":
        return <DashboardUser />;
      case "home":
        return <DashboardHome setActiveTab={setActiveTab}/>;
      default:
        return (
          <div>
            <DashboardHome />
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 p-5">
      <Helmet>
        <meta charSet="utf-8" />
        <title>iSee - Dashboard</title>
      </Helmet>
      <div className="flex flex-col md:flex-row md:justify-between gap-4 p-5">
        <div
          className={`rounded-md shadow-md p-5 w-full md:w-1/3 transition duration-300 ease-in-out hover:bg-gray-300 ${
            activeTab === "home" ? "bg-gray-400" : "bg-white"
          }`}
          onClick={() => changeTab("home")}
        >
          HOME
        </div>
        <div
          className={`rounded-md shadow-md p-5 w-full md:w-1/3 transition duration-300 ease-in-out hover:bg-gray-300 ${
            activeTab === "video" ? "bg-gray-400" : "bg-white"
          }`}
          onClick={() => changeTab("video")}
        >
          VIDEOS
        </div>
        <div
          className={`rounded-md shadow-md p-5 w-full md:w-1/3 transition duration-300 ease-in-out hover:bg-gray-300 ${
            activeTab === "users" ? "bg-gray-400" : "bg-white"
          }`}
          onClick={() => changeTab("users")}
        >
          USERS
        </div>
      </div>
      <div className="p-10 bg-white rounded-md shadow-lg w-full">
        {renderContent()}
      </div>
    </div>
  );  
}

export default Dashboard;
