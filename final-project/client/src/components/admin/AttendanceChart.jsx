import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";

Chart.register(ArcElement);

// Plugin to display text in the center of the doughnut chart
const centerTextPlugin = (totalEmployees) => {
  console.log("Total employees:", totalEmployees);

  return {
    id: "centerText",
    beforeDraw: (chart) => {
      const { width, height, ctx } = chart;
      ctx.restore();
      const fontSize = (height / 114).toFixed(2);
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = "middle";

      // Ensure totalEmployees is not null or undefined
      const text1 = totalEmployees ? `${totalEmployees}` : "0"; // Fallback to "0" if null/undefined
      const textX = Math.round((width - ctx.measureText(text1).width) / 2);
      const textY = height / 2 - 10; // Adjust `-10` for vertical spacing

      ctx.fillText(text1, textX, textY);

      // Text for the label "Total Employees"
      const text2 = "Employees";
      ctx.font = `${(fontSize / 1.5).toFixed(2)}em sans-serif`; // Smaller font for the label
      const textX2 = Math.round((width - ctx.measureText(text2).width) / 2);
      ctx.fillText(text2, textX2, textY + 20); // Adjust `+20` for vertical spacing

      ctx.save();
    },
  };
};

const AttendanceChart = ({ absent, present, notFilled, totalEmployees }) => {
  const data = {
    labels: ["Absent", "Present", "Not Filled"],
    datasets: [
      {
        data: [absent, present, notFilled],
        backgroundColor: ["#FF2424", "#22C55E", "#CCC"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "70%", // This will make the doughnut chart with a larger hole
    plugins: {
      legend: {
        display: false, // Hide legend if not needed
      },
    },
  };

  console.log("Employees:", totalEmployees); // Check if totalEmployees is correctly passed

  return (
    <div className="w-full max-w-xs mx-auto">
      {totalEmployees && (
        <Doughnut
          data={data}
          options={options}
          plugins={[centerTextPlugin(totalEmployees)]}
        />
      )}
    </div>
  );
};

export default AttendanceChart;
