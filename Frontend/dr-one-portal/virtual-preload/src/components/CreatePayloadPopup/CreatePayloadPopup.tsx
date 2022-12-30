import React from "react";
import * as S from "./CreatePayload.styles";
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import {
    Button,
    Modal,
    makeStyles
} from "@material-ui/core";
import { useTranslation } from 'react-i18next';

function CreatePayloadPopup(props) {
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
    const [open, setOpen] = React.useState(true);;
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

    const handleClose = (action: string): void => {
        setOpen(false);
        props.handleOpen(false, action, '', true);
    };

    const body = (
        <S.Container>
            <div className="model-container pop-up-style box-preload">

              
                <div className="modal-body launch-body">
                    <h1>{t('PRELOAD_PROFILE_CREATE_PROFILE_MODAL_HEADER')}</h1>
                    <h4>{t('PRELOAD_PROFILE_CREATE_PROFILE_MODAL_SUB_HEADER')}</h4>
                    <h6>{t('PRELOAD_PROFILE_CREATE_PROFILE_MODAL_BODY_HEADER')}</h6>
                    <img src="img/preload-box.svg" alt="preload"/>
                </div>
                <div className="modal-footer align-right cc-global-buttons">
                    <Button className="button-xs" variant="contained" color="primary" type="submit" onClick={(e) => handleClose('cancel')}>
                        {t('PRELOAD_PROFILE_CREATE_PROFILE_MODAL_BUTTON_LEARN_MORE')} </Button>
                    <Button variant="outlined" className="button-xs" color="primary" type="button" onClick={(e) => handleClose('cancel')} startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}> {t('PRELOAD_PROFILE_CREATE_PROFILE_MODAL_BUTTON_CREATE_PAYLOAD')}</Button>
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

export default CreatePayloadPopup;