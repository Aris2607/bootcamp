import React, { useEffect, useState } from "react";
import { createData } from "../services/Api";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { showToastAlertWithCustomAnimation } from "../utils/alert";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createData("/request-password-reset", { email });
      console.log(response);
      showToastAlertWithCustomAnimation(
        "Check your email for reset instructions!",
        "success"
      );
      setTimeout(() => {
        showToastAlertWithCustomAnimation(
          "You will be redirected to login page",
          "info"
        );
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }, 4000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (error) {
      showToastAlertWithCustomAnimation(error, "error");
    }
    setError(null);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-900 to-blue-900">
      <div className="relative fadeIn bg-gradient-to-b from-teal-400 to-teal-600 w-full max-w-md p-8 rounded-xl shadow-lg z-10">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-900" />
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow"
            />
          </div>
          {/* {error && <p className="text-red-600 text-center">{error}</p>} */}
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
}
