import React, { useState, useEffect } from "react";
import { getData } from "../../services/Api";
import AttendanceReportChart from "../AttendanceReportChart";

export default function AttendanceReport() {
  const [result, setResult] = useState(null);

  const fetchAttendanceSummary = async () => {
    try {
      const response = await getData("/employee/5/attendance/summary/2024");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttendanceMonthlyRecap = async () => {
    try {
      const response = await getData(
        "/employee/5/attendance/recap/monthly/2024"
      );
      console.log("Monthly recap:", response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAttendanceSummary();
    fetchAttendanceMonthlyRecap();
  }, []);

  return (
    <div className="bg-white mr-3 p-6 rounded-lg shadow dark:bg-gray-600">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-white">
        YEARLY ATTENDANCE REPORT
      </h2>
      <div className="relative h-40">
        <AttendanceReportChart
          attendanceData={[20, 25, 30, 100, 32, 29, 24, 30, 31, 0, 0, 0]}
        />
      </div>
    </div>
  );
}
