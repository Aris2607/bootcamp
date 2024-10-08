// store/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./authThunk";
import Cookies from "js-cookie";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Ambil data user dari localStorage
  // isAuthenticated: !!localStorage.getItem("token"),
  isAuthenticated: !!Cookies.get("token"),
  token: Cookies.get("token") || "",
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, loginFailure, setUser, setIsAuthenticated, setToken } =
  authSlice.actions;

export default authSlice.reducer;
