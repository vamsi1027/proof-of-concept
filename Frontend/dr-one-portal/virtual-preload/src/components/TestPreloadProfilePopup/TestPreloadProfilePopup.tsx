import React, { useState } from "react";
import * as S from "./TestPreloadProfile.styles";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { Spinner } from "@dr-one/shared-component";
import {
    TextField,
} from "@material-ui/core";
import {
    Button,
    Modal,
    makeStyles
} from "@material-ui/core";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import { useTranslation } from 'react-i18next';

function TestPreloadProfilePopup(props) {
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
    const [googleAdIds, setGoogleAdIds] = useState({ googleAdId1: '', googleAdId2: '', googleAdId3: '' });
    const [googleAdIdsError, setGoogleAdIdsError] = useState({ googleAdId1Error: '', googleAdId2Error: '', googleAdId3Error: '' });
    const [showError, toggleError] = useState('');
    const { t } = useTranslation();
    const orgData = JSON.parse(localStorage.getItem('dr-user')).organizations;
    const user = JSON.parse(localStorage.getItem("dr-user"));
    const [showSubmitLoader, toggleSubmitLoader] = useState(false);

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

    const handleClose = (action: string, message: string): void => {
        setOpen(false);
        props.handleOpen(false, action, message);
    };

    const testPrelaodProfile = (): void => {
        toggleSubmitLoader(true);
        if (props.actionName === 'testAd') {
            const targetedDeviceList = [];
            if (googleAdIds.googleAdId1) {
                targetedDeviceList.push(googleAdIds.googleAdId1)
            }
            if (googleAdIds.googleAdId2) {
                targetedDeviceList.push(googleAdIds.googleAdId2)
            }
            if (googleAdIds.googleAdId3) {
                targetedDeviceList.push(googleAdIds.googleAdId3)
            }
            if (targetedDeviceList.length > 0) {
                const testApplist = [];
                props?.activeRow?.slots?.forEach((slot, index) => {
                    if (slot.preloadSupportedAppId !== null && props?.profile?.enabledSlots?.includes(index)) {
                        testApplist.push(slot.preloadSupportedAppId);
                    }
                })
                const testPushData = {
                    appIds: testApplist,
                    devices: targetedDeviceList
                };

                apiDashboard.post(`preload/testpushads`, testPushData).then(res => {
                    Mixpanel.track(
                        "Device Test Push Completed",
                        { profileId: props.profile.id, channelId: props.profile.channelId, deviceId: props.activeRow.deviceId, deviceName: props.activeRow.deviceName }
                    );
                    toggleSubmitLoader(false);
                    handleClose('submit', res.data.message);
                }, error => {
                    toggleSubmitLoader(false);
                    toggleError(helper.getErrorMessage(error));
                });
            }
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
        <div className="model-container">
            {showLoader && <div className="spinner-wrap"><Spinner color={"blue"} /></div>}
            <div className="modal-header">
                {props.actionName === 'testAd' && <h4 >{t('PRELOAD_PROFILE_TEST_PRELOAD_MODAL_HEADER')}</h4>}
                <CloseOutlinedIcon className="modal-close" aria-label="close" onClick={(e) => handleClose('cancel', '')} />
            </div>

            <div className="modal-body">

                <S.Container>
                    {props.actionName === 'testAd' &&
                        <div className="google-id-wrapper">
                            <h6 className="preload-head">{t('ACTION_TEST_AD_SUBHEADER')}:</h6>
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

                    <h5 className="preload-head">{t('PRELOAD_PROFILE_TEST_PRELOAD_MODAL_APP_LIST_HEADER')}</h5>
                    <div className="preload-app-list">
                        {
                            props.activeRow.slots.map((slot, index: number) => (
                                <div className={slot.preloadSupportedAppId === null ? 'preload-app-items empty' : 'preload-app-items'} key={index}>
                                    <img src={slot.appIcon} className={!props?.profile?.enabledSlots?.includes(index) ? 'disable-app-image' : ''} />
                                </div>))
                        }
                    </div>
                </S.Container>
            </div>

            <div className="modal-footer align-right cc-global-buttons">
                <Button variant="outlined" className="button-xs" type="button" onClick={(e) => handleClose('cancel', '')}>{t('CANCEL_BUTTON')} </Button>
                {!showSubmitLoader && <Button className="button-xs" variant="contained" color="primary" type="submit"
                    onClick={(e) => testPrelaodProfile()} disabled={(props.actionName === 'testAd' && isDisableButton)}>
                    {t('PRELOAD_PROFILE_ACTION_TEST_PRELOAD')}</Button>}
                {showSubmitLoader && <Button className="button-xs" variant="contained" color="primary" type="submit" disabled>{t('PRELOAD_PROFILE_ACTION_TEST_PRELOAD')}<Spinner color={"blue"} /></Button>}
            </div>

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

export default TestPreloadProfilePopup;