import React from "react";

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
      text: "Nombre de vues",
    },
  },
};

export const data = {
  labels: ["J-7", "J-6", "J-5", "J-4", "J-3", "J-2", "Hier"],
  datasets: [
    {
      label: "Nombre de vues",
      data: [
        Math.random() * 1000,
        Math.random() * 1000,
        Math.random() * 1000,
        Math.random() * 1001,
        Math.random() * 1000,
        Math.random() * 1000,
        Math.random() * 1000,
      ],
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

export default function VideoChart() {
  return <Line options={options} data={data} />;
}
