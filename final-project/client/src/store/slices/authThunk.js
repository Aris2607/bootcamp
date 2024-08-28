import { createAsyncThunk } from "@reduxjs/toolkit";
import { createData } from "../../services/Api";
import { loginFailure } from "./authSlice";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch }) => {
    try {
      const response = await createData("/login", credentials);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      console.log(response);
      return response.user;
    } catch (error) {
      dispatch(loginFailure("Unauthorized"));
      throw error;
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
