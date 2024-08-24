import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createData } from "../../services/Api";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await createData("/auth/login", credentials);
      localStorage.setItem("token", response.token); // Simpan token di localStorage
      return response;
    } catch (err) {
      // Handle error and ensure err.data exists
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    // Clear token from localStorage
    localStorage.removeItem("token");

    // Perform any additional logout actions if needed
    // For example, you might want to clear session on the server side

    // Dispatch additional actions if needed
    dispatch(clearCredentials());
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.user = payload.user;
      state.token = payload.token;
    });
    builder.addCase(login.rejected, (state, { payload }) => {
      state.status = "failed";
      state.error = payload;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
    });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
