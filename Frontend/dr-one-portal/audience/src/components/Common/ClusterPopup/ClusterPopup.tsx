import React, { useState, useCallback } from "react";
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import * as S from "./ClusterPopup.styles";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { SnackBarMessage } from "@dr-one/shared-component";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Modal, makeStyles, } from "@material-ui/core";
import { Spinner } from "@dr-one/shared-component";

function ClusterPopup(props) {
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
  const [clusterName, setClusterName] = React.useState('');
  const [clusterNameCheckError, checkClusterName] = useState('');
  const [nameSearchFlag, setNameSearchFlag] = useState(false);
  const [isDisableSaveButton, toggleSaveButton] = useState(true);
  const [clusterModifyError, setClusterModifyError] = useState('');
  const [snackDeleteFlag, setSnackDeleteFlag] = useState(false)
  const [snackDeleteMessage, setSnackDeleteMessage] = useState("");
  const [showSubmitLoader, toggleSubmitLoader] = useState(false);

  const { t } = useTranslation();
  const handleClose = () => {
    setOpen(false);
    props.handleOpen(false);
  };

  const handleChangeName = (clusterName: string): void => {
    if (clusterName.length >= 3) {
      setNameSearchFlag(true);
      toggleSaveButton(true);
      apiDashboard
        .get('campaign-mgmt-api/audienceclusters/name?name=' + encodeURIComponent(clusterName))
        .then(response => {
          setNameSearchFlag(false);
          if (response.data.message === 'false') {
            checkClusterName('');
            toggleSaveButton(false);
          } else {
            checkClusterName(t('CLUSTER_NAME_ALREADY_EXIST'));
            toggleSaveButton(true);
          }
        }, error => {
          setNameSearchFlag(false);
          checkClusterName(t('ERROR_MESSAGE'));
          toggleSaveButton(true);
        });
    }
  }

  const debounceOnChange = useCallback(helper.debounce(handleChangeName, 600), []);

  const updateCluster = () => {
    if (props.popupType === 'Rename') {
      const updatedCluster = { name: clusterName };
      toggleSubmitLoader(true);
      apiDashboard.put('campaign-mgmt-api/audienceclusters/' + props.clusterData.id, updatedCluster)
        .then(response => {
          setClusterName('');
          setClusterModifyError('');
          toggleSubmitLoader(false);
          handleClose();
        }, error => {
          toggleSubmitLoader(false);
          setClusterModifyError(helper.getErrorMessage(error));
        });
    } else {
      const audienceClusterInput = {
        newAudienceClusterName: clusterName,
        sourceAudienceClusterId: props.clusterData.id
      }
      toggleSubmitLoader(true);
      apiDashboard.post('campaign-mgmt-api/audienceclusters/clone', audienceClusterInput)
        .then(response => {
          setClusterName('');
          setClusterModifyError('');
          toggleSubmitLoader(false);
          handleClose();
          Mixpanel.track(
            "Clone Audience",
            { "sourceAudienceId": props.clusterData.id, "audienceId": response.data.data.id, "name": response.data.data.name }
          );
        }, error => {
          toggleSubmitLoader(false);
          setClusterModifyError(helper.getErrorMessage(error));
        });
    }
  }

  const deleteCluster = (): void => {
    toggleSubmitLoader(true);
    apiDashboard.delete('campaign-mgmt-api/audienceclusters/' + props.clusterData.id)
      .then(response => {
        setClusterModifyError('');
        setSnackDeleteFlag(true);
        setSnackDeleteMessage(response.data.message);
        toggleSubmitLoader(false);
        Mixpanel.track(
          "Audience State Changed",
          { "state": "ARCHIVED", "audienceId": props.clusterData.id, name: props.clusterData.name }
        );
        setTimeout(() => {
          handleClose();
        }, 1000);
      }, error => {
        setClusterModifyError(helper.getErrorMessage(error));
        toggleSubmitLoader(false);
      });
  }

  const body = (
    <S.Container>
      <div className="model-container pop-up-style">
        <div className="modal-header">
          <h4 id="simple-modal-title">{props.popupType} {t('CLUSTER')}</h4>
          <CloseOutlinedIcon className="modal-close" aria-label="close" onClick={handleClose} />
        </div>

        <div className="modal-body">
          {props.popupType === "Delete" ? <p className="text-lg"> {t('ONCE_DELETED_CANNOT_BE_RESORED')} </p> : <div className="">
            <TextField
              variant="outlined"
              aria-describedby={t('CLUSTER_NAME')}
              placeholder={t('ENTER_NAME')}
              label={`${t('CLUSTER_NAME')} *`}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setClusterName(e.currentTarget.value);
                debounceOnChange(e.currentTarget.value);
              }}
              value={clusterName}
              type="text"
            />
            {nameSearchFlag && <p> {t('CHECKING_WAIT')} </p>}
            <p className="error"> {clusterNameCheckError}</p>
          </div>}
        </div>

        <div className="modal-footer">
          <Button variant="outlined" className="button-xs" color="primary" type="button" onClick={(e) => handleClose()}> {t('CANCEL_BUTTON')} </Button>
          {!showSubmitLoader && <Button className="button-xs" variant="contained" color="primary" type="submit"
            disabled={props.popupType === "Delete" ? false : isDisableSaveButton}
            startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
            onClick={(e) => {
              props.popupType === "Delete" ? deleteCluster() : updateCluster();
            }}>{props.popupType === "Delete" ? t('DELETE') : t('SAVE_BUTTON')}</Button>}
          {showSubmitLoader && <Button className="button-xs" variant="contained" color="primary" type="submit"
            disabled startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}>
            {props.popupType === "Delete" ? t('DELETE') : t('SAVE_BUTTON')}<Spinner color={"blue"} /></Button>}
        </div>
        <p className="error">{clusterModifyError}</p>
      </div>
    </S.Container>
  );

  return (
    <div>
      {snackDeleteFlag && < SnackBarMessage message={snackDeleteMessage} open={snackDeleteFlag} onClose={(): void => setSnackDeleteFlag(false)} />}
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

export default ClusterPopup;