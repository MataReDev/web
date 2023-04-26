import React, { useState } from "react";
import {Helmet} from "react-helmet";

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
import { getAuthToken } from "./Auth/authContext";

function App() {
  const [user, setUser] = useState(null);

  function isAuth() {
    if (getAuthToken() !== null) {
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
      <Helmet>
        <meta charSet="utf-8" />
        <title>iSee</title>
      </Helmet>
      <HeaderBar user={user} onLogout={handleLogout} />

      <div className="relative">
        <Routes>
          <Route
            exact
            path="/profile"
            element={
              isAuth() ? <ProfilePage /> : <Navigate to="/login" />
            }
          />
          <Route
            exact
            path="/upload-video"
            element={
              isAuth() ? <UploadVideoPage /> : <Navigate to="/login" />
            }
          />
          <Route
            exact
            path="/admin/dashboard"
            element={
              isAuth() ? <Dashboard /> : <Navigate to="/login" />
            }
          />
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
