import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Tab,
  Tabs,
  Typography,
  Box
} from "@material-ui/core";
import * as S from "./CampaignManagePage.styles";
import CampaignManageTable from "./CampaignManageTable/CampaignManageTable";
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import CampaignManageConfigModal from './CampaignManageConfigModal/CampaignManageConfigModal';
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { CampaignData } from '../../Campaign.model';
import { useHistory } from "react-router-dom";
import { Breadcrumb } from "@dr-one/shared-component";
import { userHasPermission } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';
import { GlobalContext, initialState } from '../../context/globalState';
import { CAMPAIGN_ACTIONS } from "../../context/CampaignFormReducer";

function CampaignManage() {
  const [isShowConfigModal, toggleConfigModal] = useState(false);
  const [isShowCalendar, toggleCalendar] = useState(false);
  let history = useHistory();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [campaignDataActive, setCampaignDataActive] = React.useState<CampaignData>(Object);
  const [campaignListActive, setCampaignListActive] = React.useState([]);
  const [campaignDataCompleted, setCampaignDataCompleted] = React.useState<CampaignData>(Object);
  const [campaignListCompleted, setCampaignListCompleted] = React.useState([]);
  const [campaignDataPending, setCampaignDataPending] = React.useState<CampaignData>(Object);
  const [campaignListPending, setCampaignListPending] = React.useState([]);
  const [campaignDataDraft, setCampaignDataDraft] = React.useState<CampaignData>(Object);
  const [campaignListDraft, setCampaignListDraft] = React.useState([]);
  const [campaignDataAll, setCampaignDataAll] = React.useState<CampaignData>(Object);
  const [campaignListAll, setCampaignListAll] = React.useState([]);
  const [campaignDataReady, setCampaignDataReady] = React.useState<CampaignData>(Object);
  const [campaignListReady, setCampaignListReady] = React.useState([]);
  const [pageActive, setPageActive] = React.useState(1);
  const [pageAll, setPageAll] = React.useState(1);
  const [pageCompleted, setPageCompleted] = React.useState(1);
  const [pagePending, setPagePending] = React.useState(1);
  const [pageDraft, setPageDraft] = React.useState(1);
  const [pageReady, setPageReady] = React.useState(1);
  const [sortColumnAll, setSortColumnAll] = React.useState('updatedAt');
  const [sortOrderAll, setSortOrderAll] = React.useState('desc');
  const [sortColumnActive, setSortColumnActive] = React.useState('updatedAt');
  const [sortOrderActive, setSortOrderActive] = React.useState('desc');
  const [sortColumnCompleted, setSortColumnCompleted] = React.useState('updatedAt');
  const [sortOrderCompleted, setSortOrderCompleted] = React.useState('desc');
  const [sortColumnPending, setSortColumnPending] = React.useState('updatedAt');
  const [sortOrderPending, setSortOrderPending] = React.useState('desc');
  const [sortColumnDraft, setSortColumnDraft] = React.useState('updatedAt');
  const [sortOrderDraft, setSortOrderDraft] = React.useState('desc');
  const [sortColumnReady, setSortColumnReady] = React.useState('updatedAt');
  const [sortOrderReady, setSortOrderReady] = React.useState('desc');
  const [searchTextAll, setSearchTextAll] = React.useState('');
  const [searchTextActive, setSearchTextActive] = React.useState('');
  const [searchTextCompleted, setSearchTextCompleted] = React.useState('');
  const [searchTextPending, setSearchTextPending] = React.useState('');
  const [searchTextDraft, setSearchTextDraft] = React.useState('');
  const [searchTextReady, setSearchTextReady] = React.useState('');
  const [isShowLoaderActive, toggleLoaderActive] = React.useState(false);
  const [isShowLoaderCompleted, toggleLoaderCompleted] = React.useState(false);
  const [isShowLoaderAll, toggleLoaderAll] = React.useState(false);
  const [isShowLoaderReady, toggleLoaderReady] = React.useState(false);
  const [isShowLoaderPending, toggleLoaderPending] = React.useState(false);
  const [isShowLoaderDraft, toggleLoaderDraft] = React.useState(false);
  const [actionListStatusAll, setActionListStatusAll] = React.useState(false);
  const [actionListStatusActive, setActionListStatusActive] = React.useState(false);
  const [actionListStatusCompleted, setActionListStatusCompleted] = React.useState(false);
  const [actionListStatusPending, setActionListStatusPending] = React.useState(false);
  const [actionListStatusReady, setActionListStatusReady] = React.useState(false);
  const [actionListStatusDraft, setActionListStatusDraft] = React.useState(false);
  const [actionListIndexAll, setActionListIndexAll] = React.useState(null);
  const [actionListIndexActive, setActionListIndexActive] = React.useState(null);
  const [actionListIndexCompleted, setActionListIndexCompleted] = React.useState(null);
  const [actionListIndexPending, setActionListIndexPending] = React.useState(null);
  const [actionListIndexReady, setActionListIndexReady] = React.useState(null);
  const [actionListIndexDraft, setActionListIndexDraft] = React.useState(null);
  const [sucessMessageAll, setSuccessMessageAll] = useState(false);
  const [succesMessageValueAll, setSuccessMessageValueAll] = useState('');
  const [sucessMessageReady, setSuccessMessageReady] = useState(false);
  const [succesMessageValueReady, setSuccessMessageValueReady] = useState('');
  const [sucessMessageActive, setSuccessMessageActive] = useState(false);
  const [succesMessageValueActive, setSuccessMessageValueActive] = useState('');
  const [sucessMessageCompleted, setSuccessMessageCompleted] = useState(false);
  const [succesMessageValueCompleted, setSuccessMessageValueCompleted] = useState('');
  const [sucessMessagePending, setSuccessMessagePending] = useState(false);
  const [succesMessageValuePending, setSuccessMessageValuePending] = useState('');
  const [sucessMessageDraft, setSuccessMessageDraft] = useState(false);
  const [succesMessageValueDraft, setSuccessMessageValueDraft] = useState('');

  const { t } = useTranslation();
  const hierarchyList = [t('CAMPAIGN_MANAGEMENT'), t('CAMPAIGN_LIST')];
  const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
  const { dispatch, state } = useContext(GlobalContext);

  useEffect(() => {
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
      payload: {
        campaignPayload: initialState.formValues, currentPageName: 'registration',
        campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
        campaignStepsArray: ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS']
      }
    })
    const queryStringActive = helper.manipulateQueryString(['APPROVED'], 0, 10, 'updatedAt', 'desc', '');
    const queryStringCompleted = helper.manipulateQueryString(['CANCELLED', 'COMPLETED', 'STOPPED'], 0, 10, 'updatedAt', 'desc', '');
    const queryStringPending = helper.manipulateQueryString(['PENDING', 'REJECTED'], 0, 10, 'updatedAt', 'desc', '');
    const queryStringReady = helper.manipulateQueryString(['READY'], 0, 10, 'updatedAt', 'desc', '');
    const queryStringDraft = helper.manipulateQueryString(['DRAFT'], 0, 10, 'updatedAt', 'desc', '');
    const queryStringAll = helper.manipulateQueryString(['APPROVED', 'CANCELLED', 'COMPLETED', 'STOPPED', 'READY', 'PENDING', 'REJECTED', 'DRAFT'], 0, 10, 'updatedAt', 'desc', '');
    toggleLoaderAll(true);
    toggleLoaderCompleted(true);
    toggleLoaderActive(true);
    toggleLoaderDraft(true);
    toggleLoaderPending(true);
    toggleLoaderReady(true);
    apiDashboard
      .get(`campaign-mgmt-api/campaigns/v5/organization/${organizationId}${queryStringAll}`)
      .then(response => {
        toggleLoaderAll(false);
        setCampaignDataAll(response.data.data);
        setCampaignListAll(response.data.data.content);
        setActionListStatusCompleted(actionListStatusCompleted => actionListStatusCompleted);
        setActionListStatusActive(actionListStatusActive => actionListStatusActive);
        setActionListStatusPending(actionListStatusPending => actionListStatusPending);
        setActionListStatusReady(actionListStatusReady => actionListStatusReady);
        setActionListStatusDraft(actionListStatusDraft => actionListStatusDraft);
        setActionListStatusAll(actionListStatusAll => actionListStatusAll);
        setActionListIndexAll(actionListIndexAll => actionListIndexAll);
        setActionListIndexCompleted(actionListIndexCompleted => actionListIndexCompleted);
        setActionListIndexActive(actionListIndexActive => actionListIndexActive);
        setActionListIndexPending(actionListIndexPending => actionListIndexPending);
        setActionListIndexReady(actionListIndexReady => actionListIndexReady);
        setActionListIndexDraft(actionListIndexDraft => actionListIndexDraft);
      }, error => {
        toggleLoaderAll(false);
        setCampaignDataAll(Object);
        setCampaignListAll([]);
        setActionListStatusCompleted(actionListStatusCompleted => actionListStatusCompleted);
        setActionListStatusActive(actionListStatusActive => actionListStatusActive);
        setActionListStatusPending(actionListStatusPending => actionListStatusPending);
        setActionListStatusReady(actionListStatusReady => actionListStatusReady);
        setActionListStatusDraft(actionListStatusDraft => actionListStatusDraft);
        setActionListStatusAll(false);
        setActionListIndexAll(null);
        setActionListIndexCompleted(actionListIndexCompleted => actionListIndexCompleted);
        setActionListIndexActive(actionListIndexActive => actionListIndexActive);
        setActionListIndexPending(actionListIndexPending => actionListIndexPending);
        setActionListIndexReady(actionListIndexReady => actionListIndexReady);
        setActionListIndexDraft(actionListIndexDraft => actionListIndexDraft);
      });
    apiDashboard
      .get(`campaign-mgmt-api/campaigns/v5/organization/${organizationId}${queryStringActive}`)
      .then(response => {
        toggleLoaderActive(false);
        setCampaignDataActive(response.data.data);
        setCampaignListActive(response.data.data.content);
        setActionListStatusAll(actionListStatusAll => actionListStatusAll);
        setActionListStatusCompleted(actionListStatusCompleted => actionListStatusCompleted);
        setActionListStatusPending(actionListStatusPending => actionListStatusPending);
        setActionListStatusReady(actionListStatusReady => actionListStatusReady);
        setActionListStatusDraft(actionListStatusDraft => actionListStatusDraft);
        setActionListStatusActive(actionListStatusActive => actionListStatusActive);
        setActionListIndexAll(actionListIndexAll => actionListIndexAll);
        setActionListIndexCompleted(actionListIndexCompleted => actionListIndexCompleted);
        setActionListIndexActive(actionListIndexActive => actionListIndexActive);
        setActionListIndexPending(actionListIndexPending => actionListIndexPending);
        setActionListIndexReady(actionListIndexReady => actionListIndexReady);
        setActionListIndexDraft(actionListIndexDraft => actionListIndexDraft);
      }, error => {
        toggleLoaderActive(false);
        setCampaignDataActive(Object);
        setCampaignListActive([]);
        setActionListStatusAll(actionListStatusAll => actionListStatusAll);
        setActionListStatusCompleted(actionListStatusCompleted => actionListStatusCompleted);
        setActionListStatusPending(actionListStatusPending => actionListStatusPending);
        setActionListStatusReady(actionListStatusReady => actionListStatusReady);
        setActionListStatusDraft(actionListStatusDraft => actionListStatusDraft);
        setActionListStatusActive(false);
        setActionListIndexAll(actionListIndexAll => actionListIndexAll);
        setActionListIndexCompleted(actionListIndexCompleted => actionListIndexCompleted);
        setActionListIndexActive(null);
        setActionListIndexPending(actionListIndexPending => actionListIndexPending);
        setActionListIndexReady(actionListIndexReady => actionListIndexReady);
        setActionListIndexDraft(actionListIndexDraft => actionListIndexDraft);
      });
    apiDashboard
      .get(`campaign-mgmt-api/campaigns/v5/organization/${organizationId}${queryStringCompleted}`)
      .then(response => {
        toggleLoaderCompleted(false);
        setCampaignDataCompleted(response.data.data);
        setCampaignListCompleted(response.data.data.content);
        setActionListStatusAll(actionListStatusAll => actionListStatusAll);
        setActionListStatusActive(actionListStatusActive => actionListStatusActive);
        setActionListStatusPending(actionListStatusPending => actionListStatusPending);
        setActionListStatusReady(actionListStatusReady => actionListStatusReady);
        setActionListStatusDraft(actionListStatusDraft => actionListStatusDraft);
        setActionListStatusCompleted(actionListStatusCompleted => actionListStatusCompleted);
        setActionListIndexAll(actionListIndexAll => actionListIndexAll);
        setActionListIndexCompleted(actionListIndexCompleted => actionListIndexCompleted);
        setActionListIndexActive(actionListIndexActive => actionListIndexActive);
        setActionListIndexPending(actionListIndexPending => actionListIndexPending);
        setActionListIndexReady(actionListIndexReady => actionListIndexReady);
        setActionListIndexDraft(actionListIndexDraft => actionListIndexDraft);
      }, error => {
        toggleLoaderCompleted(false);
        setCampaignDataCompleted(Object);
        setCampaignListCompleted([]);
        setActionListStatusAll(actionListStatusAll => actionListStatusAll);
        setActionListStatusActive(actionListStatusActive => actionListStatusActive);
        setActionListStatusPending(actionListStatusPending => actionListStatusPending);
        setActionListStatusReady(actionListStatusReady => actionListStatusReady);
        setActionListStatusDraft(actionListStatusDraft => actionListStatusDraft);
        setActionListStatusCompleted(false);
        setActionListIndexAll(actionListIndexAll => actionListIndexAll);
        setActionListIndexCompleted(null);
        setActionListIndexActive(actionListIndexActive => actionListIndexActive);
        setActionListIndexPending(actionListIndexPending => actionListIndexPending);
        setActionListIndexReady(actionListIndexReady => actionListIndexReady);
        setActionListIndexDraft(actionListIndexDraft => actionListIndexDraft);
      });
    apiDashboard
      .get(`campaign-mgmt-api/campaigns/v5/organization/${organizationId}${queryStringPending}`)
      .then(response => {
        toggleLoaderPending(false);
        setCampaignDataPending(response.data.data);
        setCampaignListPending(response.data.data.content);
        setActionListStatusCompleted(actionListStatusCompleted => actionListStatusCompleted);
        setActionListStatusActive(actionListStatusActive => actionListStatusActive);
        setActionListStatusPending(actionListStatusPending => actionListStatusPending);
        setActionListStatusReady(actionListStatusReady => actionListStatusReady);
        setActionListStatusDraft(actionListStatusDraft => actionListStatusDraft);
        setActionListStatusAll(actionListStatusAll => actionListStatusAll);
        setActionListIndexAll(actionListIndexAll => actionListIndexAll);
        setActionListIndexCompleted(actionListIndexCompleted => actionListIndexCompleted);
        setActionListIndexActive(actionListIndexActive => actionListIndexActive);
        setActionListIndexPending(actionListIndexPending => actionListIndexPending);
        setActionListIndexReady(actionListIndexReady => actionListIndexReady);
        setActionListIndexDraft(actionListIndexDraft => actionListIndexDraft);
      }, error => {
        toggleLoaderPending(false);
        setCampaignDataPending(Object);
        setCampaignListPending([]);
        setActionListStatusCompleted(actionListStatusCompleted => actionListStatusCompleted);
        setActionListStatusActive(actionListStatusActive => actionListStatusActive);
        setActionListStatusPending(false);
        setActionListStatusReady(actionListStatusReady => actionListStatusReady);
        setActionListStatusDraft(actionListStatusDraft => actionListStatusDraft);
        setActionListStatusAll(actionListStatusAll => actionListStatusAll);
        setActionListIndexAll(actionListIndexAll => actionListIndexAll);
        setActionListIndexCompleted(actionListIndexCompleted => actionListIndexCompleted);
        setActionListIndexActive(actionListIndexActive => actionListIndexActive);
        setActionListIndexPending(null);
        setActionListIndexReady(actionListIndexReady => actionListIndexReady);
        setActionListIndexDraft(actionListIndexDraft => actionListIndexDraft);
      });
    apiDashboard
      .get(`campaign-mgmt-api/campaigns/v5/organization/${organizationId}${queryStringReady}`)
      .then(response => {
        toggleLoaderReady(false);
        setCampaignDataReady(response.data.data);
        setCampaignListReady(response.data.data.content);
        setActionListStatusCompleted(actionListStatusCompleted => actionListStatusCompleted);
        setActionListStatusActive(actionListStatusActive => actionListStatusActive);
        setActionListStatusPending(actionListStatusPending => actionListStatusPending);
        setActionListStatusReady(actionListStatusReady => actionListStatusReady);
        setActionListStatusDraft(actionListStatusDraft => actionListStatusDraft);
        setActionListStatusAll(actionListStatusAll => actionListStatusAll);
        setActionListIndexAll(actionListIndexAll => actionListIndexAll);
        setActionListIndexCompleted(actionListIndexCompleted => actionListIndexCompleted);
        setActionListIndexActive(actionListIndexActive => actionListIndexActive);
        setActionListIndexPending(actionListIndexPending => actionListIndexPending);
        setActionListIndexReady(actionListIndexReady => actionListIndexReady);
        setActionListIndexDraft(actionListIndexDraft => actionListIndexDraft);
      }, error => {
        toggleLoaderReady(false);
        setCampaignDataReady(Object);
        setCampaignListReady([]);
        setActionListStatusCompleted(actionListStatusCompleted => actionListStatusCompleted);
        setActionListStatusActive(actionListStatusActive => actionListStatusActive);
        setActionListStatusPending(actionListStatusPending => actionListStatusPending);
        setActionListStatusReady(false);
        setActionListStatusDraft(actionListStatusDraft => actionListStatusDraft);
        setActionListStatusAll(actionListStatusAll => actionListStatusAll);
        setActionListIndexAll(actionListIndexAll => actionListIndexAll);
        setActionListIndexCompleted(actionListIndexCompleted => actionListIndexCompleted);
        setActionListIndexActive(actionListIndexActive => actionListIndexActive);
        setActionListIndexPending(actionListIndexPending => actionListIndexPending);
        setActionListIndexReady(null);
        setActionListIndexDraft(actionListIndexDraft => actionListIndexDraft);
      });
    apiDashboard
      .get(`campaign-mgmt-api/campaigns/v5/organization/${organizationId}${queryStringDraft}`)
      .then(response => {
        toggleLoaderDraft(false);
        setCampaignDataDraft(response.data.data);
        setCampaignListDraft(response.data.data.content);
        setActionListStatusCompleted(actionListStatusCompleted => actionListStatusCompleted);
        setActionListStatusActive(actionListStatusActive => actionListStatusActive);
        setActionListStatusPending(actionListStatusPending => actionListStatusPending);
        setActionListStatusReady(actionListStatusReady => actionListStatusReady);
        setActionListStatusDraft(actionListStatusDraft => actionListStatusDraft);
        setActionListStatusAll(actionListStatusAll => actionListStatusAll);
        setActionListIndexAll(actionListIndexAll => actionListIndexAll);
        setActionListIndexCompleted(actionListIndexCompleted => actionListIndexCompleted);
        setActionListIndexActive(actionListIndexActive => actionListIndexActive);
        setActionListIndexPending(actionListIndexPending => actionListIndexPending);
        setActionListIndexReady(actionListIndexReady => actionListIndexReady);
        setActionListIndexDraft(actionListIndexDraft => actionListIndexDraft);
      }, error => {
        toggleLoaderDraft(false);
        setCampaignDataDraft(Object);
        setCampaignListDraft([]);
        setActionListStatusCompleted(actionListStatusCompleted => actionListStatusCompleted);
        setActionListStatusActive(actionListStatusActive => actionListStatusActive);
        setActionListStatusPending(actionListStatusPending => actionListStatusPending);
        setActionListStatusReady(actionListStatusReady => actionListStatusReady);
        setActionListStatusDraft(false);
        setActionListStatusAll(actionListStatusAll => actionListStatusAll);
        setActionListIndexAll(actionListIndexAll => actionListIndexAll);
        setActionListIndexCompleted(actionListIndexCompleted => actionListIndexCompleted);
        setActionListIndexActive(actionListIndexActive => actionListIndexActive);
        setActionListIndexPending(actionListIndexPending => actionListIndexPending);
        setActionListIndexReady(actionListIndexReady => actionListIndexReady);
        setActionListIndexDraft(null);
      });
    Mixpanel.track('Campaign List Page View');
  }, []);

  function getCampaignActiveListForReloadTab() {
    const queryStringActiveForTabReload = helper.manipulateQueryString(['APPROVED'], pageActive - 1, 10, sortColumnActive, sortOrderActive, searchTextActive);
    apiDashboard.get(`campaign-mgmt-api/campaigns/v3/organization/${organizationId}${queryStringActiveForTabReload}`).then((response) => {
      setCampaignDataActive(response.data.data);
      setCampaignListActive(response.data.data.content);
    }).catch((e) => {
      console.log(helper.getErrorMessage(e));
    })
  }
  function getCampaignPendingListForReloadTab() {
    const queryStringPendingForTabReload = helper.manipulateQueryString(['PENDING', 'REJECTED'], pagePending - 1, 10, sortColumnPending, sortOrderPending, searchTextPending);
    apiDashboard.get(`campaign-mgmt-api/campaigns/v3/organization/${organizationId}${queryStringPendingForTabReload}`).then((response) => {
      setCampaignDataPending(response.data.data);
      setCampaignListPending(response.data.data.content);
    }).catch((e) => {
      console.log(helper.getErrorMessage(e));
    })
  }
  function getCampaignAllListForReloadTab() {
    const queryStringAllForTabReload = helper.manipulateQueryString(['APPROVED', 'CANCELLED', 'COMPLETED', 'STOPPED', 'READY', 'PENDING', 'REJECTED', 'DRAFT'], pageAll - 1, 10, sortColumnAll, sortOrderAll, searchTextAll);
    apiDashboard.get(`campaign-mgmt-api/campaigns/v3/organization/${organizationId}${queryStringAllForTabReload}`).then((response) => {
      setCampaignDataAll(response.data.data);
      setCampaignListAll(response.data.data.content);
    }).catch((e) => {
      console.log(helper.getErrorMessage(e));
    })
  }
  function getCampaignCompleteListForReloadTab() {
    const queryStringCompletedForTabReload = helper.manipulateQueryString(['CANCELLED', 'COMPLETED', 'STOPPED'], pageCompleted - 1, 10, sortColumnCompleted, sortOrderCompleted, searchTextCompleted);
    apiDashboard.get(`campaign-mgmt-api/campaigns/v3/organization/${organizationId}${queryStringCompletedForTabReload}`).then((response) => {
      setCampaignDataCompleted(response.data.data);
      setCampaignListCompleted(response.data.data.content);
    }).catch((e) => {
      console.log(helper.getErrorMessage(e));
    })
  }
  function getCampaignReadyListForReloadTab() {
    const queryStringReadyForTabReload = helper.manipulateQueryString(['READY'], pageReady - 1, 10, sortColumnReady, sortOrderReady, searchTextReady);
    apiDashboard.get(`campaign-mgmt-api/campaigns/v3/organization/${organizationId}${queryStringReadyForTabReload}`).then((response) => {
      setCampaignDataReady(response.data.data);
      setCampaignListReady(response.data.data.content);
    }).catch((e) => {
      console.log(helper.getErrorMessage(e));
    })
  }
  const reloadAfterStatusChange = (): void => {
    //Refer to ready tab
    if (state.reloadTab && tabIndex === 4) {
      getCampaignPendingListForReloadTab()
      getCampaignAllListForReloadTab()
    }
    //refer to waiting tab
    else if (state.reloadTab && tabIndex === 3) {
      getCampaignActiveListForReloadTab()
      getCampaignAllListForReloadTab()
    }
    //refer to complete tab
    else if (state.reloadTab && tabIndex === 2) {
      getCampaignAllListForReloadTab()
    }
    //refer to the active tab
    else if (state.reloadTab && tabIndex === 1) {
      getCampaignCompleteListForReloadTab()
      getCampaignAllListForReloadTab()
    }
    //refer to the all campaigns tab
    else if (state.reloadTab && tabIndex === 0) {
      if (state.status === 'CANCELLED') {
        getCampaignCompleteListForReloadTab()
      }
      else if (state.status === 'PENDING') {
        getCampaignPendingListForReloadTab()
        getCampaignReadyListForReloadTab()
      }
      else if (state.status === 'REJECTED') {
        getCampaignPendingListForReloadTab()
      }
      else if (state.status === 'APPROVED') {
        getCampaignActiveListForReloadTab()
        getCampaignReadyListForReloadTab()
        getCampaignPendingListForReloadTab()
      }
      else if (state.status === 'STOPPED') {
        getCampaignPendingListForReloadTab()
      } else {
        getCampaignPendingListForReloadTab()
        getCampaignActiveListForReloadTab()
        getCampaignCompleteListForReloadTab()
        getCampaignAllListForReloadTab()
        getCampaignReadyListForReloadTab()
      }
    }
  }

  useEffect(() => {
    if (state.reloadTab) {
      reloadAfterStatusChange()
    }
    const modifiedPayload = Object.assign({}, state);
    modifiedPayload['reloadTab'] = false
    dispatch({
      type: "TAB_RELOAD",
      payload: modifiedPayload
    })
  }, [state.reloadTab])

  const configModalToggle = (): void => {
    toggleConfigModal(isShowConfigModal => !isShowConfigModal);
  }

  const handleOpenModal = (value: boolean): void => {
    toggleConfigModal(value);
  }

  const calendarToggle = (): void => {
    toggleCalendar(isShowCalendar => !isShowCalendar);
  }

  const handleChange = (event: any, newValue: number): void => {
    setTabIndex(newValue);
  };

  const a11yProps = (index: number): any => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const TabPanel = (props: any): any => {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {
          value === index && (
            <Box p={3}>
              <Typography>{children}</Typography>
            </Box>)
        }
      </Typography>
    );
  }

  const update = (campaignData: any, campaignList: any, tabName: number, page: number,
    sortColumn: string, sortOrder: string, searchText: string, isShowSuccessMessage: boolean, successMessage: string): void => {
    if (tabName === 0) {
      setCampaignDataAll(campaignData);
      setCampaignListAll(campaignList);
      setPageAll(page + 1);
      setSortOrderAll(sortOrder);
      setSortColumnAll(sortColumn);
      setSearchTextAll(searchText);
      setSuccessMessageValueAll(successMessage);
      setSuccessMessageAll(isShowSuccessMessage);
    } else if (tabName === 1) {
      setCampaignDataActive(campaignData);
      setCampaignListActive(campaignList);
      setPageActive(page + 1);
      setSortOrderActive(sortOrder);
      setSortColumnActive(sortColumn);
      setSearchTextActive(searchText);
      setSuccessMessageValueActive(successMessage);
      setSuccessMessageActive(isShowSuccessMessage);
    } else if (tabName === 2) {
      setCampaignDataCompleted(campaignData);
      setCampaignListCompleted(campaignList);
      setPageCompleted(page + 1);
      setSortOrderCompleted(sortOrder);
      setSortColumnCompleted(sortColumn);
      setSearchTextCompleted(searchText);
      setSuccessMessageValueCompleted(successMessage);
      setSuccessMessageCompleted(isShowSuccessMessage);
    } else if (tabName === 3) {
      setCampaignDataPending(campaignData);
      setCampaignListPending(campaignList);
      setPagePending(page + 1);
      setSortOrderPending(sortOrder);
      setSortColumnPending(sortColumn);
      setSearchTextPending(searchText);
      setSuccessMessageValuePending(successMessage);
      setSuccessMessagePending(isShowSuccessMessage);
    } else if (tabName === 4) {
      setCampaignDataReady(campaignData);
      setCampaignListReady(campaignList);
      setPageReady(page + 1);
      setSortOrderReady(sortOrder);
      setSortColumnReady(sortColumn);
      setSearchTextReady(searchText);
      setSuccessMessageValueReady(successMessage);
      setSuccessMessageReady(isShowSuccessMessage);
    } else {
      setCampaignDataDraft(campaignData);
      setCampaignListDraft(campaignList);
      setPageDraft(page + 1);
      setSortOrderDraft(sortOrder);
      setSortColumnDraft(sortColumn);
      setSearchTextDraft(searchText);
      setSuccessMessageValueDraft(successMessage);
      setSuccessMessageDraft(isShowSuccessMessage);
    }
  }

  const updateTabOnAction = (tabValue: number): void => {
    setTabIndex(tabValue);
  }

  const redirectToCreateCampaign = (): void => {
    sessionStorage.setItem('enablePrompt', 'false')
    Mixpanel.track('Create Campaign Action', { page: 'Campaign List Page View' });
    history.push('/campaign/new');
  }

  const onActionListToggle = (actionStatus: boolean, tabName: number, rowNumber: number,
    isShowSuccessMessage: boolean = false, successMessage: string = '') => {
    if (tabName === 0) {
      setActionListStatusAll(actionStatus);
      setActionListIndexAll(rowNumber);
      setSuccessMessageValueAll(successMessage);
      setSuccessMessageAll(isShowSuccessMessage);
    } else if (tabName === 1) {
      setActionListStatusActive(actionStatus);
      setActionListIndexActive(rowNumber);
      setSuccessMessageValueActive(successMessage);
      setSuccessMessageActive(isShowSuccessMessage);
    } else if (tabName === 2) {
      setActionListStatusCompleted(actionStatus);
      setActionListIndexCompleted(rowNumber);
      setSuccessMessageValueCompleted(successMessage);
      setSuccessMessageCompleted(isShowSuccessMessage);
    } else if (tabName === 3) {
      setActionListStatusPending(actionStatus);
      setActionListIndexPending(rowNumber);
      setSuccessMessageValuePending(successMessage);
      setSuccessMessagePending(isShowSuccessMessage);
    } else if (tabName === 4) {
      setActionListStatusReady(actionStatus);
      setActionListIndexReady(rowNumber);
      setSuccessMessageValueReady(successMessage);
      setSuccessMessageReady(isShowSuccessMessage);
    } else if (tabName === 5) {
      setActionListStatusDraft(actionStatus);
      setActionListIndexDraft(rowNumber);
      setSuccessMessageValueDraft(successMessage);
      setSuccessMessageDraft(isShowSuccessMessage);
    }

  }

  return (
    <S.Container className="inner-container">
      <Breadcrumb hierarchy={hierarchyList} />
      <div className="mb-20">
        <div>
          <h1 className="page-title">{t('CAMPAIGN_MANAGEMENT')}</h1>
        </div>
        {userHasPermission(['C_CAMPAIGN', 'C_CAMPAIGN_OWN_ORG']) && <div className="header-main-btn">
          <Button onClick={redirectToCreateCampaign} variant="contained" color="primary" className="button-lg dark-blue" startIcon={<AddOutlinedIcon fontSize="small" />}>{t('CREATE_CAMPAIGN')}</Button>
        </div>}
      </div>

      <div className="tabs-wrapper">
        <Tabs value={tabIndex} onChange={handleChange} aria-label="simple tabs example" scrollButtons="auto"
          textColor="secondary">
          <Tab label={t('ALL_CAMPAIGNS')} {...a11yProps(0)} className={tabIndex === 0 ? 'cm-btn-campaign' : ''} />
          <Tab label={t('ACTIVE')} {...a11yProps(1)} className={tabIndex === 1 ? 'cm-btn-active' : ''} />
          <Tab label={t('COMPLETED')} {...a11yProps(2)} className={tabIndex === 2 ? 'cm-btn-completed' : ''} />
          <Tab label={t('WAITING_FOR_APPROVAL')} {...a11yProps(3)} className={tabIndex === 3 ? 'cm-btn-waiting' : ''} />
          <Tab label={t('CAMPAIGNS_CREATED')} {...a11yProps(4)} className={tabIndex === 4 ? 'cm-btn-campaign' : ''} />
          <Tab label={t('DRAFT')} {...a11yProps(5)} className={tabIndex === 5 ? 'cm-btn-draft' : ''} />
        </Tabs>
        {/* <div className="action-icons-container">
          <div className="icon-wrap">
                            <EventTwoToneIcon onClick={calendarToggle} />
                        </div>
          <div className="icon-wrap">
            <SettingsTwoToneIcon onClick={configModalToggle} />
          </div>
        </div> */}
      </div>
      <div className="table-search-wrap">
        <TabPanel value={tabIndex} index={0}>
          <CampaignManageTable campaignStatusList={['APPROVED', 'CANCELLED', 'COMPLETED', 'STOPPED', 'READY', 'PENDING', 'REJECTED', 'DRAFT']} active={tabIndex === 0}
            campaignData={campaignDataAll} campaignList={campaignListAll} updateCampaignDetails={update} tabName={tabIndex} page={pageAll}
            sortOrder={sortOrderAll} sortColumn={sortColumnAll} searchText={searchTextAll} isShowLoader={isShowLoaderAll} updateTab={updateTabOnAction}
            actionListStatus={actionListStatusAll} toggleActionList={onActionListToggle} actionListIndex={actionListIndexAll} sucessMessage={sucessMessageAll} succesMessageValue={succesMessageValueAll} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <CampaignManageTable campaignStatusList={['APPROVED']} active={tabIndex === 1}
            campaignData={campaignDataActive} campaignList={campaignListActive} updateCampaignDetails={update} tabName={tabIndex} page={pageActive}
            sortOrder={sortOrderActive} sortColumn={sortColumnActive} searchText={searchTextActive} isShowLoader={isShowLoaderActive} updateTab={updateTabOnAction}
            actionListStatus={actionListStatusActive} toggleActionList={onActionListToggle} actionListIndex={actionListIndexActive} sucessMessage={sucessMessageActive} succesMessageValue={succesMessageValueActive} />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <CampaignManageTable campaignStatusList={['CANCELLED', 'COMPLETED', 'STOPPED']} active={tabIndex === 2}
            campaignData={campaignDataCompleted} campaignList={campaignListCompleted} updateCampaignDetails={update} tabName={tabIndex} page={pageCompleted}
            sortOrder={sortOrderCompleted} sortColumn={sortColumnCompleted} searchText={searchTextCompleted} isShowLoader={isShowLoaderCompleted} updateTab={updateTabOnAction}
            actionListStatus={actionListStatusCompleted} toggleActionList={onActionListToggle} actionListIndex={actionListIndexCompleted} sucessMessage={sucessMessageCompleted} succesMessageValue={succesMessageValueCompleted} />
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          <CampaignManageTable campaignStatusList={['PENDING', 'REJECTED']} active={tabIndex === 3}
            campaignData={campaignDataPending} campaignList={campaignListPending} updateCampaignDetails={update} tabName={tabIndex} page={pagePending}
            sortOrder={sortOrderPending} sortColumn={sortColumnPending} searchText={searchTextPending} isShowLoader={isShowLoaderPending} updateTab={updateTabOnAction}
            actionListStatus={actionListStatusPending} toggleActionList={onActionListToggle} actionListIndex={actionListIndexPending} sucessMessage={sucessMessagePending} succesMessageValue={succesMessageValuePending} />
        </TabPanel>
        <TabPanel value={tabIndex} index={4}>
          <CampaignManageTable campaignStatusList={['READY']} active={tabIndex === 4}
            campaignData={campaignDataReady} campaignList={campaignListReady} updateCampaignDetails={update} tabName={tabIndex} page={pageReady}
            sortOrder={sortOrderReady} sortColumn={sortColumnReady} searchText={searchTextReady} isShowLoader={isShowLoaderReady} updateTab={updateTabOnAction}
            actionListStatus={actionListStatusReady} toggleActionList={onActionListToggle} actionListIndex={actionListIndexReady} sucessMessage={sucessMessageReady} succesMessageValue={succesMessageValueReady} />
        </TabPanel>
        <TabPanel value={tabIndex} index={5}>
          <CampaignManageTable campaignStatusList={['DRAFT']} active={tabIndex === 5}
            campaignData={campaignDataDraft} campaignList={campaignListDraft} updateCampaignDetails={update} tabName={tabIndex} page={pageDraft}
            sortOrder={sortOrderDraft} sortColumn={sortColumnDraft} searchText={searchTextDraft} isShowLoader={isShowLoaderDraft} updateTab={updateTabOnAction}
            actionListStatus={actionListStatusDraft} toggleActionList={onActionListToggle} actionListIndex={actionListIndexDraft} sucessMessage={sucessMessageDraft} succesMessageValue={succesMessageValueDraft} />
        </TabPanel>
        {/* {isShowCalendar && <CampaignManageCalendar />} */}
        {isShowConfigModal && <CampaignManageConfigModal handleOpen={handleOpenModal} />}
      </div>
    </S.Container>
  );
}

export default CampaignManage;



