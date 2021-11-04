import React, { useEffect } from 'react'
import firebase from '../../../../Config/FirebaseConfig'
import { useParams } from 'react-router-dom'
import {
  allSubmitOrgGoals,
  setOrgApprovedGoals,
  setOrgDeclineGoals,
  setReportGoals,
  setFakeGoals,
} from '../../../../GlobalState/CreateSlice'
import { useDispatch, useSelector } from 'react-redux'
import MiniDrawer from '../../Sidebar'
import SubmitGoalsTable from './SubmitGoalsTable'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import './submitGoal.css'
import { getOrgUsers } from '../OrganizationUsers/UserList'

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
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}))

const SubmitedGoals = () => {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const { id } = useParams()
  const dispatch = useDispatch()
  const db = firebase.database()
  const dbRef = db.ref(`organizations/${id}/submitGoals`)

  // get filter organization goals from database
  const getFilterOrgGoals = () => {
    dbRef.on('value', (snapshot) => {
      let submitOrgGoalsArry = []
      let approvedOrgGoals = []
      let declineOrgGoals = []
      let reportGoalArray = []
      let fakeGoal = []
      snapshot.forEach((data) => {
        const getData = data.val()
        // console.log(getData)
        const getId = data.key
        getData.submitGoalId = getId
        // if goals in pending
        if (!getData.approved && !getData.decline && !getData.isReport) {
          //  console.log(getData.approved)
          submitOrgGoalsArry.push(getData)
        }
        // if goals is approved
        else if (getData.approved && !getData.isReport) {
          approvedOrgGoals.push(getData)
        } else if (getData.decline) {
          declineOrgGoals.push(getData)
        } else if (getData.isReport && !getData.acceptReport) {
          reportGoalArray.push(getData)
        }  if (getData.isReport && getData.acceptReport) {
          fakeGoal.push(getData)
          // console.log(getData)
        }
        // console.log(getData)
      })
      // submit goals
      dispatch(allSubmitOrgGoals(submitOrgGoalsArry))
      // approved goal
      dispatch(setOrgApprovedGoals(approvedOrgGoals))
      // decline goals
      dispatch(setOrgDeclineGoals(declineOrgGoals))
      // report goals
      dispatch(setReportGoals(reportGoalArray))
      // fake goals report
      dispatch(setFakeGoals(fakeGoal))
    })
  }

  useEffect(() => {
    getFilterOrgGoals()
    getOrgUsers(id, dispatch)
  }, [])

  const selector = useSelector((state) => {
    return state.goalReducer
  })
    // console.log(selector)

  return (
    <div>
      <div className="dashboard_md">
        <div className="dashboard_left_content">
          <MiniDrawer />
        </div>
        <div className={`${classes.root} submitd_table_md`}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="Submit Goals" {...a11yProps(0)} />
              <Tab label="Approved Goals" {...a11yProps(1)} />
              <Tab label="Decline Goals" {...a11yProps(2)} />
              <Tab label="Report Goals" {...a11yProps(3)} />
              <Tab label="Fake Goals" {...a11yProps(4)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <SubmitGoalsTable selector={selector.allSubmitGoals} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <SubmitGoalsTable
              selector={selector.allOrgApprovedGoals}
              btn
              approvedUndo
              undoFunc
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <SubmitGoalsTable
              selector={selector.allDeclineOrgGoals}
              btn
              undoFunc
            />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <SubmitGoalsTable
              selector={selector.reportGoals}
              btn
              declineBtn
              declineForReported
              undoForReported
            />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <SubmitGoalsTable
              selector={selector.fakeGoals}
              btn
              declineBtn
              undoFake
            />
          </TabPanel>
        </div>
      </div>
    </div>
  )
}

export default SubmitedGoals
