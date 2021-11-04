import React, { useEffect } from "react";
import { useParams } from "react-router";
import firebase from "../../../../Config/FirebaseConfig";
import { allOrganizationUsers } from "../../../../GlobalState/CreateSlice";
import { useDispatch, useSelector } from "react-redux";
import dp from "../../../../Assets/dp.png";

export const getOrgUsers = (id, dispatch) => {
  const db = firebase.database();
  const dbRef = db.ref(`organizations/${id}/users`);
  dbRef.on("value", (snapshot) => {
    let filterOrgUserssArry = [];
    snapshot.forEach((data) => {
      const getData = data.val();
      const getId = data.key;
      getData.id = getId;
      filterOrgUserssArry.push(getData);
    });
    dispatch(allOrganizationUsers(filterOrgUserssArry));
  });
};

const UserList = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
   

  // get filter organization goals from database

  useEffect(() => {
    getOrgUsers(id, dispatch);
  }, []);

  const userSelector = useSelector((state) => {
    return state.goalReducer.orgUsers;
  });


  return (
    <div>
      <div className="table_md">
        <table className="goals_table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Number</th>
              <th>Created at</th>
            </tr>
          </thead>
          <tbody>
            {userSelector.map((val) => {
              // console.log(val)
              return (
                <tr key={val.id}>
                  <td>
                    <img
                      className="goals_img"
                      src={val.url ? val.url : dp}
                      alt="..."
                    />
                  </td>
                  <td>{val.name}</td>
                  <td>{val.email}</td>
                  <td>{val.number}</td>
                  <td>{val.createdAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
