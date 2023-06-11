import React, { useState,useEffect } from "react";
import { Navigate } from "react-router-dom";
import Avatar from "../Avatar";

function VideoCard({ video}) {
  const [redirect, setRedirect] = useState(false);
console.log(video)
  const handleClick = () => {
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to={`/video/${video?._id}`} />;
  }
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg m-4">
      <div onClick={handleClick}>
        <video
          poster={video?.thumbnail_path}
          src={video?.video_path}
          muted
          width="500"
          height="300"
        />
      </div>
      <div></div>
      <div className="px-1 py-4 flex">
        <div className="profile-icon rounded-full w-8 h-8 bg-black text-white flex items-center justify-center">
          {video.user?.logo_path ? (
            <img
              className="rounded-full max-h-10 border"
              src="https://yt3.ggpht.com/yti/AHXOFjWk3fA1QQQyPyV4tgkBuC2paUw8uE5ZsYLUFiCZQA=s88-c-k-c0x00ffffff-no-rj-mo"
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
        <div className=" px-3 items-center">
          <div className="font-bold text-xl mb-2">{video?.title}</div>
          <p className="text-gray-700 text-base">{video.user?.username}</p>
          <p className="text-gray-700 text-base">{video?.views} vues</p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;

