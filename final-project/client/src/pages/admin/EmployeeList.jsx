/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { getData } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import AdminModal from "../../components/modals/AdminModal";
import AdminNav from "../../components/navbars/AdminNav";

export default function EmployeeList() {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData("/employee");
        console.log(response);
        setEmployee(response);
        setIsLoading(false);
      } catch (err) {
        console.log("Error:", err);
        setError(err);
        setIsLoading(false); // stop loading on error
      }
    };

    fetchData();
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <AdminNav />
      <div className="p-6 max-w-full mx-4 h-screen bg-white rounded-lg shadow-md">
        <AdminModal isOpen={openModal} onClose={handleCloseModal} />
        <div
          onClick={() => navigate("/")}
          className="hover:cursor-pointer hover:text-lime-500"
        >
          &larr; Back
        </div>
        <div className="flex items-center justify-between my-4">
          <p className="text-xl font-semibold text-gray-700">Employees List</p>
          <button
            onClick={() => setOpenModal(true)}
            className="py-2 px-4 bg-lime-500 rounded-3xl text-sm text-white shadow-sm hover:bg-lime-600"
          >
            Add New Employee
          </button>
        </div>
        <div className="mb-4">
          <input
            className="w-full bg-slate-100 rounded-lg py-2 px-4 text-sm text-gray-700 border border-gray-300 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-lime-200 shadow-sm"
            type="search"
            name="search"
            id="search"
            placeholder="Search Employee"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="py-2 px-4 border-b text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="py-2 px-4 border-b text-sm font-semibold text-gray-600">
                  Role
                </th>
                <th className="py-2 px-4 border-b text-sm font-semibold text-gray-600">
                  Phone No
                </th>
                <th className="py-2 px-4 border-b text-sm font-semibold text-gray-600">
                  Joining Date
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}
              {employee
                ? employee.map((data) => (
                    <tr key={data.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-sm text-gray-700">{`${data.first_name} ${data.last_name}`}</td>
                      <td className="py-2 px-4 border-b text-sm text-gray-700">
                        {data.email}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-700">
                        {data.Position ? data.Position.name : "No Position"}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-700">
                        {data.phone_number}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-700">
                        {new Date(data.createdAt)
                          .toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                          .replace(/\s(?=\d)/, ", ")}
                      </td>
                    </tr>
                  ))
                : !isLoading && (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-4 text-center text-gray-500"
                      >
                        Table Empty!
                      </td>
                    </tr>
                  )}
              {error && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-red-500">
                    Error loading data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
