import React, { useState } from 'react'
import SignupForm from '../../Components/SignupForm'
import firebase from '../../Config/FirebaseConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'
import AlertDialog from '../../Components/AlertPopup'

const Signup = () => {
  const [loading, setLoading] = useState(false)
  let [showAlert, setShowAlert] = useState(false)
  let auth = firebase.auth()
  let database = firebase.database()


  const formik = useFormik({
    initialValues: {
      name: '',
      number: '',
      email: '',
      password: '',
      confirmPassword: '',
      organizationName: '',
    },
    onSubmit: (values) => {
      setLoading(true)
      // organizations database ref

      let orgDbRef = database.ref(`organizations`)
      let orgId = ''
      let enterTrueCode = false
      // check user organization to set in perticular organization
      orgDbRef.on('value', (snapshot) => {
        snapshot.forEach((val) => {
          let getOrgData = val.val()
          if (
            getOrgData.orgName.toLowerCase() ===
            values.organizationName.toLowerCase()
          ) {
            orgId = val.key
            enterTrueCode = true
          }
        })
      })
      // }
      let orgUserDbRef = database.ref(`organizations/${orgId}/users`)
      let withoutOrgUsers = database.ref(`withoutOrganization/users`)
      auth
        .createUserWithEmailAndPassword(values.email, values.password)
        .then((res) => {
          const { uid, email } = res.user
          const dbRef = database.ref('users/' + uid)
          const newUsers = dbRef.push()
          // then set data of users in database
          let userData = {
            name: values.name,
            number: values.number,
            email,
            password: values.password,
            createdAt: new Date().toLocaleString(),
            admin: false,
            id: uid,
            // url,
            orgId,
            orgName: values.organizationName,
            balance: 0,
          }
          // all users set
          newUsers.set(userData)
          // set user in selected organization
          if (!enterTrueCode) {
            withoutOrgUsers
              .push()
              .set(userData)
              .then(() => {
                setLoading(false)
              })
              .catch(() => {
                setLoading(false)
              })
          } else {
            orgUserDbRef
              .push()
              .set(userData)
              .then(() => {
                setLoading(false)
                setLoading(false)
              })
              .catch(() => {
                setLoading(false)
              })
          }
        })
        .catch(() => {
          setShowAlert(true)
        })
        // handle error of download img
        .catch((err) => {
          console.log(err)
        })
    },
    validationSchema: yup.object().shape({
      email: yup.string().email('Invalid Email').required('Email is required'),

      password: yup
        .string()
        .min(6, 'password is too Short!')
        .max(20, 'password is too Long!')
        .required('password is required'),

      confirmPassword: yup
        .string()
        .test('passwords-match', 'Passwords must match', function (value) {
          return this.parent.password === value
        }),
    }),
  })
  const handleClosePopup = () => {
    setShowAlert(false)
  }
  return (
    <div>
      {showAlert ? (
        <AlertDialog
          handleClose={handleClosePopup}
          open={showAlert}
          value="Email address already exists!"
          btnValue="OK"
        />
      ) : null}
      <SignupForm
        loading={loading}
        formik={formik}
      />
    </div>
  )
}

export default Signup
