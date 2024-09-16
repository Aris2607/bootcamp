import { createAsyncThunk } from "@reduxjs/toolkit";
import { createData, updateData } from "../../services/Api";
import { format } from "date-fns";

export const checkInUser = createAsyncThunk(
  "attendance/checkIn",
  async ({ employeeId, location }, { rejectWithValue }) => {
    try {
      const date = new Date().toLocaleDateString("id-ID").replace(/\//g, "-");
      const formattedDate = format(new Date(), "yyyy-MM-dd");
      console.log("Date:", date);
      const time_in = new Date()
        .toLocaleTimeString("id-ID")
        .replace(/\./g, ":");

      const response = await createData(`/employees/${employeeId}/attendance`, {
        date: formattedDate,
        time_in,
        location: JSON.stringify(location),
      });

      console.log(response);

      return response; // Assuming API returns the relevant attendance data
    } catch (error) {
      console.error("Error checking in:", error);
      return rejectWithValue(error);
    }
  }
);

export const checkOutUser = createAsyncThunk(
  "attendance/checkOut",
  async ({ employeeId }, { rejectWithValue }) => {
    try {
      const date = new Date().toLocaleDateString("id-ID").replace(/\//g, "-");
      const formattedDate = format(new Date(), "yyyy-MM-dd");
      const time_out = new Date()
        .toLocaleTimeString("id-ID")
        .replace(/\./g, ":");

      const response = await updateData(`/employees/${employeeId}/attendance`, {
        date: formattedDate,
        time_out,
      });

      console.log(response);

      return response; // Assuming API returns the relevant attendance data
    } catch (error) {
      console.error("Error checking out:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const checkAttendanceStatus = createAsyncThunk(
  "attendance/checkStatus",
  async (employeeId, location, { rejectWithValue }) => {
    try {
      const date = new Date();
      const formattedDate = format(new Date(), "yyyy-MM-dd");

      const response = await createData(
        `/employee/${employeeId}/attendance/status`,
        { date: formattedDate, location }
      );

      console.log(response);
      return response; // Assuming API returns the relevant attendance data
    } catch (error) {
      console.error("Error checking attendance status:", error);
      return rejectWithValue(error);
    }
  }
);
