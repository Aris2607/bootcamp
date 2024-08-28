// services/Api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api", // Ganti dengan URL backend Anda
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
      }
      if (error.response.status === 500) {
        console.error("Internal Server Error");
      }
    }
    return Promise.reject(error);
  }
);

const getData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (err) {
    console.error("Error while fetching data:", err);
    return err.response;
  }
};

const getDataByField = async (endpoint, params) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (err) {
    console.error("Error while fetching data:", err);
    return err.response;
  }
};

const createData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (err) {
    console.error("Error while creating data:", err);
    throw err.response ? err.response.data : err; // Pastikan error yang dilempar memiliki data
  }
};

const updateData = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (err) {
    console.error("Error while updating data:", err);
    return err.response;
  }
};

const deleteData = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (err) {
    console.error("Error while deleting data:", err);
    return err.response;
  }
};

export { getData, getDataByField, createData, updateData, deleteData };
