import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./InitialState";

const goalsSlice = createSlice({
  name: "goalsSlice",
  initialState: InitialState,
  reducers: {
    userlogOut: (state, action) => {
      state.isUserLogin = action.payload;
    },
    isLogin: (state, action) => {
      state.isUserLogin = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    allOrganizations: (state, action) => {
      state.organizations = action.payload;
    },
    allFilterOrgGoals: (state, action) => {
      state.OrgGoals = action.payload;
      state.filterGoals = action.payload;
    },
    allOrganizationUsers: (state, action) => {
      state.orgUsers = action.payload;
    },
    allCategories: (state, action) => {
      state.categories = action.payload;
    },
    allSubmitOrgGoals:(state,action)=>{
      state.allSubmitGoals = action.payload
    },
    setOrgApprovedGoals:(state,action)=>{
      state.allOrgApprovedGoals = action.payload
    },
    setOrgDeclineGoals:(state,action)=>{
      state.allDeclineOrgGoals = action.payload
    },
    setReportGoals:(state,action)=>{
        state.reportGoals=action.payload
    },
    setFakeGoals:(state,action)=>{
       state.fakeGoals = action.payload
    },
    // filters function for organiztions 
    setGoalsAtoZ: (state, action) => {
      const sortGoal = state.OrgGoals.sort((a, b) => {
        const isR = action.payload === "ztoa" ? -1 : 1;
        return (
          isR * a.inputValues.eventName.localeCompare(b.inputValues.eventName)
        );
      });
      // console.log(sortGoal)
      state.OrgGoals = sortGoal;
    },
    highToLow: (state, action) => {
      const sort = state.OrgGoals.sort((a, b) => {
        const high =
          action.payload === "htl"
            ? a.numberOfDays - b.numberOfDays
            : b.numberOfDays - a.numberOfDays;
        return high;
      });
      state.OrgGoals = sort;
    },
    filterWithEndDate: (state, action) => {
      // console.log(action.payload)
      let dateFilter = state.filterGoals.filter((val) =>
        val.inputValues.endDate.includes(action.payload)
      );
      state.OrgGoals = dateFilter;
    },
    filterWithEventName: (state, action) => {
      let filterGoals = state.filterGoals.filter((val) =>
        val.inputValues.eventName
          .toLowerCase()
          .includes(action.payload.toLowerCase())
      );
      state.OrgGoals = filterGoals;
    },
    selectedCategory: (state, action) => {
      // let checkedValue = [];

      // set value if user checkd
      // if (action.payload.checked) {
      //   // check wheater empty array or not
      //   if (state.categorySelected.length > 0) {
      //     let checkExistens = state.categorySelected.map(
      //       (val) => val !== action.payload.cValue
      //     );
      //     if (checkExistens) {
      //       state.categorySelected = [
      //         ...state.categorySelected,
      //         action.payload.cValue,
      //       ];

      //       let filterCheckedGoal = state.filterGoals.filter((val) => {
      //         return state.categorySelected.includes(val.inputValues.category);
      //       });
      //       console.log(filterCheckedGoal);
      //       state.OrgGoals = filterCheckedGoal;
      //     }
      //   } else if (state.categorySelected.length === 0) {
      //     state.categorySelected = [action.payload.cValue];
      //     let filterCheckedGoal = state.filterGoals.filter((val) => {
      //       return state.categorySelected.includes(val.inputValues.category);
      //     });
      //     state.OrgGoals = filterCheckedGoal;
      //   }
      // }
      // // remove value if user unchecked
      // else if (!action.payload.checked) {
      //   let checkExists = state.categorySelected.filter(
      //     (val) => val !== action.payload.cValue
      //   );
      //   state.categorySelected = checkExists;

      //   let filterCheckedGoal = state.filterGoals.filter((val) => {
      //     return state.categorySelected.includes(val.inputValues.category);
      //   });
      //   state.OrgGoals = filterCheckedGoal;
      // }
      let filterGoalsWithCategory = state.filterGoals.filter((val) =>
        val.inputValues.category
          .toLowerCase()
          .includes(action.payload.toLowerCase())
      );
      state.OrgGoals = filterGoalsWithCategory;
    },
    // for without organization screens function
    allWithoutOrggGoals: (state, action) => {
      state.withoutOrgGoals = action.payload;
      state.filterGoals = action.payload;
    },
    allWithoutOrganizationUsers: (state, action) => {
      state.withoutOrgUser = action.payload;
    },

    // filters function for without organiztions 
    setWithoutOrgGoalsAtoZ: (state, action) => {
      const sortGoal = state.withoutOrgGoals.sort((a, b) => {
        const isR = action.payload === "ztoa" ? -1 : 1;
        return (
          isR * a.inputValues.eventName.localeCompare(b.inputValues.eventName)
        );
      });
      // console.log(sortGoal)
      state.withoutOrgGoals = sortGoal;
    },
    highToLowWithoutOrgGoals: (state, action) => {
      const sort = state.withoutOrgGoals.sort((a, b) => {
        const high =
          action.payload === "htl"
            ? a.numberOfDays - b.numberOfDays
            : b.numberOfDays - a.numberOfDays;
        return high;
      });
      state.withoutOrgGoals = sort;
    },
    filterWithEndDateWithoutOrg: (state, action) => {
      // console.log(action.payload)
      let dateFilter = state.filterGoals.filter((val) =>
        val.inputValues.endDate.includes(action.payload)
      );
      state.withoutOrgGoals = dateFilter;
    },
    filterWithEventNameWithoutOrg: (state, action) => {
      let filterGoals = state.filterGoals.filter((val) =>
        val.inputValues.eventName
          .toLowerCase()
          .includes(action.payload.toLowerCase())
      );
      state.withoutOrgGoals = filterGoals;
    },
    selectedCategoryWithoutOrg: (state, action) => {
      let filterGoalsWithCategory = state.filterGoals.filter((val) =>
        val.inputValues.category
          .toLowerCase()
          .includes(action.payload.toLowerCase())
      );
      state.withoutOrgGoals = filterGoalsWithCategory;
    },
    setWithoutOrgSubmitGoals:(state,action)=>{
      state.withoutOrgSubmitGoals = action.payload
    },
    setWithoutOrgApprovedGoals:(state,action)=>{
      state.withourOrgApprovedGoals= action.payload
    },
    setWithoutOrgDeclineGoals:(state,action)=>{
      state.withourOrgDeclineGoals= action.payload

    },
    setFakeGoalWithOutOrg:(state,action)=>{
      state.withoutOrgfakeGoal = action.payload
    }

  },
});

export const {
  isLogin,
  setCurrentUser,
  allOrganizations,
  userlogOut,
  allFilterOrgGoals,
  allOrganizationUsers,
  allCategories,
  setGoalsAtoZ,
  highToLow,
  filterWithEndDate,
  filterWithEventName,
  selectedCategory,
  allWithoutOrggGoals,
  allWithoutOrganizationUsers,
  setWithoutOrgGoalsAtoZ,
  highToLowWithoutOrgGoals,
  filterWithEndDateWithoutOrg,
  filterWithEventNameWithoutOrg,
  selectedCategoryWithoutOrg,
  allSubmitOrgGoals,
  setWithoutOrgSubmitGoals,
  setWithoutOrgApprovedGoals,
  setWithoutOrgDeclineGoals,
  setOrgApprovedGoals,
  setOrgDeclineGoals,
  setReportGoals,
  setFakeGoals,
  setFakeGoalWithOutOrg
} = goalsSlice.actions;

export const goalReducer = goalsSlice.reducer;
