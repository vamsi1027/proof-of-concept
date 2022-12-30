import React, { useState, useContext } from "react";
import * as S from "./SurveyAlternativePopup.styles";
import { apiDashboard, helper } from "@dr-one/utils";
import { Spinner } from "@dr-one/shared-component";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
    TextField,
    Button,
    Modal,
    makeStyles,
    Grid
} from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as yup from 'yup';
import { GlobalContext } from '../../../context/globalState';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';

function SurveyAlternativePopup(props) {
    const useStyles = makeStyles((theme) => ({
        paper: {

        },
        modal: {
            display: 'flex',
            padding: theme.spacing(1),
            alignItems: 'center',
            justifyContent: 'center',
        }
    }));
    const classes = useStyles();
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(true);
    const [label, setLabel] = useState(props.label);
    const [placeholder, setPlaceholder] = useState(props.placeholder);
    const { dispatch, state } = useContext(GlobalContext);

    const rand = () => {
        return Math.round(Math.random() * 20) - 10;
    }

    const getModalStyle = () => {
        const top = 50 + rand();
        const left = 50 + rand();

        return {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
        };
    }
    const [modalStyle] = React.useState(getModalStyle);

    const handleClose = (): void => {
        setOpen(false);
        onModeChange();
    };

    const onEditLabel = (values: any, option: string): void => {
        const modifiedPayload = Object.assign({}, state.surveyForm);
        if (option === 'other') {
            modifiedPayload['surveyQuestionSet'][props.questionIndex]['surveyAlternativeOther']['label'] = values.label;
            modifiedPayload['surveyQuestionSet'][props.questionIndex]['surveyAlternativeOther']['placeholder'] = values.placeholder;
        } else {
            modifiedPayload['surveyQuestionSet'][props.questionIndex]['surveyAlternativeNoneOfTheAbove']['label'] = values.label;
        }

        dispatch({
            type: 'MODIFY_SURVEY_PAYLOAD',
            payload: {
                surveyPayload: modifiedPayload, currentPageName: 'registration',
                surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
            }
        })
        handleClose();
    }

    const onModeChange = (): void => {
        const modifiedPayload = Object.assign({}, state.surveyForm);

        if (props.hintText === 'other') {
            modifiedPayload['surveyQuestionSet'][props.questionIndex]['surveyAlternativeOther']['mode'] = 'read';
            const surveyAlternativeOtherIndex = modifiedPayload['surveyQuestionSet'][props.questionIndex]['answerOptionsWithAlternative'].findIndex(answer => answer.key === 'other');
            if (surveyAlternativeOtherIndex > -1) {
                modifiedPayload['surveyQuestionSet'][props.questionIndex]['answerOptionsWithAlternative'][surveyAlternativeOtherIndex].mode = 'read';
            }
        } else {
            modifiedPayload['surveyQuestionSet'][props.questionIndex]['surveyAlternativeNoneOfTheAbove']['mode'] = 'read';
            const surveyAlternativeNoneOfTheAboveIndex = modifiedPayload['surveyQuestionSet'][props.questionIndex]['answerOptionsWithAlternative'].findIndex(answer => answer.key === 'noneOfTheAbove');
            if (surveyAlternativeNoneOfTheAboveIndex > -1) {
                modifiedPayload['surveyQuestionSet'][props.questionIndex]['answerOptionsWithAlternative'][surveyAlternativeNoneOfTheAboveIndex].mode = 'read';
            }
        }

        dispatch({
            type: 'MODIFY_SURVEY_PAYLOAD',
            payload: {
                surveyPayload: modifiedPayload, currentPageName: 'registration',
                surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, 'SURVEY_QUESTION_PROGRESS']
            }
        })
    }

    const body = (
        <S.Container>
            <div className="model-container pop-up-style">
                <div className="modal-header">
                    <h4 id="simple-modal-title">{props.hintText === 'other' ? t('SURVEY_ALTERNATIVE_OTHER_POPUP_HEADER') :
                        t('SURVEY_ALTERNATIVE_NONE_OF_THE_ABOVE_POPUP_HEADER')} </h4>
                    <CloseOutlinedIcon className='modal-close' aria-label="close" onClick={() => { handleClose(); }} />
                </div>
                <div className="modal-body">
                    <Formik
                        initialValues={{
                            label: label,
                            placeholder: placeholder
                        }}
                        validationSchema={yup.object().shape({
                            label: yup.string()
                                .required(t('SURVEY_ALTERNATIVE_LABEL_REQUIRED_ERROR'))
                                .max(50, t('SURVEY_ANSWER_OPTION_LENGTH_ERROR'))
                                .matches(
                                    /^[^\s]+(\s+[^\s]+)*$/,
                                    t('SURVEY_ALTERNATIVE_LABEL_INVALID_ERROR')
                                ),
                            placeholder: props.hintText === 'other' ? yup.string()
                                .max(140, t('Character length should not be greater than 140'))
                                .matches(
                                    /^[^\s]+(\s+[^\s]+)*$/,
                                    t('SURVEY_ALTERNATIVE_PLACEHOLDER_INVALID_ERROR')
                                ) : yup.string()
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            onEditLabel(values, props.hintText);
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
                                <Grid container>
                                    <div className="row">
                                        <Grid item xs={12} sm={12} className="form-row">
                                            <TextField
                                                variant="outlined"
                                                aria-describedby="Label"
                                                placeholder={t('SURVEY_ALTERNATIVE_LABEL_PLACEHOLDER')}
                                                label={`${t('SURVEY_ALTERNATIVE_LABEL_TITLE')} *`}
                                                InputLabelProps={{ shrink: true }}
                                                error={Boolean(touched.label && errors.label)}
                                                helperText={touched.label && errors.label}
                                                onBlur={(e) => {
                                                    handleBlur(e);
                                                }}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setLabel(e.target.value);
                                                }}
                                                value={label}
                                                name="label"
                                                type="text"
                                            />
                                        </Grid>
                                        {props.hintText === 'other' &&
                                            <Grid item xs={12} sm={12} className="form-row">
                                                <TextField
                                                    variant="outlined"
                                                    aria-describedby="Placeholder"
                                                    placeholder={t('SURVEY_ALTERNATIVE_PLACEHOLDER_LABEL')}
                                                    label={`${t('SURVEY_ALTERNATIVE_PLACEHOLDER_TITLE')}`}
                                                    InputLabelProps={{ shrink: true }}
                                                    error={Boolean(touched.placeholder && errors.placeholder)}
                                                    helperText={touched.placeholder && errors.placeholder}
                                                    onBlur={(e) => {
                                                        handleBlur(e);
                                                    }}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setPlaceholder(e.target.value)
                                                    }}
                                                    value={placeholder}
                                                    name="placeholder"
                                                    type="text"
                                                />
                                            </Grid>
                                        }
                                    </div>
                                </Grid>

                                <div className="modal-footer">
                                    <Button variant="outlined" className="button-xs" color="primary" type="button" onClick={(e) => handleClose()}> {t('CANCEL_BUTTON')} </Button>
                                    <Button className="button-xs" variant="contained" color="primary" type="submit" disabled={!isValid} startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                                    >{t('CONTINUE_BUTTON')}</Button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </S.Container>
    );

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                disableEscapeKeyDown
                className={classes.modal}
                disableBackdropClick
            >
                {body}
            </Modal>
        </div>
    );
}

export default SurveyAlternativePopup;