import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import "../../styles/customTheme.scss";

const VideoPlayer = ({ options, video }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const player = playerRef.current;

    if (!player) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      playerRef.current = videojs(videoElement, options);
    }
    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [options, videoRef, playerRef]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        poster={video.miniature}
        preload="auto"
        className={`w-full h-full video-js vjs-big-play-centered`}
      />
    </div>
  );
};

export default VideoPlayer;
