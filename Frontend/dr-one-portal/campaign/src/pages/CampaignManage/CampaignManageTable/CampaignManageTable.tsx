import React, { useEffect, useState, useRef } from "react";
import { Pagination } from '@material-ui/lab';
import {
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Paper
} from "@material-ui/core";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import * as S from "./CampaignManageTable.styles";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { CampaignData } from '../../../Campaign.model';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ListAltIcon from '@material-ui/icons/ListAlt';
import BlockIcon from '@material-ui/icons/Block';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';
import ToggleOnOutlinedIcon from '@material-ui/icons/ToggleOnOutlined';
import LockIcon from '@material-ui/icons/Lock';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
// import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import TrendingUp from '@material-ui/icons/TrendingUp';
import SendIcon from '@material-ui/icons/Send';
// import SwapVerticalCircleOutlinedIcon from '@material-ui/icons/SwapVerticalCircleOutlined';
// import BusinessCenterOutlinedIcon from '@material-ui/icons/BusinessCenterOutlined';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
// import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from "react-router-dom";
import StopBoostDenyTestAdPopup from '../../../components/Common/StopBoostDenyTestAdPopup/StopBoostDenyTestAdPopup';
import ApproveRejectPopup from '../../../components/Common/ApproveRejectPopup/ApproveRejectPopup';
import ActionPopup from '../../../components/Common/ActionPopup/ActionPopup';
import { SnackBarMessage } from "@dr-one/shared-component";
import { userHasPermission } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';

function CampaignManageTable(props) {
  let history = useHistory();
  const [page, setPage] = React.useState(props.page);
  const [sortColumn, setSortColumn] = React.useState(props.sortColumn);
  const [sortOrder, setSortOrder] = React.useState(props.sortOrder);
  const [campaignData, setCampaignData] = React.useState<CampaignData>(props.campaignData);
  const [campaignList, setCampaignList] = React.useState(props.campaignList);
  const [searchText, setSearchText] = useState(props.searchText);
  const [prevSearchText, setPrevSearchText] = React.useState(props.searchText);
  const [isShowActionList, actionListToggle] = React.useState(props.actionListStatus);
  const [actionListIndex, setActionListIndex] = React.useState(props.actionListIndex);
  const [activeTabName, setActiveTabName] = React.useState(props.tabName);
  const [showBackdrop, setShowBackdrop] = React.useState(props.isShowLoader);
  const [isOpenStopBoostDenyTestAdCampaignPopup, toggleStopBoostDenyTestAdCampaignPopup] = React.useState(false);
  const [activeRow, setActiveRow] = React.useState(Object);
  const [isOpenActionPopup, toggleActionPopup] = React.useState(false);
  const [actionName, setActionName] = useState('');
  const [sucessMessage, setSuccessMessage] = useState(props.sucessMessage);
  const [succesMessageValue, setSuccessMessageValue] = useState(props.succesMessageValue);
  const isSuperAdmin = userHasPermission(['SUPER_ADMIN']);
  const [isOpenActionRejectPopup, toggleActiveRejectPopup] = React.useState(false);
  const currentUserId = JSON.parse(localStorage.getItem('dr-user'))?.email;
  const { t } = useTranslation();
  const ref = useRef<any>();

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (isShowActionList && ref.current && !ref.current.contains(e.target)) {
        actionListToggle(false);
        props.toggleActionList(false, activeTabName, null);
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    }
  }, [])

  const tableBottomHeight = document.getElementById('table-bottom')?.offsetTop;

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
    getCampaignList(helper.manipulateQueryString(props.campaignStatusList, newPage - 1, 10, sortColumn, sortOrder, encodeURIComponent(helper.trimString(searchText))));
  };

  const getCampaignList = (queryString: any, tabValue: number = null): void => {
    const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
    setShowBackdrop(true);
    apiDashboard
      .get(`campaign-mgmt-api/campaigns/v5/organization/${organizationId}${queryString}`)
      .then(response => {
        setCampaignData(response.data.data);
        setCampaignList(response.data.data.content);
        updateCampaignData(queryString, response.data.data, response.data.data.content, tabValue);
        setShowBackdrop(false);
      }, error => {
        setShowBackdrop(false);
        setCampaignData(Object);
        setCampaignList([]);
        updateCampaignData(queryString, {}, [], tabValue);
        console.log(helper.getErrorMessage(error));
      });
  }

  const searchCampaign = (): void => {
    if ((searchText.trim().length > 2) || (searchText.trim().length === 0 && prevSearchText !== '')) {
      getCampaignList(helper.manipulateQueryString(props.campaignStatusList, 0, 10, sortColumn, sortOrder, encodeURIComponent(helper.trimString(searchText))));
      setPrevSearchText(searchText.trim());
    }
  }

  const setTableColumn = (sortOrder: string, sortColumn: string): void => {
    setSortColumn(sortColumn);
    setSortOrder(sortOrder);
    getCampaignList(helper.manipulateQueryString(props.campaignStatusList, page - 1, 10, sortColumn, sortOrder, encodeURIComponent(helper.trimString(searchText))));
  }

  const updateCampaignData = (queryString: any, campaignData: any, campaignList: any, tabValue: number = null, isShowSuccessMessage: boolean = false, successMessageValue: string = ''): void => {
    const page = getParameterByName('page', queryString);
    const sortColumn = getParameterByName('sort', queryString);
    const sortOrder = getParameterByName('sort-order', queryString);
    const searchText = getParameterByName('filter', queryString);
    props.updateCampaignDetails(campaignData, campaignList, tabValue !== null ? tabValue : activeTabName, Number(page), sortColumn, sortOrder, searchText, isShowSuccessMessage, successMessageValue);

    if (tabValue !== 0) {
      if (tabValue !== null) {
        props.updateTab(tabValue);
      }
    }
  }

  const getParameterByName = (name: string, queryString: any): string => {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(queryString);
    if (!results) return '';
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  const canEnableEdit = (activeRowDetails: any): boolean => {
    return setCanEdit(activeRowDetails) && ['DRAFT', 'REJECTED', 'READY', 'PENDING'].indexOf(activeRowDetails.status) !== -1
      && !activeRowDetails.lockCampaign && !blockCampaignActions(activeRowDetails);
  }

  const canEnableClone = (activeRowDetails: any): boolean => {
    return setCanClone(activeRowDetails) && activeRowDetails.status !== 'DRAFT' &&
      activeRowDetails.campaignObjective.name.indexOf("IU Platform") === -1 && !blockCampaignActions(activeRowDetails);
  }

  const canEnableStop = (activeRowDetails: any): boolean => {
    return (setCanStop(activeRowDetails) &&
      activeRowDetails.status !== 'DRAFT'
      && (activeRowDetails.status === 'APPROVED' || activeRowDetails.status === 'COMPLETED') && !blockCampaignActions(activeRowDetails)
    );
  }

  const canArchive = (activeRowDetails: any): boolean => {
    return (setCanEdit(activeRowDetails) && activeRowDetails.status !== 'APPROVED');
  }

  const canEnableApprove = (activeRowDetails: any): boolean => {
    return (setCanApprove(activeRowDetails) && activeRowDetails.status === 'PENDING'
      && activeRowDetails.lockCampaign && (activeRowDetails.reviewById === currentUserId) && !blockCampaignActions(activeRowDetails)
    );
  }

  const canEnableDeny = (activeRowDetails: any): boolean => {
    return (setCanReject(activeRowDetails) && activeRowDetails.status === 'PENDING'
      && activeRowDetails.lockCampaign
      // to do
      && (activeRowDetails.reviewById === currentUserId)
    );
  }

  const onStopBoostDenyTestAdCampaign = (activeRowDetails: any, action: string): void => {
    setActiveRow(activeRowDetails);
    setActionName(action);
    actionListToggle(false);
    toggleStopBoostDenyTestAdCampaignPopup(true);
  }

  const canEnableSubmitForApprove = (activeRowDetails: any): boolean => {
    return (setCanSubmitForApprove(activeRowDetails) && activeRowDetails.status !== 'DRAFT'
      && (activeRowDetails.status === 'READY' || activeRowDetails.status === 'REJECTED') && !blockCampaignActions(activeRowDetails)
    );
  }

  const canEnableCancel = (activeRowDetails: any): boolean => {
    return (setCanCancel(activeRowDetails) && activeRowDetails.status !== 'DRAFT'
      && (activeRowDetails.status === 'READY' || activeRowDetails.status === 'REJECTED') && !blockCampaignActions(activeRowDetails)
    );
  }

  const canEnableReview = (activeRowDetails: any): boolean => {
    return (setCanApprove(activeRowDetails) && (!activeRowDetails.lockCampaign ||
      (activeRowDetails.lockCampaign && activeRowDetails.userId === currentUserId))
      && activeRowDetails.status !== 'DRAFT'
      && activeRowDetails.status === 'PENDING' && !blockCampaignActions(activeRowDetails)
    );
  }

  const canEnableRelease = (activeRowDetails: any): boolean => {
    return (activeRowDetails.lockCampaign && (activeRowDetails.reviewById === currentUserId) && !blockCampaignActions(activeRowDetails)
    );
  }

  const canEnableJobs = (activeRowDetails: any): boolean => {
    return (activeRowDetails !== null && setCanReadJobs(activeRowDetails)
      && (activeRowDetails.status === 'APPROVED' || activeRowDetails.status === 'COMPLETED')
      && activeRowDetails.audienceClusterScope === 'IU_MANAGED' && !blockCampaignActions(activeRowDetails)
    );
  }

  const canEnableTestAd = (activeRowDetails: any): boolean => {
    return (activeRowDetails !== null
      && activeRowDetails.status !== 'DRAFT' && !blockCampaignActions(activeRowDetails)
    );
  }

  const canEnableBoost = (activeRowDetails: any): boolean => {
    return (activeRowDetails.status === 'APPROVED' && !blockCampaignActions(activeRowDetails));
  }

  const canEnableAnalytics = (activeRowDetails: any): boolean => {
    return (activeRowDetails !== null
      && (activeRowDetails.status === 'APPROVED' || activeRowDetails.status === 'COMPLETED' || activeRowDetails.status === 'STOPPED')
    );
  }

  const handleOpenModal = (value: boolean, action: string, message: string): void => {
    toggleStopBoostDenyTestAdCampaignPopup(value);
    toggleActionPopup(value);
    toggleActiveRejectPopup(value);
    if (action !== 'submit') {
      props.toggleActionList(false, activeTabName, null);
    }

    if (actionName === 'review' && action === 'submit') {
      history.push(`/campaign/edit/${activeRow.id}`);
    }
    if (value === false && action === 'submit') {
      setSuccessMessage(true);
      setSuccessMessageValue(message);
      props.toggleActionList(false, activeTabName, null, true, message);
      let tabValue, statusList;
      switch (activeRow.status) {
        case 'DRAFT':
          tabValue = 5;
          statusList = ['DRAFT'];
          break;
        case 'APPROVED':
          tabValue = 1;
          statusList = ['APPROVED'];
          break;
        case 'CANCELLED':
          if (activeTabName !== 2) {
            tabValue = 2;
            statusList = ['CANCELLED', 'COMPLETED', 'STOPPED'];
          } else {
            tabValue = activeTabName;
            statusList = props.campaignStatusList;
          }
          break;
        case 'STOPPED':
          if (activeTabName !== 1) {
            tabValue = 1;
            statusList = ['APPROVED'];
          } else {
            tabValue = activeTabName;
            statusList = props.campaignStatusList;
          }
          break;
      }

      if (actionName === 'clone') {
        tabValue = 5;
        statusList = ['DRAFT'];
      }

      getCampaignList(helper.manipulateQueryString(props.campaignStatusList, page - 1, 10, sortColumn, sortOrder, (actionName === 'archive' && searchText?.length !== 0) ? '' : encodeURIComponent(helper.trimString(searchText))));
      if (tabValue && (tabValue !== activeTabName)) {
        getCampaignList(helper.manipulateQueryString(statusList, 0, 10, sortColumn, sortOrder, (actionName === 'archive' && searchText?.length !== 0) ? '' : encodeURIComponent(helper.trimString(searchText))), tabValue);
      }
      if (actionName === 'archive') {
        if (searchText?.length !== 0) {
          setSearchText('');
        }
      }
      if (activeTabName !== 0) {
        getCampaignList(helper.manipulateQueryString(['APPROVED', 'CANCELLED', 'COMPLETED', 'STOPPED', 'READY', 'PENDING', 'REJECTED', 'DRAFT'], 0, 10, 'updatedAt', 'desc', ''), 0);
      }
    }
    setActiveRow(Object);
  }

  const onTriggerAction = (activeRowDetails: any, action: string): void => {
    if (action === 'edit') {
      Mixpanel.track('Edit Campaign Action', { page: 'Campaign List Page View' });
      history.push(`/campaign/edit/${activeRowDetails.id}`);
    } else {
      setActiveRow(activeRowDetails);
      actionListToggle(false);
      setActionName(action);
      if (action !== 'approve') {
        toggleActionPopup(true);
      } else {
        toggleActiveRejectPopup(true);
      }
    }
  }

  const searchCampaignOnEnter = (e): void => {
    if (e.key === "Enter") {
      searchCampaign();
    }
  }

  const setCanReadJobs = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return userHasPermission(['R_SCHEDULEDJOBS', 'R_SCHEDULEDJOBS_OWN', 'R_SCHEDULEDJOBS_OWN_ORG']);
    } else {
      return false;
    }
  }

  const setCanEdit = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return (userHasPermission(['U_CAMPAIGN', 'U_CAMPAIGN_OWN', 'U_CAMPAIGN_OWN_ORG']) && (helper.isMobile() === false));
    } else {
      return false;
    }
  }

  const setCanClone = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return (userHasPermission(['C_CAMPAIGN', 'C_CAMPAIGN_OWN', 'U_CAMPAIGN_OWN_ORG']) && (helper.isMobile() === false));
    } else {
      return false;
    }
  }

  const setCanSubmitForApprove = (activeRowDetails: any): boolean => {
    let canSubmitForApprove;
    if (activeRowDetails !== null) {
      switch (activeRowDetails.status) {
        case 'DRAFT':
          canSubmitForApprove = userHasPermission(['U_CAMPAIGN_STATUS_DRAFT_TO_PENDING', 'U_CAMPAIGN_STATUS_DRAFT_TO_PENDING_OWN', 'U_CAMPAIGN_STATUS_DRAFT_TO_PENDING_OWN_ORG']);
          break;
        case 'READY':
          canSubmitForApprove = userHasPermission(['U_CAMPAIGN_STATUS_READY_TO_PENDING', 'U_CAMPAIGN_STATUS_READY_TO_PENDING_OWN', 'U_CAMPAIGN_STATUS_READY_TO_PENDING_OWN_ORG']);
          break;
        case 'REJECTED':
          canSubmitForApprove = userHasPermission(['U_CAMPAIGN_STATUS_REJECTED_TO_PENDING', 'U_CAMPAIGN_STATUS_REJECTED_TO_PENDING_OWN', 'U_CAMPAIGN_STATUS_REJECTED_TO_PENDING_OWN_ORG']);
          break;
      }
      return canSubmitForApprove;
    } else {
      return false;
    }
  }

  const setCanCancel = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return userHasPermission(['U_CAMPAIGN_STATUS_DRAFT_TO_CANCELLED', 'U_CAMPAIGN_STATUS_DRAFT_TO_CANCELLED_OWN',
        'U_CAMPAIGN_STATUS_DRAFT_TO_CANCELLED_OWN_ORG', 'U_CAMPAIGN_STATUS_REJECTED_TO_CANCELLED', 'U_CAMPAIGN_STATUS_REJECTED_TO_CANCELLED_OWN',
        'U_CAMPAIGN_STATUS_REJECTED_TO_CANCELLED_OWN_ORG']);
    } else {
      return false;
    }
  }

  const setCanApprove = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return userHasPermission(['U_CAMPAIGN_STATUS_PENDING_TO_APPROVED', 'U_CAMPAIGN_STATUS_PENDING_TO_APPROVED_OWN', 'U_CAMPAIGN_STATUS_PENDING_TO_APPROVED_OWN_ORG']);
    } else {
      return false;
    }
  }

  const setCanReject = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return userHasPermission(['U_CAMPAIGN_STATUS_PENDING_TO_REJECTED', 'U_CAMPAIGN_STATUS_PENDING_TO_REJECTED_OWN', 'U_CAMPAIGN_STATUS_PENDING_TO_REJECTED_OWN_ORG']);
    } else {
      return false;
    }
  }

  const setCanStop = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return userHasPermission(['U_CAMPAIGN_STATUS_APPROVED_TO_STOPPED', 'U_CAMPAIGN_STATUS_APPROVED_TO_STOPPED_OWN', 'U_CAMPAIGN_STATUS_APPROVED_TO_STOPPED_OWN_ORG',
        'U_CAMPAIGN_STATUS_COMPLETED_TO_STOPPED', 'U_CAMPAIGN_STATUS_COMPLETED_TO_STOPPED_OWN', 'U_CAMPAIGN_STATUS_COMPLETED_TO_STOPPED_OWN_ORG']);
    } else {
      return false;
    }
  }

  const setCanDeleteJobs = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return userHasPermission(['U_SCHEDULEDJOBS', 'U_SCHEDULEDJOBS_OWN', 'U_SCHEDULEDJOBS_OWN_ORG']);
    } else {
      return false;
    }
  }

  const navigateToAnalytics = (row: any) => {
    let campaignType;
    if (!row.campaignType) {
      if (!!row.notificationImageContentId) {
        if (!!row.mainImageContentId || !!row.fullImageContentId) {
          campaignType = 'PUSH_INAPP';
        } else {
          campaignType = 'PUSH';
        }
      } else {
        campaignType = 'INAPP';
      }
    } else {
      campaignType = row.campaignType;
    }
    history.push(`/campaign/manage/${row.id}/${campaignType}`)
  };

  const blockCampaignActions = (activeRowDetails: any): boolean => {
    if (activeRowDetails.version === '1.0') {
      if (activeRowDetails.campaignObjective.fields[0] === 'displayOnlyAd') {
        return true;
      } else {
        if (!activeRowDetails.notificationImageContentId) {
          if (!!activeRowDetails.mainImageContentId || !!activeRowDetails.fullImageContentId) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  if (props.isShowLoader) {
    return (
      <div className='align-center'>
        <CircularProgress color="primary" />
      </div>
    )
  }

  return (
    <S.Container >
      {(searchText || campaignList.length !== 0 || (!searchText && prevSearchText !== '')) && <div className="search-box">
        <TextField
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          onKeyPress={searchCampaignOnEnter}
          type="text"
          variant="outlined"
          aria-describedby="desc-search-text"
          placeholder={t('SEARCH_CAMPAIGN')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon onClick={searchCampaign} />
              </InputAdornment>
            )
          }}
        />
      </div>}
      {campaignList.length !== 0 && <TableContainer component={Paper} className="overflow-table">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="sort-row">
                <span>{t('CAMPAIGN_NAME')}</span>
                <div className="sort">
                  <ArrowDropUpOutlinedIcon className={(sortColumn === 'name' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'name')} />
                  <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'name')} className={(sortColumn === 'name' && sortOrder === 'desc') ? 'active' : ''} />
                </div>
              </TableCell>
              <TableCell align="left" className="sort-row">
                <span>{t('CREATOR')}</span>
                <div className="sort">
                  <ArrowDropUpOutlinedIcon className={(sortColumn === 'userName' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'userName')} />
                  <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'userName')} className={(sortColumn === 'userName' && sortOrder === 'desc') ? 'active' : ''} />
                </div>
              </TableCell>
              <TableCell align="left" className="sort-row">
                <span>{t('START_DATE')}</span>
                <div className="sort">
                  <ArrowDropUpOutlinedIcon className={(sortColumn === 'startDate' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'startDate')} />
                  <ArrowDropDownOutlinedIcon className={(sortColumn === 'startDate' && sortOrder === 'desc') ? 'active' : ''} onClick={(e) => setTableColumn('desc', 'startDate')} />
                </div>
              </TableCell>
              <TableCell align="left" className="sort-row">
                <span>{t('END_DATE')}</span>
                <div className="sort">
                  <ArrowDropUpOutlinedIcon className={(sortColumn === 'endDate' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'endDate')} />
                  <ArrowDropDownOutlinedIcon className={(sortColumn === 'endDate' && sortOrder === 'desc') ? 'active' : ''} onClick={(e) => setTableColumn('desc', 'endDate')} />
                </div>
              </TableCell>
              <TableCell align="left">{t('STATUS')}</TableCell>
              {/* <TableCell align="right">{t('REACH')}</TableCell>
              <TableCell align="right">{t('TARGET')}</TableCell> */}
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaignList
              .map((row, index) => (
                <TableRow key={row.name} data-id={row.id}>
                  <TableCell scope="row">
                    <span className="camp-name">{row.name}</span>
                  </TableCell>
                  <TableCell align="left">{row?.userName}</TableCell>
                  <TableCell align="left">{row?.startDate}</TableCell>
                  <TableCell align="left">{row?.endDate}</TableCell>
                  <TableCell align="left" ><span className={row.status === 'APPROVED' ? 'label-badge active' : row?.status === 'DRAFT' ? 'label-badge draft' : row?.status === 'COMPLETED' ? 'label-badge completed' : row?.status === 'READY' ? 'label-badge ready' : 'label-badge pending'}>{helper.stringCapitalize(row.status)}</span></TableCell>
                  {/* <TableCell align="right">{row?.campaignBoost?.adsSentTo}</TableCell>
                  <TableCell align="right">{row?.purposeType === 'ENGAGEMENT' ? 'N/A' : row?.campaignBoost?.targetMetrics}</TableCell> */}
                  <TableCell align="right" >
                    <div className="more-action"><MoreVertIcon onClick={(e) => {
                      actionListToggle(isShowActionList => !isShowActionList);
                      props.toggleActionList(!isShowActionList, activeTabName, index);
                      setActionListIndex(index);
                    }} />
                      {(isShowActionList && actionListIndex === index) && <div className={(tableBottomHeight - document.getElementById(`${row.id}`)?.offsetTop > 280) ? 'more-action-dropdown' : "more-action-dropdown position-top"}>
                        <ul ref={ref}>
                          {canEnableEdit(row) && <li onClick={(e) => onTriggerAction(row, 'edit')}>{t('ACTION_EDIT')} <EditIcon /></li>}
                          {canEnableClone(row) && <li onClick={(e) => onTriggerAction(row, 'clone')}>{t('ACTION_DUPLICATE')} <FileCopyOutlinedIcon /></li>}
                          {canArchive(row) && <li onClick={(e) => onTriggerAction(row, 'archive')}>{t('ACTION_ARCHIVE')} <ArchiveOutlinedIcon /></li>}
                          {canEnableStop(row) && <li onClick={(e) => onStopBoostDenyTestAdCampaign(row, 'stop')}>{t('ACTION_STOP')} <ToggleOnOutlinedIcon /></li>}
                          {canEnableSubmitForApprove(row) && <li onClick={(e) => onTriggerAction(row, 'submitForApproval')}>{t('ACTION_SUBMIT_FOR_APPROVAL')}<SendIcon /></li>}
                          {canEnableCancel(row) && <li onClick={(e) => onTriggerAction(row, 'cancel')}>{t('CANCEL_BUTTON')}<BlockIcon /></li>}
                          {canEnableApprove(row) && <li onClick={(e) => onTriggerAction(row, 'approve')}>{t('ACTION_APPROVE_REJECT')}<ThumbUpIcon /></li>}
                          {/* {canEnableDeny(row) && <li onClick={(e) => onStopBoostDenyTestAdCampaign(row, 'deny')}>Deny<ThumbDownIcon /></li>} */}
                          {canEnableReview(row) && <li onClick={(e) => onTriggerAction(row, 'review')}>{t('ACTION_REVIEW')}<LockIcon /></li>}
                          {canEnableRelease(row) && <li onClick={(e) => onTriggerAction(row, 'release')}>{t('ACTION_RELEASE')}<LockOpenIcon /></li>}
                          {canEnableBoost(row) && <li onClick={(e) => onStopBoostDenyTestAdCampaign(row, 'boost')}>{t('ACTION_BOOST')} <ArrowUpwardIcon /></li>}
                          {canEnableJobs(row) && <li onClick={(e) => onStopBoostDenyTestAdCampaign(row, 'job')}>{t('ACTION_JOB')} <ListAltIcon /></li>}
                          {canEnableTestAd(row) && <li onClick={(e) => onStopBoostDenyTestAdCampaign(row, 'testAd')}>{t('ACTION_TEST_AD')} <NotificationsIcon /></li>}
                          {canEnableAnalytics(row) && <li onClick={() => navigateToAnalytics(row)}>{t('ACTION_ANALYTICS')} <TrendingUp /></li>}
                        </ul>

                      </div>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          {/* {showLoader && <div className="spinner-wrap"><Spinner color={"blue"} /></div>} */}
        </Table>
        <Pagination count={campaignData.totalPages} onChange={handleChangePage} page={page} />
        {isOpenStopBoostDenyTestAdCampaignPopup && <StopBoostDenyTestAdPopup activeRow={activeRow} handleOpen={handleOpenModal} actionName={actionName} canDeleteJob={setCanDeleteJobs(activeRow)} />}
        {isOpenActionPopup && <ActionPopup activeRow={activeRow} handleOpen={handleOpenModal} actionName={actionName} />}
        {isOpenActionRejectPopup && <ApproveRejectPopup activeRow={activeRow} handleOpen={handleOpenModal} actionName={actionName} />}
        {sucessMessage && (
          <SnackBarMessage open={sucessMessage} onClose={() => {
            setSuccessMessage(false);
            props.toggleActionList(false, activeTabName, null, false, '');
          }}
            severityType="success" message={succesMessageValue} />)}
      </TableContainer>}
      <Divider id="table-bottom" />
      {(!showBackdrop && campaignList.length === 0) && <div className="alert error lg">
        <div className="alert-message">{t('CAMPAIGN_LIST_ERROR')}</div>
      </div>}
      {campaignList.length > 0 && showBackdrop && <div className='pagination-loader-wrapper'>
        <div className="pagination-loader">
          <CircularProgress color="primary" />
        </div>
      </div>}
    </S.Container>
  );
}

export default CampaignManageTable;
