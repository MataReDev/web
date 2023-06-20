import { useEffect, useState } from "react";
import VideoCard from "../Home/VideoCard";
import { useNavigate } from "react-router-dom";
import makeRequest from "../../Utils/RequestUtils";

function VideoSimilaires({userId, videoId}) {

  const [similarVideos, setsimilarVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    similarVideo();
  }, []);

  const similarVideo = () => {
    makeRequest(
      `api/videos/similarVideo/${userId}?videoId=${videoId}`,
      "GET",
      null,
      null,
      null,
      false
    ).then((data) => {
      setsimilarVideos(data);
    });
  };

  const handleClickVideo = (videoId) => {
    window.location.replace(`/video/${videoId}`);
  };
  

  return (
    <div className="rounded-xl h-fit bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Similar videos</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {similarVideos &&
          similarVideos.map((video, index) => (
            <VideoCard
              key={index}
              video={video}
              onClick={() => handleClickVideo(video._id)}
            />
          ))}
      </div>
    </div>
  );
}

export default VideoSimilaires;
