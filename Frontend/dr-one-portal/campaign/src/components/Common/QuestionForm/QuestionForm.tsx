import React, { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import {
    Grid, TextField, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Radio,
    FormGroup, Checkbox, Typography, Button, FormHelperText, Switch, Tooltip
} from '@material-ui/core'
import * as S from "./QuestionForm.style";
import { GlobalContext } from '../../../context/globalState';
import { getIn } from 'formik';
// import { makeStyles } from '@material-ui/core/styles';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import EditIcon from '@material-ui/icons/Edit';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { LightTooltip, SnackBarMessage } from '@dr-one/shared-component';
import SurveyAlternativePopup from '../SurveyAlternativePopup/SurveyAlternativePopup';

function QuestionForm({ id, remove, formMode, handleBlur, touched, errors, index, values, handleChange, ques, ...props }) {
    const { t } = useTranslation();
    const { dispatch, state } = useContext(GlobalContext);

    const [questionTitles, setQuestionTitle] = React.useState(state?.question)
    const [questionType, setQuestionType] = React.useState(state?.surveyForm?.questionTypeMain);
    const [selectOneOption, setSelectOneOption] = React.useState('')
    const [selectOneOptionList, setSelectOneOptionList] = React.useState([])
    const [checkBoxOptionList, setCheckBoxOptionList] = React.useState([])
    const [checkBoxOption, setCheckBoxOption] = React.useState('')
    const [dropDownOptionList, setDropDownOptionList] = React.useState([])
    const [dropDownBoxOption, setDropDownBoxOption] = React.useState('')
    const [minimumValue, setMinimumValue] = React.useState(state?.surveyForm?.surveyQuestionSet[index]?.min);
    const [maximumValue, setMaximumValue] = React.useState(state?.surveyForm?.surveyQuestionSet[index]?.max)
    const [freeText, setFreeText] = React.useState('')
    const [interval, setInterval] = React.useState(state?.surveyForm.surveyQuestionSet[index]?.interval)
    const [units, setUnits] = React.useState(state?.surveyForm.surveyQuestionSet[index]?.units)
    const [prevSelected, setPrevSelected] = React.useState('')
    // const classes = useStyles();
    const [maxValueError, setMaxValueError] = React.useState(false)
    let intervalArray = state?.surveyForm?.intervalArray;
    const [intervalArrayList, setIntervalArrayList] = React.useState(state?.surveyForm?.surveyQuestionSet[index]?.intervalArray)
    const [decimalValue, setDecimalValue] = React.useState(false)
    const [snackbar, setSnackbar] = React.useState(false);
    const [snackBarMessageForNormalQues, setSnackBarMessageForNormalQues] = React.useState('');
    const [snackBarFlag, setSnackBarFlag] = React.useState(false);
    const [snackBarMessageForCPQues, setSnackBarMessageForCPQues] = React.useState('');
    const [showLoader, toggleLoader] = React.useState(false);
    const [isQuestionCP, setIsQuestionCP] = React.useState(false)
    const [isOptionQuestionCP, setIsOptionQuestionCP] = React.useState(false)
    const [otherError, setOtherError] = React.useState(false)
    // const [validFormFlag, setvalidFormFlag] = React.useState([])

    // const [maxDecimal, setMaxDecimal] = React.useState(false)
    // const [minDecimal, setMinDecimal] = React.useState(false)
    let maxError = false;
    let minError = false;
    let questionNumber = index
    const questionTitleName = `surveyQuestionSet[${index}].questionTitle`;
    const touchedQuestion = getIn(touched, questionTitleName);
    const errorQuestion = getIn(errors, questionTitleName);

    const questionMin = `surveyQuestionSet[${index}].min`;
    const touchedMin = getIn(touched, questionMin);
    const errorMin = getIn(errors, questionMin);

    const questionMax = `surveyQuestionSet[${index}].max`;
    const touchedMax = getIn(touched, questionMax);
    const errorMax = getIn(errors, questionMax);

    const quesFreeText = `surveyQuestionSet[${index}].freeText`
    const touchedFreeText = getIn(touched, quesFreeText);
    const errorFreeText = getIn(errors, quesFreeText);

    const quesUnits = `surveyQuestionSet[${index}].units`
    const touchedUnits = getIn(touched, quesUnits);
    const errorUnits = getIn(errors, quesUnits);
    const questionTypeList = [
        { id: "CHECKBOX", name: "Checkbox(Select Many)" },
        { id: "DROPDOWN", name: "Dropdown" },
        { id: "RADIOBUTTON", name: "Radio Button(Select One)" },
        { id: "SLIDER", name: "Slider" },
        { id: "FREETEXT", name: "Text" }
    ];

    const intervalDecimalArray = [{ id: '1', name: '1' }, { id: '2', name: '2' }, { id: '3', name: '3' }, { id: '4', name: '4' },
    { id: '5', name: '5' }, { id: '6', name: '6' }, { id: '7', name: '7' }, { id: '8', name: '8' }, { id: '9', name: '9' },
    { id: '10', name: '10' }, { id: '15', name: '15' }, { id: '20', name: '20' }, { id: '25', name: '25' }, { id: '30', name: '30' },
    { id: '40', name: '40' }, { id: '50', name: '50' }];

    function uniqueArrayList(array) {
        const entries = array
            .slice()
            .reverse()
            .map((string, index) => [
                string.toLowerCase(),
                {
                    string,
                    index: array.length - 1 - index
                }
            ]);
        let uniqueOptionList = Array
            .from((new Map(entries)).values())
            .sort((a: any, b: any) => (a.index - b.index))
            .map((item: any) => item.string);
        if (state.surveyForm.surveyQuestionSet[index].surveyAlternativeOther?.enable) {
            uniqueOptionList = uniqueOptionList.filter(answer => answer.toLowerCase() !== state.surveyForm.surveyQuestionSet[index].surveyAlternativeOther.label.toLowerCase());
        }
        if (state.surveyForm.surveyQuestionSet[index].surveyAlternativeNoneOfTheAbove?.enable) {
            uniqueOptionList = uniqueOptionList.filter(answer => answer.toLowerCase() !== state.surveyForm.surveyQuestionSet[index].surveyAlternativeNoneOfTheAbove.label.toLowerCase());
        }
        return uniqueOptionList;
    }

    const onKeyEnterRadioAddOption = (e) => {
        if (e.key === "Enter" && selectOneOption.trim()) {
            const selectOneOptionsLists = [...selectOneOptionList]
            selectOneOptionsLists.push(selectOneOption);
            setSelectOneOptionList(selectOneOptionsLists);
            const hasAnswerOptionEachLengthGreater = selectOneOptionsLists.filter(val => val.length > 50);
            let answerOptionEachLengthErrorFlag;
            if (hasAnswerOptionEachLengthGreater.length === 0) {
                answerOptionEachLengthErrorFlag = false;
            } else {
                answerOptionEachLengthErrorFlag = true;
            }
            const modifiedPayload = Object.assign({}, state.surveyForm)
            modifiedPayload['surveyQuestionSet'][index]['answerOptions'] = uniqueArrayList(selectOneOptionsLists)
            modifiedPayload['surveyQuestionSet'][index]['answerOptionsError'] = uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length > 6 ? true : false;
            modifiedPayload['surveyQuestionSet'][index]['answerOptionEachLengthErrorFlag'] = answerOptionEachLengthErrorFlag;
            modifiedPayload['surveyQuestionSet'] = props?.getQuestionListWithLink(modifiedPayload['surveyQuestionSet']);
            // if (modifiedPayload['surveyQuestionSet'][index]['conditionalPathEnable']) {
            //     modifiedPayload['surveyQuestionSet'][index]['path'].push(modifiedPayload['surveyQuestionSet'][index]['path'][0])
            // }
            dispatch({
                type: 'MODIFY_SURVEY_PAYLOAD',
                payload: {
                    surveyPayload: getQuestionListForConditionalPathing(modifiedPayload), currentPageName: 'question',
                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                }
            })
            setSelectOneOption('')
            surveyFormValidation();
        }
    }
    const onRemoveSelectOneOptions = (label, option): void => {
        const modifiedPayload = Object.assign({}, state.surveyForm);
        const options = modifiedPayload['surveyQuestionSet'][index]['answerOptions'];
        const hasAnswerOptionEachLengthGreater = options.filter(val => val.length > 50);
        let answerOptionEachLengthErrorFlag;
        if (hasAnswerOptionEachLengthGreater.length === 0 || hasAnswerOptionEachLengthGreater.length < 50) {
            answerOptionEachLengthErrorFlag = false;
        } else {
            answerOptionEachLengthErrorFlag = true;
        }
        let modifiedPath = modifiedPayload['surveyQuestionSet'][index]['path'];

        if (state.surveyForm.surveyQuestionSet[index]['questionType'] === 'DROPDOWN') {
            dropDownOptionList.splice(option, 1);
            modifiedPath = modifiedPath.filter(pathItem => {
                return pathItem.option !== label;
            })
        }
        if (state.surveyForm.surveyQuestionSet[index]['questionType'] === 'CHECKBOX') {
            checkBoxOptionList.splice(option, 1);
        }

        if (state.surveyForm.surveyQuestionSet[index]['questionType'] === 'RADIOBUTTON') {
            selectOneOptionList.splice(option, 1);
            modifiedPath = modifiedPath.filter(pathItem => {
                return pathItem.option !== label;
            })

        }
        modifiedPayload['surveyQuestionSet'][index]['answerOptions'].splice(option, 1)
        modifiedPayload['surveyQuestionSet'][index]['answerOptionsError'] = uniqueArrayList(options).length > 6 ? true : false;
        modifiedPayload['surveyQuestionSet'][index]['answerOptionEachLengthErrorFlag'] = answerOptionEachLengthErrorFlag;
        modifiedPayload['surveyQuestionSet'][index]['path'] = modifiedPath;
        modifiedPayload['surveyQuestionSet'] = props.getQuestionListWithLink(modifiedPayload['surveyQuestionSet'])
        dispatch({
            type: 'MODIFY_SURVEY_PAYLOAD',
            payload: {
                surveyPayload: modifiedPayload, currentPageName: 'question',
                surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
            }
        })
        surveyFormValidation();
    }
    const onKeyEnterCheckBoxAddOption = (e) => {
        if (e.key === "Enter" && checkBoxOption.trim()) {
            const checkBoxOptionsLists = [...checkBoxOptionList]
            checkBoxOptionsLists.push(checkBoxOption);
            setCheckBoxOptionList(checkBoxOptionsLists);
            const hasAnswerOptionEachLengthGreater = checkBoxOptionsLists.filter(val => val.length > 50);
            let answerOptionEachLengthErrorFlag;
            if (hasAnswerOptionEachLengthGreater.length === 0) {
                answerOptionEachLengthErrorFlag = false;
            } else {
                answerOptionEachLengthErrorFlag = true;
            }
            const modifiedPayload = Object.assign({}, state.surveyForm)
            modifiedPayload['surveyQuestionSet'][index]['answerOptions'] = uniqueArrayList(checkBoxOptionsLists)
            modifiedPayload['surveyQuestionSet'][index]['answerOptionsError'] = uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length > 6 ? true : false
            modifiedPayload['surveyQuestionSet'][index]['answerOptionEachLengthErrorFlag'] = answerOptionEachLengthErrorFlag;
            modifiedPayload['surveyQuestionSet'] = props?.getQuestionListWithLink(modifiedPayload['surveyQuestionSet']);
            dispatch({
                type: 'MODIFY_SURVEY_PAYLOAD',
                payload: {
                    surveyPayload: getQuestionListForConditionalPathing(modifiedPayload), currentPageName: 'question',
                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                }
            })
            setCheckBoxOption('')
            surveyFormValidation();
        }
    }

    const onKeyEnterDropDownAddOption = (e) => {
        if (e.key === "Enter" && dropDownBoxOption.trim()) {
            const dropDownOptionsLists = [...dropDownOptionList]
            dropDownOptionsLists.push(dropDownBoxOption);
            setDropDownOptionList(dropDownOptionsLists);
            const hasAnswerOptionEachLengthGreater = dropDownOptionsLists.filter(val => val.length > 50);
            let answerOptionEachLengthErrorFlag;
            if (hasAnswerOptionEachLengthGreater.length === 0) {
                answerOptionEachLengthErrorFlag = false;
            } else {
                answerOptionEachLengthErrorFlag = true;
            }
            const modifiedPayload = Object.assign({}, state.surveyForm)
            modifiedPayload['surveyQuestionSet'][index]['answerOptions'] = uniqueArrayList(dropDownOptionsLists)
            modifiedPayload['surveyQuestionSet'][index]['answerOptionsError'] = false;
            modifiedPayload['surveyQuestionSet'][index]['answerOptionEachLengthErrorFlag'] = answerOptionEachLengthErrorFlag;
            modifiedPayload['surveyQuestionSet'] = props?.getQuestionListWithLink(modifiedPayload['surveyQuestionSet']);
            // if (modifiedPayload['surveyQuestionSet'][index]['conditionalPathEnable']) {
            //     modifiedPayload['surveyQuestionSet'][index]['path'].push(modifiedPayload['surveyQuestionSet'][index]['path'][0])
            // }
            dispatch({
                type: 'MODIFY_SURVEY_PAYLOAD',
                payload: {
                    surveyPayload: modifiedPayload, currentPageName: 'question',
                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                }
            })
            setDropDownBoxOption('')
            surveyFormValidation();
        }
    }

    function surveyFormValidation() {
        let isValid = false;
        if (index < state.surveyForm.surveyQuestionSet.length) {
            if (state.surveyForm.surveyQuestionSet[index]['questionTitle']?.length === 0 ||
                state.surveyForm.surveyQuestionSet[index]['questionTitle']?.length > 400) {
                isValid = false;
            } else {
                if ((state.surveyForm.surveyQuestionSet[index]['questionType'] === 'DROPDOWN' ||
                    state.surveyForm.surveyQuestionSet[index]['questionType'] === 'RADIOBUTTON' ||
                    state.surveyForm.surveyQuestionSet[index]['questionType'] === 'CHECKBOX') &&
                    state.surveyForm?.surveyQuestionSet[index]?.answerOptions.length !== 0) {
                    if (state.surveyForm?.surveyQuestionSet[index]?.answerOptionsError || state.surveyForm?.surveyQuestionSet[index]?.answerOptionEachLengthErrorFlag) {
                        isValid = false;
                    } else {
                        isValid = true;
                    }
                } else if (state?.surveyForm?.surveyQuestionSet[index]['questionType'] === 'SLIDER') {
                    if (state.surveyForm.surveyQuestionSet[index]['questionTitle'].length > 0) {
                        if (!state.surveyForm.surveyQuestionSet[index]?.min || !state.surveyForm.surveyQuestionSet[index]?.max
                            || !state.surveyForm.surveyQuestionSet[index]?.interval || state.surveyForm.surveyQuestionSet[index]?.min < 0 ||
                            state.surveyForm.surveyQuestionSet[index]?.max < 1) {
                            isValid = false;
                        } else {
                            let minValue = state.surveyForm.surveyQuestionSet[index]?.min
                            let maxValue = state.surveyForm.surveyQuestionSet[index]?.max
                            if (Number(minValue) >= Number(maxValue)) {
                                isValid = false;
                            } else {
                                if (state.surveyForm.surveyQuestionSet[index]['units']?.length === 0) {
                                    if (state.surveyForm.surveyQuestionSet[index].decimalErrorMin || state.surveyForm.surveyQuestionSet[index].decimalErrorMax) {
                                        isValid = false
                                    } else {
                                        isValid = true;
                                    }
                                } else {
                                    if (state.surveyForm.surveyQuestionSet[index]['units']?.length > 10) {
                                        isValid = false;
                                    } else {
                                        if (state.surveyForm.surveyQuestionSet[index].decimalErrorMin || state.surveyForm.surveyQuestionSet[index].decimalErrorMax) {
                                            isValid = false
                                        } else {
                                            isValid = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (state.surveyForm.surveyQuestionSet[index]['questionType'] === 'FREETEXT' && state.surveyForm.surveyQuestionSet[index]['freeText'].length <= 140) {
                    isValid = true;
                } else if (state.surveyForm.surveyQuestionSet[index]['questionType'] === 'FREETEXT' && state.surveyForm.surveyQuestionSet[index]['freeText'].length > 140) {
                    isValid = false;
                }
                if (state.surveyForm.surveyQuestionSet[index]['questionType'] === 'DROPDOWN' ||
                    state.surveyForm.surveyQuestionSet[index]['questionType'] === 'RADIOBUTTON') {
                    if (state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable) {
                        if (state.surveyForm?.surveyQuestionSet[index]?.answerOptions.length !== state.surveyForm?.surveyQuestionSet[index]?.path.length) {
                            isValid = false;
                        }
                        if ((state.surveyForm?.surveyQuestionSet[index]?.answerOptions.length === state.surveyForm?.surveyQuestionSet[index]?.path.length) && state.surveyForm?.surveyQuestionSet[index]?.errorFlag) {
                            isValid = false;
                        }
                    }
                }
                if (state.surveyForm.surveyQuestionSet[index]['questionType'] === 'RADIOBUTTON' || state.surveyForm.surveyQuestionSet[index]['questionType'] === 'CHECKBOX') {
                    if (state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther.enable && state.surveyForm?.surveyQuestionSet[index]?.answerOptions.length === 6) {
                        isValid = false
                    }

                    if (state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove.enable && state.surveyForm?.surveyQuestionSet[index]?.answerOptions.length === 6) {
                        isValid = false
                    }
                }
            }
            const modifiedPayload = Object.assign({}, state.surveyForm);
            if (Object.keys(state.surveyForm.validForm).length > state.surveyForm.surveyQuestionSet.length) {
                Object.keys(state.surveyForm.validForm).forEach((item: string, index) => {
                    if (Number(item) >= (state.surveyForm.surveyQuestionSet.length)) {
                        modifiedPayload['validForm'][index - 1] = modifiedPayload['validForm'][index];
                        delete modifiedPayload['validForm'][index];
                    }
                })
            }
            modifiedPayload['validForm'][index] = isValid;
            dispatch({
                type: 'MODIFY_SURVEY_PAYLOAD',
                payload: {
                    surveyPayload: modifiedPayload, currentPageName: 'question',
                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                }
            })
        }
    }

    const loaderCount = <div className="loading-dots">
        <div className="dot one">.</div><div className="dot two">.</div><div className="dot three">.</div>
    </div>

    React.useEffect(() => {
        const modifiedPayload = Object.assign({}, state.surveyForm);
        const modifiedIntervalArray = [];
        if (formMode !== 'READ_ONLY') {
            surveyFormValidation();
            let min = parseInt(state?.surveyForm?.surveyQuestionSet[index]?.min);
            let max = parseInt(state?.surveyForm?.surveyQuestionSet[index]?.max);

            let checkMinMax = false
            if (min !== null && max !== null && state?.surveyForm?.surveyQuestionSet[index].questionType === 'SLIDER') {
                if (Number(max) <= Number(min)) {
                    setMaxValueError(true);
                    checkMinMax = true
                    intervalArray = [...state?.surveyForm?.intervalArray];
                } else {
                    setMaxValueError(false);
                    checkMinMax = false
                    if (maxError || minError) {
                        intervalArray = state?.surveyForm?.intervalArray;
                        modifiedPayload['surveyQuestionSet'][index]['intervalArray'] = [{ id: "1", name: "1" }]
                    } else {
                        toggleLoader(state?.surveyForm?.surveyQuestionSet[index]?.max ? true : false);
                        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
                        (async function loop() {
                            for (let i = 1; i <= (parseInt(state?.surveyForm?.surveyQuestionSet[index]?.max) - parseInt(state?.surveyForm?.surveyQuestionSet[index]?.min)); i++) {
                                await delay(0);
                                if ((parseInt(state?.surveyForm?.surveyQuestionSet[index]?.max) - parseInt(state?.surveyForm?.surveyQuestionSet[index]?.min)) % i === 0 && i <= parseInt(state?.surveyForm?.surveyQuestionSet[index]?.max) / 2) {
                                    modifiedIntervalArray.push({ id: String(i), name: String(i) });
                                    modifiedPayload['surveyQuestionSet'][index]['intervalArray'] = modifiedIntervalArray
                                    const findIntervalValue = state?.surveyForm?.surveyQuestionSet[index]?.intervalArray?.some((item) => item.id === state?.surveyForm?.surveyQuestionSet[index]?.interval)
                                    if (findIntervalValue && formMode === 'READ_ONLY') {
                                        modifiedPayload['surveyQuestionSet'][index]['interval'] = findIntervalValue ? state?.surveyForm?.surveyQuestionSet[index]?.interval : '1'
                                    } else if (formMode !== 'READ_ONLY' || findIntervalValue)
                                        modifiedPayload['surveyQuestionSet'][index]['interval'] = findIntervalValue ? state?.surveyForm?.surveyQuestionSet[index]?.interval : '1'
                                    dispatch({
                                        type: 'MODIFY_SURVEY_PAYLOAD',
                                        payload: {
                                            surveyPayload: modifiedPayload, currentPageName: 'question',
                                            surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                        }
                                    })
                                }
                                // else {
                                //     if (modifiedIntervalArray.findIndex(intervalEle => Number(intervalEle.id) === i) > -1) {
                                //         modifiedIntervalArray.splice(i, 1);
                                //         modifiedPayload['surveyQuestionSet'][index]['intervalArray'] = modifiedIntervalArray;
                                //         dispatch({
                                //             type: 'MODIFY_SURVEY_PAYLOAD',
                                //             payload: {
                                //                 surveyPayload: modifiedPayload, currentPageName: 'question',
                                //                 surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`,'SURVEY_QUESTION_PROGRESS']
                                //             }
                                //         })
                                //     }
                                // }

                                if (i >= Math.floor(parseInt(state?.surveyForm?.surveyQuestionSet[index]?.max) / 2)) {
                                    toggleLoader(false);
                                    return;
                                }
                            }
                        })();
                    }
                }
            }
            setMaxValueError(checkMinMax);
        } else if (formMode === 'READ_ONLY') {
            modifiedIntervalArray.push({ id: String(state?.surveyForm?.surveyQuestionSet[index].interval), name: String(state?.surveyForm?.surveyQuestionSet[index].interval) });
            modifiedPayload['surveyQuestionSet'][index]['intervalArray'] = modifiedIntervalArray;
            dispatch({
                type: 'MODIFY_SURVEY_PAYLOAD',
                payload: {
                    surveyPayload: modifiedPayload, currentPageName: 'question',
                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                }
            })
        }
    }, [(formMode === 'READ_ONLY' && state?.surveyForm?.surveyQuestionSet), minimumValue, maximumValue]);

    const isLastQuestion = (array: any) => {
        let lastQuestionFlag = false
        if ((array.length) - (index) === 1) {
            lastQuestionFlag = true
            const modifiedPayload = Object.assign({}, state.surveyForm)
            if (state?.surveyForm?.surveyQuestionSet[state?.surveyForm?.surveyQuestionSet?.length - 1]?.conditionalPathEnable) {
                modifiedPayload['surveyQuestionSet'][state?.surveyForm?.surveyQuestionSet?.length - 1]['conditionalPathEnable'] = false;
                modifiedPayload['surveyQuestionSet'][state?.surveyForm?.surveyQuestionSet?.length - 1]['path'] = [];
                dispatch({
                    type: 'MODIFY_SURVEY_PAYLOAD',
                    payload: {
                        surveyPayload: modifiedPayload, currentPageName: 'question',
                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                    }
                })
            }
        }
        return lastQuestionFlag;
    }

    const getQuestionListForConditionalPathing = (questionArray: any): any => {

        let conditionalArray = [];
        questionArray['surveyQuestionSet'].forEach((question, questionIndex) => {
            conditionalArray[questionIndex] = {
                questionTitle: question.questionTitle,
                questionIndex: questionIndex,
                questionId: question.id
            }
        })

        questionArray['surveyQuestionSet'].map((question, questionIndex) => {

            // Create Conditional Path option list based on question position
            let conditinalArrayCopy = JSON.parse(JSON.stringify(conditionalArray));
            conditinalArrayCopy = conditinalArrayCopy.filter(ques => {
                return ques.questionIndex > questionIndex;
            })
            questionArray['surveyQuestionSet'][questionIndex]['conditionalQuestionArray'] = conditinalArrayCopy;
            // build Conditional Path option details
            if (question.conditionalPathEnable) {
                if (question.path.length === 0) {
                    question.answerOptions.map((answer, answerIndex) => {
                        question['path'].push({
                            questionIndex: questionIndex + 1,
                            option: answer,
                            target: questionArray['surveyQuestionSet'][questionIndex + 1]?.questionTitle,
                            answerOptionIndex: answerIndex,
                            questionId: questionArray['surveyQuestionSet'][questionIndex + 1]?.id
                        });
                    })
                } else {
                    question['path'].map((pathItem, pathIndex) => {
                        pathItem['questionIndex'] = pathItem.questionIndex;
                        pathItem['option'] = pathItem.option;
                        pathItem['target'] = pathItem['target'] ? pathItem.target : questionArray['surveyQuestionSet'][questionIndex + 1]?.questionTitle;
                        pathItem['answerOptionIndex'] = pathItem.answerOptionIndex;
                        pathItem['questionId'] = pathItem['questionId'] ? pathItem.questionId : questionArray['surveyQuestionSet'][questionIndex + 1]?.id;
                    })
                    return question;
                }
            }
            return question;
        })

        // Add Submit option at bottom of option list
        questionArray['surveyQuestionSet'].map((question) => {
            const questionDefaultIndex = question['conditionalQuestionArray'].findIndex(quesEle => quesEle.questionIndex === -1);
            if (questionDefaultIndex === -1) {
                question['conditionalQuestionArray'].push({ questionId: -1, questionIndex: -1, questionTitle: 'Submit' });
            }
            return question;
        })
        return questionArray;
    }
    React.useEffect(() => {
        getQuestionListForConditionalPathing(state.surveyForm)
    }, [state.surveyForm])
    function isParentHaveConditionalPath(array, ids) {
        let enable = false;
        array?.map((item) => {
            item.path?.map((items, itemId) => {
                if (items.questionId === ids) {
                    let questionIndex = state.surveyForm?.surveyQuestionSet?.findIndex(ele => ele.id === ids)
                    let indexQuestion = state.surveyForm?.surveyQuestionSet?.findIndex(ele => ele.id === item?.id)
                    const modifiedPayload = Object.assign({}, state.surveyForm)
                    modifiedPayload['surveyQuestionSet'][questionIndex]['cpAssociatedId'] = ++indexQuestion;
                    if (state.surveyForm.surveyQuestionSet[questionIndex]?.conditionalPathEnable) {
                        modifiedPayload['surveyQuestionSet'][questionIndex]['conditionalPathEnable'] = false;
                        modifiedPayload['surveyQuestionSet'][questionIndex]['path'] = [];
                        dispatch({
                            type: 'MODIFY_SURVEY_PAYLOAD',
                            payload: {
                                surveyPayload: modifiedPayload, currentPageName: 'question',
                                surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                            }
                        })
                    }
                    enable = true
                }
            })
        })
        return enable
    }

    function arrangeArray(payload) {
        const modifiedPayload = Object.assign({}, state)
        modifiedPayload['surveyForm']['surveyQuestionSet'] = payload
        dispatch({
            type: 'MODIFY_SURVEY_REARRANGE',
            payload: {
                surveyPayload: modifiedPayload
            }
        })
    }
    function isQuestionAssociatedWithOption(questionListArray: any, questionId: string): void {
        const modifiedPayload = Object.assign({}, state.surveyForm);
        questionListArray.forEach((question, questionIndex) => {
            question?.path?.forEach((path, pathIndex) => {
                if (path.questionId === questionId) {
                    let obj = {
                        target: questionListArray[questionIndex + 1]?.questionTitle,
                        questionId: questionListArray[questionIndex + 1]?.id,
                        questionIndex: questionIndex + 1,
                        answerOptionIndex: path.answerOptionIndex,
                        option: path.option
                    }
                    modifiedPayload['surveyQuestionSet'][parseInt(questionIndex)]['path'][pathIndex] = obj;
                }
            })
            if (questionListArray[questionIndex]?.surveyAlternativeNoneOfTheAbove?.targetQuestion === questionId) {
                modifiedPayload['surveyQuestionSet'][questionIndex]['surveyAlternativeNoneOfTheAbove']['targetQuestion'] = questionListArray[questionIndex + 1]?.id;
            }
            modifiedPayload['surveyQuestionSet'] = props.getQuestionListWithLink(modifiedPayload['surveyQuestionSet']);
            dispatch({
                type: 'MODIFY_SURVEY_PAYLOAD_PATH',
                payload: {
                    surveyPayload: getQuestionListForConditionalPathing(modifiedPayload)
                }
            })
            // if (modifiedPayload['surveyQuestionSet'][questionIndex + 1]?.conditionalPathEnable) {
            //     setIsQuestionCP(true)
            // }
        })
    }
    const onModeChange = (e: any, option: string, mode: string): void => {
        const modifiedPayload = Object.assign({}, state.surveyForm);
        if ((mode === 'read' && e.key === "Enter") || mode === 'edit') {
            if (option === 'other') {
                modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeOther']['mode'] = mode;
                const surveyAlternativeOtherIndex = modifiedPayload['surveyQuestionSet'][index]['answerOptionsWithAlternative'].findIndex(answer => answer.key === 'other');
                if (surveyAlternativeOtherIndex > -1) {
                    modifiedPayload['surveyQuestionSet'][index]['answerOptionsWithAlternative'][surveyAlternativeOtherIndex].mode = mode;
                }
            } else {
                modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']['mode'] = mode;
                const surveyAlternativeNoneOfTheAboveIndex = modifiedPayload['surveyQuestionSet'][index]['answerOptionsWithAlternative'].findIndex(answer => answer.key === 'noneOfTheAbove');
                if (surveyAlternativeNoneOfTheAboveIndex > -1) {
                    modifiedPayload['surveyQuestionSet'][index]['answerOptionsWithAlternative'][surveyAlternativeNoneOfTheAboveIndex].mode = mode;
                }
            }

            dispatch({
                type: 'MODIFY_SURVEY_PAYLOAD',
                payload: {
                    surveyPayload: modifiedPayload, currentPageName: 'question',
                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                }
            })
            surveyFormValidation();
        }

    }
    function isNoneOfHaveCp(questionListArray: any, cpForNoneOfAboveId, mainId): boolean {
        let checkCp = false
        let allQuestionid = [];
        questionListArray.forEach((qId, qindex) => {
            allQuestionid.push(qId.id)
        })
        let singleId = allQuestionid.find(qs => qs == cpForNoneOfAboveId)
        let findSingleIndex = questionListArray.findIndex(ele => ele.id === singleId)
        let findIndex = questionListArray.findIndex(ele => ele.id === mainId)
        const modifiedPayload = Object.assign({}, state.surveyForm)
        questionListArray?.forEach((items, indd) => {
            if (items.id === singleId) {
                modifiedPayload['surveyQuestionSet'][findSingleIndex]['cpAssociatedId'] = ++findIndex;
            }
        })
        questionListArray.forEach((item) => {
            if (item.conditionalPathEnable && item?.surveyAlternativeNoneOfTheAbove?.targetQuestion === mainId) {
                checkCp = true;
            }
        })
        if (state.surveyForm.surveyQuestionSet[findSingleIndex]?.conditionalPathEnable) {
            checkCp = true;
            modifiedPayload['surveyQuestionSet'][findSingleIndex]['conditionalPathEnable'] = false;
            modifiedPayload['surveyQuestionSet'][findSingleIndex]['path'] = [];
            dispatch({
                type: 'MODIFY_SURVEY_PAYLOAD',
                payload: {
                    surveyPayload: modifiedPayload, currentPageName: 'question',
                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                }
            })
        }
        return checkCp;
    }
    function isOptionQuestion(pathFlag, quesArrayList, selectedPath, pathId) {
        let isOption = false;
        if (pathId !== -1 || selectedPath !== -1) {
            for (let qIndex in quesArrayList) {
                for (let pathIndex in quesArrayList[qIndex]?.path) {
                    if (quesArrayList[qIndex]?.path[pathIndex]?.questionId === pathId) {
                        isOption = pathFlag ? false : true;
                        break;
                    }
                }
            }

        }
        return isOption;
    }

    const [reasonCpDisableMessage, setReasonCpDisableMessage] = React.useState('');
    const [reasonCpDisableMessageFlag, setReasonCpDisableMessageFlag] = React.useState(false);
    const [reasonOtherDisableMessage, setReasonOtherDisableMessage] = React.useState('');
    const [reasonOtherDisableMessageFlag, setReasonOtherDisableMessageFlag] = React.useState(false);
    const [reasonNoneOfTheAboveDisableMessage, setReasonNoneOfTheAboveDisableMessage] = React.useState('');
    const [reasonNoneOfTheAboveDisableMessageFlag, setReasonNoneOfTheAboveDisableMessageFlag] = React.useState(false);

    const isNoneOfTheAboveDisableReason = (otherEnable: boolean, optionLength: boolean, type: string) => {
        if (otherEnable) {
            setReasonNoneOfTheAboveDisableMessage(t('DISABLE_NONE_OF_ABOVE_REASON_OTHER'))
            setReasonNoneOfTheAboveDisableMessageFlag(true);
        }
        else if (optionLength && type === 'CHECKBOX') {
            setReasonNoneOfTheAboveDisableMessage(t('DISABLE_NONE_OF_ABOVE_REASON_MAX'))
            setReasonNoneOfTheAboveDisableMessageFlag(true);
        }
        else if (optionLength && type === 'RADIOBUTTON') {
            setReasonNoneOfTheAboveDisableMessage(t('DISABLE_NONE_OF_ABOVE_REASON_MAX'))
            setReasonNoneOfTheAboveDisableMessageFlag(true);
        }
    }
    const removeIsNoneOfTheAboveDisableReason = () => {
        setReasonNoneOfTheAboveDisableMessage('')
        setReasonNoneOfTheAboveDisableMessageFlag(false);
    }

    const isCpDisableReason = (noneOfCp: boolean, parentHaveCP: boolean, lastQuestion: boolean, OtherEnable: boolean, questionIndex: number) => {
        if (noneOfCp) {
            setReasonCpDisableMessage(t('DISABLE_CONDITION_PATH_REASON_CP'));
            setReasonCpDisableMessageFlag(true);
        }
        else if (parentHaveCP) {
            setReasonCpDisableMessage(t('DISABLE_CONDITION_PATH_REASON_CP'));
            setReasonCpDisableMessageFlag(true);
        }
        else if (lastQuestion && OtherEnable && questionIndex === 0) {
            setReasonCpDisableMessage(t('DISABLE_CONDITION_PATH_REASON_OTHER_ONE'));
            setReasonCpDisableMessageFlag(true);
        }
        else if (lastQuestion && OtherEnable) {
            setReasonCpDisableMessage(t('DISABLE_CONDITION_PATH_REASON_OTHER_LAST'));
            setReasonCpDisableMessageFlag(true);
        }
        else if (lastQuestion && questionIndex === 0) {
            setReasonCpDisableMessage(t('DISABLE_CONDITION_PATH_REASON_ONLY_QUESTION'));
            setReasonCpDisableMessageFlag(true);
        }
        else if (lastQuestion) {
            setReasonCpDisableMessage(t('DISABLE_CONDITION_PATH_REASON_LAST_QUESTION'));
            setReasonCpDisableMessageFlag(true);
        }
        else if (OtherEnable) {
            setReasonCpDisableMessage(t('DISABLE_CONDITION_PATH_REASON_OTHER'));
            setReasonCpDisableMessageFlag(true);
        }
    }
    const removeIsCpDisableReason = () => {
        setReasonCpDisableMessage('');
        setReasonCpDisableMessageFlag(false);
    }
    const isOtherDisabledReason = (enableNoneOfAbove: boolean, conditionPathEnable: boolean, OptionLength: boolean, type: string) => {
        if (conditionPathEnable && enableNoneOfAbove) {
            setReasonOtherDisableMessage(t('DISABLE_NONE_OF_THE_ABOVE_REASON_CP_CONDITION_ENABLE'));
            setReasonOtherDisableMessageFlag(true);
        }
        else if (enableNoneOfAbove) {
            setReasonOtherDisableMessage(t('DISABLE_NONE_OF_THE_ABOVE_REASON_NONE'));
            setReasonOtherDisableMessageFlag(true);
        }
        else if (conditionPathEnable) {
            setReasonOtherDisableMessage(t('DISABLE_NONE_OF_THE_ABOVE_REASON_CP'));
            setReasonOtherDisableMessageFlag(true);
        }
        else if (OptionLength && type === 'RADIOBUTTON') {
            setReasonOtherDisableMessage(t('DISABLE_NONE_OF_THE_ABOVE_REASON_MAX'));
            setReasonOtherDisableMessageFlag(true);
        }
        else if (OptionLength && type === 'CHECKBOX') {
            setReasonOtherDisableMessage(t('DISABLE_NONE_OF_THE_ABOVE_REASON_MAX'));
            setReasonOtherDisableMessageFlag(true);
        }
    }
    const removeIsOtherDisableReason = () => {
        setReasonOtherDisableMessage('');
        setReasonOtherDisableMessageFlag(false);
    }


    const handleQuestionType = () => {
        switch (ques.questionType) {
            case `FREETEXT`:
                return (
                    <TextField
                        id="outlined-multiline-static"
                        variant="outlined"
                        aria-describedby="survey-freetext"
                        placeholder={t('SURVEY_FREETEXT_PLACEHOLDER')}
                        label={`${t('SURVEY_FREETEXT_LABEL')}`}
                        name={`surveyQuestionSet[${index}].freeText`}
                        helperText={touchedFreeText && errorFreeText ? errorFreeText : ""}
                        error={Boolean(touchedFreeText && errorFreeText)}
                        onBlur={handleBlur}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => {
                            setFreeText(e.currentTarget.value);
                            handleChange(e);
                            const modifiedPayload = Object.assign({}, state.surveyForm)
                            modifiedPayload['surveyQuestionSet'][index]['freeText'] = e.target.value
                            dispatch({
                                type: 'MODIFY_SURVEY_PAYLOAD',
                                payload: {
                                    surveyPayload: modifiedPayload, currentPageName: 'question',
                                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                }
                            })
                            surveyFormValidation();
                        }}
                        value={ques.freeText}
                        disabled={formMode === 'READ_ONLY' ? true : false}
                        type="text"
                    />
                )
            case `RADIOBUTTON`:
                return (
                    <FormControl component="fieldset">
                        <div className="option-values">
                            {uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions'])?.map((option, i) => {
                                return (
                                    <div className={formMode === 'READ_ONLY' ? "read-only radio-inline" : "radio-inline"} key={i} style={{ justifyContent: 'space-between' }}>
                                        <div className="radio-label">
                                            <FormControlLabel disabled control={<Radio />} label={option} />
                                        </div>
                                        <Button className="delete-aud-row"
                                            disabled={formMode === 'READ_ONLY' ? true : false}
                                            onClick={() => onRemoveSelectOneOptions(option, i)}
                                            style={{ display: formMode === 'READ_ONLY' && 'none' }}>
                                            <DeleteTwoToneIcon fontSize='small' color='secondary' />
                                        </Button>
                                        {state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable && <div style={{ width: '220px', margin: '10px' }} >
                                            <FormControl className="form-select-box" >
                                                <InputLabel variant="filled" style={{ pointerEvents: "auto" }} >
                                                    <div className="label-tooltip">{`${t('GO_TO_QUESTION')}`}
                                                    </div>
                                                </InputLabel>
                                                <Select
                                                    label={t('GOTO_QUESTION')}
                                                    value={state?.surveyForm?.surveyQuestionSet[index]?.path[i]?.questionId ? state?.surveyForm?.surveyQuestionSet[index]?.path[i]?.questionId : ''}
                                                    onChange={(e) => {
                                                        let cpEnabledId = state?.surveyForm?.surveyQuestionSet[index]?.path[i]?.questionId;
                                                        let gotoValue = e.target.value === -1 ? '0' : e.target.value;
                                                        let pathValues = state?.surveyForm?.surveyQuestionSet[index]?.path?.some(pt => pt?.questionId === e.target.value)
                                                        let findQuestionIndex = state?.surveyForm?.surveyQuestionSet?.findIndex(questions => questions.id === e.target.value)
                                                        if (isOptionQuestion(pathValues, state?.surveyForm?.surveyQuestionSet, cpEnabledId, gotoValue)) {
                                                            setIsOptionQuestionCP(true)
                                                        } else if (e.target.value === -1 || e.target.value.toString().length > 0) {
                                                            const modifiedPayload = Object.assign({}, state.surveyForm)
                                                            const conditionalQuestionArrayIndex = modifiedPayload.surveyQuestionSet[index]['conditionalQuestionArray'].findIndex(question => question.questionId === e.target.value);
                                                            if (conditionalQuestionArrayIndex > -1) {
                                                                modifiedPayload.surveyQuestionSet[index]['path'][i] = {
                                                                    answerOptionIndex: i,
                                                                    questionIndex: conditionalQuestionArrayIndex,
                                                                    option: option,
                                                                    target: state?.surveyForm?.surveyQuestionSet[index]?.conditionalQuestionArray[conditionalQuestionArrayIndex].questionTitle,
                                                                    questionId: e.target.value
                                                                }
                                                                if (modifiedPayload['surveyQuestionSet'][findQuestionIndex]?.conditionalPathEnable) {
                                                                    setIsQuestionCP(true)
                                                                }
                                                                setPrevSelected(e.target.value.toString())
                                                            }
                                                            dispatch({
                                                                type: 'MODIFY_SURVEY_PAYLOAD',
                                                                payload: {
                                                                    surveyPayload: modifiedPayload, currentPageName: 'question',
                                                                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS'],
                                                                    cpQuestionLimit: state?.surveyForm?.surveyQuestionSet[index]?.path?.length
                                                                }
                                                            })
                                                            const arrangeQuestionArray = props.getQuestionListWithLink(modifiedPayload['surveyQuestionSet']);
                                                            state?.surveyForm?.surveyQuestionSet[index]?.path[i]?.target.length > 0 && arrangeArray(arrangeQuestionArray)
                                                        }
                                                        surveyFormValidation();
                                                    }}
                                                    name={`gotoQuestionid`}
                                                    disabled={formMode === 'READ_ONLY' ? true : false}
                                                    MenuProps={{
                                                        anchorOrigin: {
                                                            vertical: "bottom",
                                                            horizontal: "left"
                                                        },
                                                        transformOrigin: {
                                                            vertical: "top",
                                                            horizontal: "left"
                                                        },
                                                        getContentAnchorEl: null
                                                    }}
                                                >
                                                    {state?.surveyForm?.surveyQuestionSet[index]?.conditionalQuestionArray.map((type, i) => (
                                                        <MenuItem key={i} value={type?.questionId}>
                                                            {type?.questionTitle?.length > 0 ? type?.questionTitle : `Question ${2 + index + i} with no title`}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>}
                                    </div>
                                )
                            })}
                            {state.surveyForm?.surveyQuestionSet[index]['answerOptionsWithAlternative']?.map((alternativeOption, i) => {
                                return (
                                    <div className={formMode === 'READ_ONLY' ? "read-only radio-inline" : "radio-inline"} key={i}
                                        style={{ justifyContent: 'space-between' }}>
                                        {((alternativeOption.key === 'other' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].mode === 'read') || (alternativeOption.key === 'noneOfTheAbove' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove'].mode === 'read')) && <div className="radio-label">
                                            <FormControlLabel disabled control={<Radio />} label={alternativeOption.label} />
                                        </div>}
                                        {((alternativeOption.key === 'other' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].mode === 'edit') || (alternativeOption.key === 'noneOfTheAbove' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove'].mode === 'edit')) &&
                                            // <TextField
                                            //     InputLabelProps={{ shrink: true }}
                                            //     variant="outlined"
                                            //     name={t('SURVEY_ALTERNATIVE_OTHER_LABEL') ? 'surveyOther' : 'surveyNoneOfTheAbove'}
                                            //     onKeyPress={(e) => onModeChange(e, alternativeOption.key, 'read')}
                                            //     onChange={(e) => {
                                            //         onEditLabel(e.target.value, alternativeOption.key);
                                            //     }}
                                            //     value={alternativeOption.key === 'other' ? state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].label
                                            //         : state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove'].label}
                                            //     type="text"
                                            // />
                                            <SurveyAlternativePopup label={alternativeOption.key === 'other' ? state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].label : state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove'].label} hintText={alternativeOption.key} placeholder={alternativeOption.key === 'other' ? state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].placeholder : ''} questionIndex={index} />
                                        }
                                        {((alternativeOption.key === 'other' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].mode === 'read') || (alternativeOption.key === 'noneOfTheAbove' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove'].mode === 'read')) && <Button className="delete-aud-row"
                                            disabled={formMode === 'READ_ONLY' ? true : false}
                                            onClick={(e) => onModeChange(e, alternativeOption.key, 'edit')}
                                            style={{ display: formMode === 'READ_ONLY' && 'none' }}>
                                            <EditIcon fontSize='small' color='secondary' />
                                        </Button>}
                                        {(state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable && alternativeOption.key === 'noneOfTheAbove') && <div style={{ width: '220px', margin: '10px' }} >
                                            <FormControl className="form-select-box" >
                                                <InputLabel variant="filled" style={{ pointerEvents: "auto" }} >
                                                    <div className="label-tooltip">{`${t('GO_TO_QUESTION')}`}
                                                    </div>
                                                </InputLabel>
                                                <Select
                                                    label={t('GOTO_QUESTION')}
                                                    value={state?.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove.targetQuestion}
                                                    onChange={(e) => {
                                                        let cpEnabledId = state?.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove.targetQuestion;
                                                        let pathValues = state?.surveyForm?.surveyQuestionSet[index]?.path?.some(pt => pt?.questionId === e.target.value)
                                                        if (isOptionQuestion(pathValues, state?.surveyForm?.surveyQuestionSet, cpEnabledId, e.target.value)) {
                                                            setIsOptionQuestionCP(true)
                                                        } else {
                                                            const modifiedPayload = Object.assign({}, state.surveyForm)
                                                            modifiedPayload.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove']['targetQuestion'] = e.target.value;
                                                            let findQuestionIndex = state?.surveyForm?.surveyQuestionSet?.findIndex(questions => questions.id === e.target.value)
                                                            if (state?.surveyForm?.surveyQuestionSet[findQuestionIndex]?.conditionalPathEnable) {
                                                                setIsQuestionCP(true)
                                                            }
                                                            dispatch({
                                                                type: 'MODIFY_SURVEY_PAYLOAD',
                                                                payload: {
                                                                    surveyPayload: modifiedPayload, currentPageName: 'question',
                                                                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS'],
                                                                    cpQuestionLimit: state?.surveyForm?.surveyQuestionSet[index]?.path?.length
                                                                }
                                                            })
                                                            const arrangeQuestionArray = props.getQuestionListWithLink(modifiedPayload['surveyQuestionSet']);
                                                            arrangeArray(arrangeQuestionArray)
                                                            surveyFormValidation();
                                                        }
                                                    }}
                                                    name={`gotoQuestionid`}
                                                    disabled={formMode === 'READ_ONLY' ? true : false}
                                                    MenuProps={{
                                                        anchorOrigin: {
                                                            vertical: "bottom",
                                                            horizontal: "left"
                                                        },
                                                        transformOrigin: {
                                                            vertical: "top",
                                                            horizontal: "left"
                                                        },
                                                        getContentAnchorEl: null
                                                    }}
                                                >
                                                    {state?.surveyForm?.surveyQuestionSet[index]?.conditionalQuestionArray.map((type, i) => (
                                                        <MenuItem key={i} value={type?.questionId} disabled={type?.questionTitle?.length > 0 ? false : true}>
                                                            {type?.questionTitle?.length > 0 ? type?.questionTitle : `Question ${2 + index + i} with no title`}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="radio-inline">
                            <TextField
                                variant='outlined'
                                placeholder={t('ANSWER_OPTIONS_PLACEHOLDER')}
                                label={`${t('ANSWER_OPTIONS')} *`}
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => {
                                    setSelectOneOption(e.target.value)
                                    surveyFormValidation();
                                }}
                                value={selectOneOption}
                                onKeyPress={onKeyEnterRadioAddOption}
                                inputProps={{ maxLength: 50 }}
                                disabled={(uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6) ||
                                    (uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 5 &&
                                        (state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther.enable ||
                                            state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove.enable))}
                                style={{ display: formMode === 'READ_ONLY' && 'none' }}
                            />
                        </div>
                        <p style={{ display: formMode === 'READ_ONLY' && 'none' }}>{`${t('TYPE_AND_PRESS_ENTER_FOR_CREATE_VALUE')}`}</p>
                        <p style={{ display: formMode === 'READ_ONLY' && 'none' }}>{`${t('ONLY_ENTER_SIX_OPTIONS')}`}</p>
                        {state.surveyForm?.surveyQuestionSet[index]?.answerOptionEachLengthErrorFlag && <p className="error" style={{ display: formMode === 'READ_ONLY' && 'none' }}>{t('SURVEY_ANSWER_OPTION_LENGTH_ERROR')}</p>}
                        {uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length > 6 && <p className="error">{t('MAXIMUM_ALLOWED_OPTIONS')}</p>}
                        <div className="option-rigt">
                            <FormControl>
                                <div className="switchery org-switchery" >
                                    <Tooltip arrow open={formMode !== 'READ_ONLY' && reasonCpDisableMessageFlag} placement="left" title={formMode !== 'READ_ONLY' && reasonCpDisableMessage}>
                                        <span
                                            onMouseEnter={() => isCpDisableReason(isNoneOfHaveCp(state.surveyForm?.surveyQuestionSet, state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove?.targetQuestion, id),
                                                isParentHaveConditionalPath(state.surveyForm?.surveyQuestionSet, id),
                                                isLastQuestion(state.surveyForm?.surveyQuestionSet),
                                                state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther.enable, index)}
                                            onMouseLeave={() => removeIsCpDisableReason()}
                                        >
                                            <FormControlLabel
                                                disabled={isNoneOfHaveCp(state.surveyForm?.surveyQuestionSet, state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove?.targetQuestion, id) ||
                                                    isParentHaveConditionalPath(state.surveyForm?.surveyQuestionSet, id) ||
                                                    formMode === 'READ_ONLY' || isLastQuestion(state.surveyForm?.surveyQuestionSet) ||
                                                    state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther.enable ? true : false}
                                                control={
                                                    <Switch
                                                        checked={state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable}
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            const modifiedPayload = Object.assign({}, state.surveyForm);
                                                            let pathId = state?.surveyForm?.surveyQuestionSet[index]?.path[0]?.questionId
                                                            let findQuestionIndex = state?.surveyForm?.surveyQuestionSet?.findIndex(questions => questions.id === state?.surveyForm?.surveyQuestionSet[index]?.conditionalQuestionArray[0]?.questionId)
                                                            modifiedPayload['surveyQuestionSet'][index]['conditionalPathEnable'] = e.target.checked;
                                                            if (e.target.checked) {
                                                                modifiedPayload['surveyQuestionSet'][index]['defaultTarget'] = null;
                                                                if (modifiedPayload['surveyQuestionSet'][index]['conditionalQuestionArray'] &&
                                                                    modifiedPayload['surveyQuestionSet'][index]['conditionalQuestionArray'].length !== 0 && modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove'].enable) {
                                                                    modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']['targetQuestion'] = modifiedPayload['surveyQuestionSet'][index]['conditionalQuestionArray'][0].questionId;
                                                                }
                                                            } else {
                                                                modifiedPayload['surveyQuestionSet'][index]['defaultTarget'] = modifiedPayload['surveyQuestionSet'][index + 1]['id'];
                                                            }
                                                            modifiedPayload['conditionalQuestionArrayFlag'] = e.target.checked;
                                                            if (modifiedPayload['surveyQuestionSet'][findQuestionIndex]?.conditionalPathEnable) {
                                                                setIsQuestionCP(true)
                                                            }
                                                            modifiedPayload['surveyQuestionSet'] = props.getQuestionListWithLink(modifiedPayload['surveyQuestionSet']);
                                                            dispatch({
                                                                type: "MODIFY_SURVEY_PAYLOAD",
                                                                payload: {
                                                                    surveyPayload: getQuestionListForConditionalPathing(modifiedPayload), currentPageName: 'question',
                                                                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                                                }
                                                            })
                                                            if (!state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable) {
                                                                modifiedPayload['surveyQuestionSet'][index]['path'] = [];
                                                                dispatch({
                                                                    type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                                    payload: {
                                                                        surveyPayload: modifiedPayload
                                                                    }
                                                                })
                                                            }
                                                            setPrevSelected(state.surveyForm?.surveyQuestionSet[index]?.conditionalQuestionArray[0]?.questionId)
                                                        }}
                                                        name="conditionalPathEnable" />
                                                }
                                                label={<div onMouseEnter={() => setReasonCpDisableMessageFlag(false)} className="label-tooltip small-tooltip">{`${t('CONDITIONAL_PATH')}`}
                                                    <LightTooltip title={<label>{t('TOOLTIP_CONDITIONAL_PATH')}</label>}
                                                    /></div>}
                                            />
                                        </span>
                                    </Tooltip>
                                </div>
                            </FormControl>
                            <FormControl>
                                <div className="switchery org-switchery">
                                    <FormControlLabel
                                        // style={{ display: 'none' }}
                                        control={<Switch
                                            checked={state.surveyForm?.surveyQuestionSet[index]?.randomizeOrder}
                                            onChange={(e) => {
                                                handleChange(e);
                                                const modifiedPayload = Object.assign({}, state.surveyForm);
                                                modifiedPayload['surveyQuestionSet'][index]['randomizeOrder'] = e.target.checked;
                                                dispatch({
                                                    type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                    payload: {
                                                        surveyPayload: modifiedPayload
                                                    }
                                                })
                                            }}
                                            name="randomizeOrder" />}
                                        disabled={formMode === 'READ_ONLY'}
                                        label={<div className="label-tooltip small-tooltip">{`${t('RANDOMIZE_ORDER')}`}
                                            <LightTooltip title={<label>{t('TOOLTIP_RANDOMIZE_ORDER')}</label>}
                                            /></div>}
                                    />
                                </div>
                                <div className="switchery org-switchery" >
                                    <Tooltip arrow open={formMode !== 'READ_ONLY' && reasonOtherDisableMessageFlag} placement="left" title={formMode !== 'READ_ONLY' && reasonOtherDisableMessage}>
                                        <span
                                            onMouseEnter={() => isOtherDisabledReason(state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove.enable,
                                                state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable,
                                                (uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6), 'RADIOBUTTON')}
                                            onMouseLeave={() => removeIsOtherDisableReason()}
                                        >
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther.enable}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        const modifiedPayload = Object.assign({}, state.surveyForm);
                                                        modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeOther']['enable'] = e.target.checked;
                                                        const modifiedArray = modifiedPayload['surveyQuestionSet'][index]['answerOptionsWithAlternative'];
                                                        if (e.target.checked && uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6) {
                                                            setOtherError(true)
                                                        } else {
                                                            setOtherError(false)
                                                        }
                                                        if (e.target.checked) {
                                                            modifiedArray.push(modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeOther']);
                                                            modifiedPayload.surveyQuestionSet[index].answerOptions = modifiedPayload.surveyQuestionSet[index]?.answerOptions?.filter(answer => answer.toLowerCase() !== modifiedPayload.surveyQuestionSet[index]?.surveyAlternativeOther?.label?.toLowerCase());
                                                        } else {
                                                            const findAlternativeAnswerOptionOtherIndex = modifiedArray.findIndex(answer => answer.key === 'other');
                                                            if (findAlternativeAnswerOptionOtherIndex > -1) {
                                                                modifiedArray.splice(findAlternativeAnswerOptionOtherIndex, 1);
                                                            }
                                                            modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeOther']['label'] = 'Other';
                                                            modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeOther']['placeholder'] = 'Enter your option';
                                                        }
                                                        dispatch({
                                                            type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                            payload: {
                                                                surveyPayload: modifiedPayload
                                                            }
                                                        })
                                                        surveyFormValidation();
                                                    }}
                                                    name="surveyAlternativeOther" />}
                                                disabled={state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove.enable ||
                                                    formMode === 'READ_ONLY' || state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable ||
                                                    (uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6)}
                                                label={<div onMouseEnter={() => setReasonOtherDisableMessageFlag(false)} className="label-tooltip small-tooltip">{`${t('SURVEY_ALTERNATIVE_OTHER')}`}
                                                    <LightTooltip title={<label>{t('TOOLTIP_SURVEY_ALTERNATIVE_OTHER')}</label>}
                                                    /></div>}
                                            />
                                        </span>
                                    </Tooltip>
                                </div>
                                <div className="switchery org-switchery" >
                                    <Tooltip arrow open={formMode !== 'READ_ONLY' && reasonNoneOfTheAboveDisableMessageFlag} placement="left" title={formMode !== 'READ_ONLY' && reasonNoneOfTheAboveDisableMessage}>
                                        <span
                                            onMouseEnter={() => isNoneOfTheAboveDisableReason(state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther.enable
                                                , (uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6), 'RADIOBUTTON')}
                                            onMouseLeave={() => removeIsNoneOfTheAboveDisableReason()}
                                        >
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove.enable}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        if (e.target.checked && uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6) {
                                                            setOtherError(true)
                                                        } else {
                                                            setOtherError(false)
                                                        }
                                                        const modifiedPayload = Object.assign({}, state.surveyForm);
                                                        modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']['enable'] = e.target.checked;
                                                        const modifiedArray = modifiedPayload['surveyQuestionSet'][index]['answerOptionsWithAlternative'];
                                                        if (e.target.checked) {
                                                            modifiedArray.push(modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']);
                                                            if (modifiedPayload.surveyQuestionSet[index].conditionalQuestionArray && modifiedPayload.surveyQuestionSet[index].conditionalQuestionArray.length !== 0) {
                                                                modifiedPayload.surveyQuestionSet[index].surveyAlternativeNoneOfTheAbove.targetQuestion = modifiedPayload.surveyQuestionSet[index].conditionalQuestionArray[0].questionId;
                                                            } else {
                                                                modifiedPayload.surveyQuestionSet[index].surveyAlternativeNoneOfTheAbove.targetQuestion = '';
                                                            }
                                                            modifiedPayload.surveyQuestionSet[index].answerOptions = modifiedPayload.surveyQuestionSet[index]?.answerOptions?.filter(answer => answer.toLowerCase() !== modifiedPayload.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove?.label?.toLowerCase());
                                                        } else {
                                                            const findAlternativeAnswerOptionOtherIndex = modifiedArray.findIndex(answer => answer.key === 'noneOfTheAbove');
                                                            if (findAlternativeAnswerOptionOtherIndex > -1) {
                                                                modifiedArray.splice(findAlternativeAnswerOptionOtherIndex, 1);
                                                            }
                                                            modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']['label'] = 'None of the Above';
                                                            modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']['targetQuestion'] = '';
                                                        }
                                                        dispatch({
                                                            type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                            payload: {
                                                                surveyPayload: modifiedPayload
                                                            }
                                                        })
                                                        surveyFormValidation();
                                                    }}
                                                    name="surveyAlternativeNoneOfTheAbove" />}

                                                disabled={state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther.enable ||
                                                    formMode === 'READ_ONLY' || (uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6)}
                                                label={<div onMouseEnter={() => setReasonNoneOfTheAboveDisableMessageFlag(false)} className="label-tooltip small-tooltip">{`${t('SURVEY_ALTERNATIVE_NONE_OF_THE_ABOVE')}`}
                                                    <LightTooltip title={<label>{t('TOOLTIP_SURVEY_ALTERNATIVE_NONE_OF_THE_ABOVE')}</label>}
                                                    /></div>}
                                            />
                                        </span>
                                    </Tooltip>
                                </div>
                            </FormControl>
                        </div>
                    </FormControl >
                )
            case `CHECKBOX`:
                return (
                    <FormControl required component="fieldset">
                        <div className="option-values">
                            {uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions'])?.map((check, i) => {
                                return (
                                    <FormGroup key={i}>
                                        <div className={formMode === 'READ_ONLY' ? "read-only radio-inline" : "radio-inline"} key={i}>
                                            <div className="radio-label">
                                                <FormControlLabel
                                                    control={<Checkbox disabled name={check} />}
                                                    label={check}
                                                />
                                            </div>
                                            <Button className="delete-aud-row" onClick={() => onRemoveSelectOneOptions(check, i)}
                                                disabled={formMode === 'READ_ONLY' ? true : false}
                                                style={{ display: formMode === 'READ_ONLY' && 'none' }}
                                            >
                                                <DeleteTwoToneIcon fontSize='small' color='secondary' />
                                            </Button>
                                        </div>
                                    </FormGroup>
                                )
                            })}
                            {state.surveyForm?.surveyQuestionSet[index]['answerOptionsWithAlternative']?.map((alternativeOption, i) => {
                                return (
                                    <div className={formMode === 'READ_ONLY' ? "read-only radio-inline" : "radio-inline"} key={i}>
                                        {((alternativeOption.key === 'other' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].mode === 'read') || (alternativeOption.key === 'noneOfTheAbove' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove'].mode === 'read')) && <div className="radio-label">
                                            <FormControlLabel control={<Checkbox disabled name={alternativeOption.label} />} label={alternativeOption.label} />
                                        </div>}
                                        {((alternativeOption.key === 'other' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].mode === 'edit') || (alternativeOption.key === 'noneOfTheAbove' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove'].mode === 'edit')) &&
                                            // <TextField
                                            //     InputLabelProps={{ shrink: true }}
                                            //     variant="outlined"
                                            //     name={t('SURVEY_ALTERNATIVE_OTHER_LABEL') ? 'surveyOther' : 'surveyNoneOfTheAbove'}
                                            //     onKeyPress={(e) => onModeChange(e, alternativeOption.key, 'read')}
                                            //     onChange={(e) => {
                                            //         onEditLabel(e.target.value, alternativeOption.key);
                                            //     }}
                                            //     value={alternativeOption.key === 'other' ? state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].label
                                            //         : state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove'].label}
                                            //     type="text"
                                            // />
                                            <SurveyAlternativePopup label={alternativeOption.key === 'other' ? state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].label : state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove'].label} hintText={alternativeOption.key} placeholder={alternativeOption.key === 'other' ? state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].placeholder : ''} questionIndex={index} />
                                        }
                                        <Button className="delete-aud-row"
                                            disabled={formMode === 'READ_ONLY' ? true : false}
                                            onClick={(e) => onModeChange(e, alternativeOption.key, 'edit')}
                                            style={{ display: formMode === 'READ_ONLY' && 'none' }}>
                                            <EditIcon fontSize='small' color='secondary' />
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>

                        <TextField
                            variant='outlined'
                            onChange={(e) => {
                                setCheckBoxOption(e.target.value)
                                surveyFormValidation();
                            }}
                            value={checkBoxOption}
                            onKeyPress={onKeyEnterCheckBoxAddOption}
                            placeholder={t('ANSWER_OPTIONS_PLACEHOLDER')}
                            label={`${t('ANSWER_OPTIONS')} *`}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ maxLength: 50 }}
                            disabled={(uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6) ||
                                (uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 5 &&
                                    (state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther.enable ||
                                        state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove.enable))}
                            style={{ display: formMode === 'READ_ONLY' && 'none' }}

                        />
                        <p style={{ display: formMode === 'READ_ONLY' && 'none' }}>{`${t('TYPE_AND_PRESS_ENTER_FOR_CREATE_VALUE')}`}</p>
                        <p style={{ display: formMode === 'READ_ONLY' && 'none' }}>{`${t('ONLY_ENTER_SIX_OPTIONS')}`}</p>
                        {state.surveyForm?.surveyQuestionSet[index]?.answerOptionEachLengthErrorFlag && <p className="error" style={{ display: formMode === 'READ_ONLY' && 'none' }}>{t('SURVEY_ANSWER_OPTION_LENGTH_ERROR')}</p>}
                        {uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length > 6 && <p className="error">{t('MAXIMUM_ALLOWED_OPTIONS')}</p>}
                        <div className="option-rigt">
                            <FormControl>
                                <div className="switchery org-switchery">
                                    <FormControlLabel
                                        control={<Switch
                                            checked={state.surveyForm?.surveyQuestionSet[index]?.randomizeOrder}
                                            onChange={(e) => {
                                                handleChange(e);
                                                const modifiedPayload = Object.assign({}, state.surveyForm);
                                                modifiedPayload['surveyQuestionSet'][index]['randomizeOrder'] = e.target.checked;
                                                dispatch({
                                                    type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                    payload: {
                                                        surveyPayload: modifiedPayload
                                                    }
                                                })
                                            }}
                                            name="randomizeOrder" />}
                                        disabled={formMode === 'READ_ONLY'}
                                        label={<div className="label-tooltip small-tooltip">{`${t('RANDOMIZE_ORDER')}`}
                                            <LightTooltip title={<label>{t('TOOLTIP_RANDOMIZE_ORDER')}</label>}
                                            /></div>}
                                    />
                                </div>
                                <div className="switchery org-switchery" >
                                    <Tooltip arrow open={formMode !== 'READ_ONLY' && reasonOtherDisableMessageFlag} placement="left" title={formMode !== 'READ_ONLY' && reasonOtherDisableMessage}>
                                        <span
                                            onMouseEnter={() => isOtherDisabledReason(state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove.enable,
                                                state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable,
                                                (uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6), 'CHECKBOX')}
                                            onMouseLeave={() => removeIsOtherDisableReason()}
                                        >
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther.enable}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        const modifiedPayload = Object.assign({}, state.surveyForm);
                                                        modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeOther']['enable'] = e.target.checked;
                                                        const modifiedArray = modifiedPayload['surveyQuestionSet'][index]['answerOptionsWithAlternative'];
                                                        if (e.target.checked && uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6) {
                                                            setOtherError(true)
                                                        } else {
                                                            setOtherError(false)
                                                        }
                                                        if (e.target.checked) {
                                                            modifiedArray.push(modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeOther']);
                                                            modifiedPayload.surveyQuestionSet[index].answerOptions = modifiedPayload.surveyQuestionSet[index]?.answerOptions?.filter(answer => answer.toLowerCase() !== modifiedPayload.surveyQuestionSet[index]?.surveyAlternativeOther?.label?.toLowerCase());
                                                        } else {
                                                            const findAlternativeAnswerOptionOtherIndex = modifiedArray.findIndex(answer => answer.key === 'other');
                                                            if (findAlternativeAnswerOptionOtherIndex > -1) {
                                                                modifiedArray.splice(findAlternativeAnswerOptionOtherIndex, 1);
                                                            }
                                                            modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeOther']['label'] = 'Other';
                                                            modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeOther']['placeholder'] = 'Enter your option';
                                                        }
                                                        dispatch({
                                                            type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                            payload: {
                                                                surveyPayload: modifiedPayload
                                                            }
                                                        })
                                                        surveyFormValidation();
                                                    }}
                                                    name="surveyAlternativeOther" />}
                                                disabled={state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove.enable || formMode === 'READ_ONLY'
                                                    || state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable || (uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6)}
                                                label={<div onMouseEnter={() => setReasonOtherDisableMessageFlag(false)} className="label-tooltip small-tooltip">{`${t('SURVEY_ALTERNATIVE_OTHER')}`}
                                                    <LightTooltip title={<label>{t('TOOLTIP_SURVEY_ALTERNATIVE_OTHER')}</label>}
                                                    /></div>}
                                            />
                                        </span>
                                    </Tooltip>
                                </div>
                                <div className="switchery org-switchery">
                                    <Tooltip arrow open={formMode !== 'READ_ONLY' && reasonNoneOfTheAboveDisableMessageFlag} placement="left" title={formMode !== 'READ_ONLY' && reasonNoneOfTheAboveDisableMessage}>
                                        <span
                                            onMouseEnter={() => isNoneOfTheAboveDisableReason(state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther.enable, (uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6), 'CHECKBOX')}
                                            onMouseLeave={() => removeIsNoneOfTheAboveDisableReason()}
                                        >
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove.enable}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        const modifiedPayload = Object.assign({}, state.surveyForm);
                                                        modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']['enable'] = e.target.checked;
                                                        const modifiedArray = modifiedPayload['surveyQuestionSet'][index]['answerOptionsWithAlternative'];
                                                        if (e.target.checked && uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6) {
                                                            setOtherError(true)
                                                        } else {
                                                            setOtherError(false)
                                                        }
                                                        if (e.target.checked) {
                                                            modifiedArray.push(modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']);
                                                            modifiedPayload.surveyQuestionSet[index].answerOptions = modifiedPayload.surveyQuestionSet[index]?.answerOptions?.filter(answer => answer.toLowerCase() !== modifiedPayload.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove?.label?.toLowerCase());
                                                        } else {
                                                            const findAlternativeAnswerOptionOtherIndex = modifiedArray.findIndex(answer => answer.key === 'noneOfTheAbove');
                                                            if (findAlternativeAnswerOptionOtherIndex > -1) {
                                                                modifiedArray.splice(findAlternativeAnswerOptionOtherIndex, 1);
                                                            }
                                                            modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']['label'] = 'None of the Above';
                                                        }
                                                        dispatch({
                                                            type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                            payload: {
                                                                surveyPayload: modifiedPayload
                                                            }
                                                        })
                                                        surveyFormValidation();
                                                    }}
                                                    name="surveyAlternativeNoneOfTheAbove" />}
                                                disabled={state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther.enable || formMode === 'READ_ONLY' ||
                                                    (uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6)}
                                                label={<div onMouseEnter={() => setReasonNoneOfTheAboveDisableMessageFlag(false)} className="label-tooltip small-tooltip">{`${t('SURVEY_ALTERNATIVE_NONE_OF_THE_ABOVE')}`}
                                                    <LightTooltip title={<label>{t('TOOLTIP_SURVEY_ALTERNATIVE_NONE_OF_THE_ABOVE')}</label>}
                                                    /></div>}
                                            />
                                        </span>
                                    </Tooltip>
                                </div>
                            </FormControl>

                        </div>

                    </FormControl >
                )
            case `DROPDOWN`:
                return (
                    <FormControl required component="fieldset" >
                        <div className="option-values">
                            {uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions'])?.map((dropdown, i) => {
                                return (
                                    <FormGroup key={i}>
                                        <div className={formMode === 'READ_ONLY' ? "read-only radio-inline" : "radio-inline"} key={i} style={{ justifyContent: 'space-between' }}>
                                            <div className="radio-label" style={{ color: 'grey' }}>
                                                <Typography>{dropdown}</Typography>
                                            </div>
                                            <Button className="delete-aud-row" onClick={() => onRemoveSelectOneOptions(dropdown, i)}
                                                disabled={formMode === 'READ_ONLY' ? true : false}
                                                style={{ display: formMode === 'READ_ONLY' && 'none' }}
                                            >
                                                <DeleteTwoToneIcon fontSize='small' color='secondary' />
                                            </Button>
                                            {state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable && <div style={{ width: '220px', margin: '10px' }} >
                                                <FormControl className="form-select-box" >
                                                    <InputLabel variant="filled" style={{ pointerEvents: "auto" }} >
                                                        <div className="label-tooltip">{`${t('GO_TO_QUESTION')}`}
                                                        </div>
                                                    </InputLabel>
                                                    <Select
                                                        label={t('GOTO_QUESTION')}
                                                        value={state?.surveyForm?.surveyQuestionSet[index]?.path[i]?.questionId ? state?.surveyForm?.surveyQuestionSet[index]?.path[i]?.questionId : ''}
                                                        onChange={(e) => {
                                                            let cpEnabledId = state?.surveyForm?.surveyQuestionSet[index]?.path[i]?.questionId;
                                                            let gotoValue = e.target.value === -1 ? '0' : e.target.value;
                                                            let pathValues = state?.surveyForm?.surveyQuestionSet[index]?.path?.some(pt => pt?.questionId === e.target.value)
                                                            let findQuestionIndex = state?.surveyForm?.surveyQuestionSet?.findIndex(questions => questions.id === e.target.value)
                                                            if (isOptionQuestion(pathValues, state?.surveyForm?.surveyQuestionSet, cpEnabledId, gotoValue)) {
                                                                setIsOptionQuestionCP(true)
                                                            } else if (e.target.value === -1 || e.target.value.toString().length > 0) {
                                                                const modifiedPayload = Object.assign({}, state.surveyForm)
                                                                const conditionalQuestionArrayIndex = modifiedPayload.surveyQuestionSet[index]['conditionalQuestionArray'].findIndex(question => question.questionId === e.target.value);
                                                                if (conditionalQuestionArrayIndex > -1) {
                                                                    modifiedPayload.surveyQuestionSet[index]['path'][i] = {
                                                                        answerOptionIndex: i,
                                                                        questionIndex: conditionalQuestionArrayIndex,
                                                                        option: dropdown,
                                                                        target: state?.surveyForm?.surveyQuestionSet[index]?.conditionalQuestionArray[conditionalQuestionArrayIndex].questionTitle,
                                                                        questionId: e.target.value
                                                                    }
                                                                    if (state?.surveyForm?.surveyQuestionSet[findQuestionIndex]?.conditionalPathEnable) {
                                                                        setIsQuestionCP(true)
                                                                    }
                                                                }
                                                                dispatch({
                                                                    type: 'MODIFY_SURVEY_PAYLOAD',
                                                                    payload: {
                                                                        surveyPayload: modifiedPayload, currentPageName: 'question',
                                                                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                                                        // cpQuestionLimit: state?.surveyForm?.surveyQuestionSet[index]?.path?.length
                                                                    }
                                                                })
                                                                const arrangeQuestionArray = props.getQuestionListWithLink(modifiedPayload['surveyQuestionSet']);
                                                                state?.surveyForm?.surveyQuestionSet[index]?.path[i]?.target.length > 0 && arrangeArray(arrangeQuestionArray)
                                                                surveyFormValidation();
                                                            }
                                                        }}
                                                        name={`gotoQuestion`}
                                                        disabled={formMode === 'READ_ONLY' ? true : false}
                                                        MenuProps={{
                                                            anchorOrigin: {
                                                                vertical: "bottom",
                                                                horizontal: "left"
                                                            },
                                                            transformOrigin: {
                                                                vertical: "top",
                                                                horizontal: "left"
                                                            },
                                                            getContentAnchorEl: null
                                                        }}
                                                    >
                                                        {state?.surveyForm?.surveyQuestionSet[index]?.conditionalQuestionArray.map((type, i) => (
                                                            <MenuItem key={i} value={type?.questionId}>
                                                                {type?.questionTitle?.length > 0 ? type?.questionTitle : `Question ${2 + index + i} with no title`}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>}
                                        </div>
                                    </FormGroup>
                                )
                            })}
                            {state.surveyForm?.surveyQuestionSet[index]['answerOptionsWithAlternative']?.map((alternativeOption, i) => {
                                return (
                                    <div className={formMode === 'READ_ONLY' ? "read-only radio-inline" : "radio-inline"} key={i}
                                        style={{ justifyContent: 'space-between' }}>
                                        {((alternativeOption.key === 'other' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].mode === 'read') || (alternativeOption.key === 'noneOfTheAbove' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove'].mode === 'read')) && <div className="radio-label" style={{ color: 'grey' }}>
                                            <Typography>{alternativeOption.label} </Typography>
                                        </div>}
                                        {((alternativeOption.key === 'other' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].mode === 'edit') || (alternativeOption.key === 'noneOfTheAbove' && state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove'].mode === 'edit')) &&
                                            // <TextField
                                            //     InputLabelProps={{ shrink: true }}
                                            //     variant="outlined"
                                            //     name={t('SURVEY_ALTERNATIVE_OTHER_LABEL') ? 'surveyOther' : 'surveyNoneOfTheAbove'}
                                            //     onKeyPress={(e) => onModeChange(e, alternativeOption.key, 'read')}
                                            //     onChange={(e) => {
                                            //         onEditLabel(e.target.value, alternativeOption.key);
                                            //     }}
                                            //     value={alternativeOption.key === 'other' ? state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].label
                                            //         : state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove'].label}
                                            //     type="text"
                                            // />
                                            <SurveyAlternativePopup label={alternativeOption.key === 'other' ? state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].label : state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove'].label} hintText={alternativeOption.key} placeholder={alternativeOption.key === 'other' ? state.surveyForm?.surveyQuestionSet[index]['surveyAlternativeOther'].placeholder : ''} questionIndex={index} />
                                        }
                                        <Button className="delete-aud-row"
                                            disabled={formMode === 'READ_ONLY' ? true : false}
                                            onClick={(e) => onModeChange(e, alternativeOption.key, 'edit')}
                                            style={{ display: formMode === 'READ_ONLY' && 'none' }}>
                                            <EditIcon fontSize='small' color='secondary' />
                                        </Button>
                                        {(state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable && alternativeOption.key === 'noneOfTheAbove') && <div style={{ width: '220px', margin: '10px' }} >
                                            <FormControl className="form-select-box" >
                                                <InputLabel variant="filled" style={{ pointerEvents: "auto" }} >
                                                    <div className="label-tooltip">{`${t('GO_TO_QUESTION')}`}
                                                    </div>
                                                </InputLabel>
                                                <Select
                                                    label={t('GOTO_QUESTION')}
                                                    value={state?.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove?.targetQuestion}
                                                    onChange={(e) => {
                                                        let cpEnabledId = state?.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove?.targetQuestion;
                                                        let pathValue = state?.surveyForm?.surveyQuestionSet[index]?.path?.some(pt => pt?.questionId === e.target.value)
                                                        if (isOptionQuestion(pathValue, state?.surveyForm?.surveyQuestionSet, cpEnabledId, e.target.value)) {
                                                            setIsOptionQuestionCP(true)
                                                        } else {
                                                            const modifiedPayload = Object.assign({}, state.surveyForm);
                                                            // const conditionalQuestionArrayIndex = modifiedPayload.surveyQuestionSet[index]['conditionalQuestionArray'].findIndex(question => question.questionId === e.target.value);

                                                            // if (conditionalQuestionArrayIndex > -1) {
                                                            //     modifiedPayload.surveyQuestionSet[index]['path'][pathIndex] = {
                                                            //         answerOptionIndex: pathIndex,
                                                            //         questionIndex: conditionalQuestionArrayIndex,
                                                            //         option: alternativeOption.label,
                                                            //         target: state?.surveyForm?.surveyQuestionSet[index]?.conditionalQuestionArray[conditionalQuestionArrayIndex].questionTitle,
                                                            //         questionId: e.target.value
                                                            //     }
                                                            modifiedPayload.surveyQuestionSet[index]['surveyAlternativeNoneOfTheAbove']['targetQuestion'] = e.target.value;
                                                            //     setPrevSelected(e.target.value.toString())
                                                            // }
                                                            let findQuestionIndex = state?.surveyForm?.surveyQuestionSet?.findIndex(questions => questions?.id === e.target.value)
                                                            if (state?.surveyForm?.surveyQuestionSet[findQuestionIndex]?.conditionalPathEnable) {
                                                                setIsQuestionCP(true)
                                                            }
                                                            dispatch({
                                                                type: 'MODIFY_SURVEY_PAYLOAD',
                                                                payload: {
                                                                    surveyPayload: modifiedPayload, currentPageName: 'question',
                                                                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS'],
                                                                    cpQuestionLimit: state?.surveyForm?.surveyQuestionSet[index]?.path?.length
                                                                }
                                                            })
                                                            const arrangeQuestionArray = props.getQuestionListWithLink(modifiedPayload['surveyQuestionSet']);
                                                            arrangeArray(arrangeQuestionArray)
                                                            surveyFormValidation();
                                                        }
                                                    }}
                                                    name={`gotoQuestionid`}
                                                    disabled={formMode === 'READ_ONLY' ? true : false}
                                                    MenuProps={{
                                                        anchorOrigin: {
                                                            vertical: "bottom",
                                                            horizontal: "left"
                                                        },
                                                        transformOrigin: {
                                                            vertical: "top",
                                                            horizontal: "left"
                                                        },
                                                        getContentAnchorEl: null
                                                    }}
                                                >
                                                    {state?.surveyForm?.surveyQuestionSet[index]?.conditionalQuestionArray?.map((type, i) => (
                                                        <MenuItem key={i} value={type?.questionId} disabled={type?.questionTitle?.length > 0 ? false : true}>
                                                            {type?.questionTitle?.length > 0 ? type?.questionTitle : `Question ${2 + index + i} with no title`}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>}
                                    </div>
                                )
                            })}
                        </div>
                        <TextField
                            variant='outlined'
                            onChange={(e) => {
                                setDropDownBoxOption(e.target.value)
                                surveyFormValidation();
                            }}
                            value={dropDownBoxOption}
                            onKeyPress={onKeyEnterDropDownAddOption}
                            placeholder={t('ANSWER_OPTIONS_PLACEHOLDER')}
                            label={`${t('ANSWER_OPTIONS')} *`}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ maxLength: 50 }}
                            // disabled={formMode === 'READ_ONLY' ? true : false}
                            style={{ display: formMode === 'READ_ONLY' && 'none' }}

                        />
                        <p style={{ display: formMode === 'READ_ONLY' && 'none' }}>{`${t('TYPE_AND_PRESS_ENTER_FOR_CREATE_VALUE')}`}</p>
                        {/* {uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length > 6 && <p style={{ display: formMode === 'READ_ONLY' && 'none' }} className="error">{t('ONLY_ENTER_SIX_OPTIONS')}</p>} */}
                        {state.surveyForm?.surveyQuestionSet[index]?.answerOptionEachLengthErrorFlag && <p className="error" style={{ display: formMode === 'READ_ONLY' && 'none' }}>{t('SURVEY_ANSWER_OPTION_LENGTH_ERROR')}</p>}
                        <div className="option-rigt">
                            <FormControl >
                                <div className="switchery org-switchery">
                                    <Tooltip arrow open={formMode !== 'READ_ONLY' && reasonCpDisableMessageFlag} placement="left" title={formMode !== 'READ_ONLY' && reasonCpDisableMessage}>
                                        <span
                                            onMouseEnter={() => isCpDisableReason(isNoneOfHaveCp(state.surveyForm?.surveyQuestionSet, state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove?.targetQuestion, id),
                                                isParentHaveConditionalPath(state.surveyForm?.surveyQuestionSet, id),
                                                isLastQuestion(state.surveyForm?.surveyQuestionSet),
                                                state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther.enable, index)}
                                            onMouseLeave={() => removeIsCpDisableReason()}
                                        >
                                            <FormControlLabel
                                                disabled={isNoneOfHaveCp(state.surveyForm?.surveyQuestionSet, state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove?.targetQuestion, id) || isParentHaveConditionalPath(state.surveyForm?.surveyQuestionSet, id) || formMode === 'READ_ONLY' || isLastQuestion(state.surveyForm?.surveyQuestionSet) || state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther?.enable ? true : false}
                                                control={<Switch
                                                    checked={state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        const modifiedPayload = Object.assign({}, state.surveyForm);
                                                        modifiedPayload['surveyQuestionSet'][index]['conditionalPathEnable'] = e.target.checked;
                                                        let findQuestionIndex = state?.surveyForm?.surveyQuestionSet?.findIndex(questions => questions.id === state?.surveyForm?.surveyQuestionSet[index]?.conditionalQuestionArray[0]?.questionId);
                                                        if (e.target.checked) {
                                                            modifiedPayload['surveyQuestionSet'][index]['defaultTarget'] = null;
                                                            if (modifiedPayload['surveyQuestionSet'][index]['conditionalQuestionArray'] &&
                                                                modifiedPayload['surveyQuestionSet'][index]['conditionalQuestionArray']?.length !== 0 && modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']?.enable) {
                                                                modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']['targetQuestion'] = modifiedPayload['surveyQuestionSet'][index]['conditionalQuestionArray'][0]?.questionId;
                                                            }
                                                        } else {
                                                            modifiedPayload['surveyQuestionSet'][index]['defaultTarget'] = modifiedPayload['surveyQuestionSet'][index + 1]['id'];
                                                        }
                                                        modifiedPayload['conditionalQuestionArrayFlag'] = e.target.checked;
                                                        modifiedPayload['surveyQuestionSet'] = props.getQuestionListWithLink(modifiedPayload['surveyQuestionSet']);
                                                        if (modifiedPayload['surveyQuestionSet'][findQuestionIndex]?.conditionalPathEnable) {
                                                            setIsQuestionCP(true)
                                                        }
                                                        dispatch({
                                                            type: "MODIFY_SURVEY_PAYLOAD",
                                                            payload: {
                                                                surveyPayload: getQuestionListForConditionalPathing(modifiedPayload), currentPageName: 'question',
                                                                surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                                            }
                                                        })
                                                        if (!state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable) {
                                                            modifiedPayload['surveyQuestionSet'][index]['path'] = [];
                                                            dispatch({
                                                                type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                                payload: {
                                                                    surveyPayload: modifiedPayload
                                                                }
                                                            })
                                                        }
                                                        setPrevSelected(state.surveyForm?.surveyQuestionSet[index]?.conditionalQuestionArray[0]?.questionId)
                                                    }}
                                                    name="conditionalPathEnable" />}
                                                label={<div onMouseEnter={() => setReasonCpDisableMessageFlag(false)} className="label-tooltip small-tooltip">{`${t('CONDITIONAL_PATH')}`}
                                                    <LightTooltip title={<label>{t('TOOLTIP_CONDITIONAL_PATH')}</label>}
                                                    /></div>}
                                            />
                                        </span>
                                    </Tooltip>
                                </div>
                            </FormControl>
                            <FormControl>
                                <div className="switchery org-switchery">
                                    <FormControlLabel
                                        control={<Switch
                                            checked={state.surveyForm?.surveyQuestionSet[index]?.randomizeOrder}
                                            onChange={(e) => {
                                                handleChange(e);
                                                const modifiedPayload = Object.assign({}, state.surveyForm);
                                                modifiedPayload['surveyQuestionSet'][index]['randomizeOrder'] = e.target.checked;
                                                dispatch({
                                                    type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                    payload: {
                                                        surveyPayload: modifiedPayload
                                                    }
                                                })
                                            }}
                                            name="randomizeOrder" />}
                                        disabled={formMode === 'READ_ONLY'}
                                        label={<div className="label-tooltip small-tooltip">{`${t('RANDOMIZE_ORDER')}`}
                                            <LightTooltip title={<label>{t('TOOLTIP_RANDOMIZE_ORDER')}</label>}
                                            /></div>}
                                    />
                                </div>
                                <div className="switchery org-switchery" >
                                    <Tooltip arrow open={formMode !== 'READ_ONLY' && reasonOtherDisableMessageFlag} placement="left" title={formMode !== 'READ_ONLY' && reasonOtherDisableMessage}>
                                        <span
                                            onMouseEnter={() => isOtherDisabledReason(state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove.enable,
                                                state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable,
                                                (uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6), 'OTHER')}
                                            onMouseLeave={() => removeIsOtherDisableReason()}
                                        >
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther?.enable}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        const modifiedPayload = Object.assign({}, state.surveyForm);
                                                        modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeOther']['enable'] = e.target.checked;
                                                        const modifiedArray = modifiedPayload['surveyQuestionSet'][index]['answerOptionsWithAlternative'];
                                                        if (e.target.checked) {
                                                            modifiedArray.push(modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeOther']);
                                                            modifiedPayload.surveyQuestionSet[index].answerOptions = modifiedPayload?.surveyQuestionSet[index]?.answerOptions?.filter(answer => answer.toLowerCase() !== modifiedPayload.surveyQuestionSet[index]?.surveyAlternativeOther?.label?.toLowerCase());
                                                        } else {
                                                            const findAlternativeAnswerOptionOtherIndex = modifiedArray?.findIndex(answer => answer.key === 'other');
                                                            if (findAlternativeAnswerOptionOtherIndex > -1) {
                                                                modifiedArray.splice(findAlternativeAnswerOptionOtherIndex, 1);
                                                            }
                                                            modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeOther']['label'] = 'Other';
                                                            modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeOther']['placeholder'] = 'Enter your option';
                                                        }
                                                        dispatch({
                                                            type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                            payload: {
                                                                surveyPayload: modifiedPayload
                                                            }
                                                        })
                                                        surveyFormValidation();
                                                    }}
                                                    name="surveyAlternativeOther" />}
                                                disabled={state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove?.enable ||
                                                    formMode === 'READ_ONLY' || state.surveyForm?.surveyQuestionSet[index]?.conditionalPathEnable}
                                                label={<div onMouseEnter={() => setReasonOtherDisableMessageFlag(false)} className="label-tooltip small-tooltip">{`${t('SURVEY_ALTERNATIVE_OTHER')}`}
                                                    <LightTooltip title={<label>{t('TOOLTIP_SURVEY_ALTERNATIVE_OTHER')}</label>}
                                                    /></div>}
                                            />
                                        </span>
                                    </Tooltip>
                                </div>
                                <div className="switchery org-switchery" >
                                    <Tooltip arrow open={formMode !== 'READ_ONLY' && reasonNoneOfTheAboveDisableMessageFlag} placement="left" title={formMode !== 'READ_ONLY' && reasonNoneOfTheAboveDisableMessage}>
                                        <span
                                            onMouseEnter={() => isNoneOfTheAboveDisableReason(state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther.enable
                                                , (uniqueArrayList(state.surveyForm?.surveyQuestionSet[index]['answerOptions']).length === 6), 'NONEOFABOVE')}
                                            onMouseLeave={() => removeIsNoneOfTheAboveDisableReason()}
                                        >
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove?.enable}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        const modifiedPayload = Object.assign({}, state.surveyForm);
                                                        modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']['enable'] = e.target.checked;
                                                        const modifiedArray = modifiedPayload['surveyQuestionSet'][index]['answerOptionsWithAlternative'];
                                                        if (e.target.checked) {
                                                            modifiedArray.push(modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']);
                                                            if (modifiedPayload.surveyQuestionSet[index]?.conditionalQuestionArray && modifiedPayload.surveyQuestionSet[index]?.conditionalQuestionArray?.length !== 0) {
                                                                modifiedPayload.surveyQuestionSet[index].surveyAlternativeNoneOfTheAbove.targetQuestion = modifiedPayload?.surveyQuestionSet[index]?.conditionalQuestionArray[0]?.questionId;
                                                            } else {
                                                                modifiedPayload.surveyQuestionSet[index].surveyAlternativeNoneOfTheAbove.targetQuestion = '';
                                                            }
                                                            modifiedPayload.surveyQuestionSet[index].answerOptions = modifiedPayload?.surveyQuestionSet[index]?.answerOptions?.filter(answer => answer.toLowerCase() !== modifiedPayload.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove?.label?.toLowerCase());
                                                        } else {
                                                            const findAlternativeAnswerOptionOtherIndex = modifiedArray?.findIndex(answer => answer.key === 'noneOfTheAbove');
                                                            if (findAlternativeAnswerOptionOtherIndex > -1) {
                                                                modifiedArray?.splice(findAlternativeAnswerOptionOtherIndex, 1);
                                                            }
                                                            modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']['label'] = 'None of the Above';
                                                            modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']['targetQuestion'] = '';
                                                        }
                                                        dispatch({
                                                            type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                            payload: {
                                                                surveyPayload: modifiedPayload
                                                            }
                                                        })
                                                        surveyFormValidation();
                                                    }}
                                                    name="surveyAlternativeNoneOfTheAbove" />}
                                                disabled={state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeOther?.enable ||
                                                    formMode === 'READ_ONLY'}
                                                label={<div onMouseEnter={() => setReasonNoneOfTheAboveDisableMessageFlag(false)} className="label-tooltip small-tooltip">{`${t('SURVEY_ALTERNATIVE_NONE_OF_THE_ABOVE')}`}
                                                    <LightTooltip title={<label>{t('TOOLTIP_SURVEY_ALTERNATIVE_NONE_OF_THE_ABOVE')}</label>}
                                                    /></div>}
                                            />
                                        </span>
                                    </Tooltip>
                                </div>
                            </FormControl>
                        </div>
                    </FormControl >
                )
            case `SLIDER`:
                return (
                    <div>
                        <TextField
                            variant="outlined"
                            aria-describedby="units"
                            placeholder={t('ENTER_UNITS_TITLE')}
                            label={`${t('QUESTION_UNITS_LABEL')}`}
                            helperText={touchedUnits && errorUnits ? errorUnits : ""}
                            error={Boolean(touchedUnits && errorUnits)}
                            onBlur={handleBlur}
                            name={`surveyQuestionSet[${index}].units`}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => {
                                handleChange(e);
                                setUnits(e.currentTarget.value)
                                const modifiedPayload = Object.assign({}, state.surveyForm)
                                modifiedPayload['surveyQuestionSet'][index]['units'] = e.target.value
                                dispatch({
                                    type: 'MODIFY_SURVEY_PAYLOAD',
                                    payload: {
                                        surveyPayload: modifiedPayload, currentPageName: 'question',
                                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                    }
                                })
                                surveyFormValidation();
                            }}
                            value={ques.units}
                            disabled={formMode === 'READ_ONLY' ? true : false}
                            type="text"
                        />
                        <FormControl required component="fieldset">
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox color='primary'
                                        checked={ques.answerSubType}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setDecimalValue(e.target.checked);
                                            const modifiedPayload = Object.assign({}, state.surveyForm)
                                            modifiedPayload['surveyQuestionSet'][index]['answerSubType'] = e.target.checked
                                            modifiedPayload['minErrorFlag'] = e.target.checked
                                            modifiedPayload['surveyQuestionSet'][index]['max'] = (e.target.checked && state.surveyForm['surveyQuestionSet'][index]['max']) ? Number(ques.max).toFixed(2) : state.surveyForm.surveyQuestionSet[index]['max']
                                            modifiedPayload['surveyQuestionSet'][index]['min'] = (e.target.checked && state.surveyForm['surveyQuestionSet'][index]['min']) ? Number(ques.min).toFixed(2) : state.surveyForm.surveyQuestionSet[index]['min']
                                            if (!e.target.checked) {
                                                if (Math.floor(state.surveyForm.surveyQuestionSet[index]['min']) !== state.surveyForm.surveyQuestionSet[index]['min'] && state.surveyForm.surveyQuestionSet[index]['min']?.length > 0) {
                                                    modifiedPayload['surveyQuestionSet'][index]['decimalErrorMin'] = true;
                                                }
                                                if (Math.floor(state.surveyForm.surveyQuestionSet[index]['max']) !== state.surveyForm.surveyQuestionSet[index]['max'] && state.surveyForm.surveyQuestionSet[index]['max']?.length > 0) {
                                                    modifiedPayload['surveyQuestionSet'][index]['decimalErrorMax'] = true;
                                                }
                                            } else {
                                                if (Math.floor(state.surveyForm.surveyQuestionSet[index]['min']) !== state.surveyForm.surveyQuestionSet[index]['min'] && state.surveyForm.surveyQuestionSet[index]['min']?.length > 0) {
                                                    modifiedPayload['surveyQuestionSet'][index]['decimalErrorMin'] = false;
                                                }
                                                if (Math.floor(state.surveyForm.surveyQuestionSet[index]['max']) !== state.surveyForm.surveyQuestionSet[index]['max'] && state.surveyForm.surveyQuestionSet[index]['max']?.length > 0) {
                                                    modifiedPayload['surveyQuestionSet'][index]['decimalErrorMax'] = false;
                                                }
                                            }
                                            const intervalIndex = state.surveyForm.surveyQuestionSet[index]?.intervalArray.findIndex(interval => Number(interval.id) === state.surveyForm.surveyQuestionSet[index]['interval'])
                                            if (intervalIndex < 0) {
                                                setInterval(intervalArrayList[0].id);
                                                modifiedPayload['surveyQuestionSet'][index]['interval'] = intervalArrayList[0].id;
                                            }
                                            dispatch({
                                                type: 'MODIFY_SURVEY_PAYLOAD',
                                                payload: {
                                                    surveyPayload: modifiedPayload, currentPageName: 'question',
                                                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                                }
                                            })
                                            surveyFormValidation();
                                        }}
                                        disabled={formMode === 'READ_ONLY' ? true : false}
                                        name={`surveyQuestionSet[${index}].answerSubType`}
                                    />}
                                    label={'Enable Decimal'}
                                />
                            </FormGroup>
                        </FormControl>
                        <FormControl className="form-row" required component="fieldset">
                            <FormGroup>
                                <TextField
                                    variant="outlined"
                                    aria-describedby="minimum"
                                    placeholder={t('ENTER_MIN_TITLE')}
                                    label={`${t('QUESTION_MIN_LABEL')} *`}
                                    helperText={touchedMin && errorMin ? errorMin : ""}
                                    error={Boolean(touchedMin && errorMin)}
                                    onBlur={(e) => {
                                        handleBlur(e);
                                        setMinimumValue(e.target.value)
                                        if (state.surveyForm['surveyQuestionSet'][index]['answerSubType']) {
                                            const modifiedPayload = Object.assign({}, state.surveyForm)
                                            modifiedPayload['surveyQuestionSet'][index]['min'] = Number(e.target.value).toFixed(2)
                                            dispatch({
                                                type: 'MODIFY_SURVEY_PAYLOAD',
                                                payload: {
                                                    surveyPayload: modifiedPayload, currentPageName: 'question',
                                                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                                }
                                            })
                                        }

                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setMinimumValue(e.target.value)
                                        const modifiedPayload = Object.assign({}, state.surveyForm)
                                        modifiedPayload['surveyQuestionSet'][index]['min'] = e.target.value
                                        if (!state.surveyForm.surveyQuestionSet[index]['answerSubType']) {
                                            if (parseInt(e.target.value) !== Number(state.surveyForm.surveyQuestionSet[index]['min'])) {
                                                modifiedPayload['surveyQuestionSet'][index]['decimalErrorMin'] = true;
                                            } else {
                                                modifiedPayload['surveyQuestionSet'][index]['decimalErrorMin'] = false;
                                            }
                                        } else {
                                            modifiedPayload['surveyQuestionSet'][index]['decimalErrorMin'] = false;
                                        }
                                        if (state.surveyForm.surveyQuestionSet[index]['min']?.length === 0) {
                                            modifiedPayload['surveyQuestionSet'][index]['decimalErrorMin'] = false;
                                        }
                                        dispatch({
                                            type: 'MODIFY_SURVEY_PAYLOAD',
                                            payload: {
                                                surveyPayload: modifiedPayload, currentPageName: 'question',
                                                surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                            }
                                        })
                                        surveyFormValidation();
                                    }}
                                    value={state.surveyForm.surveyQuestionSet[index].min}
                                    name={questionMin}
                                    disabled={formMode === 'READ_ONLY' ? true : false}
                                    type="number"
                                />
                                {maxValueError && state.surveyForm.surveyQuestionSet[index].min && <FormHelperText style={{ display: formMode === 'READ_ONLY' && 'none' }} error={maxValueError}>{`${t('MIN_IS_NOT_GREATER')}`}</FormHelperText>}
                                {state.surveyForm.surveyQuestionSet[index].decimalErrorMin && <FormHelperText style={{ display: formMode === 'READ_ONLY' && 'none' }} error={state.surveyForm.surveyQuestionSet[index].decimalErrorMin} >{`${t('DECIMAL_NOT_ALLOWED')}`}</FormHelperText>}
                            </FormGroup>
                        </FormControl>
                        <FormControl className="form-row" required component="fieldset">
                            <FormGroup>
                                <TextField
                                    variant="outlined"
                                    aria-describedby="maximum"
                                    placeholder={t('ENTER_MAX_TITLE')}
                                    label={`${t('QUESTION_MAX_LABEL')} *`}
                                    helperText={touchedMax && errorMax ? errorMax : ""}
                                    error={Boolean(touchedMax && errorMax)}
                                    onBlur={(e) => {
                                        handleBlur(e);
                                        setMaximumValue(e.target.value)
                                        if (state.surveyForm['surveyQuestionSet'][index]['answerSubType']) {
                                            const modifiedPayload = Object.assign({}, state.surveyForm)
                                            modifiedPayload['surveyQuestionSet'][index]['max'] = Number(e.target.value).toFixed(2)
                                            dispatch({
                                                type: 'MODIFY_SURVEY_PAYLOAD',
                                                payload: {
                                                    surveyPayload: modifiedPayload, currentPageName: 'question',
                                                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                                }
                                            })
                                        }

                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setMaximumValue(e.target.value)
                                        const modifiedPayload = Object.assign({}, state.surveyForm)
                                        modifiedPayload['surveyQuestionSet'][index]['max'] = e.target.value;

                                        if (!state.surveyForm.surveyQuestionSet[index]['answerSubType']) {
                                            if (parseInt(e.target.value) !== Number(state.surveyForm.surveyQuestionSet[index]['max'])) {
                                                modifiedPayload['surveyQuestionSet'][index]['decimalErrorMax'] = true;
                                            } else {
                                                modifiedPayload['surveyQuestionSet'][index]['decimalErrorMax'] = false;
                                            }
                                        } else {
                                            modifiedPayload['surveyQuestionSet'][index]['decimalErrorMax'] = false;
                                        }
                                        if (state.surveyForm.surveyQuestionSet[index]['max']?.length === 0) {
                                            modifiedPayload['surveyQuestionSet'][index]['decimalErrorMax'] = false;
                                        }
                                        dispatch({
                                            type: 'MODIFY_SURVEY_PAYLOAD',
                                            payload: {
                                                surveyPayload: modifiedPayload, currentPageName: 'question',
                                                surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                            }
                                        })
                                        surveyFormValidation();
                                    }}
                                    value={state.surveyForm.surveyQuestionSet[index].max}
                                    name={questionMax}
                                    disabled={formMode === 'READ_ONLY' ? true : false}
                                    type="number"
                                />
                                {maxValueError && state.surveyForm.surveyQuestionSet[index].max && <FormHelperText style={{ display: formMode === 'READ_ONLY' && 'none' }} error={maxValueError} >{`${t('MAX_IS_NOT_LESS')}`}</FormHelperText>}
                                {state.surveyForm.surveyQuestionSet[index].decimalErrorMax && <FormHelperText style={{ display: formMode === 'READ_ONLY' && 'none' }} error={state.surveyForm.surveyQuestionSet[index].decimalErrorMax} >{`${t('DECIMAL_NOT_ALLOWED')}`}</FormHelperText>}
                            </FormGroup>
                        </FormControl>
                        <div className="form-row">
                            <FormControl className="form-select-box" >
                                <InputLabel variant="filled" style={{ pointerEvents: "auto" }} >
                                    <div className="label-tooltip">{decimalValue ? `${t('NUMBER_OF_INTERVAL')} *` : `${t('INTERVAL')} *`}
                                    </div>
                                </InputLabel>
                                <Select
                                    label={t('UNITS_TYPE')}
                                    value={state?.surveyForm?.surveyQuestionSet[index]?.interval}
                                    onChange={(e) => {
                                        setInterval(e.target.value.toString());
                                        handleChange(e);
                                        const modifiedPayload = Object.assign({}, state.surveyForm)
                                        modifiedPayload['surveyQuestionSet'][index]['interval'] = e.target.value.toString()
                                        dispatch({
                                            type: 'MODIFY_SURVEY_PAYLOAD',
                                            payload: {
                                                surveyPayload: modifiedPayload, currentPageName: 'question',
                                                surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                            }
                                        })
                                        surveyFormValidation();
                                    }}
                                    name={`surveyQuestionSet[${index}].interval`}
                                    disabled={(formMode === 'READ_ONLY' || showLoader) ? true : false}
                                >
                                    {!state?.surveyForm?.surveyQuestionSet[index]?.answerSubType ? state?.surveyForm?.surveyQuestionSet[index]?.intervalArray?.map((interval) => (
                                        <MenuItem
                                            key={interval.id}
                                            value={interval.id}
                                        >
                                            {interval.name}
                                        </MenuItem>
                                    )) :
                                        intervalDecimalArray.map((interval) => (
                                            <MenuItem
                                                key={interval.id}
                                                value={interval.id}
                                            >
                                                {interval.name}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                                {showLoader && loaderCount}
                            </FormControl>
                        </div>
                    </div>
                )
            default:
                return <h1></h1>;
        }
    }
    return (
        <div>
            <S.Container className="cc-form-wrapper">
                {snackbar && (
                    <SnackBarMessage open={snackbar} onClose={() => setSnackbar(false)}
                        severityType={'error'} message={snackBarMessageForCPQues} />)}
                {snackBarFlag && (
                    <SnackBarMessage open={snackBarFlag} onClose={() => setSnackBarFlag(false)}
                        severityType='success' message={snackBarMessageForNormalQues} />)}
                {isQuestionCP && (
                    <SnackBarMessage open={isQuestionCP} onClose={() => setIsQuestionCP(false)}
                        severityType='warning' message={`${t('CONDITIONAL_QUESTION_ASSOCIATED')}`} />)
                }
                {isOptionQuestionCP && (
                    <SnackBarMessage open={isOptionQuestionCP} onClose={() => setIsOptionQuestionCP(false)}
                        severityType='error' message={`${t('OPTION_ARE_ALREADY_ASSOCIATED_CP_QUESTION')}`} />)
                }
                {otherError && (
                    <SnackBarMessage open={otherError} onClose={() => setOtherError(false)}
                        severityType='error' message={`${t('REMOVE_OPTION_AND_ADD_NEW')}`} />)
                }
                <div className="cr-top-main question-row">
                    <div className={isParentHaveConditionalPath(state.surveyForm?.surveyQuestionSet, id) ? "condition-apply cr-top-wrapper" : isNoneOfHaveCp(state.surveyForm?.surveyQuestionSet, state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove?.targetQuestion, id) ? "condition-apply cr-top-wrapper" : "cr-top-wrapper"}>
                        <div className="cr-body-content">
                            {(isParentHaveConditionalPath(state.surveyForm?.surveyQuestionSet, id) || isNoneOfHaveCp(state.surveyForm?.surveyQuestionSet, state.surveyForm?.surveyQuestionSet[index]?.surveyAlternativeNoneOfTheAbove?.targetQuestion, id)) && <p className="info-label">{t('CONDITIONAL_QUESTION_TO')} {state.surveyForm?.surveyQuestionSet[index]?.cpAssociatedId}</p>}
                            <div className="qs-items">
                                <h1>{++questionNumber}</h1>
                                <Grid container className="question-box">
                                    <form style={{ width: '100%' }}>
                                        <div className="row">
                                            <Grid item xs={12} md={7}>
                                                <div className="form-row">
                                                    <TextField
                                                        variant="outlined"
                                                        aria-describedby="question-title"
                                                        placeholder={t('ENTER_QUESTION_TITLE')}
                                                        label={`${t('QUESTION_TITLE_LABEL')} *`}
                                                        name={questionTitleName}
                                                        helperText={touchedQuestion && errorQuestion ? errorQuestion : ""}
                                                        error={Boolean(touchedQuestion && errorQuestion)}
                                                        onBlur={handleBlur}
                                                        InputLabelProps={{ shrink: true }}
                                                        onChange={(e) => {
                                                            setQuestionTitle(e.currentTarget.value)
                                                            handleChange(e);
                                                            const modifiedPayload = Object.assign({}, state.surveyForm)
                                                            modifiedPayload['surveyQuestionSet'][index]['questionTitle'] = e.currentTarget.value;
                                                            modifiedPayload['surveyQuestionSet'] = props.getQuestionListWithLink(modifiedPayload['surveyQuestionSet'])
                                                            dispatch({
                                                                type: 'MODIFY_SURVEY_PAYLOAD',
                                                                payload: {
                                                                    surveyPayload: getQuestionListForConditionalPathing(modifiedPayload), currentPageName: 'question',
                                                                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                                                }
                                                            })
                                                            surveyFormValidation();
                                                        }}
                                                        value={ques.questionTitle}
                                                        disabled={formMode === 'READ_ONLY' ? true : false}
                                                        type="text"
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} md={5}>
                                                <div className="form-row">
                                                    <FormControl className="form-select-box" >
                                                        <InputLabel variant="filled" style={{ pointerEvents: "auto" }} >
                                                            <div className="label-tooltip">{`${t('QUESTION_TYPE')} *`}
                                                            </div>
                                                        </InputLabel>
                                                        <Select
                                                            label={t('QUESTION_TYPE')}
                                                            value={ques.questionType}
                                                            onChange={(e) => {
                                                                setQuestionType(e.target.value.toString());
                                                                setSelectOneOptionList([])
                                                                setCheckBoxOptionList([])
                                                                setDropDownOptionList([])
                                                                setIsQuestionCP(false)
                                                                handleChange(e);
                                                                const modifiedPayload = Object.assign({}, state.surveyForm)
                                                                modifiedPayload['surveyQuestionSet'][index]['questionType'] = e.target.value.toString()
                                                                modifiedPayload['surveyQuestionSet'][index]['answerOptions'] = []
                                                                modifiedPayload['surveyQuestionSet'][index]['path'] = [];
                                                                // modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']['targetQuestion'] = '';
                                                                // modifiedPayload['surveyQuestionSet'][index]['surveyAlternativeNoneOfTheAbove']['enable'] = false;
                                                                modifiedPayload['surveyQuestionSet'][index]['answerOptionEachLengthErrorFlag'] = false;
                                                                modifiedPayload['surveyQuestionSet'][index]['conditionalPathEnable'] = false;
                                                                modifiedPayload['questionTypeMain'] = e.target.value.toString();
                                                                modifiedPayload['surveyQuestionSet'] = props.getQuestionListWithLink(modifiedPayload['surveyQuestionSet'])
                                                                dispatch({
                                                                    type: 'MODIFY_SURVEY_PAYLOAD',
                                                                    payload: {
                                                                        surveyPayload: modifiedPayload, currentPageName: 'question',
                                                                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                                                    }
                                                                })
                                                                surveyFormValidation();
                                                            }}
                                                            name={`surveyQuestionSet[${index}].questionType`}
                                                            disabled={formMode === 'READ_ONLY' ? true : false}
                                                        >
                                                            {questionTypeList.map((type) => (
                                                                <MenuItem
                                                                    key={type.id}
                                                                    value={type.id}
                                                                // classes={{
                                                                //     root: classes.menuItemRoot,
                                                                //     selected: classes.menuItemSelected
                                                                // }}
                                                                >
                                                                    {type.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <div>{handleQuestionType()}</div>
                                            </Grid>
                                        </div>
                                    </form>
                                </Grid>
                            </div>
                        </div>
                    </div>
                    <div className="qus-right-btn">
                        <Button className="delete-aud-row" type="button" style={{ display: formMode === 'READ_ONLY' && 'none' }}
                            disabled={state.surveyForm?.surveyQuestionSet?.length < 2 ? true : false}
                            onClick={() => {
                                // if (isQuestionAssociatedWithOption(state.surveyForm?.surveyQuestionSet, id)) {
                                //     setSnackbar(true);
                                //     setSnackBarMessageForCPQues(t('QUESTION_ASSOCIATED_WITH_CP'));
                                // } else {
                                //remove question by index
                                setSnackBarFlag(true)
                                remove(index);
                                setSnackBarMessageForNormalQues(t('QUESTION_DELETED'))
                                const modifiedPayload = Object.assign({}, state.surveyForm);
                                modifiedPayload['surveyQuestionSet'].splice(index, 1);
                                const modifiedValidityObject = JSON.parse(JSON.stringify(modifiedPayload['validForm']));
                                delete modifiedValidityObject[index];
                                modifiedPayload['validForm'] = modifiedValidityObject;

                                // Conditional Path not allowed for single question
                                if (modifiedPayload['surveyQuestionSet'].length === 1) {
                                    const modifiedPayload = Object.assign({}, state.surveyForm)
                                    modifiedPayload['surveyQuestionSet'][0]['conditionalPathEnable'] = false
                                }

                                // update Question Link
                                modifiedPayload['surveyQuestionSet'] = props.getQuestionListWithLink(modifiedPayload['surveyQuestionSet'])

                                dispatch({
                                    type: 'MODIFY_SURVEY_PAYLOAD',
                                    payload: {
                                        surveyPayload: getQuestionListForConditionalPathing(modifiedPayload),
                                        currentPageName: 'registration',
                                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
                                    }
                                })
                                // setSnackbar(false)
                                isQuestionAssociatedWithOption(state.surveyForm?.surveyQuestionSet, id)
                                // }
                                /*if (state?.surveyForm?.surveyQuestionSet[index]?.min?.length === 0 && state?.surveyForm?.surveyQuestionSet[index]?.max?.length === 0) {
                                    //reset interval
                                    setIntervalArrayList([{ id: '1', name: '1' }]);
                                    const modifiedPayload = Object.assign({}, state.surveyForm)
                                    modifiedPayload['surveyQuestionSet'][index]['interval'] = '1'
                                    dispatch({
                                        type: 'MODIFY_SURVEY_PAYLOAD',
                                        payload: {
                                            surveyPayload: modifiedPayload, currentPageName: 'question',
                                            surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', 'SURVEY_QUESTION_PROGRESS']
                                        }
                                    })
                                }*/

                                // surveyFormValidation();
                            }}
                        >
                            <DeleteTwoToneIcon fontSize='small' color='secondary' />
                        </Button>
                        {/* <DragIndicatorIcon style={{ display: formMode === 'READ_ONLY' && 'none' }} fontSize='small' /> */}
                    </div>
                </div>
            </S.Container>
        </div >
    )
}

export default QuestionForm;
