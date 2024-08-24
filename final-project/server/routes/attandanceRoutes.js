const {
  getAll,
  createAttandance,
} = require("../controllers/attandanceController");
const express = require("express");

const router = express.Router();

router.get("/attandance", getAll);
router.post("/attandance", createAttandance);

module.exports = router;
