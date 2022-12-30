import React, { useEffect, useState, useRef, useContext } from "react";
import * as S from "./OrganizationManage.style";
import {
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Box,
  Card,
  TextField,
  Divider,
  InputAdornment,
  CircularProgress,
} from "@material-ui/core";
import { Alert, Pagination } from '@material-ui/lab';
import { Breadcrumb, Spinner } from "@dr-one/shared-component";
import { useHistory } from "react-router-dom";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import { Snackbar } from "@material-ui/core";
import { userHasPermission } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';
import { GlobalContext, campaignDeliverySlot } from "../../context/globalState";

const applyFilters = (organizations, query, filters) => {
  return organizations.filter((organization) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'tag'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (organization[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.role && organization.role !== filters.role) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && organization[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (organizations, page, limit) => {
  return organizations.slice((page - 1) * limit, (page - 1) * limit + limit);
};

function OrganizationManage() {

  const history = useHistory();
  const { t } = useTranslation();
  const [organization, setOrganization] = useState([]);
  const [filters, setFilters] = useState({
    role: null
  });
  const { state, dispatch } = useContext(GlobalContext);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const filteredOrganization = applyFilters(organization, query, filters);
  const paginatedOrganization = applyPagination(filteredOrganization, page, limit);
  const [initLoad, setInitLoad] = useState(true);
  const [isShowActionList, actionListToggle] = React.useState(false);
  const [actionListIndex, setActionListIndex] = React.useState(null);
  const [sortColumn, setSortColumn] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState(-1);
  const hierarchyList = [`${t('ADMIN')}`, `${t('ORGANIZATION_MANAGEMENT_FULL')}`];
  const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;

  const ref = useRef<any>();

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (isShowActionList && ref.current && !ref.current.contains(e.target)) {
        actionListToggle(true);
        setActionListIndex(null);
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    }
  }, [isShowActionList]);

  const redirectToCretaeOrganization = (): void => {
    Mixpanel.track('Create Organization Action', { page: 'Organization List Page View' });
    history.push('/organization/new');
  }

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
    setPage(1)
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getOrganizationList();
    resetOrgState()
    Mixpanel.track('Organization List Page View');
  }, []);

  const getOrganizationList = () => {
    apiDashboard
      .get(`campaign-mgmt-api/organizations`)
      .then(response => {
        setOrganization(helper.sort(response?.data?.data?.map(organization => {
          organization.name = helper.stringCapitalize(organization?.name?.trim());
          return organization;
        }), { property: sortColumn, direction: sortOrder }));
        setInitLoad(false);
      }, error => {
        setOrganization([]);
        setInitLoad(false);
      });
  }

  const setTableColumn = (sortOrder: string, sortColumn: string): void => {
    const columnSortOrder = sortOrder === 'desc' ? -1 : 1;
    setSortColumn(sortColumn);
    setSortOrder(columnSortOrder);
    const sortedArray = helper.sort(organization, {
      "property": sortColumn,
      "direction": columnSortOrder
    })
    setOrganization(sortedArray);
  }

  const authorization = (activeRowDetails: any): any => {
    let canAllow = {
      canEdit: false,
      canClone: false,
      canRename: false,
      canDelete: false
    }

    if (userHasPermission(['U_AC'])) {
      canAllow['canRename'] = true;
      canAllow['canEdit'] = true;
    } else if (
      (organizationId === activeRowDetails.organizationId)
      // todo
      // && (currentUserId === activeRowDetails.userId)
      && userHasPermission(['U_CAMPAIGN_OWN'])) {
      canAllow['canRename'] = true;
      canAllow['canEdit'] = true;
    }

    if ((organizationId === activeRowDetails.organizationId) &&
      userHasPermission(['C_AC_OWN_ORG', 'C_AC'])) {
      canAllow['canClone'] = true;
    }

    if ((organizationId === activeRowDetails.organizationId)
      && userHasPermission(['D_AC_OWN_ORG', 'D_AC'])) {
      canAllow['canDelete'] = true;
    }
    return canAllow;
  }
  const eidtOrganization = (id: string): void => {
    history.push(`/organization/edit/${id}`)
    localStorage.setItem("editOrgID", id)
  }
  function resetOrgState(): void {
    const modifiedPayload = Object.assign({}, state.orgSetting)

    modifiedPayload['general']['editPromptLoader'] = false;
    modifiedPayload['general']['name'] = ""
    modifiedPayload['general']['imageLogo'] = ""
    modifiedPayload['general']['imageId'] = ""
    modifiedPayload['general']['locationHistoryCleanUp'] = "30"
    modifiedPayload['general']['language'] = "EN"
    modifiedPayload['general']['dormantDeviceFilterDays'] = "7"
    modifiedPayload['general']['countryISOCode'] = ""
    modifiedPayload['campaign']['s3AdUrl'] = ""
    modifiedPayload['campaign']['mainImageSize'] = "300"
    modifiedPayload['campaign']['videoImageSize'] = "4000"
    // modifiedPayload['campaign']['apkImageSize'] = "20000"
    modifiedPayload['campaign']['clientIdForReachCount'] = false
    modifiedPayload['campaign']['gifImageSize'] = "4000"
    modifiedPayload['campaign']['notificationImageSize'] = ""
    modifiedPayload['campaign']['fsImageSize'] = ""
    modifiedPayload['virtualPayload']['agencyId'] = ""
    modifiedPayload['virtualPayload']['advertiserId'] = ""
    modifiedPayload['virtualPayload']['clusterId'] = ""
    modifiedPayload['virtualPayload']['campaignCategoryid'] = ""
    modifiedPayload['virtualPayload']['campaignObjectiveId'] = ""
    modifiedPayload['virtualPayload']['preloadDeliveryStrategyid'] = "IMEI_CHANNEL_MAPPING"
    modifiedPayload['virtualPayload']['maxAcceleratedTimeDuration'] = ""
    modifiedPayload['virtualPayload']['sourcePackage'] = []
    modifiedPayload['virtualPayload']['apkFileMaxSize'] = "20000"
    modifiedPayload['vasDefault']['preSubscriptionTitle'] = ""
    modifiedPayload['vasDefault']['preSubscriptionText'] = ""
    modifiedPayload['vasDefault']['preSubscriptionActionText'] = ""
    modifiedPayload['vasDefault']['preSubscriptionPositiveText'] = ""
    modifiedPayload['vasDefault']['preSubscriptionNegativeText'] = ""
    modifiedPayload['vasDefault']['processingText'] = ""
    modifiedPayload['vasDefault']['defaultActionText'] = ""
    modifiedPayload['vasDefault']['defaultFailureText'] = ""
    modifiedPayload['adLimit']['campaignSchedulerAdLimit'] = "3"
    modifiedPayload['adLimit']['max'] = "3"
    modifiedPayload['adLimit']['rollingDays'] = "1"
    modifiedPayload['report']['automaticallyEmailReport'] = "YES"
    modifiedPayload['report']['emailDistribution'] = []
    modifiedPayload['report']['roles'] = []
    modifiedPayload['survey']['enableSurvey'] = false
    modifiedPayload['survey']['numberOfQuestion'] = ""
    modifiedPayload['externalOrgSupport']['externalIdRequired'] = false
    modifiedPayload['externalOrgSupport']['orgId'] = ""
    modifiedPayload['fcm']['fcmDataList'] = []
    modifiedPayload['campaignDeliveryWindow']['isOnCustomDeliveryWindow'] = false
    modifiedPayload['campaignDeliveryWindow']['isValidCampaignDeliveryWindow'] = true
    modifiedPayload['campaignDeliveryWindow']['slots'] = [campaignDeliverySlot()]
    modifiedPayload['general']['orgPromptLoader'] = true;
    dispatch({
        type: 'RESET_ORGANIZATION_STATE',
        payload: {
            resetOrgSetting: modifiedPayload
        }
    })
    // setTimeout(() => {
    //     sessionStorage.setItem('enablePrompt', 'false')
    //     // setLoading(true)
    // }, 2000);
}
  return (
    <React.Fragment>
      <S.Container className="inner-container">
        <Breadcrumb hierarchy={hierarchyList} />

        <div className="mb-20">
          <div>
            <h1 className="page-title">{t('ORGANIZATION')}</h1>
          </div>
          {userHasPermission(['C_AC', 'C_AC_OWN_ORG']) && <div className="header-main-btn">
            <Button onClick={redirectToCretaeOrganization} variant="contained" color="primary" className="button-lg dark-blue" startIcon={<AddOutlinedIcon fontSize="small" />}> {t('NEW')} {t('ORGANIZATION')}</Button>
          </div>}
        </div>
      </S.Container>
      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <div className="table-search-wrap">
            {initLoad && <Typography align="center" color="primary"><CircularProgress color="inherit" /></Typography>}
            {!initLoad &&
              <Card>
                <Box p={2} className="search-box no-margin">
                  <TextField className="no-margin"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchTwoToneIcon />
                        </InputAdornment>
                      )
                    }}
                    onChange={handleQueryChange}
                    placeholder={t('SEARCH_ORG_BY_NAME')}
                    value={query}
                    size="small"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Box>

                <Divider />

                {paginatedOrganization.length === 0 ? (
                  <>

                    <div className="alert error lg">
                      <div className="alert-message">{t('EMPTY_ORG_LIST_FOR_LISTING')}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <TableContainer className="no-scroll">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="left" className="sort-row">
                              <span>{`${t('ORGANIZATION')} ${t('NAME')}`}</span>
                              <div className="sort">
                                <ArrowDropUpOutlinedIcon className={(sortColumn === 'name' && sortOrder === 1) ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'name')} />
                                <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'name')} className={(sortColumn === 'name' && sortOrder === -1) ? 'active' : ''} />
                              </div></TableCell>
                            <TableCell align="left" className="sort-row">
                              <span>{t('LANGUAGE')}</span>
                              <div className="sort">
                                <ArrowDropUpOutlinedIcon className={(sortColumn === 'language' && sortOrder === 1) ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'language')} />
                                <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'language')} className={(sortColumn === 'language' && sortOrder === -1) ? 'active' : ''} />
                              </div></TableCell>
                            <TableCell align="left" className="sort-row">
                              <span>{`${t('HEADER_LIMIT')}`}</span>
                              <div className="sort">
                                <ArrowDropUpOutlinedIcon className={(sortColumn === 'limit' && sortOrder === 1) ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'limit')} />
                                <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'limit')} className={(sortColumn === 'limit' && sortOrder === -1) ? 'active' : ''} />
                              </div></TableCell>
                            <TableCell align="left" className="sort-row">
                              <span>{`${t('HEADER_TIMEZONE')}`}</span>
                              <div className="sort">
                                <ArrowDropUpOutlinedIcon className={(sortColumn === 'timeZone' && sortOrder === 1) ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'timeZone')} />
                                <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'timeZone')} className={(sortColumn === 'timeZone' && sortOrder === -1) ? 'active' : ''} />
                              </div></TableCell>
                            <TableCell align="left"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedOrganization.map((organization, index) => {
                            return (
                              <TableRow hover key={organization.id}>
                                <TableCell>
                                  {organization.name}
                                </TableCell>
                                <TableCell>
                                  {organization.language}
                                </TableCell>
                                <TableCell>
                                  {organization.limit}
                                </TableCell>
                                <TableCell>
                                  {organization.timeZone}
                                </TableCell>
                                <TableCell align="left" >
                                  <div className="more-action"><MoreVertIcon onClick={(e) => {
                                    actionListToggle(isShowActionList => !isShowActionList);
                                    setActionListIndex(index);
                                  }} />
                                    {(isShowActionList && actionListIndex === index) && <div className="more-action-dropdown">
                                      <ul ref={ref}>
                                        {authorization(organization).canRename && <li onClick={(e) => { eidtOrganization(organization.id) }} >{t('EDIT')} <EditIcon /></li>}
                                      </ul>
                                    </div>}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {<Box p={2} display="flex" justifyContent="center">

                      <Pagination
                        count={Math.floor(filteredOrganization.length / limit)}
                        page={page}
                        onChange={handlePageChange}
                      />
                    </Box>}
                  </>
                )}
              </Card>
            }
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default OrganizationManage;