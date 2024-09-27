import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createData } from "../services/Api";
import { FaLock } from "react-icons/fa";
import { showToastAlertWithCustomAnimation } from "../utils/alert";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Ambil token dari query parameter
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await createData("/reset-password", {
        password,
        token,
      });

      console.log(response);
      setMessage("Password reset successful");
      showToastAlertWithCustomAnimation("Password reset successful", "success");
      navigate("/login");
    } catch (error) {
      console.log(error);
      setMessage("Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-900 to-blue-900">
      <div className="relative fadeIn bg-gradient-to-b from-teal-400 to-teal-600 w-full max-w-md p-8 rounded-xl shadow-lg z-10">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Reset Password
        </h2>

        {message && <p className="text-white text-center">{message}</p>}

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
              id="confirmPassword"
              placeholder="Re-enter Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow"
            />
          </div>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
