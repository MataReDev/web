import React, { useState, useEffect } from "react";
import makeRequest from "../../Utils/RequestUtils";
import VideoCard from "../Home/VideoCard";

export default function PublicChannel({ userId, username }) {
  const [videos, setVideos] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [channel, setChannel] = useState([]);

  const getUserVideo = async (userId) => {
    await makeRequest(
      `api/videos/user/${userId}?page=${page}&perPage=${perPage}`,
      "GET",
      null,
      null,
      null,
      false
    )
      .then((data) => setVideos(data))
      .catch((error) => console.error(error));
  };

  const getUserInfo = async (username) => {
    await makeRequest(
      `api/users/channel/${username}`,
      "GET",
      null,
      null,
      null,
      false
    )
      .then((data) => {
        console.log(data);
        setChannel(data);
      })
      .catch((error) => console.error(error));
  };

  // Exemple de récupération des vidéos depuis une API
  useEffect(() => {
    getUserVideo(userId);
    getUserInfo(username);
  }, []);

  return (
    <div className="bg-gray-100 h-full-win">
      <img
        className="w-full h-36 bg-cover bg-center"
        src={`${
          channel.banner
            ? channel.banner
            : "https://www.sortlist.fr/blog/wp-content/uploads/sites/3/2021/11/capture-decran-2021-11-25-a-11.32.34.png"
        }`}
        alt="Banner"
      />
      <div className="flex items-center px-4">
        <img src={channel?.logo} alt="Logo" className="w-10 h-10 mr-2" />
        <h1 className="text-black text-2xl">{channel.username}</h1>
      </div>
      <div className="video-list">
        <h2 className="text-black">Vidéos de {channel.username}</h2>
        <div className="flex flex-wrap justify-center">
          {videos &&
            videos.map((video, index) => (
              <VideoCard key={index} video={video} />
            ))}
        </div>
      </div>
    </div>
  );
}
