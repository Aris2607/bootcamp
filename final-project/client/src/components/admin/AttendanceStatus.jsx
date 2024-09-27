import React, { useState, useEffect } from "react";
import { createData, getData } from "../../services/Api";
import { format } from "date-fns";
import user from "../../components/icons/user-trust.png";
import AttendanceChart from "./AttendanceChart";

export default function AttendanceStatus() {
  const [attendances, setAttendances] = useState(null);
  const [employees, setEmployees] = useState(null);

  const fetchAttendance = async () => {
    const date = format(new Date(), "yyyy-MM-dd");

    console.log("Date:", date);

    try {
      const response = await createData("/employees/attendance/record/daily", {
        date,
      });
      setAttendances(response);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getData("/employees");
      setEmployees(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  console.log("Attendance:", attendances);
  console.log("Employees:", employees);

  const date = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .replace(/\//g, "-");
  const date2 = new Date().toLocaleDateString("en-US").replace(/\//g, "-");
  console.log("TODAYSS:", date);
  console.log("TODAYS DATE:", date2);

  const date3 = new Date();
  const year = date3.getFullYear();
  const month = String(date3.getMonth() + 1).padStart(2, "0");
  const day = String(date3.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate);

  console.log(
    "AMERICA:",
    new Date().toLocaleDateString("en-US", { weekday: "long" })
  );
  const dataaa = new Date().toLocaleDateString("id-ID").replace(/\//g, "-");

  console.log(
    "ID:",
    new Date(dataaa).toLocaleDateString("id-ID", { weekday: "long" })
  );

  return (
    <>
      {attendances === null || employees === null ? (
        <div className="bg-white ml-3 p-6 rounded-lg shadow dark:bg-gray-600 dark:text-white">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            TODAY&apos;S ATTENDANCE STATUS
          </h2>
          <div className="flex items-center justify-center">
            {/* Skeleton for chart */}
            <div className="relative w-40 h-40 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="mt-4 flex justify-around">
            {/* Skeleton for the attendance text placeholders */}
            <div className="text-gray-700">
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="text-gray-700">
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="text-gray-700">
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white ml-3 p-6 rounded-lg shadow dark:bg-gray-600 ">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-white">
            TODAY&apos;S ATTENDANCE STATUS
          </h2>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40 dark:text-white">
              <AttendanceChart
                absent={
                  attendances
                    ? attendances.filter(
                        (attendance) => attendance.status == "Absent"
                      ).length
                    : "0"
                }
                present={
                  attendances
                    ? attendances.filter(
                        (attendance) =>
                          attendance.status == "On Time" ||
                          attendance.status == "Late"
                      ).length
                    : "0"
                }
                notFilled={
                  attendances && employees
                    ? employees.length - attendances.length
                    : "0"
                }
                totalEmployees={employees && employees.length}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-around">
            <div className="text-gray-700 dark:text-white">
              Absent:{" "}
              {attendances
                ? attendances.filter(
                    (attendance) => attendance.status == "Absent"
                  ).length
                : "0"}
            </div>
            <div className="text-gray-700 dark:text-white">
              Present:{" "}
              {attendances
                ? attendances.filter(
                    (attendance) =>
                      attendance.status == "Late" ||
                      attendance.status == "On Time"
                  ).length
                : "0"}
            </div>
            <div className="text-gray-700 dark:text-white">
              Not Filled Attendance Yet:{" "}
              {attendances && employees
                ? employees.length - attendances.length
                : "0"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
