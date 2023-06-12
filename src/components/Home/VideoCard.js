import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Avatar from "../Avatar";

function VideoCard({ video, onClick }) {
  const [redirect, setRedirect] = useState(false);
  const videoRef = useRef(null);
  const [hoverDuration, setHoverDuration] = useState(-1);
  const navigate = useNavigate()
  const handleMouseOver = () => {
    setHoverDuration(0);
  };

  const handleMouseOut = () => {
    setHoverDuration(-1);
    videoRef.current.pause();
    videoRef.current.load();
  };

  useEffect(() => {
    let timer = null;

    if (hoverDuration >= 2) {
      console.log("playing hover duration");
      if (videoRef.current) {
        videoRef.current.play();
      }
    }

    if (hoverDuration < 2 && hoverDuration > -1) {
      timer = setInterval(() => {
        setHoverDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [hoverDuration]);
 const handleClick =
   onClick ??
   (() => {
     // Fonction par défaut
    navigate(`video/${video?._id}`, { replace: false });
   });
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg m-4">
      <div
        // onClick={() => {
        //   navigate(`/video/${video?._id}`, { replace: true });
        // }}
        onClick={handleClick}
      >
        <video
          ref={videoRef}
          poster={video?.thumbnail_path}
          src={video?.video_path}
          width="500"
          height="300"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        />
      </div>
      <div className="px-1 py-4 flex">
        <Link to={`/channel/${video.user?.username}`}>
          <div className="profile-icon rounded-full w-10 h-10 text-white flex items-center justify-center">
            {video.user?.logo_path ? (
              <img
                className="rounded-full max-h-10"
                src={video.user?.logo_path}
                alt="Votre icône de profil"
              />
            ) : (
              <Avatar username={video.user?.username} />
            )}
            {/* <img
          className="h-10 w-10 rounded-full mr-4"
          src={video?.userAvatar}
          alt={video?.userName}
        /> */}
          </div>
        </Link>
        <div className=" px-3 items-center">
          <div className="font-semibold text-xl mb-2">{video?.title}</div>
          <Link to={`/channel/${video.user?.username}`}>
            <p className="text-gray-700 text-base">{video.user?.username}</p>
          </Link>
          <p className="text-gray-700 text-base">{video?.views} vues</p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
