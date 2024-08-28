/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import profile from "../../assets/profile.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authThunk";

export default function AdminNav() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = async () => {
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

  return (
    <header className="flex justify-between items-center bg-lime-500 p-4 rounded-b-lg shadow">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-semibold text-white">ADMIN DASHBOARD</div>
        <div
          onClick={() => navigate("/employees-list")}
          className="text-xl font-semibold text-white hover:cursor-pointer hover:text-lime-200"
        >
          EMPLOYEES LIST
        </div>
        <div className="text-xl font-semibold text-white">LEAVES</div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-white">
          {new Date()
            .toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
            .replace(/\s(?=\d)/, ", ")}
        </div>
        <div className="text-white">Admin</div>
        <div id="menu-button" onClick={toggleDropdown} className="relative">
          <img
            src={profile}
            alt="Profile"
            className="h-8 w-8 rounded-2xl cursor-pointer"
          />
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex="-1"
            >
              <div className="py-1" role="none">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabIndex="-1"
                  id="menu-item-0"
                >
                  Account settings
                </a>
                <button
                  onClick={handleSignOut}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                  role="menuitem"
                  tabIndex="-1"
                  id="menu-item-3"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
