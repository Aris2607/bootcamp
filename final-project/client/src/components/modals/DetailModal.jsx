import React, { useState, useEffect } from "react";
import { getData } from "../../services/Api";
import QRCode from "qrcode-react";
import { useSelector } from "react-redux";
import EditEmployeeModal from "./EditEmployeeModal";
import SimpleModal from "./SimpleModal";
import EditModal from "./EditModal";

export default function DetailModal({ isOpen, onClose, eId, handleUpdate }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [unique, setUnique] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { permit } = useSelector((state) => state.permit);
  const isDarkMode = localStorage.getItem("theme") === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData(`/employee/${eId}`);
        setData(response);
        const uniqueName = createUnique(
          response.first_name,
          response.createdAt
        );
        setUnique(uniqueName);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (eId) {
      fetchData();
    }
  }, [eId, isLoading]);

  const createUnique = (first_name, unique) => {
    const ran = new Date(unique).toLocaleTimeString("id-ID").split(".");
    let temp = first_name;
    ran.slice(1).forEach((uniq) => {
      temp += uniq;
    });
    return temp;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 700); // Durasi animasi
  };

  console.log(data);

  return (
    <div>
      {openEdit && (
        <EditEmployeeModal
          employee={data}
          show={openEdit}
          handleClose={() => {
            setOpenEdit(false);
          }}
          handleUpdate={handleUpdate}
        />
      )}

      {openEdit && (
        <EditModal
          employee={data}
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          handleUpdate={handleUpdate}
          setIsLoading={setIsLoading}
        />
      )}

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
          className={`relative bg-white rounded-lg shadow-lg dark:bg-gray-700 p-6 md:p-8 transform transition-transform duration-300 ${
            isOpen
              ? isClosing
                ? "animate__animated animate__fadeOutDown"
                : "animate__animated animate__fadeInUp"
              : "scale-95"
          } max-w-4xl w-full h-[80vh]`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 w-1/3 pr-4">
              {data && (
                <>
                  <img
                    src={
                      data.profile_picture
                        ? `${import.meta.env.VITE_IMAGE_URL}/${
                            data.profile_picture
                          }`
                        : `${import.meta.env.VITE_IMAGE_URL}/default.png`
                    }
                    alt="Profile"
                    className="w-full h-[250px] object-cover max-w-xs"
                  />
                  <h3 className="mt-2 text-xl font-semibold text-center text-black dark:text-white">{`${data.first_name} ${data.last_name}`}</h3>
                  <div className="mt-8 ml-16">
                    <a href={`mailto:${data.email}`}>
                      <QRCode
                        value={`mailto:${data.email}`}
                        logo={`http://localhost:3001/uploads/${data.profile_picture}`}
                        bgColor={isDarkMode ? "#1a1a1a" : "#ffffff"} // Warna latar belakang
                        fgColor={isDarkMode ? "#ffffff" : "#000000"} // Warna QR code
                      />
                    </a>
                  </div>
                  <p className="text-center text-gray-800 dark:text-white">(Scan to send email)</p>
                </>
              )}
            </div>
            <div className="w-2/3">
              {isLoading ? (
                <p className="text-gray-800  dark:text-white">Loading...</p>
              ) : (
                data && (
                  <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-black dark:text-white">
                      <h3 className="font-semibold text-2xl">Employee ID</h3>
                      <p className="text-xl">{10000 + data.id}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-black dark:text-white">
                      <h3 className="font-semibold text-2xl">Email</h3>
                      <p className="text-xl break-words">{data.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-black dark:text-white">
                      <h3 className="font-semibold text-2xl">Phone Number</h3>
                      <p className="text-xl">{data.phone_number}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-black dark:text-white">
                      <h3 className="font-semibold text-2xl">Position</h3>
                      <p className="text-xl">{data.Position.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-black dark:text-white">
                      <h3 className="font-semibold text-2xl">Department</h3>
                      <p className="text-xl">{data.Department.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-black dark:text-white">
                      <h3 className="font-semibold text-2xl">Joining Date</h3>
                      <p className="text-xl">{formatDate(data.createdAt)}</p>
                    </div>

                    {(data.User.Role.role_name === "Admin" &&
                      permit.crud_operations.CRUD_admin) ||
                    (data.User.Role.role_name === "Employee" &&
                      permit.crud_operations.CRUD_employee) ? (
                      <div className="absolute right-2 bottom-12 mx-8 rounded-full text-white">
                        <button
                          onClick={() => setOpenEdit(true)}
                          className="bg-yellow-400 hover:bg-yellow-300 px-64 py-4 mt-12"
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="text-gray-400 absolute right-0 top-0 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
