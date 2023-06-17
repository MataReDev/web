import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Auth/authContext";
import makeRequest from "../../Utils/RequestUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";
import {
  faThumbsUp as faThumbsUpFull,
  faThumbsDown as faThumbsDownFull,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faThumbsUp as faThumbsUpEmpty,
  faThumbsDown as faThumbsDownEmpty,
} from "@fortawesome/free-regular-svg-icons";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

function VideoInfo({ video }) {
  const [likeCount, setLikeCount] = useState("");
  const [likeList, setLikeList] = useState([]);
  const [dislikeCount, setDislikeCount] = useState("");
  const [dislikeList, setDislikeList] = useState([]);
  const { user } = useContext(AuthContext);
  const [elapsedTime, setElapsedTime] = useState("");

  const handleLikeVideo = (videoId) => {
    if (user.isAuthenticated) {
      makeRequest(`api/videos/like/${videoId}`, "PUT", null, null, null, true)
        .then((data) => {
          setLikeCount(data.likesCount);
          setLikeList(data.likes);
          setDislikeCount(data.dislikesCount);
          setDislikeList(data.dislikes);
        })
        .catch((error) => console.error(error));
    } else {
      alert("Please Log In !");
    }
  };

  const handleDislikeVideo = (videoId) => {
    if (user.isAuthenticated) {
      makeRequest(
        `api/videos/dislike/${videoId}`,
        "PUT",
        null,
        null,
        null,
        true
      )
        .then((data) => {
          setLikeCount(data.likesCount);
          setLikeList(data.likes);
          setDislikeCount(data.dislikesCount);
          setDislikeList(data.dislikes);
        })
        .catch((error) => console.error(error));
    } else {
      alert("Please Log In !");
    }
  };

  const getElapsedTime = (dateUpload) => {
    const uploadAt = new Date(dateUpload);
    const timeElapsed = Date.now() - uploadAt.getTime();

    const seconds = Math.floor(timeElapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(weeks / 5);
    const years = Math.floor(months / 12);

    let timeString = "";

    switch (true) {
      case years > 0:
        timeString = `${years} ${years === 1 ? "year" : "years"} ago`;
        break;
      case months > 0:
        timeString = `${months} ${months === 1 ? "month" : "months"} ago`;
        break;
      case weeks > 0:
        timeString = `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
        break;
      case days > 0:
        timeString = `${days} ${days === 1 ? "day" : "days"} ago`;
        break;
      case hours > 0:
        timeString = `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
        break;
      case minutes > 0:
        timeString = `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
        break;
      case seconds > 0:
        timeString = `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
        break;
      default:
        timeString = "Just now";
        break;
    }

    setElapsedTime(timeString);
  };

  const [nbLinesDescriptionLimtited, setNbLinesDescriptionLimtited] =
    useState(3);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const descriptionLines = video?.description?.split("\n");

  const fullDescription = descriptionLines?.join("\n");

  if (descriptionLines?.[nbLinesDescriptionLimtited - 1]?.trim() === "") {
    setNbLinesDescriptionLimtited(2);
  }
  const limitedDescription = descriptionLines
    ?.slice(0, nbLinesDescriptionLimtited)
    ?.join("\n");

  const hasMoreLines = descriptionLines?.length > nbLinesDescriptionLimtited;

  useEffect(() => {
    const toastMessage = localStorage.getItem("toastMessage");

    if (toastMessage) {
      const { status, message } = JSON.parse(toastMessage);

      //const status = localStorage.getItem("status");

      const toastOptionsMap = {
        success: toast.success,
        warning: toast.warning,
        info: toast.info,
      };

      if (message && status && toastOptionsMap[status]) {
        const toastFunction = toastOptionsMap[status];
        toastFunction(message, {
          ...toastOptions,
          onClose: () => {
            localStorage.removeItem("toastMessage");
          },
        });
      }
    }

    makeRequest(`api/videos/${video._id}`, "GET", null, null, null, false)
      .then(async (data) => {
        setLikeCount(data.likesCount);
        setLikeList(data.likes);
        setDislikeCount(data.dislikesCount);
        setDislikeList(data.dislikes);
        getElapsedTime(data.uploadAt);
      })
      .catch((error) => console.error(error));
  }, [video]);

  const handleShareVideo = () => {
    if (navigator.share) {
      navigator
        .share({
          title: video.title,
          url: window.location.href,
        })
        .then(() => console.log("Video shared successfully"))
        .catch((error) => console.error("Error sharing video:", error));
    } else {
      alert("Video sharing is not supported on this browser.");
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-2xl font-bold">{video?.title}</p>
      <div className="flex flex-row">
        <div className="w-1/2">
          <div className="flex flex-row space-x-5 align-middle">
            <div className="flex w-8 h-8">
              {video?.user?.logo_path ? (
                <Link to={`/channel/${video?.user?.username}`}>
                  <img
                    className="rounded-full max-h-10 border"
                    src={video?.user?.logo_path}
                    alt="Votre icône de profil"
                  />
                </Link>
              ) : (
                <Link to={`/channel/${video?.user?.username}`}>
                  <Avatar username={video?.user?.username} />
                </Link>
              )}
            </div>
            <div className="flex flex-col">
              <Link to={`/channel/${video?.user?.username}`}>
                <p className="text-lg font-bold">{video?.user?.username}</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex w-1/2 justify-end items-start">
          <div
            name="action-button"
            className="flex gap-2 text-sm font-bold bg-gray-200 p-4 rounded-xl align-top"
          >
            <button
              onClick={() => handleLikeVideo(video?._id)}
              className="text-green-500 rounded-xl "
            >
              {likeList && likeList.includes(user.currentUser?.id) ? (
                <FontAwesomeIcon icon={faThumbsUpFull} className="h-5" />
              ) : (
                <FontAwesomeIcon icon={faThumbsUpEmpty} className="h-5" />
              )}
              {likeCount}
            </button>
            <button
              onClick={() => handleDislikeVideo(video?._id)}
              className="text-red-500 rounded-xl"
            >
              {dislikeList && dislikeList.includes(user.currentUser?.id) ? (
                <FontAwesomeIcon icon={faThumbsDownFull} className="h-5" />
              ) : (
                <FontAwesomeIcon icon={faThumbsDownEmpty} className="h-5" />
              )}{" "}
              {dislikeCount}
            </button>
            <button onClick={handleShareVideo} className="btn btn-light btn-sm">
              <FontAwesomeIcon icon={faShareAlt} />
              <span className="ml-2">Share</span>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 w-full rounded-xl p-5">
        <p className="font-bold">
          {video?.viewsCount} views {elapsedTime}
        </p>
        <h2></h2>
        <pre className="font-sans">
          {showFullDescription ? fullDescription : limitedDescription}
          <br />
          {hasMoreLines && (
            <button
              className="text-blue-500 font-bold"
              onClick={handleToggleDescription}
            >
              {showFullDescription ? "Less" : "More"}
            </button>
          )}
        </pre>
      </div>
    </div>
  );
}

export default VideoInfo;
