import React, { useEffect, useState } from 'react'
import AppRouter from './Router/Router'
import firebase from 'firebase'
import { useDispatch, useSelector } from 'react-redux'
import { allOrganizations } from './GlobalState/CreateSlice'
import logo from './Assets/logo.png'
import { isLogin, setCurrentUser } from './GlobalState/CreateSlice'
import {setAllUsersWholeApp} from './GlobalState/UserSideSlice'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
// import { send } from 'emailjs-com'
import { init } from 'emailjs-com'
import './App.css'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection:'column',
    position:'relative',
    '& > * + *': {
      marginLeft: '0px',
    },
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

function App() {
  const classes = useStyles()
  const dispatch = useDispatch()
  let auth = firebase.auth()
  let db = firebase.database()
  // loading
  let [loading, setLoading] = useState(true)

  const selector = useSelector((state) => {
    return state
  })
  const { goalReducer } = selector
  // console.log(goalReducer)
  // const checkUserLogin = () => {
  //   setLoading(true)
  // }
  useEffect(() => {
    init('user_y6bbBvCNzLoq9C7FeZYK0')
    setLoading(true)
    auth.onAuthStateChanged((user) => {
      if (user) {
        const dbRef = db.ref('users/' + user.uid)
        dbRef.on('value', (snapshot) => {
          snapshot.forEach((usersData) => {
            const userData = usersData.val()
            const userKey = usersData.key
            userData.pushId = userKey 
            dispatch(setCurrentUser(userData))
          })
          dispatch(isLogin(true))
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })
    db.ref('organizations').on('value', (snapshot) => {
      let organizationsArry = []
      snapshot.forEach((data) => {
        const getData = data.val()
        const getId = data.key
        getData.id = getId
        organizationsArry.push(getData)
      })
      dispatch(allOrganizations(organizationsArry))
    })
    db.ref('users/').on('value',((snapshot)=>{
      const usersArray = []
      snapshot.forEach((users)=>{
        users.forEach((user)=>{
          const allUsers = user.val()
          const allUsersKey = user.key
          allUsers.pushId = allUsersKey
          usersArray.push(allUsers)
        // console.log(user.val(),user.key)
        })
        // console.log(users.val(),users.key)
      })
      dispatch(setAllUsersWholeApp(usersArray))
    }))
    // checkUserLogin();
  }, [])

  if (loading) {
    return (
      <div className='loaderCenter'>
        <div className={classes.root}>
          <img  className='appLogo' src={logo} alt='logo' />
          <br />
          <CircularProgress color="secondary" />
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <AppRouter
        isUser={goalReducer.isUserLogin}
        cUser={goalReducer.currentUser}
      />
    </div>
  )
}

export default App
