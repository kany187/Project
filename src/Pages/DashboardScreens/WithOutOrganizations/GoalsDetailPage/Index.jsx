import React, { useEffect, useState } from "react";
import GoalsDetail from "./GoalsDetail";
import MiniDrawer from "../../Sidebar";
import { useParams, useHistory } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import { useSelector } from "react-redux";
import firebase from "../../../../Config/FirebaseConfig";

import "./style.css";

const WithoutOrgGoalDetail = () => {
  const db = firebase.database();
  const history = useHistory(useHistory);
  let { goal } = useParams();
  let [filterGoal, setFilterGoal] = useState([]);
  let [loading, setLoading] = useState(false);
  const goals = useSelector((state) => {
    return state.goalReducer.withoutOrgGoals;
  });
  useEffect(() => {
    //   filter selected goal detail
    let goalsFilter = goals.filter((val) => val.id === goal);
    setFilterGoal(goalsFilter);
  }, []);

  //   delete gaol function
  const deleteGoals = (event) => {
    setLoading(true);
    db.ref(`withoutOrganization/goals/${event}`)
      .remove()
      .then(() => {
        setFilterGoal([]);
        setLoading(false);
        history.push(`/without-organization/dashboard`);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const editGoal = (event) => {
    history.push(`/without-organization/edit-goal/${event}`);
  };

  return (
    <div className="goals_detail_container">
      <div className="dashboard_left_content">
        <MiniDrawer withOutOrg />
      </div>
      <div className="goals_detailMd_right_content">
        <div className="top_route_head">
          <p className="top_route_icon">
            <PersonIcon />
          </p>
          <p style={{ marginLeft: "10px" }}>Goals</p>
        </div>
        <GoalsDetail
          goalDetail={filterGoal[0]}
          deleteGoals={deleteGoals}
          loading={loading}
          editGoal={editGoal}
          backArrowPathId="/without-organization/dashboard"
        />
      </div>
    </div>
  );
};

export default WithoutOrgGoalDetail;
