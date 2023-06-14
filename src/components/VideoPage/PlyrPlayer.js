import React, { useEffect, useRef } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

const VideoPlayer2 = ({ options, video }) => {
  const videoRef = useRef();
  const playerRef = useRef(null);

  useEffect(() => {
    const player = videoRef.current.plyr;
    const playerT = playerRef.current;

    console.log(player);
    console.log(playerT);

    if (player) {
      // Vous pouvez personnaliser le lecteur Plyr ici
      // Exemple: player.play() pour lire automatiquement la vidéo
      //   player.play(); // Lecture automatique
    }
  });

  const videoPath = video.video_path;

  const plyrProps = {
    source: {
      type: "video",
      sources: [
        {
          src: videoPath,
          type: "video/mp4",
          size: "576", // qualité par défaut
        },
        {
          src: videoPath,
          type: "video/mp4",
          size: "1080", // autre qualité disponible
        },

        // Ajoutez d'autres sources si nécessaire (par exemple, différents formats de vidéo)
      ],
    },
    options: {
      // Spécifiez les options Plyr si nécessaire
      controls: [
        "play-large", // The large play button in the center
        "restart", // Restart playback
        "rewind", // Rewind by the seek time (default 10 seconds)
        "play", // Play/pause playback
        "fast-forward", // Fast forward by the seek time (default 10 seconds)
        "progress", // The progress bar and scrubber for playback and buffering
        "current-time", // The current time of playback
        "duration", // The full duration of the media
        "mute", // Toggle mute
        "volume", // Volume control
        "settings", // Settings menu
        "pip", // Picture-in-picture (currently Safari only)
        "fullscreen",
      ], // Toggle fullscreen,

      settings: ["captions", "quality", "speed", "loop"], // Ajout des paramètres supplémentaires
      // ... autres options Plyr
      autoplay: true,
      quality: {
        default: '576', // qualité par défaut
        options: ['576', '1080'], // autres options de qualité disponibles
      },
      captions: {
        active: true, // Activer les sous-titres
        languages: [
          {
            language: 'fr',
            label: 'Français',
            default: true,
          },
          {
            language: 'en',
            label: 'English',
            default: false,
          },
          // Ajoutez d'autres langues selon vos besoins
        ],
        update: true, // Mettre à jour les sous-titres en fonction de la langue sélectionnée
      },
      
    },

    // source: videoSrc, // https://github.com/sampotts/plyr#the-source-setter
    // options: options, // https://github.com/sampotts/plyr#options
    // Direct props for inner video tag (mdn.io/video)
  };

  return (
    <div>
      <Plyr ref={videoRef} {...plyrProps} />
    </div>
  );
};

export default VideoPlayer2;
