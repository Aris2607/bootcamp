// components/LogoutButton.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authThunk";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      console.log("Logout...");
      //   navigate("/login"); // Redirect ke halaman login setelah logout
      //   <Navigate to={"/login"}></Navigate>;
      window.location.reload();
    } catch (err) {
      // Tangani error jika diperlukan
      console.error(err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
