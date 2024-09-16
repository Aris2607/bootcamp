import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkInUser,
  checkOutUser,
  checkAttendanceStatus,
  // checkEmployeeLocation,
} from "../../store/slices/attendanceThunk";
import HereMap from "../../components/HereMap";
import { createData } from "../../services/Api";
import { format } from "date-fns";

const AttendanceForm = ({ employeeId }) => {
  const dispatch = useDispatch();
  const attendance = useSelector((state) => state.attendance);
  const [checkIn, setCheckIn] = useState(false);
  const [checkOut, setCheckOut] = useState(false);
  const [message, setMessage] = useState(null);
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

      console.log(response);
      setCheckIn(response.checkIn);
      setCheckOut(response.checkOut);
    } catch (error) {
      setCheckIn(error.checkIn);
      setCheckOut(error.checkOut);
      setMessage(error.message);
      console.error(error);
    }
  };

  useEffect(() => {
    if (location) {
      // detectExtension();
      // dispatch(checkEmployeeLocation(location));
      // dispatch(checkAttendanceStatus(employeeId, location));
      checkAttendanceStatus();
    }
  }, [location, employeeId, dispatch, checkIn, checkOut]);

  function detectExtension() {
    const userAgent = navigator.userAgent.toLowerCase();
    setExt(userAgent);
  }

  console.log("EMPLOYEE ID:", employeeId);

  const handleAttendance = async () => {
    try {
      await dispatch(checkInUser({ employeeId, location }));

      setCheckIn(attendance.checkIn);
      setCheckOut(attendance.checkOut);
      setMessage(attendance.message);
      alert("Check-in berhasil!");
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
      alert("Check-out berhasil!");
    } catch (error) {
      alert("Error recording attendance: " + error.message);
    }
  };

  console.log("Error:", attendance.error);
  console.log("Message:", attendance.message);
  console.log("CheckIn:", attendance.checkIn);
  console.log("CheckOut:", attendance.checkOut);
  console.log("Location:", location);

  return (
    <div className="w-full h-auto">
      <HereMap location={location} />
      {message && (
        <h2
          className={!checkIn && !checkOut ? "text-red-500" : "text-green-500"}
        >
          {message}
        </h2>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {checkIn ? (
        <button
          className="px-3 py-2 bg-blue-300 disabled:bg-slate-100"
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
          className="px-3 py-2 bg-blue-300 disabled:bg-slate-100"
          onClick={handleTimeout}
          disabled={attendance.loading}
        >
          {attendance.loading ? "Time-Out..." : "Time-Out"}
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default AttendanceForm;
