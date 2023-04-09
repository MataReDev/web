import React, { Component } from "react";
import VideoCard from "../components/Home/VideoCard";
import { listOfVideo } from './videoData';


class HomePage extends Component {
 
  render() {
    return (
      <div className="flex flex-wrap justify-center">
        {listOfVideo.map((video) => (
          <VideoCard key={video.id} video={video.video} idVideo={video.id} title={video.title} creator={video.creator} nbView={video.nbView} poster={video.poster} />
        ))}
      </div>
    );
  }
}

export default HomePage;
