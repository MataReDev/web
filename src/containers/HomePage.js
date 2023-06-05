import React, { Component } from "react";
import VideoCard from "../components/Home/VideoCard";
import { Helmet } from "react-helmet";

import makeRequest from "../Utils/RequestUtils";

import { listOfVideo } from "./videoData";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
    };
  }

  componentDidMount() {
    makeRequest("api/videos/getAll", "GET", null, null, null, true)
      .then(response => {
        this.setState({ videos: response });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="flex flex-wrap justify-center">
        <Helmet>
          <meta charSet="utf-8" />
          <title>iSee - Accueil</title>
        </Helmet>
        {this.state.videos.map((video) => (
          <VideoCard
            key={video._id}
            video={video.video_path}
            idVideo={video._id}
            title={video.title}
            creator={video.ownerId}
            nbView={video.views}
            poster={video.thumbnail_path}
          />
        ))}
      </div>
    );
  }
}

export default HomePage;
