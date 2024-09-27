import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/user/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
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
import RolesManagement from "../pages/super_admin/RolesManagement";
import ReportPage from "../pages/admin/ReportPage";

const AppRoutes = () => {
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Memeriksa token saat komponen dirender
  React.useEffect(() => {
    if (!Cookies.get("token")) {
      dispatch(setIsAuthenticated(false));
    } else {
      dispatch(setIsAuthenticated(true));
    }
  }, [dispatch]);

  const roleBasedRoutes = () => {
    if (!isAuthenticated) {
      return <Route path="*" element={<Navigate to="/login" />} />;
    }

    switch (user?.role_id) {
      case 2:
        // Admin
        return (
          <>
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/super-admin" element={<Navigate to="/admin" />} />
            <Route path="/dashboard" element={<Navigate to="/admin" />} />
            <Route path="/employees-list" element={<EmployeeList />} />
            <Route path="/leave" element={<LeaveSection />} />
            <Route path="/admin-list" element={<AdminList />} />
            <Route path="/report" element={<ReportPage />} />
            <Route
              path="/employee-management"
              element={<EmployeeManagement />}
            />
          </>
        );
      case 3:
        // Super Admin
        return (
          <>
            <Route path="/" element={<Navigate to="/super-admin" />} />
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/admin" element={<Navigate to="/super-admin" />} />
            <Route path="/dashboard" element={<Navigate to="/super-admin" />} />
            <Route path="/employees-list" element={<EmployeeList />} />
            <Route path="/admin-list" element={<AdminList />} />
            <Route path="/roles" element={<RolesManagement />} />
          </>
        );
      case 1:
        // Employee
        return (
          <>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<UserDashboards />} />
            <Route path="/attendance" element={<UserDashboard />} />
            <Route path="/chat" element={<EmployeeChat />} />
            <Route path="/leave" element={<EmployeeLeavePage />} />
            <Route path="/notif" element={<NotificationPage />} />
            <Route path="/attendance-history" element={<AttendanceHistory />} />
          </>
        );
      default:
        return <Route path="*" element={<Navigate to="/login" />} />;
    }
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
      {/* <Route path="/login-form" element={<LoginForm />} /> */}
      <Route element={<PrivateRoute />}>{roleBasedRoutes()}</Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
