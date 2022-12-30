import React, { useState, useEffect, useContext } from "react";
import * as S from './OrganizationSetting.styles'
import { Button, Tab, Tabs, Grid } from "@material-ui/core";
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
import Apns from "./APNS/Apns";
import CampaignDeliveryWindow from './CampaignDeliveryWindow/CampaignDeliveryWindow';

function OrganizationSettings() {
    const { t } = useTranslation();
    const hierarchyList = [`${t('ADMIN')}`, `${t('ORGANIZATION_MANAGEMENT_FULL')}`, `${t('NEW')}`];
    const { state, dispatch } = useContext(GlobalContext);
    const [tabIndex, setTabIndex] = useState(0);
    const [sucessMessage, setSucessMessage] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [disable, setDisable] = useState(false);
    const [organizationModifyError, setOrganizationModifyError] = useState('');
    const [pageLoader, setLoading] = useState(false);
    const param = useParams()
    const history = useHistory();
    const { isValid } = state.orgSetting.general;
    const { isValidCampaign } = state.orgSetting.campaign;
    const { isValidVirtualPayload } = state.orgSetting.virtualPayload;
    const { isValidVasDefault } = state.orgSetting.vasDefault;
    const { isValidAdlimit } = state.orgSetting.adLimit;
    const { isValidSurvey } = state.orgSetting.survey;
    const { validEmail } = state.orgSetting.report;
    const { isValidExternalOrgSupport } = state.orgSetting.externalOrgSupport;
    const [spinner, setSpinner] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageFlag, setErrorMessageflag] = useState(false);
    const [apnsData, setApnsData] = useState(null);
    const [orgLoadPayload, setOrgLoadPayload] = useState<any>({});
    const [copyOrgLoadPayload, setCopyOrgLoadPayload] = useState<any>(state.orgSetting);

    const handleChange = (newValue: number): void => {
        setTabIndex(newValue);
    };
    const a11yProps = (index: number): any => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    const localObj = {
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
    delete localObj.isValid;
    delete localObj.isValidAdlimit;
    delete localObj.isValidCampaign;
    delete localObj.isValidCampaignDeliveryWindow;
    delete localObj.isValidExternalOrgSupport;
    delete localObj.isValidSurvey;
    delete localObj.isValidVasDefault;
    delete localObj.isValidVirtualPayload
    delete localObj.slots;

    function resetOrgState(): void {
        const modifiedPayload = Object.assign({}, state.orgSetting)
        modifiedPayload['general']['editPromptLoader'] = false;
        modifiedPayload['general']['locationHistoryCleanUp'] = "30"
        modifiedPayload['general']['language'] = "EN"
        modifiedPayload['general']['dormantDeviceFilterDays'] = "7"
        modifiedPayload['campaign']['mainImageSize'] = "300"
        modifiedPayload['campaign']['videoImageSize'] = "4000"
        // modifiedPayload['campaign']['apkImageSize'] = "20000"
        modifiedPayload['campaign']['clientIdForReachCount'] = false
        modifiedPayload['campaign']['gifImageSize'] = "4000"
        modifiedPayload['virtualPayload']['preloadDeliveryStrategyid'] = "IMEI_CHANNEL_MAPPING"
        modifiedPayload['virtualPayload']['apkFileMaxSize'] = "20000"
        modifiedPayload['adLimit']['campaignSchedulerAdLimit'] = "3"
        modifiedPayload['adLimit']['max'] = "3"
        modifiedPayload['adLimit']['rollingDays'] = "1"
        modifiedPayload['report']['automaticallyEmailReport'] = "YES"
        modifiedPayload['report']['emailDistribution'] = []
        modifiedPayload['report']['roles'] = []
        modifiedPayload['survey']['enableSurvey'] = false
        modifiedPayload['externalOrgSupport']['externalIdRequired'] = false
        modifiedPayload['fcm']['fcmDataList'] = []
        modifiedPayload['campaignDeliveryWindow']['isOnCustomDeliveryWindow'] = false
        modifiedPayload['campaignDeliveryWindow']['isValidCampaignDeliveryWindow'] = true
        modifiedPayload['campaignDeliveryWindow']['slots'] = [campaignDeliverySlot()]
        modifiedPayload['general']['orgPromptLoader'] = true;
        dispatch({
            type: 'RESET_ORGANIZATION_STATE',
            payload: {
                resetOrgSetting: modifiedPayload
            }
        })
        // setTimeout(() => {
        //     sessionStorage.setItem('enablePrompt', 'false')
        //     setLoading(true)
        // }, 2000);
    }
    useEffect(() => {
        resetOrgState()
        Mixpanel.track('Create Organization Page View');
    }, [])
    const { advertiserId, agencyId, campaignCategoryid, campaignObjectiveId, clusterId } = state.orgSetting?.virtualPayload;
    
    const pageLoad = () => {
        setCopyOrgLoadPayload(localObj)
    }

    function getAllInitialAdminData() {
        if (advertiserId?.length > 0 && agencyId?.length > 0 && campaignCategoryid?.length > 0 && campaignObjectiveId?.length > 0 && clusterId?.length > 0) {
            pageLoad()
        }
    }
    useEffect(() => {
        getAllInitialAdminData()
    }, [advertiserId?.length > 0 && agencyId?.length > 0 && campaignCategoryid?.length > 0 && campaignObjectiveId?.length > 0 && clusterId?.length > 0])

    useEffect(() => {
        setOrgLoadPayload(localObj);
        if (window.location.pathname.indexOf('new') > 0 && advertiserId?.length > 0 && agencyId?.length > 0 && campaignCategoryid?.length > 0 && campaignObjectiveId?.length > 0 && clusterId?.length > 0) {
            if (JSON.stringify(copyOrgLoadPayload) === JSON.stringify(orgLoadPayload)) {
                sessionStorage.setItem('enablePrompt', 'false')
            } else {
                sessionStorage.setItem('enablePrompt', 'true')
            }
        }
    }, [state.orgSetting, JSON.stringify(copyOrgLoadPayload) === JSON.stringify(orgLoadPayload), advertiserId, agencyId, campaignCategoryid, campaignObjectiveId, clusterId])
    function accessUserId(accessControl: string): void {
        apiDashboard.post('api/organization/create/', {
            legacy: "False",
            name: state.orgSetting.general.name,
            tier: accessControl
        }).then((response) => {
            createOrgnization(response.data.content[0].id)
        }).catch((error) => {
            setDisable(false)
            setSucessMessage(true)
            setSnackBarMessage(helper.getErrorMessage(error))
        })
    }
    function createOrgnization(orgid: string): void {
        sessionStorage.setItem('enablePrompt', 'false')
        setSpinner(true)
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
        apiDashboard.post(`campaign-mgmt-api/organizations`, {
            id: orgid,
            apkImageSize: state.orgSetting.virtualPayload.apkFileMaxSize,
            bannerImageSize: "100",
            logoFileId: state.orgSetting.general.imageId,
            logoFullPath: state.orgSetting.general.imageLogo,
            downloadSettingsFeature: true,
            endTime: "23:59",
            fsImageSize: state.orgSetting.campaign.fsImageSize,
            language: state.orgSetting.general.language,
            locationHistoryCleanUp: state.orgSetting.general.locationHistoryCleanUp,
            mainImageSize: state.orgSetting.campaign.mainImageSize,
            name: state.orgSetting.general.name,
            notificationImageSize: state.orgSetting.campaign.notificationImageSize,
            dataExpirySetting: "180",
            s3AdUrl: state.orgSetting.campaign.s3AdUrl,
            startTime: "02:01",
            limit: "10",
            timeZone: state.orgSetting.general.timezone,
            videoImageSize: state.orgSetting.campaign.videoImageSize,
            dormantDeviceFilterDays: state.orgSetting.general.dormantDeviceFilterDays,
            maxAcceleratedTimeDuration: state.orgSetting.virtualPayload.maxAcceleratedTimeDuration,
            instructionDeliveryFlag: false,
            preloadCallbackInterval: "2000",
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
                apiDrivenAdLimit: "3",
                autoSchedulerAdLimit: "3",
                max: state.orgSetting.adLimit.max,
                rollingDays: state.orgSetting.adLimit.rollingDays,
                maxInterstitial: "100",
                rollingDaysInterstitial: "5",
                adsTargetingInterstitialStrategy: "ROUND_ROBIN"
            },
            interstitialInterval: "30",
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
            setDisable(false)
            setSucessMessage(true)
            setSpinner(false)
            setSnackBarMessage(response.data.message)
            setOrganizationModifyError('')
            Mixpanel.track(
                "Organization Created",
                { "orgId": orgid, "orgName": state.orgSetting.general.name }
            );
            setTimeout(() => {
                history.push("/organization/manage");
            }, 6000);
        }).catch(error => {
            setDisable(false)
            setSpinner(false)
            setErrorMessageflag(true)
            setErrorMessage(helper.getErrorMessage(error))
            setOrganizationModifyError(helper.getErrorMessage(error))
        })
    }
    const onSubmitOrgnization = async () => {
        await apiDashboard.get('api/product_tier/list/').then((response) => {
            accessUserId(response.data.content[0].product_tiers[0])
        }).catch((error) => {
            setDisable(false)
            setSucessMessage(true)
            setSnackBarMessage(helper.getErrorMessage(error))
        })
    }

    const changeHierarchy = (hierarchyItem: string): void => {
        switch (hierarchyItem) {
            case 'Organization Management':
                // history.push("/organization/manage");
                break;
        }
    }

    const updateAPNS = (apnsDataValue: any) => {
        setApnsData(apnsDataValue);
    }

    return (
        <S.Container>
            {sucessMessage && (
                <SnackBarMessage open={sucessMessage} onClose={(): void => setSucessMessage(false)}
                    severityType={"success"} message={snackBarMessage} />)
            }
            {errorMessageFlag && (
                <SnackBarMessage open={errorMessageFlag} onClose={(): void => setErrorMessageflag(false)}
                    severityType={"error"} message={errorMessage} />)
            }
            <Breadcrumb hierarchy={hierarchyList} onHierarchyChange={(item) => changeHierarchy(item)} />
            <div className="mb-20">
                <div>
                    <h1 className="page-title">{t('ORGANIZATION')}</h1>
                </div>
            </div>
            {/* <div className="tabs-wrapper">
                <Tabs value={tabIndex} onChange={() => handleChange} aria-label="simple tabs example" scrollButtons="auto"
                    textColor="secondary">
                    <Tab label="Content management" {...a11yProps(0)} className={tabIndex === 0 ? 'cm-btn-campaign' : ''} />
                    <Tab label={`${t('NEW_ORGANIZATION')}`} {...a11yProps(0)} className={tabIndex === 0 ? 'cm-btn-active' : ''} />
                    <Tab label={`${t('GLOBAL_SETTING')}`} {...a11yProps(1)} className={tabIndex === 1 ? 'cm-btn-active' : ''} />
                </Tabs>
                <div className="action-icons-container">
                </div>
            </div> */}
            <React.Fragment>
                <p className="error">{organizationModifyError}</p>
                <Grid container spacing={3}>
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
                        <Grid item xs={5}>
                            <Survey />
                        </Grid>
                        <Grid item xs={7}>
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
                        disabled={disable || validEmail || isValid || isValidCampaign || isValidVirtualPayload || isValidVasDefault || isValidAdlimit || isValidSurvey || isValidExternalOrgSupport}
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