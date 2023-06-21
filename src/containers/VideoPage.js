import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PlyrPlayer from "../components/VideoPage/PlyrPlayer";
import LiveChat from "../components/VideoPage/LiveChat";
import Commentaires from "../components/VideoPage/Commentaires";
import VideoSimilaires from "../components/VideoPage/VideoSimilaires";
import makeRequest from "../Utils/RequestUtils";

import AnimatedLogo from "../components/Loading";
import VideoInfo from "../components/VideoPage/VideoInfo";

function VideoPage() {
  const [video, setVideo] = useState("");

  const [isVideoAvailable, setIsVideoAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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
              <div className="flex flex-col flex-grow md:max-w-full gap-5 max-w-screen-sm">
                {!isLoading && (
                  <div className="aspect-video align-top block">
                    {/* <VideoPlayer options={videoJsOptions} video={video} /> */}
                    <PlyrPlayer video={video} />
                  </div>
                )}
                <VideoInfo video={video} />
                <div className="flex-grow">
                  <Commentaires videoId={videoId} />
                </div>
              </div>
              <div className="flex flex-col xl:w-1/4 gap-5">
                <div className="w-full">
                  <LiveChat videoId={videoId} />
                </div>
                <div className="w-full">
                  <VideoSimilaires
                    userId={video.user.ownerId}
                    videoId={videoId}
                  />
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
