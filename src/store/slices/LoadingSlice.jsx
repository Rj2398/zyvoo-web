import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    showLoader: false,
  },
  reducers: {
    setLoader: (state, action) => {
      state.showLoader = action.payload;
    },
  },
});

export const { setLoader } = loadingSlice.actions;
export default loadingSlice.reducer;
