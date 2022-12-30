import React, { useContext } from "react";
import * as S from "./SurveyStepper.style";
import {
  Button,
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid
} from "@material-ui/core";
import { GlobalContext } from '../../../../context/globalState';
import { Breadcrumb } from "@dr-one/shared-component";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Mixpanel } from "@dr-one/utils";

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

function SurveyStepper() {
  const { state, dispatch } = useContext(GlobalContext);
  const { t } = useTranslation();
  const param = useParams();
  // const hierarchyList = [`${t('SURVEY')}`, `${t('REGISTRATION')}`]
  const hierarchyList = state.surveyBreadCrumbList.map(breadCrumb => {
    return t(`${breadCrumb}`);
  });
  let history = useHistory();
  const steps = [`${t('REGISTRATION')}`, `${t('WELCOMEPAGE')}`, `${t('SURVEY_QUESTION_PROGRESS')}`, `${t('LAST_SURVEY_PAGE')}`];
  const classes = useStyles();
  const changeHierarchy = (hierarchyItem: string): void => {
    switch (hierarchyItem) {
      // case 'Survey':
      //   history.push("/survey/manage");
      //   break;
      case 'Registration':
        dispatch({
          type: "CHANGE_PAGE",
          payload: {
            currentPageName: 'registration',
          },
        });
        dispatch({
          type: "ACTIVE_STEPPER",
          payload: 0,
          surveyBreadCrumbList: ['SURVEY', 'REGISTRATION']
        });
        Mixpanel.track("Create Survey Page View", { "page": "Registration" });
        break;
      case 'Welcome Page':
        dispatch({
          type: "CHANGE_PAGE",
          payload: {
            currentPageName: 'surveywelcomepage',
          },
        });
        dispatch({
          type: "ACTIVE_STEPPER",
          payload: 1,
          surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
        });
        Mixpanel.track("Create Survey Page View", { "page": "Welcome Page" });
        break;
      case 'Question':
        dispatch({
          type: "CHANGE_PAGE",
          payload: {
            currentPageName: 'question',
          },
        });
        dispatch({
          type: "ACTIVE_STEPPER",
          payload: 2,
          surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, `${t('SURVEY_QUESTION_PROGRESS')}`]
        });
        Mixpanel.track("Create Survey Page View", { "page": "Question" });
        break;
      case 'Last Page Survey':
        dispatch({
          type: "CHANGE_PAGE",
          payload: {
            currentPageName: 'surveylastpage',
          },
        });
        dispatch({
          type: "ACTIVE_STEPPER",
          payload: 3,
          surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, `${t('SURVEY_QUESTION_PROGRESS')}`, `${t('LAST_SURVEY_PAGE')}`]
        });
        Mixpanel.track("Create Survey Page View", { "page": "Last Page" });
        break;
    }
  };


  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item md={12} className="breadcrumbs">
          <Breadcrumb hierarchy={hierarchyList} onHierarchyChange={(item) => { changeHierarchy(item) }} />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <S.Title>{`${t('SURVEY')}`}</S.Title>
        </Grid>
      </Grid>
      <Grid container spacing={3} className="flex-space-between">
        <Grid item md={8} xs={12}>
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
      </Grid>
    </React.Fragment>
  );
}

export default SurveyStepper;