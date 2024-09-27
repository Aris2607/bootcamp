import React, { useEffect, useState } from "react";
import { createData } from "../../services/Api";
import ReportTable from "../../components/ReportTable";
import AdminNav from "../../components/navbars/AdminNav";
import FileUpload from "../../components/FileUpload";
import { Link } from "react-router-dom";

export default function ReportPage() {
  const [data, setData] = useState(null);
  const [reportType, setReportType] = useState("daily"); // State untuk tipe laporan
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default tanggal hari ini

  // Fungsi untuk mengambil recap data sesuai tipe laporan
  const getRecapData = async () => {
    try {
      let endpoint = "";

      switch (reportType) {
        case "daily":
          endpoint = "/employees/attendance/recap/daily";
          break;
        case "weekly":
          endpoint = "/employees/attendance/recap/weekly";
          break;
        case "monthly":
          endpoint = "/employees/attendance/recap/monthly";
          break;
        default:
          endpoint = "/employees/attendance/recap/daily";
      }

      const response = await createData(endpoint, { date });
      console.log(response);
      setData(response);
    } catch (error) {
      console.error(error);
    }
  };

  // Panggil fungsi getRecapData setiap kali tipe laporan atau tanggal berubah
  useEffect(() => {
    getRecapData();
  }, [reportType, date]);

  // Handler untuk perubahan pilihan tipe laporan
  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 dark:text-white">
      <AdminNav title={"Admin Dashboard"} />
      <div className="w-full mx-auto overflow-x-auto p-4 pt-24">
        <Link
          to={"/"}
          className="hover:text-sky-400 text-black dark:text-white dark:hover:text-blue-200"
        >
          &larr; Back
        </Link>
        <h2 className="text-2xl font-semibold my-3">ATTENDANCE RECAP</h2>
        <div className="mb-4 flex space-x-4">
          <select
            id="reportType"
            value={reportType}
            onChange={handleReportTypeChange}
            className="border border-white-300 p-2 rounded dark:bg-slate-600 dark:text-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          {/* Input untuk memilih tanggal */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-white-300 p-2 rounded dark:bg-slate-600 dark:text-white"
          />
        </div>
        {reportType === "daily" && (
          <ReportTable type={reportType} data={data} />
        )}
        {(reportType === "weekly" || reportType === "monthly") && (
          <ReportTable type={reportType} data={data} />
        )}
      </div>
    </div>
  );
}
