import React, { useEffect, useState } from "react";
import { getData } from "../../services/Api";
import { useSelector } from "react-redux";
import UserNav from "../../components/navbars/UserNav";
import AdminNav from "../../components/navbars/AdminNav";
import { Link } from "react-router-dom";

const AttendanceHistory = ({ employeeId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-based month
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        const response = await getData(
          `/attendance/${user.employee_id}/${year}/${month}`
        );
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [employeeId, year, month]);

  function formatWorkHours(hours) {
    if (!hours || hours <= 0) {
      return "0 hours";
    }

    const totalSeconds = hours * 3600; // Convert hours to seconds
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);

    const formattedHours = hrs > 0 ? `${hrs} hour${hrs > 1 ? "s" : ""}` : "";
    const formattedMinutes =
      mins > 0 ? `${mins} minute${mins > 1 ? "s" : ""}` : "";
    const formattedSeconds =
      secs > 0 ? `${secs} second${secs > 1 ? "s" : ""}` : "";

    return `${formattedHours} ${formattedMinutes} ${formattedSeconds}`.trim();
  }

  console.log("ATTENDANCE DATA:", attendanceData);

  return (
    <div className="bg-gray-100 dark:bg-slate-900">
      <AdminNav title={""} />
      <div className="container bg-gray-100 h-screen mx-auto mt-14 py-4 dark:bg-slate-900">
        <Link
          to={"/dashboard"}
          className="font-bold hover:text-slate-400 dark:text-white dark:hover:text-slate-400"
        >
          &larr;Back
        </Link>
        <h1 className="text-xl font-bold mb-4 dark:text-white">
          Attendance History
        </h1>

        {/* Select year and month */}
        <div className="mb-4 flex space-x-4">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-white-300 p-2 rounded dark:bg-slate-600 dark:text-white"
          >
            {/* Example: dynamically generate options for year */}
            {[2022, 2023, 2024].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-gray-300 p-2 rounded dark:bg-slate-600 dark:text-white"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-4 dark:bg-slate-600">
          <h3 className="text-lg font-semibold dark:text-white">
            Attendance Summary for{" "}
            {new Date(year, month - 1).toLocaleString("default", {
              month: "long",
            })}{" "}
            {year}
          </h3>
          <ul className="mt-2 space-y-2">
            <li className=" dark:text-white">
              <strong>Total Days Worked:</strong>{" "}
              {attendanceData &&
                attendanceData.filter(
                  (data) => data.status === "Late" || data.status === "On Time"
                ).length}
            </li>
            <li className=" dark:text-white">
              <strong>Total Late Days:</strong>{" "}
              {attendanceData &&
                attendanceData.filter((data) => data.status === "Late").length}
            </li>
            <li className=" dark:text-white">
              <strong>Average Work Hours:</strong> 0 hours 45 minutes
            </li>
          </ul>
        </div>

        {/* Loading State */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="shadow-md p-4 rounded-md bg-white dark:bg-slate-600">
            <table className="table-auto p-2 w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-white dark:text-white">
                  <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                    Date
                  </th>
                  <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                    Time In
                  </th>
                  <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                    Time Out
                  </th>
                  <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                    Status
                  </th>
                  <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                    Total Work Hours
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceData && attendanceData.length > 0 ? (
                  attendanceData.map((attendance, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2 dark:text-white">
                        {attendance.date}
                      </td>
                      <td className="border px-4 py-2 dark:text-white">
                        {attendance.time_in || "-"}
                      </td>
                      <td className="border px-4 py-2 dark:text-white">
                        {attendance.time_out || "-"}
                      </td>
                      <td
                        className={`border px-4 py-2 dark:text-white ${
                          attendance.status === "Late" ? "text-red-500" : ""
                        }`}
                      >
                        {attendance.status}
                      </td>
                      <td className="border px-4 py-2 dark:text-white">
                        {attendance.total_hours &&
                          formatWorkHours(attendance.total_hours)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center dark:text-white">
                      There&apos;s no attendance in this month
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistory;
