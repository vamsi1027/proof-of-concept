import { FormGroup, Grid, Checkbox, FormControl } from "@material-ui/core";

import { FormControlLabel, Switch, TextField } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../context/globalState";
import * as yup from 'yup';
import { Formik } from 'formik';
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";
import * as S from "./CustomTrackerLinks.styles";
import { useTranslation } from 'react-i18next';
import HelpIcon from '@material-ui/icons/Help';
import { LightTooltip } from "@dr-one/shared-component";
import { Colors } from '@dr-one/utils';

const CustomTrackerLinks = () => {

  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const { settings, settings: { customTrackerLinks } } = state.formValues
  const { notificationShown, notificationClicked, bannerShown, bannerClicked, actionComplete, commonUrl } = customTrackerLinks
  const [eventListArray, setEventListArray] = useState(state.formValues.settings.customTrackerLinks.eventList);
  const [notificationShownUrl, setNotificationShownUrl] = useState(state.formValues.settings.customTrackerLinks.notificationShown);
  const [notificationClickedUrl, setNotificationClickedUrl] = useState(state.formValues.settings.customTrackerLinks.notificationClicked);
  const [bannerShownUrl, setBannerShownUrl] = useState(state.formValues.settings.customTrackerLinks.bannerShown);
  const [bannerClickedUrl, setBannerClickedUrl] = useState(state.formValues.settings.customTrackerLinks.bannerClicked);
  const [actionCompleteUrl, setActionCompleteUrl] = useState(state.formValues.settings.customTrackerLinks.actionComplete);
  const [commonEventUrl, setCommonEventUrl] = useState(state.formValues.settings.customTrackerLinks.commonUrl);
  const [errorObjectNonCommonUrl, setErrorObjectNonCommonUrl] = useState(state.formValues.settings.customTrackerLinks.errorObjectNonCommonUrl);
  const [commonUrlError, toggleCommonUrlError] = useState(state.formValues.settings.customTrackerLinks.commonUrlError);
  const [urlProtocolWarningCommonUrl, setUrlProtocolWarningCommonUrl] = useState('');
  const [urlProtocolWarningNonCommonUrl, setUrlProtocolWarningNonCommonUrl] = useState(state.formValues.settings.customTrackerLinks.protocolWarningObjectNonCommonUrl);
  const [surveyOpenUrl, setSurveyOpenUrl] = useState(state.formValues.settings.customTrackerLinks.surveyOpen);
  const [surveyClosedUrl, setSurveyClosedUrl] = useState(state.formValues.settings.customTrackerLinks.surveyClosed);
  const [surveyCompletedUrl, setSurveyCompletedUrl] = useState(state.formValues.settings.customTrackerLinks.surveyCompleted);

  const { t } = useTranslation();

  const setcustomTrackerLinks = (key: string, value: any) => {
    dispatch({
      type: 'MODIFY_CAMPAIGN_SETTINGS',
      payload: { ...settings, customTrackerLinks: { ...customTrackerLinks, [key]: value } }
    })
  }

  const [isCustom, setIsCustom] = useState(state.formValues.settings.customTrackerLinks.iscommonUrl);

  const [checks, setChecks] = useState({
    notificationShown: state.formValues.settings.customTrackerLinks.eventList?.includes('NOTIFICATION'),
    notificationClicked: state.formValues.settings.customTrackerLinks.eventList?.includes('NOTIFICATION_CLICK'),
    bannerShown: state.formValues.settings.customTrackerLinks.eventList?.includes('AD_CONTAINER'),
    bannerClicked: state.formValues.settings.customTrackerLinks.eventList?.includes('CTA'),
    actionComplete: state.formValues.settings.customTrackerLinks.eventList?.includes('ACTION_COMPLETE'),
    surveyOpen: state.formValues.settings.customTrackerLinks.eventList?.includes('SURVEY_OPEN'),
    surveyClosed: state.formValues.settings.customTrackerLinks.eventList?.includes('SURVEY_CLOSED'),
    surveyCompleted: state.formValues.settings.customTrackerLinks.eventList?.includes('SURVEY_COMPLETED')
  });

  const handleChangeCustomTrackerLinkTypeChange = (e: any): void => {
    setIsCustom(e.target.checked);
    setcustomTrackerLinks('iscommonUrl', e.target.checked);
  }

  useEffect(() => {
    const modifiedPayload = Object.assign({}, state.formValues);
    if (isCustom) {
      if (state.formValues.settings.customTrackerLinks.commonUrlError.length === 0) {
        modifiedPayload['settings']['isSettingSectionValid']['isCustomTrackerLinkSectionValid'] = true;
      } else {
        modifiedPayload['settings']['isSettingSectionValid']['isCustomTrackerLinkSectionValid'] = false;
      }
    } else {
      const isValidArray = [];

      Object.keys(state.formValues.settings.customTrackerLinks.errorObjectNonCommonUrl).forEach((eventType: any) => {
        if (state.formValues.registration.campaignType === 'inApp') {
          if (eventType === 'notificationShown') {
            modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl']['notificationShown'] = '';
          } else if (eventType === 'notificationClicked') {
            modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl']['notificationClicked'] = '';
          }
        }
        if (state.formValues.registration.campaignType === 'push') {
          if (eventType === 'bannerShown') {
            modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl']['bannerShown'] = '';
          }
        }
        if (state.formValues.registration.campaignObjectiveName !== 'surveyAd') {
          if (eventType === 'surveyOpen') {
            modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl']['surveyOpen'] = '';
          } else if (eventType === 'surveyClosed') {
            modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl']['surveyClosed'] = '';
          } else if (eventType === 'surveyCompleted') {
            modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl']['surveyCompleted'] = '';
          }
        }
      })
      Object.values(modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl']).forEach((eventType: any) => {
        if (eventType.length !== 0) {
          isValidArray.push(eventType);
        }
      })

      modifiedPayload['settings']['isSettingSectionValid']['isCustomTrackerLinkSectionValid'] = isValidArray.length === 0 ? true : false;
    }
    modifiedPayload['settings']['isCallReachCountApi'] = false;
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
      payload: {
        campaignPayload: modifiedPayload, currentPageName: 'settings',
        campaignBreadCrumbList: state.campaignBreadCrumbList, campaignStepsArray: state.campaignStepsArray
      }
    });
  }, []);

  const manipulateEventArray = (event: string, value: boolean): void => {
    const array = [...eventListArray];
    if (value) {
      array.push(event)
      setcustomTrackerLinks('eventList', array);
    } else {
      const position = array.indexOf(event);
      if (position > -1) {
        array.splice(position, 1);
      }
    }
    setEventListArray(array);
    setNonCommonCustomTrackerLink('commonUrl', commonEventUrl, array);
    setcustomTrackerLinks('eventList', array);
  }

  const setNonCommonCustomTrackerLink = (eventType: string, value: string, eventArray = [], isBlur: boolean = false): void => {
    let isCustomTrackerSectionValid;
    let commonUrlError;
    const modifiedPayload = Object.assign({}, state.formValues);

    if (isCustom) {
      let customTrackerUrl = value;
      if (isBlur) {
        if (commonEventUrl.indexOf('https') === -1 && commonEventUrl.indexOf('http') === -1 && value
          && value.length !== 0) {
          customTrackerUrl = 'https://' + value;
        }
      }
      setCommonEventUrl(customTrackerUrl);
      if (!customTrackerUrl || (customTrackerUrl && customTrackerUrl.length === 0)) {
        if (eventArray.length === 0) {
          toggleCommonUrlError('');
          isCustomTrackerSectionValid = true;
          commonUrlError = '';
        } else {
          toggleCommonUrlError(t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_REQUIRED_ERROR'));
          isCustomTrackerSectionValid = false;
          commonUrlError = t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_REQUIRED_ERROR');
          setUrlProtocolWarningCommonUrl('');
        }
      } else {
        if (isBlur) {
          if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(customTrackerUrl)) {
            toggleCommonUrlError(t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_INVALID_ERROR'));
            isCustomTrackerSectionValid = false;
            commonUrlError = t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_INVALID_ERROR');
            setUrlProtocolWarningCommonUrl('');
          } else {
            if (customTrackerUrl.includes('{{timestamp}}') && customTrackerUrl.includes('{{event}}')) {
              if (eventArray && eventArray.length === 0) {
                toggleCommonUrlError(t('SETTINGS_CUSTOM_TRACKER_SECTION_EVENT_ERROR'));
                isCustomTrackerSectionValid = false;
                commonUrlError = t('SETTINGS_CUSTOM_TRACKER_SECTION_EVENT_ERROR');
                setUrlProtocolWarningCommonUrl('');
              } else {
                toggleCommonUrlError('');
                isCustomTrackerSectionValid = true;
                commonUrlError = '';
                setUrlProtocolWarningCommonUrl('');
              }
            } else {
              toggleCommonUrlError(t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_INVALID_FORMAT_ERROR'));
              isCustomTrackerSectionValid = false;
              commonUrlError = t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_INVALID_FORMAT_ERROR');
              setUrlProtocolWarningCommonUrl('');
            }
          }
        } else {
          if (customTrackerUrl.indexOf('https') === -1 && customTrackerUrl.indexOf('http') === -1) {
            setUrlProtocolWarningCommonUrl(t('URL_PROTOCOL_WARNING'));
            toggleCommonUrlError('');
            isCustomTrackerSectionValid = false;
            commonUrlError = '';
          } else {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(customTrackerUrl)) {
              toggleCommonUrlError(t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_INVALID_ERROR'));
              isCustomTrackerSectionValid = false;
              commonUrlError = t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_INVALID_ERROR');
              setUrlProtocolWarningCommonUrl('');
            } else {
              if (customTrackerUrl.includes('{{timestamp}}') && customTrackerUrl.includes('{{event}}')) {
                if (eventArray && eventArray.length === 0) {
                  toggleCommonUrlError(t('SETTINGS_CUSTOM_TRACKER_SECTION_EVENT_ERROR'));
                  isCustomTrackerSectionValid = false;
                  commonUrlError = t('SETTINGS_CUSTOM_TRACKER_SECTION_EVENT_ERROR');
                  setUrlProtocolWarningCommonUrl('');
                } else {
                  toggleCommonUrlError('');
                  isCustomTrackerSectionValid = true;
                  commonUrlError = '';
                  setUrlProtocolWarningCommonUrl('');
                }
              } else {
                toggleCommonUrlError(t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_INVALID_FORMAT_ERROR'));
                isCustomTrackerSectionValid = false;
                commonUrlError = t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_INVALID_FORMAT_ERROR');
                setUrlProtocolWarningCommonUrl('');
              }
            }
          }
        }
      }
    } else {
      let customTrackerUrl = value;
      if (eventType === 'notificationShown') {
        if (isBlur) {
          if (notificationShownUrl.indexOf('https') === -1 && notificationShownUrl.indexOf('http') === -1 && value
            && value.length !== 0) {
            customTrackerUrl = 'https://' + value;
          }
        }
        setNotificationShownUrl(customTrackerUrl);
      } else if (eventType === 'notificationClicked') {
        if (isBlur) {
          if (notificationClickedUrl.indexOf('https') === -1 && notificationClickedUrl.indexOf('http') === -1 && value
            && value.length !== 0) {
            customTrackerUrl = 'https://' + value;
          }
        }
        setNotificationClickedUrl(customTrackerUrl);
      } else if (eventType === 'bannerShown') {
        if (isBlur) {
          if (bannerShownUrl.indexOf('https') === -1 && bannerShownUrl.indexOf('http') === -1 && value
            && value.length !== 0) {
            customTrackerUrl = 'https://' + value;
          }
        }
        setBannerShownUrl(customTrackerUrl);
      } else if (eventType === 'bannerClicked') {
        if (isBlur) {
          if (bannerClickedUrl.indexOf('https') === -1 && bannerClickedUrl.indexOf('http') === -1 && value
            && value.length !== 0) {
            customTrackerUrl = 'https://' + value;
          }
        }
        setBannerClickedUrl(customTrackerUrl);
      } else if (eventType === 'actionComplete') {
        if (isBlur) {
          if (actionCompleteUrl.indexOf('https') === -1 && actionCompleteUrl.indexOf('http') === -1 && value
            && value.length !== 0) {
            customTrackerUrl = 'https://' + value;
          }
        }
        setActionCompleteUrl(customTrackerUrl);
      } else if (eventType === 'surveyOpen') {
        if (isBlur) {
          if (surveyOpenUrl.indexOf('https') === -1 && surveyOpenUrl.indexOf('http') === -1 && value
            && value.length !== 0) {
            customTrackerUrl = 'https://' + value;
          }
        }
        setSurveyOpenUrl(customTrackerUrl);
      } else if (eventType === 'surveyClosed') {
        if (isBlur) {
          if (surveyClosedUrl.indexOf('https') === -1 && surveyClosedUrl.indexOf('http') === -1 && value
            && value.length !== 0) {
            customTrackerUrl = 'https://' + value;
          }
        }
        setSurveyClosedUrl(customTrackerUrl);
      } else if (eventType === 'surveyCompleted') {
        if (isBlur) {
          if (surveyCompletedUrl.indexOf('https') === -1 && surveyCompletedUrl.indexOf('http') === -1 && value
            && value.length !== 0) {
            customTrackerUrl = 'https://' + value;
          }
        }
        setSurveyCompletedUrl(customTrackerUrl);
      }

      if (!customTrackerUrl || (customTrackerUrl && customTrackerUrl.length === 0)) {
        setErrorObjectNonCommonUrl({ [eventType]: '' });
        isCustomTrackerSectionValid = true;
        setUrlProtocolWarningNonCommonUrl({ [eventType]: '' });
        modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl'][eventType] = '';
      } else {
        if (isBlur) {
          if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(customTrackerUrl)) {
            setErrorObjectNonCommonUrl({
              [eventType]: t(eventType === 'notificationShown' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_SHOWN_URL_INVALID_ERROR' : eventType === 'notificationClicked' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_CLICKED_URL_INVALID_ERROR'
                : eventType === 'bannerShown' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_SHOWN_URL_INVALID_ERROR' :
                  eventType === 'bannerClicked' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_CLICKED_URL_INVALID_ERROR' :
                    eventType === 'actionComplete' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_ACTION_COMPLETE_URL_INVALID_ERROR' :
                      eventType === 'surveyOpen' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_OPEN_URL_INVALID_ERROR' :
                        eventType === 'surveyClosed' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_CLOSED_URL_INVALID_ERROR' :
                          eventType === 'surveyCompleted' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_COMPLETED_URL_INVALID_ERROR' : '')
            });
            setUrlProtocolWarningNonCommonUrl({ [eventType]: '' });
            isCustomTrackerSectionValid = false;
            modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl'][eventType] = t(eventType === 'notificationShown' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_SHOWN_URL_INVALID_ERROR' : eventType === 'notificationClicked' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_CLICKED_URL_INVALID_ERROR'
              : eventType === 'bannerShown' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_SHOWN_URL_INVALID_ERROR' :
                eventType === 'bannerClicked' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_CLICKED_URL_INVALID_ERROR' :
                  eventType === 'actionComplete' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_ACTION_COMPLETE_URL_INVALID_ERROR' :
                    eventType === 'surveyOpen' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_OPEN_URL_INVALID_ERROR' :
                      eventType === 'surveyClosed' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_CLOSED_URL_INVALID_ERROR' :
                        eventType === 'surveyCompleted' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_COMPLETED_URL_INVALID_ERROR' : '')
            modifiedPayload['settings']['customTrackerLinks']['protocolWarningObjectNonCommonUrl'][eventType] = '';
          } else {
            if (customTrackerUrl.includes('{{timestamp}}')) {
              setErrorObjectNonCommonUrl({ [eventType]: '' });
              setUrlProtocolWarningNonCommonUrl({ [eventType]: '' });
              isCustomTrackerSectionValid = true;
              modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl'][eventType] = '';
              modifiedPayload['settings']['customTrackerLinks']['protocolWarningObjectNonCommonUrl'][eventType] = '';
            } else {
              isCustomTrackerSectionValid = false;
              setUrlProtocolWarningNonCommonUrl({ [eventType]: '' });
              setErrorObjectNonCommonUrl({
                [eventType]: t('SETTINGS_CUSTOM_TRACKER_SECTION_UNCOMMON_URL_INVALID_FORMAT_ERROR')
              });
              modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl'][eventType] = t('SETTINGS_CUSTOM_TRACKER_SECTION_UNCOMMON_URL_INVALID_FORMAT_ERROR');
              modifiedPayload['settings']['customTrackerLinks']['protocolWarningObjectNonCommonUrl'][eventType] = '';
            }
          }
        } else {
          if (customTrackerUrl.indexOf('https') === -1 && customTrackerUrl.indexOf('http') === -1) {
            setUrlProtocolWarningNonCommonUrl({ [eventType]: t('URL_PROTOCOL_WARNING') });
            toggleCommonUrlError('');
            setErrorObjectNonCommonUrl({ [eventType]: '' });
            isCustomTrackerSectionValid = false;
            commonUrlError = '';
            modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl'][eventType] = '';
            modifiedPayload['settings']['customTrackerLinks']['protocolWarningObjectNonCommonUrl'][eventType] = '';
          } else {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(customTrackerUrl)) {
              setErrorObjectNonCommonUrl({
                [eventType]: t(eventType === 'notificationShown' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_SHOWN_URL_INVALID_ERROR' : eventType === 'notificationClicked' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_CLICKED_URL_INVALID_ERROR'
                  : eventType === 'bannerShown' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_SHOWN_URL_INVALID_ERROR' :
                    eventType === 'bannerClicked' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_CLICKED_URL_INVALID_ERROR' :
                      eventType === 'actionComplete' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_ACTION_COMPLETE_URL_INVALID_ERROR' :
                        eventType === 'surveyOpen' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_OPEN_URL_INVALID_ERROR' :
                          eventType === 'surveyClosed' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_CLOSED_URL_INVALID_ERROR' :
                            eventType === 'surveyCompleted' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_COMPLETED_URL_INVALID_ERROR' : '')
              });
              setUrlProtocolWarningNonCommonUrl({ [eventType]: '' });
              isCustomTrackerSectionValid = false;
              modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl'][eventType] = t(eventType === 'notificationShown' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_SHOWN_URL_INVALID_ERROR' : eventType === 'notificationClicked' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_CLICKED_URL_INVALID_ERROR'
                : eventType === 'bannerShown' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_SHOWN_URL_INVALID_ERROR' :
                  eventType === 'bannerClicked' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_CLICKED_URL_INVALID_ERROR' :
                    eventType === 'actionComplete' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_ACTION_COMPLETE_URL_INVALID_ERROR' :
                      eventType === 'surveyOpen' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_OPEN_URL_INVALID_ERROR' :
                        eventType === 'surveyClosed' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_CLOSED_URL_INVALID_ERROR' :
                          eventType === 'surveyCompleted' ? 'SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_COMPLETED_URL_INVALID_ERROR' : '');
              modifiedPayload['settings']['customTrackerLinks']['protocolWarningObjectNonCommonUrl'][eventType] = '';
            } else {
              if (customTrackerUrl.includes('{{timestamp}}')) {
                setErrorObjectNonCommonUrl({ [eventType]: '' });
                setUrlProtocolWarningNonCommonUrl({ [eventType]: '' });
                isCustomTrackerSectionValid = true;
                modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl'][eventType] = '';
                modifiedPayload['settings']['customTrackerLinks']['protocolWarningObjectNonCommonUrl'][eventType] = '';
              } else {
                isCustomTrackerSectionValid = false;
                setUrlProtocolWarningNonCommonUrl({ [eventType]: '' });
                setErrorObjectNonCommonUrl({
                  [eventType]: t('SETTINGS_CUSTOM_TRACKER_SECTION_UNCOMMON_URL_INVALID_FORMAT_ERROR')
                });
                modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl'][eventType] = t('SETTINGS_CUSTOM_TRACKER_SECTION_UNCOMMON_URL_INVALID_FORMAT_ERROR');
                modifiedPayload['settings']['customTrackerLinks']['protocolWarningObjectNonCommonUrl'][eventType] = '';
              }
            }
          }
        }
      }
    }
    modifiedPayload['settings']['isSettingSectionValid']['isCustomTrackerLinkSectionValid'] = isCustomTrackerSectionValid;
    modifiedPayload['settings']['customTrackerLinks']['commonUrlError'] = isCustom ? commonUrlError : '';
    modifiedPayload['settings']['isCallReachCountApi'] = false;
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
      payload: {
        campaignPayload: modifiedPayload, currentPageName: 'settings',
        campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE',
          "SETTINGS"], campaignStepsArray: state.campaignStepsArray

      }
    });
  }

  return (
    <S.Container>
      <S.Logo>
        <img src="/img/custom-tracker-icon.svg" alt="audience icon" />
        <article>
          <p className="label-tooltip cc-label-text">{t('SETTINGS_CUSTOM_TRACKER_SECTION_HEADER')}<sup>
            <LightTooltip
              interactive
              PopperProps={{
                modifiers: {
                  offset: {
                    enabled: true,
                    offset: "0px, -10px"
                  }
                }
              }}
              title={<label>{t('TOOLTIP_FOR_CUSTOM_TRACKER')} <a target="_blank" href="https://docs.digitalreef.com/docs/custom-tracker-links"> {t('KNOW_MORE')}</a>.</label>}
            >
              <span className="tooltip-icons" >
                <HelpIcon fontSize='small' />
              </span>
            </LightTooltip>
          </sup>
            {/* <img src={"/img/icon-question-mark.svg"} className="qa-icon" alt="info" /> */}
          </p>
          <small>{t('OPTIONAL')}</small>
        </article>
      </S.Logo>
      <Formik
        initialValues={{
          isCustom: isCustom,
          commonEventUrl: commonEventUrl,
          notificationShownUrl: notificationShownUrl,
          notificationClickedUrl: notificationClickedUrl,
          bannerShownUrl: bannerShownUrl,
          bannerClickedUrl: bannerClickedUrl,
          actionCompleteUrl: actionCompleteUrl,
          surveyOpenUrl: surveyOpenUrl,
          surveyClosedUrl: surveyClosedUrl,
          surveyCompletedUrl: surveyCompletedUrl
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
          dirty,
          isValid
        }) => (
          <form onSubmit={handleSubmit} className="cc-form-wrapper">

            <div className="switchery">
              <FormControlLabel
                control={<Switch
                  checked={isCustom}
                  onChange={handleChangeCustomTrackerLinkTypeChange}
                  name="isCustom"
                  disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                />}
                label={t('SETTINGS_CUSTOM_TRACKER_SECTION_TOGGLE_URL_TYPE_SWITCH_LABEL')}
              />
            </div>

            {isCustom ? (
              <S.CommonUrl>

                <Grid container>
                  <div className="row">
                    <Grid item xs={12} sm={6} className="form-row">
                      <TextField
                        id="outlined-required"
                        label={eventListArray?.length === 0 ? t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_LABEL') :
                          t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_LABEL') + ' *'}
                        value={commonEventUrl}
                        onBlur={(e) => {
                          handleBlur(e);
                          setNonCommonCustomTrackerLink('commonUrl', e.currentTarget.value, eventListArray, true);
                          setcustomTrackerLinks('commonUrl', e.target.value);
                        }}
                        onChange={(e) => {
                          handleChange(e);
                          setNonCommonCustomTrackerLink('commonUrl', e.currentTarget.value, eventListArray);
                          setcustomTrackerLinks('commonUrl', e.target.value);
                        }}
                        placeholder={t('CREATIVE_TAB_URL_LABEL')}
                        variant="outlined"
                        name="commonEventUrl"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        type="text"
                      />
                      {eventListArray?.length === 0 && <p className="optional-msg">{`${t('OPTIONAL')}`}</p>}
                      <p className="error-wrap error">{commonUrlError}</p>
                      <p className="information">{urlProtocolWarningCommonUrl}</p>
                    </Grid>
                  </div>
                </Grid>


                <div className="tracker-checkbox-list">
                  <p>{t('SETTINGS_CUSTOM_TRACKER_EVENT_HEADER')}</p>
                  <S.Checks>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checks.notificationShown}
                          color="primary"
                          onChange={(e) => {
                            setChecks({ ...checks, notificationShown: e.target.checked });
                            setcustomTrackerLinks('notificationShown', commonUrl);
                            manipulateEventArray('NOTIFICATION', e.target.checked);
                          }}
                        />
                      }
                      label={t('SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_SHOWN_URL')}
                      disabled={(state.formValues.registration.campaignType === 'inApp') || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checks.bannerShown}
                          color="primary"
                          onChange={(e) => {
                            setChecks({ ...checks, bannerShown: e.target.checked });
                            setcustomTrackerLinks('bannerShown', commonUrl);
                            manipulateEventArray('AD_CONTAINER', e.target.checked);
                          }}
                        />
                      }
                      label={t('SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_SHOWN_URL')}
                      disabled={(state.formValues.registration.campaignType === 'push') || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checks.actionComplete}
                          color="primary"
                          onChange={(e) => {
                            setChecks({ ...checks, actionComplete: e.target.checked });
                            setcustomTrackerLinks('actionComplete', commonUrl);
                            manipulateEventArray('ACTION_COMPLETE', e.target.checked);
                          }}
                        />
                      }
                      label={t('SETTINGS_CUSTOM_TRACKER_SECTION_ACTION_COMPLETE_URL')}
                      disabled={(state.formValues.registration.campaignType === 'push') || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checks.notificationClicked}
                          color="primary"
                          onChange={(e) => {
                            setChecks({ ...checks, notificationClicked: e.target.checked });
                            setcustomTrackerLinks('notificationClicked', commonUrl);
                            manipulateEventArray('NOTIFICATION_CLICK', e.target.checked);
                          }}
                        />
                      }
                      disabled={(state.formValues.registration.campaignType === 'inApp') || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                      label={t('SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_CLICKED_URL')}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checks.bannerClicked}
                          color="primary"
                          onChange={(e) => {
                            setChecks({ ...checks, bannerClicked: e.target.checked });
                            setcustomTrackerLinks('bannerClicked', commonUrl);
                            manipulateEventArray('CTA', e.target.checked);
                          }}
                        />
                      }
                      disabled={(state.formValues.registration.campaignType === 'push') || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                      label={t('SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_CLICKED_URL')}
                    />
                  </S.Checks>
                  {state.formValues.registration.campaignObjectiveName === 'surveyAd' && <S.Checks>
                    <hr style={{ width: "100%", borderColor: `${Colors.BGGRAY}` }}></hr>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checks.surveyOpen}
                          color="primary"
                          onChange={(e) => {
                            setChecks({ ...checks, surveyOpen: e.target.checked });
                            setcustomTrackerLinks('surveyOpen', commonUrl);
                            manipulateEventArray('SURVEY_OPEN', e.target.checked);
                          }}
                        />
                      }
                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                      label={t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_OPEN_URL')}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checks.surveyClosed}
                          color="primary"
                          onChange={(e) => {
                            setChecks({ ...checks, surveyClosed: e.target.checked });
                            setcustomTrackerLinks('surveyClosed', commonUrl);
                            manipulateEventArray('SURVEY_CLOSED', e.target.checked);
                          }}
                        />
                      }
                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                      label={t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_CLOSED_URL')}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checks.surveyCompleted}
                          color="primary"
                          onChange={(e) => {
                            setChecks({ ...checks, surveyCompleted: e.target.checked });
                            setcustomTrackerLinks('surveyCompleted', commonUrl);
                            manipulateEventArray('SURVEY_COMPLETED', e.target.checked);
                          }}
                        />
                      }
                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                      label={t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_COMPLETED_URL')}
                    />
                  </S.Checks>}
                </div>
              </S.CommonUrl>
            ) : (
              <S.Inputs className="custom-tracker-wrapper">

                <Grid container>
                  <div className="row">
                    <Grid item xs={12} sm={6} className="form-row">
                      <TextField
                        id="outlined-required"
                        label={`${t('SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_SHOWN_URL')} ${t('CREATIVE_TAB_URL')}`}
                        value={notificationShownUrl}
                        disabled={(state.formValues.registration.campaignType === 'inApp') || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        onChange={(e) => {
                          handleChange(e);
                          setNonCommonCustomTrackerLink('notificationShown', e.currentTarget.value);
                          setcustomTrackerLinks('notificationShown', e.target.value);
                        }}
                        onBlur={(e) => {
                          handleBlur(e);
                          setNonCommonCustomTrackerLink('notificationShown', e.currentTarget.value, [], true);
                          setcustomTrackerLinks('notificationShown', e.target.value);
                        }}
                        name="notificationShownUrl"
                        placeholder={t('SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_SHOWN_URL_PLACEHOLDER')}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        type="text"
                      />
                      <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                      <p className="error-wrap error">{errorObjectNonCommonUrl['notificationShown']}</p>
                      <p className="information">{urlProtocolWarningNonCommonUrl['notificationShown']}</p>
                    </Grid>
                    <Grid item xs={12} sm={6} className="form-row">
                      <TextField
                        id="outlined-required"
                        label={`${t('SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_CLICKED_URL')} ${t('CREATIVE_TAB_URL')}`}
                        value={notificationClickedUrl}
                        disabled={(state.formValues.registration.campaignType === 'inApp') || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        name="notificationClickedUrl"
                        onBlur={(e) => {
                          handleBlur(e);
                          setNonCommonCustomTrackerLink('notificationClicked', e.currentTarget.value, [], true);
                          setcustomTrackerLinks('notificationClicked', e.target.value);
                        }}
                        onChange={(e) => {
                          handleChange(e);
                          setNonCommonCustomTrackerLink('notificationClicked', e.currentTarget.value);
                          setcustomTrackerLinks('notificationClicked', e.target.value);
                        }}
                        variant="outlined"
                        placeholder={t('SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_CLICKED_URL_PLACEHOLDER')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        type="text"
                      />
                      <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                      <p className="error-wrap error">{errorObjectNonCommonUrl['notificationClicked']}</p>
                      <p className="information">{urlProtocolWarningNonCommonUrl['notificationClicked']}</p>
                    </Grid>
                    <Grid item xs={12} sm={6} className="form-row">
                      <TextField
                        id="outlined-required"
                        label={`${t('SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_SHOWN_URL')} ${t('CREATIVE_TAB_URL')}`}
                        value={bannerShownUrl}
                        name="bannerShownUrl"
                        disabled={(state.formValues.registration.campaignType === 'push') || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        onBlur={(e) => {
                          handleBlur(e);
                          setNonCommonCustomTrackerLink('bannerShown', e.currentTarget.value, [], true);
                          setcustomTrackerLinks('bannerShown', e.target.value);
                        }}
                        onChange={(e) => {
                          handleChange(e);
                          setNonCommonCustomTrackerLink('bannerShown', e.currentTarget.value);
                          setcustomTrackerLinks('bannerShown', e.target.value);
                        }}
                        variant="outlined"
                        placeholder={t('SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_SHOWN_URL_PLACEHOLDER')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        type="text"
                      />
                      <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                      <p className="error-wrap error">{errorObjectNonCommonUrl['bannerShown']}</p>
                      <p className="information">{urlProtocolWarningNonCommonUrl['bannerShown']}</p>
                    </Grid>
                    <Grid item xs={12} sm={6} className="form-row">
                      <TextField
                        id="outlined-required"
                        label={`${t('SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_CLICKED_URL')} ${t('CREATIVE_TAB_URL')}`}
                        value={bannerClickedUrl}
                        name="bannerClickedUrl"
                        disabled={(state.formValues.registration.campaignType === 'push') || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        onBlur={(e) => {
                          handleBlur(e);
                          setNonCommonCustomTrackerLink('bannerClicked', e.currentTarget.value, [], true);
                          setcustomTrackerLinks('bannerClicked', e.target.value);
                        }}
                        onChange={(e) => {
                          handleChange(e);
                          setNonCommonCustomTrackerLink('bannerClicked', e.currentTarget.value);
                          setcustomTrackerLinks('bannerClicked', e.target.value);
                        }}
                        variant="outlined"
                        placeholder={t('SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_CLICKED_URL_PLACEHOLDER')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        type="text"
                      />
                      <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                      <p className="error-wrap error">{errorObjectNonCommonUrl['bannerClicked']}</p>
                      <p className="information">{urlProtocolWarningNonCommonUrl['bannerClicked']}</p>
                    </Grid>
                    <Grid item xs={12} sm={6} className="form-row">
                      <TextField
                        id="outlined-required"
                        label={`${t('SETTINGS_CUSTOM_TRACKER_SECTION_ACTION_COMPLETE_URL')} ${t('CREATIVE_TAB_URL')}`}
                        name="actionCompleteUrl"
                        value={actionCompleteUrl}
                        disabled={(state.formValues.registration.campaignType === 'push') || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        onBlur={(e) => {
                          handleBlur(e);
                          setNonCommonCustomTrackerLink('actionComplete', e.target.value, [], true);
                          setcustomTrackerLinks('actionComplete', e.target.value);
                        }}
                        error={Boolean(touched.actionCompleteUrl && errors.actionCompleteUrl)}
                        helperText={touched.actionCompleteUrl && errors.actionCompleteUrl}
                        onChange={(e) => {
                          handleChange(e);
                          setNonCommonCustomTrackerLink('actionComplete', e.target.value);
                          setcustomTrackerLinks('actionComplete', e.target.value);
                        }}
                        variant="outlined"
                        placeholder={t('SETTINGS_CUSTOM_TRACKER_SECTION_ACTION_COMPLETE_URL_PLACEHOLDER')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        type="text"
                      />
                      <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                      <p className="error-wrap error">{errorObjectNonCommonUrl['actionComplete']}</p>
                      <p className="information">{urlProtocolWarningNonCommonUrl['actionComplete']}</p>
                    </Grid>
                    <Grid item xs={12} sm={6} className="form-row">
                    </Grid>
                    {state.formValues.registration.campaignObjectiveName === 'surveyAd' && <hr style={{ width: "100%", borderColor: `${Colors.BGGRAY}`, height: '1px' }}></hr>}
                    {state.formValues.registration.campaignObjectiveName === 'surveyAd' && <br />}
                    {state.formValues.registration.campaignObjectiveName === 'surveyAd' && <br />}
                    {state.formValues.registration.campaignObjectiveName === 'surveyAd' && <Grid item xs={12} sm={6} className="form-row">
                      <TextField
                        id="outlined-required"
                        label={`${t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_OPEN_URL')} ${t('CREATIVE_TAB_URL')}`}
                        name="surveyOpenUrl"
                        value={surveyOpenUrl}
                        disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        onBlur={(e) => {
                          handleBlur(e);
                          setNonCommonCustomTrackerLink('surveyOpen', e.target.value, [], true);
                          setcustomTrackerLinks('surveyOpen', e.target.value);
                        }}
                        error={Boolean(touched.surveyOpenUrl && errors.surveyOpenUrl)}
                        helperText={touched.surveyOpenUrl && errors.surveyOpenUrl}
                        onChange={(e) => {
                          handleChange(e);
                          setNonCommonCustomTrackerLink('surveyOpen', e.target.value);
                          setcustomTrackerLinks('surveyOpen', e.target.value);
                        }}
                        variant="outlined"
                        placeholder={t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_OPEN_URL_PLACEHOLDER')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        type="text"
                      />
                      <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                      <p className="error-wrap error">{errorObjectNonCommonUrl['surveyOpen']}</p>
                      <p className="information">{urlProtocolWarningNonCommonUrl['surveyOpen']}</p>
                    </Grid>}
                    {state.formValues.registration.campaignObjectiveName === 'surveyAd' && <Grid item xs={12} sm={6} className="form-row">
                      <TextField
                        id="outlined-required"
                        label={`${t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_CLOSED_URL')} ${t('CREATIVE_TAB_URL')}`}
                        name="surveyClosedUrl"
                        value={surveyClosedUrl}
                        disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        onBlur={(e) => {
                          handleBlur(e);
                          setNonCommonCustomTrackerLink('surveyClosed', e.target.value, [], true);
                          setcustomTrackerLinks('surveyClosed', e.target.value);
                        }}
                        error={Boolean(touched.surveyClosedUrl && errors.surveyClosedUrl)}
                        helperText={touched.surveyClosedUrl && errors.surveyClosedUrl}
                        onChange={(e) => {
                          handleChange(e);
                          setNonCommonCustomTrackerLink('surveyClosed', e.target.value);
                          setcustomTrackerLinks('surveyClosed', e.target.value);
                        }}
                        variant="outlined"
                        placeholder={t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_CLOSED_URL_PLACEHOLDER')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        type="text"
                      />
                      <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                      <p className="error-wrap error">{errorObjectNonCommonUrl['surveyClosed']}</p>
                      <p className="information">{urlProtocolWarningNonCommonUrl['surveyClosed']}</p>
                    </Grid>}
                    {state.formValues.registration.campaignObjectiveName === 'surveyAd' && <Grid item xs={12} sm={6} className="form-row">
                      <TextField
                        id="outlined-required"
                        label={`${t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_COMPLETED_URL')} ${t('CREATIVE_TAB_URL')}`}
                        name="surveyCompletedUrl"
                        value={surveyCompletedUrl}
                        disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        onBlur={(e) => {
                          handleBlur(e);
                          setNonCommonCustomTrackerLink('surveyCompleted', e.target.value, [], true);
                          setcustomTrackerLinks('surveyCompleted', e.target.value);
                        }}
                        error={Boolean(touched.surveyCompletedUrl && errors.surveyCompletedUrl)}
                        helperText={touched.surveyCompletedUrl && errors.surveyCompletedUrl}
                        onChange={(e) => {
                          handleChange(e);
                          setNonCommonCustomTrackerLink('surveyCompleted', e.target.value);
                          setcustomTrackerLinks('surveyCompleted', e.target.value);
                        }}
                        variant="outlined"
                        placeholder={t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_COMPLETED_URL_PLACEHOLDER')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        type="text"
                      />
                      <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                      <p className="error-wrap error">{errorObjectNonCommonUrl['surveyCompleted']}</p>
                      <p className="information">{urlProtocolWarningNonCommonUrl['surveyCompleted']}</p>
                    </Grid>}
                  </div>
                </Grid>
              </S.Inputs>
            )}
          </form>
        )}
      </Formik>
    </S.Container>
  );
};

export default CustomTrackerLinks;
