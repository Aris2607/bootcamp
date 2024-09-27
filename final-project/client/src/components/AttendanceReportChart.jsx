import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AttendanceReportChart = ({ attendanceData }) => {
  // Labels for months
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Determine colors based on theme
  const isDarkMode = localStorage.getItem("theme") === "dark";
  const backgroundColor = isDarkMode ? "#38B2AC" : "#60A5FA"; // teal-200
  const borderColor = isDarkMode ? "#2C7A7B" : "#3B82F6"; // Darker teal for border

  // Chart data configuration
  const data = {
    labels,
    datasets: [
      {
        label: "Attendance",
        data: attendanceData,
        backgroundColor, // Use the determined background color
        borderColor, // Use the determined border color
        borderWidth: 1,
      },
    ],
  };

  // Chart options configuration
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to adjust to container's size
    plugins: {
      legend: { display: false }, // Disable legend
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 150, // Maximum value on the y-axis (adjust if necessary)
        ticks: {
          stepSize: 50, // Step between values on y-axis
          color: isDarkMode ? "white" : "black", // Set tick color based on theme
        },
        grid: {
          display: false,
        },
      },
      x: {
        barPercentage: 0.8, // Adjust the width of the bars (0 to 1)
        categoryPercentage: 0.8, // Adjust the spacing between the bars (0 to 1)
        ticks: {
          color: isDarkMode ? "white" : "black", // Set tick color based on theme
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full h-full dark:text-white">
      {/* Ensures full width and height of container */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default AttendanceReportChart;
