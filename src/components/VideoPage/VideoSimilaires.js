import { useEffect, useState } from "react";
import VideoCard from "../Home/VideoCard";

function VideoSimilaires() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    setVideos();
    // fetch("/api/videoSimilaire")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setVideos(data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  return (
    <div className="p-3 rounded-xl h-fit bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Similar videos</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {videos &&
        videos.map((video) => (
          <VideoCard
            key={video.video_id}
            video={video.video_path}
            idVideo={video.video_id}
            title={video.titre}
            creator={video.user_id}
            nbView={video.nb_vues}
            poster={video.miniature}
          />
        ))}
      </div>
    </div>
  );
}

export default VideoSimilaires;
