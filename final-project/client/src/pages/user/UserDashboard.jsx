import React from "react";
import UserSidebar from "../../components/sidebars/UserSidebar";
import { useSelector } from "react-redux";
import { createData } from "../../services/Api";
import LogoutButton from "../../components/LogoutButton";
import AttendanceForm from "./AttendanceForm";

export default function UserDashboard() {
  const { user } = useSelector((state) => state.auth);

  console.log(user);
  return (
    <div>
      {/* <UserSidebar /> */}
      <div className="max-w-full flex">
        <div className="bg-white p-4 w-[50%] rounded shadow mx-auto">
          <AttendanceForm employeeId={user.employee_id} />
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
