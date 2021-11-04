import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
// import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import clsx from 'clsx'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import CameraAltIcon from '@material-ui/icons/CameraAlt'
import HomeIcon from '@material-ui/icons/Home'
import AppsIcon from '@material-ui/icons/Apps'
import PersonIcon from '@material-ui/icons/Person'
import SearchIcon from '@material-ui/icons/Search'
import ViewListIcon from '@material-ui/icons/ViewList'
import firebase from '../Config/FirebaseConfig'
import { NavLink, useHistory } from 'react-router-dom'
import { userlogOut, setCurrentUser } from '../GlobalState/CreateSlice'
import {
  setAllSelectedGoals,
  setCurrentUserOrganizationId,
  setAllDeclineGoals,
  setAllApprovedGoals,
  setPendingGoals,
  setAllGoals,
} from '../GlobalState/UserSideSlice'
// import { setAllSelectedGoals, setAllGoals } from '../GlobalState/UserSideSlice'
import { useDispatch, useSelector } from 'react-redux'
import logo from '../Assets/logo.png'

import './style.css'
import { getAllUserOfOrg } from '../Pages/UserSide/Profile/Profile'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontWeight:'bold'
  },
  list: {
    width: 250,
    zIndex: 999999999,
  },
  fullList: {
    width: 'auto',
  },
}))

export default function MenuAppBar() {
  const classes = useStyles()
  const auth = firebase.auth()
  const db = firebase.database()
  const history = useHistory()
  const dispatch = useDispatch()
  //   const [auth, setAuth] = React.useState(true);

  //   const handleChange = (event) => {
  //     setAuth(event.target.checked);
  //   };

  const userInfo = useSelector((state) => {
    return state.goalReducer.currentUser
  })
  const balance = useSelector((state) => {
    return state.userReducer.currentUserOfOrganization
  })
  // console.log(balance)
  //  get all users
  useEffect(() => {
    if (userInfo.orgId !== '') {
      //   get current user from organization
      getAllUserOfOrg(
        `organizations/${userInfo.orgId}/users`,
        dispatch,
        userInfo,
      )
    } else {
      //   get current user from without organization
      getAllUserOfOrg(`withoutOrganization/users`, dispatch, userInfo)
    }
  }, [])

  const userDetail = useSelector((state) => {
    return state
  })
  const { goalReducer } = userDetail
  const getSelectedGoalsOfUser = async (parameter) => {
    db.ref(parameter).on('value', (snapshot) => {
      var goalsArray = []
      var declineArray = []
      var approveArray = []
      var pendingArray = []
      snapshot.forEach((goals) => {
        let getGoals = goals.val()
        // console.log(getGoals)
        let getGoalsId = goals.key
        let getMyGoal = getGoals.myGoals
        let {
          percantage,
          reward,
          submit,
          approved,
          decline,
          hasStarted,
          GoalStartDate,
          pending,
          isReport,
          acceptReport,
          userInvestment
        } = getGoals
        getMyGoal.myGoalId = getGoalsId
        getMyGoal.submit = submit
        getMyGoal.hasStarted = hasStarted
        getMyGoal.GoalStartDate = GoalStartDate
        getMyGoal.approved = approved
        getMyGoal.decline = decline
        getMyGoal.isReport= isReport
        getMyGoal.acceptReport = acceptReport
        getMyGoal.userInvestment = Number(userInvestment)
        // if (reward && percantage && pending !== undefined) {
          getMyGoal.percentage = percantage
          getMyGoal.reward = reward
          getMyGoal.pending = pending
        // }
        // if (!goals.val().submit) {
        goalsArray.push(getMyGoal)
        // }
        if (
          (goals.val().submit &&
            goals.val().approved &&
            goals.val().percantage === '100' &&
            !goals.val().pending) ||
          (goals.val().submit &&
            goals.val().approved &&
            goals.val().percentage !== '100' &&
            !goals.val().pending)
        ) {
          approveArray.push(getMyGoal)
        } else if (goals.val().decline) {
          declineArray.push(getMyGoal)
        } else if (
          goals.val().approved &&
          goals.val().percantage !== '100' &&
          goals.val().pending
        ) {
          pendingArray.push(getMyGoal)
        }
      })

      dispatch(setAllDeclineGoals(declineArray))
      dispatch(setAllApprovedGoals(approveArray))
      dispatch(setAllSelectedGoals(goalsArray))
      dispatch(setPendingGoals(pendingArray))
    })
  }

  useEffect(() => {
    // condition for  if user enrolled in any organization
    if (goalReducer.currentUser.orgId !== '') {
      //   get users selected goals
      db.ref(`organizations/${goalReducer.currentUser.orgId}/users`).on(
        'value',
        (snapshot) => {
          var UsersArray = []
          snapshot.forEach((goals) => {
            let getUsers = goals.val()
            // console.log('99',getUsers)
            let getUserId = goals.key
            getUsers.orgMainId = getUserId
            UsersArray.push(getUsers)
          })
          UsersArray.filter(val =>  {
            if (val.email === goalReducer.currentUser.email) {
               dispatch(setCurrentUserOrganizationId(val.orgMainId))
               getSelectedGoalsOfUser(
                `organizations/${userDetail.goalReducer.currentUser.orgId}/users/${val.orgMainId}/myGoals`,
              )
            }
          })
        },
      )
    } else {
      // condition for  if user not enrolled in any organization
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
              dispatch(setCurrentUserOrganizationId(val.orgMainId))
              // get seletec goal
              getSelectedGoalsOfUser(
                `withoutOrganization/users/${val.orgMainId}/myGoals`,
              )
            }
          })
        },
      )
    }
  }, [])

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(userlogOut(false))
        dispatch(setCurrentUser({}))
        dispatch(setAllGoals([]))
        dispatch(setAllSelectedGoals([]))
        dispatch(setCurrentUserOrganizationId(''))
        history.push('/login')
      })
      .catch((err) => {})
  }

  const [state, setState] = React.useState({
    left: false,
  })

  const toggleDrawer = (anchor, open) => (event) => {
    // console.log(anchor)
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {/* <List>

      </List> */}
      {/* <Divider /> */}
      <List>
              <img className="ulogo" src={logo} alt="..." />

        {goalReducer.currentUser.admin ? (
          <NavLink to={`/organizations`} className="sidebar_links" activeClassName='uDeskActive'>
            <HomeIcon className='sdIcon' />
            {!open ? <p>Organizations</p> : null}
          </NavLink>
        ) : null}
        <NavLink className="sidebar_links" to="/selec-goals" activeClassName='uDeskActive'>
          <HomeIcon className='sdIcon' /> <p> Home </p>
        </NavLink>
        <NavLink className="sidebar_links" to="/search-goals" activeClassName='uDeskActive'>
          <SearchIcon className='sdIcon' />
          <p> Search Goals </p>
        </NavLink>
        <NavLink className="sidebar_links" to="/goals-status" activeClassName='uDeskActive'>
          <CameraAltIcon className='sdIcon' /> <p> Verify </p>
        </NavLink>
        <NavLink className="sidebar_links" to="/feed" activeClassName='uDeskActive'>
          <AppsIcon className='sdIcon' /> <p>Feed </p>
        </NavLink>

        <NavLink className="sidebar_links" to="/profile" activeClassName='uDeskActive'>
          <PersonIcon className='sdIcon' /> <p> Profile </p>
        </NavLink>
      </List>
    </div>
  )
  // console.log(balance)

  return (
    <React.Fragment>
      <div className={`desktopView_sidebar ${classes.root}`}>
        <AppBar position="static">
          <Toolbar>
            <div>
              {['left'].map((anchor) => (
                <React.Fragment key={anchor}>
                  <Button onClick={toggleDrawer(anchor, true)}>
                    {/* {anchor} */}
                    <ViewListIcon className="bar_icon" />
                  </Button>
                  <SwipeableDrawer
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                    onOpen={toggleDrawer(anchor, true)}
                  >
                    {list(anchor)}
                  </SwipeableDrawer>
                </React.Fragment>
              ))}
            </div>

            <Typography variant="h6" className={classes.title}>
              TRYVE
              {/* <img className="logo" src={logo} alt="..." /> */}
              
            </Typography>

            {auth && (
              <div className="authMain">
                { balance.length?
                balance[0].balance>0?
                <div className="balance">

                  <p>Balance : {balance.length ? balance[0].balance : '0'}</p>
                </div>
                : null
               : null }
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  {userInfo.url ? (
                    <>
                      {/* <span>{userInfo.name}</span> */}
                      <img
                        className="userProfile"
                        src={userInfo.url}
                        alt="..."
                      />
                    </>
                  ) : (
                    <AccountCircle />
                  )}
                  <ExpandMoreIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={() => 
                    handleClose()
                  }
                  className="cus_menu"
                >
                  <MenuItem onClick={() => {
                      handleClose();
                      history.push("/profile");
                    }}>
                    <AccountCircleIcon /> <p> Profile</p>
                  </MenuItem>
                  {/* <MenuItem
                    onClick={() => {
                      handleClose();
                      history.push("/profile");
                    }}
                  >
                    <AccountCircleIcon /> <p> All Goals</p>
                  </MenuItem> */}
                  <MenuItem onClick={handleLogout}>
                    <ExitToAppIcon /> <p> Logout</p>
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>

      {/* mobile view bottom navigation  */}
      <div className="mobileView_bottom_navigat">
        <div className="bottm_navigation">
          <NavLink
            className="sidebar_links_bt"
            activeClassName="active_link"
            to="/selec-goals"
          >
            <HomeIcon /> <p> Home </p>
          </NavLink>
          <NavLink
            className="sidebar_links_bt"
            activeClassName="active_link"
            to="/search-goals"
          >
            <SearchIcon />
            <p> search </p>
          </NavLink>

          <NavLink
            className="sidebar_links_bt"
            activeClassName="active_link"
            to="/goals-status"
          >
            <CameraAltIcon /> <p> Verify </p>
          </NavLink>

          <NavLink
            className="sidebar_links_bt"
            activeClassName="active_link"
            to="/feed"
          >
            <AppsIcon /> <p> Feed </p>
          </NavLink>
          <NavLink
            className="sidebar_links_bt"
            activeClassName="active_link"
            to="/profile"
          >
            <PersonIcon /> <p> Profile </p>
          </NavLink>
          {/* <MenuItem className='logout_link' onClick={handleLogout}>
            <ExitToAppIcon />
            <p> Logout</p>
          </MenuItem> */}
        </div>
      </div>
    </React.Fragment>
  )
}
