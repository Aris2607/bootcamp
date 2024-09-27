/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { createData, getData } from "../../services/Api";
import { showSuccessAlert } from "../../utils/alert";

export default function RegisterModal({
  title,
  mode,
  setIsLoading,
  isOpen,
  onClose,
  refreshData,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [profile, setProfile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let profileUrl = "";

      if (profile) {
        const fileFormData = new FormData();
        fileFormData.append("profile_picture", profile);

        // Upload profile picture
        const fileResponse = await createData("/upload", fileFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("File upload response:", fileResponse);

        if (fileResponse.data && fileResponse.data.filename) {
          profileUrl = fileResponse.data.filename;
        } else {
          console.error("File upload failed:", fileResponse);
          setError(["File upload failed."]);
          setIsLoading(false);
          return;
        }
      }

      console.log("Add Data....");
      const employeeData = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phone,
        department_id: 3, // Use selectedDepartment
        position_id: 6, // Use selectedPosition
        profile_picture: profileUrl,
      };

      console.log(employeeData);

      const response = await createData("/employee", employeeData);
      console.log(response);

      if (response) {
        const username = createUser(
          response.data.first_name,
          response.data.createdAt
        );

        if (mode === "employee") {
          await createData("/user", {
            employee_id: response.data.id,
            username,
            password: null,
            role_id: 1,
          });
        }

        if (mode === "admin") {
          await createData("/user", {
            employee_id: response.data.id,
            username,
            password: null,
            role_id: 2,
          });
        }

        const dataArray = Array.from({ length: 5 }, (_, i) => ({
          employee_id: response.data.id,
          schedule_id: i + 1,
        }));

        await createData("/employee/schedule", { dataArray });

        await createData("/send-create-password", {
          email,
          username,
        });

        showSuccessAlert("Success", "Employee Added Successfully");
        clearField();
        onClose();
      }
    } catch (err) {
      console.error("Error uploading or saving data:", err);
      setError(err.errors || ["An error occurred"]);
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await getData("/departments");
      setDepartments(response);
    };

    fetchDepartments();
  }, []);

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);

    if (departmentId) {
      const response = await getData(
        `/positions?department_id=${departmentId}`
      );
      setPositions(response);
    } else {
      setPositions([]);
      setSelectedPosition(""); // Reset selected position if no department
    }
  };

  const createUser = (first_name, num) => {
    const unique = new Date(num).toLocaleTimeString("id-ID").split(".");
    let temp = first_name;

    unique.slice(1).forEach((uniq) => {
      temp += uniq;
    });

    return temp;
  };

  const clearField = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setProfile(null);
    setProfilePreview(null);
    setSelectedDepartment(""); // Reset selected department
    setSelectedPosition(""); // Reset selected position
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile(file);

    // Set preview URL for the image
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setProfilePreview(null);
    }
  };

  console.log("ERROR:", error);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed inset-0 bg-black opacity-50 ${
          isOpen ? "transition-opacity duration-300" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-lg shadow-lg dark:bg-gray-700 p-4 md:p-5 transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={onClose}
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
              {error && error > 1 ? (
                error.map((err, i) => <li key={i}>{err}</li>)
              ) : (
                <li>{error}</li>
              )}
            </ul>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              <div className="block mt-2 mx-1 text-black dark:text-white">
                <label htmlFor="first_name" className="text-xl">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  className="py-1 px-1 w-full bg-slate-100 dark:bg-[#1a1a1a] dark:text-[#e0e0e0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
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
                  className="py-1 px-1 w-full bg-slate-100 dark:bg-[#1a1a1a] dark:text-[#e0e0e0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
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
                className="py-1 px-1 w-full bg-slate-100 dark:bg-[#1a1a1a] dark:text-[#e0e0e0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
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
                className="py-1 px-1 w-full bg-slate-100 dark:bg-[#1a1a1a] dark:text-[#e0e0e0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                id="phone_number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="block mt-2 text-black dark:text-white">
              <label htmlFor="profile" className="text-xl">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                name="profile"
                className="py-1 px-1 w-full bg-slate-100 dark:bg-[#1a1a1a] dark:text-[#e0e0e0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                id="profile"
                onChange={handleFileChange}
              />
            </div>
            {/* Image preview */}
            {profilePreview && (
              <div className="block mt-2">
                <label className="text-xl">Image Preview</label>
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  className="mt-2 rounded-md w-32 h-32 object-cover"
                />
              </div>
            )}
            <div className="mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
              >
                Submit
              </button>
              <button
                type="button"
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => {
                  clearField();
                  onClose();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
