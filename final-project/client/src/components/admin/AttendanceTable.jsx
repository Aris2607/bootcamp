import React, { useState, useEffect } from "react";
import { getData } from "../../services/Api";

const SkeletonRow = () => (
  <tr>
    <td className="animate-pulse bg-gray-300 h-6 w-48"></td>
    {Array.from({ length: 31 }, (_, i) => (
      <td key={i} className="animate-pulse bg-gray-300 h-6 w-10"></td>
    ))}
  </tr>
);

const SkeletonLoader = () => (
  <table className="w-full text-left">
    <thead>
      <tr>
        <th className="h-6 animate-pulse bg-gray-300"></th>
        {Array.from({ length: 31 }, (_, i) => (
          <th key={i} className="animate-pulse bg-gray-300 h-6 w-10"></th>
        ))}
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: 8 }, (_, i) => (
        <SkeletonRow key={i} />
      ))}
    </tbody>
  </table>
);

export default function AttendanceTable() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [visibleData, setVisibleData] = useState(5);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [loading, setLoading] = useState(true); // Add loading state
  const currentYear = new Date().getFullYear();

  const fetchAttendanceData = async (month) => {
    setLoading(true); // Set loading to true
    try {
      const monthStr = month.toString().padStart(2, "0"); // Ensure month is two digits
      const response = await getData(`/attendance/${currentYear}-${monthStr}`);
      console.log(response);
      setAttendanceData(response);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    fetchAttendanceData(selectedMonth);
  }, [selectedMonth]);

  const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();

  const isWeekend = (day) => {
    const date = new Date(currentYear, selectedMonth - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 6 || dayOfWeek === 0;
  };

  const handleLoadMore = () => {
    setVisibleData((prevVisibleData) => prevVisibleData + 8);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value)); // Update selected month
  };

  const getMonthName = (month) => {
    return new Date(currentYear, month - 1, 1)
      .toLocaleString("default", { month: "long" })
      .toUpperCase();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mx-2 pb-3 mt-4 dark:bg-gray-600">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-white">
          ATTENDANCE - {getMonthName(selectedMonth)} {currentYear}
        </h2>
        <select
          className="border p-1 mb-4 rounded-full dark:bg-gray-400"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {getMonthName(i + 1)}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <SkeletonLoader /> // Show skeleton while loading
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Employee</th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th
                    key={i + 1}
                    className={
                      isWeekend(i + 1)
                        ? "bg-red-200 text-white text-center"
                        : "text-center"
                    }
                  >
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceData && attendanceData.length > 0 ? (
                attendanceData
                  .slice(0, visibleData)
                  .filter((employee) => employee.first_name) // Pastikan first_name ada
                  .sort((a, b) =>
                    (a.first_name || "").localeCompare(b.first_name || "")
                  ) // Tambahkan fallback
                  .map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        {employee.first_name} {employee.last_name}
                      </td>
                      {Array.from({ length: daysInMonth }, (_, day) => {
                        const attendance = employee.Attendances?.find(
                          (att) => new Date(att.date).getDate() === day + 1
                        );
                        return (
                          <td
                            key={day}
                            className={
                              isWeekend(day + 1)
                                ? "bg-red-200 text-white text-center"
                                : "text-center"
                            }
                          >
                            {attendance ? (
                              attendance.status === "On Time" ||
                              attendance.status === "Late" ? (
                                <span className="flex justify-center text-center font-semibold">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fill={
                                        localStorage.getItem("theme") === "dark"
                                          ? "skyblue"
                                          : "green"
                                      }
                                      d="M8.294 16.998c-.435 0-.847-.203-1.111-.553L3.61 11.724a1.39 1.39 0 0 1 .27-1.951a1.39 1.39 0 0 1 1.953.27l2.351 3.104l5.911-9.492a1.396 1.396 0 0 1 1.921-.445c.653.406.854 1.266.446 1.92L9.478 16.34a1.39 1.39 0 0 1-1.12.656z"
                                    />
                                  </svg>
                                </span>
                              ) : (
                                <span className="text-red-500 font-semibold">
                                  X
                                </span>
                              )
                            ) : (
                              <span className="text-gray-500 dark:text-white">
                                -
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={daysInMonth + 1}
                    className="text-center text-gray-500 flex justify-center items-center w-full"
                  >
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {visibleData < attendanceData.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
