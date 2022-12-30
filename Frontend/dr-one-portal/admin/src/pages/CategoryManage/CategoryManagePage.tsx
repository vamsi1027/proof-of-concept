import React, { useEffect, useState, useRef } from "react";
import * as S from "./CategoryManagePage.styles";
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

const applyFilters = (categoryList, query, filters) => {
  return categoryList.filter((category) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (category[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });
      if (filters.role && category.role !== filters.role) {
        matches = false;
      }
      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && category[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (category: any, page: number, limit: number): any => {
  return category.slice((page - 1) * limit, (page - 1) * limit + limit);
};

function CategoryManagePage() {
  const { t } = useTranslation();
  const [categoryList, setCategoryList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    role: null
  });
  const [query, setQuery] = useState('');
  const filteredCategory = applyFilters(categoryList, query, filters);
  const paginatedCategoryList = applyPagination(filteredCategory, page, limit);
  const [initLoad, setInitLoad] = useState(true);
  const [isShowActionList, actionListToggle] = useState(false);
  const [actionListIndex, setActionListIndex] = useState(null);
  const [isOpenPopup, togglePopup] = useState(false);
  const [categoryData, setCategoryData] = useState<any>({});
  const [operationType, setOperationType] = useState<any>({});
  const [type, setType] = useState<any>({});
  const [snackbarMessageSuccess, setSnackbarMessageSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessageValue, setSnackbarMessageValue] = useState('');
  const [successPopup, setSuccessPopup] = useState(false);
  const hierarchyList = [`${t('ADMIN')}`, `${t('CATEGORY_MANGEMENT')}`];
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

  const createCategory = (): void => {
    Mixpanel.track('Create Category Action', { page: 'Category List Page View' });
    togglePopup(true);
    setOperationType(t('OPERATION_TYPE_ADD'));
    setType(t('CATEGORY_LABEL'));
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
    getCategoryList();
    Mixpanel.track('Category List Page View');
  }, []);

  const getCategoryList = (): void => {
    apiDashboard
      .get('campaign-mgmt-api/configurations/campaigncategories')
      .then(response => {
        setCategoryList(helper.sort(response.data.data, { property: 'createdAt', direction: -1 }));
        setInitLoad(false);
        setActionListIndex(null);
        actionListToggle(false);
      }, error => {
        setCategoryList([]);
        setInitLoad(false);
        console.log(helper.getErrorMessage(error));
      });
  }

  const openAdminPopup = (categoryElm: any, operationType: string, type: string): void => {
    togglePopup(true);
    setCategoryData(categoryElm);
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
    getCategoryList();
  }

  const deactivateCategory = (category: any): void => {
    setInitLoad(true);
    apiDashboard
      .put(`campaign-mgmt-api/configurations/campaigncategories/${category.id}`, {
        active: !category.active
      })
      .then(response => {
        getCategoryList();
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

  const deleteCategory = (category: any): void => {
    setInitLoad(true);
    apiDashboard
      .delete(`campaign-mgmt-api/configurations/campaigncategories/${category.id}`)
      .then(response => {
        setQuery('');
        getCategoryList();
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
            <h1 className="page-title">{t('CATEGORY_MANGEMENT')}</h1>
          </div>
          <div className="header-main-btn">
            <Button onClick={createCategory} variant="contained" color="primary" className="button-lg dark-blue" startIcon={<AddOutlinedIcon fontSize="small" />}>
              {t('CREATE_CATEGORY')}</Button>
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
                    placeholder={t('SEARCH_CATEGORY_BY_NAME')}
                    value={query}
                    size="small"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
                <Divider />
                {paginatedCategoryList.length === 0 ? (
                  <>
                    <div className="alert error lg">
                      <div className="alert-message">{t('CATEGORY_LIST_ERROR')}</div>
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
                          {paginatedCategoryList.map((category, index) => {
                            return (
                              <TableRow hover key={category.id}>
                                <TableCell> {category.name}</TableCell>
                                <TableCell className="checkbox-table-col">
                                  <FormControlLabel
                                    control={<Checkbox color="primary"
                                      name="roles" value={category.id} />}
                                    checked={category.active}
                                    label={''}
                                  /> </TableCell>
                                <TableCell>{category.createdAt ? helper.convertTimestampToDate(category.createdAt) : ''}  </TableCell>
                                <TableCell>{category.updatedAt ? helper.convertTimestampToDate(category.updatedAt) : ''} </TableCell>
                                <TableCell align="left" >
                                  <div className="more-action"><MoreVertIcon onClick={(e) => {
                                    actionListToggle(isShowActionList => !isShowActionList);
                                    setActionListIndex(index);
                                  }} />
                                    {(isShowActionList && actionListIndex === index) && <div className="more-action-dropdown">
                                      <ul ref={ref}>
                                        {category && <li onClick={(e) => openAdminPopup(category, 'Edit', 'Category')} >{t('EDIT')} <EditIcon /></li>}
                                        {category && category.active && <li onClick={(e) => deactivateCategory(category)}> {t('DEACTIVATE')} <FileCopyOutlinedIcon /></li>}
                                        {category && <li onClick={(e) => deleteCategory(category)}>{t('DELETE')} <ArchiveOutlinedIcon /></li>}
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
                        count={filteredCategory.length === 1 ? 1 : Math.ceil(filteredCategory.length / limit)}
                        page={page}
                        onChange={handlePageChange}
                      />
                    </Box>}
                  </>
                )}
              </Card>
            }
            {isOpenPopup && <AdminPopup operationType={operationType} handleOpen={handleOpenModal} rowData={categoryData} type={type} />}
            {successPopup && <SuccessPopup handleOpen={handleOpenModal} type={'Category'} operationType={operationType} />}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default CategoryManagePage;