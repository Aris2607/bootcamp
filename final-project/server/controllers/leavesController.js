const {
  Leaves,
  Employees,
  Notifications,
  Positions,
  ErrorLogs,
} = require("../models");
const logError = require("../utils/logError");

// Apply for leave
const applyLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, leave_type, total_days, reason } = req.body;

    const leave = await Leaves.create({
      employee_id: id,
      start_date,
      end_date,
      leave_type,
      status: "Pending",
      total_days,
      reason,
    });

    const employee = await Employees.findByPk(id);

    await Notifications.create({
      employee_id: 1,
      message: `${employee.first_name} ${employee.last_name} has requested for leave: ${leave.reason}.`,
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
    ErrorLogs.create({
      error_message: "Cannot request for leave",
      stack_trace: "Unknown Trace",
      user_id: req.params.id,
      controller: "Apply Leave",
      created_at: new Date(),
      updated_at: new Date(),
    });
    logError(error, "Apply Leave");
  }
};

// Approve or reject leave
const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("ID:", id);
    console.log("Status:", status);

    const leave = await Leaves.findByPk(id);
    console.log("Leave:", leave);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = status;
    await leave.save();

    // Send notification to employee
    await Notifications.create({
      employee_id: leave.employee_id,
      message: `Your leave request has been ${status.toLowerCase()}.`,
    });

    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeave = async (req, res) => {
  try {
    const leaves = await Leaves.findAll({
      include: [
        {
          model: Employees,
          attributes: ["first_name", "last_name"],
          include: [
            {
              model: Positions,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!leaves) {
      res.status(404).json({ message: "There's no leaves request yet" });
    }

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch employee's leaves" });
  }
};

const leaveCheck = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const leave = await Leaves.findOne({
      where: {
        employee_id: employeeId,
        status: "Pending",
      },
    });

    console.log("LEAVE USER:", leave);

    if (!leave) {
      return res.status(200).json({ canLeave: true });
    } else {
      return res.status(200).json({ canLeave: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Unable to check leave status", error });
  }
};

const getTotalLeave = async (req, res) => {
  const { employeeId } = req.params;

  console.log("EMPLOYEE ID:", employeeId);

  try {
    const leave = await Leaves.findAll({
      where: {
        employee_id: employeeId,
        status: "Approved",
      },
      order: [["created_at", "DESC"]],
      limit: 1,
    });

    console.log("LEAVES:", leave);

    if (leave.length === 0) {
      return res.status(404).json({ message: "There's no leave yet" });
    }

    res.status(200).json(leave);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to get total days of leave", error });
  }
};

module.exports = {
  applyLeave,
  approveLeave,
  getLeave,
  leaveCheck,
  getTotalLeave,
};
