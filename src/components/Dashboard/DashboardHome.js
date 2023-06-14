import React, { useState, useEffect } from "react";
import makeRequest from "../../Utils/RequestUtils";

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

function DashboardHome() {
  const [userCount, setUserCount] = useState("");
  const [videoCount, setVideoCount] = useState("");
  const [videoTotalSize, setVideoTotalSize] = useState("");
  

  const formatSize = (size) => {
    if (size < 1024) {
      return size + " octets";
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + " Ko";
    } else if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + " Mo";
    } else if (size < 1024 * 1024 * 1024 * 1024) {
      return (size / (1024 * 1024 * 1024)).toFixed(2) + " Go";
    } else {
      return (size / (1024 * 1024 * 1024 * 1024)).toFixed(2) + " To";
    }
  }
  

  useEffect(() => {
    makeRequest("api/dashboard/getNbUser", "GET", null, null, null, true)
      .then((data) => {
        setUserCount(data.nbUsers);
      })
      .catch((error) => console.error(error));

    makeRequest("api/dashboard/getNbVideoUpload", "GET", null, null, null, true)
      .then((data) => {
        setVideoCount(data.nbVideos);
      })
      .catch((error) => console.error(error));

    makeRequest("api/dashboard/getSizeVideoUpload", "GET", null, null, null, true)
      .then((data) => {
        setVideoTotalSize(formatSize(data.totalSize))
      })
      .catch((error) => console.error(error))
  }, []);


  return (
    <div>
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
            Taille vidéo totale
            <p className="text-4xl font-bold">{videoTotalSize}</p>
          </h2>
        </div>
      </div>
      <div className="p-10 bg-white rounded-md shadow-lg w-full">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}

export default DashboardHome;
