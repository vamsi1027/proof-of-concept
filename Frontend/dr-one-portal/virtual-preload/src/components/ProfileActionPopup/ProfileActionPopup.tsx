import React, { useState, useContext } from "react";
import * as S from './ProfileActionPopup.styles';
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { Spinner } from "@dr-one/shared-component";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
    Button,
    Modal,
    makeStyles
} from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { GlobalContext } from "../../context/globalState";

function ProfileActionPopup(props) {
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
    const { state, dispatch } = useContext(GlobalContext)
    const [open, setOpen] = React.useState(true);
    const [showError, toggleError] = useState('');
    const { t } = useTranslation();

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

    const handleClose = (action: string, message: string) => {
        setOpen(false);
        props.handleOpen(false, action, message, false);
    };

    const triggerAction = (): void => {
        const profileId = state.unPublishedProfile.id;
        const statusData = {
            reason: 'none',
            status: props.actionName
        };
        dispatch({
            type: 'TOGGLE_LOADER',
            payload: true
        })
        apiDashboard
            .put(`preload/profile/status/${profileId}`, statusData)
            .then(response => {
                const modifiedPayload = Object.assign({}, state.unPublishedProfile);
                modifiedPayload['status'] = props.actionName;
                if (props.actionName === 'PENDING') {
                    Mixpanel.track('Submit For Approval Action', { state: 'PENDING', profileId: profileId, channelId: state.selectedChannelId, page: 'Preload Profile Page View' });
                } else if (props.actionName === 'LOCKED') {
                    Mixpanel.track('Review Action', { state: 'LOCKED', profileId: profileId, channelId: state.selectedChannelId, page: 'Preload Profile Page View' });
                } else if (props.actionName === 'REJECTED') {
                    Mixpanel.track('Deny Action', { state: 'REJECTED', profileId: profileId, channelId: state.selectedChannelId, page: 'Preload Profile Page View' });
                } else if (props.actionName === 'PUBLISHED') {
                    Mixpanel.track('Publish Action', { state: 'PUBLISHED', profileId: profileId, channelId: state.selectedChannelId, page: 'Preload Profile Page View' });
                }
                dispatch({
                    type: 'TOGGLE_LOADER',
                    payload: false
                })
                handleClose('submit', props.actionName === 'PUBLISH' ? t('PRELOAD_PROFILE_STATUS_PUBLISHED_MESSAGE') : t('PRELOAD_PROFILE_STATUS_UPDATE_MESSAGE'));
            }, error => {
                toggleError(helper.getErrorMessage(error));
                dispatch({
                    type: 'GET_PROFILE',
                    payload: {
                        publishedProfile: state.publishedProfile,
                        unPublishedProfile: state.unPublishedProfile,
                        isSlotModified: false,
                        isCellModified: false,
                        enabledSlotsBeforeModification: [],
                        deviceListBeforeModification: [],
                        profileErrorStatus404: false,
                        scrollPosition: state.scrollPosition
                    }
                })
                dispatch({
                    type: 'TOGGLE_LOADER',
                    payload: false
                })
            });
    }

    const body = (
        <S.Container>
            <div className="model-container pop-up-style reject-approve">
                <div className="modal-header">
                    <h4>{t('APPROVE_REJECT_POPUP_HEADER')}</h4>
                    <CloseOutlinedIcon className="modal-close" onClick={(e) => handleClose('cancel', '')} />
                </div>
                <div className="modal-body launch-body">
                    {props.actionName === 'PENDING' && <img src="/img/launch.png" className="launch-img" alt="Launch icon" />}
                    <h4 className="launch-heading">{props.actionName === 'PENDING' ? t('PRELOAD_PROFILE_SUBMIT_FOR_APPROVAL_MODAL_SUB_HEADER') :
                        props.actionName === 'REJECTED' ? t('PRELOAD_PROFILE_REJECT_MODAL_SUB_HEADER') : props.actionName === 'PUBLISHED' ? t('PRELOAD_PROFILE_PUBLISH_MODAL_SUB_HEADER')
                            : t('PRELOAD_PROFILE_LOCK_MODAL_SUB_HEADER')}</h4>
                    {/* <h5>{t('APPROVE_REJECT_POPUP_TABLE_HEADER')}</h5>
                    <ul>
                        <li>{t('PRELOAD_PROFILE_TEST_PRELOAD_MODAL_APP_LIST_HEADER')} </li>
                        <li>{t('DEVICE_LABEL')} <p></p></li>
                        <li>{t('APPROVE_REJECT_POPUP_LIST_DATE')}: <p>{helper.convertTimestampToDate(state?.unPublishedProfile?.updatedAt * 1000)}</p></li>
                        <li>{t('PRELOAD_PROFILE_SUBMIT_FOR_APPROVAL_MODAL_LOCATION_LABEL')}: <p></p></li>
                    </ul> */}

                    <p className="error-wrap error">{showError}</p>
                </div>
                <div className="modal-footer align-right cc-global-buttons">
                    <Button variant="outlined" className="button-xs" color="primary" type="button" onClick={(e) => handleClose('cancel', '')}>{t('CANCEL_BUTTON')} </Button>
                    {!state.toggleLoader && <Button className="button-xs" variant="contained" color="primary" type="submit"
                        onClick={(e) => triggerAction()} >{t('SAVE_BUTTON')}</Button>}
                    {state.toggleLoader && <Button className="button-xs" variant="contained" color="primary" type="submit" disabled
                    >{t('SAVE_BUTTON')}<Spinner color={"blue"} /></Button>}
                </div>

            </div>
        </S.Container>
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

export default ProfileActionPopup;