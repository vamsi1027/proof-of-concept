import React, { useContext } from "react";
import * as S from "./ClusterWarring.style";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { useTranslation } from 'react-i18next';
import { Button, Modal, makeStyles, } from "@material-ui/core";
import { GlobalContext } from "../../../context/globalState";

function ClusterParameter(props) {
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
    const { state, dispatch } = useContext(GlobalContext);
    const { t } = useTranslation();
    const resetState = () => {
        const modifiedPayload = Object.assign({}, state.rules);
        modifiedPayload['locations'] = {
            condition: "ANY",
            list: [],
        }
        modifiedPayload['installedApps'] = {
            condition: "ANY",
            list: [],
        }
        modifiedPayload['osVersions'] = {
            condition: "ANY",
            list: [],
        }
        modifiedPayload['makers'] = {
            condition: "ANY",
            list: [],
        }
        modifiedPayload['wirelessOperators'] = {
            condition: "ANY",
            list: [],
        }
        modifiedPayload['sourcePackages'] = {
            condition: "ANY",
            list: [],
        }
        modifiedPayload['deviceTier'] = {
            condition: "ANY",
            list: [],
        }
        modifiedPayload['customAttribute'] = {
            condition: "ANY",
            list: [],
        }
        modifiedPayload['campaignList'] = []
        modifiedPayload['orAnd'] = ""
        modifiedPayload['yesNoIgnore'] = ""
        modifiedPayload["clusterType"] = props.type
        dispatch({
            type: 'RESET_STATE',
            payload: {
                rulesPayload: modifiedPayload,
            },
        })
    }
    const handleClose = () => {
        setOpen(false);
        props.handleOpen(false);
    };

    const body = (
        <S.Container>
            <div className="model-container pop-up-style">
                <div className="modal-header">
                    <h4 id="simple-modal-title">{t('CONFIRMATION')}</h4>
                    <CloseOutlinedIcon className="modal-close" aria-label="close" onClick={handleClose} />
                </div>
                <div className="modal-body">
                    <h4>{t('REALLY_WANT_TO_SWITCH')}</h4>
                </div>
                <div className="modal-footer">
                    <Button variant="outlined" className="button-xs" color="primary" type="button" onClick={(e) => handleClose()}>{t('NO')}</Button>
                    <Button className="button-xs" variant="contained" color="primary" type="submit"
                        onClick={(e) => {
                            const modifiedPayload = Object.assign({}, state.rules);
                            modifiedPayload["clusterType"] = props.type;
                            dispatch({
                                type: "MODIFY_RULES",
                                payload: {
                                    rulesPayload: modifiedPayload,
                                },
                            });
                            props.setCluster(props.type)
                            resetState()
                            handleClose()
                        }}>{t('YES')}</Button>
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

export default ClusterParameter;