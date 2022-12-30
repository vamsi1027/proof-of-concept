import React, { useState, useEffect, useContext } from "react";
import {
    Button,
    Tab,
    Tabs,
    Typography,
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Grid,
    Checkbox,
    Chip,
    Menu,
    Fade
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as S from "./PreloadProfilePage.styles";
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import LockIcon from '@material-ui/icons/Lock';
import SendIcon from '@material-ui/icons/Send';
// import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ReplayRoundedIcon from '@material-ui/icons/ReplayRounded';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import { useHistory } from "react-router-dom";

import { apiDashboard, helper, userHasPermission, Mixpanel } from "@dr-one/utils";
import { Breadcrumb, SnackBarMessage, Spinner } from "@dr-one/shared-component";
import { useTranslation } from 'react-i18next';
import { GlobalContext } from '../../../context/globalState';
import VirtualPreloadPopup from '../../../components/VirtualPreloadPopup/VirtualPreloadPopup';
import PreloadProfileTable from "../PreloadProfileTable/PreloadProfileTable";
import CreatePayloadPopup from "../../../components/CreatePayloadPopup/CreatePayloadPopup";
import ProfileActionPopup from "../../../components/ProfileActionPopup/ProfileActionPopup";
import ErrorTwoToneIcon from '@material-ui/icons/ErrorTwoTone';
import NotificationsNoneTwoToneIcon from '@material-ui/icons/NotificationsNoneTwoTone';


function PreloadProfilePage() {
    const { state, dispatch } = useContext(GlobalContext)
    const [tabIndex, setTabIndex] = React.useState(1);
    const { t } = useTranslation();
    const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
    const [openDevicePopup, setDevicePopup] = useState(false);
    // const [channelList, setChannelList] = useState(state.channelList);
    // const [selectedChannel, setChannel] = useState(state.selectedChannelId);
    const [defaultChipValue, setDefaultChipValue] = useState([]);
    const [selectedDeviceList, setSelectedDeviceList] = useState([]);
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const [publishedPage, setPublishedPage] = useState(1);
    const [unPublishedPage, setUnPublishedPage] = useState(1);
    const [showCreatePayloadPopup, toggleCreatePayloadPopup] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [snackbarMessageSuccess, setSnackbarMessageSuccess] = useState(false);
    const [snackbar, setSnackbar] = useState(false);
    const [snackbarMessageValue, setSnackbarMessageValue] = useState('');
    const [actionListStatusUnpublished, setActionListStatusUnpublished] = React.useState(false);
    const [actionListStatusPublished, setActionListStatusPublished] = React.useState(false);
    const [actionListIndexUnpublished, setActionListIndexUnpublished] = React.useState(null);
    const [actionListIndexPublished, setActionListIndexPublished] = React.useState(null);
    const [openProfileActionPopup, toggleProfileActionPopup] = useState(false);
    const [actionName, setActionName] = useState('');

    let history = useHistory();
    const open = Boolean(anchorEl);

    useEffect(() => {
        dispatch({
            type: 'TOGGLE_LOADER',
            payload: true
        })
        apiDashboard
            .get(`preload/supporteddevice/organizationid/${organizationId}?status=ACTIVE`)
            .then(response => {
                dispatch({
                    type: 'GET_DEVICE_LIST',
                    payload: response.data.data
                })
            }, error => {
                dispatch({
                    type: 'GET_DEVICE_LIST',
                    payload: []
                })
            });
        apiDashboard
            .get(`preload/channel/organizationid/${organizationId}`)
            .then(response => {
                const channelData = response.data.data;
                const activeChannelIndex = response.data.data.findIndex(channel => channel.status === 'ACTIVE');
                dispatch({
                    type: 'GET_CHANNEL_LIST',
                    payload: response.data.data
                })
                dispatch({
                    type: 'SET_CHANNEL',
                    payload: activeChannelIndex > -1 ? response.data.data[activeChannelIndex]?.id : response.data.data[0]?.id
                })
                apiDashboard
                    .get(`preload/supportedapp/channel/${activeChannelIndex > -1 ? response.data.data[activeChannelIndex]?.id : response.data.data[0]?.id}`)
                    .then(response => {
                        const defaultElementArray = [{ id: 1, appName: '', appIcon: '', appVersionName: '' }];
                        dispatch({
                            type: 'GET_APP_LIST',
                            payload: defaultElementArray.concat(response.data.data)
                        })
                    }, error => {
                        dispatch({
                            type: 'GET_APP_LIST',
                            payload: []
                        })
                    });
                apiDashboard
                    .get(`preload/profile/organizationid/${organizationId}/channelid/${activeChannelIndex > -1 ? response.data.data[activeChannelIndex]?.id : response.data.data[0]?.id}`)
                    .then(response => {
                        modifyProfile(response, response.data.data[0]?.channelId, channelData);
                    }, error => {
                        setSelectedDeviceList([]);
                        setDefaultChipValue([]);
                        dispatch({
                            type: 'GET_PROFILE',
                            payload: {
                                publishedProfile: {},
                                unPublishedProfile: {},
                                isSlotModified: false,
                                isCellModified: false,
                                enabledSlotsBeforeModification: [],
                                deviceListBeforeModification: [],
                                profileErrorStatus404: error.response.status === 404 ? true : false,
                                scrollPosition: state.scrollPosition,
                                selectedNoOfSlots: state.selectedNoOfSlots,
                                profileApiResponseSlots: []
                            }
                        })
                        if (error.response.status === 404) {
                            toggleCreatePayloadPopup(true);
                        }
                    });
            }, error => {
                dispatch({
                    type: 'GET_CHANNEL_LIST',
                    payload: []
                })
                dispatch({
                    type: 'SET_CHANNEL',
                    payload: ''
                })
                dispatch({
                    type: 'TOGGLE_LOADER',
                    payload: false
                })
            });
        Mixpanel.track("Preload Profile Page View");
        return () => {
            dispatch({
                type: 'RESET_STATE',
                payload: {
                    channelList: [],
                    selectedChannelId: '',
                    appList: [],
                    deviceList: [],
                    publishedProfile: {},
                    unPublishedProfile: {},
                    isSlotModified: false,
                    isCellModified: false,
                    enabledSlotsBeforeModification: [],
                    deviceListBeforeModification: [],
                    profileErrorStatus404: false,
                    selectedNoOfSlots: null,
                    scrollPosition: 0,
                    profileApiResponseSlots: []
                }
            })
        }
    }, []);

    const handleChange = (event: any, newValue: number): void => {
        Mixpanel.track(`${newValue === 0 ? 'Published' : 'Unpublished'} Profile View`, { page: 'Preload Profile Page View' });
        setTabIndex(newValue);
    };

    const a11yProps = (index: number): any => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const TabPanel = (props: any): any => {
        const { children, value, index, ...other } = props;

        return (
            <Typography
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {
                    value === index && (
                        <Box p={3}>
                            <Typography>{children}</Typography>
                        </Box>)
                }
            </Typography>
        );
    }

    const handleOpenModal = (value: boolean, action: string, message: string, isCreatePreloadPopup: boolean = false): void => {
        setDevicePopup(value);
        toggleProfileActionPopup(value);
        toggleCreatePayloadPopup(value);

        if (action === 'submit' && actionName?.length === 0) {
            apiDashboard.get(`preload/supporteddevice/organizationid/${organizationId}?status=ACTIVE`).then(response => {
                dispatch({
                    type: 'GET_DEVICE_DATA',
                    payload: response.data
                })
            }, error => {
                console.log(helper.getErrorMessage(error));
            })
        }
        if (action === 'submit' && actionName?.length !== 0) {
            setSnackbar(true);
            setSnackbarMessageSuccess(true);
            setSnackbarMessageValue(actionName === 'PUBLISH' ? t('PRELOAD_PROFILE_STATUS_PUBLISHED_MESSAGE') : message);
            setTimeout(() => {
                setSnackbar(false);
                setSnackbarMessageSuccess(false);
                setSnackbarMessageValue('');
            }, 3000);
            apiDashboard
                .get(`preload/profile/organizationid/${organizationId}/channelid/${state.selectedChannelId}`)
                .then(response => {
                    if (actionName === 'PUBLISH') {
                        setTabIndex(0);
                    }
                    modifyProfile(response, state.selectedChannelId, state.channelList);
                }, error => {
                    setSelectedDeviceList([]);
                    setDefaultChipValue([]);
                    dispatch({
                        type: 'GET_PROFILE',
                        payload: {
                            publishedProfile: state.publishedProfile,
                            unPublishedProfile: state.unPublishedProfile,
                            isSlotModified: false,
                            isCellModified: false,
                            enabledSlotsBeforeModification: [],
                            deviceListBeforeModification: [],
                            profileErrorStatus404: error.response.status === 404 ? true : false,
                            scrollPosition: state.scrollPosition,
                            selectedNoOfSlots: state.selectedNoOfSlots,
                            profileApiResponseSlots: state.profileApiResponseSlots
                        }
                    })
                    dispatch({
                        type: 'TOGGLE_LOADER',
                        payload: false
                    })
                });
        }
        if (action === 'cancel' && isCreatePreloadPopup) {
            dispatch({
                type: 'TOGGLE_LOADER',
                payload: false
            })
        }
    }

    // const updateAppAndProfile = (e: any): void => {
    //     dispatch({
    //         type: 'TOGGLE_LOADER',
    //         payload: true
    //     })
    //     apiDashboard
    //         .get(`preload/supportedapp/channel/${e.target?.value}`)
    //         .then(response => {
    //             Mixpanel.track(`Channel Change Action`, { channelId: e.target.value, page: 'Preload Profile Page View' });
    //             const defaultElementArray = [{ id: 1, appName: '', appIcon: '', appVersionName: '' }];
    //             dispatch({
    //                 type: 'GET_APP_LIST',
    //                 payload: defaultElementArray.concat(response.data.data)
    //             })
    //         }, error => {
    //             dispatch({
    //                 type: 'GET_APP_LIST',
    //                 payload: []
    //             })
    //         });
    //     apiDashboard
    //         .get(`preload/profile/organizationid/${organizationId}/channelid/${e.target?.value}`)
    //         .then(response => {
    //             modifyProfile(response, e.target?.value, state.channelList);
    //         }, error => {
    //             setSelectedDeviceList([]);
    //             setDefaultChipValue([]);
    //             dispatch({
    //                 type: 'GET_PROFILE',
    //                 payload: {
    //                     publishedProfile: {},
    //                     unPublishedProfile: {},
    //                     isSlotModified: false,
    //                     isCellModified: false,
    //                     enabledSlotsBeforeModification: [],
    //                     deviceListBeforeModification: [],
    //                     profileErrorStatus404: error.response.status === 404 ? true : false,
    //                     scrollPosition: state.scrollPosition,
    //                     selectedNoOfSlots: state.selectedNoOfSlots
    //                 }
    //             })
    //             dispatch({
    //                 type: 'TOGGLE_LOADER',
    //                 payload: false
    //             })
    //             if (error.response.status === 404) {
    //                 toggleCreatePayloadPopup(true);
    //             }
    //         });
    // }

    const update = (tabName: number, page: number): void => {
        if (tabName === 0) {
            setPublishedPage(page + 1);
        } else if (tabName === 1) {
            setUnPublishedPage(page + 1);
        }
    }

    // const canCreateDevice = (): boolean => {
    //     return ((state?.deviceList?.length > 0) && (state?.channelList?.length > 0)
    //         && tabIndex === 1
    //         && (state.publishedProfile?.items?.length === 0 && state.unPublishedProfile?.items?.length === 0
    //             || (['DRAFT', 'REJECTED'].indexOf(state.unPublishedProfile.status) !== -1)
    //         ))
    //         && userHasPermission(['C_PRELOAD_PROFILE', 'C_PRELOAD_PROFILE_OWN_ORG', 'U_PRELOAD_PROFILE', 'U_PRELOAD_PROFILE_OWN', 'U_PRELOAD_PROFILE_OWN_ORG'])
    //         ;
    // }

    // const canDeleteDevice = (): boolean => {
    //     return (Object.keys(state.unPublishedProfile).length !== 0 && ['DRAFT', 'REJECTED'].indexOf(state.unPublishedProfile.status) !== -1
    //         && userHasPermission(['U_PRELOAD_PROFILE', 'U_PRELOAD_PROFILE_OWN', 'U_PRELOAD_PROFILE_OWN_ORG'])
    //     );
    // }

    const canSaveProfile = (): boolean => {
        return ((state.isSlotModified || state.isCellModified)
            && Object.keys(state.unPublishedProfile).length !== 0
            && (['DRAFT', 'REJECTED'].indexOf(state.unPublishedProfile.status) !== -1 || !state.unPublishedProfile.hasOwnProperty('status'))
            && userHasPermission(['U_PRELOAD_PROFILE', 'U_PRELOAD_PROFILE_OWN', 'U_PRELOAD_PROFILE_OWN_ORG', 'C_PRELOAD_PROFILE', 'C_PRELOAD_PROFILE_OWN_ORG'])
        );
    }

    const canSubmitProfile = (): boolean => {
        return (Object.keys(state.unPublishedProfile).length !== 0
            && !state.isSlotModified && !state.isCellModified
            && ['DRAFT', 'REJECTED'].indexOf(state.unPublishedProfile.status) !== -1
            && userHasPermission(['U_PROFILE_STATUS_DRAFT_TO_PENDING', 'U_PROFILE_STATUS_DRAFT_TO_PENDING_OWN', 'U_PROFILE_STATUS_DRAFT_TO_PENDING_OWN_ORG', 'U_PROFILE_STATUS_REJECTED_TO_PENDING', 'U_PROFILE_STATUS_REJECTED_TO_PENDING_OWN', 'U_PROFILE_STATUS_REJECTED_TO_PENDING_OWN_ORG'])
        );
    }

    const canRevertProfile = (): boolean => {
        return (Object.keys(state.unPublishedProfile).length !== 0 && Object.keys(state.publishedProfile).length !== 0)
            && ['DRAFT', 'REJECTED'].indexOf(state.unPublishedProfile.status) !== -1
            && userHasPermission(['U_PRELOAD_PROFILE', 'U_PRELOAD_PROFILE_OWN', 'U_PRELOAD_PROFILE_OWN_ORG'])
    }

    const canLockProfile = (): boolean => {
        return (Object.keys(state.unPublishedProfile).length !== 0
            && state.unPublishedProfile.status === 'PENDING'
            && userHasPermission(['U_PROFILE_STATUS_PENDING_TO_LOCKED', 'U_PROFILE_STATUS_PENDING_TO_LOCKED_OWN', 'U_PROFILE_STATUS_PENDING_TO_LOCKED_OWN_ORG'])
        );
    }

    const canDenyProfile = (): boolean => {
        return (Object.keys(state.unPublishedProfile).length !== 0
            && state.unPublishedProfile.status === 'LOCKED'
            && userHasPermission(['U_PROFILE_STATUS_LOCKED_TO_REJECTED', 'U_PROFILE_STATUS_LOCKED_TO_REJECTED_OWN', 'U_PROFILE_STATUS_LOCKED_TO_REJECTED_OWN_ORG'])
        );
    }

    const canPublishProfile = (): boolean => {
        return (Object.keys(state.unPublishedProfile).length !== 0
            && state.unPublishedProfile.status === 'LOCKED'
            && userHasPermission(['U_PROFILE_STATUS_LOCKED_TO_PUBLISHED', 'U_PROFILE_STATUS_LOCKED_TO_PUBLISHED_OWN', 'U_PROFILE_STATUS_LOCKED_TO_PUBLISHED_OWN_ORG'])
        );
    }

    const handleClick = (event): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const modifyProfile = (response: any, channelId: string, channelData: any): void => {
        const publishedProfileIndex = response.data.data.findIndex(profile => profile.status === 'PUBLISHED');
        const unPublishedProfileIndex = response.data.data.findIndex(profile => profile.status !== 'PUBLISHED');
        const selectedChannelIndex = channelData.findIndex(channel => channel.id === channelId);
        const responseObject = JSON.parse(JSON.stringify(response.data.data));
        const enabledSlotArray = unPublishedProfileIndex > -1 ? responseObject[unPublishedProfileIndex].enabledSlots : [];
        let isModifySlot = false;
        let slotCount = response.data.data[unPublishedProfileIndex]?.items[0]?.slots?.length;

        if (selectedChannelIndex > -1) {
            slotCount = channelData[selectedChannelIndex].numberOfSlots;
            if (unPublishedProfileIndex > -1 && (response.data.data[unPublishedProfileIndex]?.status === 'DRAFT'
                || response.data.data[unPublishedProfileIndex]?.status === 'REJECTED')) {
                if (slotCount !== response.data.data[unPublishedProfileIndex]?.items[0]?.slots.length) {
                    isModifySlot = true;
                }
            }
        }

        if (response?.data?.data?.length === 0) {
            toggleCreatePayloadPopup(true);
            toggleProfileActionPopup(false);
            setDevicePopup(false);
        }

        dispatch({
            type: 'GET_PROFILE',
            payload: {
                publishedProfile: publishedProfileIndex > -1 ? response.data.data[publishedProfileIndex] : {},
                unPublishedProfile: unPublishedProfileIndex > -1 ? isModifySlot ? renderModifiySlots(response.data.data[unPublishedProfileIndex], slotCount, response.data.data[unPublishedProfileIndex].items[0]?.slots.length) : response.data.data[unPublishedProfileIndex] : {},
                isSlotModified: isModifySlot ? true : false,
                isCellModified: false,
                enabledSlotsBeforeModification: enabledSlotArray,
                deviceListBeforeModification: unPublishedProfileIndex > -1 && response.data.data[unPublishedProfileIndex]?.items?.length !== 0 ? response.data.data[unPublishedProfileIndex].items : [],
                profileErrorStatus404: response?.data?.data?.length === 0 ? true : false,
                scrollPosition: state.scrollPosition,
                selectedNoOfSlots: slotCount,
                profileApiResponseSlots: (publishedProfileIndex > -1) ? responseObject[publishedProfileIndex].items[0]?.slots : (unPublishedProfileIndex > -1) ? responseObject[publishedProfileIndex].items[0]?.slots : []
            }
        })
        dispatch({
            type: 'TOGGLE_LOADER',
            payload: false
        })
        setActionListStatusPublished(actionListStatusPublished => actionListStatusPublished);
        setActionListIndexPublished(actionListIndexPublished => actionListIndexPublished);
        setActionListIndexUnpublished(actionListIndexUnpublished => actionListIndexUnpublished);
        setActionListStatusUnpublished(actionListStatusUnpublished => actionListStatusUnpublished);
        const modifiedDeviceList = [];
        const modifiedChipList = [];
        if (unPublishedProfileIndex > -1) {
            response.data.data[unPublishedProfileIndex].items.forEach(device => {
                modifiedDeviceList.push(device.deviceId);
                modifiedChipList.push({
                    id: device.deviceId,
                    make: device.deviceMake,
                    model: device.deviceModel,
                    name: device.deviceName
                })
            })
            setSelectedDeviceList(modifiedDeviceList);
            setDefaultChipValue(modifiedChipList);
        } else {
            setSelectedDeviceList(modifiedDeviceList);
            setDefaultChipValue(modifiedChipList);
        }
    }

    const revertProfileChanges = (): void => {
        dispatch({
            type: 'TOGGLE_LOADER',
            payload: true
        })
        handleClose();
        const profileId = state.unPublishedProfile.id;
        apiDashboard
            .put(`preload/profile/reset/${profileId}`, {})
            .then(response => {
                Mixpanel.track('Profile Revert Action', { profileId: profileId, channelId: state.selectedChannelId, page: 'Preload Profile Page View' });
                setSnackbar(true);
                setSnackbarMessageSuccess(true);
                setSnackbarMessageValue(response.data.message);
                setTimeout(() => {
                    setSnackbar(false);
                    setSnackbarMessageSuccess(false);
                    setSnackbarMessageValue('');
                }, 3000);
                apiDashboard
                    .get(`preload/profile/organizationid/${organizationId}/channelid/${state.selectedChannelId}`)
                    .then(response => {
                        modifyProfile(response, state.selectedChannelId, state.channelList);
                    }, error => {
                        setSelectedDeviceList([]);
                        setDefaultChipValue([]);
                        dispatch({
                            type: 'GET_PROFILE',
                            payload: {
                                publishedProfile: state.publishedProfile,
                                unPublishedProfile: state.unPublishedProfile,
                                isSlotModified: false,
                                isCellModified: false,
                                enabledSlotsBeforeModification: [],
                                deviceListBeforeModification: [],
                                profileErrorStatus404: error.response.status === 404 ? true : false,
                                scrollPosition: state.scrollPosition,
                                selectedNoOfSlots: state.selectedNoOfSlots,
                                profileApiResponseSlots: state.profileApiResponseSlots
                            }
                        })
                        dispatch({
                            type: 'TOGGLE_LOADER',
                            payload: false
                        })
                    });
            }, error => {
                setSnackbar(true);
                setSnackbarMessageSuccess(false);
                setSnackbarMessageValue(helper.getErrorMessage(error));
                dispatch({
                    type: 'TOGGLE_LOADER',
                    payload: false
                })
            });
    }

    const saveProfileChanges = () => {
        handleClose();
        const profileBuildData = {
            channelId: state.selectedChannelId,
            enabledSlots: state.unPublishedProfile.enabledSlots
        };
        const itemsArray = [];
        state.unPublishedProfile?.items?.forEach(item => {
            itemsArray.push({
                deviceId: item.deviceId,
                slots: item.slots
            })
        });
        profileBuildData['items'] = itemsArray;
        if (state.isCellModified || state.isSlotModified) {
            dispatch({
                type: 'TOGGLE_LOADER',
                payload: true
            })
            const profileId = state.unPublishedProfile.id;
            if (profileId === undefined) {
                apiDashboard
                    .post(`preload/profile`, profileBuildData)
                    .then(response => {
                        Mixpanel.track('Profile Save Action', { profileId: profileId, channelId: state.selectedChannelId, page: 'Preload Profile Page View' });
                        setSnackbar(true);
                        setSnackbarMessageSuccess(true);
                        setSnackbarMessageValue(response.data.message);
                        setTimeout(() => {
                            setSnackbar(false);
                            setSnackbarMessageSuccess(false);
                            setSnackbarMessageValue('');
                        }, 3000);
                        apiDashboard
                            .get(`preload/profile/organizationid/${organizationId}/channelid/${state.selectedChannelId}`)
                            .then(response => {
                                modifyProfile(response, state.selectedChannelId, state.channelList);
                            }, error => {
                                setSelectedDeviceList([]);
                                setDefaultChipValue([]);
                                dispatch({
                                    type: 'GET_PROFILE',
                                    payload: {
                                        publishedProfile: state.publishedProfile,
                                        unPublishedProfile: state.unPublishedProfile,
                                        isSlotModified: false,
                                        isCellModified: false,
                                        enabledSlotsBeforeModification: [],
                                        deviceListBeforeModification: [],
                                        profileErrorStatus404: error.response.status === 404 ? true : false,
                                        scrollPosition: state.scrollPosition,
                                        selectedNoOfSlots: state.selectedNoOfSlots,
                                        profileApiResponseSlots: state.profileApiResponseSlots
                                    }
                                })
                                dispatch({
                                    type: 'TOGGLE_LOADER',
                                    payload: false
                                })
                            });
                    }, error => {
                        dispatch({
                            type: 'TOGGLE_LOADER',
                            payload: false
                        })
                        setSnackbar(true);
                        setSnackbarMessageSuccess(false);
                        setSnackbarMessageValue(helper.getErrorMessage(error));
                    });
            } else {
                apiDashboard
                    .put(`preload/profile/${profileId}`, profileBuildData)
                    .then(response => {
                        setSnackbar(true);
                        setSnackbarMessageSuccess(true);
                        setSnackbarMessageValue(response.data.message);
                        setTimeout(() => {
                            setSnackbar(false);
                            setSnackbarMessageSuccess(false);
                            setSnackbarMessageValue('');
                        }, 3000);
                        apiDashboard
                            .get(`preload/profile/organizationid/${organizationId}/channelid/${state.selectedChannelId}`)
                            .then(response => {
                                modifyProfile(response, state.selectedChannelId, state.channelList);
                            }, error => {
                                setSelectedDeviceList([]);
                                setDefaultChipValue([]);
                                dispatch({
                                    type: 'GET_PROFILE',
                                    payload: {
                                        publishedProfile: state.publishedProfile,
                                        unPublishedProfile: state.unPublishedProfile,
                                        isSlotModified: false,
                                        isCellModified: false,
                                        enabledSlotsBeforeModification: [],
                                        deviceListBeforeModification: [],
                                        profileErrorStatus404: error.response.status === 404 ? true : false,
                                        scrollPosition: state.scrollPosition,
                                        selectedNoOfSlots: state.selectedNoOfSlots,
                                        profileApiResponseSlots: state.profileApiResponseSlots
                                    }
                                })
                                dispatch({
                                    type: 'TOGGLE_LOADER',
                                    payload: false
                                })
                            });
                    }, error => {
                        dispatch({
                            type: 'TOGGLE_LOADER',
                            payload: false
                        })
                        setSnackbar(true);
                        setSnackbarMessageSuccess(false);
                        setSnackbarMessageValue(helper.getErrorMessage(error));
                    });
            }
        }
    }

    const undoProfileChanges = (): void => {
        handleClose();
        Mixpanel.track('Profile Undo Action', { profileId: state.unPublishedProfile.id, channelId: state.selectedChannelId, page: 'Preload Profile Page View' });
        const modifiedPayload = Object.assign({}, state.unPublishedProfile);
        modifiedPayload['enabledSlots'] = state.enabledSlotsBeforeModification;
        modifiedPayload['items'] = state.deviceListBeforeModification;
        const slotArray = modifiedPayload.items && modifiedPayload.items.length !== 0 ? [...modifiedPayload.items[0]?.slots] : [];
        const slotDifference = Math.abs(state.profileApiResponseSlots.length - modifiedPayload.items[0]?.slots.length);
        
        if (state.profileApiResponseSlots.length < slotArray.length) {
            const slotArrayModified = slotArray.filter((x, i) => i < (slotArray?.length - slotDifference));
            modifiedPayload.items.map(item => {
                item['slots'] = slotArrayModified;
            })
        } else {
            for (let i = 0; i < slotDifference; i++) {
                slotArray.push({
                    preloadChannelSlotIndex: i + (state.profileApiResponseSlots.length - 1),
                    preloadSupportedAppId: null,
                    appName: null,
                    appIcon: null,
                    appVersionCode: null,
                    appVersionName: null,
                    packageName: null
                })
            }
            modifiedPayload.items.map(item => {
                item['slots'] = slotArray;
            })
        }
        const newChipArray = [];
        const modifiledDevicelList = [];
        state.deviceListBeforeModification?.forEach(device => {
            newChipArray.push({
                id: device.deviceId,
                make: device.deviceMake,
                name: device.deviceName,
                model: device.deviceModel
            })
            modifiledDevicelList.push(device.deviceId);
        })

        dispatch({
            type: 'GET_PROFILE',
            payload: {
                publishedProfile: state.publishedProfile,
                unPublishedProfile: state.deviceListBeforeModification?.length === 0 && state.enabledSlotsBeforeModification?.length === 0 ? {} : modifiedPayload,
                isSlotModified: false,
                isCellModified: false,
                enabledSlotsBeforeModification: state.enabledSlotsBeforeModification,
                deviceListBeforeModification: state.deviceListBeforeModification,
                profileErrorStatus404: state.profileErrorStatus404,
                scrollPosition: state.scrollPosition,
                selectedNoOfSlots: modifiedPayload.items[0].slots.length,
                profileApiResponseSlots: state.profileApiResponseSlots
            }
        })
        setDefaultChipValue(newChipArray);
        setSelectedDeviceList(modifiledDevicelList);

        if (state.deviceListBeforeModification?.length === 0 && state.enabledSlotsBeforeModification?.length === 0) {
            setUnPublishedPage(1);
        } else {
            const deviceCount = Math.ceil(modifiedPayload.items?.length / 5);
            if (deviceCount < unPublishedPage) {
                setUnPublishedPage(1);
            }
        }
    }

    const onActionListToggle = (actionStatus: boolean, tabName: number, rowNumber: number): void => {
        if (tabName === 0) {
            setActionListStatusPublished(actionStatus);
            setActionListIndexPublished(rowNumber);
        } else if (tabName === 1) {
            setActionListStatusUnpublished(actionStatus);
            setActionListIndexUnpublished(rowNumber);
        }
    }

    const onOpenSubmitForApprovalPopup = (status: string): void => {
        if (status === 'PENDING') {
            Mixpanel.track('Submit For Approval Confirmation Popup Clicked', { profileId: state.unPublishedProfile.id, channelId: state.selectedChannelId, page: 'Preload Management List Page View' });
        } else if (status === 'LOCKED') {
            Mixpanel.track('Review Action Confirmation Popup Clicked', { profileId: state.unPublishedProfile.id, channelId: state.selectedChannelId, page: 'Preload Management List Page View' });
        } else if (status === 'REJECTED') {
            Mixpanel.track('Deny Action Confirmation Popup Clicked', { profileId: state.unPublishedProfile.id, channelId: state.selectedChannelId, page: 'Preload Management List Page View' });
        } else if (status === 'PUBLISHED') {
            Mixpanel.track('Publish Action Confirmation Popup Clicked', { profileId: state.unPublishedProfile.id, channelId: state.selectedChannelId, page: 'Preload Management List Page View' });
        }
        handleClose();
        setActionName(status);
        toggleProfileActionPopup(true);
        setDevicePopup(false);
        toggleCreatePayloadPopup(false);
    }

    const renderModifiySlots = (profile: any, slotCount: number, previousSlotCount: number): any => {
        const slotArray = profile.items && profile.items.length !== 0 ? [...profile.items[0]?.slots] : [];
        const slotDifference = Math.abs(slotCount - slotArray?.length);

        if (slotCount > slotArray.length) {
            const modifiedPayload = Object.assign({}, profile);

            for (let i = 0; i < slotDifference; i++) {
                slotArray.push({
                    preloadChannelSlotIndex: i + previousSlotCount,
                    preloadSupportedAppId: null,
                    appName: null,
                    appIcon: null,
                    appVersionCode: null,
                    appVersionName: null,
                    packageName: null
                })
                // modifiedPayload['enabledSlots'].push(i + previousSlotCount);
            }
            modifiedPayload.items.map(item => {
                item['slots'] = slotArray;
            })
            return modifiedPayload;
        } else {
            const slotArrayModified = slotArray.filter((x, i) => i < (slotArray?.length - slotDifference));
            const modifiedPayload = Object.assign({}, profile);
            modifiedPayload.items.map(item => {
                item['slots'] = slotArrayModified;
            })
            return modifiedPayload;
        }
    }

    return (
        <S.Container className="inner-container">
            <Breadcrumb hierarchy={[t('VIRTUAL_PRELOAD'), t('PRELOAD_PROFILE')]} />
            <div className="mb-20">
                <div>
                    <h1 className="page-title">{t('PRELOAD_PROFILE')}</h1>
                </div>
                {/* {canCreateDevice() && <div className="header-main-btn">
                    <Button variant="contained" color="primary" className="button-lg dark-blue" endIcon={<AddOutlinedIcon fontSize="small" />} onClick={() => {
                        setDevicePopup(true);
                        toggleSubmitForApprovalPopup(false);
                        toggleCreatePayloadPopup(false);
                    }}>{t('PRELOAD_PROFILE_BUTTON_INPUT_DEVICES')}</Button>
                </div>} */}
            </div>

            <div className="tabs-wrapper">
                {!state.profileErrorStatus404 && <Tabs value={tabIndex} onChange={handleChange} aria-label="simple tabs example" scrollButtons="auto"
                    textColor="secondary">
                    <Tab label={t('PRELOAD_PROFILE_PUBLISHED_TAB')} {...a11yProps(0)} className={tabIndex === 0 ? 'cm-btn-active' : ''} />
                    <Tab label={t('PRELOAD_PROFILE_UNPUBLISHED_TAB')} {...a11yProps(1)} className={tabIndex === 1 ? 'cm-btn-active' : ''} />
                </Tabs>}
                <div className="preload-right-sec">
                    {(tabIndex === 1 && !state.toggleLoader &&
                        ((Object.keys(state.unPublishedProfile).length !== 0 &&
                            (state.unPublishedProfile?.status === 'DRAFT' || state.unPublishedProfile?.status === 'REJECTED' || !state.unPublishedProfile.hasOwnProperty('status')))
                            || (Object.keys(state.unPublishedProfile).length === 0 && state.profileErrorStatus404))) &&
                        <Grid item xs={12} sm={12} className="channel-association">
                            <div className="device-dropdown">
                                <p>{t('DEVICE_LABEL')}</p>
                                <Autocomplete
                                    // popupIcon={<AddCircleOutlineOutlinedIcon />}
                                    limitTags={2}
                                    multiple
                                    id="checkboxes-tags-demo"
                                    options={state.deviceList}
                                    disableCloseOnSelect
                                    disableClearable
                                    value={defaultChipValue}
                                    getOptionLabel={(option) => option.name}
                                    // getOptionSelected={(option, value) => option.name === value.name}
                                    // getOptionDisabled={(option) => canDeleteDevice() ? true : false}
                                    onChange={(e: any, newValue) => {
                                        const profile = state.unPublishedProfile;
                                        const modifiedPayload = Object.assign({}, profile);
                                        const deviceObjectSeen = {};
                                        let modifiedDeviceList = [...newValue];
                                        const hasDuplicates = newValue.some(currentObject => {
                                            return deviceObjectSeen.hasOwnProperty(currentObject.id)
                                                || (deviceObjectSeen[currentObject.id] = false);
                                        });
                                        if (hasDuplicates && !e.target.checked) {
                                            modifiedDeviceList = newValue.filter(val => val.id !== newValue[newValue.length - 1].id);
                                        }
                                        const modifiledDevicelListArray = [];
                                        modifiedDeviceList.forEach(device => {
                                            modifiledDevicelListArray.push(device.id);
                                        })
                                        setDefaultChipValue(modifiedDeviceList);
                                        setSelectedDeviceList(modifiledDevicelListArray);
                                        const selectedChannelIndex = state.channelList.findIndex(channel => channel.id === state.selectedChannelId);
                                        let slotCount;
                                        if (selectedChannelIndex > -1) {
                                            slotCount = state.channelList[selectedChannelIndex].numberOfSlots;
                                        } else {
                                            slotCount = 6;
                                        }

                                        const slotArray = [];
                                        if (Object.keys(profile).length !== 0 && profile?.items?.length !== 0) {
                                            modifiedPayload?.items[0]?.slots.forEach((slot, index) => {
                                                slotArray.push({
                                                    preloadChannelSlotIndex: index,
                                                    preloadSupportedAppId: null,
                                                    appName: null,
                                                    appIcon: null,
                                                    appVersionCode: null,
                                                    appVersionName: null,
                                                    packageName: null
                                                })
                                            })
                                        } else {
                                            for (let i = 0; i < slotCount; i++) {
                                                slotArray.push({
                                                    preloadChannelSlotIndex: i,
                                                    preloadSupportedAppId: null,
                                                    appName: null,
                                                    appIcon: null,
                                                    appVersionCode: null,
                                                    appVersionName: null,
                                                    packageName: null
                                                })
                                            }
                                        }
                                        const deviceListForReset = state.deviceListBeforeModification.slice();
                                        if (modifiedDeviceList.length > profile.items?.length && profile.items?.length !== 0) {
                                            const filteredDeviceDataList = modifiedDeviceList.filter(({ id: id1 }) => !profile.items.some(({ deviceId: id2 }) => id2 === id1));
                                            filteredDeviceDataList?.forEach((device, index) => {
                                                modifiedPayload.items.push({
                                                    deviceId: device.id,
                                                    deviceMake: device.make,
                                                    deviceModel: device.model,
                                                    deviceName: device.name,
                                                    slots: slotArray
                                                })
                                            })
                                        } else {
                                            if (Object.keys(profile).length !== 0 && profile?.items?.length !== 0) {
                                                const filteredDeviceDataList = profile.items.filter(({ deviceId: id1 }) => modifiedDeviceList.some(({ id: id2 }) => id2 === id1));
                                                modifiedPayload['items'] = filteredDeviceDataList;
                                            } else {
                                                const deviceArray = [];
                                                modifiedDeviceList.forEach((device, index) => {
                                                    deviceArray.push({
                                                        deviceId: device.id,
                                                        deviceMake: device.make,
                                                        deviceModel: device.model,
                                                        deviceName: device.name,
                                                        slots: slotArray
                                                    })
                                                })
                                                modifiedPayload['items'] = deviceArray;
                                                const enabledSlotArray = [];
                                                for (let i = 0; i < slotCount; i++) {
                                                    enabledSlotArray.push(i);
                                                }
                                                modifiedPayload['enabledSlots'] = enabledSlotArray;
                                            }
                                        }
                                        dispatch({
                                            type: 'GET_PROFILE',
                                            payload: {
                                                publishedProfile: state.publishedProfile,
                                                unPublishedProfile: modifiedPayload,
                                                isSlotModified: Object.keys(profile).length === 0 ? true : state.isSlotModified,
                                                isCellModified: true,
                                                enabledSlotsBeforeModification: state.enabledSlotsBeforeModification,
                                                deviceListBeforeModification: deviceListForReset,
                                                profileErrorStatus404: state.profileErrorStatus404,
                                                scrollPosition: state.scrollPosition,
                                                selectedNoOfSlots: modifiedPayload.items && modifiedPayload.items.length !== 0 ? modifiedPayload.items[0].slots?.length : 6,
                                                profileApiResponseSlots: state.profileApiResponseSlots
                                            }
                                        })
                                    }}

                                    renderOption={(option, { selected }) => (
                                        <React.Fragment>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                color="primary"
                                                checked={selectedDeviceList?.includes(option.id)}
                                            />
                                            {option.name}
                                        </React.Fragment>
                                    )}
                                    renderTags={(tagValue, getTagProps) =>
                                        defaultChipValue.map((option, index) => (
                                            <Chip
                                                label={option.name}
                                                {...getTagProps({ index })}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} variant="outlined"
                                            placeholder={t('PRELOAD_PROFILE_DEVICE_AUTOCOMPLETE_SEARCH_PLACEHOLDER')}
                                        />

                                    )}
                                />
                            </div>
                        </Grid>}
                    {(tabIndex === 1 && Object.keys(state.unPublishedProfile).length !== 0 && (state.unPublishedProfile?.status === 'LOCKED' || state.unPublishedProfile?.status === 'PENDING' ||
                        state.unPublishedProfile?.status === 'ARCHIVED')) && <div className="alert waring">
                            <div className="alert-icon"><ErrorTwoToneIcon /></div>
                            <div className="alert-message">{helper.stringCapitalize(state.unPublishedProfile?.status)}</div>
                        </div>}
                    {(tabIndex === 1 && Object.keys(state.unPublishedProfile).length !== 0 && state.unPublishedProfile?.status === 'DRAFT') && <div className="alert draft">
                        <div className="alert-icon"><ErrorTwoToneIcon /></div>
                        <div className="alert-message">{helper.stringCapitalize(state.unPublishedProfile?.status)}</div>
                    </div>}
                    {(tabIndex === 1 && Object.keys(state.unPublishedProfile).length !== 0 && state.unPublishedProfile?.status === 'REJECTED') && <div className="alert status-inactive">
                        <div className="alert-icon"><ErrorTwoToneIcon /></div>
                        <div className="alert-message">{helper.stringCapitalize(state.unPublishedProfile?.status)}</div>
                    </div>}
                    {(tabIndex === 0 && Object.keys(state.publishedProfile).length !== 0) && <div className="alert success">
                        <div className="alert-icon"><NotificationsNoneTwoToneIcon /></div>
                        <div className="alert-message">{t('PRELOAD_PROFILE_PUBLISHED_TAB_STATUS')}</div>
                    </div>}
                    {(tabIndex === 1 && Object.keys(state.unPublishedProfile).length !== 0 && (canSaveProfile() ||
                        canSubmitProfile() || canRevertProfile() || canLockProfile() || canDenyProfile() || canPublishProfile())) && <div className="preload-action">
                            <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
                                {t('ACTIONS')}<ExpandMoreIcon />
                            </Button>
                            <Menu
                                id="fade-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={open}
                                onClose={handleClose}
                                TransitionComponent={Fade}
                                className="actionmenus"
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                }}
                                getContentAnchorEl={null}
                            >
                                {canSaveProfile() && <MenuItem onClick={() => saveProfileChanges()} disabled={state.toggleLoader}>{t('SAVE_BUTTON')} <SaveOutlinedIcon /></MenuItem>}
                                {canSaveProfile() && <MenuItem onClick={() => undoProfileChanges()} disabled={state.toggleLoader}>{t('PRELOAD_PROFILE_ACTION_UNDO')} <ReplayRoundedIcon /></MenuItem>}
                                {canSubmitProfile() && <MenuItem onClick={() => onOpenSubmitForApprovalPopup('PENDING')} disabled={state.toggleLoader}>{t('ACTION_SUBMIT_FOR_APPROVAL')} <SendIcon /></MenuItem>}
                                {canRevertProfile() && <MenuItem onClick={() => revertProfileChanges()} disabled={state.toggleLoader}>{t('PRELOAD_PROFILE_ACTION_REVERT')} <HistoryOutlinedIcon /></MenuItem>}
                                {canLockProfile() && <MenuItem onClick={() => onOpenSubmitForApprovalPopup('LOCKED')} disabled={state.toggleLoader}>{t('ACTION_REVIEW')} <LockIcon /></MenuItem>}
                                {canDenyProfile() && <MenuItem onClick={() => onOpenSubmitForApprovalPopup('REJECTED')} disabled={state.toggleLoader}>{t('ACTION_DENY')} <ThumbDownIcon /></MenuItem>}
                                {canPublishProfile() && <MenuItem onClick={() => onOpenSubmitForApprovalPopup('PUBLISHED')} disabled={state.toggleLoader}>{t('PRELOAD_PROFILE_ACTION_PUBLISH')} <ThumbUpIcon /></MenuItem>}
                            </Menu>
                        </div>}

                    <div className="action-icons-container">
                        <div className="icon-wrap">
                            <SettingsTwoToneIcon onClick={() => history.push('/virtual-preload/management')} />
                        </div>
                    </div>
                </div>

            </div>
            <div className="position-relative">
                {state.toggleLoader && <div className="spinner-wrap"><Spinner color={"blue"} /></div>}
                <div className="table-head-top">
                    {((tabIndex === 0 && state?.publishedProfile?.updatedAt) ||
                        (tabIndex === 1 && state?.unPublishedProfile?.updatedAt)) && <p className="last-date"><b>{t('LAST_MODIFIED_LABEL')}</b>&nbsp; {helper.convertTimestampToDate(tabIndex === 0 ? (state?.publishedProfile?.updatedAt * 1000) : state?.unPublishedProfile?.updatedAt * 1000)}</p>}


                    {/* <FormControl className="form-select-box">
                        <span>{`${t('CHANNEL_MODAL')} *`}</span>
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
                            label="channel"
                            value={state.selectedChannelId}
                            disabled={state.toggleLoader}
                            onChange={(e) => {
                                dispatch({
                                    type: 'SET_CHANNEL',
                                    payload: e.target.value
                                })
                                updateAppAndProfile(e);
                            }}
                            name="channel"
                        >
                            {
                                state.channelList.map((channel) => (
                                    <MenuItem key={channel.id} value={channel.id}>{channel.name}</MenuItem>
                                ))}
                        </Select>
                    </FormControl> */}
                    {(tabIndex === 1 && !state.toggleLoader &&
                        ((Object.keys(state.unPublishedProfile).length !== 0 &&
                            (state.unPublishedProfile?.status === 'DRAFT' || state.unPublishedProfile?.status === 'REJECTED' || !state.unPublishedProfile.hasOwnProperty('status')))
                        )) && <FormControl className="form-select-box">
                            <span>{`${t('PRELOAD_ANALYTICS_PROFILE_MODIFY_SLOT')} *`}</span>
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
                                label="slots"
                                value={state.selectedNoOfSlots}
                                disabled={state.toggleLoader}
                                onChange={(e: any) => {
                                    const activeChannelIdIndex = state.channelList.findIndex(channel => channel.id === state.selectedChannelId);
                                    const payload = {
                                        status: state.channelList[activeChannelIdIndex].status,
                                        name: state.channelList[activeChannelIdIndex].name,
                                        channelId: state.channelList[activeChannelIdIndex].channelId,
                                        description: state.channelList[activeChannelIdIndex].description,
                                        numberOfSlots: e.target.value
                                    }
                                    dispatch({
                                        type: 'TOGGLE_LOADER',
                                        payload: true
                                    })
                                    apiDashboard.put(`preload/channel/${state.selectedChannelId}`, payload)
                                        .then(response => {
                                            const unPublishedProfileCopy = JSON.parse(JSON.stringify(state.unPublishedProfile));
                                            const modifiedChannelList = JSON.parse(JSON.stringify(state.channelList));
                                            modifiedChannelList[activeChannelIdIndex] = response.data.data;
                                            dispatch({
                                                type: 'TOGGLE_LOADER',
                                                payload: false
                                            })
                                            dispatch({
                                                type: 'SET_CHANNEL',
                                                payload: state.selectedChannelId
                                            })
                                            dispatch({
                                                type: 'GET_CHANNEL_LIST',
                                                payload: modifiedChannelList
                                            })
                                            dispatch({
                                                type: 'GET_PROFILE',
                                                payload: {
                                                    publishedProfile: state.publishedProfile,
                                                    unPublishedProfile: renderModifiySlots(unPublishedProfileCopy, e.target.value, state.unPublishedProfile.items[0].length),
                                                    isSlotModified: e.target.value !== state.unPublishedProfile.items[0].length ? true : false,
                                                    isCellModified: state.isCellModified,
                                                    enabledSlotsBeforeModification: state.enabledSlotsBeforeModification,
                                                    deviceListBeforeModification: state.deviceListBeforeModification,
                                                    profileErrorStatus404: state.profileErrorStatus404,
                                                    scrollPosition: state.scrollPosition,
                                                    selectedNoOfSlots: e.target.value,
                                                    profileApiResponseSlots: unPublishedProfileCopy.items[0]?.slots
                                                }
                                            })
                                        }, error => {
                                            dispatch({
                                                type: 'TOGGLE_LOADER',
                                                payload: false
                                            })
                                            dispatch({
                                                type: 'SET_CHANNEL',
                                                payload: state.selectedChannelId
                                            })
                                            dispatch({
                                                type: 'GET_CHANNEL_LIST',
                                                payload: state.channelList
                                            })
                                            dispatch({
                                                type: 'GET_PROFILE',
                                                payload: {
                                                    publishedProfile: state.publishedProfile,
                                                    unPublishedProfile: renderModifiySlots(state.unPublishedProfile, state.selectedNoOfSlots, state.unPublishedProfile.items[0].length),
                                                    isSlotModified: state.isSlotModified,
                                                    isCellModified: state.isCellModified,
                                                    enabledSlotsBeforeModification: state.enabledSlotsBeforeModification,
                                                    deviceListBeforeModification: state.deviceListBeforeModification,
                                                    profileErrorStatus404: state.profileErrorStatus404,
                                                    scrollPosition: state.scrollPosition,
                                                    selectedNoOfSlots: state.selectedNoOfSlots,
                                                    profileApiResponseSlots: state.profileApiResponseSlots
                                                }
                                            })
                                        });
                                }}
                                name="slots"
                            >
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                                <MenuItem value="5">5</MenuItem>
                                <MenuItem value="6">6</MenuItem>
                                <MenuItem value="7">7</MenuItem>
                                <MenuItem value="8">8</MenuItem>
                                <MenuItem value="9">9</MenuItem>
                                <MenuItem value="10">10</MenuItem>
                                <MenuItem value="11">11</MenuItem>
                                <MenuItem value="12">12</MenuItem>
                                <MenuItem value="13">13</MenuItem>
                                <MenuItem value="14">14</MenuItem>
                                <MenuItem value="15">15</MenuItem>
                                <MenuItem value="16">16</MenuItem>
                                <MenuItem value="17">17</MenuItem>
                                <MenuItem value="18">18</MenuItem>
                                <MenuItem value="19">19</MenuItem>
                                <MenuItem value="20">20</MenuItem>
                            </Select>
                        </FormControl>}
                </div>
                <div className="table-search-wrap">
                    <TabPanel value={tabIndex} index={0}>
                        <PreloadProfileTable tab={tabIndex} page={publishedPage} updatePreloadProfileDetails={update} actionListStatus={actionListStatusPublished}
                            actionListIndex={actionListIndexPublished} toggleActionList={onActionListToggle} />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                        <PreloadProfileTable tab={tabIndex} page={unPublishedPage} updatePreloadProfileDetails={update} actionListStatus={actionListStatusUnpublished}
                            actionListIndex={actionListIndexUnpublished} toggleActionList={onActionListToggle} />
                    </TabPanel>
                </div>
            </div>

            {showCreatePayloadPopup && <CreatePayloadPopup handleOpen={handleOpenModal} />}
            {openDevicePopup && <VirtualPreloadPopup activeRow={{}} operationType='Create New' handleOpen={handleOpenModal} modalType='Device' channelList={[]} />}
            {openProfileActionPopup && <ProfileActionPopup actionName={actionName} handleOpen={handleOpenModal} />}
            {snackbar && (
                <SnackBarMessage open={snackbar} onClose={() => {
                    setSnackbar(false);
                }} severityType={snackbarMessageSuccess ? 'success' : 'error'} message={snackbarMessageValue} />)}
        </S.Container >
    );
}

export default PreloadProfilePage;



