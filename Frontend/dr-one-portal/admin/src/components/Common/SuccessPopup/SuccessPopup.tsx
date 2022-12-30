import React from "react";
import * as S from "./SuccessPopup.styles";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
  Modal,
  makeStyles,
  Button
} from "@material-ui/core";
import { useTranslation } from 'react-i18next';


function SuccessPopup(props) {
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
  const [open, setOpen] = React.useState(true);

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

  const handleClose = (type: string): void => {  
    setOpen(false);
    props.handleOpen(false, type, true);
  };

  const body = (
    <S.Container>
      <div className="model-container pop-up-style success-pop-up">
        <div className="modal-header">
          <CloseOutlinedIcon className="modal-close" aria-label="close" onClick={() => { handleClose('') }} />
        </div>
        <div className="modal-body">
          {props.operationType !== 'Edit' && <h1 id="simple-modal-title">{props.type} {t('CLUSTER_CREATED_SUCCESSFULL').replace('Cluster ', '')} </h1>}
          {props.operationType === 'Edit' && <h1 id="simple-modal-title">{props.type} {t('UPDATION_SUCCESS_MESSAGE')} </h1>}

            <img src="/img/success-illustration-icon.svg" alt="success"/>
        </div>
        <div className="modal-footer">
          <Button className="button-xs" variant="contained" color="primary" type="submit"
            onClick={() => { handleClose('') }}
          >{t('OK_BUTTON')}</Button>
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
      >
        {body}
      </Modal>
    </div>
  );
}

export default SuccessPopup;