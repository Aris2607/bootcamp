import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkInUser,
  checkOutUser,
  checkAttendanceStatus,
} from "../../store/slices/attendanceThunk";
import HereMap from "../../components/HereMap";
import { createData } from "../../services/Api";
import { format } from "date-fns";
import { showToastAlertWithCustomAnimation } from "../../utils/alert";

const AttendanceForm = ({ employeeId, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const attendance = useSelector((state) => state.attendance);
  const [checkIn, setCheckIn] = useState(false);
  const [checkOut, setCheckOut] = useState(false);
  const [message, setMessage] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [ext, setExt] = useState(null);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
        },
        (error) => {
          console.error("Error obtaining location: ", error);
          setError("Unable to retrieve location. Please try again.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const checkAttendanceStatus = async () => {
    try {
      const date = format(new Date(), "yyyy-MM-dd");
      const response = await createData(
        `/employee/${employeeId}/attendance/status`,
        {
          date,
          location,
        }
      );
      setCheckIn(response.checkIn);
      setCheckOut(response.checkOut);
    } catch (error) {
      setCheckIn(error.checkIn);
      setCheckOut(error.checkOut);
      setMessage(error.message);
      // console.error(error);
    }
  };

  useEffect(() => {
    if (location) {
      checkAttendanceStatus();
    }
  }, [location, employeeId, dispatch, checkIn, checkOut]);

  function detectExtension() {
    const userAgent = navigator.userAgent.toLowerCase();
    setExt(userAgent);
  }

  const handleAttendance = async () => {
    try {
      await dispatch(checkInUser({ employeeId, location }));
      setCheckIn(attendance.checkIn);
      setCheckOut(attendance.checkOut);
      setMessage(attendance.message);
      showToastAlertWithCustomAnimation("Check-In Successed!", "success");
    } catch (error) {
      alert("Error recording attendance: " + error.message);
    }
  };

  const handleTimeout = async () => {
    try {
      await dispatch(checkOutUser({ employeeId }));
      setCheckIn(attendance.checkIn);
      setCheckOut(attendance.checkOut);
      setMessage(attendance.message);
      showToastAlertWithCustomAnimation("Check-Out Successed!", "success");
    } catch (error) {
      alert("Error recording attendance: " + error.message);
    }
  };

  if (!isOpen) return null; // Only render if modal is open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-lg z-50 w-full max-w-lg p-6 relative dark:bg-slate-900">
        <button onClick={onClose} className="absolute top-3 right-3">
          ✕
        </button>
        <HereMap location={location} />
        {message && (
          <h2
            className={
              !checkIn && !checkOut ? "text-red-500" : "text-green-500"
            }
          >
            {message}
          </h2>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {checkIn ? (
          <button
            className="px-3 py-2 w-full text-white font-bold bg-blue-500 hover:bg-blue-400 disabled:bg-slate-100"
            onClick={handleAttendance}
            disabled={attendance.loading}
          >
            {attendance.loading ? "Time-In..." : "Time-In"}
          </button>
        ) : (
          ""
        )}
        {checkOut && !checkIn ? (
          <button
            className="px-3 py-2 w-full text-white font-bold bg-blue-500 hover:bg-blue-400 disabled:bg-slate-100"
            onClick={handleTimeout}
            disabled={attendance.loading}
          >
            {attendance.loading ? "Time-Out..." : "Time-Out"}
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AttendanceForm;
