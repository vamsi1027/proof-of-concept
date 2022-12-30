import React, { useContext, useState, useEffect } from 'react'
import { Grid, TextField, Switch, Card, FormControlLabel, FormControl } from "@material-ui/core"
import * as yup from 'yup';
import { Formik, Field } from 'formik';
import { GlobalContext } from '../../../context/globalState';
import { useTranslation } from 'react-i18next';
import { LightTooltip } from "@dr-one/shared-component";
function Survey() {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(GlobalContext);
    const { enableSurvey, numberOfQuestion } = state.orgSetting.survey
    const [enable, setEnable] = useState(enableSurvey)
    const [numberOfQues, setNumberOfQues] = useState(numberOfQuestion)
    const validSurveySectionComponent = (): boolean => {
        let numberOfQuestionRgx = /\b(0?[1-9]|1[0])\b/g
        let valid = true
        if (numberOfQuestionRgx.test(numberOfQuestion)) {
            valid = false
        } else if (!enableSurvey) {
            valid = enableSurvey
        }
        else {
            valid = enableSurvey
        }
        return valid
    }
    useEffect(() => {
        setNumberOfQues(numberOfQuestion)
        setEnable(enableSurvey)
        const modifiedPayload = Object.assign({}, state.orgSetting)
        modifiedPayload['survey']['isValidSurvey'] = validSurveySectionComponent()
        dispatch({
            type: "UPDATE_ORGANIZATION_PAYLOAD",
            payload: {
                orgSetting: modifiedPayload
            }
        })
    }, [validSurveySectionComponent()])
    return (
        <Grid container>
            <div className="row">
                <Grid item md={12} xs={12}>
                    <div className="cc-form-wrapper">
                        <div className="cr-top-main">
                            <div className="cr-top-wrapper">
                                <h5 className="title-padding">
                                    {t('ORG_SECTION_SURVEY')}
                                </h5>
                                <hr></hr>
                                <div className="cr-body-content">
                                    <Formik
                                        initialValues={{
                                            numberOfQuestion: numberOfQues
                                        }}
                                        validationSchema={yup.object().shape({
                                            numberOfQuestion: (enableSurvey && typeof numberOfQuestion === 'string') && yup.number().required(`${t('NO_OF_QUESTION_REQUIRED')}`).min(1, `${t('NO_OF_QUES_SHOULD_BE_ONE')}`).max(10, `${t('NO_OF_QUES_CANNOT_EXCEED')}`)
                                        })}
                                        enableReinitialize
                                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => { }}
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
                                            <Grid container>
                                                <div className="row last-row">
                                                    <Grid item xs={6} lg={6} className="form-row">
                                                        <FormControl>
                                                            <label className="MuiFormLabel-root" style={{ fontSize: 12 }}>
                                                                <div className="label-tooltip small-tooltip">{`${t('ENABLE_SURVEY')}`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_ENABLE_SURVEY')}</label>}
                                                                    /></div>
                                                            </label>
                                                            <div className="switchery org-switchery">
                                                                <FormControlLabel
                                                                    value={enableSurvey}
                                                                    control={<Field
                                                                        label={`${t('ENABLE')}`}
                                                                        name="enable"
                                                                        component={Switch}
                                                                        onChange={(e) => {
                                                                            handleChange(e);
                                                                            setEnable(!enable)
                                                                            const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                            modifiedPayload['survey']['enableSurvey'] = e.target.checked;
                                                                            // modifiedPayload['survey']['isValidSurvey'] = typeof numberOfQuestion === 'string' && !enable
                                                                            dispatch({
                                                                                type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                                payload: {
                                                                                    orgSetting: modifiedPayload
                                                                                }
                                                                            })

                                                                        }}
                                                                        checked={enableSurvey}
                                                                    />}
                                                                    label={`${t('ENABLE')}`}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={6} lg={6} className="form-row label-width-185">
                                                        <TextField
                                                            variant="outlined"
                                                            aria-describedby={`${t('NUMBER_OF_QUES')}`}
                                                            placeholder={`${t('NUMBER_OF_QUES')}`}
                                                            label={<div className="label-tooltip">{`${t('NUMBER_OF_QUES')} ${enableSurvey ? '*' : ''}`}
                                                                <LightTooltip title={<label>{t('TOOLTIP_NO_OF_QUESTIONS')}</label>}
                                                                /></div>}
                                                            InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                            name="numberOfQuestion"
                                                            disabled={!enableSurvey}
                                                            value={numberOfQuestion}
                                                            InputProps={{ inputProps: { min: 1, max: 10 } }}
                                                            error={enableSurvey && Boolean(touched.numberOfQuestion && errors.numberOfQuestion)}
                                                            helperText={enableSurvey && touched.numberOfQuestion && errors.numberOfQuestion}
                                                            onBlur={enableSurvey && handleBlur}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                setNumberOfQues(e.target.value);
                                                                const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                modifiedPayload['survey']['numberOfQuestion'] = parseInt(e.target.value);
                                                                dispatch({
                                                                    type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                    payload: {
                                                                        orgSetting: modifiedPayload
                                                                    }
                                                                })
                                                            }}
                                                            type="number" />
                                                        {!enableSurvey && <p className="optional-msg">{`${t('OPTIONAL')}`}</p>}
                                                    </Grid>

                                                </div>
                                            </Grid>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Card variant="outlined">

                    </Card>
                </Grid>

            </div>
        </Grid >
    )
}
export default Survey