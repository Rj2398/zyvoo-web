import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  guestHomeData: null,
  guestWishlistData: null
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setGuestHome: (state, action) => {
      state.guestHomeData = action.payload;
    },
    setGuestWishlistData: (state, action) => {
      state.guestWishlistData = action.payload;
    }
  },
});

export const { 
  setGuestHome,
  setGuestWishlistData,
} = commonSlice.actions;

export default commonSlice.reducer;
