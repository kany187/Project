import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import firebase from "../../../../Config/FirebaseConfig";
import ApprovedForm from "../../WithOrganizations/SubmitGoals/ApprovedForm";
import { send } from "emailjs-com";

const SubmitGoalsTable = ({
  selector,
  btn,
  undoFunc,
  declineBtn,
  approvedUndoFunc,
  declineForReported,
  undoForReported,
  undoFake
}) => {
  const db = firebase.database();

  // approved form working
  let [open, setOpen] = useState(false);
  let [goalId, setGoalId] = useState("");
  let [percantage, setPercentage] = useState("");
  let [reward, setReward] = useState("");
  let [rewardRange, setRewardRange] = useState("");
  let [organizationUserId, setOrganizationUserId] = useState("");
  let [loading] = useState(false);
  let [userBalance, setUserBalance] = useState("");
  let [userMyGoalId, setUserMyGoalId] = useState("");
  let [userInvest,setUserInvest] = useState()

  // working for approved form
  const openApprovedForm = (event) => {
    setOpen(true);
    setGoalId(event.submitGoalId);
    setUserMyGoalId(event.SubmitGoal.myGoalId);
    setOrganizationUserId(event.orgUserId);
    setRewardRange(
      `${event.SubmitGoal.inputValues.rewardMin} - ${event.SubmitGoal.inputValues.rewardMin}`
    );
    setUserInvest(event.SubmitGoal.userInvestment)

    // get organization user info to get prev balance
    db.ref(`withoutOrganization/users/${event.orgUserId}`).on(
      "value",
      (snapshot) => {
        let userData = snapshot.val();
        let userBalancedb = userData.balance;
        setUserBalance(userBalancedb);
      }
    );
  };

  const handlePercentage = (event) => {
    setPercentage(event.target.value);
  };

  const handleReward = (event) => {
    setReward(event.target.value);
  };
  // form close function
  const handleClose = () => {
    setOpen(false);
  };

  // goals delete function
  const handleApprovedGoals = () => {
    let approveData = {
      approved: true,
      pending: false,
      percantage: percantage,
      reward: reward,
      submit: true,
      isReport: false,
    };
    let pendingData = {
      approved: true,
      percantage: percantage,
      pending: true,
      reward: reward,
      submit: true,
      isReport: false,
    };
    if (percantage === "100") {
      // console.log("100%");
      db.ref(`withoutOrganization/users/${organizationUserId}`).update({
        balance: Number(userBalance) + Number(reward) + userInvest,
      });
      db.ref(
        `withoutOrganization/users/${organizationUserId}/myGoals/${userMyGoalId}`
      ).update(approveData);
      db.ref(`withoutOrganization/submitGoals/${goalId}`).update(approveData);
      setPercentage("");
      setReward("");
      handleClose();
    } else {
      db.ref(`withoutOrganization/submitGoals/${goalId}`).update(pendingData);
      db.ref(
        `withoutOrganization/users/${organizationUserId}/myGoals/${userMyGoalId}`
      ).update(pendingData);

      handleClose();
      setPercentage("");
      setReward("");
    }
  };

  const handleDeclineGoals = (event) => {
    db.ref(`withoutOrganization/submitGoals/${event.submitGoalId}`).update({
      decline: true,
    });
    db.ref(
      `withoutOrganization/users/myGoals/${event.SubmitGoal.myGoalId}`
    ).update({
      decline: true,
    });
  };

  const handleUndoDeclineGoals = (event) => {
    db.ref(`withoutOrganization/submitGoals/${event.submitGoalId}`).update({
      decline: false,
    });
    db.ref(
      `withoutOrganization/users/myGoals/${event.SubmitGoal.myGoalId}`
    ).update({
      decline: false,
    });
  };

  const balanceSelector = useSelector((state) => {
    return state.goalReducer.orgUsers;
  });
  const allUsersSelector = useSelector((state) => {
    return state;
  });

  // approved undo function
  const handleApprovedUndo = (event) => {
    const getPrevReward = event.reward;
    const updateData = {
      approved: false,
      pending: false,
      percantage: "",
      reward: "",
    };
    balanceSelector.filter((val) => {
      if (val.id === event.orgUserId) {
        let userBlnce = val.balance;
        db.ref(`withoutOrganization/users/${event.orgUserId}`).update({
          balance: userBlnce -  (Number(getPrevReward)+ event.SubmitGoal.userInvestment ),
        });
        db.ref(
          `withoutOrganization/users/${event.orgUserId}/myGoals/${event.SubmitGoal.myGoalId}`
        ).update(updateData);
        db.ref(`withoutOrganization/submitGoals/${event.submitGoalId}`).update(
          updateData
        );
      }
    });
  };

  // undo reported goal
  const handleUndoReportedGoals = (event) => {
    db.ref(`withoutOrganization/submitGoals/${event.submitGoalId}`).update({
      isReport: false,
    });
  };

  // decline if goal is reported
  const handleDeclineReportGoals = (event) => {
    const getPrevReward = event.reward;
    const updateData = {
      approved: false,
      percantage: "",
      pending: false,
      reward: "",
      isReport: true,
      acceptReport: true,
      submit: false,
    };
    balanceSelector.filter((val) => {
      if (val.id === event.orgUserId) {
        let userBlnce = val.balance;
        db.ref(`withoutOrganization/users/${event.orgUserId}`).update({
          balance:
            userBlnce - (Number(getPrevReward) ? Number(getPrevReward) : 0),
        });
        db.ref(`withoutOrganization/submitGoals/${event.submitGoalId}`)
          .update(updateData)
          .then(() => {
            allUsersSelector.userReducer.allUsers.filter((user) => {
              if (user.id === event.userIdMain) {
                // console.log(user)
                send(
                  // process.env.REACT_APP_EMAIL_JS_SERVICE_ID,
                  // process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID,
                  "service_q1galup",
                  "template_aq5fbiv",
                  {
                    to: user.email,
                    to_name: `${event.userName}`,
                    from_email_name: "TRYVE",
                    subject: "",
                    message: `TRYVE reported your goal please retake good picture. Thanks!`,
                    from: "tryve@gmail.com",
                    reply_to: "tryve@gmail.com",
                  },
                  process.env.REACT_APP_EMAIL_JS_USER_ID
                )
                  .then(() => {
                    console.log("success...");
                  })
                  .catch((err) => {
                    console.log("admin Email sending FAILED...", err);
                  });
              }
            });
          });

        db.ref(
          `withoutOrganization/users/${event.orgUserId}/myGoals/${event.SubmitGoal.myGoalId}`
        ).update(updateData);
        db.ref(`withoutOrganization/likes/${event.submitGoalId}`).remove();
        db.ref(`withoutOrganization/comments/${event.submitGoalId}`).remove();
      }
    });
  };

  // undo fake goals
  const handleUndoFakeGoals = (event) => {
    db.ref(`withoutOrganization/submitGoals/${event.submitGoalId}`).update({
      acceptReport: false,
    });
    db.ref(
      `withoutOrganization/users/${event.orgUserId}/myGoals/${event.SubmitGoal.myGoalId}`
    ).update({
      acceptReport: false,
    });
  };

  // automatically approved working

  useEffect(() => {
    let approvedinterVal = setInterval(() => {
      if (selector.length) {
        selector.filter((val) => {
          if (
            !val.isReport &&
            !val.decline &&
            !val.acceptReport &&
            !val.pending &&
            val.submit &&
            !val.approved
          ) {
            const inputVal = val.SubmitGoal.inputValues;
            let getStartDate = new Date(val.SubmitGoal.GoalStartDate);
            let endDate = new Date(getStartDate);
            let currentDate = new Date();
            endDate.setDate(endDate.getDate() + Number(inputVal.numberOfDays));
            let randomNumGenerate = Math.floor(
              Math.random() *
                (Number(inputVal.rewardMax) -
                  Number(inputVal.rewardMin) +
                  Number(inputVal.rewardMin))
            );
            if (currentDate.getTime() >= endDate.getTime()) {
              const filterGoalUser = balanceSelector.filter(
                (user) => user.id === val.orgUserId
              );
              const approvedObj = {
                approved: true,
                pending: false,
                percantage: "100",
                reward: randomNumGenerate,
                submit: true,
                isReport: false,
              };
              db.ref(`withoutOrganization/users/${val.orgUserId}`).update({
                balance: filterGoalUser[0].balance + randomNumGenerate + val.SubmitGoal.userInvestment,
              });
              db.ref(
                `withoutOrganization/users/${val.orgUserId}/myGoals/${val.SubmitGoal.myGoalId}`
              ).update(approvedObj);
              db.ref(`withoutOrganization/submitGoals/${val.submitGoalId}`)
                .update(approvedObj)
                .then(() => {
                  console.log("auto approved");
                });
              console.log("end", val);
            }
          }
          // if goals is reported and not approved not pending only submit and someone reported then is would be decline autt
          else if (
            val.isReport &&
            !val.decline &&
            !val.acceptReport &&
            !val.pending &&
            val.submit &&
            !val.approved
          ) {
            const inputVal = val.SubmitGoal.inputValues;
            let getStartDate = new Date(val.SubmitGoal.GoalStartDate);
            let endDate = new Date(getStartDate);
            let currentDate = new Date();
            endDate.setDate(endDate.getDate() + Number(inputVal.numberOfDays));
            if (currentDate.getTime() >= endDate.getTime()) {
              db.ref(
                `withoutOrganization/submitGoals/${val.submitGoalId}`
              ).update({
                decline: true,
                submit: false,
                isReport: false,
              });
              db.ref(
                `withoutOrganization/users/${val.orgUserId}/myGoals/${val.SubmitGoal.myGoalId}`
              ).update({
                decline: true,
                submit: false,
                isReport: false,
              });
            }
          }
        });
      }
    }, 10000);
    return () => {
      clearInterval(approvedinterVal);
    };
  });

  // submit goal image function
  let [imgUrl, setImgUrl] = useState("");
  let [showImg, setShowImg] = useState(false);
  const handleSeeImage = (event) => {
    setImgUrl(event);
    setShowImg(true);
  };
  const handleCloseImg = () => {
    setShowImg(false);
    setImgUrl("");
  };

  // console.log(selector);

  if (!selector.length) {
    return <div>no goals</div>;
  }

  return (
    <div className="table_container">
      <ApprovedForm
        open={open}
        handleClickOpen={openApprovedForm}
        handleSelect={handlePercentage}
        handleInputvalue={handleReward}
        inputValue={reward}
        btnValue="Approved"
        labelValue="Reward"
        range={rewardRange}
        handleAddFunction={handleApprovedGoals}
        handleClose={handleClose}
        loading={loading}
      />
      <ApprovedForm
        handleClickOpen={handleSeeImage}
        imgUrl={imgUrl}
        open={showImg}
        btnValue="Close"
        handleClose={handleCloseImg}
      />
      <div className="table_md">
        <table className="goals_table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Event Name</th>
              <th>user name</th>
              <th>Time Limit</th>
              {/* <th>Signed Up</th> */}
              <th>category</th>
              <th>Reward Range</th>
              {!btn ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {selector.map((val) => {
              let goalStartDate = new Date(val.SubmitGoal.GoalStartDate);
              const newDateForEndDate = new Date(val.submitDate);
              const goalStartTime = goalStartDate.getTime();
              const getEndTime = newDateForEndDate.getTime();
              const oneDayTime = 1000 * 3600 * 24;
              const takeNumberOfDays =
                (getEndTime - goalStartTime) / oneDayTime;
              return (
                <tr key={val.submitGoalId}>
                  <td>
                    <img
                      className="goals_img"
                      src={val.uploadImgUlr}
                      alt="..."
                    />
                  </td>
                  <td>{val.SubmitGoal.inputValues.eventName}</td>
                  <td>{val.userName}</td>
                  <td>{val.SubmitGoal.inputValues.numberOfDays} days</td>
                  <td>
                    {takeNumberOfDays > val.SubmitGoal.inputValues.numberOfDays
                      ? "late"
                      : "submit on time"}
                  </td>
                  <td>{val.SubmitGoal.inputValues.category}</td>
                  <td>{`${val.SubmitGoal.inputValues.rewardMin} - ${val.SubmitGoal.inputValues.rewardMax}`}</td>
                  <td className="actions_btns">
                    {!btn ? (
                      <button onClick={() => openApprovedForm(val)}>
                        approved
                      </button>
                    ) : null}
                    {!declineBtn ? (
                      !undoFunc ? (
                        <button
                          className="view_icons"
                          onClick={() => handleDeclineGoals(val)}
                        >
                          decline
                        </button>
                      ) : (
                        <button
                          className="view_icons"
                          onClick={
                            !approvedUndoFunc
                              ? () => handleUndoDeclineGoals(val)
                              : () => handleApprovedUndo(val)
                          }
                        >
                          Undo
                        </button>
                      )
                    ) : null}
                    {/* button for decline if goal is reported  */}
                    {declineForReported ? (
                      <button
                        className="view_icons"
                        onClick={() => handleDeclineReportGoals(val)}
                      >
                        decline
                      </button>
                    ) : null}
                    {undoForReported ? (
                      <button
                        className="view_icons"
                        onClick={() => handleUndoReportedGoals(val)}
                      >
                        undo reported
                      </button>
                    ) : null}
                    {undoFake ? (
                      <button
                        className="view_icons"
                        onClick={() => handleUndoFakeGoals(val)}
                      >
                        undo fake
                      </button>
                    ) : null}
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

export default SubmitGoalsTable;
