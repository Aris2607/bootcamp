import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Plugin kustom untuk menonjolkan potongan
const pullOutPlugin = {
  id: "pullOutPlugin",
  beforeDatasetDraw(chart, args, options) {
    const meta = chart.getDatasetMeta(0); // Mengambil data dari dataset pertama
    meta.data.forEach((arc, index) => {
      if (index === 0) {
        // Misal: Menonjolkan potongan pertama
        arc.options.offset = 100; // Menambahkan offset pada potongan pertama
      }
    });
  },
};

// Registrasi komponen Chart.js (tanpa plugin)
ChartJS.register(ArcElement, Tooltip, Legend);

const isDark = localStorage.getItem("theme") === "dark";

const PieChart = ({ absent = 0, present = 1 }) => {
  const data = {
    labels: ["Absent", "Present"],
    datasets: [
      {
        label: "# of Days",
        data: [absent, present],
        backgroundColor: isDark
          ? ["rgba(220,20,60,.9)", "rgba(0,100,0,.9)"]
          : ["rgba(255,31,31, .9)", "rgba(87,255,65, .9)"],
        borderColor: isDark
          ? ["rgba(220,20,60,.9)", "rgba(0,100,0,.9)"]
          : ["rgba(255,31,31, .9)", "rgba(87,255,65, .9)"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Set false untuk mengontrol ukuran chart
    layout: {
      padding: {
        top: 50, // Tambahkan padding pada bagian atas
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      pullOutPlugin: {}, // Daftarkan plugin hanya di sini
    },
  };

  return (
    <div className="w-60 h-60">
      <Pie data={data} options={options} /> {/* Tambahkan plugin di sini */}
    </div>
  );
};

export default PieChart;
