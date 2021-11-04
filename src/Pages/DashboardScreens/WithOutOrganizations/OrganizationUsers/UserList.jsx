import React, { useEffect } from "react";
import firebase from "../../../../Config/FirebaseConfig";
import { allWithoutOrganizationUsers } from "../../../../GlobalState/CreateSlice";
import { useDispatch, useSelector } from "react-redux";
import dp from "../../../../Assets/dp.png";


export const getOrgUsers = (dispatch) => {
  const db = firebase.database();
  const dbRef = db.ref(`withoutOrganization/users`);
  dbRef.on("value", (snapshot) => {
    let filterOrgUserssArry = [];
    snapshot.forEach((data) => {
      const getData = data.val();
      const getId = data.key;
      getData.id = getId;
      filterOrgUserssArry.push(getData);
    });
    dispatch(allWithoutOrganizationUsers(filterOrgUserssArry));
  });
};
const UserList = () => {
  const dispatch = useDispatch();

  // get filter organization goals from database 

  useEffect(()=>{
    getOrgUsers(dispatch)
  },[])

  const userSelector = useSelector((state)=>{
      return state.goalReducer.withoutOrgUser
  })


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
