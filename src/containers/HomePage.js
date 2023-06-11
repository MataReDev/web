import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import VideoCard from "../components/Home/VideoCard";
import makeRequest from "../Utils/RequestUtils";
import ScrollArrow from "../components/ScrollArrow";
const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isRedirectedRef = useRef(false); // Utilisation d'une référence pour suivre si la redirection a déjà été effectuée
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchVideos = async () => {

    setIsLoading(true);
    try {
      const page = Math.ceil(videos.length / 3) + 1;
      const response = await makeRequest(
        `api/videos/getAll?page=${page}&perPage=3`,
        "GET",
        null,
        null,
        null,
        true
      );
      console.log("setvideo reponse", response);
      if (response.length > 0) {
        setVideos((prevVideos) => [...prevVideos, ...response]);
      }
      else setHasMore(false);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
    setIsLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      console.log("scroll");

      // if (containerRef.current) {
      //   const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
      //   console.log(scrollTop + clientHeight >= scrollHeight - 1 && !isLoading);
      //   if (scrollTop + clientHeight >= scrollHeight - 1 && !isLoading) {
      //     fetchVideos();
      //   }
      // }
       const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

       setScrollPosition(scrollTop);

      const targetDiv = document.querySelector("#Cards-elements");
      if (!targetDiv) return;

      const targetDivRect = targetDiv.getBoundingClientRect();
      
      if (targetDivRect.bottom <= window.innerHeight + 3) return;

      if (!loading) {
        window.history.pushState(
          { scrollPosition: window.innerHeight, videos },
          "",
          window.location.href
        );
        setLoading(true);
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
      console.log("setVideos...");
      console.log("state :", window.history.state);
      setVideos(window.history?.state?.videos);
      console.log(
        "window.history.state?.scrollPosition",
        window.history.state?.scrollPosition
      );
      if (window.history.state?.scrollPosition != undefined) {
        const parsedScrollPosition = parseInt(
          window.history.state?.scrollPosition
        );
        console.log("parsedScrollPosition:", parsedScrollPosition);
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
    const state = { scrollPosition: scrollPosition, videos : videos };

    window.history.pushState(state, "", window.location.href);
  }, [videos]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        setVideos(event.state.videos);
        isRedirectedRef.current = true;
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <>
      <div
        id="Cards-elements"
        className="flex flex-wrap justify-center"
        ref={containerRef}
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title>iSee - Accueil</title>
        </Helmet>

        {videos.map((item, index) => (
          <VideoCard video={item} />
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
