import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Auth/authContext";
import { Helmet } from "react-helmet";
import VideoPlayer from "../components/VideoPage/VideoPlayer";
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

function VideoPage() {
  const [video, setVideo] = useState("");

  const [likeCount, setLikeCount] = useState("");
  const [likeList, setLikeList] = useState([]);
  const [dislikeCount, setDislikeCount] = useState("");
  const [dislikeList, setDislikeList] = useState([]);

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
  const [owner, setOwner] = useState("");

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
    setIsLoading(true); // Définir isLoading à true lors du chargement initial

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
        console.log(data);
        setLikeCount(data.likesCount);
        setLikeList(data.likes);

        setDislikeCount(data.dislikesCount);
        setDislikeList(data.dislikes);
          console.log(data);
        getOwnerInfo(data.user.username);
        // Vérifier si le lien de la vidéo est valide
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

  const getOwnerInfo = (ownerId) => {
    makeRequest(`api/users/channel/${ownerId}`)
      .then((data) => {
        setOwner(data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="flex flex-col xl:flex-row w-full px-5 md:px-14 py-5 gap-5">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`iSee - ${video.title}`}</title>
      </Helmet>
      {isVideoAvailable ? (
        <>
          <div className="flex flex-col w-full md:max-w-full gap-5 flex-grow">
            {isLoading ? (
              <div className="aspect-video align-top block m-auto w-full">
                {/* Afficher le rond de chargement ici */}
                <div className="w-full h-full flex justify-center items-center">
                  <div className="loader"></div>
                </div>
              </div>
            ) : (
              <div className="aspect-video align-top block m-auto w-full">
                <VideoPlayer options={videoJsOptions} video={video} />
              </div>
            )}
            <div className="bg-gray-300 w-full rounded-xl p-5">
              <p className="text-2xl font-bold">{video.title}</p>
              <div className="flex flex-row">
                <div className="w-1/2">
                  <p>{video.views} vues</p>
                  <div className="flex flex-row space-x-5 align-middle">
                    <div className="flex profile-icon">
                      <img
                        className="rounded-full max-h-10"
                        src="https://yt3.googleusercontent.com/2cZBFrVMMwZQFA2W3z4JI5Z50AAHA4Wb9mdIOqi_z7Q-pw0p-p7-v8lqRtheppvNUa9B3jvh=s176-c-k-c0x00ffffff-no-rj"
                        alt="Votre icône de profil"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-lg font-bold">{owner.username}</p>
                    </div>
                  </div>
                </div>
                <div className="w-1/2">
                  <div
                    name="action-button"
                    className="flex gap-2 text-sm font-bold h-5"
                  >
                    <button
                      onClick={() => handleLikeVideo(video._id)}
                      className="text-green-500 rounded-xl "
                    >
                      {likeList && likeList.includes(user.currentUser?.id) ? (
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
                      {dislikeList && dislikeList.includes(user.currentUser?.id) ? (
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
  );
}

export default VideoPage;
