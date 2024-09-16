const { Leaves, Employees, Notifications, Positions } = require("../models");

// Apply for leave
exports.applyLeave = async (req, res) => {
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
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve or reject leave
exports.approveLeave = async (req, res) => {
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

exports.getLeave = async (req, res) => {
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
