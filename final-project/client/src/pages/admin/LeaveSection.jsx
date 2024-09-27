import LeaveCard from "../../components/admin/LeaveCard";
import AdminNav from "../../components/navbars/AdminNav";
import { useState, useEffect } from "react";
import { getData } from "../../services/Api";
import "./LeaveSection.css";
import LeaveStatistics from "../../components/admin/LeaveStatistics";

const LeaveSection = () => {
  const [leaves, setLeaves] = useState([]);
  const [activeFilter, setActiveFilter] = useState("New");
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const getLeave = async () => {
    try {
      const response = await getData("/employee/leave/all");
      console.log(response);
      setLeaves(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLeave(); // Initial fetch

    const interval = setInterval(() => {
      getLeave(); // Fetch every 5 minutes
    }, 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Function to update leave status
  const updateLeaveStatus = (leaveId, newStatus) => {
    setLeaves((prevLeaves) =>
      prevLeaves.map((leave) =>
        leave.id === leaveId ? { ...leave, status: newStatus } : leave
      )
    );
  };

  const getFilteredLeaves = () => {
    let filteredLeaves = leaves;

    // Apply search filter
    if (searchTerm) {
      filteredLeaves = filteredLeaves.filter((leave) =>
        `${leave.Employee.first_name} ${leave.Employee.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Apply leave type filter
    if (leaveTypeFilter) {
      filteredLeaves = filteredLeaves.filter(
        (leave) => leave.leave_type === leaveTypeFilter
      );
    }

    // Apply status filter
    if (statusFilter) {
      filteredLeaves = filteredLeaves.filter(
        (leave) => leave.status === statusFilter
      );
    }

    return filteredLeaves;
  };

  const getPendingLeaves = () =>
    getFilteredLeaves().filter((leave) => leave.status === "Pending");

  const getEarlierLeaves = () =>
    getFilteredLeaves().filter(
      (leave) => leave.status === "Approved" || leave.status === "Rejected"
    );

  // Calculate leave statistics
  const totalLeaves = leaves.length;
  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "Approved"
  ).length;
  const rejectedLeaves = leaves.filter(
    (leave) => leave.status === "Rejected"
  ).length;

  return (
    <div className="bg-gray-100 min-h-screen">
      <AdminNav title={"ADMIN DASHBOARD"} />
      <div className="max-w-7xl mx-auto pt-28 flex space-x-6">
        {/* Left Column */}
        <div className="w-2/3">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveFilter("New")}
              className={`font-semibold text-lg border-b-2 pb-1 ${
                activeFilter === "New"
                  ? "text-teal-500 border-teal-500"
                  : "text-gray-400 border-transparent"
              }`}
            >
              New ({getPendingLeaves().length})
            </button>
            <button
              onClick={() => setActiveFilter("Earlier")}
              className={`font-semibold text-lg border-b-2 pb-1 ${
                activeFilter === "Earlier"
                  ? "text-teal-500 border-teal-500"
                  : "text-gray-400 border-transparent"
              }`}
            >
              Earlier ({getEarlierLeaves().length})
            </button>
          </div>
          <div className="h-[520px] overflow-y-auto">
            {activeFilter === "New" &&
              getPendingLeaves().map((leave) => (
                <LeaveCard
                  key={leave.id}
                  id={leave.id}
                  name={`${leave.Employee.first_name} ${leave.Employee.last_name}`}
                  designation={leave.Employee.Position.name}
                  leaveType="Leave"
                  reason={leave.reason}
                  duration={`${leave.start_date} - ${leave.end_date}`}
                  leaveTypeDetail={`${leave.leave_type} leave`}
                  manager="Alex"
                  buttonText="Accept"
                  onStatusChange={updateLeaveStatus}
                />
              ))}
            {activeFilter === "Earlier" &&
              getEarlierLeaves().map((leave) => (
                <LeaveCard
                  key={leave.id}
                  id={leave.id}
                  name={`${leave.Employee.first_name} ${leave.Employee.last_name}`}
                  designation={leave.Employee.Position.name}
                  leaveType="Leave"
                  reason={leave.reason}
                  duration={`${leave.start_date} - ${leave.end_date}`}
                  leaveTypeDetail={`${leave.leave_type} leave`}
                  manager="Alex"
                  buttonText="Accept"
                  showActionButtons={false}
                  onStatusChange={updateLeaveStatus}
                  status={leave.status}
                />
              ))}
          </div>
        </div>

        {/* Right Column (Additional Features) */}
        <div className="w-1/3 flex flex-col justify-end">
          {/* Statistics Panel */}
          <div className="mb-6 p-4 flex flex-wrap bg-white shadow rounded-lg dark:bg-gray-500">
            <LeaveStatistics
              approvedLeaves={approvedLeaves}
              rejectedLeaves={rejectedLeaves}
              pendingLeaves={getPendingLeaves().length}
            />
          </div>

          {/* Search & Filter Panel */}
          <div className="mb-6 p-4 bg-white shadow rounded-lg dark:bg-gray-500">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Search & Filter
            </h2>
            <input
              type="text"
              className="border p-2 w-full mb-4 dark:text-white"
              placeholder="Search by Employee Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border p-2 w-full mb-4"
              value={leaveTypeFilter}
              onChange={(e) => setLeaveTypeFilter(e.target.value)}
            >
              <option value="">Filter by Leave Type</option>
              <option value="Annual">Annual Leave</option>
              <option value="Sick">Sick Leave</option>
            </select>
            <select
              className="border p-2 w-full mb-4"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Filter by Status</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveSection;
