import React from 'react'
import { useHistory, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useState } from 'react'
import MenuAppBar from '../../../Layout/Navbar'
import firebase from '../../../Config/FirebaseConfig'
import SmsIcon from '@material-ui/icons/Sms'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { Link } from 'react-router-dom'

const StatusDetailPage = () => {
  const db = firebase.database()
  const { id } = useParams()
  const history = useHistory()
  const [goalDetail, setGoalDetail] = useState([])
  const [ setShowPopup] = useState(false)
  const selector = useSelector((state) => {
    return state
  })
  // console.log(selector)
  useEffect(() => {
    const filterSelectedGoal = selector.userReducer.selectedGoals.filter(
      (val) => val.myGoalId === id,
    )
    setGoalDetail(filterSelectedGoal)
  }, [])

  const handleWithDraw = (event) => {
    // if (!filterFormSelectedGoal.length) {
    let balance = ''
    db.ref(
      `organizations/${selector.goalReducer.currentUser.orgId}/users/${selector.userReducer.currentUserOrgId}`,
    ).on('value', (snapshot) => {
      let userData = snapshot.val()
      let userBalancedb = userData.balance
      balance = userBalancedb
      // console.log('user',userBalancedb)
      // setUserBalance(userBalancedb);
    })
    // console.log(balance);

    if (selector.goalReducer.currentUser.orgId !== '') {
      db.ref(
        `organizations/${selector.goalReducer.currentUser.orgId}/users/${selector.userReducer.currentUserOrgId}`,
      ).update({
        balance: balance + Number(event.reward),
      })

      db.ref(
        `organizations/${selector.goalReducer.currentUser.orgId}/users/${selector.userReducer.currentUserOrgId}/myGoals/${event.myGoalId}`,
      )
        .update({
          pending: false,
        })
        .then(() => {
          console.log('selected')
          setShowPopup(true)
          history.push('/verify-goals')
        })
        .catch((err) => {
          console.log(err)
          alert('connection failed please try again')
        })
    }
    //    set goal if user not enrolled in any org
    else {
      db.ref(
        `organizations/${selector.goalReducer.currentUser.orgId}/users/${selector.userReducer.currentUserOrgId}`,
      ).update({
        balance: Number(balance) + Number(event.reward),
      })
      db.ref(
        `withoutOrganization/users/${selector.userReducer.currentUserOrgId}/myGoals/${event.myGoalId}`,
      )
        .update({
          pending: true,
        })
        .then(() => {
          console.log('selected')
          history.push('/verify-goals')
          setShowPopup(true)
        })
        .catch((err) => {
          console.log(err)
          alert('connection failed please try again')
        })
    }
  }

  const handleRetryGoal = (event) => {
    // console.log(event)
    if (selector.goalReducer.currentUser.orgId !== '') {
      db.ref(
        `organizations/${selector.goalReducer.currentUser.orgId}/users/${selector.userReducer.currentUserOrgId}/myGoals/${event.myGoalId}`,
      )
        .update({
          decline: false,
          submit: false,
        })
        .then(() => {
          console.log('retry')
          history.push('/verify-goals')
        })
        .catch((err) => {
          console.log(err)
          alert('connection failed please try again')
        })
    }
    //    set goal if user not enrolled in any org
    else {
      db.ref(
        `withoutOrganization/users/${selector.userReducer.currentUserOrgId}/myGoals/${event.myGoalId}`,
      )
        .update({
          decline: false,
          submit: false,
        })
        .then(() => {
          history.push('/verify-goals')
          console.log('retry')
        })
        .catch((err) => {
          console.log(err)
          alert('connection failed please try again')
        })
    }
  }

  return (
    <div className="userGoalDetail_container">
      <div className="userGoalDetail_md">
        <MenuAppBar />
        <div className="mobViewHead">
          <div className="mobViewHeadContent">
            <h2>TRYVE</h2>
            <div className="headChatIcon">
              <SmsIcon />
            </div>
          </div>
        </div>
        <div className="userGoal_detail_d">
          {goalDetail &&
            goalDetail.map((val) => (
              <div className="userGoalDetail_content" key={val.id}>
                <div className="detailLeftContent">
                  <Link to="/goals-status" className="back_link">
                    <ArrowBackIcon />
                  </Link>

                  <img src={val.url} alt="..." />
                  {val.percentage !== '100' && val.pending ? (
                    <>
                      <button
                        className="start_goal_btn"
                        onClick={() => handleWithDraw(val)}
                      >
                        withdraw
                      </button>
                    </>
                  ) : null}
                  {val.decline || val.pending ? (
                    <>
                      <button
                        className="start_goal_btn"
                        onClick={() => handleRetryGoal(val)}
                      >
                        Retry
                      </button>
                    </>
                  ) : null}
                </div>
                <div className="detailRight_content">
                  <div className="detail_list">
                    <ul className="detailGoal_ul">
                      <li className="goal_name_dp">
                        <h5 className="db_red_head">Goal:</h5>
                        <p className="detail_db">{val.inputValues.eventName}</p>
                      </li>
                      <li>
                        <p>Total Time:</p>
                        <p className="detail_db">
                          {val.inputValues.numberOfDays}
                        </p>
                      </li>
                      <li>
                        <p>Category:</p>
                        <p className="detail_db">{val.inputValues.category}</p>
                      </li>
                      <li className="">
                        <p>Start date:</p>
                        <p className="">{val.inputValues.startDate}</p>
                      </li>
                      <li className="">
                        <p>End date:</p>
                        <p className="">{val.inputValues.endDate}</p>
                      </li>
                      <li className="">
                        <p>Reward Max:</p>
                        <p className="">{val.inputValues.rewardMax}</p>
                      </li>
                      <li className="">
                        <p>Reward Min:</p>
                        <p className="">{val.inputValues.rewardMin}</p>
                      </li>
                      <li className="">
                        <p>Difficulty:</p>
                        <p className="detail_db">{val.inputValues.dificulty}</p>
                      </li>
                      <li className="">
                        <p>Invest Max:</p>
                        <p className="">{val.inputValues.investMax}</p>
                      </li>
                      <li className="goal_diff_dp">
                        <p>Invest Min:</p>
                        <p className="detail_db">{val.inputValues.investMin}</p>
                      </li>
                      <li className="mob_desc_dp">
                        <h5 className="db_red_head">Description:</h5>
                        <p className="detail_db">
                          {val.inputValues.description}
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="goalMob_btn">
                    {val.percentage !== '100' && !val.decline ? (
                      <>
                        <button
                          className="start_goal_btn"
                          onClick={() => handleWithDraw(val)}
                        >
                          withdraw
                        </button>
                        <button
                          className="start_goal_btn"
                          onClick={() => handleRetryGoal(val)}
                        >
                          Retry
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default StatusDetailPage
