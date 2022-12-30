import React, { useState, useEffect, useContext, useCallback } from "react";
import * as S from "./Registration.styles";
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import {
    Button,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    FormControlLabel,
    Switch
} from "@material-ui/core";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { GlobalContext } from '../../../context/globalState';
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";
import * as yup from 'yup';
import { Formik } from 'formik';
import { useHistory, useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import { LightTooltip } from "@dr-one/shared-component";

function Registration() {
    const param = useParams();
    const { dispatch } = useContext(GlobalContext);
    const { state } = useContext(GlobalContext);
    let history = useHistory();
    const userData = JSON.parse(localStorage.getItem('dr-user'));
    const iuUserIndex = userData.organizations.findIndex(orgDetail => orgDetail.id === userData.organizationActive);
    const isIUUser = iuUserIndex > -1 ? userData.organizations[iuUserIndex].legacy : false;
    const orgTimezone = iuUserIndex > -1 ? userData.organizations[iuUserIndex].timeZone : '';
    const [campaignName, setCampaignName] = useState(state.formValues.registration.name);
    const [agency, setAgency] = useState(state.formValues.registration.agencyId);
    const [category, setCategory] = useState(state.formValues.registration.campaignCategoryName);
    const [advertiser, setAdvertiser] = useState(state.formValues.registration.advertiserId);
    const [objective, setObjective] = useState(state.formValues.registration.campaignObjectiveId);
    const [campaignTypeName, setCampaignType] = useState(state.formValues.registration.campaignType);
    const [emailListError, setEmailListError] = useState('');
    const [emailList, setEmailList] = useState(state.formValues.registration.emailDistributionList);
    const [agencyList, setAgencyList] = useState([]);
    const [advertiserList, setAdvertiserList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [campaignObjectiveList, setCampaignObjectiveList] = useState([]);
    const [campaignNameCheckError, checkCampaignName] = useState('');
    const [nameSearchFlag, setNameSearchFlag] = useState(false);
    const [objectiveName, setObjectiveName] = useState(state.formValues.registration.campaignObjectiveName);
    const [packageNameToOpenApp, setPackageNameToOpenApp] = useState(state.formValues.registration.packageNameToOpenApp);
    const [goToWeb, setGoToWeb] = useState(state.formValues.registration.goToWeb);
    const [packageNameToInstallApp, setPackageNameToInstallApp] = useState(state.formValues.registration.packageNameToInstallApp);
    const [packageName, setPackageName] = useState(state.formValues.registration.packageName);
    const [phoneToCall, setPhoneToCall] = useState(state.formValues.registration.phoneToCall);
    const [actionInTheApp, setActionInTheApp] = useState(state.formValues.registration.actionInTheApp);
    const [showMessage, setShowMessage] = useState(state.formValues.registration.showMessage);
    const [objectiveFieldError, setObjectiveFieldError] = useState({
        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
        packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
    });
    const [insertionOrderId, setInsertionOrderId] = useState(state.formValues.registration.insertionOrderId);
    const [purposeType, setPurposeType] = useState(isIUUser ? 'MONETIZATION' : state.formValues.registration.cpType);
    const [isDisableButton, toggleButtonDisable] = useState(!state.formValues.registration.isRegistrationSectionValid);
    const [urlProtocolWarning, setUrlProtocolWarning] = useState('');
    const [nonFilteredObjectiveList, setNonFilteredObjectiveList] = useState([]);

    const emailRegex = /^[\w._+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    const { t } = useTranslation();
    let campaignType = [
        { name: t('CAMPAIGN_TYPE_PUSH'), id: 'push', filePath: '/img/dr-campaign-type-push.svg', filePathAfterSelection: '/img/dr-campaign-type-push-selected.svg' },
        { name: t('CAMPAIGN_TYPE_IN_APP'), id: 'inApp', filePath: '/img/dr-campaign-type-in-app.svg', filePathAfterSelection: '/img/dr-campaign-type-in-app-selected.svg' },
        { name: t('CAMPAIGN_TYPE_PUSH_IN_APP'), id: 'pushInApp', filePath: '/img/dr-campaign-type-push-in-app.svg', filePathAfterSelection: '/img/dr-campaign-type-push-in-app-selected.svg' }
    ]

    if (isIUUser) {
        campaignType = campaignType.filter((campaign) => {
            return campaign.id !== 'inApp';
        })
    } else if (state.userType === 'FS') {
        campaignType = campaignType.filter((campaign) => {
            return campaign.id !== 'pushInApp';
        })
    } else {
        if (state.formValues.registration.cpType === 'MONETIZATION') {
            campaignType = campaignType.filter((campaign) => {
                return campaign.id !== 'inApp';
            })
        }
    }

    useEffect(() => {
        apiDashboard
            .get('campaign-mgmt-api/agency')
            .then(response => {
                setAgencyList(response.data.data.filter(agency => agency.active));
                if (window.location.pathname.indexOf('edit') < 0) {
                    if (!state.formValues.registration.agencyId) {
                        setAgency(response.data.data.filter(agency => agency.active)[0].id);
                        const modifiedPayload = Object.assign({}, state.formValues);
                        modifiedPayload['registration']['agencyId'] = response.data.data.filter(agency => agency.active)[0].id;
                        dispatch({
                            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                            payload: {
                                campaignPayload: modifiedPayload, currentPageName: 'registration',
                                campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                                campaignStepsArray: state.campaignStepsArray
                            }
                        })
                    }
                }

            }, error => {
                setAgencyList([]);
                console.log(helper.getErrorMessage(error));
            });
        apiDashboard
            .get('campaign-mgmt-api/configurations/campaigncategories')
            .then(response => {
                setCategoryList(response.data.data.filter(category => category.active));
                if (window.location.pathname.indexOf('edit') < 0) {
                    if (!state.formValues.registration.campaignCategoryName) {
                        const categoryBusinessIndex = response.data.data.findIndex(category => category.name === 'Business');
                        setCategory(categoryBusinessIndex > -1 ? response.data.data[categoryBusinessIndex].id
                            : response.data.data.filter(category => category.active)[0].id);
                        const modifiedPayload = Object.assign({}, state.formValues);
                        modifiedPayload['registration']['campaignCategoryName'] = categoryBusinessIndex > -1 ? response.data.data[categoryBusinessIndex].id
                            : response.data.data.filter(category => category.active)[0].id;
                        dispatch({
                            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                            payload: {
                                campaignPayload: modifiedPayload, currentPageName: 'registration',
                                campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                                campaignStepsArray: state.campaignStepsArray
                            }
                        })
                    }
                }
            }, error => {
                setCategoryList([]);
                console.log(helper.getErrorMessage(error));
            });
        apiDashboard
            .get('campaign-mgmt-api/advertiser')
            .then(response => {
                setAdvertiserList(response.data.data.filter(advertiser => advertiser.active));
                if (window.location.pathname.indexOf('edit') < 0) {
                    if (!state.formValues.registration.advertiserId) {
                        setAdvertiser(response.data.data.filter(advertiser => advertiser.active)[0].id);
                        const modifiedPayload = Object.assign({}, state.formValues);
                        modifiedPayload['registration']['advertiserId'] = response.data.data.filter(advertiser => advertiser.active)[0].id;
                        dispatch({
                            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                            payload: {
                                campaignPayload: modifiedPayload, currentPageName: 'registration',
                                campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                                campaignStepsArray: state.campaignStepsArray
                            }
                        })
                    }
                }
            }, error => {
                setAdvertiserList([]);
                console.log(helper.getErrorMessage(error));
            });
        apiDashboard
            .get(`campaign-mgmt-api/configurations/campaignobjectives?showHidden=false`)
            .then(response => {
                let objectiveArray = response.data.data;
                objectiveArray = objectiveArray.filter(item => item.name.indexOf('Get installs of your application directly from IU Platform') === -1);
                objectiveArray = objectiveArray.filter(item => item.name.indexOf('Show message') === -1);
                // objectiveArray = objectiveArray.filter(item => item.name.indexOf('Survey') === -1);
                objectiveArray = objectiveArray.filter(item => item.name.indexOf('Specific action inside the app​') === -1);
                setNonFilteredObjectiveList(objectiveArray);
                if (window.location.pathname.indexOf('edit') < 0) {
                    if (state.formValues.registration.cpType === 'MONETIZATION') {
                        objectiveArray = objectiveArray.filter(item => item.fields[0].indexOf('displayOnlyAd') === -1);
                    }
                    if (state.formValues.registration.cpType === 'ENGAGEMENT') {
                        objectiveArray = objectiveArray.filter(item => item.fields[0].indexOf('surveyAd') === -1);
                    }
                    if (!state.formValues.registration.campaignObjectiveId) {
                        setObjective(objectiveArray[0].id);
                        setObjectiveName(objectiveArray[0].fields[0]);
                        const modifiedPayload = Object.assign({}, state.formValues);
                        modifiedPayload['registration']['campaignObjectiveId'] = objectiveArray[0].id;
                        modifiedPayload['registration']['campaignObjectiveName'] = objectiveArray[0].fields[0];
                        dispatch({
                            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                            payload: {
                                campaignPayload: modifiedPayload, currentPageName: 'registration',
                                campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                                campaignStepsArray: state.campaignStepsArray
                            }
                        })
                        if (objectiveArray[0].fields[0] === 'surveyAd' ||
                            objectiveArray[0].fields[0] === 'fileIdToInstallApp' ||
                            objectiveArray[0].fields[0] === 'displayOnlyAd' ||
                            objectiveArray[0].fields[0] === 'showMessage') {
                            toggleButtonDisable(false);
                        }
                    }
                }
                setCampaignObjectiveList(objectiveArray);

            }, error => {
                setCampaignObjectiveList([]);
                console.log(helper.getErrorMessage(error));
            });
        Mixpanel.track("Create Campaign Page View", { "page": "Registration" });
    }, []);

    useEffect(() => {
        if (window.location.pathname.indexOf('edit') >= 0) {
            setCampaignName(state.formValues.registration.name || campaignName);
            if (agencyList.length !== 0) {
                const agencyIndex = agencyList.findIndex(agency => agency.id === state.formValues.registration.agencyId);
                if (agencyIndex > 0) {
                    setAgency(state.formValues.registration.agencyId || agency);
                } else {
                    setAgency(agencyList[0].id);
                }
            }
            if (advertiserList.length !== 0) {
                const advertiserIndex = advertiserList.findIndex(advertiser => advertiser.id === state.formValues.registration.advertiserId);
                if (advertiserIndex > 0) {
                    setAdvertiser(state.formValues.registration.advertiserId || advertiser);
                } else {
                    setAdvertiser(advertiserList[0].id);
                }
            }
            if (categoryList.length !== 0) {
                const categoryIndex = categoryList.findIndex(category => category.id === state.formValues.registration.campaignCategoryName);
                if (categoryIndex > 0) {
                    setCategory(state.formValues.registration.campaignCategoryName || category);
                } else {
                    setCategory(categoryList[0].id);
                }
            }

            setObjective(state.formValues.registration.campaignObjectiveId || objective);
            setObjectiveName(state.formValues.registration.campaignObjectiveName || objectiveName);
            setEmailList(state.formValues.registration.emailDistributionList || emailList);
            setPackageNameToOpenApp(state.formValues.registration.packageNameToOpenApp || packageNameToOpenApp);
            setGoToWeb(state.formValues.registration.goToWeb || goToWeb);
            setPackageNameToInstallApp(state.formValues.registration.packageNameToInstallApp || packageNameToInstallApp);
            setPackageName(state.formValues.registration.packageName || packageName);
            setPhoneToCall(state.formValues.registration.phoneToCall || phoneToCall);
            setCampaignType(state.formValues.registration.campaignType || campaignTypeName);
            setInsertionOrderId(state.formValues.registration.insertionOrderId || insertionOrderId);
            setPurposeType(state.formValues.registration.cpType || purposeType);
            toggleButtonDisable(!state.formValues.registration.isRegistrationSectionValid);

            if (state.formValues.registration.cpType === 'MONETIZATION') {
                let objectiveArray = [...campaignObjectiveList];
                objectiveArray = objectiveArray.filter(item => item.fields[0].indexOf('displayOnlyAd') === -1);
                setCampaignObjectiveList(objectiveArray);
            }
            if (state.formValues.registration.cpType === 'ENGAGEMENT') {
                let objectiveArray = [...campaignObjectiveList];
                objectiveArray = objectiveArray.filter(item => item.fields[0].indexOf('surveyAd') === -1);
                setCampaignObjectiveList(objectiveArray);
            }
        }
    }, [state.formValues])

    const scheduleSectionValidityCheck = () => {
        const { schedule } = state.formValues.settings;
        let isError;
        if (state.formValues.registration.campaignType === 'inApp') {
            if (schedule.startAt && schedule.endAt && schedule.expAt) {
                if ((today(orgTimezone) > helper.formatDate(schedule.startAt)) ||
                    (today(orgTimezone) > helper.formatDate(schedule.endAt)) ||
                    (helper.formatDate(schedule.startAt) > helper.formatDate(schedule.endAt))) {
                    isError = true;
                } else {
                    if (helper.formatDate(schedule.endAt) > helper.formatDate(schedule.expAt)) {
                        isError = true;
                    } else {
                        if (schedule.repeatMonth) {
                            if (schedule.monthlyDayTime && schedule.sendDayTime && String(schedule.sendDayTime).length !== 0) {
                                isError = false;
                            } else {
                                isError = true;
                            }
                        } else {
                            if (schedule.specificDays) {
                                if (schedule.inAppWeekDays.length === 0) {
                                    isError = true;
                                } else {
                                    isError = false;
                                }
                            } else {
                                isError = false;
                            }
                        }

                    }
                }
            } else {
                isError = true;
            }
        } else if (state.formValues.registration.campaignType === 'push' || state.formValues.registration.campaignType === 'pushInApp') {
            if (schedule.repeat || schedule.distributeInTime) {
                if (schedule.startAt && schedule.endAt && schedule.expAt && schedule.weekDays) {
                    if (schedule.weekDays.length == 0) {
                        isError = true;
                    } else {
                        if ((today(orgTimezone) > helper.formatDate(schedule.startAt)) ||
                            (today(orgTimezone) > helper.formatDate(schedule.endAt)) ||
                            (helper.formatDate(schedule.startAt) > helper.formatDate(schedule.endAt))) {
                            isError = true;
                        } else {
                            if (helper.formatDate(schedule.endAt) > helper.formatDate(schedule.expAt)) {
                                isError = true;
                            } else {
                                isError = false;
                            }
                        }
                    }
                } else {
                    isError = true;
                }
            } else {
                if (schedule.startAt) {
                    if (today(orgTimezone) > helper.formatDate(schedule.startAt)) {
                        isError = true;
                    } else {
                        isError = false;
                    }
                } else {
                    isError = true;
                }
            }
        } else {
            isError = true;
        }
        return !isError;
    }

    const today = (timeZone: string): any => {
        return helper.formatDate(
            helper.convertDateByTimeZone(
                timeZone ? timeZone : 'America/Sao_Paulo'
            )
        );
    }

    const selectCampaignType = (campaignType: string): void => {
        setCampaignType(campaignType);
        const modifiedPayload = Object.assign({}, state.formValues);
        modifiedPayload['registration']['campaignType'] = campaignType;
        modifiedPayload['settings']['isSettingSectionValid']['isScheduleSectionValid'] = scheduleSectionValidityCheck();
        dispatch({
            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
            payload: {
                campaignPayload: modifiedPayload, currentPageName: 'registration',
                campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                campaignStepsArray: state.campaignStepsArray
            }
        })
    }

    const changePage = (payload: any): void => {
        const modifiedPayload = {};
        // const modifiedPayload = Object.assign({}, state.formValues);
        modifiedPayload['registration'] = payload;
        modifiedPayload['template'] = state.formValues.template;
        modifiedPayload['creative'] = state.formValues.creative;
        modifiedPayload['registration']['isRegistrationSectionValid'] = true;
        modifiedPayload['settings'] = state.formValues.settings;
        modifiedPayload['settings']['isCallReachCountApi'] = false;

        dispatch({
            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
            payload: {
                campaignPayload: modifiedPayload, currentPageName: 'template',
                campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE'],
                campaignStepsArray: state.campaignStepsArray
            }
        });
        const pageName = state.formValues.registration.campaignType === 'inApp' ? 'Template - In App' : 'Template - Push';

        Mixpanel.track("Create Campaign Page View", { "page": `${pageName}` });
    }

    const handleChangeCampaignName = (campaignName: string, payload: any): void => {
        const modifiedPayload = Object.assign({}, payload);
        if (campaignName.length >= 3) {
            setNameSearchFlag(true);
            modifiedPayload['registration']['isCampaignNameValid'] = false;
            dispatch({
                type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                payload: {
                    campaignPayload: modifiedPayload, currentPageName: 'registration',
                    campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                    campaignStepsArray: state.campaignStepsArray
                }
            })
            apiDashboard
                .get('campaign-mgmt-api/campaigns/name?name=' + encodeURIComponent(helper.trimString(campaignName)))
                .then(response => {
                    setNameSearchFlag(false);
                    if (response.data.message === 'false') {
                        checkCampaignName('');
                        modifiedPayload['registration']['isCampaignNameValid'] = true;
                        dispatch({
                            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                            payload: {
                                campaignPayload: modifiedPayload, currentPageName: 'registration',
                                campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                                campaignStepsArray: state.campaignStepsArray
                            }
                        })
                    } else {
                        checkCampaignName(t('CAMPAIGN_NAME_DUPLICATE_ERROR'));
                        modifiedPayload['registration']['isCampaignNameValid'] = false;
                        dispatch({
                            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                            payload: {
                                campaignPayload: modifiedPayload, currentPageName: 'registration',
                                campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                                campaignStepsArray: state.campaignStepsArray
                            }
                        })
                    }
                }, error => {
                    setNameSearchFlag(false);
                    checkCampaignName(t('ERROR_MESSAGE'));
                    console.log(helper.getErrorMessage(error));
                    modifiedPayload['registration']['isCampaignNameValid'] = false;
                    dispatch({
                        type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                        payload: {
                            campaignPayload: modifiedPayload, currentPageName: 'registration',
                            campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                            campaignStepsArray: state.campaignStepsArray
                        }
                    })
                });
        } else {
            modifiedPayload['registration']['isCampaignNameValid'] = false;
            if (campaignName?.length === 0) {
                checkCampaignName('');
            }
            dispatch({
                type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                payload: {
                    campaignPayload: modifiedPayload, currentPageName: 'registration',
                    campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                    campaignStepsArray: state.campaignStepsArray
                }
            })
        }
    }

    const debounceOnChange = useCallback(helper.debounce(handleChangeCampaignName, 600), []);

    const validateEmailList = (e: any): void => {
        setEmailList(e.target.value);
        const modifiedPayload = Object.assign({}, state.formValues);
        modifiedPayload['registration']['emailDistributionList'] = e.target.value;
        dispatch({
            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
            payload: {
                campaignPayload: modifiedPayload, currentPageName: 'registration',
                campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                campaignStepsArray: state.campaignStepsArray
            }
        })
        const emailArray = e.target.value.split(',');
        const emailList = emailArray.map((email) => email.trim());
        let emailError = '';
        if (emailList.length === 1 && emailList[0] === '') {
            emailError = '';
            setEmailListError('');
        } else {
            for (let i = 0; i < emailList.length; i++) {
                if (emailList[i] === '' || !emailRegex.test(emailList[i])) {
                    emailError = 'Invalid email address';
                    setEmailListError(t('EMAIL_ADDRESS_ERROR'));
                } else {
                    emailError = '';
                    setEmailListError('');
                }
            }
        }
    }

    const goBackToCampaignManage = (): void => {
        sessionStorage.setItem('enablePrompt', 'false');
        setTimeout(() => {
            history.push('/campaign/manage');
        }, 500);
    }

    const setCallToAction = (fieldValue: string, objectiveType: string, subType: string = null, subTypeValue: string = null, isBlur: boolean = false): void => {
        let isError;
        if (objectiveType === 'packageNameToOpenApp') {
            setPackageNameToOpenApp(fieldValue);
            if (fieldValue.length === 0) {
                setObjectiveFieldError({
                    packageNameToOpenApp: t('PACKAGE_NAME_REQUIRED_ERROR'), goToWeb: '', packageNameToInstallApp: '',
                    packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                })
                isError = true;
            } else {
                if (!/^[^\s]+(\s+[^\s]+)*$/.test(fieldValue)) {
                    setObjectiveFieldError({
                        packageNameToOpenApp: t('PACKAGE_NAME_IVALID_ERROR'), goToWeb: '', packageNameToInstallApp: '',
                        packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                    })
                    isError = true;
                } else {
                    setObjectiveFieldError({
                        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                        packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                    })
                    isError = false;
                }
            }
            const modifiedPayload = Object.assign({}, state.formValues);
            modifiedPayload['registration']['packageNameToOpenApp'] = fieldValue;
            modifiedPayload['registration']['isRegistrationSectionValid'] = !isError;
            dispatch({
                type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                payload: {
                    campaignPayload: modifiedPayload, currentPageName: 'registration',
                    campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                    campaignStepsArray: ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS']
                }
            })
        } else if (objectiveType === 'goToWeb') {
            let gotoWebUrl = fieldValue;
            if (isBlur) {
                if (fieldValue.indexOf('https') === -1 && fieldValue.indexOf('http') === -1) {
                    gotoWebUrl = 'https://' + fieldValue;
                }
            }
            setGoToWeb(gotoWebUrl);
            if (gotoWebUrl.length === 0) {
                setObjectiveFieldError({
                    packageNameToOpenApp: '', goToWeb: t('URL_REQUIRED_ERROR'), packageNameToInstallApp: '',
                    packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                })
                setUrlProtocolWarning('');
                isError = true;
            } else {
                if (isBlur) {
                    if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(gotoWebUrl)) {
                        setObjectiveFieldError({
                            packageNameToOpenApp: '', goToWeb: t('URL_INVALID_ERROR'), packageNameToInstallApp: '',
                            packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                        })
                        setUrlProtocolWarning('');
                        isError = true;
                    } else {
                        setObjectiveFieldError({
                            packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                            packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                        })
                        setUrlProtocolWarning('');
                        isError = false;
                    }
                } else {
                    if (gotoWebUrl.indexOf('https') === -1 && gotoWebUrl.indexOf('http') === -1) {
                        setUrlProtocolWarning(t('URL_PROTOCOL_WARNING'));
                        setObjectiveFieldError({
                            packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                            packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                        })
                        isError = true;
                    } else {
                        if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(gotoWebUrl)) {
                            setObjectiveFieldError({
                                packageNameToOpenApp: '', goToWeb: t('URL_INVALID_ERROR'), packageNameToInstallApp: '',
                                packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                            })
                            setUrlProtocolWarning('');
                            isError = true;
                        } else {
                            setObjectiveFieldError({
                                packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                                packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                            })
                            setUrlProtocolWarning('');
                            isError = false;
                        }
                    }
                }
            }
            const modifiedPayload = Object.assign({}, state.formValues);
            modifiedPayload['registration']['goToWeb'] = gotoWebUrl;
            modifiedPayload['registration']['isRegistrationSectionValid'] = !isError;
            dispatch({
                type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                payload: {
                    campaignPayload: modifiedPayload, currentPageName: 'registration',
                    campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                    campaignStepsArray: ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS']
                }
            })
        } else if (objectiveType === 'packageNameToInstallApp') {
            if (subType === 'packageName') {
                let packageNameToInstallAppUrl = fieldValue;
                if (isBlur) {
                    if (packageNameToInstallApp.indexOf('https') === -1 && packageNameToInstallApp.indexOf('http') === -1) {
                        packageNameToInstallAppUrl = 'https://' + fieldValue;
                    }
                }
                setPackageNameToInstallApp(packageNameToInstallAppUrl);
                if (packageNameToInstallAppUrl.length === 0 && subTypeValue.length === 0) {
                    setObjectiveFieldError({
                        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: t('PLAY_STORE_REQUIRED_ERROR'),
                        packageName: t('PACKAGE_NAME_INSTALL_REQUIRED_ERROR'), phoneToCall: '', actionInTheApp: '', showMessage: ''
                    })
                    setUrlProtocolWarning('');
                    isError = true;
                } else {
                    if (packageNameToInstallAppUrl.length !== 0 && subTypeValue.length === 0) {
                        if (isBlur) {
                            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(packageNameToInstallAppUrl)) {
                                setObjectiveFieldError({
                                    packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: t('URL_INVALID_ERROR'),
                                    packageName: objectiveFieldError.packageName, phoneToCall: '', actionInTheApp: '', showMessage: ''
                                })
                                setUrlProtocolWarning('');
                                isError = true;
                            } else {
                                setObjectiveFieldError({
                                    packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                                    packageName: t('PACKAGE_NAME_INSTALL_REQUIRED_ERROR'), phoneToCall: '', actionInTheApp: '', showMessage: ''
                                })
                                setUrlProtocolWarning('');
                                isError = objectiveFieldError.packageName.length === 0 ? false : true;
                            }
                        } else {
                            if (packageNameToInstallAppUrl.indexOf('https') === -1 && packageNameToInstallAppUrl.indexOf('http') === -1) {
                                setUrlProtocolWarning(t('URL_PROTOCOL_WARNING'));
                                setObjectiveFieldError({
                                    packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                                    packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                                })
                                isError = true;
                            } else {
                                if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(packageNameToInstallAppUrl)) {
                                    setObjectiveFieldError({
                                        packageNameToOpenApp: '', goToWeb: t('URL_INVALID_ERROR'), packageNameToInstallApp: '',
                                        packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                                    })
                                    setUrlProtocolWarning('');
                                    isError = true;
                                } else {
                                    setObjectiveFieldError({
                                        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                                        packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                                    })
                                    setUrlProtocolWarning('');
                                    isError = false;
                                }
                            }
                        }
                    } else if (fieldValue.length === 0 && subTypeValue.length !== 0) {
                        if (!/^([A-Za-z]{1}[A-Za-z\d_]*\.)*[A-Za-z][A-Za-z\d_]*$/.test(subTypeValue)) {
                            setObjectiveFieldError({
                                packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: objectiveFieldError.packageNameToInstallApp,
                                packageName: t('PACKAGE_NAME_INSTALL_INVALID_ERROR'), phoneToCall: '', actionInTheApp: '', showMessage: ''
                            })
                            isError = true;
                        } else {
                            setObjectiveFieldError({
                                packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: t('PLAY_STORE_REQUIRED_ERROR'),
                                packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                            })
                            isError = objectiveFieldError.packageNameToInstallApp.length === 0 ? false : true;
                        }
                    } else if (fieldValue.length !== 0 && subTypeValue.length !== 0) {
                        if (isBlur) {
                            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(packageNameToInstallAppUrl)) {
                                setObjectiveFieldError({
                                    packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: t('URL_INVALID_ERROR'),
                                    packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                                })
                                setUrlProtocolWarning('');
                                isError = true;
                            } else {
                                if (!/^([A-Za-z]{1}[A-Za-z\d_]*\.)*[A-Za-z][A-Za-z\d_]*$/.test(subTypeValue)) {
                                    setObjectiveFieldError({
                                        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                                        packageName: t('PACKAGE_NAME_INSTALL_INVALID_ERROR'), phoneToCall: '', actionInTheApp: '', showMessage: ''
                                    })
                                    setUrlProtocolWarning('');
                                    isError = true;
                                } else {
                                    setObjectiveFieldError({
                                        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                                        packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                                    })
                                    setUrlProtocolWarning('');
                                    isError = false;
                                }
                            }
                        } else {
                            if (packageNameToInstallAppUrl.indexOf('https') === -1 && packageNameToInstallAppUrl.indexOf('http') === -1) {
                                setUrlProtocolWarning(t('URL_PROTOCOL_WARNING'));
                                setObjectiveFieldError({
                                    packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                                    packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                                })
                                isError = true;
                            } else {
                                if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(packageNameToInstallAppUrl)) {
                                    setObjectiveFieldError({
                                        packageNameToOpenApp: '', goToWeb: t('URL_INVALID_ERROR'), packageNameToInstallApp: '',
                                        packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                                    })
                                    setUrlProtocolWarning('');
                                    isError = true;
                                } else {
                                    if (!/^([A-Za-z]{1}[A-Za-z\d_]*\.)*[A-Za-z][A-Za-z\d_]*$/.test(subTypeValue)) {
                                        setObjectiveFieldError({
                                            packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                                            packageName: t('PACKAGE_NAME_INSTALL_INVALID_ERROR'), phoneToCall: '', actionInTheApp: '', showMessage: ''
                                        })
                                        setUrlProtocolWarning('');
                                        isError = true;
                                    } else {
                                        setObjectiveFieldError({
                                            packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                                            packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                                        })
                                        setUrlProtocolWarning('');
                                        isError = false;
                                    }
                                }
                            }
                        }
                    }
                }
                const modifiedPayload = Object.assign({}, state.formValues);
                modifiedPayload['registration']['packageNameToInstallApp'] = packageNameToInstallAppUrl;
                modifiedPayload['registration']['isRegistrationSectionValid'] = !isError;
                dispatch({
                    type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                    payload: {
                        campaignPayload: modifiedPayload, currentPageName: 'registration',
                        campaignBreadCrumbList: ['Campaign Management', 'Create Campaign', 'Registration'],
                        campaignStepsArray: ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS']
                    }
                })
            } else {
                setPackageName(fieldValue);
                if (fieldValue.length === 0 && subTypeValue.length === 0) {
                    setObjectiveFieldError({
                        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: t('PLAY_STORE_REQUIRED_ERROR'),
                        packageName: t('PACKAGE_NAME_INSTALL_REQUIRED_ERROR'), phoneToCall: '', actionInTheApp: '', showMessage: ''
                    })
                    isError = true;
                } else {
                    if (fieldValue.length === 0 && subTypeValue.length !== 0) {
                        if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(subTypeValue)) {
                            setObjectiveFieldError({
                                packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: t('URL_INVALID_ERROR'),
                                packageName: objectiveFieldError.packageName, phoneToCall: '', actionInTheApp: '', showMessage: ''
                            })
                            isError = true;
                        } else {
                            setObjectiveFieldError({
                                packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                                packageName: t('PACKAGE_NAME_INSTALL_REQUIRED_ERROR'), phoneToCall: '', actionInTheApp: '', showMessage: ''
                            })
                            isError = objectiveFieldError.packageName.length === 0 ? false : true;
                        }
                    } else if (fieldValue.length !== 0 && subTypeValue.length === 0) {
                        if (!/^([A-Za-z]{1}[A-Za-z\d_]*\.)*[A-Za-z][A-Za-z\d_]*$/.test(fieldValue)) {
                            setObjectiveFieldError({
                                packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: t('PLAY_STORE_REQUIRED_ERROR'),
                                packageName: t('PACKAGE_NAME_INSTALL_INVALID_ERROR'), phoneToCall: '', actionInTheApp: '', showMessage: ''
                            })
                            isError = true;
                        } else {
                            setObjectiveFieldError({
                                packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: objectiveFieldError.packageNameToInstallApp,
                                packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                            })
                            isError = objectiveFieldError.packageNameToInstallApp.length === 0 ? false : true;
                        }
                    } else if (fieldValue.length !== 0 && subTypeValue.length !== 0) {
                        if (!/^([A-Za-z]{1}[A-Za-z\d_]*\.)*[A-Za-z][A-Za-z\d_]*$/.test(fieldValue)) {
                            setObjectiveFieldError({
                                packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                                packageName: t('PACKAGE_NAME_INSTALL_INVALID_ERROR'), phoneToCall: '', actionInTheApp: '', showMessage: ''
                            })
                            isError = true;
                        } else {
                            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(subTypeValue)) {
                                setObjectiveFieldError({
                                    packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: t('URL_INVALID_ERROR'),
                                    packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                                })
                                isError = true;
                            } else {
                                setObjectiveFieldError({
                                    packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                                    packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                                })
                            }
                        }

                    }
                }
                const modifiedPayload = Object.assign({}, state.formValues);
                modifiedPayload['registration']['packageName'] = fieldValue;
                modifiedPayload['registration']['isRegistrationSectionValid'] = !isError;
                dispatch({
                    type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                    payload: {
                        campaignPayload: modifiedPayload, currentPageName: 'registration',
                        campaignBreadCrumbList: ['Campaign Management', 'Create Campaign', 'Registration'],
                        campaignStepsArray: ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS']
                    }
                })
            }

        } else if (objectiveType === 'phoneToCall') {
            setPhoneToCall(fieldValue);
            if (fieldValue.length === 0) {
                setObjectiveFieldError({
                    packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                    packageName: '', phoneToCall: t('PHONE_NUMBER_REQUIRED_ERROR'), actionInTheApp: '', showMessage: ''
                })
                isError = true;
            } else {
                if (!/^((^[\*\#\+]?[0-9]{2,4}[\*\#\+]?)|(((\+[0-9]{1,2})|0)?[\s\-]?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{2,5}))?$/.test(fieldValue)) {
                    setObjectiveFieldError({
                        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                        packageName: '', phoneToCall: t('PHONE_NUMBER_INVALID_ERROR'), actionInTheApp: '', showMessage: ''
                    })
                    isError = true;
                } else {
                    setObjectiveFieldError({
                        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                        packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                    })
                    isError = false;
                }
            }
            const modifiedPayload = Object.assign({}, state.formValues);
            modifiedPayload['registration']['phoneToCall'] = fieldValue;
            modifiedPayload['registration']['isRegistrationSectionValid'] = !isError;
            dispatch({
                type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                payload: {
                    campaignPayload: modifiedPayload, currentPageName: 'registration',
                    campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                    campaignStepsArray: ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS']
                }
            })
        } else if (objectiveType === 'actionInTheApp') {
            let actionInTheUrl = fieldValue;
            if (isBlur) {
                if (actionInTheApp.indexOf('https') === -1 && actionInTheApp.indexOf('http') === -1) {
                    actionInTheUrl = 'http://' + fieldValue;
                }
            }
            setActionInTheApp(actionInTheUrl);
            if (actionInTheUrl.length === 0) {
                setObjectiveFieldError({
                    packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                    packageName: '', phoneToCall: '', actionInTheApp: t('URL_REQUIRED_ERROR'), showMessage: ''
                })
                isError = true;
            } else {
                if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(actionInTheUrl)) {
                    setObjectiveFieldError({
                        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                        packageName: '', phoneToCall: '', actionInTheApp: t('URL_INVALID_ERROR'), showMessage: ''
                    })
                    isError = true;
                } else {
                    setObjectiveFieldError({
                        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                        packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                    })
                    isError = false;
                }
            }
            const modifiedPayload = Object.assign({}, state.formValues);
            modifiedPayload['registration']['actionInTheApp'] = fieldValue;
            modifiedPayload['registration']['isRegistrationSectionValid'] = !isError;
            dispatch({
                type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                payload: {
                    campaignPayload: modifiedPayload, currentPageName: 'registration',
                    campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                    campaignStepsArray: ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS']
                }
            })
        }
        toggleButtonDisable(isError);
    }

    const appendClassNames = (template: any): string => {
        if (campaignTypeName === template.id) {
            return (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus) ? 'campaign-type-active disabled-function' : 'campaign-type-active';
        } else {
            return (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus) ? 'disabled-function' : ''
        }
    }

    return (
        <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
                <S.Container>
                    <Formik
                        initialValues={{
                            name: campaignName,
                            agencyId: agency,
                            campaignCategoryName: category,
                            advertiserId: advertiser,
                            emailDistributionList: emailList,
                            campaignObjectiveId: objective,
                            campaignType: campaignTypeName,
                            packageNameToOpenApp: state.formValues.registration.packageNameToOpenApp,
                            goToWeb: state.formValues.registration.goToWeb,
                            packageNameToInstallApp: state.formValues.registration.packageNameToInstallApp,
                            packageName: state.formValues.registration.packageName,
                            phoneToCall: state.formValues.registration.phoneToCall,
                            actionInTheApp: state.formValues.registration.actionInTheApp,
                            showMessage: state.formValues.registration.showMessage,
                            insertionOrderId: state.formValues.registration.insertionOrderId,
                            purposeType: state.formValues.registration.cpType
                        }}

                        validationSchema={yup.object().shape({
                            name: campaignName.lengiosANdroidFlagth === 0 ? yup.string()
                                .min(3, t('CAMPAIGN_NAME_MIN_LENGTH_ERROR'))
                                .required(t('CAMPAIGN_NAME_REQUIRED_ERROR'))
                                .matches(
                                    /^[^.\s]/,
                                    t('CAMPAIGN_NAME_INVALID_ERROR')
                                ) : yup.string()
                                    .min(3, t('CAMPAIGN_NAME_MIN_LENGTH_ERROR'))
                                    .matches(
                                        /^[^.\s]/,
                                        t('CAMPAIGN_NAME_INVALID_ERROR')
                                    ),
                            insertionOrderId: yup.string()
                                .matches(/^[^.\s]/,
                                    t('INSERTION_ORDER_INVALID_ERROR'))
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            const payload = {
                                name: campaignName,
                                agencyId: agency,
                                campaignCategoryName: category,
                                advertiserId: advertiser,
                                campaignObjectiveId: objective,
                                emailDistributionList: emailList,
                                campaignType: campaignTypeName,
                                packageNameToOpenApp: packageNameToOpenApp,
                                goToWeb: goToWeb,
                                packageNameToInstallApp: packageNameToInstallApp,
                                packageName: packageName,
                                phoneToCall: phoneToCall,
                                actionInTheApp: actionInTheApp,
                                showMessage: showMessage,
                                isCampaignNameValid: state.formValues.registration.isCampaignNameValid,
                                campaignObjectiveName: objectiveName,
                                insertionOrderId: insertionOrderId,
                                cpType: purposeType,
                                sequenceArrayFullPagePopUpTopBottomBanner: state.formValues.creative.sequenceArrayFullPagePopUpTopBottomBanner,
                                sequenceArrayFullPageVideo: state.formValues.creative.sequenceArrayFullPageVideo,
                                sequenceArray: state.formValues.creative.sequenceArray
                            }
                            changePage(payload);
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
                            isValid,
                            setFieldValue
                        }) => (
                            <form onSubmit={handleSubmit} className="cc-form-wrapper">
                                <div className="cr-top-main">
                                    <div className="cr-top-wrapper">
                                        <h5 className="title-padding">{t('REGISTRATION_SECTION_HEADING')}</h5>
                                        <hr />
                                        <div className="cr-body-content">
                                            <Grid container>
                                                <div className="row">
                                                    <Grid item xs={12} sm={12} className="form-row">
                                                        <TextField
                                                            InputLabelProps={{ shrink: true }}
                                                            variant="outlined"
                                                            aria-describedby="campaign-name"
                                                            placeholder="Campaign Name"
                                                            label={`${t('CAMPAIGN_NAME')} *`}
                                                            name="name"
                                                            error={Boolean(touched.name && errors.name)}
                                                            helperText={touched.name && errors.name}
                                                            onBlur={handleBlur}
                                                            disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                setCampaignName(e.currentTarget.value);
                                                                const modifiedPayload = Object.assign({}, state.formValues);
                                                                modifiedPayload['registration']['name'] = e.currentTarget.value;
                                                                dispatch({
                                                                    type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                                                                    payload: {
                                                                        campaignPayload: modifiedPayload, currentPageName: 'registration',
                                                                        campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                                                                        campaignStepsArray: state.campaignStepsArray
                                                                    }
                                                                })
                                                                debounceOnChange(e.currentTarget.value, modifiedPayload);
                                                            }}
                                                            value={campaignName}
                                                            type="text"
                                                        />
                                                        {nameSearchFlag && <p>{t('SEARCH_API_PROGRESS')}</p>}
                                                        <p className="error-wrap error"> {campaignNameCheckError}</p>
                                                    </Grid>

                                                    <Grid item sm={12} md={6} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <InputLabel variant="filled" style={{ pointerEvents: "auto" }}>
                                                                <div className="label-tooltip">{`${t('PURPOSE_TYPE_LABEL')} * `}
                                                                    <LightTooltip
                                                                        title={<label>{t('TOOLTIP_FOR_CAMPAIGN_TYPE')} <a target="_blank" href="https://docs.digitalreef.com/docs/monetization-vs-engagement-campaigns"> {t('KNOW_MORE')}</a>.</label>}
                                                                    />
                                                                </div>
                                                            </InputLabel>
                                                            <Select
                                                                MenuProps={{
                                                                    anchorOrigin: {
                                                                        vertical: "bottom",
                                                                        horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                        vertical: "top",
                                                                        horizontal: "left"
                                                                    },
                                                                    getContentAnchorEl: null
                                                                }}
                                                                label="purposeType"
                                                                value={purposeType}
                                                                name="purposeType"
                                                                disabled={isIUUser || (window.location.pathname.indexOf('edit') > 0 &&
                                                                    (state.formValues.campaignStatus === 'READY' || state.formValues.campaignStatus === 'PENDING' ||
                                                                        state.formValues.lockCampaignStatus))}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setPurposeType(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.formValues);
                                                                    if (campaignTypeName && campaignTypeName.length !== 0) {
                                                                        if ((e.target.value === 'MONETIZATION' || isIUUser) && campaignTypeName === 'inApp') {
                                                                            setCampaignType('');
                                                                        }
                                                                    }
                                                                    if (e.target.value === 'MONETIZATION') {
                                                                        const objectiveList = campaignObjectiveList.filter(item => item.fields[0].indexOf('displayOnlyAd') === -1);
                                                                        const campaignObjectiveIndexSurvey = campaignObjectiveList.findIndex(campaignObjective => campaignObjective.fields[0] === 'surveyAd');
                                                                        if (campaignObjectiveIndexSurvey < 0) {
                                                                            const surveyObjectiveIndex = nonFilteredObjectiveList.findIndex(campaignObjective => campaignObjective.fields[0] === 'surveyAd');
                                                                            const objectiveListArray = [...campaignObjectiveList];
                                                                            if (surveyObjectiveIndex > -1) {
                                                                                objectiveListArray.push(nonFilteredObjectiveList[surveyObjectiveIndex]);
                                                                            }
                                                                            setCampaignObjectiveList(objectiveListArray.filter(item => item.fields[0].indexOf('displayOnlyAd') === -1));
                                                                        } else {
                                                                            setCampaignObjectiveList(objectiveList);
                                                                        }

                                                                        if (state.formValues.registration.campaignObjectiveName === 'showMessage') {
                                                                            setObjective(objectiveList[0].id);
                                                                            setObjectiveName(objectiveList[0].fields[0]);
                                                                            modifiedPayload['registration']['campaignObjectiveId'] = objectiveList[0].id;
                                                                            const objectiveName = objectiveList[0].fields[0];
                                                                            modifiedPayload['registration']['campaignObjectiveName'] = objectiveList[0].fields[0];
                                                                            if (objectiveName === 'packageNameToInstallApp') {
                                                                                setCallToAction(packageNameToInstallApp, objectiveName, 'packageName', packageName);
                                                                            } else if (objectiveName === 'goToWeb') {
                                                                                setCallToAction(goToWeb, objectiveName);
                                                                            } else if (objectiveName === 'packageNameToOpenApp') {
                                                                                setCallToAction(packageNameToOpenApp, objectiveName);
                                                                            } else if (objectiveName === 'phoneToCall') {
                                                                                setCallToAction(phoneToCall, objectiveName);
                                                                            } else if (objectiveName === 'actionInTheApp') {
                                                                                setCallToAction(actionInTheApp, objectiveName);
                                                                            }
                                                                        }
                                                                    } else {
                                                                        const campaignObjectiveIndex = campaignObjectiveList.findIndex(campaignObjective => campaignObjective.fields[0] === 'displayOnlyAd');
                                                                        if (campaignObjectiveIndex < 0) {
                                                                            const showMessageObjectiveIndex = nonFilteredObjectiveList.findIndex(campaignObjective => campaignObjective.fields[0] === 'displayOnlyAd');
                                                                            const objectiveListArray = [...campaignObjectiveList];
                                                                            if (showMessageObjectiveIndex > -1) {
                                                                                objectiveListArray.push(nonFilteredObjectiveList[showMessageObjectiveIndex]);
                                                                            }
                                                                            const objectiveList = objectiveListArray.filter(item => item.fields[0].indexOf('surveyAd') === -1);
                                                                            setCampaignObjectiveList(objectiveList);
                                                                            if (state.formValues.registration.campaignObjectiveName === 'surveyAd') {
                                                                                setObjective(objectiveList[0].id);
                                                                                setObjectiveName(objectiveList[0].fields[0]);
                                                                                modifiedPayload['registration']['campaignObjectiveId'] = objectiveList[0].id;
                                                                                const objectiveName = objectiveList[0].fields[0];
                                                                                modifiedPayload['registration']['campaignObjectiveName'] = objectiveList[0].fields[0];
                                                                                if (objectiveName === 'packageNameToInstallApp') {
                                                                                    setCallToAction(packageNameToInstallApp, objectiveName, 'packageName', packageName);
                                                                                } else if (objectiveName === 'goToWeb') {
                                                                                    setCallToAction(goToWeb, objectiveName);
                                                                                } else if (objectiveName === 'packageNameToOpenApp') {
                                                                                    setCallToAction(packageNameToOpenApp, objectiveName);
                                                                                } else if (objectiveName === 'phoneToCall') {
                                                                                    setCallToAction(phoneToCall, objectiveName);
                                                                                } else if (objectiveName === 'actionInTheApp') {
                                                                                    setCallToAction(actionInTheApp, objectiveName);
                                                                                }
                                                                            }
                                                                        }
                                                                    }

                                                                    modifiedPayload['registration']['cpType'] = e.target.value;
                                                                    if (e.target.value === 'ENGAGEMENT') {
                                                                        modifiedPayload['settings']['isSettingSectionValid']['isMetricsSectionValid'] = true;
                                                                        modifiedPayload['settings']['isSettingSectionValid']['isGeofenceSectionValid'] = true;
                                                                    } else {
                                                                        if (!modifiedPayload.settings.metrics.typePerformance) {
                                                                            modifiedPayload['settings']['isSettingSectionValid']['isMetricsSectionValid'] = false;
                                                                        } else {
                                                                            if (!modifiedPayload.settings.metrics.target) {
                                                                                modifiedPayload['settings']['isSettingSectionValid']['isMetricsSectionValid'] = false;
                                                                            } else {
                                                                                const isErrorPresentInMetrics = (currentValue) => currentValue.length === 0;
                                                                                const isMetricsSectionValid = Object.values(modifiedPayload['settings']['metrics']['performanceError']).every(isErrorPresentInMetrics);
                                                                                modifiedPayload['settings']['isSettingSectionValid']['isMetricsSectionValid'] = isMetricsSectionValid;
                                                                            }
                                                                        }
                                                                    }
                                                                    dispatch({
                                                                        type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                                                                        payload: {
                                                                            campaignPayload: modifiedPayload, currentPageName: 'registration',
                                                                            campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                                                                            campaignStepsArray: state.formValues.registration.campaignObjectiveName === 'surveyAd' ? ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SURVEY', 'SETTINGS']
                                                                                : ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS']
                                                                        }
                                                                    })
                                                                }}>
                                                                <MenuItem value={'MONETIZATION'}>{t('CAMPAIGN_TYPE_MONETIZATION_LABEL')}</MenuItem>
                                                                <MenuItem value={'ENGAGEMENT'}>{t('CAMPAIGN_TYPE_ENGAGEMENT_LABEL')}</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item sm={12} md={6} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <InputLabel className="long-name-labels" variant="filled">{`${t('CATEGORY_REGISTRATION_PAGE_LABEL')} *`}</InputLabel>
                                                            <Select
                                                                MenuProps={{
                                                                    anchorOrigin: {
                                                                        vertical: "bottom",
                                                                        horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                        vertical: "top",
                                                                        horizontal: "left"
                                                                    },
                                                                    getContentAnchorEl: null
                                                                }}
                                                                label="category"
                                                                value={category}
                                                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setCategory(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.formValues);
                                                                    modifiedPayload['registration']['campaignCategoryName'] = e.target.value;
                                                                    dispatch({
                                                                        type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                                                                        payload: {
                                                                            campaignPayload: modifiedPayload, currentPageName: 'registration',
                                                                            campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                                                                            campaignStepsArray: state.campaignStepsArray
                                                                        }
                                                                    })
                                                                }}
                                                                name="campaignCategoryName"
                                                            >
                                                                {
                                                                    categoryList.map((category) => (
                                                                        <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                                                    ))}
                                                            </Select>
                                                        </FormControl>
                                                        {/* <p className="optional-msg">{`*${t('OPTIONAL')}`}</p> */}
                                                    </Grid>

                                                    <Grid item sm={12} md={6} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <InputLabel variant="filled">{`${t('AGENCY_REGISTRATION_PAGE_LABEL')} *`}</InputLabel>
                                                            <Select
                                                                MenuProps={{
                                                                    anchorOrigin: {
                                                                        vertical: "bottom",
                                                                        horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                        vertical: "top",
                                                                        horizontal: "left"
                                                                    },
                                                                    getContentAnchorEl: null
                                                                }}
                                                                label="agency"
                                                                value={agency}
                                                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                                name="agencyId"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setAgency(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.formValues);
                                                                    modifiedPayload['registration']['agencyId'] = e.target.value;
                                                                    dispatch({
                                                                        type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                                                                        payload: {
                                                                            campaignPayload: modifiedPayload, currentPageName: 'registration',
                                                                            campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                                                                            campaignStepsArray: state.campaignStepsArray
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                {
                                                                    agencyList.map((agency) => (
                                                                        <MenuItem key={agency.id} value={agency.id}>{agency.name}</MenuItem>
                                                                    ))}
                                                            </Select>
                                                        </FormControl>
                                                        {/* <p className="optional-msg">{`*${t('OPTIONAL')}`}</p> */}
                                                    </Grid>

                                                    <Grid item sm={12} md={6} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <InputLabel className="long-name-labels" variant="filled">{`${t('ADVERTISER_REGISTRATION_PAGE_LABEL')} *`}</InputLabel>
                                                            <Select
                                                                MenuProps={{
                                                                    anchorOrigin: {
                                                                        vertical: "bottom",
                                                                        horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                        vertical: "top",
                                                                        horizontal: "left"
                                                                    },
                                                                    getContentAnchorEl: null
                                                                }}
                                                                label="advertiser"
                                                                value={advertiser}
                                                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                                onChange={(e) => {
                                                                    setAdvertiser(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.formValues);
                                                                    modifiedPayload['registration']['advertiserId'] = e.target.value;
                                                                    dispatch({
                                                                        type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                                                                        payload: {
                                                                            campaignPayload: modifiedPayload, currentPageName: 'registration',
                                                                            campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                                                                            campaignStepsArray: state.campaignStepsArray
                                                                        }
                                                                    })
                                                                }}
                                                                name="advertiserId"
                                                            >
                                                                {
                                                                    advertiserList.map((advertiser) => (
                                                                        <MenuItem key={advertiser.id} value={advertiser.id}>{advertiser.name}</MenuItem>
                                                                    ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    {/* <Grid item sm={12} md={6} className="form-row email-long-label">
                                                        <TextField
                                                            variant="outlined"
                                                            aria-describedby="reporting-email"
                                                            placeholder="email@email.com"
                                                            disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                            label={t('EMAIL_LABEL')}
                                                            name="emailDistributionList"
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={validateEmailList}
                                                            onBlur={handleBlur}
                                                            type="text"
                                                            value={emailList}
                                                        />
                                                        <p className="error-wrap error">{emailListError}</p>
                                                        <p className="optional-msg">{`*${t('OPTIONAL')}`}</p>
                                                    </Grid> */}

                                                    <Grid item sm={12} md={6} className="form-row">

                                                        <TextField
                                                            variant="outlined"
                                                            aria-describedby="insertion-order"
                                                            placeholder="000000"
                                                            InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                            label={<div className="label-tooltip" >{`${t('INSERTION_ORDER_LABEL')}`}
                                                                <LightTooltip title={<label>{t('TOOLTIP_FOR_INSERTION_ORDER')}</label>}
                                                                /> </div>}
                                                            name="insertionOrderId"
                                                            disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                setInsertionOrderId(e.currentTarget.value);
                                                                const modifiedPayload = Object.assign({}, state.formValues);
                                                                modifiedPayload['registration']['insertionOrderId'] = e.target.value;
                                                                dispatch({
                                                                    type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                                                                    payload: {
                                                                        campaignPayload: modifiedPayload, currentPageName: 'registration',
                                                                        campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                                                                        campaignStepsArray: state.campaignStepsArray
                                                                    }
                                                                })
                                                            }}
                                                            onBlur={handleBlur}
                                                            type="text"
                                                            value={insertionOrderId}
                                                            error={Boolean(touched.insertionOrderId && errors.insertionOrderId)}
                                                            helperText={touched.insertionOrderId && errors.insertionOrderId}
                                                        />
                                                        <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                                                    </Grid>
                                                    
                                                    <Grid item xs={12} sm={12} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <InputLabel variant="filled">{`${t('CAMPAIGN_OBJECTIVE_LABEL')}? *`}</InputLabel>
                                                            <Select
                                                                MenuProps={{
                                                                    anchorOrigin: {
                                                                        vertical: "bottom",
                                                                        horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                        vertical: "top",
                                                                        horizontal: "left"
                                                                    },
                                                                    getContentAnchorEl: null
                                                                }}
                                                                label="objective"
                                                                value={objective}
                                                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                                onChange={(e) => {
                                                                    setObjective(e.target.value);
                                                                    const campaignObjectiveIndex = campaignObjectiveList.findIndex(campaignObjective => campaignObjective.id === e.target.value);
                                                                    let objectiveName = campaignObjectiveList[campaignObjectiveIndex].fields[0];
                                                                    if (objectiveName === 'displayOnlyAd') {
                                                                        objectiveName = 'showMessage';
                                                                    }
                                                                    setObjectiveName(objectiveName);
                                                                    setObjectiveFieldError({
                                                                        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                                                                        packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
                                                                    })

                                                                    if (objectiveName === 'packageNameToInstallApp') {
                                                                        setCallToAction(packageNameToInstallApp, objectiveName, 'packageName', packageName);
                                                                    } else if (objectiveName === 'goToWeb') {
                                                                        setCallToAction(goToWeb, objectiveName);
                                                                    } else if (objectiveName === 'packageNameToOpenApp') {
                                                                        setCallToAction(packageNameToOpenApp, objectiveName);
                                                                    } else if (objectiveName === 'phoneToCall') {
                                                                        setCallToAction(phoneToCall, objectiveName);
                                                                    } else if (objectiveName === 'actionInTheApp') {
                                                                        setCallToAction(actionInTheApp, objectiveName);
                                                                    }

                                                                    const modifiedPayload = Object.assign({}, state.formValues);
                                                                    if (objectiveName === 'surveyAd' ||
                                                                        objectiveName === 'fileIdToInstallApp' ||
                                                                        objectiveName === 'displayOnlyAd' ||
                                                                        objectiveName === 'showMessage') {
                                                                        toggleButtonDisable(false);
                                                                        modifiedPayload['registration']['isRegistrationSectionValid'] = true;
                                                                    }

                                                                    modifiedPayload['registration']['campaignObjectiveId'] = e.target.value;
                                                                    modifiedPayload['registration']['campaignObjectiveName'] = objectiveName;
                                                                    dispatch({
                                                                        type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                                                                        payload: {
                                                                            campaignPayload: modifiedPayload, currentPageName: 'registration',
                                                                            campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
                                                                            campaignStepsArray: objectiveName === 'surveyAd' ? ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SURVEY', 'SETTINGS'] : ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS']
                                                                        }
                                                                    })
                                                                }}
                                                                name="campaignObjectiveId"
                                                            >
                                                                {
                                                                    campaignObjectiveList.map((objective) => (
                                                                        <MenuItem key={objective.id} value={objective.id}>{objective.name}</MenuItem>
                                                                    ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12} sm={12}>
                                                        <div className="extra-field-wrapper">
                                                            <Grid container>
                                                                <div className="row">
                                                                    {objectiveName === 'packageNameToOpenApp' && <Grid item xs={12} sm={12} >
                                                                        <div>
                                                                            <TextField
                                                                                variant="outlined"
                                                                                aria-describedby="CTA"
                                                                                placeholder={t('PACKAGE_NAME_PLACEHOLDER')}
                                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                                label={<div className="label-tooltip">{`${t('CTA_LABEL')} *`}
                                                                                    <LightTooltip title={<label>{t('TOOLTIP_FOR_CTA')}</label>}
                                                                                    /></div>}
                                                                                name="packageNameToOpenApp"
                                                                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                                                onBlur={(e) => {
                                                                                    handleBlur(e);
                                                                                    setCallToAction(e.currentTarget.value, 'packageNameToOpenApp');
                                                                                }}
                                                                                onChange={(e) => {
                                                                                    handleChange(e);
                                                                                    setCallToAction(e.currentTarget.value, 'packageNameToOpenApp');
                                                                                }}
                                                                                value={packageNameToOpenApp}
                                                                                type="text"
                                                                            />
                                                                            <p className="error-wrap error">{objectiveFieldError['packageNameToOpenApp']}</p>
                                                                        </div>
                                                                    </Grid>}

                                                                    {objectiveName === 'goToWeb' && <Grid item xs={12} sm={12} >
                                                                        <div>
                                                                            <TextField
                                                                                variant="outlined"
                                                                                aria-describedby="CTA"
                                                                                placeholder={t('GO_TO_WEB_PLACEHOLDER')}
                                                                                style={{ pointerEvents: "auto" }}
                                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                                label={<div className="label-tooltip">{`${t('CTA_LABEL')} *`}
                                                                                    <LightTooltip title={<label>{t('TOOLTIP_FOR_CTA')}</label>}
                                                                                    />
                                                                                </div>}
                                                                                name="goToWeb"
                                                                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                                                onBlur={(e) => {
                                                                                    handleBlur(e);
                                                                                    setCallToAction(e.currentTarget.value, 'goToWeb', '', '', true);
                                                                                }}
                                                                                onChange={(e) => {
                                                                                    handleChange(e);
                                                                                    setCallToAction(e.currentTarget.value, 'goToWeb');
                                                                                }}
                                                                                value={goToWeb}
                                                                                type="url"
                                                                            />
                                                                            <p className="error-wrap error">{objectiveFieldError['goToWeb']}</p>
                                                                            <p className="information">{urlProtocolWarning}</p>
                                                                        </div>
                                                                    </Grid>}

                                                                    {objectiveName === 'packageNameToInstallApp' && <Grid item xs={12} sm={12} className="form-row">
                                                                        <div>
                                                                            <TextField
                                                                                variant="outlined"
                                                                                aria-describedby="CTA"
                                                                                placeholder={t('PACKAGE_NAME_TO_INSTALL_APP_PLACEHOLDER')}
                                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                                label={<div className="label-tooltip">{`${t('CTA_LABEL')} *`}
                                                                                    <LightTooltip title={<label>{t('TOOLTIP_FOR_CTA')}</label>}
                                                                                    />
                                                                                </div>}
                                                                                name="packageNameToInstallApp"
                                                                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                                                onBlur={(e) => {
                                                                                    handleBlur(e);
                                                                                    setCallToAction(e.currentTarget.value, 'packageNameToInstallApp', 'packageName', packageName, true);
                                                                                }}
                                                                                onChange={(e) => {
                                                                                    handleChange(e);
                                                                                    setCallToAction(e.currentTarget.value, 'packageNameToInstallApp', 'packageName', packageName);
                                                                                }}
                                                                                value={packageNameToInstallApp}
                                                                                type="url"
                                                                            />
                                                                            <p className="error-wrap error">{objectiveFieldError['packageNameToInstallApp']}</p>
                                                                            <p className="information">{urlProtocolWarning}</p>
                                                                        </div>
                                                                    </Grid>}

                                                                    {(objectiveName === 'packageNameToInstallApp') && <Grid item xs={12} sm={12} className="form-row">
                                                                        <div>
                                                                            <TextField
                                                                                variant="outlined"
                                                                                aria-describedby="Package Name"
                                                                                label={t('PACKAGE_NAME_INSTALL_LABEL')}
                                                                                placeholder={t('PACKAGE_NAME_INSTALL_LABEL')}
                                                                                name="packageName"
                                                                                InputLabelProps={{ shrink: true }}
                                                                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                                                onBlur={(e) => {
                                                                                    handleBlur(e);
                                                                                    setCallToAction(e.currentTarget.value, 'packageNameToInstallApp', 'packageNameToInstallApp', packageNameToInstallApp, true);
                                                                                }}
                                                                                onChange={(e) => {
                                                                                    handleChange(e);
                                                                                    setCallToAction(e.currentTarget.value, 'packageNameToInstallApp', 'packageNameToInstallApp', packageNameToInstallApp);
                                                                                }}
                                                                                value={packageName}
                                                                                type="text"
                                                                            />
                                                                            <p className="error-wrap error">{objectiveFieldError['packageName']}</p>
                                                                        </div>
                                                                    </Grid>}

                                                                    {objectiveName === 'phoneToCall' && <Grid item xs={12} sm={12} className="form-row">
                                                                        <div>
                                                                            <TextField
                                                                                variant="outlined"
                                                                                aria-describedby="CTA"
                                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                                label={<div className="label-tooltip">{`${t('CTA_LABEL')} *`}
                                                                                    <LightTooltip title={<label>{t('TOOLTIP_FOR_CTA')}</label>} />
                                                                                </div>}
                                                                                name="phoneToCall"
                                                                                placeholder={t('PHONE_NUMBER_PLACEHOLDER')}
                                                                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                                                onBlur={(e) => {
                                                                                    handleBlur(e);
                                                                                    setCallToAction(e.currentTarget.value, 'phoneToCall');
                                                                                }}
                                                                                onChange={(e) => {
                                                                                    handleBlur(e);
                                                                                    setCallToAction(e.currentTarget.value, 'phoneToCall');
                                                                                }}
                                                                                value={phoneToCall}
                                                                                type="text"
                                                                            />
                                                                            <p className="error-wrap error">{objectiveFieldError['phoneToCall']}</p>
                                                                        </div>
                                                                    </Grid>}

                                                                    {objectiveName === 'actionInTheApp' && <Grid item xs={12} sm={12} className="form-row">
                                                                        <div>
                                                                            <TextField
                                                                                variant="outlined"
                                                                                aria-describedby="CTA"
                                                                                placeholder={t('ACTION_IN_APP_PLACEHOLDER')}
                                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                                label={<div className="label-tooltip">{`${t('CTA_LABEL')} *`}
                                                                                    <LightTooltip title={<label>{t('TOOLTIP_FOR_CTA')}</label>} />
                                                                                </div>}
                                                                                name="actionInTheApp"
                                                                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                                                onBlur={(e) => {
                                                                                    handleBlur(e);
                                                                                    setCallToAction(e.currentTarget.value, 'actionInTheApp', '', '', true);
                                                                                }}
                                                                                onChange={(e) => {
                                                                                    handleChange(e);
                                                                                    setCallToAction(e.currentTarget.value, 'actionInTheApp');
                                                                                }}
                                                                                value={actionInTheApp}
                                                                                type="url"
                                                                            />
                                                                            <p className="error-wrap error">{objectiveFieldError['actionInTheApp']}</p>
                                                                        </div>
                                                                    </Grid>}
                                                                </div>
                                                            </Grid>
                                                        </div>
                                                    </Grid>
                                                </div>
                                            </Grid>
                                        </div>
                                    </div>
                                    <S.TypeContainer>
                                        <div className="cc-global-wrapper">
                                            {/* <div> */}
                                            <p className="label-tooltip cc-label-text">{t('CAMPAIGN_TYPE_SELECTION_LABEL')}
                                                <LightTooltip title={<label>{t('TOOLTIP_FOR_CAMPAIGN_FORMATS')} <a target="_blank" rel="noopener noreferrer" href="https://docs.digitalreef.com/docs/campaign-formats"> {t('KNOW_MORE')}</a>.</label>}
                                                />
                                            </p>
                                            {/* </div> */}
                                            <ul className='campaign-type'>
                                                {
                                                    campaignType.map((template, index) => (
                                                        <li key={template.id} onClick={(e) => selectCampaignType(template.id)} className={appendClassNames(template)}>
                                                            <img src={campaignTypeName === template.id ? template.filePathAfterSelection : template.filePath} />
                                                            <span>{template.name}</span>
                                                            <span className="checkmark-wrapper"><img src="/img/Vector.svg" alt="checkmark icon" /></span>
                                                        </li>)
                                                    )
                                                }
                                            </ul>
                                        </div>
                                    </S.TypeContainer>
                                </div>
                                <div className="cc-global-buttons registration-btn">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        type="button" onClick={goBackToCampaignManage}>
                                        {t('CANCEL_BUTTON')}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        // disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object) ||
                                        //     emailListError.length !== 0 || campaignTypeName.length === 0}
                                        disabled={!isValid || emailListError.length !== 0 || campaignTypeName.length === 0
                                            || campaignNameCheckError.length !== 0 || nameSearchFlag || isDisableButton ||
                                            agency.length === 0 || category.length === 0 || advertiser.length === 0
                                        }
                                        startIcon={<ArrowForwardOutlinedIcon fontSize="small" />} >
                                        <span>{t('CONTINUE_BUTTON')}</span>
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </S.Container>
            </Grid>
            {/* <Grid item md={4} xs={12}>
            </Grid> */}
        </Grid >
    );
}

export default Registration;