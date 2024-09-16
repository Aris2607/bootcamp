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

const Dashboards = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const auth = useSelector((state) => state.auth);
  const [result, setResult] = useState(null);
  console.log(user);
  console.log(new Date(user.createdAt).getFullYear());
  console.log("Date:", new Date().getMonth());

  console.log("Token:", Cookies.get("token"));
  console.log("DCOokie:", document.cookie);

  console.log("isAuth:", isAuthenticated);
  console.log("AUTH:", auth);

  console.log("TRUTHY:", !!Cookies.get("token"));

  const token = Cookies.get("token");

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      console.log("DecodedToken:", decodedToken);
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("No token");
  }

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await getData(
          `/employee/${user.employee_id}/attendance/record`
        );
        console.log(response);
        setResult(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAttendance();
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

  console.log(result);

  return (
    <div className="min-h-screen bg-third overflow-y-hidden">
      <UserNav />
      <div className="container mx-auto mt-14 p-4">
        <div className="flex justify-between bg-">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Hello {user.Employee.first_name},
            </h1>
            <span className="text-3xl">Good {getTimeOfDay(new Date())}</span>
          </div>
          <Clock />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10"
            viewBox="0 0 24 24"
            fill="bg-white text-white"
          >
            <g fill="currentColor" fillOpacity="0">
              <path d="M15.22 6.03l2.53-1.94L14.56 4L13.5 1l-1.06 3l-3.19.09l2.53 1.94l-.91 3.06l2.63-1.81l2.63 1.81z">
                <animate
                  id="lineMdMoonFilledLoop0"
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="0.7s;lineMdMoonFilledLoop0.begin+6s"
                  dur="0.4s"
                  values="0;1"
                />
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="lineMdMoonFilledLoop0.begin+2.2s"
                  dur="0.4s"
                  values="1;0"
                />
              </path>
              <path d="M13.61 5.25L15.25 4l-2.06-.05L12.5 2l-.69 1.95L9.75 4l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z">
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="lineMdMoonFilledLoop0.begin+3s"
                  dur="0.4s"
                  values="0;1"
                />
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="lineMdMoonFilledLoop0.begin+5.2s"
                  dur="0.4s"
                  values="1;0"
                />
              </path>
              <path d="M19.61 12.25L21.25 11l-2.06-.05L18.5 9l-.69 1.95l-2.06.05l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z">
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="lineMdMoonFilledLoop0.begin+0.4s"
                  dur="0.4s"
                  values="0;1"
                />
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="lineMdMoonFilledLoop0.begin+2.8s"
                  dur="0.4s"
                  values="1;0"
                />
              </path>
              <path d="M20.828 9.731l1.876-1.439l-2.366-.067L19.552 6l-.786 2.225l-2.366.067l1.876 1.439L17.601 12l1.951-1.342L21.503 12z">
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="lineMdMoonFilledLoop0.begin+3.4s"
                  dur="0.4s"
                  values="0;1"
                />
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="lineMdMoonFilledLoop0.begin+5.6s"
                  dur="0.4s"
                  values="1;0"
                />
              </path>
            </g>
            <path
              fill="currentColor"
              fillOpacity="0"
              stroke="currentColor"
              strokeDasharray="56"
              strokeDashoffset="56"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z"
            >
              <animate
                fill="freeze"
                attributeName="fill-opacity"
                begin="1.5s"
                dur="0.5s"
                values="0;1"
              />
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.6s"
                values="56;0"
              />
            </path>
          </svg>
        </div>
        <div className="flex justify-evenly mx-4 gap-4 mt-6">
          <Link
            to={"/attendance"}
            className="p-4 bg-second text-white w-[150px] rounded-2xl shadow hover:cursor-pointer hover:bg-[#4C5867]"
          >
            <img
              src={UserIcon}
              alt="user icon"
              className="w-12 fill-white mx-auto mb-4"
            />
            <h3>Your attendance</h3>
            <p>
              {result ? result.length : ""}/
              <DaysInMonth />
            </p>
          </Link>
          <div className="p-4 bg-second text-white w-[150px] rounded-2xl shadow hover:cursor-pointer hover:bg-[#4C5867]">
            <img
              src={CalendarIcon}
              alt="user icon"
              className="w-12 fill-white mx-auto mb-4"
            />
            <h3>Total Leaves</h3>
            <p>4 days</p>
          </div>
          <Link
            to={"/leave"}
            className="p-4 bg-second text-white w-[150px] rounded-2xl shadow hover:cursor-pointer hover:bg-[#4C5867]"
          >
            <img
              src={DocumentIcon}
              alt="user icon"
              className="w-12 fill-white mx-auto mb-4"
            />
            <h3>Apply for leave</h3>
          </Link>
          <Link
            to={"/chat"}
            className="p-4 bg-second text-white w-[150px] rounded-2xl shadow hover:cursor-pointer hover:bg-[#4C5867]"
          >
            <img
              src={GroupIcon}
              alt="user icon"
              className="w-12 fill-white mx-auto mb-4"
            />
            <h3>Online Employees</h3>
          </Link>
        </div>
        <AttendanceOverview />
      </div>
    </div>
  );
};

export default Dashboards;
