import React, { useState, useEffect } from "react";
import { createData, getData } from "../../services/Api";
import { Link, useNavigate } from "react-router-dom";
import AdminModal from "../../components/modals/AdminModal";
import AdminNav from "../../components/navbars/AdminNav";
import DetailModal from "../../components/modals/DetailModal";
import EmployeeTable from "../../components/admin/EmployeeTable";
import { useSelector } from "react-redux";
import { showToastAlertWithCustomAnimation } from "../../utils/alert";
import axios from "axios";

export default function EmployeeList() {
  const [employee, setEmployee] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [id, setId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [file, setFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const { permit } = useSelector((state) => state.permit);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, keyword]);

  const fetchData = async (page) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = keyword
        ? await createData(`/employee/1/search?page=${page}`, { keyword })
        : await getData(`/employees/1?page=${page}`);

      const filteredEmployees = response.data.filter(
        (employee) => employee.is_resign !== true
      );

      setEmployee(filteredEmployees);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchKeyUp = (e) => {
    if (e.key === "Enter" || e.key === undefined) {
      setCurrentPage(1);
      fetchData(1);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Validate the file type
    if (
      selectedFile &&
      (selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel")
    ) {
      setFile(selectedFile);
      setError(null); // Clear previous error
    } else {
      setError("Only Excel files (.xlsx or .xls) are allowed.");
      setFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a valid Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/upload/file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Set the JSON data in the state
      const data = response.data;
      const upload = await createData("/employees/batch", { data });
      setError(null);
      setFile(null); // Reset file after upload
      if (upload) {
        showToastAlertWithCustomAnimation(
          "Employees Added Successfully",
          "success"
        );
      }
      fetchData(currentPage); // Refresh data after upload
      setShowUpload(false);
    } catch (error) {
      setError("Error uploading file");
      showToastAlertWithCustomAnimation("Upload Failed", "error");
      console.error("Error uploading file:", error);
    }
  };

  const handleUpdate = () => {
    fetchData(currentPage);
  };

  return (
    <>
      <AdminNav title={"ADMIN DASHBOARD"} />
      <div className="p-6 max-w-full pt-[85px] px-4 pb-[90px] h-screen bg-gray-100 rounded-lg shadow-md dark:bg-gray-800 text-white">
        <AdminModal
          title={"Add New Employee"}
          mode={"employee"}
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
            handleUpdate={handleUpdate}
          />
        )}
        <Link
          to={"/"}
          className="hover:text-sky-400 text-black dark:text-white dark:hover:text-blue-200"
        >
          &larr; Back
        </Link>
        <div className="flex items-center justify-between my-4">
          <p className="text-xl font-semibold text-gray-700 dark:text-white">
            Employees List
          </p>
          {permit.crud_operations.CRUD_employee && (
            <div className="flex items-center space-x-4">
              {showUpload ? (
                <form
                  onSubmit={handleUpload}
                  className="flex items-center space-x-2 text-slate-900"
                >
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="file-input w-full max-w-xs text-slate-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  />
                  <button
                    type="submit"
                    className="py-2 px-4 bg-sky-500 rounded-lg text-md text-white shadow-md hover:bg-sky-400 transition duration-200"
                  >
                    Upload
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowUpload(true)}
                  className="py-2 px-4 bg-sky-500 rounded-lg text-md text-white shadow-md hover:bg-sky-400 transition duration-200"
                >
                  Upload File
                </button>
              )}
              <button
                onClick={() => setOpenModal(true)}
                className="py-2 px-4 bg-sky-500 rounded-lg text-md text-white shadow-md hover:bg-sky-400 transition duration-200"
              >
                Add New Employee
              </button>
            </div>
          )}
        </div>
        <div className="mb-4">
          <input
            className="w-full bg-slate-100 rounded-lg py-2 px-4 text-md text-gray-700 border border-gray-300 dark:bg-gray-600 dark:focus:bg-gray-400 dark:text-white focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-lime-200 dark:focus:ring-blue-200 shadow-md"
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyUp={handleSearchKeyUp}
            placeholder="Search Employee"
          />
        </div>
        <EmployeeTable
          employee={employee}
          isLoading={isLoading}
          error={error}
          setId={setId}
          setOpenDetail={setOpenDetail}
          handlePageChange={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}
