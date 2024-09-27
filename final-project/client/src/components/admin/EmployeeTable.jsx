/* eslint-disable react/prop-types */
import React from "react";

export default function EmployeeTable({
  employee,
  isLoading,
  error,
  setId,
  setOpenDetail,
  handlePageChange,
  currentPage,
  totalPages,
}) {
  console.log("Current Page:", currentPage);
  console.log("Total Page:", totalPages);

  return (
    <div className="bg-white rounded-md shadow-md p-4">
      {/* Display employees table */}
      <div
        className={`overflow-x-auto transition-opacity ${
          isLoading || error ? "opacity-0" : "opacity-100"
        } duration-500`}
      >
        <table className="min-w-full bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-400 rounded-lg shadow-sm mb-2 animate-fadeIn">
          <thead>
            <tr className="bg-blue-600">
              <th className="py-2 px-4 border-b text-left text-md font-semibold text-gray-600 dark:text-white text-white">
                Name
              </th>
              <th className="py-2 px-4 border-b text-left text-md font-semibold text-gray-600 dark:text-white text-white">
                Email
              </th>
              <th className="py-2 px-4 border-b text-left text-md font-semibold text-gray-600 dark:text-white text-white">
                Position
              </th>
              <th className="py-2 px-4 border-b text-left text-md font-semibold text-gray-600 dark:text-white text-white">
                Joining Date
              </th>
              <th className="py-2 px-4 border-b text-md font-semibold text-gray-600 dark:text-white"></th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  {error}
                </td>
              </tr>
            )}
            {Array.isArray(employee) && employee.length > 0
              ? employee.map((data) => (
                  <tr
                    key={data.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-400"
                  >
                    <td className="py-2 px-4 border-b text-md text-gray-700 dark:text-white">{`${data.first_name} ${data.last_name}`}</td>
                    <td className="py-2 px-4 border-b text-md text-gray-700 dark:text-white">
                      {data.email}
                    </td>
                    <td className="py-2 px-4 border-b text-md text-gray-700 dark:text-white">
                      {data.Position ? data.Position.name : "No Position"}
                    </td>
                    <td className="py-2 px-4 border-b text-md text-gray-700 dark:text-white">
                      {new Date(data.createdAt)
                        .toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                        .replace(/\s(?=\d)/, ", ")}
                    </td>
                    <td className="py-2 px-1 border-b text-md text-sky-400 dark:text-blue-400">
                      <p
                        onClick={() => {
                          setOpenDetail(true);
                          setId(data.id);
                        }}
                        className="px-1 py-1 max-w-24 hover:bg-blue-400 hover:text-white hover:cursor-pointer rounded-full border border-blue-400"
                      >
                        View Details
                      </p>
                    </td>
                  </tr>
                ))
              : !isLoading && (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">
                      Table Empty!
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div
        className={`flex justify-center items-center mt-4 pb-2 transition-opacity ${
          isLoading || error ? "opacity-0" : "opacity-100"
        } duration-500`}
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-1 ${
            currentPage === 1
              ? "bg-gray-300 dark:text-slate-800"
              : "bg-sky-400 dark:bg-blue-400"
          } text-white rounded hover:bg-sky-600 dark:hover:bg-blue-300`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 ${
              currentPage === index + 1
                ? "bg-blue-600 dark:bg-sky-600"
                : "bg-sky-400 dark:bg-blue-400"
            } text-white rounded hover:bg-sky-600 dark:hover:bg-blue-300`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || employee.length === 0}
          className={`px-4 py-2 mx-1 ${
            currentPage === totalPages || employee.length === 0
              ? "bg-gray-300 dark:text-slate-800"
              : "bg-sky-400 dark:bg-blue-400"
          } text-white rounded hover:bg-sky-600`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
