import React from "react";
import { Pie } from "react-chartjs-2"; // Change Doughnut to Pie
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "tailwindcss/tailwind.css";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const LeaveStatistics = ({ rejectedLeaves, pendingLeaves, approvedLeaves }) => {
  const data = {
    labels: [
      `Rejected: ${rejectedLeaves}`,
      `Pending: ${pendingLeaves}`,
      `Approved: ${approvedLeaves}`,
    ],
    datasets: [
      {
        label: "# Leaves",
        data: [rejectedLeaves, pendingLeaves, approvedLeaves],
        backgroundColor: [
          "rgba(255, 99, 132)",
          "rgba(255, 206, 86)",
          "rgba(75, 192, 192)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, // Ensure the chart is responsive
    plugins: {
      legend: {
        position: "left",
      },
    },
  };

  return (
    <div className="max-w-xs mx-auto mt-2 flex justify-end">
      <div className="relative w-1/2]">
        {/* Use Pie component instead of Doughnut */}
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default LeaveStatistics;
