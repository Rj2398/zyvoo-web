import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import contentSlice from "./slices/contentSlice";
import profileSlice from "./slices/profileSlice";
import hostuserSlice from "./slices/hostuserSlice";
import commonSlice from "./slices/commonSlice";
import loadingReducer from "./slices/LoadingSlice"; // ✅ default import for reducer

const store = configureStore({
  reducer: {
    user: userReducer,
    content: contentSlice,
    profile: profileSlice,
    hostuser: hostuserSlice,
    common: commonSlice,
    loading: loadingReducer, // ✅ added
  },
});

export default store;
