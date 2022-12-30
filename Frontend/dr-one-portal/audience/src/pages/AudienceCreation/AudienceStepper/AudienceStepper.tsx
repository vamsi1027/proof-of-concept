import React, { useContext, useEffect, useState } from "react";
import * as S from "./AudienceStepper.styles";
import {
  Button,
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid
} from "@material-ui/core";
import { GlobalContext } from '../../../context/globalState';
import { Breadcrumb, AudienceReachCount } from "@dr-one/shared-component";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { apiDashboard, helper } from "@dr-one/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  step: {
    "& $completed": {
      color: "#44d600 !important",
    },
    "& $active": {
      color: "#1975ff !important",
    },
    "& $disabled": {
      color: "grey",
    },
  },
  alternativeLabel: {},
  active: {},
  completed: {},
  disabled: {},
  labelContainer: {
    "& $alternativeLabel": {
      color: "#8C95A7"
    }
  }
}));

function AudienceStepper() {
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const { t } = useTranslation();
  const param = useParams();

  const hierarchyList = window.location.pathname.indexOf('edit') < 0 ?
    [`${t('AUDIENCES')}`, `${t('AUDIENCE')} ${t('LIST')}`, `${t('CREATE_AUDIENCE_HEADER')}`]
    : [`${t('AUDIENCES')}`, `${t('AUDIENCE')} ${t('LIST')}`, `${t('EDIT_AUDIENCE_HEADER')}`];
  let history = useHistory();
  const steps = [`${t('REGISTRATION')}`, `${t('SETTINGS')}`];
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [activeDeviceReachCount, setActiveDeviceReachCount] = useState(null);
  const [loadingReachCount, setLoadingReachCount] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [isReachCountLoading, setReachCountLoading] = useState(false);
  const [isCallReachCountApi, setReachCountApi] = useState(true);

  let getReachCountSetTimeOut: any = null;
  const [clusterData, setClusterData] = useState(
    {
      condition: "ALL",
      list: [
        {
          operation: 'INCLUDE',
          condition: "ANY",
          list: [{
            id: "",
            name: "",
          }]
        }
      ]
    }
  );

  const changeHierarchy = (hierarchyItem: string): void => {
    switch (hierarchyItem) {
      case 'Audience List':
        // history.push("/audience/manage");
        break;
    }
  };

  useEffect(() => {
    if (window.location.pathname.indexOf('edit') >= 0) {
      dispatch({
        type: "TOGGLE_REACH_COUNT_API",
        payload: true

      })
    }
  }, [])

  useEffect(() => {
    if (state?.rules?.name && state?.rules?.name.length !== 0 && window.location.pathname.indexOf('edit') >= 0) {
      const clusterCriteria = clusterData;
      clusterCriteria.list[0]['list'][0].id = param?.id;
      clusterCriteria.list[0]['list'][0].name = state?.rules?.name;
      setClusterData(JSON.parse(JSON.stringify(clusterCriteria)));

      if (isCallReachCountApi) {
        getReachCount(false);
      }
    }
  }, [state, isCallReachCountApi]);

  const getReachCount = (force: boolean = false, loopReachCount = true) => {
    setReachCountApi(false);
    if (clusterData.list.length > 0
      && helper.isIncludeFilterAdded(clusterData)
      && loopReachCount
    ) {
      setReachCountLoading(true);
      const filters = 'filters=' + JSON.stringify(helper.formatClusterCriteria(clusterData));
      const endPoint = 'campaign-mgmt-api/audienceclusters/reachcount?' + filters + '&forcecalculation=' + force;
      apiDashboard
        .get(
          endPoint
        ).then(response => {
          if (clusterData !== null) {
            if (clusterData.list.length <= 0) {
              clearTimeout(getReachCountSetTimeOut);
              getReachCountSetTimeOut = null;
              return;
            }
          }
          if (parseInt(response.data['status'], helper.radix) !== 100) {
            renderReachCount(response.data['data']);
            loopReachCount = false;
          } else {
            loopReachCount = true;
            renderReachCount({ 'loading': true })
            if (getReachCountSetTimeOut !== null) {
              clearTimeout(getReachCountSetTimeOut);
              getReachCountSetTimeOut = null;
            }
            getReachCountSetTimeOut = setTimeout(() => {
              getReachCount(false, loopReachCount);
            }, 5000);
          }
        }, error => {
          loopReachCount = true;
          renderReachCount({ 'loading': true });
          setReachCountLoading(false);
          console.log(helper.getErrorMessage(error));
        })
    } else {
      loopReachCount = false;
      setLoadingReachCount(false);
      setActiveDeviceReachCount(null);
    }
  }

  const renderReachCount = (data: any): void => {
    setLoopCount(loopCount);
    if (loopCount > 3) {
      setLoadingReachCount(false);
    }
    if (data.loading) {
      setLoadingReachCount(true);
    } else {
      if (data.scope === null) {
      } else {
        setReachCountLoading(false);
        setActiveDeviceReachCount(data.activeDeviceReachCount.toString());
        setLoadingReachCount(false);
      }
    }
  }

  const resetWarningFlagValue = (resetWarningFlag: boolean): void => {
    dispatch({
      type: "TOGGLE_REACH_COUNT_API",
      payload: resetWarningFlag

    })
  }

  const updateReachCountValue = (countValue) => {
    setActiveDeviceReachCount(countValue);
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item md={12} className="breadcrumbs">
          <Breadcrumb hierarchy={hierarchyList} onHierarchyChange={(item) => changeHierarchy(item)} />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={12}>
          {window.location.pathname.indexOf('edit') >= 0 && <S.Title>{`${t('EDIT_AUDIENCE_HEADER')}`}</S.Title>}
          {window.location.pathname.indexOf('edit') < 0 && <S.Title>{`${t('CREATE_AUDIENCE_HEADER')}`}</S.Title>}
        </Grid>
      </Grid>
      <Grid container spacing={3} className="flex-space-between">
        <Grid item md={8} xs={6}>

          <S.StepperContainer className={classes.root}>
            <div className="step-wrapper">
              <Stepper activeStep={state.activeStepper} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label} classes={{ root: classes.step, completed: classes.completed }}>
                    <StepLabel
                      classes={{ alternativeLabel: classes.alternativeLabel, labelContainer: classes.labelContainer }}
                      StepIconProps={{ classes: { root: classes.step, completed: classes.completed, active: classes.active } }}
                    >{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
          </S.StepperContainer>

        </Grid>
        <Grid item md={4} xs={6}>
          {window.location.pathname.indexOf('edit') >= 0 && <AudienceReachCount deviceReachCount={activeDeviceReachCount} clusterData={clusterData} isShowClusterWarningFlag={state.isShowClusterWarningFlag} resetWaringFlag={resetWarningFlagValue} updateReachCount={updateReachCountValue} enableGeofence={false} />}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default AudienceStepper;