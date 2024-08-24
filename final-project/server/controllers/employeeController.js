const { Employees, Positions, Departments, Sequelize } = require("../models");
const { validationResult } = require("express-validator");

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const employee = await Employees.create({ ...req.body });
    res.status(201).json({ data: employee });
  } catch (err) {
    res.status(500).json({ error: "Unable to create employee" });
  }
};

const getAll = async (req, res) => {
  try {
    const employees = await Employees.findAll({
      include: [
        {
          model: Positions,
          attributes: ["name"],
        },
        {
          model: Departments,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json(employees);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Unable to fetch employees" });
  }
};

const getById = async (req, res) => {
  try {
    const employee = await Employees.findByPk(req.params.id, {
      include: [
        {
          model: Positions,
          attributes: ["name"],
        },
        {
          model: Departments,
          attributes: ["name"],
        },
      ],
    });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch employee" });
  }
};

const getByName = async (req, res) => {
  try {
    if (!req.query.first_name) {
      return res
        .status(404)
        .json({ error: "Employee not found. Query needed" });
    }

    if (!req.query.last_name) {
      var employee = await Employees.findOne({
        where: {
          first_name: req.query.first_name,
        },
      });
    } else {
      var employee = await Employees.findOne({
        where: {
          [Sequelize.Op.or]: [
            { first_name: req.query.first_name },
            { last_name: req.query.last_name },
          ],
        },
      });
    }

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // If the employee is found, send it in the response
    return res.status(200).json(employee);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to find employee" });
  }
};

const updateEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const employee = await Employees.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    await employee.update(req.body);
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: "Unable to update employee" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employees.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    await employee.destroy();
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Unable to delete employee" });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  getByName,
  updateEmployee,
  deleteEmployee,
};
