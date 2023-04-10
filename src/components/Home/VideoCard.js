import React from "react";
import { Link } from "react-router-dom";

function VideoCard({ video, idVideo, title, creator, nbView, poster }) {
  return (
    <Link to={`/video/${idVideo}`}>
      <div className="max-w-sm rounded-xl overflow-hidden shadow-lg m-4 rounded-xl">
        <video
          poster={poster}
          src={video}
          muted
          width="500"
          height="300"
        />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base">{nbView} vues</p>
        </div>
        <div className="p-2">
          <span className="inline-block bg-gray-200 rounded-lg px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            {creator}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;