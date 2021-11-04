import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import Categories from '../Pages/DashboardScreens/WithOrganizations/Categories'
import Index from '../Pages/DashboardScreens/WithOrganizations/CreateGoals/Index'
import Dashboard from '../Pages/DashboardScreens/WithOrganizations/Dashboard/Dashboard'
import GoalsDetail from '../Pages/DashboardScreens/WithOrganizations/GoalsDetailPage/Index'
import Organizations from '../Pages/DashboardScreens/OrganizationLinks/Index'
import OrganizationUsers from '../Pages/DashboardScreens/WithOrganizations/OrganizationUsers'
import UpdateGoals from '../Pages/DashboardScreens/WithOrganizations/UpdateGoals.jsx/Index'
import Login from '../Pages/Login/Login'
import Signup from '../Pages/SignUp/SignUp'
import WithoutOrganizationDashboard from '../Pages/DashboardScreens/WithOutOrganizations/Dashboard/Dashboard'
import WithOutOrgGoalsCreate from '../Pages/DashboardScreens/WithOutOrganizations/CreateGoals/Index'
import WithoutOrgCategories from '../Pages/DashboardScreens/WithOutOrganizations/Categories'
import WithoutOrgGoalDetail from '../Pages/DashboardScreens/WithOutOrganizations/GoalsDetailPage/Index'
import WitoutOrgUpdateGoals from '../Pages/DashboardScreens/WithOutOrganizations/UpdateGoals.jsx/Index'
import WithoutOrganizationUsers from '../Pages/DashboardScreens/WithOutOrganizations/OrganizationUsers'
// user side
import Profile from '../Pages/UserSide/Profile/Profile'
import AllGoalsOfOrganization from '../Pages/UserSide/AllGoalsOfOrganization'
import SubmitedGoals from '../Pages/DashboardScreens/WithOrganizations/SubmitGoals/Index'
import WithoutOrgSubmitedGoals from '../Pages/DashboardScreens/WithOutOrganizations/SubmitGoals/Index'
import MyAllGoals from '../Pages/UserSide/MyGoal/Index'
import DetailPage from '../Pages/UserSide/AllGoalsOfOrganization/DetailPage'
import VerificationPage from '../Pages/UserSide/VerificationGoal'
import StartGoalDetailPage from '../Pages/UserSide/VerificationGoal/DetailPage'
import GoalsStatus from '../Pages/UserSide/GoalsStatus/Index'
import StatusDetailPage from '../Pages/UserSide/GoalsStatus/StatusDetailPage'
import Feed from '../Pages/UserSide/Feed'

const AppRouter = ({ isUser, cUser }) => {
  // console.log(isUser,cUser)
  return (
    <Router>
      <Switch>
        {/* user side routes  */}
        <Route exact path="/selec-goals">
          {/* <MyAllGoals /> */}
          {isUser ? <MyAllGoals /> : <Login />}
        </Route>
        <Route exact path="/search-goals">
          {/* <AllGoalsOfOrganization /> */}
          {isUser ? <AllGoalsOfOrganization /> : <Login />}
        </Route>
        <Route exact path="/feed">
          {/* <Feed /> */}

          {isUser ? <Feed /> : <Login />}
        </Route>
        <Route exact path="/goals-status">
          {/* <GoalsStatus /> */}

          {isUser ? <GoalsStatus /> : <Login />}
        </Route>
        <Route exact path="/goals-status/:id">
          {/* <StatusDetailPage /> */}

          {isUser ? <StatusDetailPage /> : <Login />}
        </Route>

        <Route exact path="/mygoal-detail/:id">
          {/* <StartGoalDetailPage /> */}
          {isUser ? <StartGoalDetailPage /> : <Login />}
        </Route>
        <Route exact path="/goal-detail/:id">
          <DetailPage />

          {/* {isUser ? (
            cUser.admin === true ? (
              <Redirect to="/organizations" />
            ) : (
              // <MyAllGoals />
              <DetailPage />
            )
          ) : (
            <Redirect to="/login" />
          )} */}
        </Route>
        <Route exact path="/profile">
          {/* <Profile /> */}
          {isUser ? <Profile /> : <Login />}
        </Route>
        {/* admin side route  */}
        <Route exact path="/organizations/:id/dashboard">
          {isUser ? (
            cUser.admin === true ? (
              <Dashboard />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/login">
          {isUser ? (

            <Redirect to="/selec-goals" />
          ) : (
            <Login />
          )}
        </Route>
        <Route exact path="/">
          {isUser ? (
            // cUser.admin === true ? (
            //   <Redirect to="/organizations" />
            // ) : (
            <Redirect to="/selec-goals" />
          ) : (
            // )
            <Signup />
          )}
        </Route>
        <Route exact path="/organizations/:id/create-goals">
          {isUser ? (
            cUser.admin === true ? (
              <Index />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/organizations/:id/goals-detail/:goal">
          {isUser ? (
            cUser.admin === true ? (
              <GoalsDetail />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/organizations/:id/edit-goal/:goal">
          {isUser ? (
            cUser.admin === true ? (
              <UpdateGoals />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/organizations">
          {isUser ? (
            cUser.admin === true ? (
              <Organizations />
            ) : (
              // <Dashboard />
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/organizations/:id/users">
          {isUser ? (
            cUser.admin === true ? (
              <OrganizationUsers />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/organizations/:id/categories">
          {isUser ? (
            cUser.admin === true ? (
              <Categories />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/organizations/:id/submit-goals">
          {isUser ? (
            cUser.admin === true ? (
              <SubmitedGoals />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>

        {/* without organization routes  */}
        <Route exact path="/without-organization/dashboard">
          {isUser ? (
            cUser.admin === true ? (
              <WithoutOrganizationDashboard />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/without-organization/create-goals">
          {isUser ? (
            cUser.admin === true ? (
              <WithOutOrgGoalsCreate />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/without-organization/categories">
          {isUser ? (
            cUser.admin === true ? (
              <WithoutOrgCategories />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/without-organization/goals-detail/:goal">
          {isUser ? (
            cUser.admin === true ? (
              <WithoutOrgGoalDetail />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/without-organization/edit-goal/:goal">
          {isUser ? (
            cUser.admin === true ? (
              <WitoutOrgUpdateGoals />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/without-organization/users">
          {isUser ? (
            cUser.admin === true ? (
              <WithoutOrganizationUsers />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/without-organization/submit-gaols">
          {isUser ? (
            cUser.admin === true ? (
              <WithoutOrgSubmitedGoals />
            ) : (
              <Redirect to="/selec-goals" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
      </Switch>
    </Router>
  )
}

export default AppRouter
