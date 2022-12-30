import React from 'react'
import QuestionForm from './QuestionForm'
import { Formik, FieldArray, Form } from 'formik'
import { Grid, Button } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { GlobalContext } from '../../../context/globalState';
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { useHistory } from "react-router-dom";
import { SnackBarMessage, MobilePreview, Spinner } from "@dr-one/shared-component";
import * as yup from 'yup';
import { v1 } from "uuid";
import AddIcon from '@material-ui/icons/Add';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import Tree from './Tree'
const orgActiveId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive
const numberOfQuestion = JSON.parse(localStorage.getItem('dr-user'))?.organizations.find((item) => item.id === orgActiveId)?.noOfQuestions
const questionSize = numberOfQuestion ? numberOfQuestion : 5;

function WrapperQuestionForm() {
    const { t } = useTranslation();
    const history = useHistory();
    const { dispatch, state } = React.useContext(GlobalContext);
    const [localIndex, setLocalIndex] = React.useState(0);
    const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
    const [loader, toggleLoader] = React.useState(false);
    const [cpQuestionLimitFlag, setCpQuestionLimitflag] = React.useState(false)
    const [cpQuestionLimit, setCpQuestionLimit] = React.useState<any>(0);

    const addNewQuestion = {
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
    }

    const addLinearQuestionLink = (questionList) => {
        questionList.forEach((question, index) => {
            if ((questionList.length - 1) === index) {
                questionList[index]['defaultTarget'] = 'SUBMIT';
            } else {
                questionList[index]['defaultTarget'] = questionList[index + 1]['id'];
            }
        });
    }

    const getQuestionListWithLink = (questionListArray: any[]) => {
        const questionIndexList = getAllConditaionPathIndex();
        let questionListCopyArray = JSON.parse(JSON.stringify(questionListArray));

        addLinearQuestionLink(questionListCopyArray);

        // survey enabled Conditional path
        if (questionIndexList.length > 0) {
            questionIndexList.forEach(questionIndex => {
                questionListCopyArray = moveElement(questionListCopyArray, questionIndex);
            });
        }
        return questionListCopyArray;
    }

    function sliceQuestionList(array, targetIndex) {
        return array.slice(0, targetIndex + 1)
    }

    function moveElement(questionListArray, questionListIndex) {
        const startToConditionPathArray = sliceQuestionList(questionListArray, questionListIndex)
        const filteredConditionalPathOption = [];
        const cpPathArray = questionListArray[questionListIndex].path
        const uniqueQuestionIdList = [];
        for (let questionIndex in questionListArray) {
            for (let cpPathIndex in cpPathArray) {
                if (questionListArray[questionIndex].id == cpPathArray[cpPathIndex]?.questionId
                    && !uniqueQuestionIdList.includes(questionListArray[questionIndex].id)
                ) {
                    uniqueQuestionIdList.push(questionListArray[questionIndex].id);
                    filteredConditionalPathOption.push(questionListArray[questionIndex]);
                }
            }
        }
        const mergeStartCpAndFilterConditionalOptions = [...startToConditionPathArray, ...filteredConditionalPathOption]
        let unUsedArrayList = state.surveyForm.surveyQuestionSet.filter(({ id: id1 }) => !mergeStartCpAndFilterConditionalOptions.some(({ id: id2 }) => id2 === id1));
        filteredConditionalPathOption.forEach((question, questionIndex) => {
            if (unUsedArrayList.length > 0) {
                filteredConditionalPathOption[questionIndex]['defaultTarget'] = unUsedArrayList[0].id
            } else {
                filteredConditionalPathOption[questionIndex]['defaultTarget'] = 'SUBMIT'
            }
        })

        if (unUsedArrayList.length > 0) {
            addLinearQuestionLink(unUsedArrayList);
        }

        const finalArrangedQuestionList = [...startToConditionPathArray, ...filteredConditionalPathOption, ...unUsedArrayList];

        return finalArrangedQuestionList;
    }

    const getAllConditaionPathIndex = () => {

        const questionIndexList = [];

        state.surveyForm.surveyQuestionSet.forEach((item, index) => {
            if (item.conditionalPathEnable) {
                questionIndexList.push(index);
            }
        })

        return questionIndexList;
    }

    const goBackToSurveyManage = (): void => {
        const modifiedPayload = Object.assign({}, state.surveyForm);
        dispatch({
            type: 'MODIFY_SURVEY_PAYLOAD',
            payload: {
                surveyPayload: modifiedPayload, currentPageName: 'registration',
                surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
            }
        })
        // history.push('/survey/manage');
    }
    const backToRegistrationPage = (payload): void => {
        dispatch({
            type: "CHANGE_PAGE",
            payload: {
                currentPageName: 'surveywelcomepage',
            },
        });
        dispatch({
            type: "ACTIVE_STEPPER",
            payload,
            surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
        });
        Mixpanel.track("Create Survey Page View", { "page": "Welcome Page" });

    }
    const changePage = (payload): void => {
        dispatch({
            type: "CHANGE_PAGE",
            payload: {
                currentPageName: 'surveylastpage',
            },
        });
        dispatch({
            type: "ACTIVE_STEPPER",
            payload,
            surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, `${t('SURVEY_QUESTION_PROGRESS')}`, `${t('LAST_SURVEY_PAGE')}`]
        });
        Mixpanel.track("Create Survey Page View", { "page": "Last Page" });
    }

    React.useEffect(() => {
        getQuestionListWithLink(state.surveyForm.surveyQuestionSet)
        // translate();
    }, [state.surveyForm])
    const validationSchema = yup.object().shape({
        surveyQuestionSet: yup.array().of(
            yup.object().shape({
                questionTitle: yup.string().required(t('QUESTION_FIELD_REQUIRED')).max(400, t('QUESTION_ALLOWED_400')),
                questionType: yup.string(),
                min: yup.number().when('questionType', {
                    is: 'SLIDER',
                    then: yup.number().required(t('MINIMUM_REQUIRED_FIELD')).min(0, t('MINIMUM_SHOULD_ZERO'))
                }),
                max: yup.number().when('questionType', {
                    is: 'SLIDER',
                    then: yup.number().required(t('MAXIMUM_REQUIRED_FIELD')).min(1, t('MAXIMUM_SHOULD_ONE'))
                }),
                units: yup.string().when('questionType', {
                    is: 'SLIDER',
                    then: yup.string().max(10, t('NOT_ALLOWED_MORE_THAN'))
                }),
                freeText: yup.string().when('questionType', {
                    is: 'FREETEXT',
                    then: yup.string().max(140, t('FREETEXT_ALLOWED_140'))
                }),
            })
        )
    })

    const modifyQuestionArray = () => {
        const questionArray = [];
        state.surveyForm?.surveyQuestionSet?.forEach(question => {
            if (question.questionType === 'SLIDER') {
                const answerOptions = [];
                answerOptions.push(question.min, question.max, question.interval);
                questionArray.push({
                    organizationId: organizationId,
                    units: question.units,
                    answerType: question.questionType,
                    answerSubType: question.answerSubType ? 'RANGE_DECIMAL' : 'RANGE_INTEGER',
                    answerOptions: answerOptions,
                    question: question.questionTitle
                })
            } else if (question.questionType === 'CHECKBOX') {
                const surveyAlternativeOptions = [];
                question.answerOptionsWithAlternative.forEach(option => {
                    surveyAlternativeOptions.push(option.label);
                })
                questionArray.push({
                    organizationId: organizationId,
                    answerType: question.questionType,
                    answerSubType: 'NONE',
                    answerOptions: question.answerOptions.concat(surveyAlternativeOptions),
                    question: question.questionTitle
                })
            } else if (question.questionType === 'RADIOBUTTON') {
                const surveyAlternativeOptions = [];
                question.answerOptionsWithAlternative.forEach(option => {
                    surveyAlternativeOptions.push(option.label);
                })
                questionArray.push({
                    organizationId: organizationId,
                    answerType: question.questionType,
                    answerSubType: 'NONE',
                    answerOptions: question.answerOptions.concat(surveyAlternativeOptions),
                    question: question.questionTitle
                })
            } else if (question.questionType === 'DROPDOWN') {
                let answerOptions = [];
                question.answerOptions.forEach(answer => {
                    answerOptions.push(answer);
                })
                answerOptions.unshift(t('SURVEY_QUESTION_TYPE_DROPDOWN_DEFAULT_OPTION'))
                const surveyAlternativeOptions = [];
                question.answerOptionsWithAlternative.forEach(option => {
                    surveyAlternativeOptions.push(option.label);
                })
                questionArray.push({
                    organizationId: organizationId,
                    answerType: question.questionType,
                    answerSubType: 'NONE',
                    answerOptions: answerOptions.concat(surveyAlternativeOptions),
                    question: question.questionTitle
                })
            } else if (question.questionType === 'FREETEXT') {
                questionArray.push({
                    organizationId: organizationId,
                    answerType: question.questionType,
                    answerSubType: 'NONE',
                    answerOptions: [140, question.freeText],
                    question: question.questionTitle
                })
            }
        })
        return questionArray;
    }

    const isSurveyValid = (): boolean => {
        const validityArray = Object.values(state.surveyForm.validForm);
        if (validityArray.includes(false)) {
            return true;
        } else {
            return false;
        }
    }

    return (
        < Grid container spacing={3}>
            {/* {snackbar && (
                <SnackBarMessage open={snackbar} onClose={() => setSnackbar(false)}
                    severityType={snackbarMessageSuccess ? 'success' : 'error'} message={snackbarMessageValue} />)} */}
            <Grid item md={8} xs={12}>
                <Formik initialValues={{ surveyQuestionSet: state.surveyForm?.surveyQuestionSet }}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        // surveySubmit()
                        changePage(3);
                    }}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                >
                    {({ isSubmitting, values, touched, errors, handleChange, handleBlur, isValid, handleSubmit }) => (
                        <Form onSubmit={handleSubmit} className="survey-question">
                            <FieldArray name="surveyQuestionSet">

                                {({ push, remove }) => (
                                    <div className="outer-wrapper">
                                        {values?.surveyQuestionSet?.map((ques, index) => {
                                            setLocalIndex(index)
                                            return (
                                                <div key={index} className="inner-wrapper">
                                                    <QuestionForm
                                                        values={values}
                                                        handleChange={handleChange}
                                                        touched={touched}
                                                        errors={errors}
                                                        index={index}
                                                        ques={state.surveyForm.surveyQuestionSet[index]}
                                                        handleBlur={handleBlur}
                                                        formMode="CREATE_ONLY"
                                                        remove={remove}
                                                        id={ques.id}
                                                        getQuestionListWithLink={getQuestionListWithLink}
                                                    />
                                                </div>
                                            )
                                        })}
                                        <div className="add-survey-bottom" style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
                                            <Button type="button" className="add-question-btn" variant="contained"
                                                disabled={cpQuestionLimitFlag ? questionSize === cpQuestionLimit : state.surveyForm.surveyQuestionSet?.length === questionSize}
                                                color="primary" onClick={() => {
                                                    push(addNewQuestion)
                                                    const modifiedPayload = Object.assign({}, state.surveyForm);
                                                    modifiedPayload['surveyQuestionSet'][modifiedPayload['surveyQuestionSet'].length - 1]['defaultTarget'] = addNewQuestion.id
                                                    modifiedPayload['surveyQuestionSet'].push(addNewQuestion);
                                                    modifiedPayload['questionTypeMain'] = 'CHECKBOX';
                                                    modifiedPayload['surveyQuestionSet'] = getQuestionListWithLink(modifiedPayload['surveyQuestionSet']);
                                                    dispatch({
                                                        type: 'MODIFY_SURVEY_STATE_PAYLOAD',
                                                        payload: {
                                                            surveyPayload: modifiedPayload
                                                        }
                                                    })
                                                }}>
                                                <AddIcon />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </FieldArray>
                            <div className="cc-global-buttons registration-btn" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    type="button"
                                    onClick={() => { backToRegistrationPage(1) }}
                                >
                                    {t('BACK_BUTTON')}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={isSurveyValid() || isSubmitting || (!cpQuestionLimitFlag && state.surveyForm.surveyQuestionSet?.length > questionSize)}
                                    startIcon={<ArrowForwardOutlinedIcon fontSize="small" />} >
                                    <span>{t('CONTINUE_BUTTON')}</span>
                                </Button>
                            </div>
                        </Form>
                    )}

                </Formik>
            </Grid>
            <Grid item md={4} xs={12}>
                <MobilePreview template={'SURVEY'}
                    format={'PUSH'}
                    objectiveType={'surveyAd'}
                    surveyData={{
                        description: state.surveyForm?.surveyDesc, organizationId: organizationId, status: 'ACTIVE',
                        termsAndConditions: state.surveyForm?.conditionFlag ? state.surveyForm?.surveyUrl : '', title: state.surveyForm?.surveyName,
                        welcomeText: state.surveyForm.welcomeText,
                        welcomeStartButton: state.surveyForm.startButtonText,
                        welcomeImage: state.surveyForm?.surveyFileUploadSection?.imageUrl,
                        finalTitle: state.surveyForm.finalTitle,
                        finalText: state.surveyForm.finalText,
                        finalImage: state.surveyForm?.surveyLastFileUploadSection?.imageUrl,
                        finalButtonText: state.surveyForm.textButton,
                        section: state.currentSurveySection
                    }}
                    questionDetails={modifyQuestionArray()}
                    campaignType={''} 
                    message={{
                        title: '',
                        body: '',
                        text: '',
                        button: [],
                        icon: '',
                        banner: ''
                    }}/>
            </Grid>
        </Grid >
    )
}
export default WrapperQuestionForm
