import React, { Component } from "react";
import VideoCard from "../components/Home/VideoCard";
import { listOfVideo } from "./videoData";

class HomePage extends Component {
  render() {
    return (
      <div className="flex flex-wrap justify-center">
        {listOfVideo.map((video) => (
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
    );
  }
}

export default HomePage;
