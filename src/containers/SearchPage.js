import React, { useEffect, useState } from "react";
import makeRequest from "../Utils/RequestUtils";
import VideoCard from "../components/Home/VideoCard";

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const searchValue = new URLSearchParams(window.location.search).get("query");

  const searchVideo = (searchValue) => {
    makeRequest(
      `api/videos/search/${searchValue}`,
      "GET",
      null,
      null,
      null,
      false
    )
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    // Effectue la recherche au chargement de la page si une valeur de recherche est déjà présente
    if (searchValue !== "") {
      searchVideo(searchValue);
    }
  }, []);

  return (
    <div>
      <div className="text-center text-2xl font-bold my-4">{`Résultat pour : "${searchValue}"`}</div>

      <div className="flex flex-wrap justify-center">
        {searchResults.map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
      </div>
    </div>
  );
}
