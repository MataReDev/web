import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import makeRequest from "../../Utils/RequestUtils";
import VideoCard from "../Home/VideoCard";
import ScrollArrow from "../ScrollArrow";

export default function PublicChannel({ username }) {
  const [videos, setVideos] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [channel, setChannel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //Scroll
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  //Scroll

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setScrollPosition(scrollTop);

      const targetDiv = document.querySelector("#Cards-elements");
      if (!targetDiv) return;

      const targetDivRect = targetDiv.getBoundingClientRect();
      if (targetDivRect.bottom <= window.innerHeight - 2) return;

      if (!loading) {
        const state = { scrollPosition: scrollTop, videos: videos };
        setLoading(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading]);

  const getUserInfo = async (username) => {
    if (hasMore) {
      await makeRequest(
        `api/users/channel/${username}`,
        "GET",
        null,
        null,
        null,
        false
      )
        .then((data) => {
          setChannel(data);
          getUserVideo(data.id);
        })
        .catch((error) => console.error(error));
    }
  };

  const getUserVideo = async (userId) => {
    setIsLoading(true);
    try {
      const page = Math.ceil(videos.length / 24) + 1;
      const response = await makeRequest(
        `api/videos/user/${userId}?page=${page}&perPage=24`,
        "GET",
        null,
        null,
        null,
        false
      );
      if (response.length > 0) {
        setVideos((prevVideos) => [...prevVideos, ...response]);
      } else setHasMore(false);
    } catch (error) {
      setHasMore(false);
      console.error(error);
    }

    setLoading(false);
    setIsLoading(false);
  };

  useEffect(() => {
    // Vérifier si les données des vidéos sont présentes dans l'état de l'historique

    if (window.history && window.history?.state?.videos?.length > 0) {
      setVideos(window.history?.state?.videos);
      if (window.history.state?.scrollPosition != undefined) {
        const parsedScrollPosition = parseInt(
          window.history.state?.scrollPosition
        );
        if (!isNaN(parsedScrollPosition)) {
          setTimeout(() => {
            window.scrollTo(0, parsedScrollPosition);
          }, 0);
        }
      }
    } else {
      setVideos([]);
      // Charger les données des vidéos depuis l'API
      setLoading(true);
    }
  }, [location]);

  useEffect(() => {
    let timeoutId;
    if (!loading) return;
    const data = async () => {
      timeoutId = setTimeout(async () => {
        await getUserInfo(username);
      }, 500);
    };
    data();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [loading]);

  useEffect(() => {
    const state = { scrollPosition: scrollPosition, videos: videos };
  }, [videos]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        setVideos(event.state.videos);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleClickVideo = (video_id) => {
    const state = { scrollPosition: scrollPosition, videos: videos };

    window.history.pushState(state, "", window.location.href);
    navigate(`/video/${video_id}`, { replace: false, relative: true });
  };

  // Exemple de récupération des vidéos depuis une API
  // useEffect(() => {
  //   getUserInfo(username);
  // }, []);

  return (
    <div className="bg-gray-100 h-full-win" id="Cards-elements">
      <img
        className="w-full h-[220px] bg-cover bg-center"
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
        <h2 className="text-black">Videos from {channel.username}</h2>
        <div className="flex flex-wrap justify-center" ref={containerRef}>
          {videos &&
            videos.map((video, index) => (
              <VideoCard
                key={index}
                video={video}
                onClick={() => handleClickVideo(video._id)}
              />
            ))}
        </div>
        {hasMore && loading ? (
          <div data-testid="loadMore" className="relative flex">
            <div className="absolute  bottom-0 w-full flex justify-center items-center">
              <div className="border-t-transparent border-solid animate-spin  rounded-full border-slate-400 border-8 h-10 w-10"></div>
            </div>
          </div>
        ) : (
          ""
        )}
        <ScrollArrow />
      </div>
    </div>
  );
}
