import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import profile from "../../assets/profile.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createData, getData } from "../../services/Api";
import { useCookies } from "react-cookie";
import logo from "../../assets/ars-logo.png";
import AccountModal from "../modals/AccountModal";
import { getRolesAndPermit } from "../../utils/getRolesAndPermit";
import { addPermit } from "../../store/slices/permitSlice";
import NotificationModal from "../modals/NotificationModal";

export default function AdminNav({ title }) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const [allNotif, setAllNotif] = useState([]);
  const [permit, setPermit] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const notificationRef = useRef(null);
  const dropdownRef = useRef(null);

  const getUserNotification = async () => {
    try {
      const response = await getData(`/user/notification/${user.employee_id}`);
      setAllNotif(response);
      console.log("NOTIF:", response);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getRolesAndPermit(user.Role.role_name).then((response) => {
      setPermit(response[0]);
      dispatch(addPermit(response[0].permit));
    });
    getUserNotification();
  }, []);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const allNotifications = [
    { id: 1, message: "You have a new leave request", date: "2024-09-20" },
    {
      id: 2,
      message: "Attendance report for August is ready",
      date: "2024-09-18",
    },
    {
      id: 3,
      message: "Reminder: Employee meeting tomorrow",
      date: "2024-09-21",
    },
    { id: 4, message: "New employee added to the system", date: "2024-09-15" },
    {
      id: 5,
      message: "Your profile was updated successfully",
      date: "2024-09-17",
    },
    { id: 6, message: "Password change requested", date: "2024-09-19" },
    { id: 7, message: "New policy document available", date: "2024-09-16" },
    {
      id: 8,
      message: "Meeting notes from last week are ready",
      date: "2024-09-14",
    },
    {
      id: 9,
      message: "Performance review scheduled for next week",
      date: "2024-09-22",
    },
    {
      id: 10,
      message: "System maintenance scheduled for this weekend",
      date: "2024-09-23",
    },
  ];

  const [visibleNotifications, setVisibleNotifications] = useState(3);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  const toggleEmployeeDropdown = () => {
    setEmployeeDropdownOpen(!employeeDropdownOpen);
  };

  const handleSignOut = async () => {
    try {
      const response = await createData(
        "/logout",
        {},
        { withCredentials: true }
      );
      console.log(response);
      console.log("Logout...");
      localStorage.setItem("showLogoutSuccess", "true");
      window.location = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  const loadMoreNotifications = () => {
    setVisibleNotifications((prev) => prev + 3);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationDropdownOpen(false);
        setVisibleNotifications(3);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed left-0 top-0 right-0 flex justify-between items-center z-10 bg-blue-600 p-4 rounded-b-lg shadow-md dark:bg-blue-950">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-semibold text-white hover:text-slate-400">
          {/* {(user.Role.role_name === "Admin" ||
            user.Role.role_name === "Super Admin") && <a href="/">{title}</a>} */}
          {user.Role.role_name === "Admin" && (
            <Link to={"/admin"}>{title}</Link>
          )}
          {user.Role.role_name === "Super Admin" && (
            <Link to={"/super-admin"}>{title}</Link>
          )}
          {user.Role.role_name === "Employee" &&
            user.Role.role_name !== "Admin" &&
            user.Role.role_name !== "Super Admin" && (
              <img src={logo} alt="Logo" className="w-16" />
            )}
        </div>

        <AccountModal isOpen={openModal} onClose={() => setOpenModal(false)} />

        {/* Dropdown for Employee */}
        <div className="relative">
          {permit &&
          permit.permit.pages.employee_management &&
          (permit.permit.crud_operations.Read_employee ||
            permit.permit.crud_operations.CRUD_employee) ? (
            <div
              onClick={toggleEmployeeDropdown}
              className={
                location.pathname === "/employees-list"
                  ? "text-white underline text-xl font-semibold"
                  : "text-xl font-semibold text-white hover:cursor-pointer hover:text-red-500"
              }
            >
              EMPLOYEE
            </div>
          ) : null}

          {employeeDropdownOpen && (
            <div
              className="absolute bg-white shadow-md mt-2 rounded-md w-48 dark:bg-blue-700 dark:text-white"
              onMouseLeave={() => setEmployeeDropdownOpen(false)}
            >
              <div
                onClick={() => navigate("/employees-list")}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer dark:hover:bg-blue-600 "
              >
                Employee List
              </div>
              <div
                onClick={() => navigate("/employee-management")}
                className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-blue-600 cursor-pointer"
              >
                Office Management
              </div>
            </div>
          )}
        </div>

        {permit && permit.permit.pages.leaves_management ? (
          <Link
            to={"/leave"}
            className={
              location.pathname == "/leave"
                ? "text-xl font-semibold underline text-white"
                : "text-xl font-semibold text-white hover:text-red-500"
            }
          >
            LEAVES
          </Link>
        ) : null}

        {permit &&
        permit.permit.pages.admin_management &&
        (permit.permit.crud_operations.Read_admin ||
          permit.permit.crud_operations.CRUD_admin) ? (
          <Link
            to={"/admin-list"}
            className={
              location.pathname == "/admin-list"
                ? "text-xl font-semibold underline text-white"
                : "text-xl font-semibold text-white hover:text-red-500"
            }
          >
            ADMIN
          </Link>
        ) : null}

        {permit && permit.permit.pages.roles_management ? (
          <Link
            to={"/roles"}
            className={
              location.pathname == "/roles"
                ? "text-xl font-semibold underline text-white"
                : "text-xl font-semibold text-white hover:text-red-500"
            }
          >
            ROLES
          </Link>
        ) : null}

        {permit && permit.permit.pages.employee_dashboard ? (
          <Link
            to={"/dashboard"}
            className={
              location.pathname == "/dashboard"
                ? "text-xl font-semibold underline text-white"
                : "text-xl font-semibold text-white hover:text-red-500"
            }
          >
            DASHBOARD
          </Link>
        ) : null}

        {permit && permit.permit.pages.leave_requests ? (
          <Link
            to={"/leave"}
            className={
              location.pathname == "/leave"
                ? "text-xl font-semibold underline text-white"
                : "text-xl font-semibold text-white hover:text-red-500"
            }
          >
            LEAVES
          </Link>
        ) : null}

        {permit && permit.permit.pages.reports ? (
          <Link
            to={"/report"}
            className={
              location.pathname == "/report"
                ? "text-xl font-semibold underline text-white"
                : "text-xl font-semibold text-white hover:text-red-500"
            }
          >
            REPORT
          </Link>
        ) : null}
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <div className="relative" ref={notificationRef}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="h-6 w-6 fill-white cursor-pointer"
            onClick={toggleNotificationDropdown}
          >
            <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
          </svg>

          {/* Notification Dropdown */}
          {notificationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md py-2 z-10 dark:bg-blue-800 dark:text-white max-h-64 overflow-y-auto">
              {allNotif && allNotif.length > 0 ? (
                allNotif.slice(0, visibleNotifications).map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-blue-600"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div>{notification.message}</div>
                    <div className="text-sm text-gray-500 dark:text-white">
                      {new Date(notification.createdAt).toLocaleDateString(
                        "id-ID"
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 dark:hover:bg-blue-600">
                  <div>There&apos;s no notification yet</div>
                </div>
              )}

              {visibleNotifications < allNotif.length && (
                <button
                  onClick={loadMoreNotifications}
                  className="w-full px-4 py-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-600 dark:text-white"
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </div>

        {/* Notification Modal */}
        <NotificationModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          notification={selectedNotification}
        />

        <div className="text-white">
          {new Date()
            .toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
            .replace(/\s(?=\d)/, ",")}
        </div>

        <div className="relative" ref={dropdownRef}>
          <img
            src={`${import.meta.env.VITE_IMAGE_URL}/${
              user.Employee.profile_picture
            }`}
            onClick={toggleDropdown}
            className="cursor-pointer w-8 h-8 rounded-full"
          />
          {dropdownOpen && (
            <div className="absolute right-0 bg-white shadow-md mt-2 rounded-md w-48 dark:bg-blue-700 dark:text-white">
              <div
                onClick={() => setOpenModal(true)}
                className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-blue-600 cursor-pointer"
              >
                My Account
              </div>
              <div
                onClick={handleSignOut}
                className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-blue-600 cursor-pointer"
              >
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
