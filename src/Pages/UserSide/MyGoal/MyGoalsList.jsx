import React from "react";
import { useSelector } from "react-redux";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AssessmentIcon from '@material-ui/icons/Assessment';
import {useHistory} from 'react-router-dom'

const MyGoalsList = ({loading}) => {
  const history = useHistory()
  const selector = useSelector((state) => {
    return state.userReducer.selectedGoals;
  });
  if(loading){
    return <div>loading...</div>
  }

  const handleGoDetailPage = (event)=>{
     history.push(`/mygoal-detail/${event.id}`)
  }

  return (
    <div className="myGoalsList_contianer">
      <div className="myGoalsList_md">
        <div className="myGoals_Content">
          <div className="goalHead">
          <h3>Your Goals List:</h3>
          <div className="numbOfGoal">
            <span>{selector.length?selector.length:null}</span>
          <AssessmentIcon className='numOfGoalIcon' />
          </div>
          </div>
          <div className="myAllGoalsList">
            <div className="goalsLis">
              {selector.length ? (
                selector.map((val,i) => {
                  // console.log(val)
                  return (
                    <React.Fragment key={i} >
                    {/* mobile view list  */}
                      <div className="userGoalList" key={i} >
                        <ul className="goalsUl">
                          <li onClick={()=>handleGoDetailPage(val)}>
                            <div className="goalsListContent">
                              <div className="goalsTitle">
                                <h5>{val.inputValues.eventName}</h5>
                                <p>start date: {val.GoalStartDate.slice(0,9)}</p>
                              </div>
                              <MoreVertIcon className="dotIcon" />
                            </div>
                          </li>
                        </ul>
                      </div>

                      {/* desktop view  */}
                      <div className="myAllGoalsCards" key={val.id} onClick={()=>handleGoDetailPage(val)} >
                        <div className="goalCards">
                          <img src={val.url} alt="..." className="goalImg" />
                          <div className="goalCardBody">
                            <h4 className="eName">
                              {val.inputValues.eventName}
                            </h4>
                            <p
                              className={
                                val.submit && !val.approved && !val.decline
                                  ? " submitted status"
                                  : (val.submit &&
                                      val.approved &&
                                      val.percentage === "100" &&
                                      !val.pending) ||
                                    (val.submit &&
                                      val.approved &&
                                      val.percentage !== "100" &&
                                      !val.pending)
                                  ? " Approved status"
                                  : val.submit &&
                                    val.approved &&
                                    val.percentage !== "100" &&
                                    val.pending
                                  ? " Pending status"
                                  : val.decline === true &&
                                    val.submit &&
                                    !val.approved
                                  ? " decline status"
                                  : " needSubmmision status"
                              }
                            >
                              {" "}
                              Status:
                              {val.submit && !val.approved && !val.decline
                                ? " submitted"
                                : (val.submit &&
                                    val.approved &&
                                    val.percentage === "100" &&
                                    !val.pending) ||
                                  (val.submit &&
                                    val.approved &&
                                    val.percentage !== "100" &&
                                    !val.pending)
                                ? " Approved"
                                : val.submit &&
                                  val.approved &&
                                  val.percentage !== "100" &&
                                  val.pending
                                ? " Pending"
                                : val.decline === true &&
                                  val.submit &&
                                  !val.approved
                                ? " decline"
                                : " need Submmision"}
                            </p>
                            <div className="perReward">
                              <p
                                className={
                                  val.percentage >= "80" ||
                                  val.percentage === "100"
                                    ? "succes green"
                                    : val.percentage >= "60"
                                    ? "succes blue"
                                    : val.percentage >= "60" ||
                                      val.percentage <= "40"
                                    ? "succes red"
                                    : "succes"
                                }
                              >
                                Succes: {val.percentage ? val.percentage : "0"}%{" "}
                              </p>
                              <p className="succes">
                                Reward: {val.reward ? val.reward : "0"}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                     </React.Fragment>
                  );
                })
              ) : (
                <p>your list is empty, Seacrh for goals to add...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGoalsList;
