const { Attandances } = require("../models");

const getAll = async (req, res) => {
  try {
    const attandance = await Attandances.findAll();
    res.status(200).json(attandance);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: "Unable to fetch absence data" });
  }
};

const createAttandance = async (req, res) => {
  try {
    const attandance = await Attandances.create(req.body);
    res.status(201).json(attandance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create new attandance" });
  }
};

module.exports = {
  getAll,
  createAttandance,
};
