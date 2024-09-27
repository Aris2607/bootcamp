import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import { createData, getData } from "../../services/Api";
import { useSelector } from "react-redux";
import UserNav from "../../components/navbars/UserNav";
import AdminNav from "../../components/navbars/AdminNav";
import "./leavePage.css";
import { showToastAlertWithCustomAnimation } from "../../utils/alert";

const EmployeeLeavePage = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [error, setError] = useState("");
  const [leaveType, setLeaveType] = useState(""); // State untuk jenis cuti
  const [reason, setReason] = useState(""); // State untuk alasan
  const [isLoading, setIsLoading] = useState(false); // Loading state untuk tombol

  const { user } = useSelector((state) => state.auth);

  const today = new Date();

  // Fungsi untuk mengambil tanggal dalam range tertentu
  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Fungsi untuk perubahan tanggal
  const handleDateChange = (dates) => {
    if (dates.length === 0) {
      setSelectedDates([]);
      setError("");
      return;
    }

    const sortedDates = dates.sort((a, b) => a - b);
    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);

    if (sortedDates.length === 1) {
      if (startDate.getDay() !== 6 && startDate.getDay() !== 0) {
        setSelectedDates([startDate]);
      } else {
        setError(
          "Tanggal yang dipilih tidak bisa jatuh pada hari Sabtu atau Minggu."
        );
      }
      setError("");
    } else if (sortedDates.length === 2) {
      if (startDate < today || endDate < today) {
        setError("Tidak bisa memilih tanggal yang sudah lewat.");
        return;
      }

      const allDatesInRange = getDatesInRange(startDate, endDate);
      setSelectedDates(allDatesInRange);
      setError("");
    } else {
      setError("Select only two dates to specify the range.");
    }
  };

  // Fungsi untuk pengajuan cuti
  const handleApplyLeave = async () => {
    if (!leaveType || !reason) {
      setError("Jenis cuti dan alasan harus diisi.");
      return;
    }

    setIsLoading(true); // Set loading saat pengajuan
    try {
      const check = await getData(`/employee/${user.employee_id}/check`);

      console.log(check);

      if (check.canLeave) {
        const response = await createData(
          `/employee/${user.employee_id}/leave/request`,
          {
            start_date: selectedDates[0],
            end_date: selectedDates[selectedDates.length - 1],
            total_days: selectedDates.length,
            reason,
            leave_type: leaveType,
          }
        );
        console.log(response);
        setSelectedDates([]);
        setLeaveType("");
        setReason("");
        setError("");
        setIsLoading(false); // Set loading selesai
        showToastAlertWithCustomAnimation(
          "Leave reaquest has been delivered",
          "success"
        );
      } else {
        setIsLoading(false);
        showToastAlertWithCustomAnimation(
          "You are already have leave request",
          "info"
        );
      }
    } catch (error) {
      setIsLoading(false);
      showToastAlertWithCustomAnimation("Reason is too long", "error");
    }
  };

  return (
    <>
      <AdminNav title={""} />
      <div className="min-h-screen p-1 pt-20 dark:bg-slate-900">
        <h1 className="text-4xl font-bold mb-6 text-center dark:text-white">
          Employee Leave Management
        </h1>

        <div className="card bg-base-100 shadow-xl p-6 mb-10 dark:bg-slate-500 w-[1200px] h-[500px] mx-auto">
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">
            Request For Leave
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pilih Tanggal Cuti */}
            <div className="form-control">
              <label className="label">
                <span className="label-text dark:text-white">Leave Date</span>
              </label>
              <DatePicker
                value={selectedDates}
                onChange={handleDateChange}
                multiple
                minDate={today}
                format="YYYY-MM-DD"
                style={{ backgroundColor: "white" }}
                className="input bg-white input-bordered w-full dark:text-white"
                placeholder="Select Date"
                dayStyle={(date) => {
                  const day = date.getDay();
                  // Highlight Saturdays and Sundays
                  if (day === 0 || day === 6) {
                    return { backgroundColor: "red", color: "white" }; // Red background for weekends
                  }
                  return {};
                }}
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {/* Pilih Jenis Cuti */}
            <div className="form-control">
              <label className="label">
                <span className="label-text dark:text-white">Jenis Cuti</span>
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="select select-bordered w-full dark:text-white dark:bg-slate-600"
              >
                <option value="">Select leave type</option>
                <option value="Sick">Sick</option>
                <option value="Annual">Annual Leave</option>
              </select>
            </div>
          </div>

          {/* Alasan Cuti */}
          <div className="form-control mt-6">
            <label className="label">
              <span className="label-text dark:text-white">Reason</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="textarea textarea-bordered w-full dark:bg-slate-600 dark:text-white"
              rows="4"
              placeholder="Berikan alasan cuti"
            />
          </div>

          {/* Tombol Ajukan Cuti */}
          <button
            onClick={handleApplyLeave}
            className="btn btn-primary btn-block mt-6 dark:bg-blue-800 dark:text-white"
            disabled={selectedDates.length === 0 || isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm dark:text-white"></span>
            ) : (
              "Apply"
            )}
          </button>
        </div>

        {/* Tabel Tanggal yang Dipilih */}
        {/* <h2 className="text-3xl font-semibold mb-4">
          Tanggal Cuti yang Dipilih
        </h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full mt-6">
            <thead>
              <tr>
                <th>#</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {selectedDates.map((date, index) => (
                <tr key={index} className="hover">
                  <td>{index + 1}</td>
                  <td>
                    {date instanceof Date
                      ? date.toISOString().split("T")[0]
                      : date}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        setSelectedDates(
                          selectedDates.filter((_, i) => i !== index)
                        )
                      }
                      className="btn btn-error btn-xs"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>
    </>
  );
};

export default EmployeeLeavePage;
