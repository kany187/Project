import React from 'react'
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import CustomButton from '../../../../Components/Button/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import './style.css'

const CreateGoals = ({
  handleAddGoals,
  handleInputGoals,
  handleGoalImg,
  inputValues,
  imgUrl,
  loading,
  btnValue,
  handleEmptyImg,
  cross,
  backArrowPathId,
  dbCategory
}) => {


  return (
    <div className="create_goals_box">
      <div className="create_goals_inp">
        <form onSubmit={handleAddGoals}>
          <Link to={backArrowPathId}>
            <ArrowBackIcon />
          </Link>
          <div className="goals_inp">
            <label htmlFor="eventname">
              <p> Event name:</p>
              <input
                type="text"
                required
                onChange={handleInputGoals}
                name="eventName"
                id="eventname"
                value={inputValues.eventName}
              />
            </label>
          </div>
          <div className="goals_inp">
            <label className="decs_label" htmlFor="description">
              <p> Description:</p>
              <textarea
                name="description"
                id="description"
                cols="30"
                rows="10"
                value={inputValues.description}
                onChange={handleInputGoals}
              ></textarea>
            </label>
          </div>
          <div className="half_gaols_md">
            <div className="half_inp_goals">
            <div className="goals_inp ">
                <label htmlFor="category">
                  <p> Category:</p>
                  <select
                    name="category"
                    id="category"
                    required
                    onChange={handleInputGoals}
                    value={inputValues.category}
                  >

                    <option value=''>selec category</option>
                    {dbCategory.map((val)=>(
                      <option value={val.category} key={val.id}>{val.category}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="goals_inp ">
                <label htmlFor="dificulty">
                  <p> Difficulty:</p>
                  <select
                    name="dificulty"
                    id="dificulty"
                    required
                    onChange={handleInputGoals}
                    value={inputValues.dificulty}
                  >
                    <option value="">select difficulty</option>
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                </label>
              </div>
              <div className="goals_inp">
                <label htmlFor="">
                  <p> Start date:</p>
                  <input
                    type="date"
                    name="startDate"
                    required
                    onChange={handleInputGoals}
                    value={inputValues.startDate}
                  />
                </label>
              </div>
              <div className="goals_inp">
                <label htmlFor="">
                  <p> End date:</p>
                  <input
                    type="date"
                    name="endDate"
                    required
                    onChange={handleInputGoals}
                    value={inputValues.endDate}
                  />
                </label>
              </div>
              <div className="goals_inp">
                <label htmlFor="">
                  <p> Goal duration days:</p>
                  <input
                    type="number"
                    name="numberOfDays"
                    required
                    onChange={handleInputGoals}
                    value={inputValues.numberOfDays}
                  />
                </label>
              </div>
              <div className="goals_inp">
                <label htmlFor="">
                  <p> Investment min:</p>
                  <input
                    type="number"
                    name="investMin"
                    required
                    onChange={handleInputGoals}
                    value={inputValues.investMin}
                  />
                </label>
              </div>
              <div className="goals_inp">
                <label htmlFor="">
                  <p> Investment max:</p>
                  <input
                    type="number"
                    name="investMax"
                    required
                    onChange={handleInputGoals}
                    value={inputValues.investMax}
                  />
                </label>
              </div>
              <div className="goals_inp">
                <label className="reward_inp" htmlFor="">
                  <p> Reward range:</p>
                  <input
                    type="number"
                    name="rewardMin"
                    required
                    onChange={handleInputGoals}
                    value={inputValues.rewardMin}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    name="rewardMax"
                    required
                    onChange={handleInputGoals}
                    value={inputValues.rewardMax}
                  />
                </label>
              </div>
            </div>
            <div className="right_hald_inp">
              <div className="goals_pic_upload">
                <p>Upload Photo:</p>
                {imgUrl ? (
                  <div className="crossImg">
                    {cross ? (
                      <button className="crosImg_btn" onClick={handleEmptyImg}>
                        x
                      </button>
                    ) : null}
                    <img className="uploaded_goal_img" src={imgUrl} alt="..." />
                  </div>
                ) : (
                  <p className="empty"></p>
                )}
                <label className="cus_btn" htmlFor="goalImg">
                  <input
                    type="file"
                    name="goalImg"
                    onChange={handleGoalImg}
                    style={{ display: 'none' }}
                    id="goalImg"
                    // value={imgUrl}
                    // required
                  />
                  Choose photo
                </label>
              </div>
            </div>
          </div>
          <div className="addGoals_btn">
            <CustomButton value={btnValue} type="submit" />
          </div>
        </form>
      </div>
      {loading ? (
        <div className="addGoals_loading">
          <div className="addGoals_loading_md">
            <CircularProgress />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CreateGoals
