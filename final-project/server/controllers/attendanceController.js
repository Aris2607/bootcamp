const { Op, Sequelize } = require("sequelize");
const { Attendances, Schedules, Employees } = require("../models");

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
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching attendance." });
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
  }
};

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

module.exports = {
  recordAttendance,
  recordTimeout,
  // locationDistance,
  attendanceStatus,
  getAttendanceRecords,
  getAttendanceRecordsDaily,
};
