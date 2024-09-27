import React from "react";
import LineChart from "./LineChart";

const MonthlyReport = () => {
  const monthlyData = [
    { date: "2024-09-01", present: 20, leave: 2, absent: 3 },
    { date: "2024-09-02", present: 22, leave: 1, absent: 5 },
    // Tambahkan data untuk seluruh bulan
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Attendance Report</h1>
      <LineChart data={monthlyData} />
      {/* Anda dapat menambahkan tabel atau komponen lain di sini */}
    </div>
  );
};

export default MonthlyReport;
