import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import HomeIcon from "@material-ui/icons/Home";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import CategoryIcon from "@material-ui/icons/Category";
import GroupIcon from "@material-ui/icons/Group";
import firebase from "../../Config/FirebaseConfig";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { userlogOut, setCurrentUser } from "../../GlobalState/CreateSlice";
import { useDispatch } from "react-redux";
import logo from "../../Assets/logo.png";
import TurnedInIcon from "@material-ui/icons/TurnedIn";
import "./Style/sidebar.css";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer({ linksShow, withOutOrg }) {
  const { id } = useParams();
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const auth = firebase.auth();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logOut = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(userlogOut(false));
        dispatch(setCurrentUser({}));
        history.push("/login");
      })
      .catch((err) => {});
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Admin DashBoard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <img src={logo} alt="..." className="logo" />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        {!linksShow ? (
          !withOutOrg ? (
            <List>
              <NavLink to={`/organizations`} className="sidebar_links">
                <HomeIcon />
                {open ? <p>Home</p> : null}
              </NavLink>
              <NavLink
                to={`/organizations/${id}/users`}
                className="sidebar_links"
              >
                <GroupIcon />
                {open ? <p>Users</p> : null}
              </NavLink>
              <NavLink
                to={`/organizations/${id}/dashboard`}
                className="sidebar_links"
              >
                <AssignmentIndIcon />
                {open ? <p>Goals</p> : null}
              </NavLink>
              <NavLink
                to={`/organizations/${id}/categories`}
                className="sidebar_links"
              >
                <CategoryIcon />
                {open ? <p>Categories</p> : null}
              </NavLink>
              <NavLink
                to={`/organizations/${id}/submit-goals`}
                className="sidebar_links"
              >
                <TurnedInIcon />
                {open ? <p>submit goals</p> : null}
              </NavLink>
            </List>
          ) : (
            <List>
              <NavLink to={`/organizations`} className="sidebar_links">
                <HomeIcon />
                {open ? <p>Home</p> : null}
              </NavLink>
              <NavLink
                to={`/without-organization/users`}
                className="sidebar_links"
              >
                <GroupIcon />
                {open ? <p>Users</p> : null}
              </NavLink>
              <NavLink
                to={`/without-organization/dashboard`}
                className="sidebar_links"
              >
                <AssignmentIndIcon />
                {open ? <p>Goals</p> : null}
              </NavLink>
              <NavLink
                to={`/without-organization/categories`}
                className="sidebar_links"
              >
                <CategoryIcon />
                {open ? <p>Categories</p> : null}
              </NavLink>
              <NavLink
                to={`/without-organization/submit-gaols`}
                className="sidebar_links"
              >
                <TurnedInIcon />
                {open ? <p>submit goals</p> : null}
              </NavLink>
            </List>
          )
        ) : null}
        <div className="logOut">
          <button className="log_out_btn" onClick={logOut}>
            Logout
          </button>
        </div>
      </Drawer>
    </div>
  );
}
