import React from "react";

function AttendanceTable() {
  const employees = [
    { name: "William John", attendance: ["✓", "✓", "✓", "✓", "✓", "✓", "✓"] },
    { name: "Rony Smith", attendance: ["✓", "✓", "✓", "✓", "✓", "✓", "✓"] },
    { name: "Alex William", attendance: ["✓", "✓", "✓", "✓", "✓", "✓", "✓"] },
    // Add more employees as needed
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        ATTENDANCE - JULY 2024
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 text-gray-600">Employee</th>
              <th className="px-4 py-2 text-gray-600">1</th>
              <th className="px-4 py-2 text-gray-600">2</th>
              <th className="px-4 py-2 text-gray-600">3</th>
              <th className="px-4 py-2 text-gray-600">4</th>
              <th className="px-4 py-2 text-gray-600">5</th>
              <th className="px-4 py-2 text-gray-600">6</th>
              <th className="px-4 py-2 text-gray-600">7</th>
              {/* Add more dates as needed */}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index}>
                <td className="border-t px-4 py-2">{employee.name}</td>
                {employee.attendance.map((day, idx) => (
                  <td key={idx} className="border-t px-4 py-2 text-green-500">
                    {day}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceTable;
