import React, { useState, useEffect, useContext, useRef } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    Paper,
    Checkbox,
    FormControl,
    Select,
    MenuItem,
    Tooltip
} from "@material-ui/core";
import { Pagination } from '@material-ui/lab';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import NotificationsIcon from '@material-ui/icons/Notifications';
import * as S from "./PreloadProfileTable.styles";
import { useTranslation } from 'react-i18next';
import { GlobalContext } from '../../../context/globalState';
import { SnackBarMessage } from "@dr-one/shared-component";
import TestPreloadProfilePopup from "../../../components/TestPreloadProfilePopup/TestPreloadProfilePopup";
import { Mixpanel } from "@dr-one/utils";

const applyPagination = (virtualPreloadList, page, limit) => {
    if (virtualPreloadList) {
        return virtualPreloadList.slice((page - 1) * limit, (page - 1) * limit + limit);
    } else {
        return [];
    }
};

function PreloadProfileTable(props) {
    const { state, dispatch } = useContext(GlobalContext)
    const { t } = useTranslation();
    const [tab, setTab] = useState(props.tab);
    const [profile, setProfile] = useState(props.tab === 0 ? state.publishedProfile : state.unPublishedProfile);
    const [page, setPage] = React.useState(props.page);
    const [isShowActionList, actionListToggle] = React.useState(props.actionListStatus);
    const [actionListIndex, setActionListIndex] = React.useState(props.actionListIndex);
    const paginatedPreloadProfileData = applyPagination(props.tab === 0 ? state.publishedProfile?.items : state.unPublishedProfile?.items, page, 5);
    const [isOpenTestPreloadPopup, toggleTestPreloadPopup] = useState(false);
    const [activeRow, setActiveRow] = React.useState(Object);
    const [snackbarMessageSuccess, setSnackbarMessageSuccess] = useState(false);
    const [snackbar, setSnackbar] = useState(false);
    const [snackbarMessageValue, setSnackbarMessageValue] = useState('');
    const ref = useRef<any>();
    const tableBottomHeight = document.getElementById('table-bottom')?.offsetTop;

    useEffect(() => {
        document.getElementById('table-scroll')?.scrollTo(state.scrollPosition, 0);
        const checkIfClickedOutside = e => {
            if (isShowActionList && ref.current && !ref.current.contains(e.target)) {
                actionListToggle(false);
                props.toggleActionList(false, tab, null);
            }
        }
        document.addEventListener("mousedown", checkIfClickedOutside);
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);
        }
    }, [])

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
        props.updatePreloadProfileDetails(tab, Number(newPage - 1));
    };

    const toolTipContent = (row: any) => {
        return (
            <div>
                <p>{t('PRELOAD_MANAGE_POPUP_APP_NAME_LABEL')}: {row.appName}</p>
                <p></p>
            </div>
        )
    }

    const onTriggerAction = (activeRowDetails: any): void => {
        Mixpanel.track(
            "Device Test Push Initiated",
            { profileId: profile.id, channelId: state.selectedChannelId, deviceId: activeRowDetails.deviceId, deviceName: activeRowDetails.deviceName }
        );
        actionListToggle(false);
        setActiveRow(activeRowDetails);
        toggleTestPreloadPopup(true);
    }

    const isAppSelected = (appVersionCode: string, appVersionName: string, id: string, packageName: string, index: number) => {
        let selectedFlag = false;
        for (const slotId in state.unPublishedProfile.items[(((page - 1) * 5) + index)]?.slots) {
            if (state.unPublishedProfile.items[(((page - 1) * 5) + index)]?.slots[slotId]['packageName'] === packageName
                && state.unPublishedProfile.items[(((page - 1) * 5) + index)]?.slots[slotId]['preloadSupportedAppId'] === id
                && state.unPublishedProfile.items[(((page - 1) * 5) + index)]?.slots[slotId]['appVersionCode'] === appVersionCode
                && state.unPublishedProfile.items[(((page - 1) * 5) + index)]?.slots[slotId]['appVersionName'] === appVersionName
            ) {
                selectedFlag = true;
                break;
            }
        }
        return selectedFlag;
    }

    const handleOpenModal = (value: boolean, action: string, message: string): void => {
        toggleTestPreloadPopup(value);
        if (action !== 'submit') {
            props.toggleActionList(false, tab, null);
        }
        if (value === false && action === 'submit') {
            setSnackbar(true);
            setSnackbarMessageSuccess(true);
            setSnackbarMessageValue(message);
            props.toggleActionList(false, tab, null);
        }
    }
    
    return (
        <S.Container className="inner-container position-relative">
            {/* {state.toggleLoader && <div className="spinner-wrap"><Spinner color={"blue"} /></div>} */}
            {(Object.keys(profile)?.length !== 0 && profile?.items?.length !== 0) && <TableContainer className="overflow-table" component={Paper}>
                <div className="preload-table-wrapper">
                    <div className="table-section" id="table-scroll">
                        <Table aria-label="simple table" className="preload-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">{t('ACTIONS')}</TableCell>
                                    <TableCell className="width-180">{t('DEVICE')}</TableCell>
                                    {paginatedPreloadProfileData?.[0]?.slots.map((row, index) => (
                                        <TableCell align="right" key={index}>
                                            <span>{t('PRELOAD_PROFILE_TABLE_TABLE_COLUMN_HEADER')} - {index + 1}</span>
                                            {(props.tab === 1 && (['DRAFT', 'REJECTED'].indexOf(profile?.status) !== -1) || !profile.hasOwnProperty('status')) && <span><Checkbox
                                                checked={profile?.enabledSlots?.includes(index)}
                                                color="primary"
                                                onChange={(e) => {
                                                    const modifiedPayload = Object.assign({}, profile);
                                                    const slots = profile.enabledSlots;
                                                    const slotsBeforeModification = state.enabledSlotsBeforeModification.slice();
                                                    if (e.target.checked) {
                                                        slots.push(index);
                                                    } else {
                                                        const position = slots.indexOf(index);
                                                        if (position > -1) {
                                                            slots.splice(position, 1);
                                                        }
                                                    }
                                                    modifiedPayload['enabledSlots'] = slots;
                                                    const tableScrollPosition = document.getElementById('table-scroll')?.scrollLeft;
                                                    dispatch({
                                                        type: 'GET_PROFILE',
                                                        payload: {
                                                            publishedProfile: state.publishedProfile,
                                                            unPublishedProfile: tab === 1 ? modifiedPayload : state.unPublishedProfile,
                                                            isSlotModified: true,
                                                            isCellModified: state.isCellModified,
                                                            enabledSlotsBeforeModification: slotsBeforeModification,
                                                            deviceListBeforeModification: state.deviceListBeforeModification,
                                                            profileErrorStatus404: state.profileErrorStatus404,
                                                            scrollPosition: tableScrollPosition,
                                                            selectedNoOfSlots: profile.items && profile.items.length !== 0 ? profile.items[0].slots?.length : 6,
                                                            profileApiResponseSlots: state.profileApiResponseSlots
                                                        }
                                                    })
                                                }} /></span>}
                                        </TableCell>))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedPreloadProfileData?.map((row, profileIndex) => (
                                    <TableRow key={row.deviceId}>
                                        <TableCell align="left" >
                                            <div className="more-action"><MoreVertIcon onClick={(e) => {
                                                actionListToggle(isShowActionList => !isShowActionList);
                                                props.toggleActionList(!isShowActionList, tab, profileIndex);
                                                setActionListIndex(profileIndex);
                                            }} />
                                                {(isShowActionList && actionListIndex === profileIndex) && <div className={(tableBottomHeight - document.getElementById(`${row.id}`)?.offsetTop > 280) ? 'more-action-dropdown' : "more-action-dropdown position-left"}>
                                                    <ul ref={ref}>
                                                        {<li onClick={(e) => onTriggerAction(row)}>{t('PRELOAD_PROFILE_ACTION_TEST_PRELOAD')}<NotificationsIcon /></li>}

                                                    </ul>

                                                </div>}
                                            </div>
                                        </TableCell>
                                        <TableCell align="left"> {row?.deviceName}</TableCell>
                                        {row.slots.map((row, index) => (
                                            <TableCell align="right" key={index}>
                                                <FormControl className="form-select-box">
                                                    <Tooltip title={toolTipContent(row)} arrow placement="top" disableHoverListener={!profile?.enabledSlots?.includes(index) || row.preloadSupportedAppId === null}>
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
                                                                className: "app-dropdown",
                                                                getContentAnchorEl: null
                                                            }}
                                                            label="app"
                                                            value={row?.preloadSupportedAppId}
                                                            // disabled={row?.preloadSupportedAppId === null}
                                                            disabled={props.tab === 0 || !profile?.enabledSlots?.includes(index) || (props.tab === 1 && (state.unPublishedProfile.status === 'LOCKED' || state.unPublishedProfile.status === 'PENDING' || state.unPublishedProfile.status === 'PUBLISHED' || state.unPublishedProfile.status === 'ARCHIVED'))}
                                                            onChange={(e) => {
                                                                const modifiedPayload = JSON.parse(JSON.stringify(profile));
                                                                const deviceListForReset = JSON.parse(JSON.stringify(state.deviceListBeforeModification));
                                                                // const slotsListForReset = JSON.parse(JSON.stringify(state.deviceListBeforeModification[index]['slots']));
                                                                // deviceListForReset[index].slots = [...slotsListForReset];
                                                                const appIndex = state.appList.findIndex(app => app.id === e.target.value);
                                                                if (appIndex > -1) {
                                                                    modifiedPayload.items[(((page - 1) * 5) + profileIndex)].slots[index]['preloadSupportedAppId'] = e.target.value === 1 ? null : e.target.value;
                                                                    modifiedPayload.items[(((page - 1) * 5) + profileIndex)].slots[index]['preloadChannelSlotIndex'] = index;
                                                                    modifiedPayload.items[(((page - 1) * 5) + profileIndex)].slots[index]['appName'] = e.target.value === 1 ? null : state.appList[appIndex].appName;
                                                                    modifiedPayload.items[(((page - 1) * 5) + profileIndex)].slots[index]['appIcon'] = e.target.value === 1 ? null : state.appList[appIndex].appIcon;
                                                                    modifiedPayload.items[(((page - 1) * 5) + profileIndex)].slots[index]['appVersionCode'] = e.target.value === 1 ? null : state.appList[appIndex].appVersionCode;
                                                                    modifiedPayload.items[(((page - 1) * 5) + profileIndex)].slots[index]['appVersionName'] = e.target.value === 1 ? null : state.appList[appIndex].appVersionName;
                                                                    modifiedPayload.items[(((page - 1) * 5) + profileIndex)].slots[index]['packageName'] = e.target.value === 1 ? null : state.appList[appIndex].packageName;
                                                                }
                                                                const tableScrollPosition = document.getElementById('table-scroll')?.scrollLeft;
                                                                dispatch({
                                                                    type: 'GET_PROFILE',
                                                                    payload: {
                                                                        publishedProfile: props.tab === 0 ? modifiedPayload : state.publishedProfile,
                                                                        unPublishedProfile: props.tab === 1 ? modifiedPayload : state.unPublishedProfile,
                                                                        isSlotModified: state.isSlotModified,
                                                                        isCellModified: true,
                                                                        enabledSlotsBeforeModification: state.enabledSlotsBeforeModification,
                                                                        deviceListBeforeModification: deviceListForReset,
                                                                        profileErrorStatus404: state.profileErrorStatus404,
                                                                        scrollPosition: tableScrollPosition,
                                                                        selectedNoOfSlots: profile.items && profile.items.length !== 0 ? profile.items[0].slots?.length : 6,
                                                                        profileApiResponseSlots: state.profileApiResponseSlots
                                                                    }
                                                                })
                                                            }}
                                                            name="app"
                                                        >
                                                            {
                                                                state.appList.map((app) => (
                                                                    <MenuItem className="slots-dropdown" key={app.id} value={app.id} disabled={isAppSelected(app.appVersionCode, app.appVersionName, app.id, app.packageName, profileIndex)}>
                                                                        {app.id !== 1 && <img src={app?.appIcon} className="app-img-thumb" alt="app_image" />}
                                                                        <div className="app-details-div">
                                                                            <span className="camp-name">{app?.appName}</span>
                                                                            <span className="app-version">{app?.appVersionName}</span>
                                                                        </div>
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    </Tooltip>
                                                </FormControl>
                                            </TableCell>))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </TableContainer>}
            {(Object.keys(profile)?.length !== 0 && profile?.items?.length !== 0) && <Pagination count={Math.ceil(tab === 0 ? (state.publishedProfile?.items?.length / 5) : state.unPublishedProfile?.items?.length / 5)} onChange={handleChangePage} page={page} />}
            <Divider id="table-bottom" />
            {(!state.toggleLoader && (Object.keys(profile)?.length === 0 || (Object.keys(profile)?.length !== 0 && profile?.items?.length === 0))) && <div className="alert error lg">
                <div className="alert-message">{t('PRELOAD_PROFILE_ERROR')}</div>
            </div>}
            {isOpenTestPreloadPopup && <TestPreloadProfilePopup handleOpen={handleOpenModal} actionName={'testAd'} activeRow={activeRow} profile={profile} />}
            {snackbar && (
                <SnackBarMessage open={snackbar} onClose={() => {
                    setSnackbar(false);
                    props.toggleActionList(false, tab, null);
                }} severityType={snackbarMessageSuccess ? 'success' : 'error'} message={snackbarMessageValue} />)}
        </S.Container>
    );
}

export default PreloadProfileTable;