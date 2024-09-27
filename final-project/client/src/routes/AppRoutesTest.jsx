import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsAuthenticated } from "../store/slices/authSlice";
import PrivateRoute from "../components/PrivateRoute";
import AdminPage from "../pages/admin/AdminPage";
import SuperAdminDashboard from "../pages/super_admin/SuperAdminDashboard";
import Cookies from "js-cookie";
import ForgotPassword from "../pages/ForgotPassword";
import EmployeeList from "../pages/admin/EmployeeList";
import UserDashboard from "../pages/user/UserDashboard";
import ResetPassword from "../pages/ResetPassword";
import CreatePassword from "../pages/CreatePassword";
import EmployeeManagement from "../pages/admin/EmployeeManagement";
import UserDashboards from "../pages/user/UserDashboards";
import EmployeeChat from "../pages/user/EmployeeChat";
import EmployeeLeavePage from "../pages/user/EmployeeLeavePage";
import LeaveSection from "../pages/admin/LeaveSection";
import NotificationPage from "../pages/NotificationPage";
import LoginForm from "../pages/LoginForm";
import AdminList from "../pages/admin/AdminList";
import AttendanceHistory from "../pages/user/AttendanceHistory";
import { getAllRolesAndPermit } from "../utils/getRolesAndPermit";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [role, setRole] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRolesAndPermit = async () => {
      const response = await getAllRolesAndPermit();
      setRole(response[0]);
    };

    fetchRolesAndPermit();
  }, []);

  useEffect(() => {
    const tokenExists = !!Cookies.get("token");
    dispatch(setIsAuthenticated(tokenExists));
  }, [dispatch]);

  const renderRoutes = () => {
    if (!role) return null;

    const { permit } = role;
    const routes = [];

    if (permit.pages.employee_dashboard) {
      routes.push(
        <Route
          key="employee-dashboard"
          path="/employee-dashboard"
          element={<UserDashboard />}
        />
      );
    }

    if (permit.pages.employee_management) {
      routes.push(
        <Route
          key="employee-list"
          path="/employees-list"
          element={<EmployeeList />}
        />
      );
    }

    if (permit.pages.admin_management) {
      routes.push(
        <Route key="admin-list" path="/admin-list" element={<AdminList />} />
      );
    }

    if (permit.pages.leave_requests) {
      routes.push(
        <Route key="leave-section" path="/leaves" element={<LeaveSection />} />
      );
    }

    return routes.length > 0 ? routes : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginForm />}
      />
      <Route path="/reset" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/create-password" element={<CreatePassword />} />
      <Route element={<PrivateRoute />}>{renderRoutes()}</Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
