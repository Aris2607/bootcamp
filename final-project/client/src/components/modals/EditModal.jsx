/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { getData, updateData } from "../../services/Api"; // Pastikan Anda memiliki fungsi ini untuk mengambil data
import { showSuccessAlert } from "../../utils/alert";

export default function EditModal({
  employee,
  isOpen,
  onClose,
  handleUpdate,
  setIsLoading,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await getData("/departments");
      setDepartments(response || []);
    };

    fetchDepartments();

    if (employee) {
      setFirstName(employee.first_name);
      setLastName(employee.last_name);
      setEmail(employee.email);
      setPhone(employee.phone_number);
      setSelectedDepartment(employee.department_id); // Ganti dengan ID department
      setSelectedPosition(employee.position_id); // Ganti dengan ID position
    }
  }, [employee]);

  useEffect(() => {
    const fetchPositions = async () => {
      if (selectedDepartment) {
        const response = await getData(
          `/positions?department_id=${selectedDepartment}`
        );
        setPositions(response || []);
      } else {
        setPositions([]);
      }
    };

    fetchPositions();
  }, [selectedDepartment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await updateData(`/employee/${employee.id}/edit`, {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phone,
      department_id: selectedDepartment,
      position_id: selectedPosition,
    });

    console.log(response);

    showSuccessAlert("Success", "Employee Edited Successfully");
    handleUpdate();
    handleClose();
    setIsLoading(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 700); // Durasi animasi
  };

  return (
    <div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${
          isOpen ? "opacity-100 z-[1000]" : "opacity-0 pointer-events-none"
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
                ? "animate__animated animate__fadeOutUp"
                : "animate__animated animate__fadeInDown"
              : "scale-95"
          } max-w-4xl w-full h-[80vh]`}
        >
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Edit Employee
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
          <div className="py-4">
            <form onSubmit={handleSubmit}>
              <ul
                className={
                  error
                    ? "bg-red-400 text-white max-w-fit px-2 py-1 rounded-md"
                    : ""
                }
              >
                {error && error.map((err, i) => <li key={i}>{err.msg}</li>)}
              </ul>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                <div className="block mt-2 mx-1 text-black dark:text-white">
                  <label htmlFor="first_name" className="text-xl">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    className="py-1 px-1 w-full bg-slate-100 dark:bg-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                    id="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="block mt-2 text-black dark:text-white">
                  <label htmlFor="last_name" className="text-xl">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    className="py-1 px-1 w-full bg-slate-100 dark:bg-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                    id="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="block mt-2 text-black dark:text-white">
                <label htmlFor="email" className="text-xl">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="py-1 px-1 w-full bg-slate-100 dark:bg-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="block mt-2 text-black dark:text-white">
                <label htmlFor="phone_number" className="text-xl">
                  Phone Number
                </label>
                <input
                  type="number"
                  name="phone_number"
                  className="py-1 px-1 w-full bg-slate-100 dark:bg-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                  id="phone_number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                <div className="block mt-2 text-black dark:text-white">
                  <label htmlFor="department" className="text-xl">
                    Department
                  </label>
                  <select
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    value={selectedDepartment}
                    className="py-1 px-1 w-full bg-slate-100 dark:bg-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                    required
                  >
                    <option value="">-- Select Department --</option>
                    {Array.isArray(departments) &&
                      departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="block mt-2 text-black dark:text-white">
                  <label htmlFor="position" className="text-xl">
                    Position
                  </label>
                  <select
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    value={selectedPosition}
                    className="py-1 px-1 w-full bg-slate-100 dark:bg-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                    required
                  >
                    <option value="">-- Select Position --</option>
                    {Array.isArray(positions) &&
                      positions.map((pos) => (
                        <option key={pos.id} value={pos.id}>
                          {pos.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="mt-24">
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
