import { useEffect, useState } from 'react';
import VideoCard from '../Home/VideoCard';
import { listOfVideo } from "../../containers/videoData";

function VideoSimilaires() {
  const [videos, setVideos] = useState([]);


  useEffect(() => {
    setVideos(listOfVideo)
    fetch('/api/videoSimilaire')
      .then(response => response.json())
      .then(data => {
        setVideos(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div className='p-5 rounded-xl h-fit bg-gray-100'>
      <h2 className='text-xl font-bold mb-4'>Vidéos similaires</h2>
      <div className='grid grid-cols-1 gap-4'>
        {videos.map(video => (
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