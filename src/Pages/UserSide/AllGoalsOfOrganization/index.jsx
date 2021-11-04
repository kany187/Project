import React, { useEffect } from 'react'
import MenuAppBar from '../../../Layout/Navbar'
import { useSelector } from 'react-redux'
import firebase from '../../../Config/FirebaseConfig'
import './style.css'
import GoalsTabs from './GoalsTabs'
import {
  setAllGoals,
  setCurrentUserOrganizationId,
  setAllSubmittedGoals,
} from '../../../GlobalState/UserSideSlice'
import { useDispatch } from 'react-redux'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import TextsmsOutlinedIcon from '@material-ui/icons/TextsmsOutlined'
import { Link } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/Search'

const AllGoalsOfOrganization = () => {
  const db = firebase.database()
  const dispatch = useDispatch()
  // get current user detail
  const userDetail = useSelector((state) => {
    return state
  })
  // console.log(userDetail);
  const { goalReducer } = userDetail

  //  get goals function if user enrolled in  any org or not
  const getGoals = async (parameter) => {
    db.ref(parameter).on('value', (snapshot) => {
      var goalsArray = []
      snapshot.forEach((goals) => {
        let getGoals = goals.val()
        let getGoalsId = goals.key
        getGoals.id = getGoalsId
        goalsArray.push(getGoals)
      })
      dispatch(setAllGoals(goalsArray))
    })
  }

  //  get submitted goals
  const getSubmittedGoalsOfUser = async (parameter) => {
    db.ref(parameter).on('value', (snapshot) => {
      var goalsArray = []
      snapshot.forEach((goals) => {
        let getGoals = goals.val()
        let getGoalsId = goals.key
        if (getGoals.userIdMain === goalReducer.currentUser.id) {
          getGoals.SubmitGoalId = getGoalsId
          goalsArray.push(getGoals)
        }
      })
      dispatch(setAllSubmittedGoals(goalsArray))
    })
  }

  useEffect(() => {
    // condition for  if user enrolled in any organization
    if (goalReducer.currentUser.orgId !== '') {
      // get goals
      getGoals(`organizations/${goalReducer.currentUser.orgId}/goals`)
      //   get users selected goals
      db.ref(`organizations/${goalReducer.currentUser.orgId}/users`).on(
        'value',
        (snapshot) => {
          var UsersArray = []
          snapshot.forEach((goals) => {
            let getUsers = goals.val()
            let getUserId = goals.key
            getUsers.orgMainId = getUserId
            UsersArray.push(getUsers)
          })
          UsersArray.filter((val) => {
            if (val.email === goalReducer.currentUser.email) {
              dispatch(setCurrentUserOrganizationId(val.orgMainId))
              // get submitted goals
              getSubmittedGoalsOfUser(
                `organizations/${userDetail.goalReducer.currentUser.orgId}/submitGoals`,
              )
            }
          })
        },
      )
    } else {
      // condition for  if user not enrolled in any organization
      getGoals(`withoutOrganization/goals`)
      //   get user selected goals
      db.ref(`withoutOrganization/users/${goalReducer.currentUser.orgId}`).on(
        'value',
        (snapshot) => {
          var UsersArray = []
          snapshot.forEach((goals) => {
            let getUsers = goals.val()
            let getUserId = goals.key
            getUsers.orgMainId = getUserId
            UsersArray.push(getUsers)
          })
          UsersArray.filter((val) => {
            if (val.email === goalReducer.currentUser.email) {
              // console.log(val.orgMainId)
              dispatch(setCurrentUserOrganizationId(val.orgMainId))
              // get seletec goal
              // get submitted goal
              getSubmittedGoalsOfUser(`withoutOrganization/submitGoals`)
            }
          })
        },
      )
    }
  }, [])

  return (
    <div className="profile_container">
      <MenuAppBar />
      <div className="mobViewHead">
        <div className="mobViewHeadMain">
          <div className="mobViewHeadContent ">
            <div className="mobHeadBack">
              <Link className="mobHeadBack_link" to="/selec-goals">
                <ArrowBackIosIcon />
              </Link>
            </div>
            <h2>TRYVE</h2>
            <div className="headChatIcon">
              <TextsmsOutlinedIcon />
            </div>
          </div>
          <div className="searchBar_goals">
            <SearchIcon />
            <input type="text" placeholder="Search goals" />
          </div>
          <div className="breadCrumbs">
            <div className="breadCrumbs_link">
              <p>My List / Favorites</p>
              <Link className="white_link" to="">
                See all
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="allGoals_main">
          <GoalsTabs />
      </div>
    </div>
  )
}

export default AllGoalsOfOrganization
