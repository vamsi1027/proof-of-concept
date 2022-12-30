import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';

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
    backgroundColor: 'white',
  },
  divBlock: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
}));

const NoDataChart: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.divBlock} />
      <p className='analytics-error'>{t('CAMPAIGN_ANALYTICS_ERROR')}</p>
    </div>
  );
}

export default NoDataChart;
