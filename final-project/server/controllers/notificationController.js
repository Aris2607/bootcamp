const { Notifications } = require("../models");

const createNotif = async (req, res) => {
  try {
    const notif = await Notifications.create(req.body);
    res.status(201).json(notif);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create notification" });
  }
};

const getNotif = async (req, res) => {
  try {
    const notif = await Notifications.findAll({
      where: {
        id: req.params.id,
      },
    });
    if (!notif) {
      return res.status(404).json("There's no Notification yet");
    }
    res.status(200).json(notif);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to get notification" });
  }
};

module.exports = {
  createNotif,
  getNotif,
};
