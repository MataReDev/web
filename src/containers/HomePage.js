import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useLocation } from "react-router-dom";
import VideoCard from "../components/Home/VideoCard";
import makeRequest from "../Utils/RequestUtils";
import ScrollArrow from "../components/ScrollArrow";

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const page = Math.ceil(videos.length / 24) + 1;
      const response = await makeRequest(
        `api/videos/getAll?page=${page}&perPage=24`,
        "GET",
        null,
        null,
        null,
        true
      );
      if (response.length > 0) {
        setVideos((prevVideos) => [...prevVideos, ...response]);
      } else setHasMore(false);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
    setIsLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.location.pathname === "/") {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        setScrollPosition(scrollTop);

        const targetDiv = document.querySelector("#Cards-elements");
        if (!targetDiv) return;

        const targetDivRect = targetDiv.getBoundingClientRect();

        if (targetDivRect.bottom <= window.innerHeight -2) return;

        if (!loading) {
          const state = { scrollPosition: scrollTop, videos: videos };
          setLoading(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading]);

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
        await fetchVideos();
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
  navigate(`/video/${video_id}`, {replace: false, relative: true});

};

  return (
    <>
      <div
        id="Cards-elements"
        className="flex flex-wrap justify-center"
        ref={containerRef}
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title>iSee - Home</title>
        </Helmet>

        {videos?.map((item, index) => (
          <VideoCard
            key={index}
            video={item}
            onClick={() => handleClickVideo(item._id)}
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
    </>
  );
};

export default HomePage;
