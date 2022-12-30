import React, { useState, useEffect, useContext } from "react";
import * as S from "./StopBoostDenyTestAdPopup.styles";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { Spinner } from "@dr-one/shared-component";
import {
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox
} from "@material-ui/core";
import {
    Button,
    Modal,
    makeStyles
} from "@material-ui/core";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { useTranslation } from 'react-i18next';
import { GlobalContext } from '../../../context/globalState';

function StopBoostDenyTestAdPopup(props) {
    const useStyles = makeStyles((theme) => ({
        paper: {

        },
        modal: {
            display: 'flex',
            padding: theme.spacing(1),
            alignItems: 'center',
            justifyContent: 'center',
        }
    }));
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [showLoader, toggleLoader] = useState(false);
    const [adDeliverySummary, setAdDeliverySummary] = useState(Object);
    const [showSubmitLoader, toggleSubmitLoader] = useState(false);
    const [scheduleJobsData, setScheduleJobsData] = useState([]);
    const [campaignDenyReason, setCampaignDenyReason] = React.useState('');
    const [boostCampaignData, setBoostCampaignData] = React.useState(Object);
    const [noOfDeviceTarget, setNoOfDeviceTarget] = React.useState(null);
    const [retarget, setRetargetValue] = React.useState(false);
    const [ignoreAudienceCluster, setIgnoreAudienceClusterValue] = React.useState(false);
    const [noOfDeviceTargetError, setNoOfDeviceTargetError] = React.useState(noOfDeviceTarget === null ? 'Device target is requied field' : '');
    const [googleAdIds, setGoogleAdIds] = useState({ googleAdId1: '', googleAdId2: '', googleAdId3: '' });
    const [googleAdIdsError, setGoogleAdIdsError] = useState({ googleAdId1Error: '', googleAdId2Error: '', googleAdId3Error: '' });
    const [showError, toggleError] = useState('');
    const { t } = useTranslation();
    const { dispatch, state } = useContext(GlobalContext);
    const orgData = JSON.parse(localStorage.getItem('dr-user')).organizations;
    const user = JSON.parse(localStorage.getItem("dr-user"));
    const activeOrgIndex = orgData.findIndex(org => org.id === user.organizationActive);

    const googleIdRegex = /^[\w-]+$/;
    const rand = () => {
        return Math.round(Math.random() * 20) - 10;
    }

    const getModalStyle = () => {
        const top = 50 + rand();
        const left = 50 + rand();

        return {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
        };
    }
    const [modalStyle] = React.useState(getModalStyle);
    const updatePageAfteChangeStatus = (payload: boolean) => {
        dispatch({
            type: "TAB_RELOAD",
            payload: payload
        })
    }

    useEffect(() => {
        toggleLoader(props.actionName === 'testAd' ? false : true);
        if (props.actionName === 'stop') {
            apiDashboard.get(`campaign-mgmt-api/campaigns/${props.activeRow.id}/addeliverysummary`).then(res => {
                setAdDeliverySummary(res.data.data);
                toggleLoader(false);
                toggleError('');
            }, error => {
                setAdDeliverySummary(Object);
                toggleLoader(false);
                toggleError(helper.getErrorMessage(error));
            });
        } else if (props.actionName === 'job') {
            apiDashboard.get(`campaign-mgmt-api/scheduledjobs/${props.activeRow.id}`).then(res => {
                setScheduleJobsData(res.data.data);
                toggleLoader(false);
                toggleError('');
            }, error => {
                setScheduleJobsData([]);
                toggleLoader(false);
                toggleError(helper.getErrorMessage(error));
            });
        } else if (props.actionName === 'boost') {
            apiDashboard.get(`campaign-mgmt-api/campaigns/${props.activeRow.id}/boost/eligibility`).then(res => {
                setBoostCampaignData(res.data.data);
                boostCampaignData['initEligibility'] = boostCampaignData['eligibility'];
                updateBoostEligibility();
                toggleLoader(false);
                toggleError('');
            }, error => {
                setBoostCampaignData(Object);
                toggleLoader(false);
                toggleError(helper.getErrorMessage(error));
            });
        }

    }, [])

    const handleClose = (action: string, message: string): void => {
        setOpen(false);
        props.handleOpen(false, action, message);
    };

    const stopBoostDenyTestAdCampaign = (): void => {
        const modifiedPayload = Object.assign({}, state);
        modifiedPayload['reloadTab'] = true
        toggleSubmitLoader(true);
        if (props.actionName === 'stop') {
            const payload = {
                reason: 'stop campaign',
                status: 'STOPPED'
            };
            apiDashboard.put(`campaign-mgmt-api/campaigns/${props.activeRow.id}/status`, payload).then(res => {
                toggleSubmitLoader(false);
                handleClose('submit', res.data.message);
                modifiedPayload['status'] = payload.status
                updatePageAfteChangeStatus(modifiedPayload)
            }, error => {
                toggleSubmitLoader(false);
                toggleError(helper.getErrorMessage(error));
            });
        } else if (props.actionName === 'deny') {
            const payload = { status: 'REJECTED', reason: campaignDenyReason };
            apiDashboard.put(`campaign-mgmt-api/campaigns/${props.activeRow.id}/status`, payload).then(res => {
                toggleSubmitLoader(false);
                handleClose('submit', res.data.message);
                modifiedPayload['status'] = payload.status
                updatePageAfteChangeStatus(modifiedPayload)
            }, error => {
                toggleSubmitLoader(false);
                toggleError(helper.getErrorMessage(error));
            });
        } else if (props.actionName === 'boost') {
            const payload = {
                boostDeviceCount: noOfDeviceTarget,
                ignoreAudienceCluster: ignoreAudienceCluster,
                retarget: retarget
            }
            apiDashboard.post(`campaign-mgmt-api/campaigns/${props.activeRow.id}/boost`, payload).then(res => {
                toggleSubmitLoader(false);
                handleClose('submit', res.data.message);
            }, error => {
                toggleSubmitLoader(false);
                toggleError(helper.getErrorMessage(error));
            });
        } else if (props.actionName === 'testAd') {
            const targetPhones = [];
            if (googleAdIds.googleAdId1) {
                targetPhones.push(googleAdIds.googleAdId1)
            }
            if (googleAdIds.googleAdId2) {
                targetPhones.push(googleAdIds.googleAdId2)
            }
            if (googleAdIds.googleAdId3) {
                targetPhones.push(googleAdIds.googleAdId3)
            }
            if (targetPhones.length > 0) {
                const payload = {
                    campaignId: props.activeRow.id,
                    devices: targetPhones
                };
                apiDashboard.post(`campaign-mgmt-api/campaignads`, payload).then(res => {
                    toggleSubmitLoader(false);
                    handleClose('submit', res.data.message);
                    Mixpanel.track(
                        "Campaign Test Push",
                        { "campaignId": props.activeRow.id, "campaignName": props.activeRow.name, "devices": targetPhones }
                    );
                }, error => {
                    toggleSubmitLoader(false);
                    toggleError(helper.getErrorMessage(error));
                });
            }
        }
    }

    const deleteJob = (row: any): void => {
        apiDashboard.delete(`campaign-mgmt-api/scheduledjobs/'${props.activeRow.id}?jobid=${row.jobId}`).then(res => {
            toggleSubmitLoader(false);
            handleClose('submit', res.data.message);
        }, error => {
            toggleSubmitLoader(false);
            toggleError(helper.getErrorMessage(error));
        });
    }

    const handleChangeIgnoreAudienceCluster = (e: any): void => {
        setIgnoreAudienceClusterValue(e.target.checked);
        updateBoostEligibility();
    }

    const handleChangeRetarget = (e: any): void => {
        setRetargetValue(e.target.checked);
        updateBoostEligibility();
    }

    const handleChangeNoOfDeviceTarget = (value: string): void => {
        if (value.length === 0) {
            setNoOfDeviceTargetError(t('DEVICE_TARGET_REQUIRED_ERROR'));
        } else {
            if (Number(value) < 1) {
                setNoOfDeviceTargetError(t('DEVICE_TARGET_MINIMUM_ERROR'));
            } else {
                if (Number(value) > boostCampaignData.eligibility) {
                    setNoOfDeviceTargetError(t('DEVICE_TARGET_MAXIMUM_ERROR'));
                } else {
                    setNoOfDeviceTargetError('');
                }
            }
        }
    }

    const updateBoostEligibility = (): void => {
        if (retarget && !ignoreAudienceCluster) {
            boostCampaignData.eligibility = boostCampaignData.totalAudienceSize;
        } else if (ignoreAudienceCluster) {
            boostCampaignData.eligibility = boostCampaignData.optInCount;
        } else if (retarget && ignoreAudienceCluster) {
            boostCampaignData.eligibility = boostCampaignData.initEligibility;
        }
    }

    const handleChangeGoogleAdIdsError = (value: string, indexValue: number): void => {
        if (indexValue === 1) {
            if (!googleIdRegex.test(value)) {
                setGoogleAdIdsError({ googleAdId1Error: value.length !== 0 ? t('GOOGLE_AD_ID_INVALID_ERROR') : '', googleAdId2Error: googleAdIdsError.googleAdId2Error, googleAdId3Error: googleAdIdsError.googleAdId3Error });
            } else {
                setGoogleAdIdsError({ googleAdId1Error: '', googleAdId2Error: googleAdIdsError.googleAdId2Error, googleAdId3Error: googleAdIdsError.googleAdId3Error });
            }

        } else if (indexValue === 2) {
            if (!googleIdRegex.test(value)) {
                setGoogleAdIdsError({ googleAdId1Error: googleAdIdsError.googleAdId1Error, googleAdId2Error: value.length !== 0 ? t('GOOGLE_AD_ID_INVALID_ERROR') : '', googleAdId3Error: googleAdIdsError.googleAdId3Error });
            } else {
                setGoogleAdIdsError({ googleAdId1Error: googleAdIdsError.googleAdId1Error, googleAdId2Error: '', googleAdId3Error: googleAdIdsError.googleAdId3Error });
            }
        } else if (indexValue === 3) {
            if (!googleIdRegex.test(value)) {
                setGoogleAdIdsError({ googleAdId1Error: googleAdIdsError.googleAdId1Error, googleAdId2Error: googleAdIdsError.googleAdId2Error, googleAdId3Error: value.length !== 0 ? t('GOOGLE_AD_ID_INVALID_ERROR') : '' });
            } else {
                setGoogleAdIdsError({ googleAdId1Error: googleAdIdsError.googleAdId1Error, googleAdId2Error: googleAdIdsError.googleAdId2Error, googleAdId3Error: '' });
            }
        }
    }
    let isDisableButton;
    if (props.actionName === 'testAd') {
        const validityArrayIds = Object.values(googleAdIds).every(ele => ele.length === 0);
        if (validityArrayIds) {
            isDisableButton = true;
        } else {
            isDisableButton = Object.values(googleAdIdsError).some(ele => ele.length !== 0);
        }
    }
    const body = (
        <div className="model-container large">
            {showLoader && <div className="spinner-wrap"><Spinner color={"blue"} /></div>}
            <div className="modal-header">
                {props.actionName === 'stop' && <h4 id="simple-modal-title">{props.popupType} {t('ACTION_STOP')} {t('CAMPAIGN_LABEL')}</h4>}
                {props.actionName === 'job' && <h4 >{t('ACTION_SCHEDULED_JOB_HEADER')} {props.activeRow.name}</h4>}
                {props.actionName === 'deny' && <h4 >{t('ACTION_DENY')} {t('CAMPAIGN_LABEL')}</h4>}
                {props.actionName === 'testAd' && <h4 >{t('ACTION_TEST_AD_HEADER')}</h4>}
                {props.actionName === 'boost' && <h4 >{t('ACTION_BOOST')} {t('CAMPAIGN_LABEL')}</h4>}
                <CloseOutlinedIcon className="modal-close" aria-label="close" onClick={(e) => handleClose('cancel', '')} />
            </div>

            <div className="modal-body">
                {props.actionName === 'stop' && <div className="stop-campaign">
                    <h5>{t('ACTION_STOP_SUBHEADER')}:-</h5>
                    <ul className="list">
                        <li><span>{t('TOTAL_DEVICES_TARGETED')} </span>: {adDeliverySummary.totalDevicesTargeted}</li>
                        <li><span>{t('TOTAL_ADS_GENERATED')} </span>: {adDeliverySummary.adsGenerated}</li>
                        <li><span>{t('TOTAL_ADS_PULLED')} </span>: {adDeliverySummary.adsPulled}</li>
                        <li><span>{t('TOTAL_ADS_PENDING')}</span>: {adDeliverySummary.adsPending}</li>
                    </ul>
                    <h6>{t('ACTION_QUESTION')} {t('ACTION_STOP').toLocaleLowerCase()} {t('CAMPAIGN_LABEL')}?</h6>
                    <p className="error-wrap error">{showError}</p>
                </div>}
                {props.actionName === 'job' && <div className="jobs-table-scroll">
                    {(scheduleJobsData.length === 0 && !showLoader) && <p>{t('ACTION_JOB_ERROR')}</p>}
                    {scheduleJobsData.length !== 0 && <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="sort-row">
                                        {t('STATUS')}
                                    </TableCell>
                                    <TableCell align="right" className="sort-row">
                                        {t('EXPECTED_START_TIME')}
                                    </TableCell>
                                    <TableCell align="right" className="sort-row">
                                        {t('ACTUAL_START_TIME')}
                                    </TableCell>
                                    {props.canDeleteJob && <TableCell align="right" className="sort-row">
                                        {t('ACTION')}
                                    </TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {scheduleJobsData.map(job => (
                                    <TableRow key={job.id}>
                                        <TableCell>{job.jobStatus}</TableCell>
                                        <TableCell align="right">{helper.convertTimestampInTimezone(job.expectedStartTime, user.organizations[activeOrgIndex].timeZone)}</TableCell>
                                        <TableCell align="right">{job.actualStartTime === null || job.actualStartTime === 0 ? t('UNKNOWN') : helper.convertTimestampInTimezone(job.actualStartTime, user.organizations[activeOrgIndex].timeZone)}</TableCell>
                                        {props.canDeleteJob && <TableCell align="right"><Button className="button-align" disabled={(props.activeRow.status === 'COMPLETED' || job.jobStatus !== 'SCHEDULED')}
                                            onClick={(e) => deleteJob(job)}>{t('DELETE')}</Button></TableCell>}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>}
                    <p className="error-wrap error">{showError}</p>
                </div>}
                {props.actionName === 'deny' && <div>
                    <TextField
                        variant="outlined"
                        aria-describedby="Campaign Deny Reason"
                        placeholder={t('ACTION_DENY_PLACEOLDER')}
                        label={`${t('ACCTION_DENY_LABEL')}*`}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => {
                            setCampaignDenyReason(e.currentTarget.value);
                        }}
                        value={campaignDenyReason}
                        type="text"
                    />
                    <p className="error-wrap error">{showError}</p>
                </div>}


                <S.Container>
                    {props.actionName === 'boost' &&
                        <div className="boost-summary-wrapper">
                            <h6>{t('ACTION_STOP_SUBHEADER')}:-</h6>
                            {!showLoader && <div>
                                <div className="boost-summary">
                                    <div className="boost-row">
                                        <div className="boost-col">
                                            <p>{t('CLIENTS_TARGETED')}</p><p>{boostCampaignData?.totalClientsTargeted?.toLocaleString('en-US')}</p>
                                        </div>
                                        <div className="boost-col">
                                            <p>{t('DOWNLOADS')}</p><p>{boostCampaignData?.downloads?.toLocaleString('en-US')}</p>
                                        </div>
                                        <div className="boost-col">
                                            <p>{t('AD_READY')}</p><p>{boostCampaignData?.totalResponseCount?.toLocaleString('en-US')}</p>
                                        </div>
                                        <div className="boost-col">
                                            <p>{t('PERFORMANCE_TYPE_IMPRESSIONS')}</p><p>{boostCampaignData?.impressions?.toLocaleString('en-US')}</p>
                                        </div>
                                    </div>
                                    <div className="boost-row">

                                        <div className="boost-col">
                                            <p>{t('IMPRESSIONS_RATE')}</p><p>{boostCampaignData?.impressionRate?.toLocaleString('en-US', { maximumFractionDigits: 1 })}%</p>
                                        </div>
                                        <div className="boost-col">
                                            <p>{t('PERFORMANCE_TYPE_CLICKS')}</p><p>{boostCampaignData?.clicks?.toLocaleString('en-US')}</p>
                                        </div>
                                        <div className="boost-col">
                                            <p>{t('CTR')}</p><p>{boostCampaignData?.ctr?.toLocaleString('en-US', { maximumFractionDigits: 1 })}%</p>
                                        </div>
                                        <div className="boost-col">
                                            <p>{boostCampaignData?.performanceType}</p><p>{(boostCampaignData?.price) ? '$' + boostCampaignData?.price?.toLocaleString('en-US', { maximumFractionDigits: 2 }) : 'Non-Priced'}</p>
                                        </div>
                                    </div>
                                    <div className="boost-row">

                                        <div className="boost-col">
                                            <p>{t('ECPM')}</p><p>{boostCampaignData?.eCPM?.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                                        </div>
                                        <div className="boost-col">
                                            <p>{t('VIDEO_VIEWED')}</p> <p>{props.activeRow.videoContent ? boostCampaignData?.videoViewed?.toLocaleString('en-US') : ''}</p>

                                        </div>
                                        <div className="boost-col">
                                            <p>{t('VIEW_RATE')}</p><p>{boostCampaignData?.videoViewedRate?.toLocaleString('en-US', { maximumFractionDigits: 1 })}%</p>
                                        </div>
                                        <div className="boost-col">
                                            <p>{t('ELIGIBILITY')}</p><p>{boostCampaignData?.eligibility}</p>
                                        </div>
                                    </div>

                                    <div className="boost-option-wrap">
                                        <p>{t('BOOST_OPTION')}</p>
                                        <div className="boost-checkbox-wrap">
                                            <Checkbox color="primary" checked={retarget} inputProps={{ 'aria-label': 'controlled' }}
                                                onChange={handleChangeRetarget} /> <span>{t('RETARGET')}</span>
                                        </div>
                                        <div className="boost-checkbox-wrap">
                                            <Checkbox color="primary" checked={ignoreAudienceCluster} inputProps={{ 'aria-label': 'controlled' }} onChange={handleChangeIgnoreAudienceCluster} /> <span>{t('IGNORE_AUDIENCE_CLUSTER')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div >}

                            <TextField
                                variant="outlined"
                                aria-describedby="Device Target"
                                placeholder={t('DEVICE_TARGET_PLACEHOLDER')}
                                label={`${t('DEVICE_TARGET_LABEL')} *`}
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => {
                                    setNoOfDeviceTarget(e.currentTarget.value);
                                    handleChangeNoOfDeviceTarget(e.currentTarget.value);
                                }}
                                value={noOfDeviceTarget}
                                type="number"
                            />
                            <p className="error-wrap error">{noOfDeviceTargetError}</p>
                            <p className="error-wrap error">{showError}</p>
                        </div >}
                </S.Container>
                <S.Container>
                    {props.actionName === 'testAd' &&
                        <div className="google-id-wrapper">
                            <h6>{t('ACTION_TEST_AD_SUBHEADER')}:</h6>
                            <p>{t('ACTION_TEST_AD_INSTRUCTION')}</p>
                            <div className="ad-container">
                                <div className="google-ad-id">
                                    <TextField
                                        variant="outlined"
                                        aria-describedby="Google Ad Id 1"
                                        label={`${t('GOOGLE_AD_ID_LABEL')}1`}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => {
                                            setGoogleAdIds({ googleAdId1: e.currentTarget.value, googleAdId2: googleAdIds.googleAdId2, googleAdId3: googleAdIds.googleAdId3 });
                                            handleChangeGoogleAdIdsError(e.currentTarget.value, 1);
                                        }}
                                        value={googleAdIds.googleAdId1}
                                        onBlur={(e) => {
                                            setGoogleAdIds({ googleAdId1: e.currentTarget.value, googleAdId2: googleAdIds.googleAdId2, googleAdId3: googleAdIds.googleAdId3 });
                                            handleChangeGoogleAdIdsError(e.currentTarget.value, 1);
                                        }}
                                        type="text"
                                    />
                                    <p className="error-wrap error">{googleAdIdsError.googleAdId1Error === 'required' ? '' : googleAdIdsError.googleAdId1Error}</p>
                                </div>
                                <div className="google-ad-id">
                                    <TextField
                                        variant="outlined"
                                        aria-describedby="Google Ad Id 2"
                                        label={`${t('GOOGLE_AD_ID_LABEL')}2`}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => {
                                            setGoogleAdIds({ googleAdId1: googleAdIds.googleAdId1, googleAdId2: e.currentTarget.value, googleAdId3: googleAdIds.googleAdId3 });
                                            handleChangeGoogleAdIdsError(e.currentTarget.value, 2);
                                        }}
                                        onBlur={(e) => {
                                            setGoogleAdIds({ googleAdId1: googleAdIds.googleAdId1, googleAdId2: e.currentTarget.value, googleAdId3: googleAdIds.googleAdId3 });
                                            handleChangeGoogleAdIdsError(e.currentTarget.value, 2);
                                        }}
                                        value={googleAdIds.googleAdId2}
                                        type="text"
                                    />
                                    <p className="error-wrap error">{googleAdIdsError.googleAdId2Error === 'required' ? '' : googleAdIdsError.googleAdId2Error}</p>
                                </div>
                                <div className="google-ad-id">
                                    <TextField
                                        variant="outlined"
                                        aria-describedby="Google Ad Id 3"
                                        label={`${t('GOOGLE_AD_ID_LABEL')}3`}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => {
                                            setGoogleAdIds({ googleAdId1: googleAdIds.googleAdId1, googleAdId2: googleAdIds.googleAdId2, googleAdId3: e.currentTarget.value });
                                            handleChangeGoogleAdIdsError(e.currentTarget.value, 3);
                                        }}
                                        onBlur={(e) => {
                                            setGoogleAdIds({ googleAdId1: googleAdIds.googleAdId1, googleAdId2: googleAdIds.googleAdId2, googleAdId3: e.currentTarget.value });
                                            handleChangeGoogleAdIdsError(e.currentTarget.value, 3);
                                        }}
                                        value={googleAdIds.googleAdId3}
                                        type="text"
                                    />
                                    <p className="error-wrap error">{googleAdIdsError.googleAdId3Error === 'required' ? '' : googleAdIdsError.googleAdId3Error}</p>
                                </div>
                            </div>
                            <p className="error-wrap error">{showError}</p>
                        </div>}
                </S.Container>
            </div>

            {
                props.actionName !== 'job' && <div className="modal-footer align-right cc-global-buttons">
                    <Button variant="outlined" className="button-xs" type="button" onClick={(e) => handleClose('cancel', '')}>{props.actionName === 'stop' ? "Don't stop campaign" : 'Go Back'} </Button>
                    {!showSubmitLoader && <Button className="button-xs" variant="contained" color="primary" type="submit"
                        onClick={(e) => stopBoostDenyTestAdCampaign()} disabled={(props.actionName === 'deny' && campaignDenyReason.length === 0) || (props.actionName === 'boost' && noOfDeviceTargetError.length !== 0) || (props.actionName === 'testAd' && isDisableButton)}>
                        {props.actionName === 'testAd' ? t('ACTION_TEST_AD') : props.actionName === 'boost' ? t('BUTTON_BOOST_CAMPAIGN') : props.actionName === 'stop'
                            ? t('BUTTON_STOP_CAMPAIGN') : t('BUTTON_DENY_CAMPAIGN')}</Button>}
                    {showSubmitLoader && <Button className="button-xs" variant="contained" color="primary" type="submit" disabled>{props.actionName === 'testAd' ? t('ACTION_TEST_AD') : props.actionName === 'boost' ? t('BUTTON_BOOST_CAMPAIGN') : props.actionName === 'stop' ? t('BUTTON_STOP_CAMPAIGN') : t('BUTTON_DENY_CAMPAIGN')}<Spinner color={"blue"} /></Button>}
                </div>
            }
        </div >
    );

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                disableEscapeKeyDown
                className={classes.modal}
                disableBackdropClick
            >
                {body}
            </Modal>
        </div>
    );
}

export default StopBoostDenyTestAdPopup;