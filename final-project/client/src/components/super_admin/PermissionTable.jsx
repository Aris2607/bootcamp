import React, { useState, useEffect } from "react";
import { createData } from "../../services/Api";

const PermissionTable = ({ rolesData }) => {
  const [permissions, setPermissions] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    role_name: "",
    description: "",
  });

  useEffect(() => {
    if (rolesData && rolesData.length > 0) {
      setPermissions(rolesData);
    }
  }, [rolesData]);

  const handleCheckboxChange = (roleIndex, page, permissionType = null) => {
    setPermissions((prevState) => {
      const updatedRoles = [...prevState];

      if (page === "admin_management" || page === "employee_management") {
        updatedRoles[roleIndex].permit.crud_operations[permissionType] =
          !updatedRoles[roleIndex].permit.crud_operations[permissionType];
      } else {
        updatedRoles[roleIndex].permit.pages[page] =
          !updatedRoles[roleIndex].permit.pages[page];
      }

      updateRolePermit(
        updatedRoles[roleIndex].id,
        updatedRoles[roleIndex].permit
      );

      return updatedRoles;
    });
  };

  const updateRolePermit = async (roleId, permit) => {
    try {
      const response = await createData(`/roles/update-permit/${roleId}`, {
        permit,
      });
      console.log("Update success:", response.data);
    } catch (error) {
      console.error("Failed to update permit:", error);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleNewRoleChange = (e) => {
    const { name, value } = e.target;
    setNewRole((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddNewRole = async () => {
    try {
      console.log("NEW ROLE:", newRole);
      const response = await createData("/roles/create", newRole);
      console.log("New role created:", response);
      setPermissions([...permissions, response]);
      closeModal();
    } catch (error) {
      console.error("Failed to create new role:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">
        Role Permissions
      </h2>

      <button
        className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded mb-4 dark:bg-teal-400 dark:hover:bg-teal-300"
        onClick={openModal}
      >
        Add New Role
      </button>

      <div className="overflow-x-auto dark:text-white">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-blue-900">
              <th className="px-4 py-2 text-left dark:text-white">Role</th>
              {permissions.length > 0 &&
                permissions[0].permit.pages &&
                Object.keys(permissions[0].permit.pages).map((page) => (
                  <th
                    key={page}
                    className="px-4 py-2 text-center dark:text-white"
                  >
                    {page}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((role, roleIndex) => (
              <tr key={role.id} className="border-b">
                <td className="px-4 py-2 font-semibold dark:text-white">
                  {role.role_name}
                </td>
                {role.permit.pages &&
                  Object.keys(role.permit.pages).map((page) => (
                    <td key={page} className="px-4 py-2 text-center">
                      <div className="flex justify-center items-center">
                        {page === "admin_management" ? (
                          <>
                            <label className=" dark:text-white">
                              <input
                                type="checkbox"
                                checked={role.permit.crud_operations.Read_admin}
                                onChange={() =>
                                  handleCheckboxChange(
                                    roleIndex,
                                    page,
                                    "Read_admin"
                                  )
                                }
                                className="mx-1 dark:text-white"
                              />
                              Read
                            </label>
                            <label className=" dark:text-white">
                              <input
                                type="checkbox"
                                checked={role.permit.crud_operations.CRUD_admin}
                                onChange={() =>
                                  handleCheckboxChange(
                                    roleIndex,
                                    page,
                                    "CRUD_admin"
                                  )
                                }
                                className="mx-1 dark:text-white"
                              />
                              CRUD
                            </label>
                          </>
                        ) : page === "employee_management" ? (
                          <>
                            <label>
                              <input
                                type="checkbox"
                                checked={
                                  role.permit.crud_operations.Read_employee
                                }
                                onChange={() =>
                                  handleCheckboxChange(
                                    roleIndex,
                                    page,
                                    "Read_employee"
                                  )
                                }
                                className="mx-1"
                              />
                              Read
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={
                                  role.permit.crud_operations.CRUD_employee
                                }
                                onChange={() =>
                                  handleCheckboxChange(
                                    roleIndex,
                                    page,
                                    "CRUD_employee"
                                  )
                                }
                                className="mx-1"
                              />
                              CRUD
                            </label>
                          </>
                        ) : (
                          <label>
                            <input
                              type="checkbox"
                              checked={role.permit.pages[page]}
                              onChange={() =>
                                handleCheckboxChange(roleIndex, page)
                              }
                            />
                          </label>
                        )}
                      </div>
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding a new role */}
      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
          <div className="bg-white p-6 rounded-lg z-10 w-1/3">
            <h2 className="text-xl font-bold mb-4">Add New Role</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Role Name:
                  <input
                    type="text"
                    name="role_name"
                    value={newRole.role_name}
                    onChange={handleNewRoleChange}
                    className="border p-2 w-full mt-1"
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  Description:
                  <input
                    type="text"
                    name="description"
                    value={newRole.description}
                    onChange={handleNewRoleChange}
                    className="border p-2 w-full mt-1"
                  />
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleAddNewRole}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add Role
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionTable;
