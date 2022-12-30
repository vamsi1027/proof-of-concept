import React, { useEffect, useState, useContext } from "react";
import * as S from "./ApproveRejectPopup.styles";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { Spinner } from "@dr-one/shared-component";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import CachedIcon from '@material-ui/icons/Cached';
import {
  Button,
  TextField,
  Modal,
  makeStyles
} from "@material-ui/core";
import { GlobalContext } from '../../../context/globalState';
import { useTranslation } from 'react-i18next';
import HelpIcon from '@material-ui/icons/Help';
import { LightTooltip } from "@dr-one/shared-component";
function ApproveRejectPopup(props) {
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
  const [showSubmitLoader, toggleSubmitLoader] = useState(false);
  const [showError, toggleError] = useState('');
  const [campaignDenyReason, setCampaignDenyReason] = React.useState('');
  const [isShowRejectionCommentTextField, toggleRejectionCommentTextField] = React.useState(false);
  const [rejectLoader, setRejectLoader] = useState(false)
  // const [audienceCount, setAudienceCount] = useState('');
  const [reachCountflag, setReachCountFlag] = useState(true)
  const [reachCountErrorflag, setReachCountErrorFlag] = useState(true)
  const [isReachCountLoading, setReachCountLoading] = useState(false);
  const [loadingReachCount, setLoadingReachCount] = useState(false);
  let getReachCountSetTimeOut: any = null;
  const [activeDeviceReachCount, setActiveDeviceReachCount] = useState(props?.activeRow.deviceReachCount);
  const [loopCount, setLoopCount] = useState(0);

  const { dispatch, state } = useContext(GlobalContext);
  const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
  const [timezone, setTimezone] = useState('');
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

  const triggerAction = (actionName: string): void => {
    const modifiedPayload = Object.assign({}, state);
    modifiedPayload['reloadTab'] = true
    if (actionName === 'approve') {
      toggleSubmitLoader(true);
      const postData = { status: 'APPROVED' };
      apiDashboard.put(`campaign-mgmt-api/campaigns/${props.activeRow.id}/status`, postData).then(res => {
        toggleSubmitLoader(false);
        handleClose('submit', res.data.message);
        if (window.location.pathname.indexOf('edit') >= 0) {
          modifiedPayload['status'] = postData.status;
          updatePageAfteChangeStatus(modifiedPayload);
        }
        if (props.activeRow.enableSurvey) {
          Mixpanel.track(
            "Survey Campaign sent",
            { "campaignId": props.activeRow.id, "campaignName": props.activeRow.name }
          );
        }
        Mixpanel.track(
          "Campaign State Changed",
          { "state": "APPROVED", "campaignId": props.activeRow.id, "campaignName": props.activeRow.name }
        );
      }, error => {
        toggleSubmitLoader(false);
        toggleError(helper.getErrorMessage(error));
      });
    } else if (actionName === 'deny') {
      setRejectLoader(true)
      const payload = { status: 'REJECTED', reason: campaignDenyReason };
      apiDashboard.put(`campaign-mgmt-api/campaigns/${props.activeRow.id}/status`, payload).then(res => {
        toggleSubmitLoader(false);
        setRejectLoader(false)
        handleClose('submit', res.data.message);

        if (window.location.pathname.indexOf('edit') >= 0) {
          modifiedPayload['status'] = payload.status;
          updatePageAfteChangeStatus(modifiedPayload);
        }
        Mixpanel.track(
          "Campaign State Changed",
          { "state": "REJECTED", "campaignId": props.activeRow.id, "campaignName": props.activeRow.name }
        );
      }, error => {
        toggleSubmitLoader(false);
        setRejectLoader(false);
        toggleError(helper.getErrorMessage(error));
      });
    }
  }
  useEffect(() => {
    getReachCount(false)
  }, [JSON.parse(props?.activeRow.audienceClusters)?.list.length > 0])

  const today = (timeZone: string): any => {
    return helper.formatDate(
      helper.convertDateByTimeZone(
        timeZone ? timeZone : 'America/Sao_Paulo'
      )
    );
  }
  const getReachCount = (force: boolean = false, loopReachCount = true) => {
    setReachCountFlag(true)
    if (JSON.parse(props?.activeRow.audienceClusters)?.list.length > 0 && helper.isIncludeFilterAdded(JSON.parse(props?.activeRow.audienceClusters)) && loopReachCount && !isReachCountLoading) {
      setReachCountLoading(true);
      let endPoint;
      const targetSDKVersion = window.location.pathname.indexOf('edit') >= 0 ? props?.stateValue.template.targetSDKVersion : props?.activeRow.targetSDKVersion;
      const isGeofenceEnabled = window.location.pathname.indexOf('edit') >= 0 ? props?.stateValue.settings?.geofence.enableGeofence : props?.activeRow.enableGeoFence;
      
      const feature = [];
      if (isGeofenceEnabled) {
        feature.push('GeoFence');
      } else {
        if (feature.indexOf('GeoFence') > -1) {
          feature.splice(feature.indexOf('GeoFence'), 1);
        }
      }
      if (['2.4.0', '2.5.0', '2.7.0'].indexOf(targetSDKVersion) !== -1) {
        feature.push('AdvCampaign');
        feature.push('notification');
      } else {
        feature.push('notification');
      }
      endPoint = helper.getAudienceReachCountForCampaign(
        helper.formatClusterCriteria(JSON.parse(props?.activeRow.audienceClusters)), force, feature,
        targetSDKVersion,
        false,
        false
      )
      apiDashboard
        .get(
          endPoint
        ).then(response => {
          if (JSON.parse(props?.activeRow.audienceClusters) !== null) {
            if (JSON.parse(props?.activeRow.audienceClusters).list.length <= 0) {
              clearTimeout(getReachCountSetTimeOut);
              getReachCountSetTimeOut = null;
              return;
            }
          }
          if (parseInt(response.data['status'], helper.radix) !== 100) {
            renderReachCount(response.data['data']);
            setReachCountFlag(false)
            loopReachCount = false;
          } else {
            loopReachCount = true;
            renderReachCount({ 'loading': true });

            if (getReachCountSetTimeOut !== null) {
              clearTimeout(getReachCountSetTimeOut);
              getReachCountSetTimeOut = null;
            }
            getReachCountSetTimeOut = setTimeout(() => {
              getReachCount(false, loopReachCount);
            }, 5000);
          }
        }, error => {
          loopReachCount = true;
          renderReachCount({ 'loading': true });
          setReachCountLoading(false);
          setReachCountFlag(false)
          setActiveDeviceReachCount(0);
          console.log(helper.getErrorMessage(error));
        })
    } else {
      loopReachCount = false;
      setLoadingReachCount(false);
      setActiveDeviceReachCount(null);
    }
  }

  const renderReachCount = (data: any): void => {
    setLoopCount(loopCount + 1);
    if (loopCount > 3) {
      setLoadingReachCount(false);
    }
    if (data.loading) {
      setLoadingReachCount(true);
    } else {
      if (data.scope === null) {
      } else {
        setReachCountLoading(false);
        setActiveDeviceReachCount(data.activeDeviceReachCount.toString());
        setLoadingReachCount(false);
      }
    }
  }
  const loaderCount = <div className="loading-dots">
    <h1 className="dot one">.</h1><h1 className="dot two">.</h1><h1 className="dot three">.</h1>
  </div>

  const body = (
    <S.Container>
      <div className="model-container pop-up-style reject-approve">
        {showLoader && <div className="spinner-wrap"><Spinner color={"blue"} /></div>}

        <div className="modal-header">
          <h4>{t('APPROVE_REJECT_POPUP_HEADER')}</h4>
          <CloseOutlinedIcon className="modal-close" onClick={(e) => handleClose('cancel', '')} />
        </div>
        <div className="modal-body launch-body">
          {props.activeRow?.startDate >= today(timezone) && <img src="/img/launch.png" className="launch-img" alt="Launch icon" />}
          {props.activeRow?.startDate >= today(timezone) && <h4 className="launch-heading">{t('APPROVE_REJECT_POPUP_SUBHEADER')}</h4>}
          {today(timezone) > props.activeRow?.startDate && <h4 className="launch-heading">{t('ACTION_POPUP_APPROVE_SUBHEADER')}</h4>}
          {props.activeRow?.startDate >= today(timezone) && <h5>{t('APPROVE_REJECT_POPUP_TABLE_HEADER')}</h5>}
          {props.activeRow?.startDate >= today(timezone) && <ul>
            <li>{t('APPROVE_REJECT_POPUP_LIST_CAMPAIGN_TYPE')}: <p>{`${props.activeRow.campaignType === null ? " " : props.activeRow.campaignType} ${props.activeRow.adTemplateType === null ? " " : props.activeRow.adTemplateType}`}</p></li>
            <li>{t('APPROVE_REJECT_POPUP_LIST_AUDIENCE')}:
              <LightTooltip title={<label>{t('TOOLTIP_FOR_AUDIENCE_REACH_COUNT_MODAL')}</label>} />
              <Button
                variant="contained"
                color="primary"
                type="button"
                className="button-sm reach-count-button"
                size="small"
                startIcon={
                  !isReachCountLoading ? (
                    <CachedIcon />
                  ) : (
                    <Spinner color="lightblue" />
                  )
                }
                onClick={() => getReachCount(true)}
                disabled={isReachCountLoading}
              >
              </Button>
              {reachCountflag ? loaderCount : <span className="reach-count">{activeDeviceReachCount === 0 ? 'N/A' : activeDeviceReachCount}</span>}
            </li>
            <li>{t('APPROVE_REJECT_POPUP_LIST_DATE')}: <p>{props.activeRow.startDate}</p></li>
            <li>{t('SETTINGS_PERFORMANCE_TARGET_LABEL')}: <p>{props.activeRow.campaignBoost.targetMetrics}</p></li>
            <li>{props.activeRow.performance.type} <p>{props.activeRow.performance.pricingType === "PRICED" ? props.activeRow.performance.proposedPrice : props.activeRow.performance.pricingType}</p></li>
          </ul>}

          <p className="error-wrap error">{showError}</p>
        </div>
        <div className="modal-footer align-right cc-global-buttons">
          <Button variant="outlined" className="button-xs" color="primary" type="button" onClick={(e) => { toggleRejectionCommentTextField(true) }} disabled={today(timezone) > props.activeRow?.startDate}> {t('REJECT_BUTTON')}</Button>
          {!showSubmitLoader && <Button className="button-xs" variant="contained" color="primary" type="submit"
            onClick={(e) => triggerAction("approve")} disabled={today(timezone) > props.activeRow?.startDate}>{t('APPROVE_AND_SEND_BUTTON')}</Button>}
          {showSubmitLoader && <Button className="button-xs" variant="contained" color="primary" type="submit" disabled
          >{t('APPROVE_AND_SEND_BUTTON')}<Spinner color={"blue"} /></Button>}
        </div>
        {props.activeRow?.startDate >= today(timezone) && <div className="reject-comment">
          {isShowRejectionCommentTextField && <TextField
            variant="outlined"
            aria-describedby="Campaign Deny Reason"
            placeholder="Enter your comments here..."
            className="mt-15"
            label="Reasons for rejection*"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              setCampaignDenyReason(e.currentTarget.value);
            }}
            value={campaignDenyReason}
            type="text"
          />}
          {(isShowRejectionCommentTextField && !rejectLoader) && <Button className="button-xs" variant="contained" color="primary" onClick={(e) => triggerAction('deny')} disabled={(campaignDenyReason.length === 0)}>{t('SEND_COMMENTS_BUTTON')}</Button>}
          {(isShowRejectionCommentTextField && rejectLoader) && <Button className="button-xs" variant="contained" color="primary" onClick={(e) => triggerAction('deny')} disabled
          >{t('SEND_COMMENTS_BUTTON')}<Spinner color={"blue"} /></Button>}
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

export default ApproveRejectPopup;