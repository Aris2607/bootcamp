const { Users, Employees, Roles } = require("../models");

const createUser = async (req, res) => {
  try {
    const user = await Users.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to Create User" });
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await Users.findAll({
      include: [
        {
          model: Employees,
          attributes: ["email"],
        },
        {
          model: Roles,
          attributes: ["role_name"],
        },
      ],
    });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to Fetch User" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not Found" });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to Fetch User" });
  }
};

const getUserByUsername = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to find user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not Found" });
    }
    await Users.update(req.body, { where: { id: req.params.id } });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to Update User" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not Found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to Delete User" });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
};
