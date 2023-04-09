import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Auth/authContext";
import { createRoot } from "react-dom/client";

import "./index.css";

import HomePage from "./containers/HomePage";
import SearchPage from "./containers/SearchPage";
import VideoPage from "./containers/VideoPage";
import ChannelPage from "./containers/ChannelPage";
import ParamsPage from "./containers/ParamsPage";
import LoginPage from "./containers/LoginPage";
import ProfilePage from "./containers/ProfilePage";
import EditProfilePage from "./containers/EditProfilePage";
import UploadVideoPage from "./containers/UploadVideoPage";
import Dashboard from "./containers/Dashboard";

import HeaderBar from "./components/menu/HeaderBar";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // add user state

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // handle login
  const handleLogin = () => {
    // replace with a real user object
    const realUser = {
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
    };
    setUser(realUser);
  };

  // handle logout
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
        <HeaderBar
          toggleSidebar={toggleSidebar}
          user={user}
          onLogout={handleLogout}
        />
        <div className="relative">
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
            />
            <Route exact path="/profile" element={<ProfilePage />} />
            <Route exact path="/edit-profile" element={<EditProfilePage />} />
            <Route exact path="/upload-video" element={<UploadVideoPage />} />
            <Route exact path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
    </Router>
  );
}

const rootElement = document.getElementById("root");
createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
