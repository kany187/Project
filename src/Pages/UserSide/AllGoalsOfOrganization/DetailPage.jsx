import React from "react";
import { useHistory, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import MenuAppBar from "../../../Layout/Navbar";
import firebase from "../../../Config/FirebaseConfig";
import AlertDialog from "../../../Components/AlertPopup";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import TextsmsOutlinedIcon from "@material-ui/icons/TextsmsOutlined";
import { Link } from "react-router-dom";



const DetailPage = () => {
  const db = firebase.database();
  const { id } = useParams();
  const history = useHistory();
  const [goalDetail, setGoalDetail] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [validInvestPopup, setValidInvestPopup] = useState(false);
  const [alreadyExistPopup, setAlreadyExistPopup] = useState(false);
  const [lessBalancePopup, setLessBalancePopup] = useState(false);
  const [range, setRange] = useState("");
  const selector = useSelector((state) => {
    return state;
  });
  useEffect(() => {
    const filterSelectedGoal = selector.userReducer.allGoalsOfOrg.filter(
      (val) => val.id === id
    );
    setGoalDetail(filterSelectedGoal);
  }, []);

  let [userInvest, setUserInvest] = useState();
  const handleInvestment = (e) => {
    setUserInvest(e.target.value);
  };

  // select goals working
  const handleStartGoal = (event) => {
    let filterFormSelectedGoal = selector.userReducer.selectedGoals.filter(
      (val) => val.id === event
    );
    let filterSelectedGoalFromAllGoals =
      selector.userReducer.allGoalsOfOrg.filter((goal) => goal.id === event);
    const numberOfJoinedPeople = filterSelectedGoalFromAllGoals[0].peopleJoined;
    const currentOrgUserBalance =
      selector.userReducer.currentUserOfOrganization;
      // check inter range 
    if (
      Number(userInvest) <=
        filterSelectedGoalFromAllGoals[0].inputValues.investMax &&
      Number(userInvest) >=
        filterSelectedGoalFromAllGoals[0].inputValues.investMin
    ) {
      // check if user have balance equal or more than balance goal 
      if (Number(userInvest) < currentOrgUserBalance[0].balance) {
        // check goal is already selected 
        if (!filterFormSelectedGoal.length) {
          // check wheather user enrolled org or not 
          if (selector.goalReducer.currentUser.orgId !== "") {
            db.ref(
              `organizations/${selector.goalReducer.currentUser.orgId}/users/${selector.userReducer.currentUserOrgId}`
            ).update({
              balance: currentOrgUserBalance[0].balance - Number(userInvest),
            });
            db.ref(
              `organizations/${selector.goalReducer.currentUser.orgId}/goals/${event}`
            ).update({ used: true, peopleJoined: numberOfJoinedPeople + 1 });
            // update state of users goal 
            db.ref(
              `organizations/${selector.goalReducer.currentUser.orgId}/users/${selector.userReducer.currentUserOrgId}/myGoals`
            )
              .push()
              .update({
                myGoals: filterSelectedGoalFromAllGoals[0],
                submit: false,
                GoalStartDate: new Date().toLocaleString(),
                hasStarted: true,
                approved: false,
                decline: false,
                userInvestment: userInvest,
                isFavorite: false,
                isReport: false,
                acceptReport: false,
                reward: "",
                percantage: "",
                pending: false,
              })
              .then(() => {
                console.log("selected");
                setShowPopup(true);
              })
              .catch((err) => {
                console.log(err);
                alert("connection failed please try again");
              });
          }
          //    set goal if user not enrolled in any org
          else {
            db.ref(
              `withoutOrganization/goals/${selector.goalReducer.currentUser.orgId}/${event}`
            ).update({ used: true });
            db.ref(
              `withoutOrganization/users/${selector.userReducer.currentUserOrgId}`
            ).update({
              balance: currentOrgUserBalance[0].balance - Number(userInvest),
            });
            db.ref(
              `withoutOrganization/users/${selector.userReducer.currentUserOrgId}/myGoals`
            )
              // .child("myGoals")
              .push()
              .update({
                myGoals: filterSelectedGoalFromAllGoals[0],
                submit: false,
                GoalStartDate: new Date().toLocaleString(),
                hasStarted: true,
                approved: false,
                decline: false,
                userInvestment: userInvest,
                isFavorite: false,
                isReport: false,
                acceptReport: false,
                reward: "",
                percantage: "",
                pending: false,
              })
              .then(() => {
                console.log("selected");
                setShowPopup(true);
              })
              .catch((err) => {
                console.log(err);
                alert("connection failed please try again");
              });
          }
        } else {
          // alert('already exist')
          setAlreadyExistPopup(true);
        }
      } else {
        setLessBalancePopup(true);
        // console.log("your balance is less", currentOrgUserBalance[0].balance);
      }
    }
    // }else{

    //   }
    else {
      // console.log('please enter between ')
      setValidInvestPopup(true);
      setRange(
        filterSelectedGoalFromAllGoals[0].inputValues.investMin +
          "-" +
          filterSelectedGoalFromAllGoals[0].inputValues.investMax
      );
    }
  };

  //   alert popup close function
  const handleClose = () => {
    setShowPopup(false);
    history.push("/selec-goals");
  };
  const handleCloseInvestPopup = () => {
    setValidInvestPopup(false);
    setAlreadyExistPopup(false);
  };

  const handleCloseLessBalancePopup = () => {
    setLessBalancePopup(false);
  };


  return (
    <div className="userGoalDetail_container">
      {showPopup ? (
        <AlertDialog
          handleClose={handleClose}
          open={showPopup}
          value="Good luck on your goal"
          btnValue="Back to My Goals"
        />
      ) : null}
      {validInvestPopup ? (
        <AlertDialog
          handleClose={handleCloseInvestPopup}
          open={validInvestPopup}
          value={`please enter investment between given range ${range}`}
          btnValue="OK"
        />
      ) : null}
      {alreadyExistPopup ? (
        <AlertDialog
          handleClose={handleCloseInvestPopup}
          open={alreadyExistPopup}
          value="You have already selected this goal!"
          btnValue="Cancel"
        />
      ) : null}
      {lessBalancePopup ? (
        <AlertDialog
          handleClose={handleCloseLessBalancePopup}
          open={lessBalancePopup}
          value="You can not start goal because you don't have balance !"
          btnValue="OK"
        />
      ) : null}
      <div className="userGoalDetail_md">
        <MenuAppBar />
        <div className="mobViewHead dtMobViewHead">
          <div className="mobViewHeadContent mobVwHead">
            <div className="mobHeadBack">
              <Link className="mobHeadBack_link" to="/search-goals">
                <ArrowBackIosIcon />
              </Link>
            </div>
            <h2>Upcomming Challenges</h2>
            <div className="headChatIcon">
              <TextsmsOutlinedIcon />
            </div>
          </div>
        </div>
        {/* {!loadingGoal ? ( */}
        <div className="userGoal_detail_d">
          {goalDetail.length ? (
            goalDetail.map((val) => (
              <div className="userGoalDetail_content" key={val.id}>
                <div className="detailLeftContent">
                  <Link to="/search-goals" className="Verifyback_link">
                    <ArrowBackIcon />
                  </Link>
                  <img className="desktopViewDimg" src={val.url} alt="..." />
                  <button
                    className="start_goal_btn"
                    onClick={() => handleStartGoal(val.id)}
                  >
                    Submit
                  </button>
                </div>
                <div className="detailRight_content">
                  <div className="detail_list">
                    <div className="goalDetailCard">
                      <div className="detailHead">
                        <h4>{val.inputValues.eventName}</h4>
                        <p>Start date : {val.inputValues.startDate}</p>
                      </div>
                      <div className="detailBody">
                        <p>Welcome to the newest challengy offered by Tryve</p>
                        <p className="decs">{val.inputValues.description}</p>
                        <div className="verifyMethod">
                          <h4>Verification Methods</h4>
                          <div className="verifyImg">
                            <img
                              src="https://static.vecteezy.com/system/resources/previews/000/939/976/non_2x/asian-young-girl-drink-water-photo.jpg"
                              alt="..."
                            />
                            <img
                              src="https://static.vecteezy.com/system/resources/previews/000/939/976/non_2x/asian-young-girl-drink-water-photo.jpg"
                              alt="..."
                            />
                          </div>
                          <p className="investRange">
                            Enter between ${val.inputValues.investMin} - $
                            {val.inputValues.investMax} amount to join
                          </p>
                        </div>
                        <div className="investInp">
                          <input
                            type="number"
                            onChange={handleInvestment}
                            className="inp"
                            placeholder="Enter Amount"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="goalMob_btn">
                    <button
                      className="start_goal_btn"
                      onClick={() => handleStartGoal(val.id)}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div onClick={() => history.goBack()} className="goBack">
              {" "}
              Go back and select product...{" "}
            </div>
          )}
        </div>
        {/* ) : (
          <LoadingState />
        )} */}
      </div>
    </div>
  );
};

export default DetailPage;
