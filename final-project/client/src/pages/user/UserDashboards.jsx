/* eslint-disable no-unused-vars */
// ./src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import UserNav from "../../components/navbars/UserNav";
import AttendanceOverview from "../../components/user/AttendanceOverview";
import { useSelector } from "react-redux";
import UserIcon from "../../components/icons/user-trust.png";
import PercentageIcon from "../../components/icons/percentage.png";
import CalendarIcon from "../../components/icons/calendar-check.png";
import DocumentIcon from "../../components/icons/document.png";
import GroupIcon from "../../components/icons/users-alt.png";
import Clock from "../../components/Clock";
import DaysInMonth from "../../components/DaysInMonth";
import { Link } from "react-router-dom";
import { getData } from "../../services/Api";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import AttendanceForm from "./AttendanceForm";
import { showToastAlertWithCustomAnimation } from "../../utils/alert";
import AdminNav from "../../components/navbars/AdminNav";

const Dashboards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [result, setResult] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [totalDays, setTotalDays] = useState(0);
  const auth = useSelector((state) => state.auth);

  const token = Cookies.get("token");

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log("No Token");
  }

  useEffect(() => {
    const showToast = localStorage.getItem("showLoginSuccessToast");

    if (showToast === "true") {
      showToastAlertWithCustomAnimation(
        "Login Successful",
        "success",
        `Welcome ${user.Employee.first_name} ${user.Employee.last_name}`
      );
    }

    localStorage.removeItem("showLoginSuccessToast");

    const fetchAttendance = async () => {
      try {
        const response = await getData(
          `/employee/${user.employee_id}/attendance/record`
        );
        setResult(response);
      } catch (error) {
        console.error(error);
      }
    };

    const getTotalLeave = async () => {
      try {
        const response = await getData(
          `/employee/${user.employee_id}/leave/total`
        );
        setTotalDays(response[0].total_days);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAttendance();
    getTotalLeave();
  }, []);

  function getTimeOfDay(date) {
    const hours = date.getHours();

    if (hours >= 4 && hours < 12) {
      return "Morning";
    } else if (hours >= 12 && hours < 18) {
      return "Afternoon";
    } else if (hours >= 18 && hours < 21) {
      return "Evening";
    } else {
      return "Night";
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-y-hidden dark:bg-slate-900">
      {/* <UserNav /> */}
      <AdminNav title={""} />
      <AttendanceForm
        employeeId={user.employee_id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="container mx-auto mt-14 p-4">
        <div className="flex justify-between bg-">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Hello{" "}
              <span className="text-slate-900 dark:text-white">
                {user.Employee.first_name},
              </span>
            </h1>
            <span className="text-3xl dark:text-white">
              Good {getTimeOfDay(new Date())}
            </span>
          </div>
          <Clock />
        </div>
        <div className="flex justify-evenly mx-4 gap-4 mt-6">
          <div
            onClick={() => setIsModalOpen(true)}
            className="group p-4 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 bg-white text-slate-900 shadow-md w-[150px] rounded-2xl shadow hover:cursor-pointer hover:bg-blue-500 hover:text-white"
          >
            {/* <img
              src={UserIcon}
              alt="user icon"
              className="w-12 fill-blue-300 mx-auto mb-4"
            /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 mx-auto mb-4 fill-current dark:text-white dark:grouop-hover:text-blue-900 text-blue-500 group-hover:text-white transition duration-300 ease-in-out dark:text-white"
              viewBox="0 0 640 512"
            >
              <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128m89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4m323-128.4l-27.8-28.1c-4.6-4.7-12.1-4.7-16.8-.1l-104.8 104l-45.5-45.8c-4.6-4.7-12.1-4.7-16.8-.1l-28.1 27.9c-4.7 4.6-4.7 12.1-.1 16.8l81.7 82.3c4.6 4.7 12.1 4.7 16.8.1l141.3-140.2c4.6-4.7 4.7-12.2.1-16.8" />
            </svg>
            <h3 className=" dark:text-white">Your attendance</h3>
            <p>
              {result ? result.length : ""}/
              <DaysInMonth />
            </p>
          </div>
          <Link
            to={"/attendance-history"}
            className="group p-4 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 bg-white text-slate-900 shadow-md w-[150px] rounded-2xl shadow hover:cursor-pointer hover:bg-blue-500 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 mx-auto mb-4 fill-current dark:text-white dark:grouop-hover:text-blue-900 text-blue-500 group-hover:text-white transition duration-300 ease-in-out"
              viewBox="0 0 640 512"
            >
              <path d="M224 0a128 128 0 1 1 0 256a128 128 0 1 1 0-256m-45.7 304h91.4c20.6 0 40.4 3.5 58.8 9.9C323 331 320 349.1 320 368c0 59.5 29.5 112.1 74.8 144H29.7C13.3 512 0 498.7 0 482.3C0 383.8 79.8 304 178.3 304M352 368a144 144 0 1 1 288 0a144 144 0 1 1-288 0m144-80c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16s-7.2-16-16-16h-32v-48c0-8.8-7.2-16-16-16" />
            </svg>
            <h3 className=" dark:text-white">Attandance History</h3>
          </Link>
          <div className="group p-4 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 bg-white text-slate-900 shadow-md w-[150px] rounded-2xl shadow hover:cursor-pointer hover:bg-blue-500 hover:text-white">
            {/* <img
              src={CalendarIcon}
              alt="user icon"
              className="w-12 fill-white mx-auto mb-4"
            /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[52px] mx-auto mb-4 fill-current dark:text-white dark:grouop-hover:text-blue-900 text-blue-500 group-hover:text-white transition duration-300 ease-in-out"
              viewBox="0 0 448 512"
            >
              <path d="M128 0c17.7 0 32 14.3 32 32v32h128V32c0-17.7 14.3-32 32-32s32 14.3 32 32v32h48c26.5 0 48 21.5 48 48v48H0v-48c0-26.5 21.5-48 48-48h48V32c0-17.7 14.3-32 32-32M0 192h448v272c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48zm329 113c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95l-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0z" />
            </svg>
            <h3 className=" dark:text-white">Total Leaves</h3>
            <p>{totalDays && totalDays} days</p>
          </div>
          <Link
            to={"/leave"}
            className="group p-4 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 bg-white text-slate-900 shadow-md w-[150px] rounded-2xl shadow hover:cursor-pointer hover:bg-blue-500 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 mx-auto mb-4 fill-current dark:text-white dark:grouop-hover:text-blue-900 text-blue-500 group-hover:text-white transition duration-300 ease-in-out"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M14.25 2.5a.25.25 0 0 0-.25-.25H7A2.75 2.75 0 0 0 4.25 5v14A2.75 2.75 0 0 0 7 21.75h10A2.75 2.75 0 0 0 19.75 19V9.147a.25.25 0 0 0-.25-.25H15a.75.75 0 0 1-.75-.75zm.75 9.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5zm0 4a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5z"
                clipRule="evenodd"
              />
              <path d="M15.75 2.824c0-.184.193-.301.336-.186q.182.147.323.342l3.013 4.197c.068.096-.006.22-.124.22H16a.25.25 0 0 1-.25-.25z" />
            </svg>
            <h3 className=" dark:text-white">Apply for leave</h3>
          </Link>

          <Link
            to={"/chat"}
            className="group p-4 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 bg-white text-slate-900 shadow-md w-[150px] rounded-2xl shadow hover:cursor-pointer hover:bg-blue-500 hover:text-white"
          >
            {/* <img
              src={GroupIcon}
              alt="user icon"
              className="w-12 fill-white mx-auto mb-4"
            /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 mx-auto mb-4 fill-current dark:text-white dark:grouop-hover:text-blue-900 text-blue-500 group-hover:text-white transition duration-300 ease-in-out"
              viewBox="0 0 24 24"
            >
              <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
              <path d="M12 12c1.873 0 3.57.62 4.815 1.487c1.183.825 2.185 2.051 2.185 3.37c0 .724-.309 1.324-.796 1.77c-.458.421-1.056.694-1.672.88C15.301 19.88 13.68 20 12 20s-3.301-.12-4.532-.493c-.616-.186-1.214-.459-1.673-.88C5.31 18.182 5 17.582 5 16.858c0-1.319 1.002-2.545 2.185-3.37C8.43 12.62 10.127 12 12 12m7 1c1.044 0 1.992.345 2.693.833c.64.447 1.307 1.19 1.307 2.096c0 .517-.225.946-.56 1.253c-.306.281-.684.446-1.029.55c-.47.142-1.025.215-1.601.247c.122-.345.19-.72.19-1.122c0-1.535-.959-2.839-2.032-3.744A4.8 4.8 0 0 1 19 13M5 13q.537.002 1.032.113C4.96 14.018 4 15.322 4 16.857c0 .402.068.777.19 1.122c-.576-.032-1.13-.105-1.601-.247c-.345-.104-.723-.269-1.03-.55A1.68 1.68 0 0 1 1 15.93c0-.905.666-1.649 1.307-2.096A4.76 4.76 0 0 1 5 13m13.5-6a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5m-13 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5M12 3a4 4 0 1 1 0 8a4 4 0 0 1 0-8" />
            </svg>
            <h3 className=" dark:text-white">Online Employees</h3>
          </Link>
        </div>
        <AttendanceOverview attendances={result} />
      </div>
    </div>
  );
};

export default Dashboards;
