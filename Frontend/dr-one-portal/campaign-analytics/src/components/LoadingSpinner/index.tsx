import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    marginTop: '-16px',
    marginLeft: '-16px',
  },
  divBlock: {
    backgroundColor: '#dbdddf',
    opacity: 0.4,
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
}));

type Props = {
  isLoading?: boolean
}

const LoadingSpinner: React.FunctionComponent<Props> = ({isLoading}) => {
  if(!isLoading){
    return null
  }
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.divBlock}/>
      <CircularProgress />
    </div>
  );
}

export default LoadingSpinner;
