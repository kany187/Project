import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import logo from '../Assets/logo.png'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection:'column',
    position:'relative',
    '& > * + *': {
      marginLeft: '0px',
    },
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function LoadingState() {
  const classes = useStyles();

  return (

    <div className='loaderCenter'>
    <div className={classes.root}>
      <img  className='appLogo' src={logo} alt='logo' />
      <br />
      <CircularProgress color="secondary" />
    </div>
  </div>
  );
}