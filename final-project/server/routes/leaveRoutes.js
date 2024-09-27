const {
  applyLeave,
  getLeave,
  approveLeave,
  leaveCheck,
  getTotalLeave,
} = require("../controllers/leavesController");
const express = require("express");

const router = express.Router();

router.get("/employee/leave/all", getLeave);

router.get("/employee/:employeeId/check", leaveCheck);

router.get("/employee/:employeeId/leave/total", getTotalLeave);

router.post("/employee/:id/leave/request", applyLeave);

router.post("/employee/:id/leave/response", approveLeave);

module.exports = router;
