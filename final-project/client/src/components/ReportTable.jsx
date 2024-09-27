import React from "react";

export default function ReportTable({ type, data }) {
  console.log(type);

  return (
    <div className="shadow-lg p-4 rounded-md bg-white dark:bg-slate-600">
      <table className="table p-2 w-full border-collapse border border-gray-300">
        {/* head */}
        {type === "daily" && (
          <>
            <thead>
              <tr className="bg-white dark:text-white">
                <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900"></th>
                <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                  Name
                </th>
                <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                  Date
                </th>
                <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                  Time In
                </th>
                <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                  Time Out
                </th>
                <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                  status
                </th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {data && data.length > 0 ? (
                data.map((recap, index) => (
                  <tr key={recap.id}>
                    <th className="border px-4 py-2 dark:text-white">
                      {index + 1}
                    </th>
                    <td className="border px-4 py-2 dark:text-white">{`${recap.Employee.first_name} ${recap.Employee.last_name}`}</td>
                    <td className="border px-4 py-2 dark:text-white">
                      {recap.date}
                    </td>
                    <td className="border px-4 py-2 dark:text-white">
                      {recap.time_in ? recap.time_in : "N/A"}
                    </td>
                    <td className="border px-4 py-2 dark:text-white">
                      {recap.time_out ? recap.time_out : "N/A"}
                    </td>
                    <td className="border px-4 py-2 dark:text-white">
                      {recap.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    There&apos;s no data yet
                  </td>
                </tr>
              )}
            </tbody>
          </>
        )}
        {(type === "weekly" || type === "monthly") && (
          <>
            <thead>
              <tr className="bg-white dark:text-white">
                <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900"></th>
                <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                  Name
                </th>
                <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                  Position
                </th>
                <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                  On Time
                </th>
                <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                  Late
                </th>
                <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                  Absent
                </th>
                <th className="border px-4 py-2 bg-blue-600 text-white dark:bg-blue-900">
                  Work Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                Object.values(
                  data.reduce((acc, recap) => {
                    const { employee_id, status, time_in, time_out } = recap;

                    // Jika employee_id belum ada, buat entry baru
                    if (!acc[employee_id]) {
                      acc[employee_id] = {
                        ...recap,
                        present: 0,
                        late: 0,
                        absent: 0,
                        total_work_hours: 0,
                      };
                    }

                    // Hitung berdasarkan status
                    if (status === "On Time") {
                      acc[employee_id].present += 1;
                    } else if (status === "Late") {
                      acc[employee_id].late += 1;
                    } else if (status === "Absent") {
                      acc[employee_id].absent += 1;
                    }

                    // Calculate total work hours (if time_in and time_out exist)
                    if (time_in && time_out) {
                      const timeIn = new Date(`1970-01-01T${time_in}Z`);
                      const timeOut = new Date(`1970-01-01T${time_out}Z`);
                      const hoursWorked = (timeOut - timeIn) / (1000 * 60 * 60); // Convert ms to hours
                      acc[employee_id].total_work_hours += hoursWorked;
                    }

                    return acc;
                  }, {})
                ).map((recap, index) => (
                  <tr key={recap.id}>
                    <th className="border px-4 py-2 dark:text-white">
                      {index + 1}
                    </th>
                    <td className="border px-4 py-2 dark:text-white">
                      {`${recap.Employee.first_name} ${recap.Employee.last_name}`}
                    </td>
                    <td className="border px-4 py-2 dark:text-white">
                      {`${recap.Employee.Position.name}`}
                    </td>
                    <td className="border px-4 py-2 dark:text-white">
                      {recap.present}
                    </td>
                    <td className="border px-4 py-2 dark:text-white">
                      {recap.late}
                    </td>
                    <td className="border px-4 py-2 dark:text-white">
                      {recap.absent}
                    </td>
                    <td className="border px-4 py-2 dark:text-white">
                      {recap.total_work_hours.toFixed(2)} hrs
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    There&apos;s no data yet
                  </td>
                </tr>
              )}
            </tbody>
          </>
        )}
      </table>
    </div>
  );
}
