import { getData } from "../services/Api";

export const getRolesAndPermit = async (role_name) => {
  try {
    const response = await getData(`/roles/get?role_name=${role_name}`);
    console.log("ROLES AND PERMIT:", response);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getAllRolesAndPermit = async () => {
  try {
    const response = await getData("/roles/get/all");
    console.log("ALL ROLES AND PERMIT:", response);
    return response;
  } catch (error) {
    console.error(error);
  }
};
