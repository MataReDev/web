import React, { useState } from "react";
import { Helmet } from "react-helmet";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import VerificationPage from "./containers/VerificationPage";
import HeaderBar from "./components/menu/HeaderBar";
import NotFoundPage from "./containers/NotFoundPage";


//import { getAuthToken } from "./Auth/authContext";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./Auth/authContext";
import PrivateRoute from "./Auth/PrivateRoute";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [user, setUser] = useState(null);

  // function isAuth() {
  //   if (getAuthToken() !== null) {
  //     return true;
  //   }
  //   return false;
  // }

  // const handleLogin = () => {};

  // const handleLogout = () => {
  // setUser(null);
  // };

  return (
    <div className="relative bg-gray-100 min-h-screen h-full">
      <Router>
        <ScrollToTop/>
        <AuthProvider>
          <Helmet>
            <meta charSet="utf-8" />
            <title>iSee</title>
          </Helmet>
          <HeaderBar user={user} />
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route exact path="/profile" element={<ProfilePage />} />
            </Route>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/verification" element={<VerificationPage />} />
            <Route exact path="/search" element={<SearchPage />} />
            <Route exact path="/video/:id" element={<VideoPage />} />
            <Route exact path="/channel/:id" element={<ChannelPage />} />
            <Route exact path="/params/:id" element={<ParamsPage />} />
            <Route exact path="/login" element={<LoginPage />} />{" "}
            <Route exact path="/admin/dashboard" element={<Dashboard />} />
            <Route exact path="/upload" element={<UploadVideoPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <ToastContainer />
        </AuthProvider>
      </Router>
    </div>
  );
}

const rootElement = document.getElementById("root");
createRoot(rootElement).render(
  //<React.StrictMode>
  <App />
  // </React.StrictMode>
);
