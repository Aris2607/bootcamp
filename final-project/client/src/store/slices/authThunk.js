// store/slices/authThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createData } from "../../services/Api";
import { loginFailure } from "./authSlice";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch }) => {
    try {
      const response = await createData("/login", credentials);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user)); // Simpan data user
      return response.user;
    } catch (error) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      // Lakukan request logout jika diperlukan
      // await axios.post('/api/logout');

      // Hapus token dari localStorage atau state
      localStorage.removeItem("token");

      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
