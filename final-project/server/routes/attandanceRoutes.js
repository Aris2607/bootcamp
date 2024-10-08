const {
  getAll,
  createAttandance,
  recordAttendance,
  // locationDistance,
  attendanceStatus,
  recordTimeout,
  getAttendanceRecords,
  getAttendanceRecordsDaily,
  getAttendanceSummary,
  getMonthlyAttendanceRecap,
  getWeeklyAttendanceRecap,
  getEmployeeAttendance,
  getDailyRecap,
  getWeeklyRecap,
  getMonthlyRecap,
} = require("../controllers/attendanceController");
const express = require("express");
const { getById } = require("../controllers/employeeController");

const router = express.Router();

router.post("/employees/:id/attendance", recordAttendance);

router.post("/employee/:id/attendance/status", attendanceStatus);

router.post("/employees/attendance/record/daily", getAttendanceRecordsDaily);

router.post("/employees/attendance/recap/daily", getDailyRecap);

router.post("/employees/attendance/recap/weekly", getWeeklyRecap);

router.post("/employees/attendance/recap/monthly", getMonthlyRecap);

router.put("/employees/:id/attendance", recordTimeout);
// router.post("/employee/location", locationDistance);
router.get("/employee/:id/attendance/record", getAttendanceRecords);

router.get("/employee/:id/attendance/summary/:year", getAttendanceSummary);

router.get(
  "/employee/:id/attendance/recap/monthly/:year",
  getMonthlyAttendanceRecap
);
router.get("/attendance/:month", getWeeklyAttendanceRecap);

router.get("/attendance/:employee_id/:year/:month", getEmployeeAttendance);
// router.get("/attendance", getAll);
// router.get("/attendance/:id", getById);
// router.post("/attendance", createAttandance);

module.exports = router;
