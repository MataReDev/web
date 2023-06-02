import React, { Component } from "react";
import VideoCard from "../components/Home/VideoCard";
import { Helmet } from "react-helmet";

import { listOfVideo } from "./videoData";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: listOfVideo,
    };
  }

 // componentDidMount() {



  //   fetch("/api/videos/getAll")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       this.setState({ videos: data });
  //     })
  //     .catch((error) => {
  //       console.error("Erreur lors de la récupération des données :", error);
  //     });
  // }

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
