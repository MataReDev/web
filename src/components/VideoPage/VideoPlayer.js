import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import img from "../../img/no_video_white.png"
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

      playerRef.current.on("error", () => {
        const errorDisplay = playerRef.current.getChild("errorDisplay");
        if (errorDisplay) {
          const modalDialogContent = errorDisplay
            .el()
            .querySelector(".vjs-modal-dialog-content");
          if (modalDialogContent) {
                modalDialogContent.textContent = options.notSupportedMessage; // Supprime le texte à l'intérieur du vjs-modal-dialog-content
            modalDialogContent.classList.add("custom-error-message");

            const customErrorMessage = document.createElement("div");
            customErrorMessage.className = "custom-error-message";

            const imageElement = document.createElement("img");
            imageElement.src = img;
            imageElement.style.width = "200px";
            imageElement.style.height = "200px";

            customErrorMessage.appendChild(imageElement);

            modalDialogContent.appendChild(customErrorMessage);
          }
        }
      });
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
        poster={video?.miniature}
        preload="auto"
        className={`w-full h-full video-js vjs-big-play-centered`}
      />
    </div>
  );
};

export default VideoPlayer;
