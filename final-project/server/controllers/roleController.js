const { Roles } = require("../models");

const createRole = async (req, res) => {
  console.log("Request body:", req.body); // Log request body

  // Gunakan req.body langsung
  const role_name = req.body.role_name;
  const description = req.body.description;

  if (!role_name || !description) {
    return res
      .status(400)
      .json({ message: "Role name and description are required" });
  }

  console.log("NEW ROLE DATA:", req.body);

  try {
    const role = await Roles.create({
      role_name,
      description,
      permit: {
        pages: {
          reports: false,
          settings: false,
          leave_requests: false,
          admin_dashboard: false,
          admin_management: false,
          online_employees: false,
          roles_management: false,
          leaves_management: false,
          employee_dashboard: false,
          employee_management: false,
          super_admin_dashboard: false,
        },
        crud_operations: {
          CRUD_admin: false,
          Read_admin: false,
          CRUD_employee: false,
          Read_employee: false,
        },
      },
    });

    res.status(201).json(role);
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Unable to create role" });
  }
};

const getAllRolesAndPermit = async (req, res) => {
  try {
    const role = await Roles.findAll();

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: "Unable to get role and permit" });
  }
};

const getRolesAndPermit = async (req, res) => {
  const { role_name } = req.query;

  try {
    const role = await Roles.findAll({
      where: {
        role_name,
      },
      order: [["createdAt", "ASC"]],
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: "Unable to get roles and permit" });
  }
};

const updatePermit = async (req, res) => {
  const { roleId } = req.params;
  const { permit } = req.body;

  try {
    // Cari role berdasarkan ID
    const role = await Roles.findByPk(roleId);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Update permit field dengan data baru
    role.permit = permit;
    await role.save();

    res.status(200).json({ message: "Permit updated successfully", role });
  } catch (error) {
    console.error("Error updating permit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createRole,
  getAllRolesAndPermit,
  getRolesAndPermit,
  updatePermit,
};
