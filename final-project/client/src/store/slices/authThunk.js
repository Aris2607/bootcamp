import { createAsyncThunk } from "@reduxjs/toolkit";
import { createData, getData } from "../../services/Api";
import {
  loginFailure,
  setToken,
  setUser,
  setIsAuthenticated,
} from "./authSlice";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch }) => {
    try {
      const response = await createData("/login", credentials, {
        withCredentials: true,
      });
      // localStorage.setItem("token", response.token);
      dispatch(setUser(JSON.stringify(response.user)));
      dispatch(setToken(response.token));
      // Set login success flag in localStorage
      localStorage.setItem("showLoginSuccessToast", "true");
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
      const response = await axios.post(
        "https://bhf9dmsr-3001.asse.devtunnels.ms/api/logout"
      );
      console.log(response);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      thunkAPI.dispatch(setToken(null));
      thunkAPI.dispatch(setIsAuthenticated(false));
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
