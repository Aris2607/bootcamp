import React, { useState, useEffect } from "react";
import { createData, getData } from "../../services/Api";
import { Link, useNavigate } from "react-router-dom";
import AdminModal from "../../components/modals/AdminModal";
import AdminNav from "../../components/navbars/AdminNav";
import DetailModal from "../../components/modals/DetailModal";
import EmployeeTable from "../../components/admin/EmployeeTable";
import { useSelector } from "react-redux";

export default function AdminList() {
  const [employee, setEmployee] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [id, setId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { permit } = useSelector((state) => state.permit);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    setIsLoading(true);
    setError(null); // Reset error on every new fetch
    try {
      const response = keyword
        ? await createData(`/employee/2/search?page=${page}`, { keyword })
        : await getData(`/employees/2?page=${page}`);

      setEmployee(response.data.employees || response.data); // Adjust this according to your API response
      setTotalPages(response.totalPages); // Ensure totalPages is correct in both search and default
      console.log("Employee response:", response);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1); // Reset to page 1 when a new search is executed
      fetchData(1); // Trigger the search starting from page 1
    }
  };

  return (
    <>
      <AdminNav title={"ADMIN DASHBOARD"} />
      <div className="p-6 max-w-full pt-[75px] mx-4 h-[700px] bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <AdminModal
          title={"Add New Admin"}
          mode={"admin"}
          setIsLoading={setIsLoading}
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          id={id}
          setCurrentPage={setCurrentPage}
          refreshData={() => fetchData(currentPage)}
        />
        {openDetail && (
          <DetailModal
            isOpen={openDetail}
            onClose={() => setOpenDetail(false)}
            eId={id}
          />
        )}
        <Link
          to={"/admin"}
          className="hover:text-teal-400 dark:text-white dark:hover:text-blue-400"
        >
          &larr; Back
        </Link>
        <div className="flex items-center justify-between my-4">
          <p className="text-xl font-semibold text-gray-700 dark:text-white">
            Admin List
          </p>
          {permit.crud_operations.CRUD_admin && (
            <button
              onClick={() => setOpenModal(true)}
              className="py-2 px-4 bg-sky-500 rounded-3xl text-md text-white shadow-md hover:bg-sky-400 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Add New Admin
            </button>
          )}
        </div>
        <div className="mb-4">
          <input
            className="w-full bg-slate-100 rounded-lg py-2 px-4 text-md text-gray-700 border border-gray-300 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-lime-200 shadow-md"
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search Employee"
          />
        </div>
        <EmployeeTable
          employee={employee}
          isLoading={isLoading}
          error={error}
          setId={setId}
          setOpenDetail={setOpenDetail}
          handlePageChange={setCurrentPage} // Update pagination correctly
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}
