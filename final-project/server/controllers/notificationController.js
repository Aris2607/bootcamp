const { Notifications } = require("../models");

// Get notifications for an employee
getNotifications = async (req, res) => {
  try {
    const { employeeId } = req.params;

    console.log("EMPLOYEEID:", employeeId);
    const notifications = await Notifications.findAll({
      where: { employee_id: employeeId },
    });

    if (!notifications) {
      return res.status(404).json({ message: "There's no Notification found" });
    }

    console.log("NOTIFICATIONS:", notifications);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getNotifications,
};
