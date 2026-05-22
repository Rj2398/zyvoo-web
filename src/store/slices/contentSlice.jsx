import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  privacyData: null,
};

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setPrivacyData: (state, action) => {
      state.privacyData = action.payload;
    },
  },
});

export const { setPrivacyData } = contentSlice.actions;

export default contentSlice.reducer;
