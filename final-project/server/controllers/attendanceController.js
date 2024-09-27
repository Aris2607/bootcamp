const { Op, Sequelize } = require("sequelize");
const {
  Attendances,
  Schedules,
  Employees,
  Positions,
  sequelize,
} = require("../models");
const cron = require("node-cron");
const logError = require("../utils/logError");

// Record attendance for an employee
const recordAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time_in, location } = req.body;

    console.log("Employee ID:", id);
    console.log("DATE:", date);

    const isAttend = await Attendances.findOne({
      where: {
        employee_id: id,
        date,
      },
    });

    if (isAttend) {
      return res.json({
        message: "You Already Check-In. Cannot Check-In again in the same day",
      });
    }

    // Check if employee has a schedule for the day
    const employee = await Employees.findByPk(id, {
      include: {
        model: Schedules,
        through: "EmployeeSchedules",
        where: {
          day: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
        },
      },
    });

    console.log("Employee data:", employee);
    console.log(
      new Date(date).toLocaleDateString("en-US", { weekday: "long" })
    );
    console.log(
      "Day:",
      new Date(date).toLocaleDateString("en-US", { weekday: "long" })
    );

    if (!employee) {
      return res.status(404).json({ message: "No schedule found for today." });
    }

    const schedule = employee.Schedules[0];
    console.log("Scheduleeee:", schedule);
    const isLate =
      new Date(`1970-01-01T${time_in}Z`) >
      new Date(`1970-01-01T${schedule.start_time}Z`);
    const status = isLate ? "Late" : "On Time";

    console.log("IsLAteE:", status);

    // Calculate distance using Haversine formula (dummy coordinates here)
    // const officeLocation = { latitude: -6.9357, longitude: 107.57831 };
    // const distance = calculateDistance(officeLocation, location);

    // if (distance > 100) {
    //   return res.status(400).json({
    //     message: "You are not within the required radius to check in.",
    //   });
    // }

    const attendance = await Attendances.create({
      employee_id: id,
      date,
      time_in,
      time_out: null,
      status,
      location,
    });
    res.status(201).json(attendance);
  } catch (error) {
    logError(error, "Record Attendance", req.params.id);
    res.status(500).json({ error: error });
  }
};

const recordTimeout = async (req, res) => {
  const { date, time_out } = req.body;
  const { id } = req.params;

  console.log("Date:", date);
  console.log("ID:", id);
  console.log("TimeOut:", time_out);

  try {
    const employee = await Attendances.findOne({
      where: { employee_id: id, date },
    });

    console.log(employee);

    if (!employee) {
      return res.status(400).json({ message: "Employee is not Time-In yet" });
    }

    if (employee.time_out) {
      return res.status(400).json({ message: "You are already Time-Out" });
    }

    employee.time_out = time_out;
    await employee.save();
    res.status(200).json({
      message: "Time-Out Successed! Don't forget to Time-in again Tomorrow!",
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to Time-Out" });
    logError(error, "Record Timeout", req.params.id);
  }
};

const checkEmployeeDistance = async (location) => {
  console.log(location);

  const officeLocation = {
    latitude: -6.9359012,
    longitude: 107.5778538,
  };
  const distance = calculateDistance(officeLocation, location);

  if (distance > 100) {
    return false;
  } else {
    return true;
  }
};

const attendanceStatus = async (req, res) => {
  const { id } = req.params;
  const { date, location } = req.body;

  try {
    const checkDistance = await checkEmployeeDistance(location);

    console.log("Check Distance:", checkDistance);
    console.log("Date::::", date);

    if (!checkDistance) {
      return res.status(400).json({
        message: "You are not within the required radius to check in.",
      });
    }

    const employee = await Attendances.findOne({
      where: { employee_id: id, date },
    });

    if (!employee) {
      return res.status(404).json({
        message: "You can Time In now!",
        checkIn: true,
        checkOut: true,
      });
    }

    if (employee.time_out) {
      return res.json({
        checkIn: false,
        checkOut: false,
        message: "You have already attended today! Come again tomorrow.",
      });
    }

    if (employee.time_in) {
      return res.json({
        checkIn: false,
        checkOut: !employee.time_out,
        message: "You are already checked-in. Don't forget to check-out later!",
      });
    }

    res.status(200).json({ checkIn: true, checkOut: true });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching attendance." });
    logError(error, "Attendance Status", req.params.id);
  }
};

const getAttendanceRecords = async (req, res) => {
  const { id } = req.params; // Mengambil ID karyawan dari parameter
  const currentYear = new Date().getFullYear(); // Tahun saat ini
  const currentMonth = new Date().getMonth() + 1; // Bulan saat ini (perlu +1 karena dimulai dari 0)

  try {
    // Query untuk mendapatkan data attendance berdasarkan employee_id, bulan, dan tahun yang sama dengan saat ini
    const attendanceRecords = await Attendances.findAll({
      where: {
        employee_id: id,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("EXTRACT", Sequelize.literal('YEAR FROM "date"')),
            currentYear
          ),
          Sequelize.where(
            Sequelize.fn("EXTRACT", Sequelize.literal('MONTH FROM "date"')),
            currentMonth
          ),
        ],
      },
      order: [["id", "ASC"]], // Mengurutkan hasil berdasarkan ID secara ascending
    });

    // Mengembalikan hasil dalam bentuk JSON
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Mengembalikan pesan error jika terjadi kesalahan
    logError(error, "Get Attendance Record", req.params.id);
  }
};

const getAttendanceRecordsDaily = async (req, res) => {
  const { date } = req.body;

  console.log("Date:", date);

  try {
    const attendance = await Attendances.findAll({
      where: {
        date,
      },
    });

    console.log("Attendance:", attendance);

    if (!attendance) {
      res.status(404).json({ message: "There's no attendance for today" });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch attendance" });
    logError(error, "Record Attendance", req.params.id);
  }
};

const getDailyRecap = async (req, res) => {
  const { date } = req.body;

  // Convert the input date into the desired format
  const startDate = new Date(date);
  const startISODate = startDate.toISOString().split("T")[0]; // 'YYYY-MM-DD' format

  // Create end date by adding 1 day
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 1);
  const endISODate = endDate.toISOString().split("T")[0]; // 'YYYY-MM-DD' format for the next day

  console.log("Date::", date);
  console.log("Start Date::", startISODate);
  console.log("End Date::", endISODate);

  try {
    const data = await Attendances.findAll({
      where: {
        date: {
          [Op.between]: [startISODate, endISODate], // Query between the start and end date
        },
      },
      include: [
        {
          model: Employees,
          attributes: ["first_name", "last_name"],
          include: {
            model: Positions,
            attributes: ["name"],
          },
        },
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to get daily recap", error });
    logError(error, "Get Daily Recap");
  }
};

const getWeeklyRecap = async (req, res) => {
  const { date } = req.body;

  const startDate = new Date(date);
  // Get the first day of the week (Sunday)
  const firstDayOfWeek = new Date(startDate);
  firstDayOfWeek.setDate(startDate.getDate() - startDate.getDay());
  const startISODate = firstDayOfWeek.toISOString().split("T")[0];

  // Get the last day of the week (Saturday)
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  const endISODate = lastDayOfWeek.toISOString().split("T")[0];

  console.log("Start Date of Week::", startISODate);
  console.log("End Date of Week::", endISODate);

  try {
    const data = await Attendances.findAll({
      where: {
        date: {
          [Op.between]: [startISODate, endISODate],
        },
      },
      include: [
        {
          model: Employees,
          attributes: ["first_name", "last_name"],
          include: {
            model: Positions,
            attributes: ["name"],
          },
        },
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to get weekly recap", error });
    logError(error, "Get Weekly Recap");
  }
};

const getMonthlyRecap = async (req, res) => {
  const { date } = req.body;

  const startDate = new Date(date);
  // Get the first day of the month
  const firstDayOfMonth = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
  );
  const startISODate = firstDayOfMonth.toISOString().split("T")[0];

  // Get the last day of the month
  const lastDayOfMonth = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    0
  );
  const endISODate = lastDayOfMonth.toISOString().split("T")[0];

  console.log("Start Date of Month::", startISODate);
  console.log("End Date of Month::", endISODate);

  try {
    const data = await Attendances.findAll({
      where: {
        date: {
          [Op.between]: [startISODate, endISODate],
        },
      },
      include: [
        {
          model: Employees,
          attributes: ["first_name", "last_name"],
          include: {
            model: Positions,
            attribute: ["name"],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const attendanceData = data.map((attendance) => {
      const workHours =
        attendance.time_in && attendance.time_out
          ? calculateWorkHours(attendance.time_in, attendance.time_out)
          : 0;

      return {
        date: attendance.date,
        time_in: attendance.time_in,
        time_out: attendance.time_out,
        status: attendance.status,
        total_hours: workHours, // Add total work hours
      };
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to get monthly recap", error });
    logError(error, "Get Monthly Recap");
  }
};

const getAttendanceSummary = async (req, res) => {
  const { id, year } = req.params;

  const attendances = await Attendances.findAll({
    where: {
      date: {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      },
    },
    attributes: [
      "status",
      [Sequelize.fn("COUNT", Sequelize.col("status")), "count"],
    ],
    group: ["status"],
  });

  res.status(200).json(attendances);
};

const getWeeklyAttendanceRecap = async (req, res) => {
  const { month } = req.params; // e.g., '2024-09'

  try {
    const employeesWithAttendance = await Employees.findAll({
      include: [
        {
          model: Attendances,
          where: sequelize.where(
            sequelize.fn("TO_CHAR", sequelize.col("date"), "YYYY-MM"),
            "=",
            month
          ),
          required: false, // Allows employees without attendances to still be included
        },
      ],
    });

    res.json(employeesWithAttendance);
  } catch (error) {
    console.error("Failed to fetch attendance data:", error);
    res.status(500).json({ error: "Failed to fetch attendance" });
    logError(error, "Get Weekly Attendance Recap");
  }
};

const getMonthlyAttendanceRecap = async (req, res) => {
  const { id, year } = req.params;

  try {
    const attendances = await Attendances.findAll({
      where: {
        date: {
          [Op.between]: [`${year}-01-01`, `${year}-12-31`], // Membatasi pada tahun tertentu
        },
      },
      attributes: [
        [Sequelize.literal('EXTRACT(MONTH FROM "date")'), "month"], // Ambil bulan dari kolom date menggunakan PostgreSQL
        [Sequelize.fn("COUNT", Sequelize.col("id")), "attendance_count"], // Hitung jumlah attendance
      ],
      group: [Sequelize.literal('EXTRACT(MONTH FROM "date")')], // Kelompokkan berdasarkan bulan
      order: [Sequelize.literal('EXTRACT(MONTH FROM "date") ASC')], // Urutkan berdasarkan bulan
    });

    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: "Unable to get monthly recap" });
    logError(error, "Get Monthly Attendance Recap", req.params.id);
  }
};

const calculateWorkHours = (timeIn, timeOut) => {
  const start = new Date(`1970-01-01T${timeIn}Z`);
  const end = new Date(`1970-01-01T${timeOut}Z`);
  const diff = (end - start) / (1000 * 60 * 60); // difference in hours
  return diff > 0 ? diff : 0; // Ensure non-negative values
};

const getEmployeeAttendance = async (req, res) => {
  try {
    const { employee_id, year, month } = req.params;

    // Retrieve attendance records for the given employee and year-month
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(year, month, 0); // Last date of the month

    const attendances = await Attendances.findAll({
      where: {
        employee_id,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [{ model: Employees, attributes: ["first_name", "last_name"] }],
    });

    // Calculate total work hours for each attendance
    const attendanceData = attendances.map((attendance) => {
      const workHours =
        attendance.time_in && attendance.time_out
          ? calculateWorkHours(attendance.time_in, attendance.time_out)
          : 0;

      return {
        date: attendance.date,
        time_in: attendance.time_in,
        time_out: attendance.time_out,
        status: attendance.status,
        total_hours: workHours, // Add total work hours
      };
    });

    res.json({ data: attendanceData });
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    res.status(500).json({ message: "Error fetching attendance history" });
  }
};

const checkAttendance = async () => {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0]; // Format YYYY-MM-DD

  // Cari semua karyawan
  const employees = await Employees.findAll();

  // Periksa kehadiran untuk setiap karyawan
  for (const employee of employees) {
    const attendance = await Attendances.findOne({
      where: {
        employee_id: employee.id,
        date: currentDate,
      },
    });

    // Jika tidak ada record untuk tanggal tersebut, buatkan record dengan status "Absent"
    if (!attendance) {
      await Attendances.create({
        employee_id: employee.id,
        date: currentDate,
        time_in: null,
        time_out: null,
        status: "Absent",
        location: null, // atau data lokasi default jika diperlukan
      });
    }
  }
};

// Jadwalkan pengecekan setiap hari pukul 17:00

// const monthlyRecap = async (req, res) => {
//   try {
//     const attendance = await Attendances.findAll({
//       where:
//     })
//   } catch (error) {

//   }
// }

const calculateDistance = (coord1, coord2) => {
  const R = 6371e3; // Radius of the Earth in meters
  const lat1 = (coord1.latitude * Math.PI) / 180; // Convert degrees to radians
  const lat2 = (coord2.latitude * Math.PI) / 180;
  const deltaLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const deltaLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
};

cron.schedule("54 21 * * *", checkAttendance);

module.exports = {
  recordAttendance,
  recordTimeout,
  // locationDistance,
  attendanceStatus,
  getAttendanceRecords,
  getDailyRecap,
  getAttendanceRecordsDaily,
  getAttendanceSummary,
  getWeeklyAttendanceRecap,
  getEmployeeAttendance,
  getMonthlyAttendanceRecap,
  getWeeklyRecap,
  getMonthlyRecap,
};
