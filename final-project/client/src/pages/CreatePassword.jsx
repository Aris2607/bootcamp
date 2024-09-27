import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useSearchParams, useNavigate } from "react-router-dom";
import { createData } from "../services/Api";
import { showToastAlertWithCustomAnimation } from "../utils/alert";

export default function CreatePassword() {
  const [password, setPassword] = useState("");
  const [secondPass, setSecondPass] = useState("");
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Get token from query parameters

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== secondPass) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await createData("/create-password", {
        password,
        token,
      });
      console.log(response);
      showToastAlertWithCustomAnimation("Create Password Successed", "success");
      // Navigate after successful password creation
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to create password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-r from-teal-900 to-blue-900">
      {/* SVG Background */}
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
        </g>
      </svg>

      <div className="relative bg-gradient-to-b from-teal-400 to-teal-600 w-full max-w-md p-8 rounded-xl shadow-lg z-10">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          CREATE YOUR PASSWORD
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-900" />
            <input
              type="password"
              id="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-900" />
            <input
              type="password"
              id="secondPass"
              placeholder="Re-enter Password"
              value={secondPass}
              onChange={(e) => setSecondPass(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            Create Password
          </button>
          <a href="/login" className="text-white text-center mx-auto w-full">
            Back To Login
          </a>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}
