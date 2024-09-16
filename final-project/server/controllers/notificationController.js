const { Notifications } = require("../models");

// Get notifications for an employee
exports.getNotifications = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const notifications = await Notifications.findAll({
      where: { employee_id: employeeId },
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
