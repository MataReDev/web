import React, { useState } from "react";
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
    },
  ],
};

function Dashboard() {
  const [userCount, setUserCount] = useState(500);
  const [videoCount, setVideoCount] = useState(1234);

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
            Vues sur les vidéos (7 derniers jours)
          </h2>
        </div>
      </div>
      <div className="">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}

export default Dashboard;
