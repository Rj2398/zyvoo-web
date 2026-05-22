import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileData: null,
  showPersonaVerification: false,
  personaStatus: null,
};

export const userSlice = createSlice({
  name: "guestProfile",
  initialState,
  reducers: {
    setGuestProfile: (state, action) => {
      state.profileData = action.payload;
    },

    addProfileImg: (state, action) => {
      state.profileData.profile_image = action.payload.profile_image;
    },
    addAboutMeToProfile: (state, action) => {
      state.profileData.about_me = action.payload.about_me;
    },
    addNameToProfile: (state, action) => {
      state.profileData.first_name = action.payload.first_name;
      state.profileData.last_name = action.payload.last_name;
    },
    addHobbyInProfile: (state, action) => {
      state.profileData.hobbies.push(action.payload.hobby_name);
    },
    updatedHobbyInProfile: (state, action) => {
      state.profileData.hobbies = state.profileData.hobbies.map((item, index) =>
        index === action.payload.index ? action.payload.hobby : item
      );
    },
    deleteHobbyFromProfile: (state, action) => {
      state.profileData.hobbies = state.profileData.hobbies.filter(
        (_, i) => i !== action.payload.index
      );
    },
    addPetInProfile: (state, action) => {
      state.profileData.pets.push(action.payload.pet_name);
    },
    updatedPetInProfile: (state, action) => {
      state.profileData.pets = state.profileData.pets.map((item, index) =>
        index === action.payload.index ? action.payload.pet_name : item
      );
    },
    deletePetFromProfile: (state, action) => {
      state.profileData.pets = state.profileData.pets.filter(
        (_, i) => i !== action.payload.index
      );
    },
    addWorkInProfile: (state, action) => {
      state.profileData.my_work.push(action.payload.work_name);
    },
    updatedWorkInProfile: (state, action) => {
      state.profileData.my_work = state.profileData.my_work.map((item, index) =>
        index === action.payload.index ? action.payload.work_name : item
      );
    },
    deleteWorkFromProfile: (state, action) => {
      state.profileData.my_work = state.profileData.my_work.filter(
        (_, i) => i !== action.payload.index
      );
    },
    addLanguageInProfile: (state, action) => {
      state.profileData.languages.push(action.payload.language_name);
    },
    updatedLanguageInProfile: (state, action) => {
      state.profileData.languages = state.profileData.languages.map(
        (item, index) =>
          index === action.payload.index ? action.payload.language_name : item
      );
    },
    deleteLanguageFromProfile: (state, action) => {
      state.profileData.languages = state.profileData.languages.filter(
        (_, i) => i !== action.payload.index
      );
    },
    addPlaceInProfile: (state, action) => {
      state.profileData.where_live.push(action.payload.place_name);
    },
    updatedPlaceInProfile: (state, action) => {
      state.profileData.where_live = state.profileData.where_live.map(
        (item, index) =>
          index === action.payload.index ? action.payload.place_name : item
      );
    },
    deletePlaceFromProfile: (state, action) => {
      state.profileData.where_live = state.profileData.where_live.filter(
        (_, i) => i !== action.payload.index
      );
    },
    addStreetToProfile: (state, action) => {
      state.profileData.street = action.payload;
    },
    addCityToProfile: (state, action) => {
      state.profileData.city = action.payload.city;
    },
    addStateToProfile: (state, action) => {
      state.profileData.state = action.payload.state;
    },
    addZipCodeToProfile: (state, action) => {
      state.profileData.zip_code = action.payload.zip_code;
    },
    openPersona: (state) => {
      state.showPersonaVerification = true;
    },
    closePersona: (state) => {
      state.showPersonaVerification = false;
    },
    personaStatus: (state, action) => {
      state.personaStatus = action.payload;
    },
  },
});

export const {
  setGuestProfile,
  addProfileImg,
  addAboutMeToProfile,
  addNameToProfile,
  addHobbyInProfile,
  updatedHobbyInProfile,
  deleteHobbyFromProfile,
  addPetInProfile,
  updatedPetInProfile,
  deletePetFromProfile,
  addWorkInProfile,
  updatedWorkInProfile,
  deleteWorkFromProfile,
  addLanguageInProfile,
  updatedLanguageInProfile,
  deleteLanguageFromProfile,
  addPlaceInProfile,
  updatedPlaceInProfile,
  deletePlaceFromProfile,
  addStreetToProfile,
  addCityToProfile,
  addStateToProfile,
  addZipCodeToProfile,
  openPersona,
  closePersona,
  personaStatus,
} = userSlice.actions;

export default userSlice.reducer;
