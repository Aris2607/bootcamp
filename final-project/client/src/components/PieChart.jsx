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

const PieChart = () => {
  const data = {
    labels: ["Not Attend", "Attend"],
    datasets: [
      {
        label: "# of Days",
        data: [4, 26],
        backgroundColor: ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)"],
        borderColor: ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)"],
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
      <Pie data={data} options={options} plugins={[pullOutPlugin]} />{" "}
      {/* Tambahkan plugin di sini */}
    </div>
  );
};

export default PieChart;
