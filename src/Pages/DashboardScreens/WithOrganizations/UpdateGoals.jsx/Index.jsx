import React, { useEffect, useState } from 'react'
import MiniDrawer from '../../Sidebar'
import PersonIcon from '@material-ui/icons/Person'
import CreateGoals from '../CreateGoals/CreateGoals'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import firebase from '../../../../Config/FirebaseConfig'
import { useHistory } from 'react-router-dom'

const goalsInput = {
  eventName: '',
  description: '',
  dificulty: '',
  endDate: '',
  investMin: '',
  investMax: '',
  rewardMin: '',
  rewardMax: '',
  startDate: '',
  numberOfDays: '',
}

const UpdateGoals = () => {
  const history = useHistory()
  let { id, goal } = useParams()
  const [inputValues, setInputValues] = useState(goalsInput)
  const [imgUrl, setImgurl] = useState('')
  const [imgName, setImgName] = useState('')
  const [local, setLocal] = useState('')
  let [filterGoal, setFilterGoal] = useState([])
  let [editGoalId, setEditGoalId] = useState('')
  let [loading, setLoading] = useState(false)
  const db = firebase.database()

  const goals = useSelector((state) => {
    return state.goalReducer.OrgGoals
  })

  const ref = db.ref(`organizations/${id}/categories`)
  let [dbCategory, setDbCategory] = useState([])

  const getCategories = () => {
    ref.on('value', (snapshot) => {
      let categoryArray = []
      snapshot.forEach((data) => {
        let resData = data.val()
        let dataKey = data.key
        resData.id = dataKey
        categoryArray.push(resData)
      })
      setDbCategory(categoryArray)
    })
  }

  // useEffect(()=>{
  // },[])

  // console.log(goals)
  useEffect(() => {
    //   filter selected goal detail
    let goalsFilter = goals.filter((val) => val.id === goal)
    setFilterGoal(goalsFilter)
    if (goalsFilter.length) {
      setImgurl(goalsFilter[0].url)
      setInputValues(goalsFilter[0].inputValues)
      setEditGoalId(goalsFilter[0].id)
    }
    getCategories()
    return () => {
      getCategories()
    }
  }, [])

  const handleGoals = (event) => {
    setInputValues({ ...inputValues, [event.target.name]: event.target.value })
  }

  const handleGoalImg = (event) => {
    const url = URL.createObjectURL(event.target.files[0])
    const goalImgName = event.target.files[0].name
    setImgurl(url)
    setImgName(goalImgName)
    setLocal(event.target.files[0])
  }
  // firebase storage ref
  const storage = firebase.storage()
  let createStorageRef = () => storage.ref(`goalsImages/${imgName}`).put(local)
  let downLoad = () => storage.ref(`goalsImages/${imgName}`).getDownloadURL()

  // firebase database reference
  const goalsRef = db.ref(`organizations/${id}/goals/` + editGoalId)

  const handleEmptyImg = () => {
    setImgurl('')
  }

  // update goals in database
  const handleUpdateGoals = (e) => {
    e.preventDefault()
    setLoading(true)
    if (local) {
      createStorageRef().then(() => {
        downLoad().then((url) => {
          goalsRef
            .update({
              inputValues,
              url,
              // numberOfDays,
              peopleJoined: 0,
            })
            .then(() => {
              setLoading(false)
              history.push(`/organizations/${id}/dashboard`)
            })
            .catch((err) => {
              console.log(err)
              setLoading(false)
            })
        })
      })
    } else {
      goalsRef
        .update({
          inputValues,
          // numberOfDays,
        })
        .then(() => {
          setLoading(false)
          history.push(`/organizations/${id}/dashboard`)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    }
    // console.log(inputValues);
    setInputValues(goalsInput)
    setImgurl('')
  }

  if (!filterGoal.length) {
    return (
      <div>
        <p>Loading</p>
      </div>
    )
  }

  return (
    <div>
      <div className="createGoals_container">
        <div className="createGoals_md">
          <div className="dashboard_left_content">
            <MiniDrawer />
          </div>
          <div className="create_goals_right_content">
            <div className="top_route_head">
              <p className="top_route_icon">
                <PersonIcon />
              </p>
              <p style={{ marginLeft: '10px' }}>Goals</p>
            </div>
            <div className="create_goals_box_main">
              <CreateGoals
                handleAddGoals={handleUpdateGoals}
                handleInputGoals={handleGoals}
                handleGoalImg={handleGoalImg}
                inputValues={inputValues}
                imgUrl={imgUrl}
                loading={loading}
                btnValue="Confirm"
                handleEmptyImg={handleEmptyImg}
                cross
                backArrowPathId={`/organizations/${id}/dashboard`}
                dbCategory={dbCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateGoals
