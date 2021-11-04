import React, { useEffect } from "react";
import MenuAppBar from "../../../Layout/Navbar";
import UserDetailCard from "./UserDetailCard";
import "./style.css";
import { useSelector, useDispatch } from "react-redux";
import firebase from "../../../Config/FirebaseConfig";
import {
  setAllUsers,
  getCurrentUserFromOrganization,
} from "../../../GlobalState/UserSideSlice";

export const getAllUserOfOrg = (parameter,dispatch,userDetail) => {
  const db = firebase.database();
  db.ref(parameter).on("value", (snapshot) => {
    var UsersArray = [];
    var currentUserOrg = [];
    snapshot.forEach((goals) => {
      let getUsers = goals.val();
      let getUserId = goals.key;
      getUsers.orgMainId = getUserId;
      UsersArray.push(getUsers);
      if (getUsers.id === userDetail.id) {
        currentUserOrg.push(getUsers);
      }
    });
    dispatch(getCurrentUserFromOrganization(currentUserOrg));
    dispatch(setAllUsers(UsersArray));
  });
};

const Profile = () => {
  const dispatch = useDispatch();

  const userDetail = useSelector((state) => {
    return state.goalReducer.currentUser;
  });

  useEffect(() => {
    // condition for  if user enrolled in any organization
    if (userDetail.orgId !== "") {
      //   get current user from organization
      getAllUserOfOrg(`organizations/${userDetail.orgId}/users`,dispatch,userDetail);
    } else {
      //   get current user from without organization
      getAllUserOfOrg(`withoutOrganization/users`,dispatch,userDetail);
    }
  }, []);



  return (
    <div className="profile_container">
      <MenuAppBar />
      <div className="profile_md">
        <UserDetailCard
        userDetail={userDetail}
        />
      </div>
    </div>
  );
};

export default Profile;
