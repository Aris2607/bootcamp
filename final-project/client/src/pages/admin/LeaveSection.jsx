import LeaveCard from "../../components/admin/LeaveCard";
import AdminNav from "../../components/navbars/AdminNav";
import { useState, useEffect } from "react";
import { getData } from "../../services/Api";
import "./LeaveSection.css";
import LeaveStatistics from "../../components/admin/LeaveStatistics";

const LeaveSection = () => {
  const [leaves, setLeaves] = useState([]);
  const [activeFilter, setActiveFilter] = useState("New");

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
    getLeave();
  }, []);

  // Function to update leave status
  const updateLeaveStatus = (leaveId, newStatus) => {
    setLeaves((prevLeaves) =>
      prevLeaves.map((leave) =>
        leave.id === leaveId ? { ...leave, status: newStatus } : leave
      )
    );
  };

  const getPendingLeaves = () =>
    leaves.filter((leave) => leave.status === "Pending");
  const getEarlierLeaves = () =>
    leaves.filter(
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
    <>
      <AdminNav />
      <div className="max-w-7xl mx-auto mt-28 flex space-x-6">
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
                  ? "text-gray-500 border-gray-500"
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
                  onStatusChange={updateLeaveStatus} // Passing callback to LeaveCard
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
                  onStatusChange={updateLeaveStatus} // Passing callback to LeaveCard
                  status={leave.status}
                />
              ))}
          </div>
        </div>

        {/* Right Column (Additional Features) */}
        <div className="w-1/3 flex flex-col justify-end">
          {/* Statistics Panel */}
          <div className="mb-6 p-4 flex flex-wrap bg-white shadow rounded-lg">
            <div>
              <h2 className="text-xl font-semibold mb-4 absolute">
                Statistics
              </h2>
              {/* <ul>
                <li>Total Leaves: {totalLeaves}</li>
                <li>Approved Leaves: {approvedLeaves}</li>
                <li>Rejected Leaves: {rejectedLeaves}</li>
                <li>Pending Leaves: {getPendingLeaves().length}</li>
              </ul> */}
            </div>
            <LeaveStatistics
              approvedLeaves={approvedLeaves}
              rejectedLeaves={rejectedLeaves}
              pendingLeaves={getPendingLeaves().length}
            />
          </div>

          {/* Search & Filter Panel */}
          <div className="mb-6 p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Search & Filter</h2>
            <input
              type="text"
              className="border p-2 w-full mb-4"
              placeholder="Search by Employee Name"
            />
            <select className="border p-2 w-full mb-4">
              <option>Filter by Leave Type</option>
              <option>Annual Leave</option>
              <option>Sick Leave</option>
            </select>
            <select className="border p-2 w-full mb-4">
              <option>Filter by Status</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Pending</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaveSection;
