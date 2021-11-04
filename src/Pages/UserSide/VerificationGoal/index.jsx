import React from 'react'
import { useSelector } from 'react-redux'
import firebase from '../../../Config/FirebaseConfig'
import { useEffect } from 'react'
import { useState } from 'react'
import './style.css'
import { Link, useHistory } from 'react-router-dom'
import StarIcon from '@material-ui/icons/Star'

const VerificationPage = () => {
  const db = firebase.database()
  const history = useHistory()
  const selector = useSelector((state) => {
    return state
  })

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

  const handleDetailPage = (event) => {
    // console.log(event);
    history.push(`/mygoal-detail/${event.id}`)
  }

  return (
    <div>
      <div className="verification_container">
        <div className="verificationMain">
          {category.map((val) => (
            <div key={val.CategoryId}>
              <h3 className="category_head">{val.category}</h3>
              <div className="verifyGoal_md">
                {selector.userReducer.selectedGoals.map((goal, i) => {
                  return (
                    <div
                      className="verifyGoals"
                      style={
                        goal.inputValues.category !== val.category 
                          ? { display: 'none' }
                          : null
                      }
                      key={goal.myGoalId}
                    >
                      {goal.inputValues.category === val.category ? (
                        <div
                          className="goalsCard"
                          onClick={() => handleDetailPage(goal)}
                        >
                          <p className="isVerify">
                            Recruiting Expires D-2
                          </p>
                          <img
                            className="verifyGoalImg"
                            src={goal.url}
                            alt=""
                          />
                          <div className="card_bd">
                            <p className="eventName">
                              {goal.inputValues.eventName}
                            </p>
                            <div className="ratings">
                              <div>
                                {' '}
                                <StarIcon className="starIcon" /> <p> 4.94 </p>{' '}
                              </div>
                              <p className="joined">
                                Currently {goal.peopleJoined} Signed Up{' '}
                              </p>
                            </div>
                            <div className="goalCounter">
                              <p className="goalLimitDate">
                                {goal.GoalStartDate}
                              </p>
                              <p className="goalWeek">2w</p>
                              <p className="goalWeek">2d</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        
                        <div>
                          <Link to='/search-goals'>search goals</Link>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VerificationPage
