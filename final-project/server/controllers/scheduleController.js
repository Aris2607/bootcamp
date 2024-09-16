const { Schedules, EmployeeSchedules } = require("../models");

const createSchedule = async (req, res) => {
  try {
    const { name, day, start_time, end_time, late_tolerance } = req.body;
    const schedule = await Schedules.create({
      name,
      day,
      start_time,
      end_time,
      late_tolerance,
    });
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignSchedule = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { schedule_id } = req.body;
    await EmployeeSchedules.create({ employee_id: employeeId, schedule_id });
    res.status(200).json({ message: "Schedule assigned to employee." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSchedule,
  assignSchedule,
};
