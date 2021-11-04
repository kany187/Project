import React from 'react'
import { useHistory, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useState } from 'react'
import MenuAppBar from '../../../Layout/Navbar'
import firebase from '../../../Config/FirebaseConfig'
import AlertDialog from '../../../Components/AlertPopup'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import FormDialog from '../../../Components/InputPopup'
import TextsmsOutlinedIcon from '@material-ui/icons/TextsmsOutlined'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

const StartGoalDetailPage = () => {
  const db = firebase.database()
  const { id } = useParams()
  const history = useHistory()
  const [goalDetail, setGoalDetail] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  let [loader, setLoader] = useState(false)
  const selector = useSelector((state) => {
    return state
  })
  const { userReducer, goalReducer } = selector
  useEffect(() => {
    const filterSelectedGoal = selector.userReducer.selectedGoals.filter(
      (val) => val.id === id,
    )
    setGoalDetail(filterSelectedGoal)
    setLoader(true)

    return () => {
      setGoalDetail([])
    }
  }, [])

  // countdown timer working
  const calculateTime = () => {
    // if (goalDetail) {
    const filterSelectedGoal = selector.userReducer.selectedGoals.filter(
      (val) => val.id === id,
    )
    if (filterSelectedGoal.length) {
      const date = new Date(filterSelectedGoal[0].GoalStartDate)
      var myFutureDate = new Date(date)
      let currentDate = new Date()
      myFutureDate.setDate(
        myFutureDate.getDate() +
          Number(filterSelectedGoal[0].inputValues.numberOfDays),
      )
      const difference = myFutureDate - currentDate
      // setEndDate(myFutureDate)
      // console.log(myFutureDate)
      let timeLeft = {}

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }

      return timeLeft
      // }
    }
  }
  calculateTime()
  const [timeLeft, setTimeLeft] = useState(calculateTime())
  useEffect(() => {
    if (loader) {
      setLoader(false)
    }
    if (timeLeft) {
      if (Object.keys(timeLeft).length !== 0) {
        const timer = setTimeout(() => {
          setTimeLeft(calculateTime())
        }, 1000)
        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer)
      }
    }
  })

  // submit goal working
  let [open, setOpen] = useState(false)
  let [goalId, setGoalId] = useState('')
  let [myGoalId, setMyGoalId] = useState('')
  const [imgUrl, setImgurl] = useState('')
  const [imgName, setImgName] = useState('')
  const [local, setLocal] = useState('')
  let [loading, setLoading] = useState(false)
  let [submitGoalKey, setSubmitGoalKey] = useState('')

  const handleOpenForm = (event) => {
    let filterFormSelectedGoal = selector.userReducer.selectedGoals.filter(
      (val) => val.id === event,
    )
    setMyGoalId(filterFormSelectedGoal[0].myGoalId)
    setGoalId(event)
    setOpen(true)
    db.ref(`organizations/${goalReducer.currentUser.orgId}/submitGoals`).on(
      'value',
      (snap) => {
        snap.forEach((sGoal) => {
          if (sGoal.val().SubmitGoal.id === event) {
            const getSelecGoalKey = sGoal.key
            setSubmitGoalKey(getSelecGoalKey)
          }
          // console.log(sGoal.val(),event);
        })
      },
    )
    console.log('unreport')
  }
  const handleCloseSubmitForm = () => {
    setOpen(false)
  }

  const handleSelectImg = (event) => {
    const url = URL.createObjectURL(event.target.files[0])
    const goalImgName = event.target.files[0].name
    setImgurl(url)
    setImgName(goalImgName)
    setLocal(event.target.files[0])
  }

  // firebase storage ref
  const storage = firebase.storage()
  let createStorageRef = () => storage.ref(`SubmitImages/${imgName}`).put(local)
  let downLoad = () => storage.ref(`SubmitImages/${imgName}`).getDownloadURL()

  const handleSubmitGoal = () => {
    let filterFormSelectedGoal = selector.userReducer.selectedGoals.filter(
      (val) => val.id === goalId,
    )
    setLoading(true)
    let myGoalObject = {
      submit: true,
      approved: false,
      decline: false,
      submitDate: new Date().toLocaleString(),
      hasStarted: false,
      isReport: false,
      acceptReport: false,
      pending: false,
    }
    // console.log(filterFormSelectedGoal[0]);
    if (!filterFormSelectedGoal[0].submit) {
      if (local) {
        createStorageRef()
          .then(() => {
            // download img from storage
            downLoad()
              .then((url) => {
                // then set submit goals in database
                if (goalReducer.currentUser.orgId !== '') {
                  // user side update mygoals
                  db.ref(
                    `organizations/${goalReducer.currentUser.orgId}/users/${userReducer.currentUserOrgId}/myGoals/${myGoalId}`,
                  ).update(myGoalObject)
                  // set insise organization
                  if (!filterFormSelectedGoal[0].acceptReport) {
                    db.ref(
                      `organizations/${goalReducer.currentUser.orgId}/submitGoals`,
                    )
                      .push()
                      .set({
                        SubmitGoal: filterFormSelectedGoal[0],
                        userName: goalReducer.currentUser.name,
                        userIdMain: goalReducer.currentUser.id,
                        uploadImgUlr: url,
                        approved: false,
                        decline: false,
                        submit: true,
                        hasStarted: false,
                        submitDate: new Date().toLocaleString(),
                        orgUserId: userReducer.currentUserOrgId,
                        isReport: false,
                        acceptReport: false,
                        pending: false,
                      })

                      .then(() => {
                        setImgurl('')
                        setImgName('')
                        setLocal('')
                        setShowPopup(true)
                        setLoading(false)

                        console.log('submitted')
                        handleClose()
                      })
                      .catch((err) => {
                        console.log(err)
                        setLoading(false)
                        alert('connectionn failed try again')
                      })
                  } else {
                    db.ref(
                      `organizations/${goalReducer.currentUser.orgId}/submitGoals/${submitGoalKey}`,
                    )
                      .update({
                        uploadImgUlr: url,
                        approved: false,
                        decline: false,
                        submit: true,
                        hasStarted: false,
                        submitDate: new Date().toLocaleString(),
                        isReport: false,
                        acceptReport: false,
                        pending: false,
                      })
                      .then(() => {
                        setImgurl('')
                        setImgName('')
                        setLocal('')
                        setShowPopup(true)
                        setLoading(false)

                        console.log('submitted')
                        handleClose()
                      })
                      .catch((err) => {
                        console.log(err)
                        setLoading(false)
                        alert('connectionn failed try again')
                      })
                  }
                }
                //    set submit goal if user not enrolled in any org
                else {
                  db.ref(
                    `withoutOrganization/users/${userReducer.currentUserOrgId}/myGoals/${myGoalId}`,
                  ).update(myGoalObject)

                  if (!filterFormSelectedGoal[0].acceptReport) {
                    console.log('submitted')
                    db.ref(`withoutOrganization/submitGoals`)
                      .push()
                      .set({
                        SubmitGoal: filterFormSelectedGoal[0],
                        userName: goalReducer.currentUser.name,
                        userIdMain: goalReducer.currentUser.id,
                        uploadImgUlr: url,
                        approved: false,
                        decline: false,
                        orgUserId: userReducer.currentUserOrgId,
                        hasStarted: false,
                        submit: true,
                        submitDate: new Date().toLocaleString(),
                        isReport: false,
                        acceptReport: false,
                        pending: false,
                      })
                      .then(() => {
                        setImgurl('')
                        setImgName('')
                        setLocal('')
                        setShowPopup(true)
                        setLoading(false)
                        handleClose()
                      })
                      .catch((err) => {
                        console.log(err)
                        alert('connection failed try again')
                        setLoading(false)
                      })
                  } else {
                    db.ref(
                      `withoutOrganization/submitGoals/${submitGoalKey}`,
                    ).update({
                      uploadImgUlr: url,
                      approved: false,
                      decline: false,
                      submit: true,
                      hasStarted: false,
                      submitDate: new Date().toLocaleString(),
                      isReport: false,
                      acceptReport: false,
                      pending: false,
                    })
                    .then(() => {
                      setImgurl('')
                      setImgName('')
                      setLocal('')
                      setShowPopup(true)
                      setLoading(false)
                      handleClose()
                    })
                    .catch((err) => {
                      console.log(err)
                      alert('connection failed try again')
                      setLoading(false)
                    })
                  }
                }
              })
              // handle error of download img
              .catch((err) => {
                console.log(err)
              })
          })
          // handle error of upload img
          .catch((err) => {
            console.log(err)
          })
      } else {
        alert('Please select image')
      }
    } else {
      alert('already submitted')
      setLoading(false)
    }
  }

  // retry goal
  const handleRetryGoal = (event) => {
    // console.log(event,selector.userReducer)
    // get submit goal key for retry
    if (selector.goalReducer.currentUser.orgId !== '') {
      db.ref(
        `organizations/${selector.goalReducer.currentUser.orgId}/users/${selector.userReducer.currentUserOrgId}/myGoals/${event.myGoalId}`,
      ).update({
        decline: false,
        submit: false,
        pending: false,
      })
      db.ref(
        `organizations/${selector.goalReducer.currentUser.orgId}/submitGoals`,
      ).on('value', (snapshot) => {
        snapshot.forEach((val) => {
          if (val.val().SubmitGoal.myGoalId === event.myGoalId) {
            // console.log(val.key)
            db.ref(
              `organizations/${selector.goalReducer.currentUser.orgId}/submitGoals/${val.key}`,
            )
              .update({
                decline: false,
                submit: false,
                pending: false,
              })
              .then(() => {
                console.log('retry')
                history.push('/goals-status')
              })
              .catch((err) => {
                console.log(err)
                alert('connection failed please try again')
              })
          }
        })
      })
    }
    //    set goal if user not enrolled in any org
    else {
      db.ref(
        `withoutOrganization/users/${selector.userReducer.currentUserOrgId}/myGoals/${event.myGoalId}`,
      ).update({
        decline: false,
        submit: false,
        pending: false,
      })
      db.ref(`withoutOrganization/submitGoals`).on('value', (snapshot) => {
        snapshot.forEach((val) => {
          if (val.val().SubmitGoal.myGoalId === event.myGoalId) {
            // console.log(val.key)
            db.ref(`withoutOrganization/submitGoals/${val.key}`)
              .update({
                decline: false,
                submit: false,
                pending: false,
              })
              .then(() => {
                console.log('retry')
                history.push('/goals-status')
              })
              .catch((err) => {
                console.log(err)
                alert('connection failed please try again')
              })
          }
        })
      })
    }
  }

  // withdra pending goals

  const handleWithDraw = (event) => {
    // if (!filterFormSelectedGoal.length) {
    let balance = ''
    db.ref(
      `organizations/${selector.goalReducer.currentUser.orgId}/users/${selector.userReducer.currentUserOrgId}`,
    ).on('value', (snapshot) => {
      let userData = snapshot.val()
      let userBalancedb = userData.balance
      balance = userBalancedb
    })

    if (selector.goalReducer.currentUser.orgId !== '') {
      db.ref(
        `organizations/${selector.goalReducer.currentUser.orgId}/users/${selector.userReducer.currentUserOrgId}`,
      ).update({
        balance: balance + Number(event.reward) +event.userInvestment,
      })

      db.ref(
        `organizations/${selector.goalReducer.currentUser.orgId}/users/${selector.userReducer.currentUserOrgId}/myGoals/${event.myGoalId}`,
      ).update({
        pending: false,
      })
      db.ref(
        `organizations/${selector.goalReducer.currentUser.orgId}/submitGoals`,
      ).on('value', (snapshot) => {
        snapshot.forEach((val) => {
          if (val.val().SubmitGoal.myGoalId === event.myGoalId) {
            // console.log(val.key)
            db.ref(
              `organizations/${selector.goalReducer.currentUser.orgId}/submitGoals/${val.key}`,
            )
              .update({
                pending: false,
              })
              .then(() => {
                console.log('retry')
                history.push('/goals-status')
              })
              .catch((err) => {
                console.log(err)
                alert('connection failed please try again')
              })
          }
        })
      })
    }
    //    set goal if user not enrolled in any org
    else {
      db.ref(
        `organizations/${selector.goalReducer.currentUser.orgId}/users/${selector.userReducer.currentUserOrgId}`,
      ).update({
        balance: Number(balance) + Number(event.reward)+event.userInvestment,
      })
      db.ref(
        `withoutOrganization/users/${selector.userReducer.currentUserOrgId}/myGoals/${event.myGoalId}`,
      ).update({
        pending: true,
      })
      db.ref(`withoutOrganization/submitGoals`).on('value', (snapshot) => {
        snapshot.forEach((val) => {
          if (val.val().SubmitGoal.myGoalId === event.myGoalId) {
            // console.log(val.key)
            db.ref(`withoutOrganization/submitGoals/${val.key}`)
              .update({
                pending: false,
              })
              .then(() => {
                console.log('retry')
                history.push('/goals-status')
              })
              .catch((err) => {
                console.log(err)
                alert('connection failed please try again')
              })
          }
        })
      })
    }
  }

  // // retake pic working
  // let [retakeForm, setRetakeForm] = useState(false)
  // // let [submitGoalKey, setSubmitGoalKey] = useState('')

  // const handleOpenRetakeForm = (event) => {
  //   let filterFormSelectedGoal = selector.userReducer.selectedGoals.filter(
  //     (val) => val.id === event,
  //   )
  //   setMyGoalId(filterFormSelectedGoal[0].myGoalId)
  //   setGoalId(event)
  //   setRetakeForm(true)
  //   // get submit goal key to update submit goal
  //   db.ref(`organizations/${goalReducer.currentUser.orgId}/submitGoals`).on(
  //     'value',
  //     (snap) => {
  //       snap.forEach((sGoal) => {
  //         if (sGoal.val().SubmitGoal.id === event) {
  //           const getSelecGoalKey = sGoal.key
  //           setSubmitGoalKey(getSelecGoalKey)
  //         }
  //         // console.log(sGoal.val(),event);
  //       })
  //     },
  //   )
  // }
  // const handleReSubmitGoal = () => {
  //   // console.log('resubmit',submitGoalKey)
  //   let filterFormSelectedGoal = selector.userReducer.selectedGoals.filter(
  //     (val) => val.id === goalId,
  //   )
  //   setLoading(true)
  //   let myGoalObject = {
  //     submit: true,
  //     approved: false,
  //     decline: false,
  //     submitDate: new Date().toLocaleString(),
  //     hasStarted: false,
  //     isReport: false,
  //     acceptReport: false,
  //     pending: false,
  //   }
  //   // if (filterFormSelectedGoal[0].acceptReport) {
  //   //   // console.log('true',filterFormSelectedGoal,submitGoalKey)
  //   //   if (local) {
  //   //     createStorageRef()
  //   //       .then(() => {
  //   //         // download img from storage
  //   //         downLoad()
  //   //           .then((url) => {
  //   //             // then set submit goals in database
  //   //             if (goalReducer.currentUser.orgId !== "") {
  //   //               // user side update mygoals
  //   //               db.ref(
  //   //                 `organizations/${goalReducer.currentUser.orgId}/users/${userReducer.currentUserOrgId}/myGoals/${myGoalId}`
  //   //               ).update(myGoalObject);
  //   //               db.ref(
  //   //                 `organizations/${goalReducer.currentUser.orgId}/submitGoals/${submitGoalKey}`
  //   //               )
  //   //                 .update({
  //   //                   uploadImgUlr: url,
  //   //                   approved: false,
  //   //                   decline: false,
  //   //                   submit: true,
  //   //                   hasStarted: false,
  //   //                   submitDate: new Date().toLocaleString(),
  //   //                   isReport: false,
  //   //                   acceptReport: false,
  //   //                   pending: false,
  //   //                 })
  //   //                 .then(() => {
  //   //                   setImgurl("");
  //   //                   setImgName("");
  //   //                   setLocal("");
  //   //                   setShowPopup(true);
  //   //                   setLoading(false);
  //   //                   console.log("submitted");
  //   //                   handleClose();
  //   //                 })
  //   //                 .catch((err) => {
  //   //                   console.log(err);
  //   //                   setLoading(false);

  //   //                   alert("connectionn failed try again");
  //   //                 });
  //   //             }
  //   //             // set insise organization
  //   //             //    set submit goal if user not enrolled in any org
  //   //             else {
  //   //               db.ref(
  //   //                 `withoutOrganization/users/${userReducer.currentUserOrgId}/myGoals/${myGoalId}`
  //   //               )
  //   //                 .update(myGoalObject)
  //   //                 .then(() => {
  //   //                   setImgurl("");
  //   //                   setImgName("");
  //   //                   setLocal("");
  //   //                   setShowPopup(true);
  //   //                   setLoading(false);
  //   //                   console.log("submitted");
  //   //                   db.ref(`withoutOrganization/submitGoals/${submitGoalKey}`)
  //   //                     .push()
  //   //                     .update({
  //   //                       uploadImgUlr: url,
  //   //                       approved: false,
  //   //                       decline: false,
  //   //                       hasStarted: false,
  //   //                       submit: true,
  //   //                       submitDate: new Date().toLocaleString(),
  //   //                       isReport: false,
  //   //                       acceptReport: false,
  //   //                       pending: false,
  //   //                     });
  //   //                   handleClose();
  //   //                 })
  //   //                 .catch((err) => {
  //   //                   console.log(err);
  //   //                   alert("connection failed try again");
  //   //                   setLoading(false);
  //   //                 });
  //   //             }
  //   //           })
  //   //           // handle error of download img
  //   //           .catch((err) => {
  //   //             console.log(err);
  //   //           });
  //   //       })
  //   //       // handle error of upload img
  //   //       .catch((err) => {
  //   //         console.log(err);
  //   //       });
  //   //   } else {
  //   //     alert("Please select image");
  //   //   }
  //   // }
  // }

  //   alert popup close function
  
  
  const handleClose = () => {
    setShowPopup(false)
    history.push('/selec-goals')
  }

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
      {open ? (
        <FormDialog
          fileInput
          open={open}
          handleClose={handleCloseSubmitForm}
          btnValue="Submit Goal"
          handleAddFunction={handleSubmitGoal}
          handleInputvalue={handleSelectImg}
          imgUrl={imgUrl}
          loading={loading}
        />
      ) : null}
      <MenuAppBar />
      <div className="userGoalDetail_md">
        <div className="mobViewHead mobViewFlat">
          <div className="mobViewHeadContent">
            <div className="mobHeadBack">
              <button
                onClick={() => history.goBack()}
                className="mobHeadBack_link"
              >
                <ArrowBackIosIcon />
              </button>
            </div>
            <h2>TRYVE</h2>
            <div className="headChatIcon">
              <TextsmsOutlinedIcon />
            </div>
          </div>
        </div>
          <div className="userGoal_detail_d">
            {goalDetail.length ? (
              goalDetail.map((val) => {
                const endDate = new Date(val.GoalStartDate)
                var myEndDate = new Date(endDate)
                myEndDate
                  .setDate(
                    myEndDate.getDate() + Number(val.inputValues.numberOfDays),
                  )
                  .toLocaleString()
                return (
                  <div className="userGoalDetail_content2" key={val.id}>
                    <div className="detailVerifyLeftContent">
                      <button
                        onClick={() => history.goBack()}
                        className="Verifyback_link"
                      >
                        <ArrowBackIcon />
                      </button>
                      <img src={val.url} alt="..." />
                      {val.decline || val.pending ? null : (
                        <button
                          className="start_goal_btn"
                          onClick={
                            // !val.acceptReport
                            // ?
                            () => handleOpenForm(val.id)
                            // : () => handleOpenRetakeForm(val.id)
                          }
                          disabled={val.submit}
                        >
                          {val.submit && !val.approved && !val.decline
                            ? ' Submitted'
                            : (val.submit &&
                                val.approved &&
                                val.percentage === '100' &&
                                !val.pending) ||
                              (val.submit &&
                                val.approved &&
                                val.percentage !== '100' &&
                                !val.pending)
                            ? ' Approved'
                            : val.submit &&
                              val.approved &&
                              val.percentage !== '100' &&
                              val.pending
                            ? ' Pending '
                            : val.decline === true &&
                              val.submit &&
                              !val.approved
                            ? ' decline '
                            : ' Take verification photo '}
                        </button>
                      )}
                      {val.decline ? (
                        <button
                          className="start_goal_btn"
                          onClick={() => handleRetryGoal(val)}
                        >
                          Retry
                        </button>
                      ) : null}
                      {val.pending ? (
                        <div className="withdrawBtns">
                          <button
                            className="start_goal_btn"
                            onClick={() => handleWithDraw(val)}
                          >
                            Withdraw
                          </button>
                          <button
                            className="start_goal_btn"
                            onClick={() => handleRetryGoal(val)}
                          >
                            Retry
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <div className="detailRight_contentVerify">
                      <div className="detail_list">
                        <ul className="detailGoal_ul">
                          <li className="borderBtm">
                            <h5 className="db_bold_head">Goal : </h5>
                            <p className="detail_db">
                              {val.inputValues.eventName}
                            </p>
                          </li>
                          <div className="moreInfoGoal">
                            <li className="goals">
                              {val.approved && !val.pending && val.submit ? (
                                <>
                                  <p>Success : {val.percentage}%</p>
                                  <p>Reward : {val.reward}</p>
                                </>
                              ) : (
                                <>
                                  <p>
                                    Start : {val.GoalStartDate.slice(0, 10)}{' '}
                                  </p>
                                  <p>
                                    End :{' '}
                                    {myEndDate.toLocaleString().slice(0, 10)}
                                  </p>
                                </>
                              )}
                            </li>
                            <li>
                              <p>Category : </p>
                              <p className="detail_db">
                                {val.inputValues.category}
                              </p>
                            </li>
                            <li>
                              <p>Difficulty : </p>
                              <p className="detail_db">
                                {val.inputValues.dificulty}
                              </p>
                            </li>
                          </div>
                          <li className="db_bold_head2">
                            <h5 className="db_bold_head">Description : </h5>
                            <p className="detail_db">
                              {val.inputValues.description}
                            </p>
                          </li>
                        </ul>
                        {!val.submit ? (
                          <div className="timeLeftCounter borderBtm">
                            <h5>Time Left:</h5>
                            <p>
                              {Object.keys(timeLeft).length !== 0
                                ? `${timeLeft.days} days ${timeLeft.hours} hours `
                                : 'time end'}
                            </p>
                          </div>
                        ) : (
                          <p>
                            {val.submit && !val.approved && !val.decline
                              ? ' Submitted'
                              : (val.submit &&
                                  val.approved &&
                                  val.percentage === '100' &&
                                  !val.pending) ||
                                (val.submit &&
                                  val.approved &&
                                  val.percentage !== '100' &&
                                  !val.pending)
                              ? ' Approved'
                              : val.submit &&
                                val.approved &&
                                val.percentage !== '100' &&
                                val.pending
                              ? ' Pending '
                              : val.decline === true &&
                                val.submit &&
                                !val.approved
                              ? ' decline '
                              : ' NeedSubmmision '}
                          </p>
                        )}
                      </div>
                      <div className="goalMob_btn">
                        <button
                          className="start_goal_btn"
                          onClick={() => handleOpenForm(val.id)}
                          disabled={val.submit}
                        >
                          {val.submit && !val.approved && !val.decline
                            ? ' Submitted'
                            : (val.submit &&
                                val.approved &&
                                val.percentage === '100' &&
                                !val.pending) ||
                              (val.submit &&
                                val.approved &&
                                val.percentage !== '100' &&
                                !val.pending)
                            ? ' Approved'
                            : val.submit &&
                              val.approved &&
                              val.percentage !== '100' &&
                              val.pending
                            ? ' Pending '
                            : val.decline === true &&
                              val.submit &&
                              !val.approved
                            ? ' decline '
                            : ' Take verification photo '}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div onClick={() => history.goBack()} className="goBack">
                {' '}
                Go back and select product...{' '}
              </div>
            )}
          </div>
      </div>
    </div>
  )
}

export default StartGoalDetailPage
