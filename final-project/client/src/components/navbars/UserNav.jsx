import React from "react";
import ColumnIcon from "../../components/icons/objects-column.png";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authThunk";

const UserNav = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await dispatch(logoutUser(user.username)).unwrap();
      console.log("Logout...");
      // navigate("/login"); // Redirect ke halaman login setelah logout
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-main text-white z-50 shadow-md">
      <div className="flex items-center space-x-4 justify-between w-1/2">
        <span className="font-bold text-lg">Logo</span>
        <div className="flex">
          <a href="#" className="hover:text-gray-300 text-mainText">
            <img
              src={ColumnIcon}
              alt="column icon"
              className="w-5 h-5 mr-1 mb-0.5 inline-block"
            />
            Dashboard
          </a>
        </div>
        <a href="#" className="hover:text-gray-300 text-mainText">
          Leaves
        </a>
        <a href="#" className="hover:text-gray-300 text-mainText">
          Report
        </a>
      </div>
      <div className="flex items-center space-x-4">
        <Link to={"/notif"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="h-6 w-6 fill-white"
          >
            <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
          </svg>
        </Link>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button">
            <img
              src={`${import.meta.env.VITE_IMAGE_URL}/${
                user.Employee.profile_picture
              }`}
              alt="profile"
              className="w-10 h-auto rounded-full"
            />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-slate-400 text-white rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <button
                onClick={handleSignOut}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                role="menuitem"
                tabIndex="-1"
                id="menu-item-3"
              >
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNav;
