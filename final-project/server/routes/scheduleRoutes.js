const { createSchedule } = require("../controllers/schedule");
const express = require("express");

const router = express.Router();

router.post("/create-schedule", createSchedule);
