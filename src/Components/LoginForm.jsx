import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
// assets
import logo from '../Assets/logo.png'

const LoginForm = ({ handleChange, handleSubmit, inputsValues, loading }) => {
  let [showpass, setShowPass] = useState(false)
  const showPassword = () => {
    setShowPass(!showpass)
  }

  return (
    <div className="login_contianer">
      <div className="login_md">
      <img className='mobViewLogo' src={logo} alt="..." />

        <div className="login_content">
          <div>
            <img src={logo} alt="..." />
            <h1>Hello</h1>
            <h3>Login In your Account</h3>
          </div>
          <form onSubmit={handleSubmit} className="login_form">
            <div>
              <p className="emailAdd">Email ID</p>
              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={inputsValues.email}
                  onChange={handleChange}
                />
                <MailOutlineIcon className="seeHidePass" />
              </div>
            </div>
            <div>
              <p className="emailAdd">Password*</p>
              <div>
                <input
                  type={showpass ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={inputsValues.password}
                  onChange={handleChange}
                />
                {!showpass ? (
                  <VisibilityOffIcon
                    onClick={showPassword}
                    className="seeHidePass"
                  />
                ) : (
                  <VisibilityIcon
                    onClick={showPassword}
                    className="seeHidePass"
                  />
                )}
              </div>
            </div>
            <button type="submit">{loading ? 'loading...' : 'Login'} </button>
          </form>
          <div className="or_link">
            <span>Don’t have an account? </span>
            <Link className="link" to="/">
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
