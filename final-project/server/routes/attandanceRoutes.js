const {
  getAll,
  createAttandance,
  recordAttendance,
  // locationDistance,
  attendanceStatus,
  recordTimeout,
  getAttendanceRecords,
  getAttendanceRecordsDaily,
} = require("../controllers/attendanceController");
const express = require("express");
const { getById } = require("../controllers/employeeController");

const router = express.Router();

router.post("/employees/:id/attendance", recordAttendance);
router.post("/employee/:id/attendance/status", attendanceStatus);
router.post("/employees/attendance/record/daily", getAttendanceRecordsDaily);
router.put("/employees/:id/attendance", recordTimeout);
// router.post("/employee/location", locationDistance);
router.get("/employee/:id/attendance/record", getAttendanceRecords);
// router.get("/attendance", getAll);
// router.get("/attendance/:id", getById);
// router.post("/attendance", createAttandance);

module.exports = router;
