import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { createRoot } from "react-dom/client";

import "./index.css";

import HomePage from "./containers/HomePage";
import SearchPage from "./containers/SearchPage";
import VideoPage from "./containers/VideoPage";
import ChannelPage from "./containers/ChannelPage";
import ParamsPage from "./containers/ParamsPage";
import LoginPage from "./containers/LoginPage";
import ProfilePage from "./containers/ProfilePage";
import UploadVideoPage from "./containers/UploadVideoPage";
import Dashboard from "./containers/Dashboard";

import HeaderBar from "./components/menu/HeaderBar";

function App() {
  const [user, setUser] = useState(null);

  function isAuth() {
    if (localStorage.getItem("authToken")) {
      return true;
    }
    return false;
  }

  const handleLogin = () => {};

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <HeaderBar user={user} onLogout={handleLogout} />
      <div className="relative">
        {isAuth() ? (
          <Routes>
            <Route exact path="/profile" element={<ProfilePage />} />
            <Route exact path="/upload-video" element={<UploadVideoPage />} />
            <Route exact path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/search" element={<SearchPage />} />
          <Route exact path="/video/:id" element={<VideoPage />} />
          <Route exact path="/channel/:id" element={<ChannelPage />} />
          <Route exact path="/params/:id" element={<ParamsPage />} />
          <Route
            exact
            path="/login"
            element={<LoginPage onLogin={handleLogin} />}
          />{" "}
        </Routes>
      </div>
    </Router>
  );
}

const rootElement = document.getElementById("root");
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
