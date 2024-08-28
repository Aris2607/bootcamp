// routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import AdminPage from "../pages/admin/AdminPage";
import SuperAdminDashboard from "../pages/super_admin/SuperAdminDashboard";
import Dashboard from "../pages/user/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import { useSelector } from "react-redux";
import ForgotPassword from "../pages/ForgotPassword";
import EmployeeList from "../pages/admin/EmployeeList";

const AppRoutes = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

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
          </>
        );
      case 1:
        // Employee
        return (
          <>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/admin" element={<Navigate to="/dashboard" />} />
            <Route path="/super-admin" element={<Navigate to="/dashboard" />} /> */}
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
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route element={<PrivateRoute />}>{roleBasedRoutes()}</Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
