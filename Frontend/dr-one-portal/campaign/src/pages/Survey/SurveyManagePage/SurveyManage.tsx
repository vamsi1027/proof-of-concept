import React, { useState, useEffect, useContext, useRef } from "react";
import {
    Button, TextField,
    Tab,
    Tabs,
    Typography,
    Box, Paper, InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    Card,
} from "@material-ui/core";
import * as S from "./SurveyManage.style";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { useHistory } from "react-router-dom";
import { Breadcrumb } from "@dr-one/shared-component";
import { userHasPermission } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';
import { GlobalContext } from '../../../context/globalState';
import { Pagination } from "@material-ui/lab";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import ShowLinkedCampaignPopup from "../../../components/Common/SurveyPopup/ShowLinkedCampaignPopup";
import { v4 } from "uuid";
function SurveyManage() {
    const history = useHistory()
    const { t } = useTranslation();
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [initLoad, setInitLoad] = React.useState(true)
    const [surveyData, setSurveyData] = React.useState([])
    const [page, setPage] = React.useState(1)
    const [searchText, setSearchText] = React.useState('')
    const [sortColumn, setSortColumn] = React.useState('createdAt');
    const [sortOrder, setSortOrder] = React.useState('desc');
    const [totalPages, setTotalPage] = React.useState(0);
    const [isShowActionList, actionListToggle] = React.useState(false);
    const [actionListIndex, setActionListIndex] = React.useState(null);
    const [isOpenPopup, togglePopup] = React.useState(false);
    const [surveyRowId, setSurveyRowId] = React.useState('')
    const { dispatch, state } = React.useContext(GlobalContext);
    const ref = useRef<any>();
    const hierarchyList = [t('SURVEY'), t('SURVEY_LIST')];

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
    }, [isShowActionList])

    const getSurveyList = (queryString: any, tabValue: number = null): void => {
        const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
        setShowBackdrop(true);
        apiDashboard
            .get(`campaign-mgmt-api/survey/v2/organization/${organizationId}${queryString}`)
            .then(response => {
                setSurveyData(response.data.data.content);
                setInitLoad(response.data.data.content.length > 0 && false)
                setTotalPage(response.data.data.totalPages)
                setShowBackdrop(false);
            }, error => {
                setShowBackdrop(false);
                setSurveyData([]);
                console.log(helper.getErrorMessage(error));
                setTimeout(() => {
                    setInitLoad(false)
                }, 1000);
            });
    }
    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
        getSurveyList(helper.manipulateQueryString(['ACTIVE'], newPage - 1, 10, sortColumn, sortOrder, encodeURIComponent(helper.trimString(searchText))));
    };

    useEffect(() => {
        getSurveyList(helper.manipulateQueryString(['ACTIVE'], page - 1, 10, 'createdAt', 'desc', encodeURIComponent(helper.trimString(searchText))));
        Mixpanel.track("Survey List Page View");
    }, [])

    const setTableColumn = (sortOrder: string, sortColumn: string) => {
        setSortColumn(sortColumn);
        setSortOrder(sortOrder);
        getSurveyList(helper.manipulateQueryString(['ACTIVE'], page - 1, 10, sortColumn, sortOrder, encodeURIComponent(helper.trimString(searchText))));
    };
    const tableBottomHeight = document.getElementById('table-bottom')?.offsetTop;

    const searchSurvey = (): void => {
        if ((searchText.trim().length > 2) || (searchText.trim().length === 0)) {
            getSurveyList(helper.manipulateQueryString(['ACTIVE'], 0, 10, sortColumn, sortOrder, encodeURIComponent(helper.trimString(searchText))));
            setPage(1);
        }
    }
    const searchSurveyOnEnter = (e): void => {
        if (e.key === "Enter") {
            searchSurvey();
        }
    }
    const handleOpenModal = (value: boolean): void => {
        togglePopup(value);

    }
    const openPopup = (row: any): void => {
        actionListToggle(false);
        togglePopup(true);
        setSurveyRowId(row.id);
        Mixpanel.track(
            "Linked Campaign Action",
            { surveyId: row.id, surveyName: row.title }
        );
    }

    const navigateToCreateNewSurvey = () => {
        Mixpanel.track('Create Survey Action', { page: 'Survey List Page View' });
        history.push('/survey/new');
    }

    React.useEffect(() => {
        const modifiedPayload = Object.assign({}, state.surveyForm);
        modifiedPayload['questionTypeMain'] = 'CHECKBOX',
            modifiedPayload['surveyName'] = '',
            modifiedPayload['surveyDesc'] = '',
            modifiedPayload['surveyUrl'] = '',
            modifiedPayload['questionArrayId'] = [],
            modifiedPayload['welcomeText'] = '',
            modifiedPayload['startButtonText'] = '',
            modifiedPayload['imageFlag'] = true,
            modifiedPayload['surveyFileUploadSection'] = {},
            modifiedPayload['conditionFlag'] = true,
            modifiedPayload['finalTitle'] = '',
            modifiedPayload['finalText'] = '',
            modifiedPayload['addImageLastFlag'] = true,
            modifiedPayload['finalButtonFlag'] = true,
            modifiedPayload['textButton'] = '',
            modifiedPayload['buttonLink'] = '',
            modifiedPayload['surveyLastFileUploadSection'] = {},
            modifiedPayload['cpQuestionLimit'] = '',
            modifiedPayload['surveyQuestionSet'] = [{
                id: helper.generateMongoObjectId(),
                intervalArray: [{ id: '1', name: '1' }],
                interval: '1',
                answerType: '',
                min: '',
                max: '',
                answerOptions: [],
                freeText: '',
                units: '',
                answerSubType: false,
                questionType: 'CHECKBOX',
                questionTitle: '',
                minMaxError: false,
                answerOptionsError: false,
                answerOptionEachLengthErrorFlag: false,
                decimalErrorMin: false,
                decimalErrorMax: false,
                conditionalPathEnable: false,
                conditionalQuestionArray: [],
                path: [],
                randomizeOrder: false,
                defaultTarget: 'SUBMIT',
                answerOptionsWithAlternative: [],
                surveyAlternativeOther: {
                    enable: false,
                    label: 'Other',
                    placeholder: 'Enter your option',
                    mode: 'read',
                    key: 'other'
                },
                surveyAlternativeNoneOfTheAbove: {
                    enable: false,
                    label: 'None of the Above',
                    mode: 'read',
                    key: 'noneOfTheAbove',
                    targetQuestion: ''
                }
            }]
        dispatch({
            type: 'MODIFY_SURVEY_PAYLOAD',
            payload: {
                surveyPayload: modifiedPayload, currentPageName: 'registration',
                surveyBreadCrumbList: ['SURVEY', 'REGISTRATION']
            }
        })
        dispatch({
            type: "CHANGE_PAGE",
            payload: {
                currentPageName: 'registration',
            },
        });
        dispatch({
            type: "ACTIVE_STEPPER",
            surveyBreadCrumbList: ['SURVEY', 'REGISTRATION']
        });
    }, [])

    return (
        <S.Container className="inner-container">
            <Breadcrumb hierarchy={hierarchyList} />
            <div className="mb-20">
                <div>
                    <h1 className="page-title">{t('SURVEY')}</h1>
                </div>
                {userHasPermission(['C_SURVEY', 'C_SURVEY_OWN', 'C_SURVEY_OWN_ORG']) && <div className="header-main-btn">
                    <Button disabled={showBackdrop} variant="contained" onClick={navigateToCreateNewSurvey} color="primary" className="button-lg dark-blue" startIcon={<AddOutlinedIcon fontSize="small" />}>{t('CREATE_SURVEY')}</Button>
                </div>}
                <div className="table-search-wrap">
                    {initLoad && <Typography align="center" color="primary"><CircularProgress color="inherit" /></Typography>}
                    {!initLoad &&
                        <Card>
                            {(searchText || surveyData.length !== 0 || (!searchText)) && <div className="search-box">
                                <Box>
                                    <TextField className="no-margin"
                                        onChange={(e) => setSearchText(e.target.value)}
                                        value={searchText}
                                        onKeyPress={searchSurveyOnEnter}
                                        type="text"
                                        variant="outlined"
                                        aria-describedby="desc-search-text"
                                        placeholder={t('SEARCH_SURVEY')}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchOutlinedIcon onClick={searchSurvey} />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Box>
                            </div>}
                            {surveyData.length !== 0 && <TableContainer component={Paper} className="overflow-table">
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="sort-row">
                                                <span>{t('SURVEY_NAME')}</span>
                                                <div className="sort">
                                                    <ArrowDropUpOutlinedIcon className={(sortColumn === 'title' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'title')} />
                                                    <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'title')} className={(sortColumn === 'title' && sortOrder === 'desc') ? 'active' : ''} />
                                                </div>
                                            </TableCell>
                                            {/* <TableCell align="left" className="sort-row">
                                                <span>{t('SURVEY_STATUS')}</span>
                                                <div className="sort">
                                                    <ArrowDropUpOutlinedIcon className={(sortColumn === 'status' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'status')} />
                                                    <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', 'status')} className={(sortColumn === 'status' && sortOrder === 'desc') ? 'active' : ''} />
                                                </div>
                                            </TableCell> */}
                                            {/* <TableCell align="left" className="sort-row"><span>{t('SURVEY_DESC')}</span></TableCell>
                                <TableCell align="left" className="sort-row"><span>{t('SURVEY_URL')}</span></TableCell> */}
                                            {/* <TableCell align="left">{t('STATUS')}</TableCell> */}
                                            <TableCell align="left" className="sort-row">
                                                <span>{t('SURVEY_CTREATED_AT')}</span>
                                                <div className="sort">
                                                    <ArrowDropUpOutlinedIcon className={(sortColumn === 'createdAt' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'createdAt')} />
                                                    <ArrowDropDownOutlinedIcon className={(sortColumn === 'createdAt' && sortOrder === 'desc') ? 'active' : ''} onClick={(e) => setTableColumn('desc', 'createdAt')} />
                                                </div>
                                            </TableCell>
                                            <TableCell align="left" className="sort-row">
                                                <span>{t('CREATOR')}</span>
                                                {/* <div className="sort">
                                                    <ArrowDropUpOutlinedIcon className={(sortColumn === 'userName' && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', 'userName')} />
                                                    <ArrowDropDownOutlinedIcon className={(sortColumn === 'userName' && sortOrder === 'desc') ? 'active' : ''} onClick={(e) => setTableColumn('desc', 'userName')} />
                                                </div> */}
                                            </TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {surveyData
                                            .map((row, index) => (
                                                <TableRow key={index} data-id={row.id}>
                                                    <TableCell scope="row">
                                                        <span className="camp-name">{row.title}</span>
                                                    </TableCell>
                                                    {/* <TableCell align="left">{row?.status}</TableCell> */}
                                                    {/* <TableCell align="left">{row?.description}</TableCell>
                                        <TableCell align="left">{row?.termsAndConditions}</TableCell> */}
                                                    <TableCell align="left"> {helper.timestampToDateString(row.createdAt * 1000)} </TableCell>
                                                    <TableCell align="left">{row?.userName}</TableCell>
                                                    <TableCell align="right" >
                                                        <div className="more-action"><MoreVertIcon onClick={(e) => {
                                                            actionListToggle(isShowActionList => !isShowActionList);
                                                            setActionListIndex(index);
                                                        }} />
                                                            {(isShowActionList && actionListIndex === index) && <div className={(tableBottomHeight - document.getElementById(`${row.id}`)?.offsetTop > 280) ? 'more-action-dropdown' : "more-action-dropdown position-top"}>
                                                                <ul ref={ref}>
                                                                    <li onClick={(e) => openPopup(row)} >{t('SHOW_LINKED_CAMPAIGN')}</li>
                                                                </ul>
                                                            </div>}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                                <Pagination count={totalPages} onChange={handleChangePage} page={page} />
                            </TableContainer>}
                        </Card>}
                    <Divider id="table-bottom" />
                    {(!showBackdrop && surveyData.length === 0) && <div className="alert error lg">
                        <div className="alert-message">{t('SURVEY_LIST_ERROR')}</div>
                    </div>}
                    {surveyData.length > 0 && showBackdrop && <div className='pagination-loader-wrapper'>
                        <div className="pagination-loader">
                            <CircularProgress color="primary" />
                        </div>
                    </div>}
                </div>
            </div>
            {isOpenPopup && <ShowLinkedCampaignPopup handleOpen={handleOpenModal} rowId={surveyRowId} />}
        </S.Container >
    )
}
export default SurveyManage
