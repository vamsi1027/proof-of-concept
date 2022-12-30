import React, { useEffect, useState, useRef, useContext } from "react";
import * as S from "./AudienceManage.styles";
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
import { Pagination } from '@material-ui/lab';
import { Breadcrumb, Spinner } from "@dr-one/shared-component";
import { useHistory } from "react-router-dom";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import { apiDashboard, helper } from "@dr-one/utils";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';
import ClusterPopup from '../../components/Common/ClusterPopup/ClusterPopup';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import { userHasPermission, Mixpanel } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';
import { GlobalContext } from "../../context/globalState";

const applyFilters = (clusters, query, filters) => {
  return clusters.filter((cluster) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'userName'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (cluster[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.role && cluster.role !== filters.role) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && cluster[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (clusters, page, limit) => {
  return clusters.slice((page - 1) * limit, (page - 1) * limit + limit);
};

function AudienceManage() {
  const history = useHistory();
  const { t } = useTranslation();
  const [clusters, setCluster] = useState([]);
  const [filters, setFilters] = useState({
    role: null
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const filteredClusters = applyFilters(clusters, query, filters);
  const paginatedClusters = applyPagination(filteredClusters, page, limit);
  const [initLoad, setInitLoad] = useState(true);
  const [isShowActionList, actionListToggle] = React.useState(false);
  const [actionListIndex, setActionListIndex] = React.useState(null);
  const [isOpenPopup, togglePopup] = React.useState(false);
  const [popupType, setPopupType] = React.useState('');
  const [clusterData, setClusterData] = React.useState<any>({});
  const [sortColumn, setSortColumn] = React.useState('createdAt');
  const [sortOrder, setSortOrder] = React.useState(-1);
  const hierarchyList = [`${t('AUDIENCES')}`, `${t('AUDIENCE')} ${t('LIST')}`];
  const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
  const currentUserId = JSON.parse(localStorage.getItem('dr-user'))?.email;
  const { state, dispatch } = useContext(GlobalContext);

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

  const redirectToCreateAudience = (): void => {
    Mixpanel.track('Create Audience Action', { page: 'Audience List Page View' });
    const modifiedPayload = Object.assign({}, state.rules);
    modifiedPayload["clusterType"] = 'RULE';
    dispatch({
        type: "MODIFY_RULES",
        payload: {
            rulesPayload: modifiedPayload,
        },
    });
    history.push('/audience/new');
  }

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const convertDateString = (timestamp): string => {
    return (new Date(timestamp)).toLocaleDateString();
  };

  useEffect(() => {
    getAudienceClusterList();
    Mixpanel.track('Audience List Page View');
  }, []);

  const getAudienceClusterList = () => {
    apiDashboard
      .get(`campaign-mgmt-api/audienceclusters/v2/organizationid/${organizationId}?placesConfig=false&externalAudienceCluster=false`)
      .then(response => {
        setCluster(helper.sort(response?.data?.data?.map(cluster => {
          cluster.name = helper.stringCapitalize(cluster.name);
          return cluster;
        }), { property: sortColumn, direction: sortOrder }));
        setInitLoad(false);
      }, error => {
        console.log(error);
        setCluster([]);
        setInitLoad(false);
      });
  }

  const openPopup = (clusterElm: any, type: string): void => {
    actionListToggle(false);
    togglePopup(true);
    setPopupType(type);
    setClusterData(clusterElm);
  }

  const handleOpenModal = (value: boolean): void => {
    togglePopup(value);
    if (popupType === 'Delete') {
      setQuery('');
    }
    getAudienceClusterList();
  }

  const setTableColumn = (sortOrder: string, sortColumn: string): void => {
    const columnSortOrder = sortOrder === 'desc' ? -1 : 1;
    setSortColumn(sortColumn);
    setSortOrder(columnSortOrder);
    const sortedArray = helper.sort(clusters, {
      "property": sortColumn,
      "direction": columnSortOrder
    })
    setCluster(sortedArray);
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
      && (currentUserId === activeRowDetails.userId)
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

  const updateRulesPayload = (payload: any): void => {
    dispatch({
      type: "MODIFY_RULES",
      payload: {
        rulesPayload: payload
      },
    });
  };

  const editCluster = (id: string, clusterTypes: string): void => {
    Mixpanel.track('Edit Audience Action', { page: 'Audience List Page View' });
    history.push(`/audience/edit/${id}`)
    const modifiedPayload = Object.assign({}, state.rules);
    modifiedPayload['clusterType'] = clusterTypes;
    updateRulesPayload(modifiedPayload);
  }

  return (
    <React.Fragment>
      <S.Container className="inner-container">
        <Breadcrumb hierarchy={hierarchyList} />

        <div className="mb-20">
          <div>
            <h1 className="page-title">{t('AUDIENCE')}</h1>
          </div>
          {userHasPermission(['C_AC', 'C_AC_OWN_ORG']) && <div className="header-main-btn">
            <Button onClick={redirectToCreateAudience} variant="contained" color="primary" className="button-lg dark-blue" startIcon={<AddOutlinedIcon fontSize="small" />}>{t('CREATE_AUDIENCE')}</Button>
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
                    placeholder={t('SEARCH_AUDIENCE_BY_NAME_OR_USERNAME')}
                    value={query}
                    size="small"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
                <Divider />

                {paginatedClusters.length === 0 ? (
                  <>
                    <div className="alert error lg">
                      <div className="alert-message">{t('EMPTY_AUDIENCE_LIST_FOR_LISTING')}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <TableContainer className="no-scroll">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="left" className="sort-row">
                              <span>{t('AUDIENCE_NAME')}</span>
                              <div className="sort">
                                <ArrowDropUpOutlinedIcon className={(sortColumn === 'name' && sortOrder === 1) ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'name')} />
                                <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'name')} className={(sortColumn === 'name' && sortOrder === -1) ? 'active' : ''} />
                              </div></TableCell>
                            <TableCell align="left" className="sort-row">
                              <span>{t('CREATED_ON_DATE')}</span>
                              <div className="sort">
                                <ArrowDropUpOutlinedIcon className={(sortColumn === 'createdAt' && sortOrder === 1) ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'createdAt')} />
                                <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'createdAt')} className={(sortColumn === 'createdAt' && sortOrder === -1) ? 'active' : ''} />
                              </div></TableCell>
                            <TableCell align="left" className="sort-row">
                              <span>{t('CREATOR')}</span>
                              <div className="sort">
                                <ArrowDropUpOutlinedIcon className={(sortColumn === 'userName' && sortOrder === 1) ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'userName')} />
                                <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'userName')} className={(sortColumn === 'userName' && sortOrder === -1) ? 'active' : ''} />
                              </div></TableCell>
                            <TableCell align="left"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedClusters.map((cluster, index) => {
                            return (
                              <TableRow hover key={cluster.id}>
                                <TableCell>
                                  {cluster.name}
                                </TableCell>
                                <TableCell>
                                  {helper.timestampToDateString(cluster.createdAt * 1000)}
                                </TableCell>
                                <TableCell>
                                  {cluster.userName}
                                </TableCell>
                                <TableCell align="left" >
                                  <div className="more-action"><MoreVertIcon onClick={(e) => {
                                    actionListToggle(isShowActionList => !isShowActionList);
                                    setActionListIndex(index);
                                  }} />
                                    {(isShowActionList && actionListIndex === index) && <div className="more-action-dropdown">
                                      <ul ref={ref}>
                                        {authorization(cluster).canRename && <li onClick={(e) => openPopup(cluster, 'Rename')}>{t('RENAME')} <EditIcon /></li>}
                                        {authorization(cluster).canEdit && (cluster.clusterType === 'RULE' || cluster.clusterType === 'PERMISSION' || cluster.clusterType === 'CAMPAIGN') && <li onClick={(e) => { editCluster(cluster.id, cluster.clusterType) }} >{t('EDIT')} <EditIcon /></li>}
                                        {authorization(cluster).canClone && <li onClick={(e) => openPopup(cluster, 'Clone')}> {t('DUPLICATE')} <FileCopyOutlinedIcon /></li>}
                                        {authorization(cluster).canDelete && <li onClick={(e) => openPopup(cluster, 'Delete')}>{t('DELETE')} <ArchiveOutlinedIcon /></li>}

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
                        count={Math.floor(filteredClusters.length / limit)}
                        page={page}
                        onChange={handlePageChange}
                      />
                    </Box>}
                  </>
                )}
              </Card>
            }
            {isOpenPopup && <ClusterPopup popupType={popupType} handleOpen={handleOpenModal} clusterData={clusterData} />}

          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default AudienceManage;