import React from "react";

const SubmitGoalsCard = ({ data }) => {
  // console.log(data);
  return (
    <div className="submitCard_container">
      <div className="submitCard_md">
        {data &&
          data.map((val) => (
            <div className="submitCard" key={val.SubmitGoalId}>
              <div className="submit_head">
                {val.approved ? (
                  <p>Approved</p>
                ) : val.decline ? (
                  <p>Decline</p>
                ) : (
                  <p>Pending</p>
                )}
              </div>
              <div className="submit_card_img">
                <img src={val.SubmitGoal.url} alt="..." />
              </div>
              <div className="submit_Card_body">
                <h5>{val.SubmitGoal.inputValues.eventName}</h5>
                <p>{val.SubmitGoal.inputValues.description}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SubmitGoalsCard;
