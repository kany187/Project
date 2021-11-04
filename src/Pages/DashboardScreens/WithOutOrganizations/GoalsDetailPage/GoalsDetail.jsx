import React from "react";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import "./style.css";
import CustomButton from "../../../../Components/Button/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const GoalsDetail = ({
  goalDetail,
  deleteGoals,
  loading,
  editGoal,
  backArrowPathId,
}) => {
  return (
    <React.Fragment>
      {goalDetail ? (
        <div className="goals_detail_box">
          <div className="goals_detail_content">
            <Link to={backArrowPathId}>
              <ArrowBackIcon />
            </Link>
            <div className="goals_details">
              <div className="goals_detail_left">
                <img src={goalDetail.url} alt="..." />
                <CustomButton
                  value="Edit Goal"
                  type="button"
                  className="edit_btn"
                  onClick={() => editGoal(goalDetail.id)}
                />
                {!loading ? (
                  <CustomButton
                    value="Delete Goal"
                    type="button"
                    className="dlt_btn"
                    onClick={() => deleteGoals(goalDetail.id)}
                  />
                ) : (
                  //   <div className="progress_div">
                  <CircularProgress />
                  //   </div>
                )}
              </div>
              <div className="goals_detail_right">
                <div className="goals_detail_list">
                  <ul className="goals_dtl_ul">
                    <li className="goals_li">
                      <h5>Goal name</h5>
                      <p>{goalDetail.inputValues.eventName}</p>
                    </li>
                    <li className="goals_li">
                      <h5>Difficulty</h5>
                      <p>{goalDetail.inputValues.dificulty}</p>
                    </li>
                    <li className="goals_li">
                      <h5>Time limit</h5>
                      <p>1 week</p>
                    </li>
                    <li className="goals_li">
                      <h5>Reward Range</h5>
                      <p>{`${goalDetail.inputValues.rewardMin} - ${goalDetail.inputValues.rewardMax}`}</p>
                    </li>
                    <li className="goals_li">
                      <h5>Investment Min</h5>
                      <p>{`${goalDetail.inputValues.investMin}`}</p>
                    </li>
                    <li className="goals_li">
                      <h5>Investment Min</h5>
                      <p>{goalDetail.inputValues.investMax}</p>
                    </li>
                    <li className="goals_li">
                      <h5>Start date</h5>
                      <p>{goalDetail.inputValues.startDate}</p>
                    </li>
                    <li className="goals_li">
                      <h5>End date</h5>
                      <p>{goalDetail.inputValues.endDate}</p>
                    </li>
                    <li className="goals_li">
                      <h5>category</h5>
                      <p>{goalDetail.inputValues.category}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loading_div">
          <Link to="/dashboard">
            <ArrowBackIcon />
          </Link>
          {/* <CircularProgress color="secondary" /> */}
          <h1>Empty</h1>
        </div>
      )}
    </React.Fragment>
  );
};

export default GoalsDetail;
