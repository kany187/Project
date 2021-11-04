import React, {  useState } from 'react'
import MenuAppBar from '../../../Layout/Navbar'
import { useSelector } from 'react-redux'
import './style.css'
import MyGoalsList from './MyGoalsList'
import DonutChartComp from './DonutChart'
import LineChart from './LineChart'
import TextsmsOutlinedIcon from '@material-ui/icons/TextsmsOutlined'
import Login from '../../Login/Login'

const donutChartData = {
  category: [
    {
      label: 'Category',
      value: 15,
    },
    {
      label: 'Category',
      value: 60,
    },
    {
      label: 'Category',
      value: 25,
    },
  ],
  dificulty: [
    {
      label: 'Difficult Level',
      value: 60,
    },
    {
      label: 'Difficult Level',
      value: 20,
    },
    {
      label: 'Difficult Level',
      value: 15,
    },
  ],
  success: [
    {
      label: 'Success Rate',
      value: 20,
    },
    {
      label: 'Success Rate',
      value: 15,
    },
    {
      label: 'Success Rate',
      value: 65,
    },
  ],
}

const MyAllGoals = () => {
  let [loading] = useState(false)
  // get current user detail
  const userDetail = useSelector((state) => {
    return state
  })
  const { goalReducer, userReducer } = userDetail

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <React.Fragment>
      {goalReducer.isUserLogin ? (
        <div>
          <MenuAppBar />
          <div className="my_allGoals_main">
            <div className= {userReducer.selectedGoals.length?"mobViewHead homePageHeadMob":'mobViewHead'}>
              <div className="mobViewHeadContent">
                <h2>TRYVE</h2>
                <div className="headChatIcon">
                  <TextsmsOutlinedIcon />
                </div>
              </div>
            </div>
            {userReducer.selectedGoals.length ? (
              <div className="chartsContainerMain">
                <div className="lineContainer">
                  <div className="chartBalanceHead">
                    <h4>$432.42</h4>
                    <p>Open P&L(+79.87%)</p>
                  </div>
                  <LineChart />
                </div>
                <div className="chartsMain">
                  <div className="dntOne">
                    <DonutChartComp
                      data={donutChartData.category}
                      label="Category"
                    />
                  </div>
                  <div className="dntTwo">
                    <DonutChartComp
                      data={donutChartData.dificulty}
                      label="Difficult Level"
                    />
                  </div>
                  <div className="dntThre">
                    <DonutChartComp
                      data={donutChartData.success}
                      label="Success Rate"
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <MyGoalsList loading={loading} />
          </div>
        </div>
      ) : (
        <Login />
      )}
    </React.Fragment>
  )
}

export default MyAllGoals
