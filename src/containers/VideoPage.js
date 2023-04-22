import React from "react";
import VideoPlayer from "../components/VideoPage/VideoPlayer";
import { listOfVideo } from "./videoData";
import LiveChat from "../components/VideoPage/LiveChat";
import Commentaires from "../components/VideoPage/Commentaires";
import VideoSimilaires from "../components/VideoPage/VideoSimilaires";

function VideoPage() {
  const videoId = window.location.pathname.split("/")[2];

  console.log(videoId);
  const video = listOfVideo[videoId-1]

  const videoJsOptions = {
    controls: true,
    sources: [
      {
        src: video.video_path,
      },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row w-full px-5 md:px-14 py-5 gap-5">
      <div className="flex flex-col  w-full md:max-w-full gap-5">
        <div className="aspect-video align-top block m-auto w-full">
          <VideoPlayer options={videoJsOptions} video={video} />
        </div>
        <div className="bg-gray-300 w-full rounded-xl p-5">
          <p className="text-2xl font-bold">{video.titre}</p>
          <p>{video.nb_vues} vues</p>
          <div className="flex flex-row space-x-5 align-middle">
            <div className="flex profile-icon">
              <img
                className="rounded-full max-h-10"
                src="https://yt3.googleusercontent.com/2cZBFrVMMwZQFA2W3z4JI5Z50AAHA4Wb9mdIOqi_z7Q-pw0p-p7-v8lqRtheppvNUa9B3jvh=s176-c-k-c0x00ffffff-no-rj"
                alt="Votre icône de profil"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-bold"></p>
              <p className="text-lg">486 k abonnés</p>
            </div>
          </div>
        </div>
        <div className=""><Commentaires/></div>
      </div>
      <div className="flex flex-col md:w-1/4 gap-5">
        <div className="w-full"><LiveChat videoId={videoId} /></div>
        <div className="w-full"><VideoSimilaires /></div>
      </div>
    </div>
  );
}

export default VideoPage;