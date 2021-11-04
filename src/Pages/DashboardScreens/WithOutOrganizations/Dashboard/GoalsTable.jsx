import React, { useEffect } from "react";
import firebase from "../../../../Config/FirebaseConfig";
import { useHistory } from "react-router-dom";
// import  from "firebase/database";
import { allWithoutOrggGoals } from "../../../../GlobalState/CreateSlice";
import { useDispatch } from "react-redux";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PageviewIcon from "@material-ui/icons/Pageview";

const GoalsTable = ({ selector }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const db = firebase.database();
  const dbRef = db.ref(`withoutOrganization/goals`);

  // get filter organization goals from database
  const getFilterOrgGoals = () => {
    dbRef.on("value", (snapshot) => {
      let filterOrgGoalsArry = [];
      snapshot.forEach((data) => {
        const getData = data.val();
        const getId = data.key;
        getData.id = getId;
        filterOrgGoalsArry.push(getData);
      });
      dispatch(allWithoutOrggGoals(filterOrgGoalsArry));
    });
  };

  useEffect(() => {
    getFilterOrgGoals();
  }, []);

  // goals delete function
  const handleDeleteGoals = (event) => {
    const isSelectedFilter = selector.filter((val) => val.id === event);

    if (!isSelectedFilter[0].used) {
      db.ref(`withoutOrganization/goals/${event}`).remove();
    } else {
      alert("this goal can not be delete becuase user select");
    }
    // console.log(selector,event)
  };

  const goToDetailPage = (event) => {
    history.push(`goals-detail/${event}`);
  };

  const editSelectedGoal = (event) => {
    history.push(`edit-goal/${event}`);
  };
  // console.log(allOrgGoals)

  if (!selector.length) {
    return <div>no goals</div>;
  }

  return (
    <div className="table_container">
      <div className="table_md">
        <table className="goals_table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              {/* <th>People Joined</th> */}
              <th>Time Limit</th>
              {/* <th>Signed Up</th> */}
              <th>category</th>
              <th>Reward Range</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selector.map((val) => {
              const { id, url, inputValues, peopleJoined, numberOfDays } = val;
              return (
                <tr key={id}>
                  <td>
                    <img className="goals_img" src={url} alt="..." />
                  </td>
                  <td>{inputValues.eventName}</td>
                  {/* <td>{peopleJoined}</td> */}
                  <td>{inputValues.numberOfDays} days</td>
                  {/* <td>2</td> */}
                  {/* <td>5</td> */}
                  <td>{inputValues.category}</td>
                  <td>{`${inputValues.rewardMin} - ${inputValues.rewardMax}`}</td>
                  <td className="actions_btns">
                    <button onClick={() => editSelectedGoal(id)}>
                      <EditIcon className="actions_icons" />{" "}
                    </button>{" "}
                    <button onClick={() => handleDeleteGoals(id)}>
                      <DeleteForeverIcon className="actions_icons" />
                    </button>
                    <button
                      className="view_icons"
                      onClick={() => goToDetailPage(id)}
                    >
                      <PageviewIcon />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoalsTable;
