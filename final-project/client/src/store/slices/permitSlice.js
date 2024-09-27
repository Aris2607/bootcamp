import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  permit: {},
};

const permitSlice = createSlice({
  name: "permit",
  initialState,
  reducers: {
    addPermit: (state, action) => {
      state.permit = action.payload;
    },
  },
});

export const { addPermit } = permitSlice.actions;

export default permitSlice.reducer;
