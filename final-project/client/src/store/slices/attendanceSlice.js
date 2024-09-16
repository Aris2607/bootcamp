import { createSlice } from "@reduxjs/toolkit";
import {
  checkInUser,
  checkOutUser,
  checkAttendanceStatus,
  // checkEmployeeLocation,
} from "./attendanceThunk";

const initialState = {
  attendanceData: null,
  checkIn: false,
  checkOut: false,
  loading: false,
  error: null,
  message: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    resetAttendanceState: (state) => {
      state.attendanceData = null;
      state.checkIn = false;
      state.checkOut = false;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.checkIn = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(checkInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Check-in failed!";
      })
      .addCase(checkOutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.checkOut = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(checkOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Check-out failed!";
      })
      .addCase(checkAttendanceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAttendanceStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && typeof action.payload === "object") {
          state.checkIn = action.payload.checkIn || false;
          state.checkOut = action.payload.checkOut || false;
          state.message = action.payload.message || "";
        } else {
          state.checkIn = false;
          state.checkOut = false;
          state.message = "No attendance data available.";
        }
      })
      .addCase(checkAttendanceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to check attendance status!";
      });
  },
});

export const { resetAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
