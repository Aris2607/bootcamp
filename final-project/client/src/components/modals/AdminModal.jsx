import React, { useState } from "react";
import { createData } from "../../services/Api";

export default function AdminModal({ setIsLoading, isOpen, onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [profile, setProfile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null); // State for preview
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

        if (fileResponse.data && fileResponse.message) {
          profileUrl = fileResponse.data.filename;
        } else {
          console.error(
            "File upload response does not contain 'url'.",
            fileResponse
          );
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
        department_id: department,
        position_id: position,
        profile_picture: profileUrl,
      };

      const response = await createData("/employee", employeeData);
      console.log(response);

      const username = createUser(
        response.data.first_name,
        response.data.createdAt
      );

      const userResponse = await createData("/user", {
        employee_id: response.data.id,
        username,
        password: null,
        role_id: 1,
      });

      console.log("User Response:", userResponse);

      const response2 = await createData("/send-create-password", {
        email,
        username,
      });

      console.log("Response2:", response2);

      clearField();
      onClose();
    } catch (err) {
      console.error("Error uploading or saving data:", err);
      setError(err.errors || ["An error occurred"]);
    } finally {
      setIsLoading(false);
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
    setDepartment("");
    setPosition("");
    setProfile(null);
    setProfilePreview(null); // Clear the preview
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
            Add New Employee
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
              {error && error.map((err, i) => <li key={i}>{err.msg}</li>)}
            </ul>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              <div className="block mt-2 mx-1">
                <label htmlFor="first_name" className="text-xl">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  className="py-1 px-1 w-full bg-slate-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                  id="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="block mt-2">
                <label htmlFor="last_name" className="text-xl">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  className="py-1 px-1 w-full bg-slate-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                  id="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="block mt-2">
              <label htmlFor="email" className="text-xl">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="py-1 px-1 w-full bg-slate-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="block mt-2">
              <label htmlFor="phone_number" className="text-xl">
                Phone Number
              </label>
              <input
                type="number"
                name="phone_number"
                className="py-1 px-1 w-full bg-slate-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                id="phone_number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              <div className="block mt-2">
                <label htmlFor="department" className="text-xl">
                  Department
                </label>
                <select
                  onChange={(e) => setDepartment(e.target.value)}
                  value={department}
                  className="py-1 px-1 w-full bg-slate-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                >
                  <option value="">-- Select Department --</option>
                  <option value="1">Department 1</option>
                  <option value="2">Department 2</option>
                </select>
              </div>
              <div className="block mt-2">
                <label htmlFor="position" className="text-xl">
                  Position
                </label>
                <select
                  onChange={(e) => setPosition(e.target.value)}
                  value={position}
                  className="py-1 px-1 w-full bg-slate-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                >
                  <option value="">-- Select Position --</option>
                  <option value="1">Position 1</option>
                  <option value="2">Position 2</option>
                </select>
              </div>
            </div>
            <div className="block mt-2">
              <label htmlFor="profile" className="text-xl">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                name="profile"
                className="py-1 px-1 w-full bg-slate-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
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
                onClick={onClose}
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
