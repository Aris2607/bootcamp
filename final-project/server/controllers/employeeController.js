const {
  Employees,
  Positions,
  Departments,
  Divisions,
  Sequelize,
  Users,
  Roles,
  EmployeeSchedules,
} = require("../models");
const { validationResult } = require("express-validator");

const create = async (req, res) => {
  const errors = validationResult(req);

  const existsEmployee = await Employees.findOne({
    where: { email: req.body.email },
  });

  if (existsEmployee) {
    return res.status(400).json({ errors: "Email is already in use" });
  }
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  try {
    const employee = await Employees.create({
      ...req.body,
      division_id: req.body.department_id,
    });
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
      order: [["updatedAt", "DESC"]],
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
        {
          model: Divisions,
          attributes: ["id"],
        },
        {
          model: Users,
          include: {
            model: Roles,
            attributes: ["role_name"],
          },
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

const getEmployee = async (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Default to page 1 and limit of 10
  const { role_id } = req.params;
  const offset = (page - 1) * limit;

  try {
    const employees = await Employees.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Positions,
          attributes: ["name"],
        },
        {
          model: Departments,
          attributes: ["name"],
        },
        {
          model: Users,
          where: {
            role_id,
          },
          include: {
            model: Roles,
            attributes: ["role_name"],
          },
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    res.json({
      data: employees.rows,
      total: employees.count,
      page: parseInt(page),
      totalPages: Math.ceil(employees.count / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

const createEmployeeSchedule = async (req, res) => {
  const { dataArray } = req.body;

  try {
    const createdData = [];
    console.log("DATA ARRAY:", dataArray);
    for (data of dataArray) {
      const newData = await EmployeeSchedules.create(data);
      createdData.push(newData);
    }
    res.status(201).json(createdData);
  } catch (error) {
    res.status(500).json({ message: "Unable to create employee schedule" });
  }
};

const createEmployeeBatch = async (req, res) => {
  const { data } = req.body;
  const errors = validationResult(req);

  try {
    const result = [];
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        const employee = data[key];

        const existsEmployee = await Employees.findOne({
          where: { email: employee.email },
        });

        if (existsEmployee) {
          return res.status(400).json({ errors: "Email is already in use" });
        }
        if (!errors.isEmpty()) {
          return res.status(400).json({ error: errors.array() });
        }

        const newEmployee = await Employees.create({
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          phone_number: employee.phone_number,
          department_id: employee.department_id,
          position_id: employee.position_id,
          division_id: employee.department_id,
          profile_picture: "default.png",
        });

        const employee_id = newEmployee.id;

        const user = createUser(employee.first_name);

        await Users.create({
          employee_id,
          username: user,
          password: null,
          role_id: 1,
        });
        result.push(newEmployee);
      }
    }

    console.log("RESULT:", result);

    console.log("YOU ARE HERE");

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Unable to upload employee batch", error });
  }
};

const searchEmployee = async (req, res) => {
  const { keyword } = req.body;
  const { page = 1, limit = 10 } = req.query;
  const { role_id } = req.params;
  const offset = (page - 1) * limit;

  try {
    const employees = await Employees.findAndCountAll({
      where: {
        [Sequelize.Op.or]: [
          { first_name: { [Sequelize.Op.iLike]: `%${keyword}%` } },
          { last_name: { [Sequelize.Op.iLike]: `%${keyword}%` } },
          { email: { [Sequelize.Op.iLike]: `%${keyword}%` } },
          { phone_number: { [Sequelize.Op.iLike]: `%${keyword}%` } },
          // Assuming `position` is a field in `Employees`, but you might need to adjust this
        ],
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Positions,
          attributes: ["name"],
        },
        {
          model: Departments,
          attributes: ["name"],
        },
        {
          model: Users,
          where: {
            role_id,
          },
          include: {
            model: Roles,
            attributes: ["role_name"],
          },
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    if (employees.rows.length === 0) {
      return res.status(404).json({ message: "Employee Not Found!" });
    }

    res.status(200).json({
      data: employees.rows,
      total: employees.count,
      page: parseInt(page),
      totalPages: Math.ceil(employees.count / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to search employee" });
  }
};

// const updateEmployee = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     const employee = await Employees.findByPk(req.params.id);
//     if (!employee) {
//       return res.status(404).json({ error: "Employee not found" });
//     }
//     await employee.update(req.body);
//     res.status(200).json(employee);
//   } catch (err) {
//     res.status(500).json({ error: "Unable to update employee" });
//   }
// };

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    email,
    phone_number,
    department_id,
    position_id,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Cari karyawan berdasarkan ID
    const employee = await Employees.findByPk(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update data karyawan
    await employee.update({
      first_name,
      last_name,
      email,
      phone_number,
      department_id,
      position_id,
    });

    return res.status(200).json(employee);
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({ message: "Error updating employee" });
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

const createUser = (first_name) => {
  const unique = new Date().toLocaleTimeString("id-ID").split(".");
  let temp = first_name;

  unique.slice(1).forEach((uniq) => {
    temp += uniq;
  });

  return temp;
};

module.exports = {
  create,
  createEmployeeBatch,
  getAll,
  getEmployee,
  getById,
  getByName,
  updateEmployee,
  deleteEmployee,
  createEmployeeSchedule,
  searchEmployee,
};
