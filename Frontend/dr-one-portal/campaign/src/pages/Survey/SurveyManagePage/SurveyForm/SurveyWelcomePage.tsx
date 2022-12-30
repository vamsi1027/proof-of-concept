import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, TextField, Button, FormControlLabel, Switch, Tabs, Tab, Typography, Box } from '@material-ui/core'
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import * as S from "./SurveyCreation.style";
import * as yup from 'yup';
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { GlobalContext } from '../../../../context/globalState';
import { useHistory } from "react-router-dom";
import { Formik } from 'formik';
import { SnackBarMessage, MobilePreview } from "@dr-one/shared-component";
import WelcomeContentPopup from "../../../../components/Common/WelcomeContentPopup/WelcomeContentPopup";

function SurveyWelcomePage() {
    const { t } = useTranslation();
    const { dispatch, state } = useContext(GlobalContext);
    const [surveyWelcomeText, setSurveyWelcomeText] = React.useState(state?.surveyForm.welcomeText)
    const [surveyStartButton, setSurveyStartButton] = React.useState(state?.surveyForm.startButtonText)
    const [surveyUrl, setSurveyUrl] = React.useState(state?.surveyForm.surveyUrl)
    const [termFlag, setTermFlag] = React.useState(state?.surveyForm.conditionFlag);
    const [imageCondtionalFlag, setImageCondtionalFlag] = React.useState(state?.surveyForm.imageFlag);
    const [tabValueAppIcon, setTabValueAppIcon] = React.useState(0);
    const [fileNameNotification, setFileNameNotification] = React.useState('');
    const [fileUploadErrorNotification, setFileUploadErrorNotification] = React.useState('');
    const [isShowContentPopup, toggleContentPopup] = React.useState(false);
    const [fileNameRichNotification, setFileNameRichNotification] = React.useState('');
    const [fileUploadErrorRichNotification, setFileUploadErrorRichNotification] = React.useState('');
    const [tabValueBanner, setTabValueBanner] = React.useState(0);
    const [snackbarMessageSuccess, setSnackbarMessageSuccess] = React.useState(false);
    const [snackbarMessageValue, setSnackbarMessageValue] = React.useState('');
    let history = useHistory();
    const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;

    const handleActiveStepper = (payload): void => {
        dispatch({
            type: "ACTIVE_STEPPER",
            payload,
            surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
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
            modifiedPayload['surveyFileUploadSection'] = {};
        } else {
            if (file.size <= maxAllowedImageSize) {
                if (fileName.trim().length > 2) {
                    apiDashboard.get('campaign-mgmt-api/imagecontents/name?name=' + fileName.trim() + '&imageContentType=' + imageType).then(res => {
                        if (res.data.message === 'false') {
                            imageType === 'SURVEY' ? setFileUploadErrorNotification('') : setFileUploadErrorRichNotification('');
                            fileUpload(file, fileName, imageType);
                        }
                        else {
                            modifiedPayload['surveyFileUploadSection'] = {};
                            dispatch({
                                type: 'MODIFY_SURVEY_PAYLOAD',
                                payload: {
                                    surveyPayload: modifiedPayload, currentPageName: 'surveywelcomepage',
                                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
                                }
                            })
                            imageType === 'SURVEY' ? setFileUploadErrorNotification(t('CREATIVE_IMAGE_DUPLICATE_NAME_ERROR'))
                                : setFileUploadErrorRichNotification(t('CREATIVE_IMAGE_DUPLICATE_NAME_ERROR'));
                        }
                    }, error => {
                        imageType === 'SURVEY' ? setFileUploadErrorNotification(helper.getErrorMessage(error)) :
                            setFileUploadErrorRichNotification(helper.getErrorMessage(error));
                        modifiedPayload['surveyFileUploadSection'] = {};
                        dispatch({
                            type: 'MODIFY_SURVEY_PAYLOAD',
                            payload: {
                                surveyPayload: modifiedPayload, currentPageName: 'surveywelcomepage',
                                surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
                            }
                        })
                    });
                }
                else {
                    imageType === 'SURVEY' ? setFileUploadErrorNotification(t('CREATIVE_IMAGE_FILE_NAME_MIN_LENGTH_ERROR')) :
                        setFileUploadErrorRichNotification(t('CREATIVE_IMAGE_FILE_NAME_MIN_LENGTH_ERROR'));
                    modifiedPayload['surveyFileUploadSection'] = {};
                    dispatch({
                        type: 'MODIFY_SURVEY_PAYLOAD',
                        payload: {
                            surveyPayload: modifiedPayload, currentPageName: 'surveywelcomepage',
                            surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
                        }
                    })
                }
            }
            else {
                imageType === 'SURVEY' ? setFileUploadErrorNotification(`${t('CREATIVE_IMAGE_FILE_SIZE_MAX_ERROR')} ${maxAllowedImageSize / 1000} kb for ${imageType}`)
                    : setFileUploadErrorRichNotification(`${t('CREATIVE_IMAGE_FILE_SIZE_MAX_ERROR')} ${maxAllowedImageSize / 1000} kb for ${imageType}`)
                modifiedPayload['surveyFileUploadSection'] = {};
                dispatch({
                    type: 'MODIFY_SURVEY_PAYLOAD',
                    payload: {
                        surveyPayload: modifiedPayload, currentPageName: 'surveywelcomepage',
                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
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
                modifiedPayload['surveyFileUploadSection'] = res.data.data;
                setSnackbarMessageSuccess(true);
                setSnackbarMessageValue(res.data.message);
                dispatch({
                    type: 'MODIFY_SURVEY_PAYLOAD',
                    payload: {
                        surveyPayload: modifiedPayload, currentPageName: 'surveywelcomepage',
                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
                    }
                })
            }, error => {
                contentType === 'SURVEY' ? setFileUploadErrorNotification(helper.getErrorMessage(error)) :
                    setFileUploadErrorRichNotification(helper.getErrorMessage(error));
                modifiedPayload['surveyFileUploadSection'] = {};
                dispatch({
                    type: 'MODIFY_SURVEY_PAYLOAD',
                    payload: {
                        surveyPayload: modifiedPayload, currentPageName: 'surveywelcomepage',
                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
                    }
                })
            });
        }, error => {
            contentType === 'SURVEY' ? setFileUploadErrorNotification(helper.getErrorMessage(error)) :
                setFileUploadErrorRichNotification(helper.getErrorMessage(error));
            modifiedPayload['surveyFileUploadSection'] = {};
            dispatch({
                type: 'MODIFY_SURVEY_PAYLOAD',
                payload: {
                    surveyPayload: modifiedPayload, currentPageName: 'surveywelcomepage',
                    surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
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
                currentPageName: 'registration',
            },
        });
        handleActiveStepper(1)
        dispatch({
            type: "ACTIVE_STEPPER",
            surveyBreadCrumbList: ['SURVEY', 'REGISTRATION']
        });
        Mixpanel.track("Create Survey Page View", { "page": "Registration" });
    }
    const changePage = (payload): void => {
        dispatch({
            type: "CHANGE_PAGE",
            payload: {
                currentPageName: 'question',
                payload
            },

        });
        handleActiveStepper(2);
        Mixpanel.track("Create Survey Page View", { "page": "Question" });
    }

    return (
        <Grid container spacing={3}>
            {snackbarMessageSuccess && (
                <SnackBarMessage open={snackbarMessageSuccess} onClose={() => setSnackbarMessageSuccess(false)}
                    severityType="success" message={snackbarMessageValue} />)}
            <Grid item md={8} xs={12}>
                <S.Container className="cc-form-wrapper">
                    <Formik
                        initialValues={{
                            welcomeText: surveyWelcomeText,
                            surveyURL: surveyUrl,
                            surveyStartButton: surveyStartButton,
                            conditionFlag: termFlag
                        }}
                        validationSchema={yup.object().shape({
                            welcomeText: yup.string().min(3, t('SURVEY_WELCOME_TEXT_MIN_LENGTH_ERROR')).max(140, t('SURVEY_WELCOME_TEXT_MAX_LENGTH_ERROR'))
                                .required(t('SURVEY_WELCOME_TEXT_REQUIRED_ERROR'))
                                .matches(/^[^.\s]/, t('SURVEY_WELCOME_TEXT_INVALID_ERROR')),
                            conditionFlag: yup.boolean(),
                            surveyURL: yup.string().when('conditionFlag', {
                                is: true,
                                then: yup.string().matches(/^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/, t('SURVEY_VALID_URL_ERROR'))
                                    .required(t('SURVEY_SURVEY_URL_REQUIRED_ERROR'))
                                    .matches(/^[^.\s]/, t('SURVEY_SURVEY_URL_INVALID_ERROR'))
                            }),
                            surveyStartButton: yup.string().min(3, t('SURVEY_START_BUTTON_LENGTH_ERROR')).max(40, t('SURVEY_START_BUTTON_MAX_LENGTH_ERROR'))
                                .required(t('SURVEY_START_BUTTON_REQUIRED_ERROR'))
                                .matches(/^[^.\s]/, t('SURVEY_START_BUTTON_INVALID_ERROR')),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            const payload = {
                                welcomeText: surveyWelcomeText,
                                surveyURL: surveyUrl,
                                surveyStartButton: surveyStartButton,
                                conditionFlag: termFlag
                            }
                            changePage(payload);
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
                                                {t('INFORMATION_FOR_WELCOME_SURVEY')}
                                            </h5>
                                            <hr></hr>
                                            <div className="cr-body-content">
                                                <form>
                                                    <div className="form-row">
                                                        <TextField
                                                            variant="outlined"
                                                            aria-describedby="welcome-text"
                                                            placeholder={t('ENTER_WELCOME_TEXT')}
                                                            label={`${t('SURVEY_WELCOME_LABEL_TEXT')} *`}
                                                            name="welcomeText"
                                                            error={Boolean(touched.welcomeText && errors.welcomeText)}
                                                            helperText={touched.welcomeText && errors.welcomeText}
                                                            onBlur={handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={(e) => {
                                                                setSurveyWelcomeText(e.currentTarget.value)
                                                                handleChange(e);
                                                                const modifiedPayload = Object.assign({}, state.surveyForm)
                                                                modifiedPayload['welcomeText'] = e.currentTarget.value
                                                                dispatch({
                                                                    type: 'MODIFY_SURVEY_PAYLOAD',
                                                                    payload: {
                                                                        surveyPayload: modifiedPayload, currentPageName: 'surveywelcomepage',
                                                                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
                                                                    }
                                                                })
                                                            }}
                                                            value={surveyWelcomeText}
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-row">
                                                        <TextField
                                                            variant="outlined"
                                                            aria-describedby="start-button-text"
                                                            placeholder={t('ENTER_START_BUTTON_TEXT')}
                                                            label={`${t('START_BUTTON')} *`}
                                                            name="surveyStartButton"
                                                            inputProps={{ maxLength: 40 }}
                                                            error={Boolean(touched.surveyStartButton && errors.surveyStartButton)}
                                                            helperText={touched.surveyStartButton && errors.surveyStartButton}
                                                            onBlur={handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={(e) => {
                                                                setSurveyStartButton(e.currentTarget.value)
                                                                handleChange(e);
                                                                const modifiedPayload = Object.assign({}, state.surveyForm)
                                                                modifiedPayload['startButtonText'] = e.currentTarget.value
                                                                dispatch({
                                                                    type: 'MODIFY_SURVEY_PAYLOAD',
                                                                    payload: {
                                                                        surveyPayload: modifiedPayload, currentPageName: 'surveywelcomepage',
                                                                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
                                                                    }
                                                                })
                                                            }}
                                                            value={surveyStartButton}
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
                                                                    checked={state.surveyForm?.imageFlag}
                                                                    onChange={(e) => {
                                                                        handleChange(e);
                                                                        setImageCondtionalFlag(e.target.checked)
                                                                        const modifiedPayload = Object.assign({}, state.surveyForm);
                                                                        modifiedPayload['imageFlag'] = e.target.checked;
                                                                        // if (!e.target.checked) {
                                                                        //     modifiedPayload['surveyFileUploadSection'] = {};
                                                                        // }
                                                                        dispatch({
                                                                            type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                                            payload: {
                                                                                surveyPayload: modifiedPayload
                                                                            }
                                                                        })
                                                                    }}
                                                                    name="imageFlag"
                                                                // disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                                                />}
                                                                label={''}
                                                            />
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                            <p>{t('SWITCH_ON')}</p>
                                        </div>

                                        {state.surveyForm?.imageFlag && <div className="cr-top-wrapper">
                                            <h5 className="title-padding">{t('ADD_IMAGE_AT_FIRST_PAGE')}</h5>
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
                                                            // disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
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
                                                    {isShowContentPopup && <WelcomeContentPopup handleOpen={handleOpenModal} imageContentType={'SURVEY'} contentType={'imagecontents'} section={'surveywelcomepage'} />}
                                                </TabPanel>
                                            </div>
                                        </div>
                                        }
                                        <div className="message-switch-box">
                                            <p>{t('TERM_AND_CONDI_OFF')}</p>
                                            <div className="switch-inline">
                                                <Grid className="switch-label-wrap switch-2-options mb-20" component="label" container alignItems="center">
                                                    <Grid item className="switch-label"></Grid>
                                                    <Grid item className="no-padding">
                                                        <div className="switchery">
                                                            <FormControlLabel
                                                                control={<Switch
                                                                    checked={state.surveyForm?.conditionFlag}
                                                                    onChange={(e) => {
                                                                        handleChange(e);
                                                                        const modifiedPayload = Object.assign({}, state.surveyForm);
                                                                        modifiedPayload['conditionFlag'] = e.target.checked;
                                                                        dispatch({
                                                                            type: "MODIFY_SURVEY_STATE_PAYLOAD",
                                                                            payload: {
                                                                                surveyPayload: modifiedPayload
                                                                            }
                                                                        })
                                                                    }}
                                                                    name="conditionFlag"
                                                                />}
                                                                label={''}
                                                            />
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                            <p>{t('SWITCH_ON')}</p>
                                        </div>
                                        {state.surveyForm?.conditionFlag && <div className="cr-top-wrapper">
                                            <h5 className="title-padding">
                                                {t('SURVEY_TAD_LABEL')}
                                            </h5>
                                            <hr></hr>
                                            <div className="cr-body-content">
                                                <form>
                                                    <div className="form-row">
                                                        <TextField
                                                            variant="outlined"
                                                            aria-describedby="survey-tc"
                                                            placeholder={t('ENTER_TAD_NAME')}
                                                            label={`${t('SURVEY_TAD_LABEL')}`}
                                                            name="surveyURL"
                                                            error={Boolean(touched.surveyURL && errors.surveyURL)}
                                                            helperText={touched.surveyURL && errors.surveyURL}
                                                            onBlur={handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={(e) => {
                                                                setSurveyUrl(e.currentTarget.value);
                                                                handleChange(e);
                                                                const modifiedPayload = Object.assign({}, state.surveyForm)
                                                                modifiedPayload['surveyUrl'] = e.currentTarget.value
                                                                dispatch({
                                                                    type: 'MODIFY_SURVEY_PAYLOAD',
                                                                    payload: {
                                                                        surveyPayload: modifiedPayload, currentPageName: 'surveywelcomepage',
                                                                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
                                                                    }
                                                                })
                                                            }}
                                                            value={surveyUrl}
                                                            type="text"
                                                        />
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
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={!isValid || isSubmitting || (state.surveyForm.imageFlag && Object.keys(state.surveyForm?.surveyFileUploadSection).length === 0)}
                                        startIcon={<ArrowForwardOutlinedIcon fontSize="small" />} >
                                        <span>{t('CONTINUE_BUTTON')}</span>
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </S.Container>
            </Grid >
            <Grid item md={4} xs={12}>
                <MobilePreview template={'SURVEY'}
                    format={'PUSH'}
                    objectiveType={'surveyAd'}
                    surveyData={{
                        description: state.surveyForm?.surveyDesc, organizationId: organizationId, status: 'ACTIVE',
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
                        answerType: 'surveyWelcome'
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
        </Grid>
    )
}
export default SurveyWelcomePage