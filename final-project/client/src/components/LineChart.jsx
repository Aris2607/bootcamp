import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const LineChart = () => {
  // Contoh data bulanan
  const data = [
    { date: "2024-09-02", present: 18, leave: 7, absent: 1 },
    { date: "2024-09-03", present: 22, leave: 2, absent: 3 },
    { date: "2024-09-04", present: 25, leave: 0, absent: 5 },
    { date: "2024-09-05", present: 19, leave: 3, absent: 4 },
    { date: "2024-09-06", present: 21, leave: 1, absent: 2 },
    { date: "2024-09-09", present: 22, leave: 0, absent: 5 },
    { date: "2024-09-10", present: 24, leave: 1, absent: 2 },
    { date: "2024-09-11", present: 20, leave: 5, absent: 2 },
    { date: "2024-09-12", present: 18, leave: 7, absent: 1 },
    { date: "2024-09-13", present: 22, leave: 2, absent: 3 },
    { date: "2024-09-16", present: 21, leave: 1, absent: 2 },
    { date: "2024-09-17", present: 23, leave: 4, absent: 1 },
    { date: "2024-09-18", present: 20, leave: 2, absent: 3 },
    { date: "2024-09-09", present: 22, leave: 0, absent: 5 },
    { date: "2024-09-19", present: 24, leave: 1, absent: 2 },
    { date: "2024-09-20", present: 20, leave: 5, absent: 2 },
    { date: "2024-09-23", present: 18, leave: 7, absent: 1 },
    { date: "2024-09-24", present: 22, leave: 2, absent: 3 },
    { date: "2024-09-25", present: 25, leave: 0, absent: 5 },
    { date: "2024-09-26", present: 19, leave: 3, absent: 4 },
  ];

  // Process data to prepare for the chart
  const labels = [];
  const presentData = [];
  const leaveData = [];
  const absentData = [];

  data.forEach((entry) => {
    labels.push(entry.date);
    presentData.push(entry.present);
    leaveData.push(entry.leave);
    absentData.push(entry.absent);
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Present",
        data: presentData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Leave",
        data: leaveData,
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Absent",
        data: absentData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Make the chart responsive
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Count",
        },
      },
    },
  };

  return (
    <div className="shadow-lg p-4 rounded-md bg-white dark:bg-slate-600 h-full">
      <h2 className="text-xl font-semibold mb-4">Monthly Attendance</h2>
      <Line data={chartData} options={options} height={300} />{" "}
      {/* Set height if needed */}
    </div>
  );
};

export default LineChart;
