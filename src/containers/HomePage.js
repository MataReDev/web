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
    makeRequest("/api/videos", "GET", null, null, null, true)
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
