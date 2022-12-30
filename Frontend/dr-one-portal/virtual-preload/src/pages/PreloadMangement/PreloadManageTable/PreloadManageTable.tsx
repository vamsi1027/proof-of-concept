import React, { useEffect, useState, useRef, useContext } from "react";
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
import VirtualPreloadPopup from '../../../components/VirtualPreloadPopup/VirtualPreloadPopup';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import * as S from "./PreloadManageTable.styles";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { SnackBarMessage, Spinner } from "@dr-one/shared-component";
import { userHasPermission, helper, apiDashboard, Mixpanel } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';
import { GlobalContext } from '../../../context/globalState';

const applyFilters = (preloadDataList, query, filters, tabName) => {
  return preloadDataList.filter((preloadData) => {
    let matches = true;
    let properties;
    if (query) {
      if (tabName === 0) {
        properties = ['appName'];
      } else if (tabName === 1 || tabName === 2) {
        properties = ['name'];
      }

      let containsQuery = false;

      properties.forEach((property) => {
        if (preloadData[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.role && preloadData.role !== filters.role) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && preloadData[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (virtualPreloadList, page, limit) => {
  return virtualPreloadList.slice((page - 1) * limit, (page - 1) * limit + limit);
};

function PrealoadManageTable(props) {
  const [page, setPage] = React.useState(props.page);
  const [sortColumn, setSortColumn] = React.useState(props.sortColumn);
  const [sortOrder, setSortOrder] = React.useState(props.sortOrder);
  const [preloadList, setPreloadList] = React.useState(props.preloadList);
  const [preloadListWithoutFilters, setPreloadListWithoutFilteres] = React.useState(props.preloadListWithoutFilters);
  const [searchText, setSearchText] = useState(props.searchText);
  const [isShowActionList, actionListToggle] = React.useState(props.actionListStatus);
  const [actionListIndex, setActionListIndex] = React.useState(props.actionListIndex);
  const [activeTabName, setActiveTabName] = React.useState(props.tabName);
  const [showBackdrop, setShowBackdrop] = React.useState(props.isShowLoader);
  const [activeRow, setActiveRow] = React.useState(props.activeRow);
  const [type, setType] = useState('');
  const [operationType, setOperationType] = useState(props.operationType);
  const [isOpenPopup, togglePopup] = React.useState(props.isOpenPopup);
  const [channelList, setChannelList] = React.useState(props.preloadListChannel);
  const filteredPreloadData = applyFilters(props.preloadListWithoutFilters, searchText, {
    role: null
  }, props.tabName);
  const { dispatch, state } = useContext(GlobalContext);

  const paginatedPreloadData = applyPagination(filteredPreloadData, page, 10);
  const snackbar = activeTabName === 0 ? state.management.app.showSnackBar : activeTabName === 1 ? state.management.device.showSnackBar : state.management.channel.showSnackBar;
  const snackbarMessageSuccess = activeTabName === 0 ? state.management.app.showSnackBarSuccess : activeTabName === 1 ? state.management.device.showSnackBarSuccess : state.management.channel.showSnackBarSuccess;
  const snackbarMessageValue = activeTabName === 0 ? state.management.app.snackBarMessageValue : activeTabName === 1 ? state.management.device.snackBarMessageValue : state.management.channel.snackBarMessageValue;

  const { t } = useTranslation();
  const ref = useRef<any>();
  const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;

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
    props.updatePreloadDetails(paginatedPreloadData, activeTabName, Number(newPage - 1), sortColumn, sortOrder, searchText, preloadListWithoutFilters);
  };

  const searchPreloadManagement = (e: any): void => {
    props.updatePreloadDetails(paginatedPreloadData, activeTabName, 0, sortColumn, sortOrder, e.target.value, preloadListWithoutFilters);
  }

  const setTableColumn = (sortOrder: string, sortColumn: string): void => {
    const columnSortOrder = sortOrder === 'desc' ? -1 : 1;
    const sortedArray = helper.sort(preloadListWithoutFilters, {
      "property": sortColumn,
      "direction": columnSortOrder
    })
    setPreloadListWithoutFilteres(sortedArray);
    props.updatePreloadDetails(paginatedPreloadData, activeTabName, Number(page - 1), sortColumn, sortOrder, searchText, preloadListWithoutFilters);
  }

  const onTriggerAction = (activeRowDetails: any, operationType: string): void => {
    actionListToggle(false);
    if (operationType === t('OPERATION_TYPE_EDIT')) {
      if (activeTabName === 0) {
        Mixpanel.track('Edit App Popup Clicked', { appId: activeRowDetails.id, appName: activeRowDetails.appName, page: 'Preload Management List Page View' });
      } else if (activeTabName === 1) {
        Mixpanel.track('Edit Device Popup Clicked', { deviceId: activeRowDetails.id, deviceName: activeRowDetails.name, page: 'Preload Management List Page View' });
      } else {
        Mixpanel.track('Edit Channel Popup Clicked', { channelId: activeRowDetails.id, channelName: activeRowDetails.name, page: 'Preload Management List Page View' });
      }
    } else if (operationType === t('DELETE')) {
      if (activeTabName === 0) {
        Mixpanel.track('Delete App Popup Clicked', { appId: activeRowDetails.id, appName: activeRowDetails.appName, page: 'Preload Management List Page View' });
      } else if (activeTabName === 1) {
        Mixpanel.track('Delete Device Popup Clicked', { deviceId: activeRowDetails.id, deviceName: activeRowDetails.name, page: 'Preload Management List Page View' });
      } else {
        Mixpanel.track('Delete Channel Popup Clicked', { channelId: activeRowDetails.id, channelName: activeRowDetails.name, page: 'Preload Management List Page View' });
      }
    }
    props.toggleActionList(false, activeTabName, null, true, activeRowDetails, operationType);
  }

  const canEditApp = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return userHasPermission(['U_PRELOAD_SUPPORTED_APP', 'U_PRELOAD_SUPPORTED_APP_OWN', 'U_PRELOAD_SUPPORTED_APP_OWN_ORG']);
    } else {
      return false;
    }
  }

  const canDeleteApp = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return userHasPermission(['D_PRELOAD_SUPPORTED_APP', 'D_PRELOAD_SUPPORTED_APP_OWN', 'D_PRELOAD_SUPPORTED_APP_OWN_ORG']);
    } else {
      return false;
    }
  }

  const canEditDevice = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return userHasPermission(['U_PRELOAD_SUPPORTED_DEVICE', 'U_PRELOAD_SUPPORTED_DEVICE_OWN', 'U_PRELOAD_SUPPORTED_DEVICE_OWN_ORG']);
    } else {
      return false;
    }
  }

  const canDeleteDevice = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return userHasPermission(['D_PRELOAD_SUPPORTED_DEVICE', 'D_PRELOAD_SUPPORTED_DEVICE_OWN', 'D_PRELOAD_SUPPORTED_DEVICE_OWN_ORG']);
    } else {
      return false;
    }
  }

  const canEditChannel = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return userHasPermission(['U_PRELOAD_CHANNEL', 'U_PRELOAD_CHANNEL_OWN', 'U_PRELOAD_CHANNEL_OWN_ORG']);
    } else {
      return false;
    }
  }

  const canDeleteChannel = (activeRowDetails: any): boolean => {
    if (activeRowDetails !== null) {
      return userHasPermission(['D_PRELOAD_CHANNEL', 'D_PRELOAD_CHANNEL_OWN', 'D_PRELOAD_CHANNEL_OWN_ORG']);
    } else {
      return false;
    }
  }

  const handleOpenModal = (value: boolean, action: string, message: string): void => {
    togglePopup(false);
    if (action !== 'submit') {
      props.toggleActionList(false, activeTabName, null, false, {});
    }
    if (value === false && action === 'submit') {
      if (activeTabName === 0) {
        dispatch({
          type: 'SNACKBAR_APP',
          payload: {
            showSnackBar: true,
            showSnackBarSuccess: true,
            snackBarMessageValue: message
          }
        })
      } else if (activeTabName === 1) {
        dispatch({
          type: 'SNACKBAR_DEVICE',
          payload: {
            showSnackBar: true,
            showSnackBarSuccess: true,
            snackBarMessageValue: message
          }
        })
      } else {
        dispatch({
          type: 'SNACKBAR_CHANNEL',
          payload: {
            showSnackBar: true,
            showSnackBarSuccess: true,
            snackBarMessageValue: message
          }
        })
      }
      // props.toggleActionList(false, activeTabName, null, false, {});
    }

    if (activeTabName === 0 && action === 'submit') {
      props.toggleActionList(false, activeTabName, null, false, {});
      apiDashboard
        .get(`preload/supportedapp/organizationid/${organizationId}`)
        .then(response => {
          props.updatePreloadDetails(applyPagination(helper.sort(response.data.data, { property: 'updatedAt', direction: -1 }), page, 10), activeTabName, Number(page - 1), sortColumn, sortOrder, type === 'Delete' ? '' : searchText, helper.sort(response.data.data, { property: 'updatedAt', direction: -1 }));
          dispatch({
            type: 'SNACKBAR_APP',
            payload: {
              showSnackBar: false,
              showSnackBarSuccess: false,
              snackBarMessageValue: ''
            }
          })
        }, error => {

        });
    } else if (activeTabName === 1) {
      props.toggleActionList(false, activeTabName, null, false, {});
      apiDashboard
        .get(`preload/supporteddevice/organizationid/${organizationId}`)
        .then(response => {
          props.updatePreloadDetails(applyPagination(helper.sort(response.data.data, { property: 'updatedAt', direction: -1 }), page, 10), activeTabName, Number(page - 1), sortColumn, sortOrder, type === 'Delete' ? '' : searchText, helper.sort(response.data.data, { property: 'updatedAt', direction: -1 }));

          dispatch({
            type: 'SNACKBAR_DEVICE',
            payload: {
              showSnackBar: false,
              showSnackBarSuccess: false,
              snackBarMessageValue: ''
            }
          })
        }, error => {

        });
    } else if (activeTabName === 2) {
      props.toggleActionList(false, activeTabName, null, false, {});
      apiDashboard
        .get(`preload/channel/organizationid/${organizationId}`)
        .then(response => {
          props.updatePreloadDetails(applyPagination(helper.sort(response.data.data, { property: 'updatedAt', direction: -1 }), page, 10), activeTabName, Number(page - 1), sortColumn, sortOrder, type === 'Delete' ? '' : searchText, helper.sort(response.data.data, { property: 'updatedAt', direction: -1 }));

          dispatch({
            type: 'SNACKBAR_CHANNEL',
            payload: {
              showSnackBar: false,
              showSnackBarSuccess: false,
              snackBarMessageValue: ''
            }
          })
        }, error => {
        });
    }
  }

  const onChangeStatus = (row: any): void => {
    if (activeTabName === 1) {
      props.toggleActionList(false, activeTabName, null);
      apiDashboard
        .put(`preload/supporteddevice/status/${row.id}?status=${row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}`, {})
        .then(response => {
          Mixpanel.track(`${row.status === 'ACTIVE' ? 'Inactivate' : 'Activate'} Device Action`, { deviceId: row.id, deviceName: row.name, page: 'Preload Management List Page View' });
          dispatch({
            type: 'SNACKBAR_DEVICE',
            payload: {
              showSnackBar: true,
              showSnackBarSuccess: true,
              snackBarMessageValue: response.data.message
            }
          })

          apiDashboard
            .get(`preload/supporteddevice/organizationid/${organizationId}`)
            .then(response => {
              props.updatePreloadDetails(applyPagination(helper.sort(response.data.data, { property: 'updatedAt', direction: -1 }), page, 10), activeTabName, Number(page - 1), sortColumn, sortOrder, searchText, helper.sort(response.data.data, { property: 'updatedAt', direction: -1 }));
              dispatch({
                type: 'SNACKBAR_DEVICE',
                payload: {
                  showSnackBar: false,
                  showSnackBarSuccess: false,
                  snackBarMessageValue: ''
                }
              })
            }, error => {
            });
        }, error => {
          dispatch({
            type: 'SNACKBAR_DEVICE',
            payload: {
              showSnackBar: true,
              showSnackBarSuccess: false,
              snackBarMessageValue: helper.getErrorMessage(error)
            }
          })
        });
    } else if (activeTabName === 2) {
      props.toggleActionList(false, activeTabName, null);
      apiDashboard
        .put(`preload/channel/status/${row.id}?status=${row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}`, {})
        .then(response => {
          Mixpanel.track(`${row.status === 'ACTIVE' ? 'Inactivate' : 'Activate'} Channel Action`, { channelId: row.id, channelName: row.name,page: 'Preload Management List Page View' });
          dispatch({
            type: 'SNACKBAR_CHANNEL',
            payload: {
              showSnackBar: true,
              showSnackBarSuccess: true,
              snackBarMessageValue: response.data.message
            }
          })

          apiDashboard
            .get(`preload/channel/organizationid/${organizationId}`)
            .then(response => {
              props.updatePreloadDetails(applyPagination(helper.sort(response.data.data, { property: 'updatedAt', direction: -1 }), page, 10), activeTabName, Number(page - 1), sortColumn, sortOrder, searchText, helper.sort(response.data.data, { property: 'updatedAt', direction: -1 }));
              dispatch({
                type: 'SNACKBAR_CHANNEL',
                payload: {
                  showSnackBar: false,
                  showSnackBarSuccess: false,
                  snackBarMessageValue: ''
                }
              })
            }, error => {
            });
        }, error => {
          dispatch({
            type: 'SNACKBAR_CHANNEL',
            payload: {
              showSnackBar: true,
              showSnackBarSuccess: false,
              snackBarMessageValue: helper.getErrorMessage(error)
            }
          })
        });
    }
  }

  const searchPreloadManagementOnEnter = (e: any): void => {
    if (e.key === "Enter") {
      searchPreloadManagement(e);
    }
  }

  // if (showBackdrop) {
  //   return (
  //     <div className='align-center'>
  //       <CircularProgress color="primary" />
  //     </div>
  //   )
  // }

  return (
    <S.Container >
      {<div className="search-box">
        <TextField
          onChange={searchPreloadManagement}
          onKeyPress={searchPreloadManagementOnEnter}
          value={searchText}
          type="text"
          variant="outlined"
          autoFocus={true}
          aria-describedby="desc-search-text"
          placeholder={activeTabName === 0 ? t('APP_SERACH_PLACEHOLDER')
            : activeTabName === 1 ? t('DEVICE_SERACH_PLACEHOLDER') : t('CHANNEL_SEARCH_PLACEHOLDER')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            )
          }}
        />
      </div>}
      {showBackdrop && <div className="spinner-wrap"><Spinner color={"blue"} /></div>}
      {paginatedPreloadData.length !== 0 && <TableContainer component={Paper} className="overflow-table">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {activeTabName === 0 && <TableCell align="left" className="sort-row">
                <span>{t('APP_MANAGEMENT_TABLE_APPLICATION')}</span>
                <div className="sort">
                  <ArrowDropUpOutlinedIcon className={(sortColumn === 'appName' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'appName')} />
                  <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'appName')} className={(sortColumn === 'appName' && sortOrder === 'desc') ? 'active' : ''} />
                </div>
              </TableCell>}
              {activeTabName === 0 && <TableCell >
                <span>{t('STATUS')}</span>
              </TableCell>}
              {activeTabName === 0 && <TableCell align="right" className="sort-row">
                <span>{t('APP_MANAGEMENT_TABLE_PACKAGE_NAME')}</span>
                <div className="sort">
                  <ArrowDropUpOutlinedIcon className={(sortColumn === 'packageName' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'packageName')} />
                  <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'packageName')} className={(sortColumn === 'packageName' && sortOrder === 'desc') ? 'active' : ''} />
                </div>
              </TableCell>}
              {activeTabName === 0 && <TableCell >
                <span>{t('APP_MANAGEMENT_TABLE_VERSION')}</span>
              </TableCell>}
              {activeTabName === 0 && <TableCell >
                <span>{t('APP_MANAGEMENT_TABLE_LAST_UPDATE')}</span>
              </TableCell>}
              {activeTabName === 1 && <TableCell align="left" className="sort-row">
                <span>{t('DEVICE_MANAGEMENT_TABLE_MAKE')}</span>
                <div className="sort">
                  <ArrowDropUpOutlinedIcon className={(sortColumn === 'make' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'make')} />
                  <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'make')} className={(sortColumn === 'make' && sortOrder === 'desc') ? 'active' : ''} />
                </div>
              </TableCell>}
              {activeTabName === 1 && <TableCell align="right" className="sort-row">
                <span>{t('DEVICE_MANAGEMENT_TABLE_MODEL')}</span>
                <div className="sort">
                  <ArrowDropUpOutlinedIcon className={(sortColumn === 'model' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'model')} />
                  <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'model')} className={(sortColumn === 'model' && sortOrder === 'desc') ? 'active' : ''} />
                </div>
              </TableCell>}
              {activeTabName === 1 && <TableCell align="right" className="sort-row">
                <span>{t('NAME')}</span>
                <div className="sort">
                  <ArrowDropUpOutlinedIcon className={(sortColumn === 'name' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'name')} />
                  <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'name')} className={(sortColumn === 'name' && sortOrder === 'desc') ? 'active' : ''} />
                </div>
              </TableCell>}
              {activeTabName === 1 && <TableCell align="left">{t('STATUS')}</TableCell>}
              {activeTabName === 1 && <TableCell align="left">{t('APP_MANAGEMENT_TABLE_LAST_UPDATE')}</TableCell>}
              {activeTabName === 2 && <TableCell align="left" className="sort-row">
                <span>{t('CHANNEL_MANAGEMENT_TABLE_CHANNEL')}</span>
                <div className="sort">
                  <ArrowDropUpOutlinedIcon className={(sortColumn === 'name' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'name')} />
                  <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'name')} className={(sortColumn === 'name' && sortOrder === 'desc') ? 'active' : ''} />
                </div>
              </TableCell>}
              {activeTabName === 2 && <TableCell align="right" className="sort-row">
                <span>{t('CHANNEL_MANAGEMENT_TABLE_CHANNEL_ID')}</span>
                <div className="sort">
                  <ArrowDropUpOutlinedIcon className={(sortColumn === 'channelId' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'channelId')} />
                  <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'channelId')} className={(sortColumn === 'channelId' && sortOrder === 'desc') ? 'active' : ''} />
                </div>
              </TableCell>}
              {activeTabName === 2 && <TableCell align="left">{t('CHANNEL_MANAGEMENT_TABLE_DESCRIPTION')}</TableCell>}
              {activeTabName === 2 && <TableCell align="left">{t('STATUS')}</TableCell>}
              {activeTabName === 2 && <TableCell align="left">{t('APP_MANAGEMENT_TABLE_LAST_UPDATE')}</TableCell>}
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPreloadData
              .map((row, index) => (
                <TableRow key={row.id}>
                  {activeTabName === 0 && <TableCell scope="row">
                    <div className="app-image-wrap">
                      <img src={row.appIcon} className="app-img-thumb" alt="app_image" />
                      <span className="camp-name">{row?.appName}</span>
                    </div>
                  </TableCell>}
                  {activeTabName === 0 && <TableCell align="left"><span className={row.status === 'ACTIVE' ? 'label-badge status-active' : 'label-badge status-inactive'}>{row?.status}</span></TableCell>}
                  {activeTabName === 0 && <TableCell align="left">{row?.packageName}</TableCell>}
                  {activeTabName === 0 && <TableCell align="left">{row?.appVersionName}</TableCell>}
                  {activeTabName === 0 && <TableCell align="left">{row?.updatedAt ? helper.convertTimestampToDate(row.updatedAt * 1000) : helper.convertTimestampToDate(row.createdAt * 1000)}</TableCell>}
                  {activeTabName === 1 && <TableCell align="left">{row?.make}</TableCell>}
                  {activeTabName === 1 && <TableCell align="left">{row?.model}</TableCell>}
                  {activeTabName === 1 && <TableCell align="left">{row?.name}</TableCell>}
                  {activeTabName === 1 && <TableCell align="left"><span className={row.status === 'ACTIVE' ? 'label-badge status-active' : 'label-badge status-inactive'}>{row?.status}</span></TableCell>}
                  {activeTabName === 1 && <TableCell align="left">{row?.updatedAt ? helper.convertTimestampToDate(row.updatedAt * 1000) : helper.convertTimestampToDate(row.createdAt * 1000)}</TableCell>}
                  {activeTabName === 2 && <TableCell align="left">{row?.name}</TableCell>}
                  {activeTabName === 2 && <TableCell align="left">{row?.channelId}</TableCell>}
                  {activeTabName === 2 && <TableCell align="left">{row?.description}</TableCell>}
                  {activeTabName === 2 && <TableCell align="left"><span className={row.status === 'ACTIVE' ? 'label-badge status-active' : 'label-badge status-inactive'}>{row?.status}</span></TableCell>}
                  {activeTabName === 2 && <TableCell align="left">{row?.updatedAt ? helper.convertTimestampToDate(row.updatedAt * 1000) : helper.convertTimestampToDate(row.createdAt * 1000)}</TableCell>}
                  <TableCell align="right" >
                    <div className="more-action"><MoreVertIcon onClick={(e) => {
                      actionListToggle(isShowActionList => !isShowActionList);
                      props.toggleActionList(!isShowActionList, activeTabName, index);
                      setActionListIndex(index);
                    }} />
                      {(isShowActionList && actionListIndex === index) && <div className={(tableBottomHeight - document.getElementById(`${row.id}`)?.offsetTop > 280) ? 'more-action-dropdown' : "more-action-dropdown position-top"}>
                        <ul ref={ref}>
                          {((activeTabName === 0 && canEditApp(row)) || (activeTabName === 1 && canEditDevice(row)) ||
                            (activeTabName === 2 && canEditChannel(row))) && <li onClick={(e) => onTriggerAction(row, t('OPERATION_TYPE_EDIT'))}>{t('ACTION_EDIT')} <EditIcon /></li>}
                          {((activeTabName === 1 || activeTabName === 2) && row.status === 'ACTIVE') && <li onClick={(e) => onChangeStatus(row)}>{t('DEACTIVATE')} <FileCopyOutlinedIcon /></li>}
                          {((activeTabName === 1 || activeTabName === 2) && row.status === 'INACTIVE') && <li onClick={(e) => onChangeStatus(row)}>{t('ACTIVATE')} <FileCopyOutlinedIcon /></li>}
                          {((activeTabName === 0 && canDeleteApp(row)) || (activeTabName === 1 && canDeleteDevice(row)) ||
                            (activeTabName === 2 && canDeleteChannel(row))) && <li onClick={(e) => onTriggerAction(row, t('DELETE'))}>{t('DELETE')} <ArchiveOutlinedIcon /></li>}
                        </ul>

                      </div>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Pagination count={Math.ceil(filteredPreloadData.length / 10)} onChange={handleChangePage} page={page} />
      </TableContainer>}
      {isOpenPopup && <VirtualPreloadPopup activeRow={activeRow} operationType={operationType} handleOpen={handleOpenModal} modalType={activeTabName === 0 ? 'App' : activeTabName === 1 ? 'Device' : 'Channel'} channelList={channelList}/>}
      {snackbar && (
        <SnackBarMessage open={snackbar} onClose={() => {
          // setSnackbar(false);
          if (activeTabName === 0) {
            dispatch({
              type: 'SNACKBAR_APP',
              payload: {
                showSnackBar: false,
                showSnackBarSuccess: false,
                snackBarMessageValue: ''
              }
            })
          } else if (activeTabName === 1) {
            dispatch({
              type: 'SNACKBAR_DEVICE',
              payload: {
                showSnackBar: false,
                showSnackBarSuccess: false,
                snackBarMessageValue: ''
              }
            })
          } else {
            dispatch({
              type: 'SNACKBAR_CHANNEL',
              payload: {
                showSnackBar: false,
                showSnackBarSuccess: false,
                snackBarMessageValue: ''
              }
            })
          }

          props.toggleActionList(false, activeTabName, null);
        }} severityType={snackbarMessageSuccess ? 'success' : 'error'} message={snackbarMessageValue} />)}
      <Divider id="table-bottom" />
      {(!showBackdrop && filteredPreloadData?.length === 0) && <div className="alert error lg">
        <div className="alert-message">{activeTabName === 0 ? t('PRELOAD_MANAGE_APP_LIST_ERROR') : activeTabName === 1 ?
          t('PRELOAD_MANAGE_DEVICE_LIST_ERROR') : t('PRELOAD_MANAGE_CHANNEL_LIST_ERROR')}</div>
      </div>}
    </S.Container>
  );
}

export default PrealoadManageTable;
