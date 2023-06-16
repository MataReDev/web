import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import makeRequest from "../../Utils/RequestUtils";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
};

export default function VideoChart() {
  const [duration, setDuration] = useState("7days");
  const [chartType, setChartType] = useState(false);

  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        fill: chartType ? true : false,
        label: "Nombre de vues",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  });

  useEffect(() => {
    makeRequest(
      `api/dashboard/getViewsByDuration?duration=${duration}`,
      "GET",
      null,
      null,
      null,
      true
    )
      .then((response) => {
        const viewsByDate = response.viewsByDate;
        const dates = viewsByDate?.map((view) => formatDate(view.date));
        const cumulativeViews = viewsByDate?.map((view) => view.count);

        setData({
          labels: dates,
          datasets: [
            {
              fill: chartType ? true : false,
              label: `Nombre de vues`,
              data: cumulativeViews,
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
              tension: 0.3,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }, [duration, chartType]);

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  function getDurationLabel(duration) {
    if (duration === "7days") {
      return "7 jours";
    } else if (duration === "30days") {
      return "30 jours";
    } else if (duration === "3months") {
      return "3 mois";
    } else if (duration === "year") {
      return "1 an";
    } else {
      return "";
    }
  }

  function formatDate(date) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  }

  return (
    <div>
      <h2 className="text-center flex-grow-0 flex-shrink-0 text-2xl font-bold mt-4">
        {`Nombre de vue sur ${getDurationLabel(duration)}`}
      </h2>
      <div className="flex justify-between items-center">
        <div className="flex items-center font-bold">
          <span className="mr-2">Type de graphique :</span>
          <select
            className="p-2 mr-2"
            value={chartType ? "area" : "line"}
            onChange={(event) => {
              setChartType(event.target.value === "area");
            }}
          >
            <option value="line">Courbe</option>
            <option value="area">Area</option>
          </select>
        </div>

        <div className="flex items-center font-bold">
          <span className="mr-2">Durée :</span>
          <select
            className="p-2"
            value={duration}
            onChange={handleDurationChange}
          >
            <option value="7days">7 jours</option>
            <option value="30days">30 jours</option>
            <option value="3months">3 mois</option>
            <option value="year">1 an</option>
          </select>
        </div>
      </div>
      <div className="h-[66vh]">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
