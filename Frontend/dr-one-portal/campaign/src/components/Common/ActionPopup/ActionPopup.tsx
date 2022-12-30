import React, { useState, useContext } from "react";
import * as S from "./ActionPopup.styles";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { Spinner } from "@dr-one/shared-component";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { useTranslation } from 'react-i18next';
import { GlobalContext } from '../../../context/globalState';
import {
  Button,
  Modal,
  makeStyles
} from "@material-ui/core";

function ActionPopup(props) {
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
  // const [showLoader, toggleLoader] = useState(false);
  const [showSubmitLoader, toggleSubmitLoader] = useState(false);
  const [showError, toggleError] = useState('');
  const { t } = useTranslation();
  const { dispatch, state } = useContext(GlobalContext);
  const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
  const orgObject = JSON.parse(localStorage.getItem('dr-user'))?.organizations;
  const organizationIndex = orgObject.findIndex(org => org.id === organizationId);
  const timezone = orgObject[organizationIndex > -1 ? organizationIndex : 0].timeZone;

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

  const updatePageAfteChangeStatus = (payload: boolean) => {
    dispatch({
      type: "TAB_RELOAD",
      payload: payload
    })
  }

  const triggerAction = (): void => {
    const modifiedPayload = Object.assign({}, state);
    modifiedPayload['reloadTab'] = true;
    toggleSubmitLoader(true);
    if (props.actionName === 'clone') {
      const postData = {
        sourceCampaignId: props.activeRow.id
      };
      apiDashboard.post(`campaign-mgmt-api/campaigns/clone`, postData).then(res => {
        toggleSubmitLoader(false);
        handleClose('submit', res.data.message);
        Mixpanel.track("Clone Campaign", { "sourceCampaignId": props.activeRow.id, "campaignId": res.data.id, "campaignName": res.data.name });
      }, error => {
        toggleSubmitLoader(false);
        toggleError(helper.getErrorMessage(error));
      });
    } else if (props.actionName === 'archive') {
      const postData = { reason: 'delete campaign', status: 'ARCHIVED' };
      apiDashboard.put(`campaign-mgmt-api/campaigns/${props.activeRow.id}/status`, postData).then(res => {
        toggleSubmitLoader(false);
        handleClose('submit', res.data.message);
        Mixpanel.track(
          "Campaign State Changed",
          { "state": "ARCHIVED", "campaignId": props.activeRow.id, "campaignName": props.activeRow.name }
        );
      }, error => {
        toggleSubmitLoader(false);
        toggleError(helper.getErrorMessage(error));
      });
    } else if (props.actionName === 'submitForApproval') {
      const postData = {
        reason: 'submit for approval',
        status: 'PENDING'
      };
      apiDashboard.put(`campaign-mgmt-api/campaigns/${props.activeRow.id}/status`, postData).then(res => {
        toggleSubmitLoader(false);
        handleClose('submit', res.data.message);
        modifiedPayload['status'] = postData.status
        updatePageAfteChangeStatus(modifiedPayload)
        Mixpanel.track(
          "Campaign State Changed",
          { "state": "PENDING", "campaignId": props.activeRow.id, "campaignName": props.activeRow.name }
        );
      }, error => {
        toggleSubmitLoader(false);
        toggleError(helper.getErrorMessage(error));
      });
    } else if (props.actionName === 'approve') {
      const postData = { status: 'APPROVED' };
      apiDashboard.put(`campaign-mgmt-api/campaigns/${props.activeRow.id}/status`, postData).then(res => {
        toggleSubmitLoader(false);
        handleClose('submit', res.data.message);
        Mixpanel.track(
          "Campaign State Changed",
          { "state": "APPROVED", "campaignId": props.activeRow.id, "campaignName": props.activeRow.name }
        );
      }, error => {
        toggleSubmitLoader(false);
        toggleError(helper.getErrorMessage(error));
      });
    } else if (props.actionName === 'cancel') {
      const postData = {
        reason: 'cancel campaign',
        status: 'CANCELLED'
      };
      apiDashboard.put(`campaign-mgmt-api/campaigns/${props.activeRow.id}/status`, postData).then(res => {
        toggleSubmitLoader(false);
        handleClose('submit', res.data.message);
        modifiedPayload['status'] = postData.status;
        Mixpanel.track(
          "Campaign State Changed",
          { "state": "CANCELLED", "campaignId": props.activeRow.id, "campaignName": props.activeRow.name }
        );
      }, error => {
        toggleSubmitLoader(false);
        toggleError(helper.getErrorMessage(error));
      });
    } else if (props.actionName === 'review' || props.actionName === 'release') {
      const payload = {
        'lockCampaign': props.actionName === 'review' ? true : false
      };
      apiDashboard.put(`campaign-mgmt-api/campaigns/${props.activeRow.id}/review`, payload).then(res => {
        toggleSubmitLoader(false);
        handleClose('submit', res.data.message);
        updatePageAfteChangeStatus(modifiedPayload);
      }, error => {
        toggleSubmitLoader(false);
        toggleError(helper.getErrorMessage(error));
      });
    }
  }

  const formatDate = (date: Date): any => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
  }


  const today = (timeZone: string): any => {
    return helper.formatDate(
      helper.convertDateByTimeZone(
        timeZone ? timeZone : 'America/Sao_Paulo'
      )
    );
  }

  const body = (
    <S.Container>
      <div className="model-container pop-up-style">
        {/* {showLoader && <div className="spinner-wrap"><Spinner color={"blue"} /></div>} */}

        <div className="modal-header">
          <h4>{props.actionName === 'submitForApproval' ? t('ACTION_SUBMIT_FOR_APPROVAL') : helper.stringCapitalize(props.actionName)} {t('CAMPAIGN_LABEL')} </h4>
          <CloseOutlinedIcon className="modal-close" aria-label="close" onClick={(e) => handleClose('cancel', '')} />
          {props.actionName === 'approve' && <div>
            {props.activeRow?.startDate >= today(timezone) && <p>{t('ACTION_POPUP_CONFIRMATION_QUESTION')} {t('ACTION_APPROVE')}</p>}
            {today(timezone) > props.activeRow?.startDate && <p>{t('ACTION_POPUP_APPROVE_SUBHEADER')}</p>}
          </div>}

        </div>

        <div className="modal-body">
          {(props.actionName === 'review' && (today(timezone) > props.activeRow?.startDate)) &&
            <p className="text-lg">{t('ACTION_POPUP_REVIEW_DENIEL_SUBHEADER')}</p>}
          {props.actionName === 'clone' && <p className="text-lg">{t('ACTION_QUESTION')} <span>{t('ACTION_CLONE')}</span> '{props.activeRow.name}' {t('CAMPAIGN_LABEL')}?</p>}
          {props.actionName === 'archive' && <p className="text-lg">{t('ACTION_QUESTION')} <span>{t('ACTION_DELETE')} </span>{t('ACTION_PRONOUN')} {t('CAMPAIGN_LABEL')}?</p>}
          {(props.actionName === 'cancel' ||
            (props.actionName === 'review' && props.activeRow?.startDate >= today(timezone)) || props.actionName === 'release') && <p className="text-lg">{t('ACTION_POPUP_CONFIRMATION_QUESTION')} <span >{props.actionName}</span> {t('ACTION_PRONOUN')} {t('CAMPAIGN_LABEL')}?</p>}
          {props.actionName === 'submitForApproval' && <p className="text-lg">{t('ACTION_POPUP_CONFIRMATION_QUESTION')} <span>{t('ACTION_SUBMIT_FOR_APPROVAL')}</span> {t('ACTION_PRONOUN')} {t('CAMPAIGN_LABEL')}?</p>}
          {props.actionName === 'approve' && <div>
            {today > props.activeRow?.startDate && <p>{t('ACTION_CAMPAIGN_REJECT_WARNING')}</p>}
            {props.activeRow?.startDate >= today && <p className="text-lg">{t('ACTION_CAMPAIGN_ACCEPT_WARNING')} <span>{props.actionName}</span>.</p>}
          </div>}
          <p className="error-wrap error">{showError}</p>
        </div>

        {props.actionName !== 'approve' && <div className="modal-footer">
          <Button variant="outlined" className="button-xs" type="button" onClick={(e) => handleClose('cancel', '')}> {t('GO_BACK_BUTTON')}</Button>
          {!showSubmitLoader && <Button className="button-xs" variant="contained" color="primary" type="submit"
            onClick={(e) => triggerAction()} disabled={(props.actionName === 'review') && (today(timezone) > props.activeRow?.startDate)}>{props.actionName === 'submitForApproval' ? t('ACTION_SUBMIT_FOR_APPROVAL') : helper.stringCapitalize(props.actionName)}</Button>}
          {showSubmitLoader && <Button className="button-xs" variant="contained" color="primary" type="submit" disabled
          >{props.actionName === 'submitForApproval' ? t('ACTION_SUBMIT_FOR_APPROVAL') : helper.stringCapitalize(props.actionName)}<Spinner color={"blue"} /></Button>}
        </div>}
        {props.actionName === 'approve' && <div className="modal-footer">
          <Button variant="outlined" className="button-xs" type="button" onClick={(e) => handleClose('cancel', '')}> {t('GO_BACK_BUTTON')} </Button>
          {(!showSubmitLoader && props.activeRow?.startDate >= today) && <Button className="button-xs" variant="contained" color="primary" type="submit"
            onClick={(e) => triggerAction()} >{helper.stringCapitalize(props.actionName)}</Button>}
          {showSubmitLoader && <Button className="button-xs" variant="contained" color="primary" type="submit" disabled
          >{helper.stringCapitalize(props.actionName)}<Spinner color={"blue"} /></Button>}
        </div>}
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

export default ActionPopup;