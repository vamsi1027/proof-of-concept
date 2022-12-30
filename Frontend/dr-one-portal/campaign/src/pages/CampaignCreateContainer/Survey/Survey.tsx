import React, { useState, useContext, useEffect, useCallback } from "react";
import * as S from "./Surve.styles";
import {
    Grid,
    Button,
    TextField
} from "@material-ui/core";
import { Autocomplete } from '@material-ui/lab';
import { GlobalContext } from '../../../context/globalState';
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";;
import { MobilePreview } from "@dr-one/shared-component";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import QuestionForm from '../../../components/Common/QuestionForm/QuestionForm';
import { v1 } from "uuid";

function Survey() {
    const { dispatch } = useContext(GlobalContext);
    const { state } = useContext(GlobalContext);
    const { t } = useTranslation();
    const [selectedSurvey, setSurvey] = useState(state.formValues.creative.selectedSurvey);
    const [surveyName, setSurveyName] = useState('');
    const [surveyList, setSurveyList] = useState([]);
    const [noDataFlag, setNoDataFlag] = useState(false);
    const [surveyError, setSurveyRequireError] = useState(state.formValues.creative.selectedSurvey && Object.keys(state.formValues.creative.selectedSurvey).length === 0 ? true : false);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [surveyData, setSurveyData] = useState<any>(Object);

    const [page, setPage] = useState(0);
    const [loader, setLoader] = useState(false);
    const loading = open && (options.length === 0 || loader);
    const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;

    useEffect(() => {
        if (state.formValues.creative.selectedSurvey && Object.keys(state.formValues.creative.selectedSurvey).length !== 0) {
            const questionArrayHasString = state.formValues.creative.selectedSurvey.questions.every((question: any) => typeof question === 'string');
            if (questionArrayHasString) {
                apiDashboard.get(`campaign-mgmt-api/questions/list/${state.formValues.creative.selectedSurvey.questions.toString()}`).then((res: any) => {
                    modifyQuestionDataAndDispatchActions(res.data.data);
                }, error => {
                    dispatch({
                        type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                        payload: {
                            campaignPayload: Object.assign({}, state.formValues),
                            currentPageName: 'survey',
                            campaignBreadCrumbList: state.campaignBreadCrumbList,
                            campaignStepsArray: state.campaignStepsArray
                        }
                    })
                });
            } else {
                modifyQuestionDataAndDispatchActions(state.formValues.creative.selectedSurvey.questions);
            }
        }
    }, [state.formValues.creative.selectedSurvey])

    const modifyQuestionDataAndDispatchActions = (questionData: any): void => {
        const modifiedPayload = Object.assign({}, state.formValues);
        const modifiedSurveyData = Object.assign({}, state.surveyForm);
        const questionArray = JSON.parse(JSON.stringify(questionData));

        questionArray.forEach((question: any, i: number) => {
            if (question.answerType === 'DROPDOWN') {
                if (question.other?.enabled) {
                    questionArray[i].answerOptions.push(question.other?.label);
                }
                if (question.noneOfTheAbove?.enabled) {
                    questionArray[i].answerOptions.push(question.noneOfTheAbove?.label);
                }
                questionArray[i]['answerOptions'].unshift(t('SURVEY_QUESTION_TYPE_DROPDOWN_DEFAULT_OPTION'));
            }
            if (question.answerType === 'RADIOBUTTON' || question.answerType === 'CHECKBOX') {
                if (question.other?.enabled) {
                    questionArray[i].answerOptions.push(question.other?.label);
                }
                if (question.noneOfTheAbove?.enabled) {
                    questionArray[i].answerOptions.push(question.noneOfTheAbove?.label);
                }
            }
        })
        let modifiedQuestionArrayForQuestionPreview = [];
        function getPathArrayList(pathArray, questionListArray, pathFilterArray) {
            let questionKeyObject = questionListArray.reduce((obj, value) => {
                obj[value.id] = value;
                return obj;
            }, {})
            let questionPathListArray = [];
            if (pathArray?.routeOptions?.type === 'C') {
                pathFilterArray?.forEach((pathId, pathindex) => {
                    if (pathId?.target === 'SUBMIT') {
                        questionPathListArray.push({
                            questionTitle: 'Submit',
                            questionIndex: pathindex,
                            questionId: -1,
                            target: -1
                        })
                    } else {
                        questionPathListArray.push({
                            target: pathId.target,
                            questionId: pathId.target,
                            questionIndex: pathindex,
                            questionTitle: questionKeyObject[pathId.target]?.question
                        })
                    }
                })
            }
            return questionPathListArray;
        }
        questionData.forEach((question, i) => {
            let noneOfAbove: any = [];
            let pathArrayFilteredList = [];
            if (question?.routeOptions?.type === 'C') {
                pathArrayFilteredList = getPathArrayList(question, questionArray, question?.routeOptions?.path);
            }
            if (question?.noneOfTheAbove?.enabled) {
                noneOfAbove = getPathArrayList(question, questionArray, question?.routeOptions?.path).slice(-1)[0]
            }
            modifiedQuestionArrayForQuestionPreview.push({
                questionType: question.answerType,
                answerType: question.answerType,
                answerOptionsError: false,
                answerOptions: question.answerOptions,
                questionTitle: question.question,
                createdAt: question.createdAt,
                id: question.id,
                organizationId: question.organizationId,
                updatedAt: question.updatedAt,
                userId: question.userId,
                units: question.hasOwnProperty('units') ? question.units : '',
                interval: question.answerType === 'SLIDER' ? question.answerOptions[2] : '1',
                min: question.answerType === 'SLIDER' ? question.answerOptions[0] : '',
                max: question.answerType === 'SLIDER' ? question.answerOptions[1] : '',
                freeText: (question.answerType === 'FREETEXT' && question.answerOptions !== null && question.answerOptions.length === 2)
                    ? question.answerOptions[1] : '',
                answerSubType: (question.answerType === 'SLIDER' && question.answerSubType === 'RANGE_DECIMAL') ? true : false,
                answerSubTypeApi: question.answerSubType,
                surveyAlternativeOther: {
                    enable: question.other && question.other.enabled ? true : false,
                    label: question.other ? question.other.label : '',
                    placeholder: question.other ? question.other.hint : '',
                    mode: 'read',
                    key: 'other'
                },
                surveyAlternativeNoneOfTheAbove: {
                    enable: question.noneOfTheAbove && question.noneOfTheAbove.enabled ? true : false,
                    label: question.noneOfTheAbove ? question.noneOfTheAbove.label : '',
                    mode: 'read',
                    targetQuestion: noneOfAbove?.target,
                    key: 'noneOfTheAbove'
                },
                answerOptionsWithAlternative: question.other ? [{
                    enable: true,
                    label: question.other ? question.other.label : '',
                    placeholder: question.other ? question.other.hint : '',
                    mode: 'read',
                    key: 'other'
                }] : question.noneOfTheAbove ? [{
                    enable: true,
                    label: question.noneOfTheAbove ? question.noneOfTheAbove.label : '',
                    mode: 'read',
                    key: 'noneOfTheAbove'
                }] : [],
                path: pathArrayFilteredList,
                conditionalPathEnable: !question.routeOptions ? false : question.routeOptions.type === 'C' ? true : false,
                conditionalQuestionArray: pathArrayFilteredList,
                randomizeOrder: question.randomize ? question.randomize : false
            })
        })

        modifiedPayload['creative']['surveyQuestionDetails'] = questionArray;

        dispatch({
            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
            payload: {
                campaignPayload: modifiedPayload,
                currentPageName: 'survey',
                campaignBreadCrumbList: state.campaignBreadCrumbList,
                campaignStepsArray: state.campaignStepsArray
            }
        })
        const isSurveySubmittedTypeQuestionPresent = modifiedQuestionArrayForQuestionPreview.findIndex(question => question.answerType === 'surveySubmitted');
        const isSurveyWelcomeTypeQuestionPresent = modifiedQuestionArrayForQuestionPreview.findIndex(question => question.answerType === 'surveyWelcome');
        if (isSurveySubmittedTypeQuestionPresent > -1) {
            modifiedQuestionArrayForQuestionPreview = modifiedQuestionArrayForQuestionPreview.filter(question => question.answerType !== 'surveySubmitted')
        }
        if (isSurveyWelcomeTypeQuestionPresent > -1) {
            modifiedQuestionArrayForQuestionPreview = modifiedQuestionArrayForQuestionPreview.filter(question => question.answerType !== 'surveyWelcome')
        }

        modifiedSurveyData['surveyQuestionSet'] = modifiedQuestionArrayForQuestionPreview;
        dispatch({
            type: CAMPAIGN_ACTIONS.MODIFY_SURVEY_PAYLOAD,
            payload: {
                surveyPayload: modifiedSurveyData, currentPageName: 'registration',
                surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
            }
        })
    }

    const handleChangeSurvey = (surveyName: string) => {
        if (surveyName.length >= 3) {
            apiDashboard
                .get('campaign-mgmt-api/survey?filter=' + encodeURIComponent(helper.trimString(surveyName)))
                .then(response => {
                    if (response.data.data.length !== 0) {
                        setSurveyList(response.data.data);
                        setNoDataFlag(false);
                        setOptions(response.data.data);
                    } else {
                        setNoDataFlag(true);
                    }
                }, error => {
                    console.log(helper.getErrorMessage(error));
                    setNoDataFlag(true);
                    setSurveyList([]);
                    setOptions([]);
                });
        } else {
            setSurveyList([]);
            if (surveyName.length === 0) {
                setOptions([]);
                getSurveyData(0);
            }

        }
    }

    const debounceOnChangeSurvey = useCallback(helper.debounce(handleChangeSurvey, 600), []);

    const modifyCampaignType = (campaignType: string): string => {
        if (campaignType === 'push' || campaignType === 'pushInApp') {
            return 'PUSH';
        } else if (campaignType === 'inApp') {
            return 'IN-APP';
        }
    }

    const updateSurveySectionPayload = (payload: any, section: string): void => {
        dispatch({
            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
            payload: {
                campaignPayload: payload, currentPageName: section,
                campaignBreadCrumbList: (section === 'creative' || section === 'secondaryCreative') ? ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE'] : ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SURVEY', 'SETTINGS'],
                campaignStepsArray: state.campaignStepsArray
            }
        })

        switch (section) {
            case 'creative':
                Mixpanel.track("Create Campaign Page View", { "page": "Creative - Push" });
                break;
            case 'settings':
                Mixpanel.track("Create Campaign Page View", { "page": "Settings" });
                break;
            case 'secondaryCreative':
                Mixpanel.track("Create Campaign Page View", { "page": "Creative - In App" });
                break;
        }
    }

    useEffect(() => {
        getSurveyData(0);
    }, []);

    const getSurveyData = (page: number): void => {
        setLoader(true);
        apiDashboard.get(`campaign-mgmt-api/survey/v2/organization/${organizationId}?status=ACTIVE&page=${page}&page-size=10&sort=createdAt&sort-order=desc`).then(response => {
            setOptions(options.concat(response.data.data.content));
            setSurveyData(response.data.data);
            setLoader(false);
        }, error => {
            setLoader(false);
        });
    }

    const handleChange = () => { }

    const handleBlur = () => { }

    const remove = () => { }

    return (
        <Grid container spacing={3}>
            <Grid item md={8} xs={12}>
                <S.Container>
                    <div className="cc-form-wrapper" >
                        <div className="cr-top-main">
                            <div className="cr-top-wrapper">
                                <h5 className="title-padding">{t('SURVEY')}</h5>
                                <hr />
                                <div className="cr-body-content">
                                    <Grid container>
                                        <div className="row">
                                            <Grid item xs={12} sm={12}>
                                                <div className="auto-complete-field vertical-align">
                                                    {/* <Autocomplete id="checkboxes-tags-demo"
                                                        options={surveyList.length > 0 ? surveyList : []}
                                                        disableCloseOnSelect={false}
                                                        value={selectedSurvey}
                                                        freeSolo={true}
                                                        getOptionLabel={(option: any) => option.title || ''}
                                                        onChange={(e, newValue) => {
                                                            setSurvey(newValue ? newValue : {});
                                                            if (!newValue) {
                                                                setSurveyRequireError(true);
                                                            } else {
                                                                setSurveyRequireError(false);
                                                            }
                                                            const modifiedPayload = Object.assign({}, state.formValues);
                                                            modifiedPayload['creative']['selectedSurvey'] = newValue ? newValue : {};
                                                            if (!newValue) {
                                                                modifiedPayload['creative']['surveyQuestionDetails'] = [];
                                                            }

                                                            dispatch({
                                                                type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                                                                payload: {
                                                                    campaignPayload: modifiedPayload, currentPageName: 'survey',
                                                                    campaignBreadCrumbList: state.campaignBreadCrumbList,
                                                                    campaignStepsArray: state.campaignStepsArray
                                                                }
                                                            })
                                                        }}

                                                        renderOption={(option, { selected }) => (
                                                            <React.Fragment>
                                                                <div className="select-list">
                                                                    <span>{option.title}</span>
                                                                </div>
                                                            </React.Fragment>
                                                        )}

                                                        renderInput={(params) => (
                                                            <TextField {...params} variant="outlined"
                                                                placeholder={t('SURVEY_PLACEHOLDER')}
                                                                name="surveyName"
                                                                value={surveyName}
                                                                onChange={(e) => {
                                                                    setSurveyName(e.target.value);
                                                                    debounceOnChangeSurvey(e.currentTarget.value);
                                                                }}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                label={<div className="label-tooltip">{`${t('SURVEY_LABEL')} *`}
                                                                </div>} />

                                                        )}
                                                    /> */}
                                                    <Autocomplete
                                                        id="asynchronous-demo"
                                                        // open={open}
                                                        onOpen={() => {
                                                            setOpen(true);
                                                        }}
                                                        onClose={() => {
                                                            setOpen(false);
                                                        }}
                                                        clearOnBlur={false}

                                                        // getOptionSelected={(option, value) => option.name === value.name}
                                                        getOptionLabel={(option) => option.title || ''}
                                                        options={options}
                                                        loading={loading}
                                                        value={selectedSurvey}
                                                        ListboxProps={{
                                                            onScroll: (event) => {
                                                                const listboxNode = event.currentTarget;
                                                                if (
                                                                    listboxNode.scrollTop + listboxNode.clientHeight ===
                                                                    listboxNode.scrollHeight && !surveyData.last &&
                                                                    (surveyList?.length === 0 || surveyName?.length === 0)
                                                                ) {
                                                                    getSurveyData(page + 1);
                                                                    setPage((page) => page + 1);
                                                                }
                                                            }
                                                        }}
                                                        onChange={(e, newValue) => {
                                                            setSurvey(newValue ? newValue : {});
                                                            if (!newValue) {
                                                                setSurveyRequireError(true);
                                                            } else {
                                                                setSurveyRequireError(false);
                                                            }
                                                            const modifiedPayload = Object.assign({}, state.formValues);
                                                            if (newValue) {
                                                                const isSurveyAlternativeOtherOptionPresent = newValue.questions.filter(question => question.other !== null);
                                                                const isSurveyAlternativeNoneOfTheAbovePresent = newValue.questions.filter(question => question.noneOfTheAbove !== null);
                                                                const isRouteOptionsPresentArray = newValue.questions.filter(question => question.routeOptions !== null);

                                                                if (isSurveyAlternativeOtherOptionPresent.length !== 0 || isSurveyAlternativeNoneOfTheAbovePresent.length !== 0) {
                                                                    modifiedPayload['template']['targetSDKVersion'] = '4.5.0';
                                                                } else {
                                                                    if (isRouteOptionsPresentArray.length !== 0) {
                                                                        const isConditionalPathQuestionPresent = isRouteOptionsPresentArray.some(question => question.routeOptions.type === 'C');
                                                                        if (isConditionalPathQuestionPresent) {
                                                                            modifiedPayload['template']['targetSDKVersion'] = '4.5.0';
                                                                        } else {
                                                                            modifiedPayload['template']['targetSDKVersion'] = '3.2.0';
                                                                        }
                                                                    } else {
                                                                        modifiedPayload['template']['targetSDKVersion'] = '3.2.0';
                                                                    }
                                                                }
                                                            } else {
                                                                modifiedPayload['template']['targetSDKVersion'] = '3.2.0';
                                                            }
                                                            modifiedPayload['creative']['selectedSurvey'] = newValue ? newValue : {};
                                                            if (!newValue) {
                                                                modifiedPayload['creative']['surveyQuestionDetails'] = [];
                                                            }

                                                            dispatch({
                                                                type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                                                                payload: {
                                                                    campaignPayload: modifiedPayload, currentPageName: 'survey',
                                                                    campaignBreadCrumbList: state.campaignBreadCrumbList,
                                                                    campaignStepsArray: state.campaignStepsArray
                                                                }
                                                            })
                                                        }}

                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                label={<div className="label-tooltip">{`${t('SURVEY_LABEL')} *`}
                                                                    {/* <LightTooltip title={<label>{t('TOOLTIP_FOR_CTA')}</label>} /> */}
                                                                </div>}
                                                                variant="outlined"
                                                                onChange={(e) => {
                                                                    setSurveyName(e.target.value);
                                                                    debounceOnChangeSurvey(e.currentTarget.value);
                                                                }}
                                                                placeholder={t('SURVEY_PLACEHOLDER')}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    endAdornment: (
                                                                        <React.Fragment>
                                                                            {loading ? <CircularProgress color="primary" size={20} /> : null}
                                                                            {params.InputProps.endAdornment}
                                                                        </React.Fragment>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    {noDataFlag && <p >{t('SEARCH_LIST_EMPTY_MESSAGE')}</p>}
                                                    {surveyError && <p className="error-wrap error">{t('SURVEY_REQUIRED_ERROR')}</p>}
                                                </div>
                                            </Grid>
                                        </div>
                                        {(Object.keys(selectedSurvey).length !== 0 && state.surveyForm?.surveyQuestionSet?.length !== 0) && <Grid>
                                            {state.surveyForm.surveyQuestionSet.map((question, index) => (
                                                <div className="survey-question-section" key={index}>
                                                    <QuestionForm
                                                        values={{}}
                                                        handleChange={handleChange}
                                                        touched={false}
                                                        errors={{}}
                                                        index={index}
                                                        ques={question}
                                                        handleBlur={handleBlur}
                                                        formMode="READ_ONLY"
                                                        remove={remove}
                                                        id={question?.id}
                                                    />
                                                </div>
                                            ))}
                                        </Grid>}
                                    </Grid>
                                </div>
                            </div>
                        </div>

                        <div className="cc-global-buttons registration-btn">
                            <Button
                                variant="outlined"
                                color="primary"
                                className="button-xs"
                                type="button" onClick={(e) => updateSurveySectionPayload(state.formValues, state.formValues.registration.campaignType === 'pushInApp' ? 'secondaryCreative' : 'creative')}>
                                {t('BACK_BUTTON')}
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                onClick={(e) => updateSurveySectionPayload(state.formValues, 'settings')}
                                startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                                disabled={Object.keys(selectedSurvey).length === 0}
                            >
                                {t('CONTINUE_BUTTON')}
                            </Button>
                        </div>
                    </div>
                </S.Container>
            </Grid >

            <Grid item md={4} xs={12} id="surveyPreview">
                <MobilePreview template={'SURVEY'}
                    format={modifyCampaignType(state.formValues.registration.campaignType)}
                    objectiveType={state.formValues.registration.campaignObjectiveName}
                    surveyData={state.formValues.creative.selectedSurvey}
                    questionDetails={state.formValues.creative.surveyQuestionDetails}
                    width={document.getElementById('surveyPreview')?.clientWidth}
                    campaignType={state.formValues.registration.campaignType === 'pushInApp' ? 'PUSH_INAPP' : state.formValues.registration.campaignType?.toUpperCase()}
                    message={{
                        title: '',
                        body: '',
                        text: '',
                        button: [],
                        icon: state.formValues.creative.iconUploadOptions ? state.formValues.creative.notificationImageContent?.imageUrl : '',
                        banner: ''
                    }}
                />
            </Grid>
        </Grid >
    );
}

export default Survey;
