import React, { useContext, useEffect, useState } from "react";
import * as S from "./CampaignProgressBar.styles";
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
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";
import { Breadcrumb, AudienceReachCount } from "@dr-one/shared-component";
import { useHistory } from "react-router-dom";
import { apiDashboard, helper, Colors, days, Mixpanel } from "@dr-one/utils";
import { Spinner, SnackBarMessage } from "@dr-one/shared-component";
import { useTranslation } from 'react-i18next';
import { v1, v4 } from "uuid";
import { useParams } from 'react-router-dom'
// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//   },
//   step: {
//     "& $completed": {
//       color: "#44d600 !important",
//     },
//     "& $active": {
//       color: "#1975ff !important",
//     },
//     "& $disabled": {
//       color: "grey",
//     },
//   },
//   alternativeLabel: {},
//   active: {},
//   completed: {},
//   disabled: {},
//   labelContainer: {
//     "& $alternativeLabel": {
//       color: "#8C95A7"
//     }
//   }
// }));

function CampaignProgressBar() {
  const { state } = useContext(GlobalContext);
  const { dispatch } = useContext(GlobalContext);
  const { t } = useTranslation();
  const param = useParams();
  const hierarchyList = state.campaignBreadCrumbList.map(breadCrumb => {
    return t(`${breadCrumb}`);
  });

  let history = useHistory();
  const steps = state.campaignStepsArray.map(step => {
    return t(`${step}`);
  });

  // const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [isDisableDraftButton, toggleDraftButton] = useState(!state.formValues.registration.isCampaignNameValid);
  const [showLoader, toggleLoader] = useState(false);
  const [snackbarMessageSuccess, setSnackbarMessageSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessageValue, setSnackbarMessageValue] = useState('');
  const [loadingReachCount, setLoadingReachCount] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [activeDeviceReachCount, setActiveDeviceReachCount] = useState(null);
  const [isReachCountLoading, setReachCountLoading] = useState(false);
  let getReachCountSetTimeOut: any = null;
  const userData = JSON.parse(localStorage.getItem('dr-user'));
  const iuUserIndex = userData.organizations.findIndex(orgDetail => orgDetail.id === userData.organizationActive);
  const isIUUser = iuUserIndex > -1 ? userData.organizations[iuUserIndex].legacy : false;
  const [showPrompt, setShowPrompt] = useState(false);
  const [campaignLoadPayload, setCampaingLoadPayload] = React.useState<any>({});
  const [copyCampaignPayLoad, setCopyCampaignPayLoad] = React.useState<any>({});

  const changeHierarchy = (hierarchyItem: string): void => {
    switch (hierarchyItem) {
      // case 'Campaign Management':
      //   history.push("/campaign/manage");
      //   break;
      case 'Registration':
        dispatch({
          type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
          payload: {
            campaignPayload: state.formValues, currentPageName: 'registration',
            campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
            campaignStepsArray: state.campaignStepsArray
          }
        });
        Mixpanel.track("Create Campaign Page View", { "page": "Registration" });
        break;
      case 'Template':
        if (state.currentSectionName !== 'template') {
          if (state.formValues.registration.campaignType === "InApp") {
            Mixpanel.track("Create Campaign Page View", { "page": "Template - InApp" });
          } else {
            Mixpanel.track("Create Campaign Page View", { "page": "Template - Push" });
          }
        }
        dispatch({
          type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
          payload: {
            campaignPayload: state.formValues, currentPageName: 'template',
            campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE'],
            campaignStepsArray: state.campaignStepsArray
          }
        });
        break;
      case 'Creative':
        if (state.currentSectionName !== 'creative') {
          if (state.formValues.registration.campaignType === "InApp") {
            Mixpanel.track("Create Campaign Page View", { "page": "Creative - InApp" });
          } else {
            Mixpanel.track("Create Campaign Page View", { "page": "Creative - Push" });
          }
        }
        dispatch({
          type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
          payload: {
            campaignPayload: state.formValues, currentPageName: 'creative',
            campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE'],
            campaignStepsArray: state.campaignStepsArray
          }
        });
        break;
      case 'Survey':
        Mixpanel.track("Create Campaign Page View", { "page": "Survey" });
        dispatch({
          type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
          payload: {
            campaignPayload: state.formValues, currentPageName: 'survey',
            campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SURVEY'],
            campaignStepsArray: ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SURVEY', 'SETTINGS']
          }
        });
    }
  }

  useEffect(() => {
    if (state.currentSectionName === 'template' || state.currentSectionName === 'secondaryTemplate') {
      setActiveStep(1);
    } else if (state.currentSectionName === 'creative' || state.currentSectionName === 'secondaryCreative') {
      setActiveStep(2);
    } else if (state.formValues.registration.campaignObjectiveName !== 'surveyAd' && state.currentSectionName === 'settings') {
      setActiveStep(3);
    } else if (state.formValues.registration.campaignObjectiveName === 'surveyAd' && state.currentSectionName === 'survey') {
      setActiveStep(3);
    } else if (state.formValues.registration.campaignObjectiveName === 'surveyAd' && state.currentSectionName === 'settings') {
      setActiveStep(4);
    } else {
      setActiveStep(0);
    }
    if (state.formValues.registration.isCampaignNameValid) {
      if (state.formValues.settings.isSettingSectionValid.isCampaignOptionSectionValid) {
        toggleDraftButton(false);
      } else {
        toggleDraftButton(true);
      }
    } else {
      toggleDraftButton(true);
    }
  });

  useEffect(() => {
    if (state.formValues.settings.isCallReachCountApi) {
      getReachCount(false);
    }
    if (state.formValues.registration.name.length !== 0 && !param?.id) {
      setShowPrompt(true);
      sessionStorage.setItem('enablePrompt', 'true');
    }
  }, [state.formValues]);

  const getReachCount = (force: boolean = false, loopReachCount = true) => {
    if (state.formValues.settings.clusterArray.list.length > 0
      && helper.isIncludeFilterAdded(state.formValues.settings.clusterArray)
      && loopReachCount
    ) {
      setReachCountLoading(true);
      const feature = [];
      if (state.formValues.settings.geofence.enableGeofence) {
        feature.push('GeoFence');
      } else {
        if (feature.indexOf('GeoFence') > -1) {
          feature.splice(feature.indexOf('GeoFence'), 1);
        }
      }
      if (['2.4.0', '2.5.0', '2.7.0'].indexOf(state.formValues.template.targetSDKVersion) !== -1) {
        feature.push('AdvCampaign');
        feature.push('notification');
      } else {
        feature.push('notification');
      }
      const endPoint = helper.getAudienceReachCountForCampaign(
        helper.formatClusterCriteria(state.formValues.settings.clusterArray),
        force,
        feature,
        state.formValues.template.targetSDKVersion,
        false,
        false
      );
      apiDashboard
        .get(
          endPoint
        ).then(response => {
          if (state.formValues.settings.clusterArray !== null) {
            if (state.formValues.settings.clusterArray.list.length <= 0) {
              clearTimeout(getReachCountSetTimeOut);
              getReachCountSetTimeOut = null;
              return;
            }
          }
          if (parseInt(response.data['status'], helper.radix) !== 100) {
            renderReachCount(response.data['data']);
            loopReachCount = false;
            const modifiedPayload = Object.assign({}, state.formValues);
            modifiedPayload['settings']['isCallReachCountApi'] = false;
            dispatch({
              type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
              payload: {
                campaignPayload: modifiedPayload,
                currentPageName: state.currentSectionName,
                campaignBreadCrumbList: state.campaignBreadCrumbList,
                campaignStepsArray: state.campaignStepsArray
              },
            });
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

  function campaignPayload() {
    let adContentType;
    if (state.formValues.registration.campaignType === 'push' || state.formValues.registration.campaignType === 'pushInApp') {
      if (state.formValues.template.primaryTemplateType) {
        adContentType = state.formValues.template.primaryTemplateType === 'standard' ? 'FLEX' : 'RICH_NOTIFICATION';
      } else {
        adContentType = 'FLEX';
      }
    } else {
      adContentType = 'FLEX';
    }

    const emailArray = state.formValues.registration.emailDistributionList.split(',');
    const emailList = emailArray.map((email) => email.trim());

    let customAdTrackerNonCommonUrl = {
      commonURL: false,
      eventListURL: {}
    };

    if (!state.formValues.settings.customTrackerLinks.iscommonUrl) {
      if (state.formValues.registration.campaignType === 'push' || state.formValues.registration.campaignType === 'pushInApp') {
        if (state.formValues.settings.customTrackerLinks.notificationShown?.length !== 0 && state.formValues.settings.customTrackerLinks.errorObjectNonCommonUrl.notificationShown?.length === 0) {
          customAdTrackerNonCommonUrl['eventListURL']['NOTIFICATION'] = state.formValues.settings.customTrackerLinks.notificationShown
        }

        if (state.formValues.settings.customTrackerLinks.notificationClicked?.length !== 0 && state.formValues.settings.customTrackerLinks.errorObjectNonCommonUrl.notificationClicked?.length === 0) {
          customAdTrackerNonCommonUrl['eventListURL']['NOTIFICATION_CLICK'] = state.formValues.settings.customTrackerLinks.notificationClicked
        }
      }
      if (state.formValues.registration.campaignType === 'inApp' || state.formValues.registration.campaignType === 'pushInApp') {
        if (state.formValues.settings.customTrackerLinks.bannerShown?.length !== 0 && state.formValues.settings.customTrackerLinks.errorObjectNonCommonUrl.bannerShown?.length === 0) {
          customAdTrackerNonCommonUrl['eventListURL']['AD_CONTAINER'] = state.formValues.settings.customTrackerLinks.bannerShown
        }
      }
      if (state.formValues.settings.customTrackerLinks.bannerClicked?.length !== 0 && state.formValues.settings.customTrackerLinks.errorObjectNonCommonUrl.bannerClicked?.length === 0) {
        customAdTrackerNonCommonUrl['eventListURL']['CTA'] = state.formValues.settings.customTrackerLinks.bannerClicked
      }
      if (state.formValues.settings.customTrackerLinks.actionComplete?.length !== 0 && state.formValues.settings.customTrackerLinks.errorObjectNonCommonUrl.actionComplete?.length === 0) {
        customAdTrackerNonCommonUrl['eventListURL']['ACTION_COMPLETE'] = state.formValues.settings.customTrackerLinks.actionComplete
      }
      if (state.formValues.registration.campaignObjectiveName === 'surveyAd') {
        if (state.formValues.settings.customTrackerLinks.surveyOpen?.length !== 0 && state.formValues.settings.customTrackerLinks.errorObjectNonCommonUrl.surveyOpen?.length === 0) {
          customAdTrackerNonCommonUrl['eventListURL']['SURVEY_OPEN'] = state.formValues.settings.customTrackerLinks.surveyOpen;
        }
        if (state.formValues.settings.customTrackerLinks.surveyClosed?.length !== 0 && state.formValues.settings.customTrackerLinks.errorObjectNonCommonUrl.surveyClosed?.length === 0) {
          customAdTrackerNonCommonUrl['eventListURL']['SURVEY_CLOSED'] = state.formValues.settings.customTrackerLinks.surveyClosed;
        }
        if (state.formValues.settings.customTrackerLinks.surveyCompleted?.length !== 0 && state.formValues.settings.customTrackerLinks.errorObjectNonCommonUrl.surveyCompleted?.length === 0) {
          customAdTrackerNonCommonUrl['eventListURL']['SURVEY_COMPLETED'] = state.formValues.settings.customTrackerLinks.surveyCompleted;
        }
      }
    }

    let customAdTrackerCommonUrl = {
      commonURL: true,
      eventList: state.formValues.settings.customTrackerLinks.eventList,
      url: state.formValues.settings.customTrackerLinks.commonUrl
    }

    if (state.formValues.settings.customTrackerLinks?.iscommonUrl) {
      if (state.formValues.registration.campaignType === 'inApp') {
        const eventPosition = customAdTrackerCommonUrl.eventList?.indexOf('NOTIFICATION');
        if (eventPosition > -1) {
          customAdTrackerCommonUrl.eventList.splice(eventPosition, 1);
        }
        const eventPosition1 = customAdTrackerCommonUrl.eventList?.indexOf('NOTIFICATION_CLICK');
        if (eventPosition1 > -1) {
          customAdTrackerCommonUrl.eventList.splice(eventPosition1, 1);
        }
      }
      if (state.formValues.registration.campaignType === 'push') {
        const eventPosition = customAdTrackerCommonUrl.eventList?.indexOf('AD_CONTAINER');
        if (eventPosition > -1) {
          customAdTrackerCommonUrl.eventList.splice(eventPosition, 1);
        }
      }
      if (state.formValues.registration.campaignObjectiveName !== 'surveyAd') {
        const eventPosition = customAdTrackerCommonUrl.eventList?.indexOf('SURVEY_OPEN');
        if (eventPosition > -1) {
          customAdTrackerCommonUrl.eventList.splice(eventPosition, 1);
        }
        const eventPosition1 = customAdTrackerCommonUrl.eventList?.indexOf('SURVEY_CLOSED');
        if (eventPosition1 > -1) {
          customAdTrackerCommonUrl.eventList.splice(eventPosition1, 1);
        }
        const eventPosition2 = customAdTrackerCommonUrl.eventList?.indexOf('SURVEY_COMPLETED');
        if (eventPosition2 > -1) {
          customAdTrackerCommonUrl.eventList.splice(eventPosition2, 1);
        }
      }
    }
    if (customAdTrackerCommonUrl?.eventList && customAdTrackerCommonUrl.eventList.length === 0) {
      customAdTrackerCommonUrl = null;
    }
    if (customAdTrackerCommonUrl?.url && customAdTrackerCommonUrl.url.length === 0) {
      customAdTrackerCommonUrl = null;
    }
    let buttonsArray = [];
    let buttonsArrayInApp = [];
    let adActionText;

    if (state.formValues.registration.campaignObjectiveName === 'showMessage') {
      if (state.formValues.registration.cpType === 'ENGAGEMENT') {
        if (state.formValues.creative.buttons.length !== 0) {
          if (state.formValues.creative.buttons[0].buttonText !== '') {
            state.formValues.creative.buttons.forEach((buttonElem, index) => {
              buttonsArray.push({
                label: helper.trimString(buttonElem.buttonText),
                ctaLink: buttonElem.ctaLink,
                id: index + 1
              })
            })
          } else {
            buttonsArray = [];
          }
        } else {
          buttonsArray = [];
        }

        adActionText = (state.formValues.creative.buttonPersonalizationOptions && buttonsArray.length !== 0) ? helper.trimString(state.formValues.creative.buttons[0].buttonText) : null
        if (isIUUser) {
          buttonsArrayInApp = [];
        } else {
          if (state.formValues.registration.campaignType === 'push') {
            buttonsArrayInApp = [];
          } else {
            if (state.formValues.creative.buttonsInApp.length !== 0) {
              if (state.formValues.creative.buttonsInApp[0].buttonText !== '') {
                state.formValues.creative.buttonsInApp.forEach(buttonElem => {
                  buttonsArrayInApp.push({
                    label: helper.trimString(buttonElem.buttonText),
                    ctaLink: buttonElem.ctaLink
                  })
                })
              } else {
                buttonsArrayInApp = [];
              }
            } else {
              buttonsArrayInApp = [];
            }
          }
        }
      } else {
        buttonsArray = [];
        buttonsArrayInApp = [];
        adActionText = null;
      }
    } else {
      buttonsArray = [];
      buttonsArrayInApp = [];
      adActionText = state.formValues.creative.ctaText ? helper.trimString(state.formValues.creative.ctaText) : null;
    }

    let startDate, endDate, expiryDate, times = [], startTime;
    if (state.formValues.registration.campaignType !== 'inApp') {
      if (state.formValues.settings.schedule.repeat) {
        startDate = state.formValues.settings.schedule.startAt ? helper.formatDate(state.formValues.settings.schedule.startAt) : null;
        endDate = state.formValues.settings.schedule.endAt ? helper.formatDate(state.formValues.settings.schedule.endAt) : null;
        expiryDate = state.formValues.settings.schedule.expAt ? helper.formatDate(state.formValues.settings.schedule.expAt) : null;
        startTime = state.formValues.settings.schedule.startAt ? helper.hoursAndMinutes(state.formValues.settings.schedule.startAt) : null;
        if (endDate) {
          state.formValues.settings.schedule.weekDays.forEach((day => {
            times.push({
              startTime: helper.hoursAndMinutes(day.time),
              endTime: helper.hoursAndMinutes(day.time) + 1,
              dayOfWeek: helper.convertDayOfWeek(day.day)
            })
          }))
        }
      } else {
        if (state.formValues.settings.schedule.distributeInTime) {
          startDate = state.formValues.settings.schedule.startAt ? helper.formatDate(state.formValues.settings.schedule.startAt) : null;
          endDate = state.formValues.settings.schedule.endAt ? helper.formatDate(state.formValues.settings.schedule.endAt) : null;
          expiryDate = state.formValues.settings.schedule.expAt ? helper.formatDate(state.formValues.settings.schedule.expAt) : null;
          startTime = state.formValues.settings.schedule.startAt ? helper.hoursAndMinutes(state.formValues.settings.schedule.startAt) : null;
          if (endDate) {
            state.formValues.settings.schedule.weekDays.forEach((day => {
              times.push({
                startTime: helper.hoursAndMinutes(day.time),
                endTime: helper.hoursAndMinutes(day.time) + 1,
                dayOfWeek: helper.convertDayOfWeek(day.day)
              })
            }))
          }
        } else {
          startDate = state.formValues.settings.schedule.startAt ? helper.formatDate(state.formValues.settings.schedule.startAt) : null;
          endDate = startDate;
          expiryDate = startDate;
          times = [{
            startTime: helper.hoursAndMinutes(state.formValues.settings.schedule.startAt),
            endTime: helper.hoursAndMinutes(state.formValues.settings.schedule.startAt) + 1,
            dayOfWeek: state.formValues.settings.schedule.startAt.getDay()
          }]
        }
      }
    } else {
      startDate = helper.formatDate(state.formValues.settings.schedule.startAt);
      endDate = helper.formatDate(state.formValues.settings.schedule.endAt);
      expiryDate = helper.formatDate(state.formValues.settings.schedule.endAt);
    }

    const campaignPayload = {
      adContentType: adContentType,
      advertiserId: state.formValues.registration.advertiserId,
      agencyId: state.formValues.registration.agencyId,
      audienceClusterScope: 'IU_MANAGED',
      audienceClusters: state.formValues.settings.clusterArray.list[0].list[0].id !== '' ? JSON.stringify(helper.formatClusterCriteria(state.formValues.settings.clusterArray)) : null,
      campaignCategoryId: state.formValues.registration.campaignCategoryName,
      campaignObjectiveId: state.formValues.registration.campaignObjectiveId,
      campaignOptions: state.formValues.settings.campaignOptions,
      version: '2.0',
      distribution: {
        distributionAllocation: state.formValues.registration.campaignType === 'inApp' ? 'DO_NOT_RETARGET' : state.formValues.settings.schedule.repeat ? 'RETARGET' : 'DO_NOT_RETARGET',
        distributionStrategy: 'DAILY_LINEAR_NONADJUSTED',
        startDate: startDate,
        endDate: endDate,
        expirationDate: expiryDate,
        times: times,
        timeZone: state.formValues.settings.schedule.timezone,
        endDateSpecified: true
      },
      distributionNetwork: {
        appDeliveryType: 'PRECACHE',
        videoDeliveryType: 'STREAM',
        type: state.formValues.settings.schedule.network
      },
      emailDistributionList: state.formValues.registration.emailDistributionList.length === 0 ? null : emailList,
      enableGeoFence: state.formValues.registration.cpType === 'ENGAGEMENT' ? false : state.formValues.settings.geofence.enableGeofence,
      enableInterstitial: false,
      enableVas: false,
      enableSurvey: state.formValues.registration.campaignObjectiveName === 'surveyAd' ? true : false,
      gifContentId: null,
      imageType: state.formValues.registration.campaignType === 'push' ? 'NONE' : (state.formValues.template.primarayTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.primarayTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo') ? 'FULL' : 'MAIN',
      name: helper.trimString(state.formValues.registration.name),
      notification: {
        adActionText: adActionText,
        customAdTracker: state.formValues.settings.customTrackerLinks.iscommonUrl ? customAdTrackerCommonUrl
          : Object.keys(customAdTrackerNonCommonUrl?.eventListURL).length === 0 ? null : customAdTrackerNonCommonUrl,
        displayOnlyAd: state.formValues.registration.campaignObjectiveName === 'showMessage' ? 'displayOnlyAd' : '',
        message: state.formValues.creative.message ? helper.trimString(state.formValues.creative.message) : null,
        subject: state.formValues.creative.subject ? helper.trimString(state.formValues.creative.subject) : null,
        buttons: state.formValues.creative.buttonPersonalizationOptions ? buttonsArray : []
      },
      notificationImageContentId: (state.formValues.creative.iconUploadOptions && Object.keys(state.formValues.creative.notificationImageContent).length !== 0) ? state.formValues.creative.notificationImageContent?.id : null,
      performActionOnNotification: state.formValues.registration.campaignType === 'push' ? true : false,
      showAdOnUnlock: true,
      showNegativeFeedback: false,
      showNotification: state.formValues.registration.campaignType !== 'inApp' ? true : false,
      showPositiveFeedback: false,
      surveyId: (state.formValues.registration.campaignObjectiveName === 'surveyAd' && state.formValues.creative.selectedSurvey && Object.keys(state.formValues.creative.selectedSurvey).length !== 0) ? state.formValues.creative.selectedSurvey.id : null,
      targetSDKVersion: state.formValues.template.targetSDKVersion,
      vasInfo: {},
      videoContentFlag: true,
      purposeType: isIUUser ? 'MONETIZATION' : state.formValues.registration.cpType,
      campaignType: state.formValues.registration.campaignType === 'pushInApp' ? 'PUSH_INAPP' : state.formValues.registration.campaignType ? state.formValues.registration.campaignType?.toUpperCase() : null,
      insertionOrderId: state.formValues.registration.insertionOrderId ? state.formValues.registration.insertionOrderId : null,
      performance: {
        pricingType: state.formValues.registration.cpType === 'ENGAGEMENT'
          ? 'NONPRICED' : state.formValues.settings.metrics.cpc ? 'PRICED' : 'NONPRICED',
        proposedPrice: state.formValues.registration.cpType === 'ENGAGEMENT'
          ? null : state.formValues.settings.metrics.cpc,
        maximumBudgetSpecified: false,
        maximumMetricSpecified: state.formValues.registration.cpType === 'ENGAGEMENT'
          ? true : state.formValues.settings.metrics.target ? true : false,
        enablePerformanceOveride: state.formValues.registration.cpType === 'ENGAGEMENT'
          ? false : state.formValues.settings.metrics.typePerformance === 'CPM' ? false :
            state.formValues.settings.metrics.ctr ? true : false,
        maximumMetric: state.formValues.registration.cpType === 'ENGAGEMENT'
          ? 10000000 : state.formValues.settings.metrics.target ?
            Math.round(Number(state.formValues.settings.metrics.target)) : null,
        assumedPerformance: state.formValues.registration.cpType === 'ENGAGEMENT'
          ? null : state.formValues.settings.metrics.typePerformance !== 'CPM' ?
            state.formValues.settings.metrics.ctr : null,
        type: state.formValues.registration.cpType === 'ENGAGEMENT'
          ? 'CPM' : state.formValues.settings.metrics.typePerformance ? state.formValues.settings.metrics.typePerformance
            : null,
        assumedImpressionRateSpecified: state.formValues.registration.cpType === 'ENGAGEMENT'
          ? false : state.formValues.settings.metrics.reach ? true : false,
        assumedImpressionRate: state.formValues.registration.cpType === 'ENGAGEMENT'
          ? 0 : state.formValues.settings.metrics.reach ? state.formValues.settings.metrics.reach : 0
      }
    }
    if (adContentType === 'RICH_NOTIFICATION') {
      if (state.formValues.template.primaryTemplateType === 'richText') {
        campaignPayload['notification']['richNotificationMessageBody'] = state.formValues.creative.richNotificationMessageBody;
        campaignPayload['notification']['notificationType'] = 'STANDARD_TEXT';
      }
      if (state.formValues.template.primaryTemplateType === 'richImage') {
        campaignPayload['notification']['richNotificationLargeImageContentId'] = state.formValues.creative.richNotificationImageContent.id;
        campaignPayload['notification']['notificationType'] = 'STANDARD_IMAGE';
      }
      campaignPayload['notification']['richNotificationActionButtonText'] = adActionText;
    }
    if (state.formValues.settings.schedule.repeat && state.formValues.registration.campaignType !== 'inApp') {
      campaignPayload['distribution']['reTargetOption'] = state.formValues.settings.schedule.targetBehavior;
      campaignPayload['distribution']['reTargetOptionForMultipleSlots'] = state.formValues.settings.schedule.scheduleBehavior;
    }
    if (state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPage'
      || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo') {
      campaignPayload['fullImageContentId'] = state.formValues.creative.fullImageContent.id;
    } else {
      campaignPayload['fullImageContentId'] = null;
    }
    if (state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo'
      || state.formValues.template.primaryTemplateType === 'popupWithVideo' || state.formValues.template.secondaryTemplateType === 'popupWithVideo') {
      if (Object.keys(state.formValues.creative.videoContent).length === 0) {
        campaignPayload['videoContentId'] = null;
        campaignPayload['gifContentId'] = state.formValues.creative.gifImageContent ? state.formValues.creative.gifImageContent.id : null;
        campaignPayload['videoContentFlag'] = false;
      } else {
        campaignPayload['gifContentId'] = null;
        campaignPayload['videoContentId'] = state.formValues.creative.videoContent ? state.formValues.creative.videoContent.id : null;
        campaignPayload['videoContentFlag'] = true;
      }
    } else {
      campaignPayload['videoContentId'] = null;
      campaignPayload['gifContentId'] = null;
    }
    if (state.formValues.template.primaryTemplateType === 'popup' || state.formValues.template.secondaryTemplateType === 'popup' || state.formValues.template.primaryTemplateType === 'bottomBanner' || state.formValues.template.secondaryTemplateType === 'bottomBanner' || state.formValues.template.primaryTemplateType === 'topBanner' || state.formValues.template.secondaryTemplateType === 'topBanner' ||
      state.formValues.template.primaryTemplateType === 'popupWithVideo' || state.formValues.template.secondaryTemplateType === 'popupWithVideo'
    ) {
      campaignPayload['mainImageContentId'] = state.formValues.creative.mainImageContent.id;
    } else {
      campaignPayload['mainImageContentId'] = null;
    }
    if (state.formValues.template.primaryTemplateType) {
      if (state.formValues.registration.campaignType !== 'pushInApp') {
        campaignPayload['adTemplateType'] = state.formValues.template.primaryTemplateType.toUpperCase();
      } else {
        campaignPayload['adTemplateType'] = (state.formValues.template.primaryTemplateType && state.formValues.template.secondaryTemplateType) ? `${state.formValues.template.primaryTemplateType.toUpperCase()}_${state.formValues.template.secondaryTemplateType.toUpperCase()}` : null;
      }
    } else {
      campaignPayload['adTemplateType'] = null;
    }
    let cta;
    if (state.formValues.registration.campaignObjectiveName === 'goToWeb') {
      campaignPayload['notification']['goToWeb'] = state.formValues.registration.goToWeb || '';
      cta = state.formValues.registration.goToWeb || '';
    }
    if (state.formValues.registration.campaignObjectiveName === 'packageNameToInstallApp') {
      campaignPayload['notification']['packageNameToInstallApp'] = {
        appUrl: state.formValues.registration.packageNameToInstallApp || '',
        packageName: state.formValues.registration.packageName || ''
      }
      cta = state.formValues.registration.packageNameToInstallApp || '';
    }
    if (state.formValues.registration.campaignObjectiveName === 'packageNameToOpenApp') {
      campaignPayload['notification']['packageNameToOpenApp'] = helper.trimString(state.formValues.registration.packageNameToOpenApp) || '';
      cta = state.formValues.registration.packageNameToOpenApp || '';
    }
    if (state.formValues.registration.campaignObjectiveName === 'phoneToCall') {
      campaignPayload['notification']['phoneToCall'] = state.formValues.registration.phoneToCall || '';
      cta = state.formValues.registration.phoneToCall || '';
    }
    // if (state.formValues.registration.campaignObjectiveName === 'actionInTheApp') {
    //   campaignPayload['notification']['actionInTheApp'] = state.formValues.registration.actionInTheApp || '';
    // }

    const containerArray = [];
    if (!isIUUser) {
      if (state.formValues.registration.cpType === 'ENGAGEMENT') {
        state.formValues.creative.sequenceArray.map((subSectionName, index) => {
          if (subSectionName === 'video') {
            if (Object.keys(state.formValues.creative.videoContent).length !== 0 || Object.keys(state.formValues.creative.gifImageContent).length !== 0) {
              containerArray[index] = {
                id: Object.keys(state.formValues.creative.videoContent).length !== 0 ?
                  state.formValues.creative.videoContent.id : state.formValues.creative.gifImageContent.id,
                type: 'video',
                text: '',
                url: Object.keys(state.formValues.creative.videoContent).length !== 0 ? state.formValues.creative.videoContent.videoFileUrl : state.formValues.creative.gifImageContent.videoFileUrl,
                original_url: '',
                deeplink: '',
                partnerTag: '',
                actions: [],
                clickable: false
              }
            }
          } else if (subSectionName === 'image') {
            if (((state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo')
              && Object.keys(state.formValues.creative.fullImageContent).length !== 0) || ((state.formValues.template.primaryTemplateType === 'popup' || state.formValues.template.secondaryTemplateType === 'popup' || state.formValues.template.primaryTemplateType === 'popupWithVideo' || state.formValues.template.secondaryTemplateType === 'popupWithVideo' || state.formValues.template.primaryTemplateType === 'bottomBanner' || state.formValues.template.secondaryTemplateType === 'bottomBanner' || state.formValues.template.primaryTemplateType === 'topBanner' || state.formValues.template.secondaryTemplateType === 'topBanner') && Object.keys(state.formValues.creative.mainImageContent).length !== 0)) {
              containerArray[index] = {
                id: (state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo')
                  ? state.formValues.creative.fullImageContent.id : state.formValues.creative.mainImageContent.id,
                type: 'image',
                text: '',
                url: (state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo') ? state.formValues.creative.fullImageContent.imageUrl :
                  state.formValues.creative.mainImageContent.imageUrl,
                original_url: '',
                deeplink: '',
                partnerTag: '',
                actions: [],
                clickable: false
              }
            }
          } else if (subSectionName === 'messageContent') {
            if (state.formValues.creative.subjectInApp || state.formValues.creative.messageInApp) {
              if (state.formValues.creative.subjectInApp) {
                containerArray[index] = {
                  id: v1(),
                  type: 'text',
                  color: '#000000',
                  text: helper.trimString(state.formValues.creative.subjectInApp),
                  style: 'bold',
                  size: 15,
                  alignment: 'center'
                }
              }
              if (state.formValues.creative.messageInApp) {
                containerArray[state.formValues.creative.subjectInApp ? (index + 1) : index] = {
                  id: v1(),
                  type: 'text',
                  color: '#000000',
                  text: helper.trimString(state.formValues.creative.messageInApp),
                  style: 'regular',
                  size: 12,
                  alignment: 'center'
                }
              }
            }
          } else if (subSectionName === 'cta') {
            if (state.formValues.registration.campaignObjectiveName !== 'showMessage') {
              if (state.formValues.creative.ctaText) {
                containerArray[(state.formValues.creative.subjectInApp && state.formValues.creative.messageInApp) ? (index + 1) : index] = {
                  id: v1(),
                  type: 'button',
                  color: 'HEX color',
                  bgColor: 'HEX color',
                  radius: 15,
                  text: state.formValues.creative.ctaText,
                  deeplink: cta,
                  style: 'regular',
                  size: 12,
                  alignment: 'center',
                  partnerTag: '',
                  actions: []
                }
              }
            } else {
              if (state.formValues.creative.buttonPersonalizationOptionsInApp &&
                state.formValues.creative.buttonsInApp && state.formValues.creative.buttonsInApp.length !== 0 && state.formValues.creative.buttonsInApp.some(ele => ele.buttonText !== '')) {
                state.formValues.creative.buttonsInApp.map((buttonElem, i) => {
                  containerArray[index + (state.formValues.creative.messageInApp ? (i + 1) : i)] = {
                    id: v1(),
                    type: 'button',
                    color: 'HEX color',
                    bgColor: 'HEX color',
                    radius: 15,
                    deeplink: buttonElem.ctaLink,
                    text: buttonElem.buttonText,
                    style: 'regular',
                    size: 12,
                    partnerTag: '',
                    actions: [],
                    alignment: 'center'
                  }
                })
              }
            }
          }
        })
        let days_and_time = {};
        if (state.formValues.registration.campaignType === 'inApp' && state.formValues.settings.schedule.specificDays) {
          state.formValues.settings.schedule.inAppWeekDays.forEach((weekDay) => {
            const key = days.findIndex(day => day === weekDay.day) + 1
            if (!!days_and_time[key] && !!days_and_time[key].length) {
              days_and_time[key].push(weekDay.time.map(elem => String(elem) + ":00"))
            } else {
              days_and_time[key] = [weekDay.time.map(elem => String(elem) + ":00")];
            }
          })
        } else {
          days_and_time = {};
        }

        let displayLimitMessage;
        if (state.formValues.settings.schedule.multiShow) {
          if (state.formValues.settings.schedule.multiShowRangeType === 'DAY') {
            displayLimitMessage = Number(state.formValues.settings.schedule.repeatMany) * 60 * 60 * 24;
          } else if (state.formValues.settings.schedule.multiShowRangeType === 'HOUR') {
            displayLimitMessage = Number(state.formValues.settings.schedule.repeatMany) * 60 * 60;
          } else if (state.formValues.settings.schedule.multiShowRangeType === 'WEEK') {
            displayLimitMessage = Number(state.formValues.settings.schedule.repeatMany) * 60 * 60 * 24 * 7;
          } else if (state.formValues.settings.schedule.multiShowRangeType === 'MONTH') {
            displayLimitMessage = Number(state.formValues.settings.schedule.repeatMany) * 60 * 60 * 24 * 30;
          } else if (state.formValues.settings.schedule.multiShowRangeType === 'MINUTES') {
            displayLimitMessage = Number(state.formValues.settings.schedule.repeatMany) * 60;
          }
        } else {
          displayLimitMessage = -1;
        }
        const inAppObject = {
          start_sending: new Date(state.formValues.settings.schedule?.startAt).setHours(0, 0, 0),
          stop_sending: state.formValues.registration.campaignType === 'inApp' ? new Date(state.formValues.settings.schedule?.endAt).setHours(23, 59, 59)
            : (!state.formValues.settings.schedule.repeat && !state.formValues.settings.schedule.distributeInTime)
              ? new Date(state.formValues.settings.schedule?.startAt).setHours(23, 59, 59)
              : new Date(state.formValues.settings.schedule?.endAt).setHours(23, 59, 59),
          name: state.formValues.registration.campaignType === 'push' ? '' : helper.trimString(state.formValues.creative.subjectInApp),
          type: state.formValues.registration.campaignType === 'push' ? 'top' : (state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo') ? 'full'
            : (state.formValues.template.primaryTemplateType === 'bottomBanner' || state.formValues.template.secondaryTemplateType === 'bottomBanner') ? 'bottom'
              : (state.formValues.template.primaryTemplateType === 'topBanner' || state.formValues.template.secondaryTemplateType === 'topBanner') ? 'top' : 'center',
          must_validate: true,
          display_when: {
            startup: true,
            in_app_events: [],
            days_and_time,
            timeout: 1500,
            disallowed_views: [],
            disallowed_tags: [],
            poi_ids: [],
            limits: {
              global: [-1, 5, -1],
              category: [-1, -1, -1],
              message: [
                state.formValues.settings.schedule.multiShow ? Number(state.formValues.settings.schedule.repeatMany) : -1,
                state.formValues.settings.schedule.multiShow ? displayLimitMessage : -1,
                1]
            },
            categories: [],
            priority: 5
          },
          in_app_content: state.formValues.registration.campaignType === 'push' ? [] : containerArray.filter(Object),
          background_url: '',
          background_color: Colors.WHITE,
          theme_color: Colors.BLACK,
          close_button_position: 'right',
          html_url: '',
          id: v4()
        }
        campaignPayload['engagement'] = inAppObject;
      } else {
        campaignPayload['engagement'] = null;
      }
    }

    if (state.formValues.registration.campaignType === 'inApp') {
      if (state.formValues.settings.schedule.repeatMonth) {
        campaignPayload['distribution']['times'] = [];
        campaignPayload['distribution']['dayOfMonth'] = Number(state.formValues.settings.schedule.monthlyDayTime);
        campaignPayload['distribution']['showSpecificDayOfMonth'] = true;
        campaignPayload['distribution']['startTime'] = Number(state.formValues.settings.schedule.sendDayTime[0]) * 60;
        campaignPayload['distribution']['endTime'] = Number(state.formValues.settings.schedule.sendDayTime[1]) * 60;
        campaignPayload['distribution']['showMessageInSpecificTime'] = false;
      } else {
        let inAppTimesArray = [];
        campaignPayload['distribution']['showSpecificDayOfMonth'] = false;
        if (state.formValues.settings.schedule.specificDays) {
          campaignPayload['distribution']['times'] = [];
          state.formValues.settings.schedule.inAppWeekDays.forEach(day => {
            inAppTimesArray.push({
              startTime: ((60 * (day.time[0])) - 1),
              endTime: ((60 * (day.time[1])) - 1),
              dayOfWeek: helper.convertDayOfWeek(day.day)
            })
          })
          campaignPayload['distribution']['inappTimes'] = inAppTimesArray;
        }
        campaignPayload['distribution']['showMessageInSpecificTime'] = state.formValues.settings.schedule.specificDays;
      }
      campaignPayload['distribution']['multiShow'] = state.formValues.settings.schedule.multiShow;
      if (state.formValues.settings.schedule.multiShow) {
        campaignPayload['distribution']['multiShowTimes'] = Number(state.formValues.settings.schedule.repeatMany);
        campaignPayload['distribution']['multiShowRangeType'] = state.formValues.settings.schedule.multiShowRangeType;
        campaignPayload['distribution']['times'] = [{
          startTime: 0,
          endTime: 1,
          dayOfWeek: state.formValues.settings.schedule.startAt.getDay()
        }]
      }
    } else {
      campaignPayload['distribution']['isDistributeInTime'] = state.formValues.settings.schedule.distributeInTime;
    }

    campaignPayload['adDisplayTimeBehaviour'] = state.formValues.creative.adDisplayTimeBehaviour;
    if (state.formValues.creative.adDisplayTimeBehaviour === 'NONE') {
      campaignPayload['minimumAdDisplayTime'] = 0;
    } else if (state.formValues.creative.adDisplayTimeBehaviour === 'SHOW_FULL') {
      campaignPayload['minimumAdDisplayTime'] = -1;
    } else if (state.formValues.creative.adDisplayTimeBehaviour === 'MINIMUM_REQUIRED') {
      campaignPayload['minimumAdDisplayTime'] = Number(state.formValues.creative.minimumAdDisplayTime);
    }

    if (state.formValues.settings.geofence.enableGeofence && state.formValues.registration.cpType !== 'ENGAGEMENT') {
      const geoLocationData = {
        geoLocations: JSON.stringify(state.formValues.settings.geofence.locationList),
        geoRadius: state.formValues.settings.geofence.geoRadius,
        multiDisplay: false
      };
      campaignPayload['geoLocationDetail'] = geoLocationData;
    }

    return campaignPayload;
  }

  const onSaveDraft = (): any => {
    sessionStorage.setItem('enablePrompt', 'false')
    toggleLoader(true);
    if (window.location.pathname.indexOf('edit') >= 0 || state.formValues.campaignId) {
      apiDashboard
        .put(`campaign-mgmt-api/campaigns/${state.formValues.campaignId}`, campaignPayload())
        .then(response => {
          setSnackbarMessageSuccess(true);
          setSnackbar(true);
          setSnackbarMessageValue(response.data.message);
          setTimeout(() => {
            history.push('/campaign/manage');
          }, 3000);
        }, error => {
          toggleLoader(false);
          setSnackbarMessageSuccess(false);
          setSnackbar(true);
          setSnackbarMessageValue(helper.getErrorMessage(error));
        });
    } else {
      apiDashboard
        .post('campaign-mgmt-api/campaigns', campaignPayload())
        .then(response => {
          setSnackbarMessageSuccess(true);
          setSnackbar(true);
          setSnackbarMessageValue(response.data.message);
          setTimeout(() => {
            history.push(`/campaign/edit/${response.data.data.id}`);
          }, 1000);
        }, error => {
          toggleLoader(false);
          setSnackbarMessageSuccess(false);
          setSnackbar(true);
          setSnackbarMessageValue(helper.getErrorMessage(error));
        });
    }
  }

  const resetWarningFlagValue = (resetWarningFlag: boolean): void => {
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload['settings']['isShowClusterWarningFlag'] = resetWarningFlag;
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
      payload: {
        campaignPayload: modifiedPayload, currentPageName: state.currentSectionName,
        campaignBreadCrumbList: state.campaignBreadCrumbList,
        campaignStepsArray: state.campaignStepsArray
      }
    })
  }

  const copyCampaignData = JSON.parse(JSON.stringify(sessionStorage.getItem('initialCampaingDetails')));
  let copyofCampaign = JSON.parse(copyCampaignData);
  // delete copyofCampaign?.settings?.schedule?.startAt;
  // delete copyofCampaign?.settings?.schedule?.endAt;
  // delete copyofCampaign?.settings?.schedule?.expAt;
  delete copyofCampaign?.settings?.isCallReachCountApi;
  delete copyofCampaign?.engagement?.id;
  copyofCampaign?.engagement?.in_app_content?.forEach((contentApp) => {
    delete contentApp?.id
  })
  copyofCampaign?.settings?.schedule?.weekDays?.forEach((week) => {
    delete week?.id
  })

  const copyOfcampaignLoadPayload = JSON.parse(JSON.stringify(campaignLoadPayload));
  // delete copyOfcampaignLoadPayload?.settings?.schedule?.startAt;
  // delete copyOfcampaignLoadPayload?.settings?.schedule?.endAt;
  // delete copyOfcampaignLoadPayload?.settings?.schedule?.expAt;
  delete copyOfcampaignLoadPayload?.settings?.isCallReachCountApi;
  delete copyOfcampaignLoadPayload?.engagement?.id;
  copyOfcampaignLoadPayload?.engagement?.in_app_content?.forEach((contentApp) => {
    delete contentApp?.id
  })
  copyOfcampaignLoadPayload?.settings?.schedule?.weekDays?.forEach((week) => {
    delete week.id
  })

  useEffect(() => {
    sessionStorage.setItem('enablePrompt', 'false')
    if (state.formValues?.registration?.advertiserId?.length > 0 && state.formValues?.registration?.agencyId?.length > 0 &&
      state.formValues?.registration?.campaignCategoryName?.length > 0 && state.formValues?.registration?.campaignObjectiveId?.length > 0) {
      setCampaingLoadPayload(campaignPayload())
    }
    if (window.location.pathname.indexOf('edit') >= 0 && state.formValues?.registration?.advertiserId?.length > 0 && state.formValues?.registration?.agencyId?.length > 0 &&
      state.formValues?.registration?.campaignCategoryName?.length > 0 && state.formValues?.registration?.campaignObjectiveId?.length > 0) {
      JSON.stringify(copyofCampaign) === JSON.stringify(copyOfcampaignLoadPayload) ? sessionStorage.setItem('enablePrompt', 'false') : sessionStorage.setItem('enablePrompt', 'true');
    }
    else if (window.location.pathname.indexOf('new') >= 0 && state.formValues?.registration?.advertiserId?.length > 0 && state.formValues?.registration?.agencyId?.length > 0 &&
      state.formValues?.registration?.campaignCategoryName?.length > 0 && state.formValues?.registration?.campaignObjectiveId?.length > 0) {
      JSON.stringify(copyOfcampaignLoadPayload) === JSON.stringify(copyofCampaign) ? sessionStorage.setItem('enablePrompt', 'false') : sessionStorage.setItem('enablePrompt', 'true');
    }
  }, [JSON.stringify(copyOfcampaignLoadPayload) === JSON.stringify(copyofCampaign), state.formValues, JSON.stringify(copyCampaignData) === JSON.stringify(campaignLoadPayload), state.formValues?.registration?.advertiserId?.length > 0 && state.formValues?.registration?.agencyId?.length > 0 &&
    state.formValues?.registration?.campaignCategoryName?.length > 0 && state.formValues?.registration?.campaignObjectiveId?.length > 0])

  const pageLoad = () => {
    sessionStorage.setItem('initialCampaingDetails', JSON.stringify(campaignPayload()))
    setCopyCampaignPayLoad(copyCampaignData)
  }

  function getAllInitialCampaignData(advertiserId, agencyId, campaignCategoryName, campaignObjectiveId) {
    if (advertiserId?.length > 0 && agencyId?.length > 0 && campaignCategoryName?.length > 0 && campaignObjectiveId?.length > 0) {
      pageLoad()
    }
  }

  useEffect(() => {
    getAllInitialCampaignData(state.formValues?.registration?.advertiserId, state.formValues?.registration?.agencyId,
      state.formValues?.registration?.campaignCategoryName, state.formValues?.registration?.campaignObjectiveId)
  }, [state.formValues.initialPayload, showPrompt,
  state.formValues?.registration?.advertiserId?.length > 0 && state.formValues?.registration?.agencyId?.length > 0 &&
  state.formValues?.registration?.campaignCategoryName?.length > 0 && state.formValues?.registration?.campaignObjectiveId?.length > 0
  ])

  const updateReachCountValue = (countValue) => {
    setActiveDeviceReachCount(countValue);
  }

  return (
    <React.Fragment>
      {snackbar && (
        <SnackBarMessage open={snackbar} onClose={() => setSnackbar(false)}
          severityType={snackbarMessageSuccess ? 'success' : 'error'} message={snackbarMessageValue} />)}
      <Breadcrumb hierarchy={hierarchyList} onHierarchyChange={(item) => changeHierarchy(item)} />
      <div className="mb-20">
        <div>
          <h1 className="page-title">
            {window.location.pathname.indexOf('edit') >= 0 && <S.Title>{t('EDIT_CAMPAIGN')}</S.Title>}
            {window.location.pathname.indexOf('edit') < 0 && <S.Title>{t('CREATE_CAMPAIGN_HEADER')}</S.Title>}
          </h1>
        </div>
      </div>
      <Grid container spacing={3} className="flex-space-between">
        <Grid item md={8} xs={6}>
          {/* <S.StepperContainer className={classes.root}> */}
          <S.StepperContainer>
            <div className="step-wrapper">
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label} >
                    <StepLabel
                    // classes={{ alternativeLabel: classes.alternativeLabel, labelContainer: classes.labelContainer }}
                    // StepIconProps={{ classes: { root: classes.step, completed: classes.completed, active: classes.active } }}
                    >{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
          </S.StepperContainer>

        </Grid>
        <Grid item md={4} xs={6}>
          {state.currentSectionName === 'settings' && <AudienceReachCount deviceReachCount={activeDeviceReachCount} clusterData={helper.formatClusterCriteria(state.formValues.settings.clusterArray)} targetSDKVersion={state.formValues.template.targetSDKVersion} isShowClusterWarningFlag={state.formValues.settings.isShowClusterWarningFlag} resetWaringFlag={resetWarningFlagValue} updateReachCount={updateReachCountValue} enableGeofence={state.formValues.settings.geofence.enableGeofence}/>}

          {!state.formValues.lockCampaignStatus && <Typography align="right">
            {showLoader && <Button variant="contained" color="primary" type="submit" className="button-sm"
              disabled>{t('BUTTON_SAVE_DRAFT')}<Spinner color={"blue"} /></Button>}
            {(!showLoader) && <Button variant="contained" color="primary" type="submit" className="button-sm"
              disabled={isDisableDraftButton} onClick={() => onSaveDraft()}
            >{t('BUTTON_SAVE_DRAFT')}</Button>}
          </Typography>}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default CampaignProgressBar;
