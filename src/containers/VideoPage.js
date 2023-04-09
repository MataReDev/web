import React from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPage/VideoPlayer";

import video from "../videos/video1.mp4";

function VideoPage() {
  const { videoId } = useParams();

  // Get video by its videoId
  const videoRef = {
    videoId: videoId,
    video: video,
    title: "Top 5 capybara",
    creator: "squewe",
    nbView: "713497",
  };

  const videoJsOptions = {
    controls: true,
    sources: [
      {
        src: videoRef.video,
        type: "video/mp4",
      },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row w-full px-5 md:px-28 py-5 space-x-5">
      <div className="flex flex-col  w-full md:max-w-full space-y-5">
        <div className="aspect-video align-top block m-auto w-full">
          <VideoPlayer options={videoJsOptions} video={videoId} />
        </div>
        <div className="bg-gray-300 w-full rounded-xl p-5">
          <p className="text-2xl font-bold">{videoRef.title}</p>
          <p>{videoRef.nbView} vues</p>
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
        <div className="">Comments</div>
      </div>
      <div className="flex flex-col md:w-1/4">
        <div className="w-full">LiveChat</div>
        <div className="w-full">Videos Similaires</div>
      </div>
    </div>
  );
}

export default VideoPage;
