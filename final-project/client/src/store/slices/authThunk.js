import { createAsyncThunk } from "@reduxjs/toolkit";
import { createData } from "../../services/Api";
import {
  loginFailure,
  setToken,
  setUser,
  setIsAuthenticated,
} from "./authSlice";
import Cookies from "js-cookie";

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
  async (username, thunkAPI) => {
    try {
      // await createData("/logout", { username });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      thunkAPI.dispatch(setToken(null));
      Cookies.remove("token");
      thunkAPI.dispatch(setIsAuthenticated(false));
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
