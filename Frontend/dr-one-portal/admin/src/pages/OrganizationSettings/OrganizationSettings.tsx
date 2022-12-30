import React, { useState, useEffect, useContext } from "react";
import * as S from './OrganizationSetting.styles'
import { Button, Grid } from "@material-ui/core";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { Breadcrumb, SnackBarMessage, Spinner } from "@dr-one/shared-component";
import General from "./General/General";
import Campaign from "./Campaign/Campaign";
import VasDefault from "./VasDefault/VasDefault";
import Adlimit from './AdLimit/Adlimit';
import Survey from './Survey/Survey'
import ExternalOrgSupport from "./ExternalOrgSupport/ExternalOrgSupport";
import Fcm from "./Fcm/Fcm";
import VirtualPayload from "./VirtualPayload/VirtualPreload";
import Report from "./Report/Report";
import { GlobalContext, campaignDeliverySlot } from '../../context/globalState';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams, useHistory } from "react-router-dom";
import Apns from './APNS/Apns';
import CampaignDeliveryWindow from "./CampaignDeliveryWindow/CampaignDeliveryWindow";

function OrganizationSettings() {
  const { t } = useTranslation();
  const hierarchyList = [`${t('ADMIN')}`, `${t('ORGANIZATION_SETTINGS')}`];
  const { state, dispatch } = useContext(GlobalContext);
  const [tabIndex, setTabIndex] = useState(0);
  const [sucessMessage, setSucessMessage] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [orgSettingList, setOrgSettingList] = useState<any>([]);
  const [disable, setDisable] = useState(false);
  const [organizationModifyError, setOrganizationModifyError] = useState('');
  const [pageLoader, setLoading] = useState(true);
  const [spinner, setSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageFlag, setErrorMessageflag] = useState(false)
  const orgId = JSON.parse(localStorage.getItem('dr-user')).organizationActive;
  const param = useParams()
  const [editId, setEditId] = useState('')
  const { isValid } = state.orgSetting.general;
  const { isValidCampaign } = state.orgSetting.campaign;
  const { isValidVirtualPayload } = state.orgSetting.virtualPayload;
  const { isValidVasDefault } = state.orgSetting.vasDefault;
  const { isValidAdlimit } = state.orgSetting.adLimit;
  const { isValidSurvey } = state.orgSetting.survey;
  const { validEmail } = state.orgSetting.report;
  const { isValidExternalOrgSupport } = state.orgSetting.externalOrgSupport;
  const [apnsData, setApnsData] = useState(null);
  const { isValidCampaignDeliveryWindow } = state.orgSetting.campaignDeliveryWindow;
  const [orgLoadPayload, setOrgLoadPayload] = useState<any>({})
  const [copyOrgLoadPayload, setCopyOrgLoadPayload] = useState<any>({})
  const history = useHistory();

  const handleChange = (event: any, newValue: number): void => {
    setTabIndex(newValue);
  };
  const a11yProps = (index: number): any => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const localObjadmin = {
    ...state.orgSetting.general,
    ...state.orgSetting.campaign,
    ...state.orgSetting.virtualPayload,
    ...state.orgSetting.vasDefault,
    ...state.orgSetting.adLimit,
    ...state.orgSetting.survey,
    ...state.orgSetting.externalOrgSupport,
    ...state.orgSetting.report,
    ...state.orgSetting.fcm,
    ...state.orgSetting.campaignDeliveryWindow,
  }
  const copylocalObj = JSON.parse(JSON.stringify(localObjadmin));
  delete copylocalObj.isValid;
  delete copylocalObj.isValidAdlimit;
  delete copylocalObj.isValidCampaign;
  delete copylocalObj.isValidCampaignDeliveryWindow;
  delete copylocalObj.isValidExternalOrgSupport;
  delete copylocalObj.isValidSurvey;
  delete copylocalObj.isValidVasDefault;
  delete copylocalObj.isValidVirtualPayload
  copylocalObj?.slots?.forEach(items => delete items?.id);
  // delete localObj.isOnCustomDeliveryWindow
  const getSingleOrganizationForEdit = (organizationId: string) => {
    apiDashboard
      .get(`campaign-mgmt-api/organizations/${organizationId}`)
      .then(response => {
        setOrgSettingList(response.data.data);
        setOrganizationModifyError('')
        setLoading(false)
        const modifiedPayload = Object.assign({}, state.orgSetting);
        modifiedPayload['general']['editPromptLoader'] = param?.id === undefined ? false : true;
        modifiedPayload['general']['name'] = response.data.data.name;
        modifiedPayload['general']['imageLogo'] = response.data.data.logoFullPath;
        modifiedPayload['general']['imageId'] = response.data.data.logoFileId;
        modifiedPayload['general']['timezone'] = response.data.data.timeZone;
        modifiedPayload['general']['locationHistoryCleanUp'] = response.data.data.locationHistoryCleanUp;
        modifiedPayload['general']['language'] = response.data.data.language;
        modifiedPayload['general']['dormantDeviceFilterDays'] = response.data.data.dormantDeviceFilterDays;
        modifiedPayload['general']['countryISOCode'] = response.data.data.countryISOCode;
        modifiedPayload['general']['dataExpirySetting'] = response.data.data.dataExpirySetting;
        modifiedPayload['general']['limit'] = response.data.data.limit;
        modifiedPayload['general']['preloadCallbackInterval'] = response.data.data.preloadCallbackInterval;
        modifiedPayload['campaign']['s3AdUrl'] = response.data.data.s3AdUrl;
        modifiedPayload['campaign']['mainImageSize'] = response.data.data.mainImageSize;
        modifiedPayload['campaign']['videoImageSize'] = response.data.data.videoImageSize;
        // modifiedPayload['campaign']['apkImageSize'] = response.data.data.apkImageSize;
        modifiedPayload['campaign']['clientIdForReachCount'] = response.data.data.excludeIuClientIds;
        modifiedPayload['campaign']['gifImageSize'] = response.data.data.gifImageSize === null ? '4000' : response.data.data.gifImageSize;
        modifiedPayload['campaign']['notificationImageSize'] = response.data.data.notificationImageSize;
        modifiedPayload['campaign']['fsImageSize'] = response.data.data.fsImageSize;
        modifiedPayload['campaign']['startTime'] = response.data.data.startTime;
        modifiedPayload['campaign']['endTime'] = response.data.data.endTime;
        modifiedPayload['virtualPayload']['agencyId'] = response.data.data.defaultsForCampaign.agencyId;
        modifiedPayload['virtualPayload']['advertiserId'] = response.data.data.defaultsForCampaign.advertiserId;
        modifiedPayload['virtualPayload']['clusterId'] = response.data.data.defaultsForCampaign.clusterId;
        modifiedPayload['virtualPayload']['campaignCategoryid'] = response.data.data.defaultsForCampaign.campaignCategoryId;
        modifiedPayload['virtualPayload']['campaignObjectiveId'] = response.data.data.defaultsForCampaign.campaignObjectiveId;
        modifiedPayload['virtualPayload']['preloadDeliveryStrategyid'] = response.data.data.preloadDeliveryStrategy;
        modifiedPayload['virtualPayload']['maxAcceleratedTimeDuration'] = response.data.data.maxAcceleratedTimeDuration;
        modifiedPayload['virtualPayload']['sourcePackage'] = response.data.data.preloadSrcPackages;
        modifiedPayload['virtualPayload']['apkFileMaxSize'] = response.data.data.apkImageSize.toString();
        modifiedPayload['vasDefault']['preSubscriptionTitle'] = response.data.data.vasDefaults.preSubscriptionTitle;
        modifiedPayload['vasDefault']['preSubscriptionText'] = response.data.data.vasDefaults.preSubscriptionText;
        modifiedPayload['vasDefault']['preSubscriptionActionText'] = response.data.data.vasDefaults.preSubscriptionActionText;
        modifiedPayload['vasDefault']['preSubscriptionPositiveText'] = response.data.data.vasDefaults.preSubscriptionPositiveText;
        modifiedPayload['vasDefault']['preSubscriptionNegativeText'] = response.data.data.vasDefaults.preSubscriptionNegativeText;
        modifiedPayload['vasDefault']['processingText'] = response.data.data.vasDefaults.processingText;
        modifiedPayload['vasDefault']['defaultActionText'] = response.data.data.vasDefaults.defaultActionText;
        modifiedPayload['vasDefault']['defaultFailureText'] = response.data.data.vasDefaults.defaultFailureText;
        modifiedPayload['adLimit']['campaignSchedulerAdLimit'] = response.data.data.adLimits.campaignSchedulerAdLimit;
        modifiedPayload['adLimit']['max'] = response.data.data.adLimits.max;
        modifiedPayload['adLimit']['rollingDays'] = response.data.data.adLimits.rollingDays;
        modifiedPayload['adLimit']['apiDrivenAdLimit'] = response.data.data.adLimits.apiDrivenAdLimit;
        modifiedPayload['adLimit']['autoSchedulerAdLimit'] = response.data.data.adLimits.autoSchedulerAdLimit;
        modifiedPayload['adLimit']['maxInterstitial'] = response.data.data.adLimits.maxInterstitial;
        modifiedPayload['adLimit']['rollingDaysInterstitial'] = response.data.data.adLimits.rollingDaysInterstitial;
        modifiedPayload['adLimit']['adsTargetingInterstitialStrategy'] = response.data.data.adLimits.adsTargetingInterstitialStrategy;
        modifiedPayload['adLimit']['interstitialInterval'] = response.data.data.interstitialInterval;
        modifiedPayload['report']['automaticallyEmailReport'] = response.data.data.reportSetting.automaticallyEmailReport.toString();
        modifiedPayload['report']['emailDistribution'] = response.data.data.reportSetting.emails;
        modifiedPayload['report']['roles'] = response.data.data.reportSetting.roles;
        modifiedPayload['survey']['enableSurvey'] = response.data.data.enableSurvey;
        modifiedPayload['survey']['numberOfQuestion'] = response.data.data.noOfQuestions;
        modifiedPayload['externalOrgSupport']['externalIdRequired'] = response.data.data.externalIdRequired;
        modifiedPayload['externalOrgSupport']['orgId'] = response.data.data.externalOrgId;
        modifiedPayload['fcm']['fcmDataList'] = response.data.data.fcmInfos;
        setApnsData(response.data.data.apnsInfo);
        modifiedPayload['campaignDeliveryWindow']['isOnCustomDeliveryWindow'] = response.data.data.campaignDeliveryWindow ?
          response.data.data.campaignDeliveryWindow?.onCustomDeliveryWindow : false;
        const slots = [campaignDeliverySlot()];
        slots[0]['time'][0] = (response.data.data.campaignDeliveryWindow && response.data.data.campaignDeliveryWindow.times?.length !== 0) ? (response.data.data.campaignDeliveryWindow.times[0].startTime) / 60 : 10;
        slots[0]['time'][1] = (response.data.data.campaignDeliveryWindow && response.data.data.campaignDeliveryWindow.times?.length !== 0) ? (response.data.data.campaignDeliveryWindow.times[0].endTime) / 60 : 17;
        modifiedPayload['campaignDeliveryWindow']['slots'] = slots;
        if (response.data.data.campaignDeliveryWindow && response.data.data.campaignDeliveryWindow.times?.length !== 0) {
          if (response.data.data.campaignDeliveryWindow.times[0].startTime >= response.data.data.campaignDeliveryWindow.times[0].endTime) {
            modifiedPayload['campaignDeliveryWindow']['isValidCampaignDeliveryWindow'] = false;
          } else {
            modifiedPayload['campaignDeliveryWindow']['isValidCampaignDeliveryWindow'] = true;
          }
        } else {
          modifiedPayload['campaignDeliveryWindow']['isValidCampaignDeliveryWindow'] = true;
        }
        modifiedPayload['general']['orgPromptLoader'] = param?.id === undefined ? true : false;
        dispatch({
          type: "UPDATE_ORGANIZATION_PAYLOAD",
          payload: {
            orgSetting: modifiedPayload
          }
        });
        Mixpanel.track(
          'Edit Organization Page View',
          { orgId: organizationId, orgName: response.data.data.name }
        );
      }, error => {
        setOrgSettingList([]);
        setLoading(false);
        setOrganizationModifyError(helper.getErrorMessage(error));
      });
  }
  useEffect(() => {
    if (param?.id) {
      setEditId(param?.id)
      getSingleOrganizationForEdit(param.id)
    }
    else {
      setEditId(orgId)
      getSingleOrganizationForEdit(orgId)
    }
  }, [param?.id, orgId])
  const { advertiserId, agencyId, campaignCategoryid, campaignObjectiveId, clusterId } = state.orgSetting?.virtualPayload;
  useEffect(() => {
    if (window.location.pathname.indexOf('setting') > 0 && advertiserId?.length > 0 && agencyId?.length > 0 && campaignCategoryid?.length > 0 || campaignObjectiveId?.length > 0 && clusterId?.length > 0) {
      setCopyOrgLoadPayload(copylocalObj)
    } else if (window.location.pathname.indexOf('edit') > 0 || orgSettingList.logoFullPath?.length > 0 && orgSettingList.s3AdUrl?.length > 0) {
      setCopyOrgLoadPayload(copylocalObj)
    }
  }, [orgSettingList.logoFullPath?.length > 0, orgSettingList.s3AdUrl?.length > 0, window.location.pathname.indexOf('edit') > 0, orgSettingList?.defaultsForCampaign?.advertiserId?.length > 0 && orgSettingList?.defaultsForCampaign?.agencyId?.length > 0 && orgSettingList?.defaultsForCampaign?.campaignCategoryid?.length > 0 || orgSettingList?.defaultsForCampaign?.campaignObjectiveId?.length > 0 && orgSettingList?.defaultsForCampaign?.clusterId?.length > 0, copylocalObj?.name?.length > 0, param?.id, orgId, orgId?.length > 0, advertiserId?.length > 0 && agencyId?.length > 0 && campaignCategoryid?.length > 0 || campaignObjectiveId?.length > 0 && clusterId?.length > 0, state.orgSetting.general.orgPromptLoader, state.orgSetting.general.editPromptLoader])
  useEffect(() => {
    setOrgLoadPayload(copylocalObj);
    if (orgSettingList.logoFullPath?.length > 0 && orgSettingList.s3AdUrl?.length > 0 || orgSettingList?.defaultsForCampaign?.advertiserId?.length > 0 && orgSettingList?.defaultsForCampaign?.agencyId?.length > 0 && orgSettingList?.defaultsForCampaign?.campaignCategoryid?.length > 0 || orgSettingList?.defaultsForCampaign?.campaignObjectiveId?.length > 0 && orgSettingList?.defaultsForCampaign?.clusterId?.length > 0 && advertiserId?.length > 0 && agencyId?.length > 0 && campaignCategoryid?.length > 0 && clusterId?.length > 0 || window.location.pathname.indexOf('edit') > 0) {
      if (JSON.stringify(copyOrgLoadPayload) === JSON.stringify(orgLoadPayload)) {
        sessionStorage.setItem('enablePrompt', 'false')
      } else {
        sessionStorage.setItem('enablePrompt', 'true')
      }
    }
  }, [orgSettingList.logoFullPath?.length > 0, orgSettingList.s3AdUrl?.length > 0, orgSettingList?.defaultsForCampaign?.advertiserId?.length > 0 && orgSettingList?.defaultsForCampaign?.agencyId?.length > 0 && orgSettingList?.defaultsForCampaign?.campaignCategoryid?.length > 0 || orgSettingList?.defaultsForCampaign?.campaignObjectiveId?.length > 0 && orgSettingList?.defaultsForCampaign?.clusterId?.length > 0, orgSettingList?.defaultsForCampaign, state.orgSetting, JSON.stringify(copyOrgLoadPayload) === JSON.stringify(orgLoadPayload)])
  const onSubmitOrgnization = () => {
    setSpinner(true);
    setDisable(true);
    const organisationArray = JSON.parse(localStorage.getItem('dr-user'))?.organizations;
    const orgIndex = organisationArray.findIndex(org => org.id === orgId);
    const weekArray = [0, 1, 2, 3, 4, 5, 6];
    const timesArray = [];
    weekArray.forEach((day, index) => {
      timesArray.push({
        dayOfWeek: day,
        startTime: state.orgSetting.campaignDeliveryWindow.slots[0].time[0] * 60,
        endTime: state.orgSetting.campaignDeliveryWindow.slots[0].time[1] === 24 ? 1439 :
          state.orgSetting.campaignDeliveryWindow.slots[0].time[1] * 60
      })
    })

    apiDashboard.put(`campaign-mgmt-api/organizations/${editId}`, {
      apkImageSize: state.orgSetting.virtualPayload.apkFileMaxSize,
      bannerImageSize: "100",
      logoFileId: state.orgSetting.general.imageId,
      logoFullPath: state.orgSetting.general.imageLogo,
      downloadSettingsFeature: true,
      endTime: state.orgSetting.campaign.endTime ? state.orgSetting.campaign.endTime : "23:59",
      fsImageSize: state.orgSetting.campaign.fsImageSize,
      language: state.orgSetting.general.language,
      locationHistoryCleanUp: state.orgSetting.general.locationHistoryCleanUp,
      mainImageSize: state.orgSetting.campaign.mainImageSize,
      name: state.orgSetting.general.name,
      notificationImageSize: state.orgSetting.campaign.notificationImageSize,
      dataExpirySetting: state.orgSetting.general.dataExpirySetting ? state.orgSetting.general.dataExpirySetting : "180",
      s3AdUrl: state.orgSetting.campaign.s3AdUrl,
      startTime: state.orgSetting.campaign.startTime ? state.orgSetting.campaign.startTime : "02:01",
      limit: state.orgSetting.general.limit ? state.orgSetting.general.limit : "10",
      timeZone: state.orgSetting.general.timezone,
      videoImageSize: state.orgSetting.campaign.videoImageSize,
      dormantDeviceFilterDays: state.orgSetting.general.dormantDeviceFilterDays,
      maxAcceleratedTimeDuration: state.orgSetting.virtualPayload.maxAcceleratedTimeDuration,
      instructionDeliveryFlag: false,
      preloadCallbackInterval: state.orgSetting.general.preloadCallbackInterval ? state.orgSetting.general.preloadCallbackInterval : "2000",
      excludeIuClientIds: state.orgSetting.campaign.clientIdForReachCount,
      defaultsForCampaign: {
        agencyId: state.orgSetting.virtualPayload.agencyId,
        advertiserId: state.orgSetting.virtualPayload.advertiserId,
        clusterId: state.orgSetting.virtualPayload.clusterId,
        campaignCategoryId: state.orgSetting.virtualPayload.campaignCategoryid,
        campaignObjectiveId: state.orgSetting.virtualPayload.campaignObjectiveId
      },
      fcmInfos: state.orgSetting.fcm.fcmDataList,
      preloadSrcPackages: state.orgSetting.virtualPayload.sourcePackage ? state.orgSetting.virtualPayload.sourcePackage : [],
      preloadDeliveryStrategy: state.orgSetting.virtualPayload.preloadDeliveryStrategyid,
      countryISOCode: state.orgSetting.general.countryISOCode,
      vasDefaults: {
        preSubscriptionText: state.orgSetting.vasDefault.preSubscriptionText,
        preSubscriptionTitle: state.orgSetting.vasDefault.preSubscriptionTitle,
        preSubscriptionActionText: state.orgSetting.vasDefault.preSubscriptionActionText,
        preSubscriptionPositiveText: state.orgSetting.vasDefault.preSubscriptionNegativeText,
        preSubscriptionNegativeText: state.orgSetting.vasDefault.preSubscriptionNegativeText,
        processingText: state.orgSetting.vasDefault.processingText,
        defaultActionText: state.orgSetting.vasDefault.defaultActionText,
        defaultFailureText: state.orgSetting.vasDefault.defaultFailureText
      },
      adLimits: {
        campaignSchedulerAdLimit: state.orgSetting.adLimit.campaignSchedulerAdLimit,
        apiDrivenAdLimit: state.orgSetting.adLimit.apiDrivenAdLimit ? state.orgSetting.adLimit.apiDrivenAdLimit : "3",
        autoSchedulerAdLimit: state.orgSetting.adLimit.autoSchedulerAdLimit ? state.orgSetting.adLimit.autoSchedulerAdLimit : "3",
        max: state.orgSetting.adLimit.max,
        rollingDays: state.orgSetting.adLimit.rollingDays,
        maxInterstitial: state.orgSetting.adLimit.maxInterstitial ? state.orgSetting.adLimit.maxInterstitial : "100",
        rollingDaysInterstitial: state.orgSetting.adLimit.rollingDaysInterstitial ? state.orgSetting.adLimit.rollingDaysInterstitial : "5",
        adsTargetingInterstitialStrategy: state.orgSetting.adLimit.adsTargetingInterstitialStrategy ? state.orgSetting.adLimit.adsTargetingInterstitialStrategy : "ROUND_ROBIN"
      },
      interstitialInterval: state.orgSetting.adLimit.interstitialInterval ? state.orgSetting.adLimit.interstitialInterval : "30",
      reportSetting: {
        automaticallyEmailReport: state.orgSetting.report.automaticallyEmailReport,
        emails: state.orgSetting.report.emailDistribution,
        roles: state.orgSetting.report.roles,
        reportEmailsFrequency: "EOC",
        reportType: "CAMPAIGN_RESULTS",
        sendEmailAtTime: "1439"
      },
      enableSurvey: state.orgSetting.survey.enableSurvey,
      noOfQuestions: state.orgSetting.survey.numberOfQuestion,
      gifImageSize: state.orgSetting.campaign.gifImageSize,
      dormantDaysPhoneNumberCluster: "7",
      externalIdRequired: state.orgSetting.externalOrgSupport.externalIdRequired,
      externalOrgId: state.orgSetting.externalOrgSupport.orgId,
      apnsInfo: apnsData,
      campaignDeliveryWindow: !state.orgSetting.campaignDeliveryWindow.isOnCustomDeliveryWindow ? null : {
        onCustomDeliveryWindow: state.orgSetting.campaignDeliveryWindow.isOnCustomDeliveryWindow,
        times: timesArray
      }
    }).then((response) => {
      setDisable(false);
      setSpinner(false);
      setSucessMessage(true);
      setSnackBarMessage(response.data.message);
      setOrganizationModifyError('');

      if (window.location.pathname === '/organization/settings') {
        if (orgIndex > -1) {
          if ((state.orgSetting.general.timezone !== organisationArray[orgIndex].timeZone) || (state.orgSetting.general.imageLogo !==
            organisationArray[orgIndex].logoFullPath) || (state.orgSetting.campaign.fsImageSize !== organisationArray[orgIndex].fsImageSize) ||
            (state.orgSetting.campaign.gifImageSize !== organisationArray[orgIndex].gifImageSize) || (state.orgSetting.campaign.mainImageSize !== organisationArray[orgIndex].mainImageSize) ||
            (state.orgSetting.campaign.notificationImageSize !== organisationArray[orgIndex].notificationImageSize) ||
            (state.orgSetting.campaign.videoImageSize !== organisationArray[orgIndex].videoImageSize) ||
            (Number(state.orgSetting.survey.numberOfQuestion) !== Number(organisationArray[orgIndex].noOfQuestions))) {
            if (state.orgSetting.general.timezone !== organisationArray[orgIndex].timeZone) {
              organisationArray[orgIndex].timeZone = state.orgSetting.general.timezone;
            }
            if (state.orgSetting.general.imageLogo !== organisationArray[orgIndex].logoFullPath) {
              organisationArray[orgIndex].logoFullPath = state.orgSetting.general.imageLogo;
            }
            if (state.orgSetting.campaign.fsImageSize !== organisationArray[orgIndex].fsImageSize) {
              organisationArray[orgIndex].fsImageSize = state.orgSetting.campaign.fsImageSize;
            }
            if (state.orgSetting.campaign.gifImageSize !== organisationArray[orgIndex].gifImageSize) {
              organisationArray[orgIndex].gifImageSize = state.orgSetting.campaign.gifImageSize;
            }
            if (state.orgSetting.campaign.mainImageSize !== organisationArray[orgIndex].mainImageSize) {
              organisationArray[orgIndex].mainImageSize = state.orgSetting.campaign.mainImageSize;
            }
            if (state.orgSetting.campaign.notificationImageSize !== organisationArray[orgIndex].notificationImageSize) {
              organisationArray[orgIndex].notificationImageSize = state.orgSetting.campaign.notificationImageSize;
            }
            if (state.orgSetting.campaign.videoImageSize !== organisationArray[orgIndex].videoImageSize) {
              organisationArray[orgIndex].videoImageSize = state.orgSetting.campaign.videoImageSize;
            }
            if (Number(state.orgSetting.survey.numberOfQuestion) !== Number(organisationArray[orgIndex].noOfQuestions)) {
              organisationArray[orgIndex].noOfQuestions = state.orgSetting.survey.numberOfQuestion;
            }

            const drUserObject = {
              email: JSON.parse(localStorage.getItem('dr-user'))?.email,
              name: JSON.parse(localStorage.getItem('dr-user'))?.name,
              organizationActive: JSON.parse(localStorage.getItem('dr-user'))?.organizationActive,
              organizations: organisationArray,
              permissions: JSON.parse(localStorage.getItem('dr-user'))?.permissions
            }
            localStorage.setItem('dr-user', JSON.stringify(drUserObject));
            window.location.reload();
          }
        }
      } else {
        setTimeout(() => {
          history.push('/organization/manage');
        }, 2000);
      }
    }).catch(error => {
      setDisable(false);
      setErrorMessageflag(true);
      setSpinner(false);
      setErrorMessage(helper.getErrorMessage(error));
      setOrganizationModifyError(helper.getErrorMessage(error));
    })
    sessionStorage.setItem('enablePrompt', 'false')
  }

  const updateAPNS = (apnsDataValue: any) => {
    setApnsData(apnsDataValue);
  }

  if (pageLoader) {
    return (
      <div className='align-center loader-position'>
        {/* <div className='align-center'> */}
        <CircularProgress color="primary" />
      </div>
    )
  }
  return (
    <S.Container >
      {/* <Backdrop  open={pageLoader}>
        <CircularProgress color="primary" />
      </Backdrop> */}
      {sucessMessage && (
        <SnackBarMessage open={sucessMessage} onClose={(): void => setSucessMessage(false)}
          severityType={"success"} message={snackBarMessage} />)
      }
      {errorMessageFlag && (
        <SnackBarMessage open={errorMessageFlag} onClose={(): void => setErrorMessageflag(false)}
          severityType={"error"} message={errorMessage} />)
      }
      <Breadcrumb hierarchy={hierarchyList} />
      <div className="mb-20">
        <div>
          <h1 className="page-title">{t('ORGANIZATION')}</h1>
        </div>
      </div>
      {/* <div className="tabs-wrapper">
        <Tabs value={tabIndex} onChange={handleChange} aria-label="simple tabs example" scrollButtons="auto"
          textColor="secondary">
          <Tab label="Content management" {...a11yProps(0)} className={tabIndex === 0 ? 'cm-btn-campaign' : ''} />
          <Tab label={`${t('EDIT_ORGANIZATION')}`} {...a11yProps(0)} className={tabIndex === 0 ? 'cm-btn-active' : ''} />
          <Tab label={`${t('GLOBAL_SETTING')}`} {...a11yProps(1)} className={tabIndex === 1 ? 'cm-btn-active' : ''} />
        </Tabs>
        <div className="action-icons-container">
        </div>
      </div> */}
      <React.Fragment>
        <p className="error">{organizationModifyError}</p>
        <Grid container className="organisation-page">
          <div className="row">
            <Grid item xs={12}>
              <General />
            </Grid>
            <Grid item xs={12}>
              <Campaign />
            </Grid>
            <Grid item xs={12}>
              <VirtualPayload />
            </Grid>
            <Grid item xs={12}>
              <VasDefault />
            </Grid>
            <Grid item xs={12}>
              <Adlimit />
            </Grid>
            <Grid item xs={12} lg={5}>
              <Survey />
            </Grid>
            <Grid item xs={12} lg={7}>
              <ExternalOrgSupport />
            </Grid>
            <Grid item xs={12}>
              <Report />
            </Grid>
            <Grid item xs={12}>
              <CampaignDeliveryWindow />
            </Grid>
            <Grid item xs={12}>
              <Fcm />
            </Grid>
            <Grid item xs={12}>
              <Apns apnsInfo={apnsData} updateApnsData={updateAPNS} />
            </Grid>
          </div>
        </Grid>
      </React.Fragment>
      <div className="cc-form-wrapper organisation-footer">
        <div className="cc-global-buttons registration-btn">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="button-xs"
            onClick={onSubmitOrgnization}
            disabled={disable || validEmail || isValid || isValidCampaign || isValidVirtualPayload || isValidVasDefault || isValidAdlimit || isValidSurvey || isValidExternalOrgSupport || !isValidCampaignDeliveryWindow}
            endIcon={
              spinner && (
                <Spinner color="lightblue" />
              )
            }
          >{t('SAVE_BUTTON')}</Button>
        </div>
      </div>
    </S.Container>
  );
}

export default OrganizationSettings;