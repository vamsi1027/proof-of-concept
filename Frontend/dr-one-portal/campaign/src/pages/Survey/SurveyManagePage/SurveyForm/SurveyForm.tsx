import React, { useCallback, useContext, useEffect } from 'react'
import { createTheme, MuiThemeProvider } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { Grid, TextField, Button } from '@material-ui/core'
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import * as S from "./SurveyCreation.style";
import * as yup from 'yup';
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { GlobalContext } from '../../../../context/globalState';
import { useHistory, useParams } from "react-router-dom";
import { Formik } from 'formik';
function SurveyForm() {
    const { t } = useTranslation();
    const param = useParams();
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

    const [surveyName, setSurveyName] = React.useState(state?.surveyForm.surveyName)
    const [surveyDesc, setSurveyDesc] = React.useState(state?.surveyForm.surveyDesc)
    const [nameSearchFlag, setNameSearchFlag] = React.useState(false)
    const [checkSurveyName, setCheckSurveyName] = React.useState('')
    let history = useHistory();

    const handleActiveStepper = (payload): void => {
        dispatch({
            type: "ACTIVE_STEPPER",
            payload,
            surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
        });
    };

    useEffect(() => {
        if (state.surveyForm.surveyName.length !== 0 && !param?.id) {
            sessionStorage.setItem('enablePrompt', 'true');
        }
    }, [state.surveyForm]);

    const goBackToSurveyManage = (): void => {
        sessionStorage.setItem('enablePrompt', 'false');
        setTimeout(() => {
            history.push('/survey/manage');
        }, 500);
    }

    const handleChangeSurveyName = (SurveyName: string): void => {
        setSurveyName(SurveyName);
        if (SurveyName.length >= 3) {
            setNameSearchFlag(true);
            // handleActiveStepper(1);
            apiDashboard
                .get(
                    "campaign-mgmt-api/survey/name?name=" +
                    encodeURIComponent(SurveyName)
                )
                .then(
                    (response) => {
                        setNameSearchFlag(false);
                        if (response.data.message === "false") {
                            setCheckSurveyName("");
                        } else {
                            setCheckSurveyName(t('NAME_ALREADY_USED_FOR_SURVEY'));
                            // handleActiveStepper(0);
                        }
                    },
                    (error) => {
                        setNameSearchFlag(false);
                        setCheckSurveyName(t('ERROR_MESSAGE'));
                    }
                );
        } else {
            // handleActiveStepper(0);
        }
    };

    const debounceOnChange = useCallback(
        helper.debounce(handleChangeSurveyName, 600),
        []
    );

    const changePage = (payload): void => {
        dispatch({
            type: "CHANGE_PAGE",
            payload: {
                currentPageName: 'surveywelcomepage',
                payload
            },

        });
        handleActiveStepper(1);
        Mixpanel.track("Create Survey Page View", { "page": "Welcome Page" });
    }

    useEffect(() => {
        Mixpanel.track("Create Survey Page View", { "page": "Registration" });
    }, []);

    return (
        <Grid container spacing={3}>
            <Grid item md={8} xs={12}>
                <S.Container className="cc-form-wrapper">
                    <Formik
                        initialValues={{
                            name: surveyName,
                            description: surveyDesc,
                        }}
                        validationSchema={yup.object().shape({
                            name: yup.string().min(3, t('SURVEY_NAME_MIN_LENGTH_ERROR')).max(140, t('SURVEY_NAME_MAX_LENGTH_ERROR'))
                                .required(t('SURVEY_NAME_REQUIRED_ERROR'))
                                .matches(/^[^.\s]/, t('SURVEY_NAME_INVALID_ERROR')),
                            description: yup.string().required(t('SURVEY_DESC_REQUIRED_FIELD')).max(250, t('MAX_ALLOWED_DESC')),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            const payload = {
                                name: surveyName,
                                description: surveyDesc,
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
                                {param.id === undefined && sessionStorage.setItem('enablePrompt', dirty.toString())}
                                <div className="cc-form-wrapper">
                                    <div className="cr-top-main">
                                        <div className="cr-top-wrapper">
                                            <h5 className="title-padding">
                                                {t('INFORMATION_FOR_REGISTER_SURVEY')}
                                            </h5>
                                            <hr></hr>
                                            <div className="cr-body-content">
                                                <form>
                                                    <div className="form-row">
                                                        <TextField
                                                            variant="outlined"
                                                            aria-describedby="survey-name"
                                                            placeholder={t('ENTER_SURVEY_NAME')}
                                                            label={`${t('SURVEY_LABEL_NAME')} *`}
                                                            name="name"
                                                            error={Boolean(touched.name && errors.name)}
                                                            helperText={touched.name && errors.name}
                                                            onBlur={handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={(e) => {
                                                                setSurveyName(e.currentTarget.value)
                                                                debounceOnChange(e.currentTarget.value);
                                                                handleChange(e);
                                                                const modifiedPayload = Object.assign({}, state.surveyForm)
                                                                modifiedPayload['surveyName'] = e.currentTarget.value
                                                                dispatch({
                                                                    type: 'MODIFY_SURVEY_PAYLOAD',
                                                                    payload: {
                                                                        surveyPayload: modifiedPayload, currentPageName: 'registration',
                                                                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION']
                                                                    }
                                                                })
                                                            }}
                                                            value={surveyName}
                                                            type="text"
                                                        />
                                                        {nameSearchFlag && <p>{`${t('SEARCH_SURVEY_NAME')}`}</p>}
                                                        <p className="error">{checkSurveyName}</p>
                                                    </div>
                                                    <div className="form-row">
                                                        <MuiThemeProvider theme={theme}>
                                                            <TextField
                                                                id="outlined-multiline-static"
                                                                variant="outlined"
                                                                aria-describedby="survey-desc"
                                                                placeholder={t('SURVEY_DESCRIPTION_PLACEHOLDER')}
                                                                label={`${t('SURVEY_DESCRIPTION_NAME')} *`}
                                                                name="description"
                                                                error={Boolean(touched.description && errors.description)}
                                                                helperText={touched.description && errors.description}
                                                                onBlur={handleBlur}
                                                                InputLabelProps={{ shrink: true }}
                                                                onChange={(e) => {
                                                                    setSurveyDesc(e.currentTarget.value);
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.surveyForm)
                                                                    modifiedPayload['surveyDesc'] = e.currentTarget.value
                                                                    dispatch({
                                                                        type: 'MODIFY_SURVEY_PAYLOAD',
                                                                        payload: {
                                                                            surveyPayload: modifiedPayload, currentPageName: 'registration',
                                                                            surveyBreadCrumbList: ['SURVEY', 'REGISTRATION']
                                                                        }
                                                                    })
                                                                }}
                                                                value={surveyDesc}
                                                                multiline
                                                                rows={6}
                                                            />
                                                        </MuiThemeProvider>
                                                        {/* <p style={{ color: "red" }}>{audienceNameCheckError}</p> */}
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="cc-global-buttons registration-btn">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        type="button"
                                        onClick={() => goBackToSurveyManage()}
                                    >
                                        {t('CANCEL_BUTTON')}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={!isValid || isSubmitting || nameSearchFlag || checkSurveyName?.length !== 0}
                                        startIcon={<ArrowForwardOutlinedIcon fontSize="small" />} >
                                        <span>{t('CONTINUE_BUTTON')}</span>
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </S.Container>
            </Grid >
        </Grid >
    )
}
export default SurveyForm