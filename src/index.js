import React from "react";
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


import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./Auth/authContext";

import PrivateRoute from "./Auth/PrivateRoute";
import AdminRoute from "./Auth/AdminRoute"
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  
  return (
    <div className="relative bg-gray-100 min-h-screen h-full">
      <Router>
        <ScrollToTop/>
        <AuthProvider>
          <Helmet>
            <meta charSet="utf-8" />
            <title>iSee</title>
          </Helmet>
          <HeaderBar />
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
            <Route element={<AdminRoute />}>
              <Route exact path="/admin/dashboard" element={<Dashboard />} />
            </Route>
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
