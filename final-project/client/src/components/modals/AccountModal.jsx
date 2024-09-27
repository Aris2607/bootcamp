import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createData, getData } from "../../services/Api";
import ThemeSelector from "../../utils/ThemeSelector";
import { showToastAlertWithCustomAnimation } from "../../utils/alert";

export default function AccountModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isClosing, setIsClosing] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);

  // State untuk Change Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const isDarkMode = localStorage.getItem("theme") === "dark";

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setPasswordError("");
      setPasswordSuccess("");
      onClose();
      setIsClosing(false);
    }, 700); // Durasi animasi
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData(`/employee/${user.employee_id}`);
        setData(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user.employee_id]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      const response = await createData(`/change-password/${data.id}`, {
        currentPassword,
        newPassword,
      });

      console.log(response);

      setPasswordSuccess("Password changed successfully!");
      showToastAlertWithCustomAnimation(
        "Password changed successfully",
        "success"
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error);
      if (error.message == "InvalidCredentials") {
        setPasswordError("Current Password doesn't match");
      }
      setPasswordError("Failed to change password. Please try again.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-0 bg-black opacity-50 ${
            isOpen ? "transition-opacity duration-300" : "opacity-0"
          }`}
          onClick={handleClose}
        />
        <div
          className={`relative bg-white rounded-lg shadow-lg dark:bg-gray-800 p-6 md:p-8 transform transition-transform duration-300 ${
            isOpen
              ? isClosing
                ? "animate__animated animate__backOutUp"
                : "animate__animated animate__backInDown"
              : "scale-95"
          } max-w-4xl w-full h-[80vh]`}
        >
          <div className="flex">
            {/* Sidebar for navigation */}
            <div className="w-1/3 border-r border-gray-200 pr-4 dark:text-white">
              <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
              <button
                className={`w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeTab === "Profile" ? "bg-gray-200 dark:bg-gray-700" : ""
                }`}
                onClick={() => setActiveTab("Profile")}
              >
                Profile
              </button>
              <button
                className={`w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeTab === "CPassword"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
                onClick={() => setActiveTab("CPassword")}
              >
                Change Password
              </button>
              <button
                className={`w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeTab === "Settings" ? "bg-gray-200 dark:bg-gray-700" : ""
                }`}
                onClick={() => setActiveTab("Settings")}
              >
                Settings
              </button>
            </div>

            {/* Content area */}
            <div className="w-2/3 pl-4">
              {activeTab === "Profile" && (
                <div className="grid grid-cols-2 gap-4 items-center">
                  {/* Photo Section */}
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        data?.profile_picture &&
                        `${import.meta.env.VITE_IMAGE_URL}/${
                          data.profile_picture
                        }`
                      }
                      alt="Profile"
                      className="w-40 h-40 object-cover border rounded-full"
                    />
                    <h3 className="text-2xl font-semibold mt-2 text-gray-900 dark:text-white">
                      {data?.first_name} {data?.last_name}
                    </h3>
                  </div>

                  {/* Profile Information */}
                  <div className="col-span-2">
                    <div className="grid grid-cols-2 gap-x-4">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        Position:
                      </p>
                      <p className="text-lg text-gray-600 dark:text-gray-300">
                        {data?.Position?.name || "N/A"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        Email:
                      </p>
                      <p className="text-lg text-gray-600 dark:text-gray-300">
                        {data?.email || "N/A"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        Phone:
                      </p>
                      <p className="text-lg text-gray-600 dark:text-gray-300">
                        {data?.phone_number || "N/A"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        Department:
                      </p>
                      <p className="text-lg text-gray-600 dark:text-gray-300">
                        {data?.Department?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "CPassword" && (
                <form onSubmit={handleChangePassword}>
                  <div className="flex">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 mr-2">
                      Change Password
                    </h3>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      className="dark:text-white mt-2"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill={isDarkMode ? "white" : "black"}
                        d="M11 0a5 5 0 0 0-4.916 5.916L0 12v3a1 1 0 0 0 1 1h1v-1h2v-2h2v-2h2l1.298-1.298A5 5 0 1 0 11 0m1.498 5.002a1.5 1.5 0 1 1 .001-3.001a1.5 1.5 0 0 1-.001 3.001"
                      />
                    </svg>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                  )}
                  {passwordSuccess && (
                    <p className="text-green-500 text-sm">{passwordSuccess}</p>
                  )}
                  <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Change Password
                  </button>
                </form>
              )}

              {activeTab === "Settings" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Settings
                  </h3>
                  <div className="mt-4">
                    <ThemeSelector />
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    This is the settings section.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="text-gray-400 absolute right-0 top-0 bg-transparent hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
              onClick={handleClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
