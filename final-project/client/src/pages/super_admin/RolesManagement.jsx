import React, { useEffect, useState } from "react";
import { getAllRolesAndPermit } from "../../utils/getRolesAndPermit";
import { useSelector } from "react-redux";
import PermissionTable from "../../components/super_admin/PermissionTable";
import AdminNav from "../../components/navbars/AdminNav";

export default function RolesManagement() {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);

  useEffect(() => {
    // getRolesAndPermit(user.Role.role_name).then((response) =>
    //   setData(response[0])
    // );
    getAllRolesAndPermit().then((response) => setData(response));
  }, []);

  console.log("DATA:", data);
  return (
    <div className="h-screen">
      <AdminNav title={"SUPER ADMIN DASHBOARD"} />
      <div className="pt-14">
        <PermissionTable rolesData={data} />
      </div>
    </div>
  );
}
