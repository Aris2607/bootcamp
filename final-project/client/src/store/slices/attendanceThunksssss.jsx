import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkInUser,
  checkOutUser,
  checkAttendanceStatus,
} from "./attendanceThunk";
import HereMap from "../../components/HereMap";

const AttendanceForm = ({ employeeId }) => {
  const dispatch = useDispatch();
  const attendance = useSelector((state) => state.attendance);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [ext, setExt] = useState(null);

  // Function to get the current location
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

  useEffect(() => {
    if (location) {
      detectExtension();
      dispatch(checkAttendanceStatus(employeeId));
    }
  }, [location, employeeId, dispatch]);

  function detectExtension() {
    const userAgent = navigator.userAgent.toLowerCase();
    setExt(userAgent);
  }

  const handleAttendance = async () => {
    try {
      await dispatch(checkInUser({ employeeId, location }));
      alert("Check-in berhasil!");
    } catch (error) {
      alert("Error recording attendance: " + error.message);
    }
  };

  const handleTimeout = async () => {
    try {
      await dispatch(checkOutUser({ employeeId }));
      alert("Check-out berhasil!");
    } catch (error) {
      alert("Error recording attendance: " + error.message);
    }
  };

  return (
    <div className="w-full h-auto">
      <HereMap location={location} />
      {attendance.message && (
        <h2
          className={
            !attendance.checkIn && !attendance.checkOut
              ? "text-red-500"
              : "text-green-500"
          }
        >
          {attendance.message}
        </h2>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {attendance.checkIn ? (
        <button
          className="px-3 py-2 bg-blue-300 disabled:bg-slate-100"
          onClick={handleAttendance}
          disabled={!attendance.checkIn}
        >
          Time-In
        </button>
      ) : (
        ""
      )}
      {attendance.checkOut && !attendance.checkIn ? (
        <button
          className="px-3 py-2 bg-blue-300 disabled:bg-slate-100"
          onClick={handleTimeout}
          disabled={!attendance.checkOut}
        >
          Time-Out
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default AttendanceForm;
