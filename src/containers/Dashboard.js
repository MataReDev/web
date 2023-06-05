import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

export const data = {
  labels: ["J-7", "J-6", "J-5", "J-4", "J-3", "J-2", "Hier"],
  datasets: [
    {
      label: "Nombre de vues",
      data: [
        Math.random() * 1000000,
        Math.random() * 1000000,
        Math.random() * 1000000,
        Math.random() * 1000000,
        Math.random() * 1000000,
        Math.random() * 1000000,
        Math.random() * 1000000,
      ],
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

async function fetchNbUser() {
  // try {
  //   const response = await fetch("/api/nbUser");
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error(
  //     "Erreur lors de la récupération du nombre d'utilisateurs :",
  //     error
  //   );
  //   return null;
  // }
}

async function fetchNbVideo() {
  // try {
  //   const response = await fetch("/api/nbVideo");
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error(
  //     "Erreur lors de la récupération du nombre de vidéos :",
  //     error
  //   );
  //   return null;
  // }
}

async function fetchNbVues7LastDay() {
  // try {
  //   const response = await fetch("/api/nbVideo");
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error(
  //     "Erreur lors de la récupération du nombre de vidéos :",
  //     error
  //   );
  //   return null;
  // }
}

function Dashboard() {
  const [userCount, setUserCount] = useState(500);
  const [videoCount, setVideoCount] = useState(137);
  const [view7lastdays, setView7lastdays] = useState(5343);

  useEffect(() => {
    // async function fetchData() {
    //   const nbUser = await fetchNbUser();
    //   const nbVideo = await fetchNbVideo();
    //   const nbVue7DerniersJour = await fetchNbVues7LastDay();
    //   if (nbUser != null) setUserCount(nbUser);
    //   if (nbVideo != null) setVideoCount(nbVideo);
    //   if (nbVue7DerniersJour != null) setView7lastdays(nbVue7DerniersJour);
    // }
    // fetchData();
  }, []);

  return (
    <div className="bg-gray-100 p-5">
      <Helmet>
        <meta charSet="utf-8" />
        <title>iSee - Dashboard</title>
      </Helmet>
      <div className="flex flex-col md:flex-row md:justify-between gap-4 p-5">
        <div className="bg-white rounded-md shadow-md p-5 w-full md:w-1/3">
          <h2 className="text-lg font-bold mb-3">Comptes utilisateurs</h2>
          <p className="text-4xl font-bold">{userCount}</p>
        </div>
        <div className="bg-white rounded-md shadow-md p-5 w-full md:w-1/3">
          <h2 className="text-lg font-bold mb-3">Vidéos</h2>
          <p className="text-4xl font-bold">{videoCount}</p>
        </div>
        <div className="bg-white rounded-md shadow-md p-5 w-full md:w-1/3">
          <h2 className="text-lg font-bold mb-3">
            Vues sur les vidéos (7 derniers jours)
            <p className="text-4xl font-bold">{view7lastdays}</p>
          </h2>
        </div>
      </div>
      <div className="p-10 bg-white rounded-md shadow-lg p-5 w-full">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}

export default Dashboard;
