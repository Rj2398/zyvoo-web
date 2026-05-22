import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addPropertyDetails: null,
  propertyId: null,
  userType: "host",
  hostList: null,
  storeOneUserData: null,
  showNewProperty: false,
};

export const hostuserSlice = createSlice({
  name: "hostUser",
  initialState,
  reducers: {
    setAddPropertyDetails: (state, action) => {
      state.addPropertyDetails = {
        ...state.addPropertyDetails, // Preserve previous data
        ...action.payload, // Merge new data
      };
    },
    setPropertyId: (state, action) => {
      state.propertyId = action.payload; // Merge new data
    },
    setHostList: (state, action) => {
      state.hostList = action.payload; // Merge new data
    },

    setUserType: (state, action) => {
      state.userType = action.payload;
    },

    setOneToOneChatData: (state, action) => {
      state.storeOneUserData = action.payload;
    },
    setAddnewPropertyState: (state, action) => {
      state.showNewProperty = action.payload;
    },
    clearAddPropertyDetails: (state) => {
      state.addPropertyDetails = {}; // Reset to an empty object or initial state
    },
  },
});

export const {
  setAddPropertyDetails,
  clearAddPropertyDetails,
  setUserType,
  setPropertyId,
  setOneToOneChatData,
  setAddnewPropertyState,
  setHostList,
} = hostuserSlice.actions;

export default hostuserSlice.reducer;
