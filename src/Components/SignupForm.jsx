import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../Assets/logo.png'
// import { useSelector } from 'react-redux'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid'

const SignupForm = ({ formik, loading }) => {
  
  let [showpass, setShowPass] = useState(true)
  let [showConfirmpass, setshowConfirmpass] = useState(true)

  const showPassword = () => {
    setShowPass(!showpass)
  }
  const showConfirmPassword = () => {
    setshowConfirmpass(!showConfirmpass)
  }

  return (
    <div className="signup_container">
      <div className="login_md">
        <img className="mobViewLogo" src={logo} alt="..." />

        <div className="login_content">
          <div>
            <img src={logo} alt="..." />
            <h1>Sign Up</h1>
          </div>
          <form onSubmit={formik.handleSubmit} className="login_form">
            <div>
              <p className="emailAdd">Name</p>
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
                <PermIdentityIcon className="seeHidePass" />
              </div>
            </div>
            <div>
              <p className="emailAdd">Mobile Number</p>
              <div>
                <input
                  type="number"
                  id="number"
                  name="number"
                  value={formik.values.number}
                  onChange={formik.handleChange}
                />
                <PhoneAndroidIcon className="seeHidePass" />
              </div>
            </div>
            <div>
              <p className="emailAdd">Email ID</p>
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                <MailOutlineIcon className="seeHidePass" />
              </div>
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="error_msg">{formik.errors.email}</div>
            ) : null}
            <div>
              <p className="emailAdd">Password*</p>
              <div>
                <input
                  type={showpass?"password":'text'}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                {showpass ? (
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
            {formik.touched.password && formik.errors.password ? (
              <div className="error_msg">{formik.errors.password}</div>
            ) : null}

            <div>
              <p className="emailAdd">Confirm password*</p>
              <div>
                <input
                  type={showConfirmpass?"password": 'text'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                />
                {showConfirmpass ? (
                  <VisibilityOffIcon
                    onClick={showConfirmPassword}
                    className="seeHidePass"
                  />
                ) : (
                  <VisibilityIcon
                    onClick={showConfirmPassword}
                    className="seeHidePass"
                  />
                )}
              </div>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="error_msg">{formik.errors.confirmPassword}</div>
            ) : null}
            <div className="selectOrg">
            <p className="emailAdd">Organization name (optional)</p>
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                onChange={formik.handleChange}
              />
            </div>
            {formik.touched.organizationName &&
            formik.errors.organizationName ? (
              <div className="error_msg">{formik.errors.organizationName}</div>
            ) : null}
            <button type="submit">{loading ? 'loading...' : 'Register Now'} </button>
          </form>
          <div className="or_link">
            <span>if you have an account</span>
            <Link className="link" to="/login">
              Login Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupForm
