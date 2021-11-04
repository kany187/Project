import React from 'react'
import { useHistory } from 'react-router'

const GoalCard = ({ cardData }) => {
  const history = useHistory()

  const handleDetailPage = (event) => {
    history.push(`/mygoal-detail/${event.id}`)
  }

  return (
    <div className="statusGoalCard_main">
      {cardData.map((val) => {
        console.log(val)
        return (
          <div
            className="statusGoalCard"
            key={val.myGoalId}
            onClick={() => handleDetailPage(val)}
          >
            <div className="cardImg">
              <img src={val.url} alt="..." />
            </div>
            <div className="statusGoalCardBody">
              <h4>{val.inputValues.eventName}</h4>
              <p className="descs">
                Description: {val.inputValues.description}
              </p>
              <div className="getRewardMain">
                <p className="percent">
                  {val.percentage ? ` Success Rate : ${val.percentage}%` : null}
                </p>
                <p className="percent">
                  {val.reward ? ` Reward : ${val.reward}` : null}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default GoalCard
