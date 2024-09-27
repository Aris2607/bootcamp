import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authThunk";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { loginFailure } from "../store/slices/authSlice";
import axios from "axios";
import { showToastAlertWithCustomAnimation } from "../utils/alert";
import RegisterModal from "../components/modals/RegisterModal";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const [errors, setError] = useState(null);

  console.log("IsAuth:", isAuthenticated);

  console.log("TRUTHY:", !!Cookies.get("token"));

  useEffect(() => {
    const showAlert = localStorage.getItem("showLogoutSuccess");

    if (showAlert === "true") {
      showToastAlertWithCustomAnimation("Logout Successful", "success");

      localStorage.removeItem("showLogoutSuccess");
    }
  }, []);

  useEffect(() => {
    if (errors) {
      {
        errors && showToastAlertWithCustomAnimation(errors, "error");
      }
      setError(null);
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    try {
      const result = await dispatch(loginUser({ username, password })).unwrap();
      console.log("Console without wrap");
      console.log(result);
      if (result) {
        navigate("/"); // Redirect ke dashboard setelah login berhasil
      }
    } catch (err) {
      // Tangani error
      console.log(err);
      setError("Invalid Username/Password");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect jika sudah terautentikasi
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-r from-teal-900 to-blue-900">
      {/* SVG Background */}
      <RegisterModal
        title={"Add New Employee"}
        mode={"employee"}
        setIsLoading={setIsLoading}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        refreshData={() => fetchData(currentPage)}
      />
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke="#00FFAB" strokeWidth="2">
          <polygon points="100,150 150,250 100,250" />
          <polygon points="300,50 350,150 300,150" />
          <polygon points="500,300 550,400 500,400" />
          <polygon points="600,100 650,200 600,200" />
          <polygon points="200,400 250,500 200,500" />
          <polygon points="400,500 450,600 400,600" />
          <polygon points="700,250 750,350 700,350" />
          <polygon points="500,450 550,550 500,550" />
          <polygon points="50,50 100,150 50,150" />
          {/* Add more polygons as needed */}
        </g>
      </svg>

      <div
        className={`${
          errors ? "animate__animated animate__headShake" : ""
        } relative fadeIn bg-gradient-to-b from-teal-400 to-teal-600 w-full max-w-md p-8 rounded-xl shadow-lg z-10 animate__animated animate__fadeInDownBig`}
      >
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          EMPLOYEE LOGIN
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-900" />
            <input
              type="text"
              id="username"
              placeholder="USER ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-900" />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center text-white">
            <a
              href="/reset"
              className="text-sm text-teal-200 hover:text-teal-100"
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {/* {errors && <p className="text-red-600">{errors}</p>} */}
        </form>
      </div>
      <button
        onClick={() => setOpenModal(true)}
        className=" absolute right-2 bottom-2 px-8 py-4 bg-transparent hover:bg-red-500 hover:text-white transition duration-300"
      ></button>
    </div>
  );
}
