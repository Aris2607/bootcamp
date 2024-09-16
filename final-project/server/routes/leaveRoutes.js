const {
  applyLeave,
  getLeave,
  approveLeave,
} = require("../controllers/leavesController");
const express = require("express");

const router = express.Router();

router.get("/employee/leave/all", getLeave);
router.post("/employee/:id/leave/request", applyLeave);
router.post("/employee/:id/leave/response", approveLeave);

module.exports = router;
