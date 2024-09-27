import React, { useEffect, useState } from "react";
import AdminNav from "../../components/navbars/AdminNav";
import { showToastAlertWithCustomAnimation } from "../../utils/alert";
import { useSelector } from "react-redux";
import { getAllRolesAndPermit } from "../../utils/getRolesAndPermit";
import AttendanceStatus from "../../components/admin/AttendanceStatus";
import AttendanceReport from "../../components/admin/AttendanceReport";
import LineChart from "../../components/LineChart";

export default function SuperAdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);

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
  }, []);

  useEffect(() => {
    getAllRolesAndPermit().then((response) => setData(response));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav title={"SUPER ADMIN DASHBOARD"} />
      <div className="pt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceStatus />
        <AttendanceReport />
      </div>
      <div className="px-4 pt-4 w-full h-[50vh] mx-auto">
        {" "}
        {/* Change to h-[50vh] */}
        <LineChart />
      </div>
    </div>
  );
}
