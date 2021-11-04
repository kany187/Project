import { createSlice } from "@reduxjs/toolkit";
import { InitiaUserSideState } from "./InitialState";

const userSideSlice = createSlice({
  name: "userSlice",
  initialState: InitiaUserSideState,
  reducers: {
    setAllGoals: (state, action) => {
      state.allGoalsOfOrg = action.payload;
    },
    setAllUsers: (state, action) => {
      state.allUserOrgOrWithoutOrg = action.payload;
    },
    setAllSelectedGoals: (state, action) => {
      state.selectedGoals = action.payload;
    },
    setCurrentUserOrganizationId: (state, action) => {
      state.currentUserOrgId = action.payload;
    },
    setAllSubmittedGoals: (state, action) => {
      state.submittedGoals = action.payload;
    },
    setAllApprovedGoals: (state, action) => {
      state.approvedGoals = action.payload;
    },
    setAllDeclineGoals: (state, action) => {
      state.declineGoals = action.payload;
    },
    setPendingGoals: (state, action) => {
      state.pendingGoals = action.payload;
    },
    getCurrentUserFromOrganization: (state, action) => {
      state.currentUserOfOrganization = action.payload;
    },
    getFeedGoals: (state, action) => {
      state.feedGoals = action.payload;
    },
    setReportGoals: (state, action) => {
      state.reportGoals = action.payload;
    },
    setPostsLike: (state, action) => {
      state.postLikes = action.payload;
    },
    setPostComments: (state, action) => {
      state.comments = action.payload;
    },
    setAllUsersWholeApp:(state,action)=>{
      state.allUsers = action.payload
    }
  },
});

export const {
  setAllGoals,
  setAllUsers,
  setAllSelectedGoals,
  setCurrentUserOrganizationId,
  setAllSubmittedGoals,
  setAllApprovedGoals,
  setAllDeclineGoals,
  setPendingGoals,
  getCurrentUserFromOrganization,
  getFeedGoals,
  setReportGoals,
  setPostsLike,
  setPostComments,
  setAllUsersWholeApp
} = userSideSlice.actions;

export const userReducer = userSideSlice.reducer;
