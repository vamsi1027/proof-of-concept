import React, { useCallback, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { createTheme, Grid, TextField, Button, FormControlLabel, Switch, Tabs, Tab, Typography, Box } from '@material-ui/core'
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import * as S from "./SurveyCreation.style";
import * as yup from 'yup';
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { GlobalContext } from '../../../../context/globalState';
import { useHistory } from "react-router-dom";
import { Formik } from 'formik';
import { SnackBarMessage, Spinner, MobilePreview } from "@dr-one/shared-component";
import WelcomeContentPopup from "../../../../components/Common/WelcomeContentPopup/WelcomeContentPopup";
import Tree from '../../../../components/Common/QuestionForm/Tree'
const orgActiveId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive
const regMatchLink = /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;
function SurveyLastPage() {
    const { t } = useTranslation();
    const { dispatch, state } = useContext(GlobalContext);
    const theme = createTheme({
        overrides: {
            MuiOutlinedInput: {
                multiline: {
                    height: '120px',
                }
            }
        }
    });

    const [surveyFinalTitle, setSurveyFinalTitle] = React.useState(state?.surveyForm.finalTitle)
    const [surveyFinalText, setSurveyFinalText] = React.useState(state?.surveyForm.finalText)
    const [surveyLastAddImageFlag, setSurveyLastAddImageFlag] = React.useState(state?.surveyForm.addImageLastFlag);
    const [surveyLastFinalButtonFlag, setSurveyLastFinalButtonFlag] = React.useState(state?.surveyForm.finalButtonFlag);
    const [textButton, setSurveyTextButton] = React.useState(state?.surveyForm.textButton)
    const [buttonLink, setSurveyButtonLink] = React.useState(state?.surveyForm.buttonLink)
    const [loader, toggleLoader] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState(false);
    const [snackbarMessageValueMessage, setSnackbarMessageValueMessage] = React.useState('');
    const [tabValueAppIcon, setTabValueAppIcon] = React.useState(0);
    const [fileNameNotification, setFileNameNotification] = React.useState('');
    const [fileUploadErrorNotification, setFileUploadErrorNotification] = React.useState('');
    const [isShowContentPopup, toggleContentPopup] = React.useState(false);
    const [fileNameRichNotification, setFileNameRichNotification] = React.useState('');
    const [fileUploadErrorRichNotification, setFileUploadErrorRichNotification] = React.useState('');
    const [tabValueBanner, setTabValueBanner] = React.useState(0);
    const [snackbarMessageSuccess, setSnackbarMessageSuccess] = React.useState(false);
    const [snackbarMessageValue, setSnackbarMessageValue] = React.useState('');
    const [cpQuestionLimitFlag, setCpQuestionLimitflag] = React.useState(false)
    const [cpQuestionLimit, setCpQuestionLimit] = React.useState<any>(0);
    const [urlProtocolWarning, setUrlProtocolWarning] = React.useState('');
    let history = useHistory();

    const handleActiveStepper = (payload): void => {
        dispatch({
            type: "ACTIVE_STEPPER",
            payload,
            surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS',]
        });
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
    const handleChangeTabAppIcon = (event: any, newValue: number): void => {
        setTabValueAppIcon(newValue);
        setFileUploadErrorNotification('');
        if (newValue === 1) {
            toggleContentPopup(isShowContentPopup => !isShowContentPopup);
        }
    };
    const setChosenFileName = (event: any, imageType: string): void => {
        if (imageType === 'SURVEY') {
            setFileNameNotification(event.target.files[0].name);
        } else {
            setFileNameRichNotification(event.target.files[0].name);
        }
        imageType === 'SURVEY' ? setFileUploadErrorNotification('') : setFileUploadErrorRichNotification('');
        setImageValidation(event.target.files[0], event.target.files[0].name, imageType);
    }
    const setImageValidation = (file: any, fileName: string, imageType: string): void => {
        let maxAllowedImageSize;
        const modifiedPayload = Object.assign({}, state.surveyForm);
        const allowedImageType = ['jpg', 'jpeg', 'png'];
        // if (imageType === 'SURVEY') {
        //     maxAllowedImageSize = parseInt(state.orgDetails.notificationImageSize ? state.orgDetails.notificationImageSize : 100, helper.radix) * 1000;
        // } else {
        maxAllowedImageSize = parseInt(state.orgDetails.mainImageSize ? state.orgDetails.mainImageSize : 300, helper.radix) * 1000;
        // }
        if (allowedImageType.indexOf(fileName.split('.').pop()) === -1) {
            imageType === 'SURVEY' ? setFileUploadErrorNotification(t('CREATIVE_INVALID_IMAGE_FORMAT_ERROR')) :
                setFileUploadErrorRichNotification(t('CREATIVE_INVALID_IMAGE_FORMAT_ERROR'));
            modifiedPayload['surveyLastFileUploadSection'] = {};
            dispatch({
                type: 'MODIFY_SURVEY_PAYLOAD',
                payload: {
                    surveyPayload: modifiedPayload, currentPageName: 'surveylastpage',
                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS', `${t('LAST_SURVEY_PAGE')}`]
                }
            })
        } else {
            if (file.size <= maxAllowedImageSize) {
                if (fileName.trim().length > 2) {
                    apiDashboard.get('campaign-mgmt-api/imagecontents/name?name=' + fileName.trim() + '&imageContentType=' + imageType).then(res => {
                        if (res.data.message === 'false') {
                            imageType === 'SURVEY' ? setFileUploadErrorNotification('') : setFileUploadErrorRichNotification('');
                            fileUpload(file, fileName, imageType);
                        }
                        else {
                            imageType === 'SURVEY' ? setFileUploadErrorNotification(t('CREATIVE_IMAGE_DUPLICATE_NAME_ERROR'))
                                : setFileUploadErrorRichNotification(t('CREATIVE_IMAGE_DUPLICATE_NAME_ERROR'));
                            modifiedPayload['surveyLastFileUploadSection'] = {};
                            dispatch({
                                type: 'MODIFY_SURVEY_PAYLOAD',
                                payload: {
                                    surveyPayload: modifiedPayload, currentPageName: 'surveylastpage',
                                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS', `${t('LAST_SURVEY_PAGE')}`]
                                }
                            })
                        }
                    }, error => {
                        imageType === 'SURVEY' ? setFileUploadErrorNotification(helper.getErrorMessage(error)) :
                            setFileUploadErrorRichNotification(helper.getErrorMessage(error));
                        modifiedPayload['surveyLastFileUploadSection'] = {};
                        dispatch({
                            type: 'MODIFY_SURVEY_PAYLOAD',
                            payload: {
                                surveyPayload: modifiedPayload, currentPageName: 'surveylastpage',
                                surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS', `${t('LAST_SURVEY_PAGE')}`]
                            }
                        })
                    });
                }
                else {
                    imageType === 'SURVEY' ? setFileUploadErrorNotification(t('CREATIVE_IMAGE_FILE_NAME_MIN_LENGTH_ERROR')) :
                        setFileUploadErrorRichNotification(t('CREATIVE_IMAGE_FILE_NAME_MIN_LENGTH_ERROR'));
                    modifiedPayload['surveyLastFileUploadSection'] = {};
                    dispatch({
                        type: 'MODIFY_SURVEY_PAYLOAD',
                        payload: {
                            surveyPayload: modifiedPayload, currentPageName: 'surveylastpage',
                            surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS', `${t('LAST_SURVEY_PAGE')}`]
                        }
                    })
                }
            }
            else {
                imageType === 'SURVEY' ? setFileUploadErrorNotification(`${t('CREATIVE_IMAGE_FILE_SIZE_MAX_ERROR')} ${maxAllowedImageSize / 1000} kb for ${imageType}`)
                    : setFileUploadErrorRichNotification(`${t('CREATIVE_IMAGE_FILE_SIZE_MAX_ERROR')} ${maxAllowedImageSize / 1000} kb for ${imageType}`)
                modifiedPayload['surveyLastFileUploadSection'] = {};
                dispatch({
                    type: 'MODIFY_SURVEY_PAYLOAD',
                    payload: {
                        surveyPayload: modifiedPayload, currentPageName: 'surveylastpage',
                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS', `${t('LAST_SURVEY_PAGE')}`]
                    }
                })
            }
        }
    }
    const fileUpload = (file: any, fileName: string, contentType: string): void => {
        const formData: FormData = new FormData();
        formData.append('file', file, fileName);
        formData.append('type', contentType);
        formData.append('imageContentType', contentType);
        const modifiedPayload = Object.assign({}, state.surveyForm);
        const headers = new Headers({ 'Content-Type-2': 'multipart/form-data' });
        apiDashboard.post('files/upload', formData, headers).then(res => {
            contentType === 'SURVEY' ? setFileUploadErrorNotification('') : setFileUploadErrorRichNotification('');
            const contentPayload = {
                imageFileId: res.data.data.id,
                imageUrl: res.data.data.url,
                name: fileName,
                organizationId: res.data.data.organizationId,
                userId: res.data.data.userId,
                imageContentType: contentType
            }
            apiDashboard.post('campaign-mgmt-api/imagecontents', contentPayload).then(res => {
                contentType === 'SURVEY' ? setFileUploadErrorNotification('') : setFileUploadErrorRichNotification('');
                modifiedPayload['surveyLastFileUploadSection'] = res.data.data;
                dispatch({
                    type: 'MODIFY_SURVEY_PAYLOAD',
                    payload: {
                        surveyPayload: modifiedPayload, currentPageName: 'surveylastpage',
                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS', `${t('LAST_SURVEY_PAGE')}`]
                    }
                })
                setSnackbarMessageSuccess(true);
                setSnackbarMessageValue(res.data.message);
            }, error => {
                contentType === 'SURVEY' ? setFileUploadErrorNotification(helper.getErrorMessage(error)) :
                    setFileUploadErrorRichNotification(helper.getErrorMessage(error));
                modifiedPayload['surveyLastFileUploadSection'] = {};
                dispatch({
                    type: 'MODIFY_SURVEY_PAYLOAD',
                    payload: {
                        surveyPayload: modifiedPayload, currentPageName: 'surveylastpage',
                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS', `${t('LAST_SURVEY_PAGE')}`]
                    }
                })
            });
        }, error => {
            contentType === 'SURVEY' ? setFileUploadErrorNotification(helper.getErrorMessage(error)) :
                setFileUploadErrorRichNotification(helper.getErrorMessage(error));
            modifiedPayload['surveyLastFileUploadSection'] = {};
            dispatch({
                type: 'MODIFY_SURVEY_PAYLOAD',
                payload: {
                    surveyPayload: modifiedPayload, currentPageName: 'surveylastpage',
                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS', `${t('LAST_SURVEY_PAGE')}`]
                }
            })
        });

    }
    const handleOpenModal = (value: boolean): void => {
        toggleContentPopup(value);
        setTabValueAppIcon(0);
        setTabValueBanner(0);
    }
    const backToRegistrationPage = () => {
        dispatch({
            type: "CHANGE_PAGE",
            payload: {
                currentPageName: 'question',
            },
        });
        handleActiveStepper(2)
        Mixpanel.track("Create Survey Page View", { "page": "Question" });

    }
    const changePage = (payload): void => {
        dispatch({
            type: "CHANGE_PAGE",
            payload: {
                currentPageName: 'surveylastpage',
                payload
            },

        });
        dispatch({
            type: "ACTIVE_STEPPER",
            payload: 3,
            surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS', `${t('LAST_SURVEY_PAGE')}`]
        });
    }

    function uniqueArrayList(array) {
        var uniqueOptionList = array?.filter(function (e) {
            var key = Object.keys(e).map(k => e[k]).join('|');
            if (!this[key]) {
                this[key] = true;
                return true;
            }
        }, {});
        return uniqueOptionList;
    }
    const questionLists = (questionArray: any): any => {
        return questionArray?.map((item, index) => {
            const sliderOption = [`${item.min}`, `${item.max}`, `${item.interval}`]
            const sliderAnsOptions = item.questionType === 'SLIDER' ? sliderOption : (item.questionType === 'FREETEXT' && item.freeText.length === 0) ? ['140'] : (item.questionType === 'FREETEXT' && item.freeText.length > 0) ? ['140', `${item.freeText}`] : uniqueArrayList(item.answerOptions)
            const questionSubTypes = item.questionType === 'SLIDER' && item.answerSubType === false ? 'RANGE_INTEGER' : item.questionType !== 'SLIDER' ? 'NONE' : 'RANGE_DECIMAL';
            const newIndex = index + 1;
            let routeOptions = {};
            if (item.conditionalPathEnable === true) {
                let conditionalPath = [];
                if (item?.path.length > 0) {
                    conditionalPath = item?.path?.map((tag, i) => {
                        return {
                            option: tag.option,
                            target: tag.questionId === -1 ? 'SUBMIT' : tag.questionId
                        }
                    })
                }
                if (item.surveyAlternativeNoneOfTheAbove.enable) {
                    conditionalPath.push({
                        option: item.surveyAlternativeNoneOfTheAbove.label,
                        target: item.surveyAlternativeNoneOfTheAbove.targetQuestion === -1 ? 'SUBMIT' : item.surveyAlternativeNoneOfTheAbove.targetQuestion
                    })
                }
                routeOptions = {
                    type: 'C',
                    defaultTarget: item.defaultTarget,
                    path: conditionalPath
                }
            } else {
                routeOptions = {
                    type: 'L',
                    defaultTarget: questionArray.length === 1 ? 'SUBMIT' : item.defaultTarget,
                    path: null
                }
            }
            return {
                id: item.id,
                answerOptions: sliderAnsOptions,
                answerSubType: questionSubTypes,
                answerType: item.questionType,
                index: `${newIndex.toString()}`,
                question: item.questionTitle,
                units: item.questionType === 'SLIDER' ? (item.units.length > 0 ? item.units : null) : null,
                randomize: item.randomizeOrder,
                routeOptions,
                other: item.surveyAlternativeOther.enable ? {
                    enabled: item.surveyAlternativeOther.enable,
                    limit: 140,
                    label: item.surveyAlternativeOther.label,
                    hint: item.surveyAlternativeOther.placeholder
                } : null,
                noneOfTheAbove: item.surveyAlternativeNoneOfTheAbove.enable ? {
                    enabled: item.surveyAlternativeNoneOfTheAbove.enable,
                    label: item.surveyAlternativeNoneOfTheAbove.label
                } : null
            }
        })
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
        history.push('/survey/manage');
    }
    let data = [];
    function getQuestionById(id) {
        return data.filter((item => item.id === id))[0]
    }
    function translate() {
        data = state?.surveyForm?.surveyQuestionSet;
        let maxDepth;
        if (doesQuestionContainConditionalPath(data)) {
            const tree = new Tree(1, 'root');
            buildTreeStructure(tree, data);
            maxDepth = calculateDepth(tree.root);
            setCpQuestionLimit(maxDepth + 1)
            setCpQuestionLimitflag(true)
        }
        else {
            setCpQuestionLimitflag(false)
            setCpQuestionLimit(0)
        }
    }
    function buildTreeStructure(tree, questions) {
        questions.forEach((item, index) => {
            if (isConditionalPathEnabled(item)) {
                item.path.forEach(element => {
                    tree.insert(
                        (index === 0) ? 1 : item.id,
                        element.questionId,
                        element.target
                    );
                });
            } else {
                const node = tree.find(item.id);
                if (node && (questions.length - 1) !== index) {
                    if (item.defaultTarget !== 'SUBMIT') {
                        tree.insert(
                            item.id,
                            item.defaultTarget,
                            getQuestionById(item.id)["questionTitle"]
                        );
                    }
                } else if (index === 0 && (questions.length - 1) !== index) {
                    tree.insert(
                        1,
                        questions[index + 1]["id"],
                        questions[index + 1]["questionTitle"]
                    );
                }
            }
        });
    }

    function calculateDepth(node) {
        let maxDepth = 0;
        if (node.children !== undefined) {
            let depth = 0;
            node.children.forEach(function (child) {
                depth = calculateDepth(child) + 1;
                maxDepth = depth > maxDepth ? depth : maxDepth;
            })
        }
        node.depth = maxDepth;

        return maxDepth;
    }
    function isConditionalPathEnabled(question) {
        return (question["conditionalPathEnable"]);
    }
    function doesQuestionContainConditionalPath(questions) {
        return questions.some(item => isConditionalPathEnabled(item))
    }
    React.useEffect(() => {
        translate();
    }, [state.surveyForm])
    const surveySubmit = () => {
        sessionStorage.setItem('enablePrompt', 'false')
        toggleLoader(true);
        apiDashboard.post(`campaign-mgmt-api/survey`, {
            version: "2.0",
            organizationId: orgActiveId,
            description: state.surveyForm.surveyDesc,
            questions: questionLists(state.surveyForm?.surveyQuestionSet),
            firstQuestion: questionLists(state.surveyForm?.surveyQuestionSet)[0]?.id,
            status: "ACTIVE",
            termsAndConditions: state.surveyForm.conditionFlag ? state.surveyForm.surveyUrl : null,
            title: state.surveyForm.surveyName,
            maxLevel: state.surveyForm?.surveyQuestionSet?.some(ele => ele.conditionalPathEnable === true) ? cpQuestionLimit : state.surveyForm?.surveyQuestionSet?.length,
            enableConditionalPath: state.surveyForm?.surveyQuestionSet?.some(cpEnable => cpEnable.conditionalPathEnable === true) ? true : false,
            welcomeTitle: state.surveyForm.welcomeText,
            startButton: state.surveyForm.startButtonText,
            welcomeBannerId: state.surveyForm.imageFlag ? state.surveyForm?.surveyFileUploadSection?.id : null,
            welcomeBannerUrl: state.surveyForm.imageFlag ? state.surveyForm?.surveyFileUploadSection?.imageUrl : null,
            finalTitle: state.surveyForm.finalTitle,
            finalDescription: state.surveyForm.finalText,
            finalBannerId: state.surveyForm.addImageLastFlag ? state.surveyForm?.surveyLastFileUploadSection?.id : null,
            finalBannerUrl: state.surveyForm.addImageLastFlag ? state.surveyForm?.surveyLastFileUploadSection?.imageUrl : null,
            finalButton: state.surveyForm.finalButtonFlag ? {
                label: state.surveyForm.textButton,
                link: state.surveyForm.buttonLink
            } : null
        }).then((res) => {
            Mixpanel.track(
                "Survey Created",
                { "surveyId": res.data.data.id, "surveyName": state.surveyForm.surveyName }
            );
            setSnackbarMessageSuccess(true);
            setSnackbar(true);
            setSnackbarMessageValue(res.data.message);
            setTimeout(() => {
                goBackToSurveyManage()
            }, 3000);
            // toggleLoader(false);
        }).catch((error) => {
            toggleLoader(false);
            const modifiedPayload = Object.assign({}, state.surveyForm);
            modifiedPayload['questionArrayId'] = [];
            dispatch({
                type: 'MODIFY_SURVEY_PAYLOAD',
                payload: {
                    surveyPayload: modifiedPayload, currentPageName: 'registration',
                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, `${t('SURVEY_QUESTION_PROGRESS')}`, `${t('LAST_SURVEY_PAGE')}`]
                }
            })
            setSnackbarMessageSuccess(false);
            setSnackbar(false);
            setSnackbarMessageValue(helper.getErrorMessage(error));
        });
    }
    return (
        <Grid container spacing={3}>
            {snackbarMessageSuccess && (
                <SnackBarMessage open={snackbarMessageSuccess} onClose={() => setSnackbarMessageSuccess(false)}
                    severityType="success" message={snackbarMessageValue} />)}
            {snackbar && (
                <SnackBarMessage open={snackbar} onClose={() => setSnackbar(false)}
                    severityType={snackbarMessageSuccess ? 'success' : 'error'} message={snackbarMessageValue} />)}
            <Grid item md={8} xs={12}>
                <S.Container className="cc-form-wrapper">
                    <Formik
                        enableReinitialize={!regMatchLink.test(buttonLink) ? false : true}
                        initialValues={{
                            finalTitle: surveyFinalTitle,
                            finalText: surveyFinalText,
                            finalButtonFlag: surveyLastFinalButtonFlag,
                            textButton: textButton,
                            buttonLink: state.surveyForm.buttonLink,
                        }}
                        validationSchema={yup.object().shape({
                            finalTitle: yup.string().min(3, t('SURVEY_FINAL_TITLE_MIN_LENGTH_ERROR')).max(140, t('SURVEY_FINAL_TITLE_MAX_LENGTH_ERROR'))
                                .required(t('SURVEY_FINAL_TITLE_REQUIRED_ERROR'))
                                .matches(/^[^.\s]/, t('SURVEY_FINAL_TITLE_INVALID_ERROR')),
                            finalText: yup.string().min(3, t('SURVEY_FINAL_TEXT_MIN_LENGTH_ERROR')).max(140, t('SURVEY_FINAL_TEXT_MAX_LENGTH_ERROR'))
                                .required(t('SURVEY_FINAL_TEXT_REQUIRED_ERROR'))
                                .matches(/^[^.\s]/, t('SURVEY_FINAL_TEXT_INVALID_ERROR')),
                            finalButtonFlag: yup.boolean(),
                            textButton: yup.string().when('finalButtonFlag', {
                                is: true,
                                then: yup.string().required(t('SURVEY_BUTTON_TEXT_REQUIRED_ERROR')).matches(/^[^.\s]/, t('')).min(3, t('SURVEY_BUTTON_TEXT_LENGTH_MIN_ERROR')).max(40, t('SURVEY_BUTTON_TEXT_MAX_LENGTH_ERROR'))
                            }),
                            buttonLink: yup.string().when('finalButtonFlag', {
                                is: true,
                                then: yup.string().matches(regMatchLink, t('SURVEY_VALID_URL_ERROR'))
                                    .required(t('SURVEY_BUTTON_LINK_REQUIRED_ERROR'))
                                    .matches(/^[^.\s]/, t('SURVEY_BUTTON_LINK_INVALID_ERROR'))
                            }),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            const payload = {
                                finalTitle: surveyFinalTitle,
                                finalText: surveyFinalText,
                                finalButtonFlag: surveyLastFinalButtonFlag,
                                textButton: textButton,
                                buttonLink: buttonLink,
                            }
                            changePage(payload);
                            surveySubmit()
                        }}
                    >
                        {({
                            errors,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            isSubmitting,
                            touched,
                            values,
                            dirty,
                            isValid,
                            setFieldValue
                        }) => (
                            <form onSubmit={handleSubmit} className="cc-form-wrapper">
                                <div className="cc-form-wrapper">
                                    <div className="cr-top-main">
                                        <div className="cr-top-wrapper">
                                            <h5 className="title-padding">
                                                {t('INFORMATION_FOR_LAST_PAGE_SURVEY')}
                                            </h5>
                                            <hr></hr>
                                            <div className="cr-body-content">
                                                <form>
                                                    <div className="form-row">
                                                        <TextField
                                                            variant="outlined"
                                                            aria-describedby="final-title"
                                                            placeholder={t('ENTER_FINAL_TITLE_PLACEHOLDER')}
                                                            label={`${t('SURVEY_FINAL_TITLE_LABEL_TEXT')} *`}
                                                            name="finalTitle"
                                                            error={Boolean(touched.finalTitle && errors.finalTitle)}
                                                            helperText={touched.finalTitle && errors.finalTitle}
                                                            onBlur={handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={(e) => {
                                                                setSurveyFinalTitle(e.currentTarget.value)
                                                                handleChange(e);
                                                                const modifiedPayload = Object.assign({}, state.surveyForm)
                                                                modifiedPayload['finalTitle'] = e.currentTarget.value
                                                                dispatch({
                                                                    type: 'MODIFY_SURVEY_PAYLOAD',
                                                                    payload: {
                                                                        surveyPayload: modifiedPayload, currentPageName: 'surveylastpage',
                                                                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, `${t('SURVEY_QUESTION_PROGRESS')}`, `${t('LAST_SURVEY_PAGE')}`]
                                                                    }
                                                                })
                                                            }}
                                                            value={surveyFinalTitle}
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-row">
                                                        <TextField
                                                            variant="outlined"
                                                            aria-describedby="final-text"
                                                            placeholder={t('ENTER_FINAL_TEXT_PLACEHOLDER')}
                                                            label={`${t('SURVEY_FINAL_TEXT_LABEL')} *`}
                                                            name="finalText"
                                                            error={Boolean(touched.finalText && errors.finalText)}
                                                            helperText={touched.finalText && errors.finalText}
                                                            onBlur={handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={(e) => {
                                                                setSurveyFinalText(e.currentTarget.value)
                                                                handleChange(e);
                                                                const modifiedPayload = Object.assign({}, state.surveyForm)
                                                                modifiedPayload['finalText'] = e.currentTarget.value
                                                                dispatch({
                                                                    type: 'MODIFY_SURVEY_PAYLOAD',
                                                                    payload: {
                                                                        surveyPayload: modifiedPayload, currentPageName: 'surveylastpage',
                                                                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, `${t('SURVEY_QUESTION_PROGRESS')}`, `${t('LAST_SURVEY_PAGE')}`]
                                                                    }
                                                                })
                                                            }}
                                                            value={surveyFinalText}
                                                            type="text"
                                                        />
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="message-switch-box">
                                            <p>{t('ADD_IMAGE_BANNER_OFF')}</p>
                                            <div className="switch-inline">
                                                <Grid className="switch-label-wrap switch-2-options mb-20" component="label" container alignItems="center">
                                                    <Grid item className="switch-label"></Grid>
                                                    <Grid item className="no-padding">
                                                        <div className="switchery">
                                                            <FormControlLabel
                                                                control={<Switch
                                                                    checked={state.surveyForm?.addImageLastFlag}
                                                                    onChange={(e) => {
                                                                        handleChange(e);
                                                                        setSurveyLastAddImageFlag(e.target.checked)
                                                                        const modifiedPayload = Object.assign({}, state.surveyForm);
                                                                        modifiedPayload['addImageLastFlag'] = e.target.checked;
                                                                        // if (!e.target.checked) {
                                                                        //     modifiedPayload['surveyLastFileUploadSection'] = {};
                                                                        // }
                                                                        dispatch({
                                                                            type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                                            payload: {
                                                                                surveyPayload: modifiedPayload
                                                                            }
                                                                        })
                                                                    }}
                                                                    name="addImageLastFlag"
                                                                />}
                                                                label={''}
                                                            />
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                            <p>{t('SWITCH_ON')}</p>
                                        </div>

                                        {state.surveyForm?.addImageLastFlag && <div className="cr-top-wrapper">
                                            <h5 className="title-padding">{t('ADD_IMAGE_AT_LAST_PAGE')}</h5>
                                            <div>
                                                <div className="tabs-wrapper secondary">
                                                    <Tabs value={tabValueAppIcon} onChange={handleChangeTabAppIcon} aria-label="simple tabs example">
                                                        <Tab label={t('CREATIVE_TAB_DRAG_DROP')} {...a11yProps(0)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} />
                                                        {/* <Tab label={t('CREATIVE_TAB_URL')} {...a11yProps(1)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} /> */}
                                                        <Tab label={t('CREATIVE_TAB_CHOOSE_EXISTING')} {...a11yProps(1)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} />
                                                    </Tabs>
                                                </div>
                                                <TabPanel className="tab-content-box" value={tabValueAppIcon} index={0}>
                                                    <div className="drag-and-drop-wrapper">
                                                        <TextField type="file" variant="outlined" aria-describedby="desc-app-icon-url" className="custom-file-input"
                                                            onChange={(event) => setChosenFileName(event, 'SURVEY')} inputProps={{ accept: "image/*" }}
                                                        />
                                                        <span></span>
                                                        <div className="image-info-box">
                                                            <p>{fileNameNotification.length === 0 ? t('CREATIVE_FILE_DRAG_DROP_INSTRUCTION') : fileNameNotification}</p>
                                                            <p className="extension-text">jpg,.jpeg,.png</p>
                                                        </div>

                                                    </div>
                                                    <p className="error-wrap error">{fileUploadErrorNotification}</p>
                                                </TabPanel>
                                                <TabPanel className="tab-content-box" value={tabValueAppIcon} index={1}>
                                                    {isShowContentPopup && <WelcomeContentPopup handleOpen={handleOpenModal} imageContentType={'SURVEY'} contentType={'imagecontents'} section={'surveylastpage'} />}
                                                </TabPanel>
                                            </div>
                                        </div>
                                        }
                                        <div className="message-switch-box">
                                            <p>{t('FINAL_BUTTON_OFF')}</p>
                                            <div className="switch-inline">
                                                <Grid className="switch-label-wrap switch-2-options mb-20" component="label" container alignItems="center">
                                                    <Grid item className="switch-label"></Grid>
                                                    <Grid item className="no-padding">
                                                        <div className="switchery">
                                                            <FormControlLabel
                                                                control={<Switch
                                                                    checked={surveyLastFinalButtonFlag}
                                                                    onChange={(e) => {
                                                                        handleChange(e);
                                                                        setSurveyLastFinalButtonFlag(e.target.checked)
                                                                        const modifiedPayload = Object.assign({}, state.surveyForm);
                                                                        modifiedPayload['finalButtonFlag'] = e.target.checked;
                                                                        // if (!e.target.checked) {
                                                                        //     modifiedPayload['buttonLink'] = '';
                                                                        //     modifiedPayload['textButton'] = '';
                                                                        //     setSurveyButtonLink('');
                                                                        //     setSurveyTextButton('');
                                                                        // }
                                                                        dispatch({
                                                                            type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                                            payload: {
                                                                                surveyPayload: modifiedPayload
                                                                            }
                                                                        })
                                                                    }}
                                                                    name="finalButtonFlag"
                                                                />}
                                                                label={''}
                                                            />
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                            <p>{t('SWITCH_ON')}</p>
                                        </div>
                                        {state.surveyForm?.finalButtonFlag && <div className="cr-top-wrapper">
                                            <h5 className="title-padding">
                                                {t('CUSTOMIZE_FINAL_BUTTON')}
                                            </h5>
                                            <hr></hr>
                                            <div className="cr-body-content">
                                                <form>
                                                    <div className="row first-row">
                                                        <Grid item xs={12} lg={6} className="form-row">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('TEXT_BUTTON_PLACEHOLDER')}`}
                                                                placeholder={`${t('TEXT_BUTTON_PLACEHOLDER')}`}
                                                                label={`${t('SURVEY_TEXT_BUTTON_LABEL')} *`}
                                                                error={Boolean(touched.textButton && errors.textButton)}
                                                                helperText={touched.textButton && errors.textButton}
                                                                onBlur={handleBlur}
                                                                inputProps={{ maxLength: 40 }}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="textButton"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setSurveyTextButton(e.target.value)
                                                                    const modifiedPayload = Object.assign({}, state.surveyForm)
                                                                    modifiedPayload['textButton'] = e.target.value;
                                                                    dispatch({
                                                                        type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                                        payload: {
                                                                            surveyPayload: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                value={textButton}
                                                                type="text"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} lg={6} className="form-row">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('SURVEY_TEXT_BUTTON_PLACEHOLDER')}`}
                                                                placeholder={`${t('SURVEY_TEXT_BUTTON_PLACEHOLDER')}`}
                                                                label={`${t('SURVEY_TEXT_BUTTON_LINK_LABEL')} *`}
                                                                error={Boolean(touched.buttonLink && errors.buttonLink)}
                                                                helperText={touched.buttonLink && errors.buttonLink && (urlProtocolWarning.length > 0 && errors.buttonLink === 'Must be valid url' ? delete errors.buttonLink : errors.buttonLink)}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="buttonLink"
                                                                type="text"
                                                                onBlur={(e) => {
                                                                    handleBlur(e);
                                                                    let buttonLinkUrl = e.target.value;
                                                                    if (buttonLinkUrl.indexOf('https') === -1 && buttonLinkUrl.indexOf('http') === -1) {
                                                                        buttonLinkUrl = 'https://' + buttonLinkUrl;
                                                                        setUrlProtocolWarning('');
                                                                    } else if (buttonLinkUrl.length === 0) {
                                                                        setUrlProtocolWarning('')
                                                                    }
                                                                    setSurveyButtonLink(buttonLinkUrl);
                                                                    setUrlProtocolWarning('');
                                                                    const modifiedPayload = Object.assign({}, state.surveyForm)
                                                                    modifiedPayload['buttonLink'] = buttonLinkUrl
                                                                    dispatch({
                                                                        type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                                        payload: {
                                                                            surveyPayload: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    if (e.target.value.indexOf('https') === -1 && e.target.value.indexOf('http') === -1) {
                                                                        setUrlProtocolWarning(t('URL_PROTOCOL_WARNING'));
                                                                    }
                                                                    else if (e.target.value.indexOf('http') === 0 || e.target.value.indexOf('https') === 0) {
                                                                        setUrlProtocolWarning('')
                                                                    }
                                                                    if (e.target.value.length === 0) {
                                                                        setUrlProtocolWarning('')
                                                                    }
                                                                    if (urlProtocolWarning.length > 0) {
                                                                        delete errors.buttonLink
                                                                    }
                                                                    setSurveyButtonLink(e.target.value)
                                                                    const modifiedPayload = Object.assign({}, state.surveyForm)
                                                                    modifiedPayload['buttonLink'] = e.target.value
                                                                    dispatch({
                                                                        type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                                        payload: {
                                                                            surveyPayload: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                value={buttonLink}
                                                            />
                                                            <p className="information">{urlProtocolWarning}</p>
                                                        </Grid>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                                <div className="cc-global-buttons registration-btn">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        type="button"
                                        onClick={() => backToRegistrationPage()}
                                    >
                                        {t('BACK_BUTTON')}
                                    </Button>
                                    {!loader && <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={Object.keys(errors)?.length > 0 || (state.surveyForm.addImageLastFlag && Object.keys(state.surveyForm?.surveyLastFileUploadSection).length === 0)}
                                        startIcon={<ArrowForwardOutlinedIcon fontSize="small" />} >
                                        <span>{t('CONTINUE_BUTTON')}</span>
                                    </Button>}
                                    {loader && <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled
                                        startIcon={<ArrowForwardOutlinedIcon fontSize="small" />} >
                                        <span>{t('CONTINUE_BUTTON')}</span><Spinner color={"blue"} />
                                    </Button>}
                                </div>
                            </form>
                        )}
                    </Formik>
                </S.Container>
            </Grid>
            <Grid item md={4} xs={12}>
                <MobilePreview template={'SURVEY'}
                    format={'PUSH'}
                    objectiveType={'surveyAd'}
                    surveyData={{
                        description: state.surveyForm?.surveyDesc, organizationId: orgActiveId, status: 'ACTIVE',
                        termsAndConditions: state.surveyForm?.conditionFlag ? state.surveyForm?.surveyUrl : '', title: state.surveyForm?.surveyName,
                        welcomeTitle: state.surveyForm.welcomeText,
                        startButton: state.surveyForm.startButtonText,
                        welcomeBannerUrl: state.surveyForm?.imageFlag ? state.surveyForm?.surveyFileUploadSection?.imageUrl : '',
                        finalTitle: state.surveyForm.finalTitle,
                        finalDescription: state.surveyForm.finalText,
                        finalBannerUrl: state.surveyForm?.addImageLastFlag ? state.surveyForm?.surveyLastFileUploadSection?.imageUrl : '',
                        finalButton: {
                            link: state.surveyForm.finalButtonFlag ? state.surveyForm?.surveyLastFileUploadSection?.buttonLink : '',
                            label: state.surveyForm.finalButtonFlag ? state.surveyForm.textButton : ''
                        },
                        section: state.currentSurveySection
                    }}
                    questionDetails={[{
                        answerType: 'surveySubmitted'
                    }]}
                    campaignType={''}
                    message={{
                        title: '',
                        body: '',
                        text: '',
                        button: [],
                        icon: '',
                        banner: ''
                    }}
                />
            </Grid>
        </Grid >
    )
}
export default SurveyLastPage