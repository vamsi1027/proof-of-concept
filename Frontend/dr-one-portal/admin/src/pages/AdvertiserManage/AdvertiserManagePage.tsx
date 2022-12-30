import React, { useEffect, useState, useRef } from "react";
import * as S from "./AdvertiserManagePage.styles";
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
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import { Pagination } from '@material-ui/lab';
import { Breadcrumb, SnackBarMessage } from "@dr-one/shared-component";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import AdminPopup from '../../components/Common/AdminPopup/AdminPopup';
import SuccessPopup from '../../components/Common/SuccessPopup/SuccessPopup';
import { useTranslation } from 'react-i18next';

const applyFilters = (advertiserList, query, filters) => {
  return advertiserList.filter((advertiser) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (advertiser[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });
      if (filters.role && advertiser.role !== filters.role) {
        matches = false;
      }
      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && advertiser[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (advertiser: any, page: number, limit: number): any => {
  return advertiser.slice((page - 1) * limit, (page - 1) * limit + limit);
};

function AdvertiserManagePage() {
  const { t } = useTranslation();
  const [advertiserList, setAdvertiserList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    role: null
  });
  const [query, setQuery] = useState('');
  const filteredAdvertiser = applyFilters(advertiserList, query, filters);
  const paginatedAdvertiserList = applyPagination(filteredAdvertiser, page, limit);
  const [initLoad, setInitLoad] = useState(true);
  const [isShowActionList, actionListToggle] = useState(false);
  const [actionListIndex, setActionListIndex] = useState(null);
  const [isOpenPopup, togglePopup] = useState(false);
  const [advertiserData, setAdvertiserData] = useState<any>({});
  const [operationType, setOperationType] = useState<any>({});
  const [type, setType] = useState<any>({});
  const [snackbarMessageSuccess, setSnackbarMessageSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessageValue, setSnackbarMessageValue] = useState('');
  const [successPopup, setSuccessPopup] = useState(false);
  const hierarchyList = [`${t('ADMIN')}`, `${t('ADVERTISER_MANGEMENT')}`];
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

  const createAdvertiser = (): void => {
    Mixpanel.track('Create Advertiser Action', { page: 'Advertiser List Page View' });
    togglePopup(true);
    setOperationType(t('OPERATION_TYPE_ADD'));
    setType(t('ADVERTISER_LABEL'));
  }

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    setActionListIndex(null);
    actionListToggle(false);
  };

  useEffect(() => {
    getAdvertiserList();
    Mixpanel.track('Advertiser List Page View');
  }, []);

  const getAdvertiserList = (): void => {
    apiDashboard
      .get('campaign-mgmt-api/advertiser')
      .then(response => {
        setAdvertiserList(helper.sort(response.data.data, { property: 'createdDate', direction: -1 }));
        setInitLoad(false);
        setActionListIndex(null);
        actionListToggle(false);
      }, error => {
        setAdvertiserList([]);
        setInitLoad(false);
        console.log(helper.getErrorMessage(error));
      });
  }

  const openAdminPopup = (advertiserElm: any, operationType: string, type: string): void => {
    togglePopup(true);
    setAdvertiserData(advertiserElm);
    setOperationType(operationType);
    setType(type);
  }

  const handleOpenModal = (value: boolean, type: string, isSuccessPopup = false): void => {
    togglePopup(value);
    if (type === 'success' && !value) {
      setSuccessPopup(true);
    }
    if (type === '' && !value && isSuccessPopup) {
      setSuccessPopup(false);
    }
    getAdvertiserList();
  }

  const deactivateAdvertiser = (advertiser: any): void => {
    setInitLoad(true);
    apiDashboard
      .put(`campaign-mgmt-api/advertiser/${advertiser.id}`, {
        active: !advertiser.active
      })
      .then(response => {
        getAdvertiserList();
        setInitLoad(false);
        setSnackbarMessageSuccess(true);
        setSnackbar(true);
        setSnackbarMessageValue(response.data.message);
      }, error => {
        setInitLoad(false);
        setSnackbarMessageSuccess(false);
        setSnackbar(true);
        setSnackbarMessageValue(helper.getErrorMessage(error));
        console.log(helper.getErrorMessage(error));
      });
  }

  const deleteAdvertiser = (advertiser: any): void => {
    setInitLoad(true);
    apiDashboard
      .delete(`campaign-mgmt-api/advertiser/${advertiser.id}`)
      .then(response => {
        setQuery('');
        getAdvertiserList();
        setInitLoad(false);
        setSnackbarMessageSuccess(true);
        setSnackbar(true);
        setSnackbarMessageValue(response.data.message);
      }, error => {
        setInitLoad(false);
        setSnackbarMessageSuccess(false);
        setSnackbar(true);
        setSnackbarMessageValue(helper.getErrorMessage(error));
        console.log(helper.getErrorMessage(error));
      });
  }

  return (
    <React.Fragment>
      <S.Container className="inner-container">
        {snackbar && (
          <SnackBarMessage open={snackbar} onClose={() => setSnackbar(false)}
            severityType={snackbarMessageSuccess ? 'success' : 'error'} message={snackbarMessageValue} />)}
        <Breadcrumb hierarchy={hierarchyList} />
        <div className="mb-20">
          <div>
            <h1 className="page-title">{t('ADVERTISER_MANGEMENT')}</h1>
          </div>
          <div className="header-main-btn">
            <Button onClick={createAdvertiser} variant="contained" color="primary" className="button-lg dark-blue" startIcon={<AddOutlinedIcon fontSize="small" />}>
              {t('CREATE_ADVERTISER')}</Button>
          </div>
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
                    placeholder={t('SEARCH_ADVERTISER_BY_NAME')}
                    value={query}
                    size="small"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
                <Divider />
                {paginatedAdvertiserList.length === 0 ? (
                  <>
                    <div className="alert error lg">
                      <div className="alert-message">{t('ADVERTISER_LIST_ERROR')}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <TableContainer className="no-scroll">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="left" className="sort-row">
                              <span>{t('NAME')}</span>
                            </TableCell>
                            <TableCell align="left" className="sort-row">
                              <span>{t('DESCREPTION')}</span>
                            </TableCell>
                            <TableCell align="center">
                              <span>{t('ACTIVE')}</span>
                            </TableCell>
                            <TableCell align="left">
                              <span>{t('CREATED_AT')}</span>
                            </TableCell>
                            <TableCell align="left">
                              <span>{t('UPDATED_AT')}</span>
                            </TableCell>
                            <TableCell align="left"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedAdvertiserList.map((advertiser, index) => {
                            return (
                              <TableRow hover key={advertiser.id}>
                                <TableCell> {advertiser.name}</TableCell>
                                <TableCell> {advertiser.description}</TableCell>
                                <TableCell className="checkbox-table-col">
                                  <FormControlLabel
                                    control={<Checkbox color="primary"
                                      name="roles" value={advertiser.id} />}
                                    checked={advertiser.active}
                                    label={''}
                                  /> </TableCell>
                                <TableCell>{helper.convertTimestampToDate(advertiser.createdDate)}  </TableCell>
                                <TableCell>{advertiser.updatedAt ? helper.convertTimestampToDate(advertiser.updatedAt) : ''} </TableCell>
                                <TableCell align="left" >
                                  <div className="more-action"><MoreVertIcon onClick={(e) => {
                                    actionListToggle(isShowActionList => !isShowActionList);
                                    setActionListIndex(index);
                                  }} />
                                    {(isShowActionList && actionListIndex === index) && <div className="more-action-dropdown">
                                      <ul ref={ref}>
                                        {advertiser && <li onClick={(e) => openAdminPopup(advertiser, 'Edit', 'Advertiser')} >{t('EDIT')} <EditIcon /></li>}
                                        {advertiser && advertiser.active && <li onClick={(e) => deactivateAdvertiser(advertiser)}> {t('DEACTIVATE')} <FileCopyOutlinedIcon /></li>}
                                        {advertiser && <li onClick={(e) => deleteAdvertiser(advertiser)}>{t('DELETE')} <ArchiveOutlinedIcon /></li>}
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
                        count={filteredAdvertiser.length === 1 ? 1 : Math.ceil(filteredAdvertiser.length / limit)}
                        page={page}
                        onChange={handlePageChange}
                      />
                    </Box>}
                  </>
                )}
              </Card>
            }
            {isOpenPopup && <AdminPopup operationType={operationType} handleOpen={handleOpenModal} rowData={advertiserData}
              type={type} />}
            {successPopup && <SuccessPopup handleOpen={handleOpenModal} type={'Advertiser'} operationType={operationType} />}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default AdvertiserManagePage;