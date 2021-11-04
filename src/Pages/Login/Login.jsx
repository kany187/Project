import React, { useState } from 'react'
import AlertDialog from '../../Components/AlertPopup'
import LoginForm from '../../Components/LoginForm'
import firebase from '../../Config/FirebaseConfig'
import './login.css'

const inputFieldValue = {
  email: '',
  password: '',
}

const Login = () => {
  let auth = firebase.auth()
  const [loading, setLoading] = useState(false)
  const [loginInputs, setLoginInputs] = useState(inputFieldValue)
  let [showAlert, setShowAlert] = useState(false)
  const handleChangeLoginInputs = (event) => {
    setLoginInputs({
      ...loginInputs,
      [event.target.name]: event.target.value,
    })
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    setLoading(true)
    let { email, password } = loginInputs
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userLogin) => {
        setLoading(false)
        console.log('user login')
        // history.push("/");
      })
      .catch((error) => {
        setLoading(false)
        setShowAlert(true)
      })
    setLoginInputs(inputFieldValue)
  }

  const handleClosePopup = () => {
    setShowAlert(false)
  }
  return (
    <div>
      {showAlert ? (
        <AlertDialog
          handleClose={handleClosePopup}
          open={showAlert}
          value="Email Or Password Invalid!"
          btnValue="OK"
        />
      ) : null}
      <LoginForm
        handleChange={handleChangeLoginInputs}
        handleSubmit={handleLoginSubmit}
        inputsValues={loginInputs}
        loading={loading}
      />
    </div>
  )
}

export default Login
