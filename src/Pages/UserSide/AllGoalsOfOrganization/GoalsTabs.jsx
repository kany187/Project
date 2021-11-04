import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import { useSelector } from 'react-redux'
import firebase from '../../../Config/FirebaseConfig'
import { useEffect } from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {/* <Typography>{children}</Typography> */}
          {children}
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}



export default function GoalsTabs() {
  const history = useHistory()
  const db = firebase.database()


  const selector = useSelector((state) => {
    return state
  })
  const { userReducer } = selector

  // go to goal detail page
  const handleDetailPage = (event) => {
    // console.log(event)
    history.push(`/goal-detail/${event.id}`)
  }
  const handleDetailPageMyGoal = (event) => {
    // console.log(event)

    history.push(`/mygoal-detail/${event.id}`)
  }

  // get cateogires
  let [category, setCategory] = useState([])
  const getCategories = (parameter) => {
    db.ref(parameter).on('value', (snapshot) => {
      let categoryArray = []
      snapshot.forEach((data) => {
        const resData = data.val()
        const resKey = data.key
        resData.CategoryId = resKey
        categoryArray.push(resData)
      })
      setCategory(categoryArray)
    })
  }
  useEffect(() => {
    if (selector.goalReducer.currentUser.orgId !== '') {
      getCategories(
        `organizations/${selector.goalReducer.currentUser.orgId}/categories`,
      )
    } else {
      getCategories(`withoutOrganization/categories`)
    }
    return () => {
      setCategory([])
    }
  }, [])


  // console.log(userReducer)
  return (
    <div className="allGoals_Cards">
      <div className="allGoals_cLinks myListHead">
        <h3 className="category_head sCategoryHead">My List</h3>
        <Link to="/selec-goals" className="b_link">
          See All
        </Link>
      </div>
      <div className="cUserGoals sGoal_md">
        {userReducer.selectedGoals.slice(0, 3).map((val, k) => {
          return (
            <div className="cUserG" key={k}>
              <div
                className="goalsImg"
                onClick={() => handleDetailPageMyGoal(val)}
              >
                <img src={val.url} alt="..." />
              </div>
            </div>
          )
        })}
      </div>
      {category.map((val) => (
        <div key={val.CategoryId}>
          <div className="allGoals_cLinks">
            <h3 className="category_head sCategoryHead">{val.category}</h3>
            <Link to="/search-goals"  className="b_link">
              See All
            </Link>
          </div>
          <div className="sGoal_md">
            {userReducer.allGoalsOfOrg.map((goal, i) => {
              return (
                <div
                  className="verifyGoals"
                  style={
                    goal.inputValues.category !== val.category &&
                    userReducer.allGoalsOfOrg.length - 1 !== i
                      ? { display: 'none' }
                      : null
                  }
                  key={goal.id}
                >
                  {goal.inputValues.category === val.category ? (
                    <>
                      <div
                        className="goalsImg"
                        onClick={() => handleDetailPage(goal)}
                      >
                        <img src={goal.url} alt="..." />
                      </div>
                    </>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
