import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Auth/authContext";
import { Helmet } from "react-helmet";
import VideoPlayer from "../components/VideoPage/VideoPlayer";
import PlyrPlayer from "../components/VideoPage/PlyrPlayer";
import Avatar from "../components/Avatar";
import LiveChat from "../components/VideoPage/LiveChat";
import Commentaires from "../components/VideoPage/Commentaires";
import VideoSimilaires from "../components/VideoPage/VideoSimilaires";
import makeRequest from "../Utils/RequestUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as faThumbsUpFull,
  faThumbsDown as faThumbsDownFull,
} from "@fortawesome/free-solid-svg-icons";
import {
  faThumbsUp as faThumbsUpEmpty,
  faThumbsDown as faThumbsDownEmpty,
} from "@fortawesome/free-regular-svg-icons";

import AnimatedLogo from "../components/Loading";

function VideoPage() {
  const [video, setVideo] = useState("");

  const [likeCount, setLikeCount] = useState("");
  const [likeList, setLikeList] = useState([]);
  const [dislikeCount, setDislikeCount] = useState("");
  const [dislikeList, setDislikeList] = useState([]);

  const [elapsedTime, setElapsedTime] = useState("");

  const [isVideoAvailable, setIsVideoAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useContext(AuthContext);

  const [videoJsOptions, setvideoJsOptions] = useState({
    controls: true,
    notSupportedMessage: "Cette vidéo n'est pas disponible pour le moment",
    sources: [
      {
        src: `${video.video_path}`,
      },
    ],
  });

  const videoId = window.location.pathname.split("/")[2];
  // const videoJsOptions = {
  //   controls: true,
  //   notSupportedMessage: "Cette vidéo n'est pas disponible pour le moment",
  //   sources: [
  //     {
  //       src: `${video.video_path}`,
  //     },
  //   ],
  // };

  const handleLikeVideo = (videoId) => {
    console.log(videoId);
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
      alert("Veuillez vous connectez !");
    }
  };

  const handleDislikeVideo = (videoId) => {
    console.log(videoId);
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
      alert("Veuillez vous connectez !");
    }
  };

  // Fonction pour récupérer le propriétaire de la vidéo
  useEffect(() => {
    // setIsLoading(true); // Définir isLoading à true lors du chargement initial

    makeRequest(`api/videos/${videoId}`, "GET", null, null, null, false)
      .then(async (data) => {
        setVideo(data);
        // setvideoJsOptions(videoJsOptions.sources[0].src = video.video_path)
        setvideoJsOptions((prevOptions) => {
          // Créer une copie profonde des options existantes
          const newOptions = { ...prevOptions };

          // Modifier la valeur de src dans les sources
          newOptions.sources = [
            {
              src: data.video_path,
            },
          ];

          // Retourner les nouvelles options mises à jour
          return newOptions;
        });
        setLikeCount(data.likesCount);
        setLikeList(data.likes);

        setDislikeCount(data.dislikesCount);
        setDislikeList(data.dislikes);

        console.log(data);

        getElapsedTime(data.uploadAt);
      })
      .catch((error) => {
        setIsVideoAvailable(false);
      })
      .finally(() => {
        setIsLoading(false); // Définir isLoading à false une fois le fetch terminé
      });

    const addView = async () => {
      makeRequest(
        `api/videos/addView/${videoId}`,
        "PUT",
        null,
        null,
        null,
        false
      );
    };

    const timer = setTimeout(() => {
      addView();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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
        timeString = `${years} ${years === 1 ? "an" : "ans"}`;
        break;
      case months > 0:
        timeString = `il y a ${months} mois`;
        break;
      case weeks > 0:
        timeString = `il y a ${weeks} ${weeks === 1 ? "semaine" : "semaines"}`;
        break;
      case days > 0:
        timeString = `il y a ${days} ${days === 1 ? "jour" : "jours"}`;
        break;
      case hours > 0:
        timeString = `il y a ${hours} ${hours === 1 ? "heure" : "heures"}`;
        break;
      case minutes > 0:
        timeString = `il y a ${minutes} ${
          minutes === 1 ? "minute" : "minutes"
        }`;
        break;
      case seconds > 0:
        timeString = `il y a  ${seconds} ${
          seconds === 1 ? "seconde" : "secondes"
        }`;
        break;
      default:
        timeString = "À l'instant";
        break;
    }

    console.log(days, months, years);
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

  return (
    <>
      {!isLoading ? (
        <div className="flex flex-col xl:flex-row w-full px-5 md:px-14 py-5 gap-5">
          <Helmet>
            <meta charSet="utf-8" />
            <title>{`iSee - ${video.title}`}</title>
          </Helmet>

          {isVideoAvailable ? (
            <>
              <div className="flex flex-col w-full md:max-w-full gap-5 flex-grow">
                {!isLoading && (
                  <div className="aspect-video align-top block m-auto w-full">
                    {/* <VideoPlayer options={videoJsOptions} video={video} /> */}
                    <PlyrPlayer video={video} />
                  </div>
                )}
                <div className="space-y-5">
                  <p className="text-2xl font-bold">{video.title}</p>
                  <div className="flex flex-row">
                    <div className="w-1/2">
                      <div className="flex flex-row space-x-5 align-middle">
                        <div className="flex profile-icon w-8 h-8">
                          {video.user?.logo_path ? (
                            <img
                              className="rounded-full max-h-10 border"
                              src={video.user?.logo_path}
                              alt="Votre icône de profil"
                            />
                          ) : (
                            <Avatar username={video.user?.username} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-lg font-bold">
                            {video.user?.username}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-1/2 justify-end items-start">
                      <div
                        name="action-button"
                        className="flex gap-2 text-sm font-bold bg-gray-200 p-4 rounded-xl align-top"
                      >
                        <button
                          onClick={() => handleLikeVideo(video._id)}
                          className="text-green-500 rounded-xl "
                        >
                          {likeList &&
                          likeList.includes(user.currentUser?.id) ? (
                            <FontAwesomeIcon
                              icon={faThumbsUpFull}
                              className="h-5"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faThumbsUpEmpty}
                              className="h-5"
                            />
                          )}
                          {likeCount}
                        </button>
                        <button
                          onClick={() => handleDislikeVideo(video._id)}
                          className="text-red-500 rounded-xl"
                        >
                          {dislikeList &&
                          dislikeList.includes(user.currentUser?.id) ? (
                            <FontAwesomeIcon
                              icon={faThumbsDownFull}
                              className="h-5"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faThumbsDownEmpty}
                              className="h-5"
                            />
                          )}{" "}
                          {dislikeCount}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-200 w-full rounded-xl p-5">
                    {video?.views === 0 && (
                      <p className="font-bold">
                        {video.views} vues {elapsedTime}
                      </p>
                    )}
                    <h2></h2>
                    <pre className="font-sans">
                      {showFullDescription
                        ? fullDescription
                        : limitedDescription}
                      <br />
                      {hasMoreLines && (
                        <button
                          className="text-blue-500 font-bold"
                          onClick={handleToggleDescription}
                        >
                          {showFullDescription ? "Moins" : "Plus"}
                        </button>
                      )}
                    </pre>
                  </div>
                </div>
                <div className="flex-grow">
                  <Commentaires videoId={videoId} />
                </div>
              </div>
              <div className="flex flex-col w-full xl:w-1/4 gap-5">
                <div className="w-full">
                  <LiveChat videoId={videoId} />
                </div>
                <div className="w-full">
                  <VideoSimilaires />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full text-center">
              <img
                src="https://static.thenounproject.com/png/485920-200.png"
                alt="Blocked Video Icon"
                className="mx-auto w-32 h-32"
              />
              <p className="mt-2 text-xl font-semibold">
                Cette vidéo n'est plus disponible
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          <AnimatedLogo text="Stay connected as the suspense builds while the video content loads."></AnimatedLogo>
        </>
      )}
    </>
  );
}

export default VideoPage;
