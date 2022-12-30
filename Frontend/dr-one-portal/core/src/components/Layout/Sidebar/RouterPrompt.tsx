import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import {
    Button,
    Modal,
    makeStyles
} from "@material-ui/core";
// import * as S from "./RouterPrompt.styles";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { useTranslation } from 'react-i18next';

export type RouterPromptProps = {
    when: boolean;
    onOK: any;
    onCancel: any;
};

function RouterPrompt(props) {
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
    const { t } = useTranslation();

    const { when, onOK, onCancel } = props;

    const history = useHistory();

    const [showPrompt, setShowPrompt] = useState(false);
    const [currentPath, setCurrentPath] = useState("");

    useEffect(() => {
        if (when) {
            history?.block((prompt) => {
                setCurrentPath(prompt.pathname);
                setShowPrompt(true);
                return "true";
            });
        } else {
            history.block(() => { });
        }

        return () => {
            history.block(() => { });
        };
    }, [history, when]);

    const handleOK = useCallback(async () => {
        if (onOK) {
            setShowPrompt(false);
            sessionStorage.setItem('enablePrompt', 'false')
            const canRoute = await Promise.resolve(onOK());
            if (canRoute) {
                history.block(() => { });
                history.push(currentPath);
            }
        }
    }, [currentPath, history, onOK]);

    const handleClose = useCallback(async () => {
        if (onCancel) {
            const canRoute = await Promise.resolve(onCancel());
            if (canRoute) {
                history.block(() => { });
                history.push(currentPath);
            }
        }
        setShowPrompt(false);
    }, [currentPath, history, onCancel]);

    const body = (
        // <S.Container>
        <div className="model-container pop-up-style">
            <div className="modal-header">
                <h4>{t('PROMPT_LEAVE_PAGE_HEADER')}</h4>
                <CloseOutlinedIcon className="modal-close" aria-label="close" onClick={(e) => setShowPrompt(false)} />
            </div>

            <div className="modal-body">
                <p>{t('PROMPT_LEAVE_PAGE_CONTENT')}</p>
            </div>

            <div className="modal-footer">
                <Button variant="outlined" className="button-xs" type="button" onClick={() => handleOK()}>{t('YES')} </Button>
                {<Button className="button-xs" variant="contained" color="primary" type="submit" onClick={() => handleClose()}
                >{t('CANCEL_BUTTON')}</Button>}
            </div>
        </div>
        // </S.Container>
    );

    return (
        <Modal
            open={showPrompt}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            disableEscapeKeyDown
            className={classes.modal}
            disableBackdropClick
        >
            {body}
        </Modal>
    );
}

export default RouterPrompt;