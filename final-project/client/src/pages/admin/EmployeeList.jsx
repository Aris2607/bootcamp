/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { createData, getData } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import AdminModal from "../../components/modals/AdminModal";
import AdminNav from "../../components/navbars/AdminNav";
import DetailModal from "../../components/modals/DetailModal";

export default function EmployeeList() {
  const [employee, setEmployee] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [id, setId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [userFound, setUserFound] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, keyword]);

  const fetchData = async (page) => {
    setIsLoading(true);
    try {
      if (keyword) {
        const response = await createData(`/employee/search?page=${page}`, {
          keyword,
        });
        setEmployee(response.data); // use 'data' from response
        setUserFound(response.data);
        setTotalPages(response.data.totalPages);
      } else {
        const response = await getData(`/employee?page=${page}`);
        setEmployee(response.data);
        setTotalPages(response.totalPages);
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  console.log("Keyword:", keyword);
  console.log("UserFound:", userFound);

  return (
    <>
      <AdminNav />
      <div className="p-6 max-w-full mx-4 h-auto bg-white rounded-lg shadow-md">
        <AdminModal
          setIsLoading={setIsLoading}
          isOpen={openModal}
          onClose={handleCloseModal}
          id={id}
        />
        {openDetail && (
          <DetailModal
            isOpen={openDetail}
            onClose={handleCloseDetail}
            eId={id}
          />
        )}
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
            className="py-2 px-4 bg-teal-400 rounded-3xl text-md text-white shadow-md hover:bg-lime-600"
          >
            Add New Employee
          </button>
        </div>
        <div className="mb-4">
          <input
            className="w-full bg-slate-100 rounded-lg py-2 px-4 text-md text-gray-700 border border-gray-300 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-lime-200 shadow-md"
            type="search"
            name="search"
            id="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search Employee"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm mb-2">
            <thead>
              <tr className="0">
                <th className="py-2 px-4 border-b text-left text-md font-semibold text-gray-600">
                  Name
                </th>
                <th className="py-2 px-4 border-b text-left text-md font-semibold text-gray-600">
                  Email
                </th>
                <th className="py-2 px-4 border-b text-left text-md font-semibold text-gray-600">
                  Role
                </th>
                <th className="py-2 px-4 border-b text-left text-md font-semibold text-gray-600">
                  Phone No
                </th>
                <th className="py-2 px-4 border-b text-left text-md font-semibold text-gray-600">
                  Joining Date
                </th>
                <th className="py-2 px-4 border-b text-md font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}
              {Array.isArray(employee) && employee.length > 0
                ? employee.map((data) => (
                    <tr key={data.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-md text-gray-700">{`${data.first_name} ${data.last_name}`}</td>
                      <td className="py-2 px-4 border-b text-md text-gray-700">
                        {data.email}
                      </td>
                      <td className="py-2 px-4 border-b text-md text-gray-700">
                        {data.Position ? data.Position.name : "No Position"}
                      </td>
                      <td className="py-2 px-4 border-b text-md text-gray-700">
                        {data.phone_number}
                      </td>
                      <td className="py-2 px-4 border-b text-md text-gray-700">
                        {new Date(data.createdAt)
                          .toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                          .replace(/\s(?=\d)/, ", ")}
                      </td>
                      <td className="py-2  px-1 border-b text-md text-teal-400">
                        <p
                          onClick={() => {
                            setOpenDetail(true);
                            setId(data.id);
                          }}
                          className="px-1 py-1 max-w-24 hover:bg-teal-400 hover:text-white hover:cursor-pointer rounded-full border border-teal-400"
                        >
                          View Details
                        </p>
                      </td>
                    </tr>
                  ))
                : !isLoading && (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-4 text-center text-gray-500"
                      >
                        Table Empty!
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 mb-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-1 ${
              currentPage === 1 ? "bg-gray-300" : "bg-teal-400"
            } text-white rounded hover:bg-teal-600`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 ${
                currentPage === index + 1 ? "bg-lime-600" : "bg-teal-400"
              } text-white rounded hover:bg-teal-600`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 mx-1 ${
              currentPage === totalPages ? "bg-gray-300" : "bg-teal-400"
            } text-white rounded hover:bg-teal-600`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
