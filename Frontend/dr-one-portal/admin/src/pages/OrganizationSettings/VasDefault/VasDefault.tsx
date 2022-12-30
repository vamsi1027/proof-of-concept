import React, { useContext, useState, useEffect } from 'react'
import * as S from './VasDefault.styles'
import { Grid, TextField, Card } from "@material-ui/core"
import * as yup from 'yup';
import { Formik } from 'formik';
import { GlobalContext } from '../../../context/globalState';
import { useTranslation } from 'react-i18next';
import HelpIcon from '@material-ui/icons/Help';
import { LightTooltip } from "@dr-one/shared-component";
function VasDefault() {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(GlobalContext);
    const { preSubscriptionTitle,
        preSubscriptionText,
        preSubscriptionActionText,
        preSubscriptionPositiveText,
        preSubscriptionNegativeText,
        processingText,
        defaultActionText,
        defaultFailureText } = state.orgSetting.vasDefault

    const [preSubTitle, setPreSubTitle] = useState(preSubscriptionTitle)
    const [preSubText, setPreSubText] = useState(preSubscriptionText)
    const [preSubActionText, setPreSubActionText] = useState(preSubscriptionActionText)
    const [preSubPosText, setPreSubPosText] = useState(preSubscriptionPositiveText)
    const [preSubNegText, setPreSubNegText] = useState(preSubscriptionNegativeText)
    const [processText, setProcessText] = useState(processingText)
    const [defaultAcText, setDefaultAcText] = useState(defaultActionText)
    const [defaultFailText, setDefaultFailText] = useState(defaultFailureText)
    const validVasSectionComponent = (): boolean => {
        let preTextRgx = /^[^\s]+(\s+[^\s]+)*$/
        let valid = true
        if ((preSubscriptionTitle.length <= 30)
            && (preSubscriptionText.length > 0 && preSubscriptionText.length <= 40 && preTextRgx.test(preSubscriptionText))
            && (preSubscriptionActionText.length > 0 && preSubscriptionActionText.length <= 25 && preTextRgx.test(preSubscriptionActionText))
            && (preSubscriptionPositiveText.length > 0 && preSubscriptionPositiveText.length <= 25 && preTextRgx.test(preSubscriptionPositiveText))
            && (preSubscriptionNegativeText.length > 0 && preSubscriptionNegativeText.length <= 25 && preTextRgx.test(preSubscriptionNegativeText))
            && (processingText.length > 0 && processingText.length <= 30 && preTextRgx.test(processingText))
            && (defaultActionText.length > 0 && defaultActionText.length <= 25 && preTextRgx.test(defaultActionText))
            && (defaultFailureText.length > 0 && defaultFailureText.length <= 25 && preTextRgx.test(defaultFailureText))
        ) {
            valid = false
        } else {
            valid = true
        }
        return valid
    }
    useEffect(() => {
        setPreSubTitle(preSubscriptionTitle)
        setPreSubText(preSubscriptionText)
        setPreSubActionText(preSubscriptionActionText)
        setPreSubPosText(preSubscriptionPositiveText)
        setPreSubNegText(preSubscriptionNegativeText)
        setProcessText(processingText)
        setDefaultAcText(defaultActionText)
        setDefaultFailText(defaultFailureText)
        const modifiedPayload = Object.assign({}, state.orgSetting)
        modifiedPayload['vasDefault']['isValidVasDefault'] = validVasSectionComponent()
        dispatch({
            type: "UPDATE_ORGANIZATION_PAYLOAD",
            payload: {
                orgSetting: modifiedPayload
            }
        })
    }, [validVasSectionComponent()])
    return (
        <S.Container>
            <Grid container>
                <div className="row">
                    <Grid item md={12} xs={12}>
                        <div className="cc-form-wrapper">
                            <div className="cr-top-main">
                                <div className="cr-top-wrapper">
                                    <h5 className="title-padding">
                                        {t('ORG_SECTION_VAS_DEFAULT')}
                                    </h5>
                                    <hr></hr>
                                    <div className="cr-body-content">
                                        <Formik
                                            initialValues={{
                                                preSubscriptionTitle: preSubTitle,
                                                preSubscriptionText: preSubText,
                                                preSubscriptionActionText: preSubActionText,
                                                preSubscriptionPositiveText: preSubPosText,
                                                preSubscriptionNegativeText: preSubNegText,
                                                processingText: processText,
                                                defaultActionText: defaultAcText,
                                                defaultFailureText: defaultFailText
                                            }}
                                            validationSchema={yup.object().shape({
                                                preSubscriptionTitle: yup.string().max(30, `${t('MAX_CHAR_ALLOWED', { size: 30 })}`),
                                                preSubscriptionText: yup.string().required(`${t('PRE_SUBSCRIPTION_TEXT_REQUIRED')}`).matches(/^[^\s]+(\s+[^\s]+)*$/, `${t('PRE_SUBSCRIPTION_TEXT_IS_NOT_VALID')}`).max(40, `${t('MAX_CHAR_ALLOWED', { size: 40 })}`),
                                                preSubscriptionActionText: yup.string().required(`${t('PRE_SUBSCRIPTION_ACTION_TEXT_REQUIRED')}`).matches(/^[^\s]+(\s+[^\s]+)*$/, `${t('PRE_SUBSCRIPTION_ACTION_TEXT_IS_NOT_VALID')}`).max(25, `${t('MAX_CHAR_ALLOWED', { size: 25 })}`),
                                                preSubscriptionPositiveText: yup.string().required(`${t('PRE_SUBSCRIPTION_POSITIVE_TEXT_REQUIRED')}`).matches(/^[^\s]+(\s+[^\s]+)*$/, `${t('PRE_SUBSCRIPTION_POSITIVE_TEXT_IS_NOT_VALID')}`).max(25, `${t('MAX_CHAR_ALLOWED', { size: 25 })}`),
                                                preSubscriptionNegativeText: yup.string().required(`${t('PRE_SUBSCRIPTION_NEGATIVE_TEXT_REQUIRED')}`).matches(/^[^\s]+(\s+[^\s]+)*$/, `${t('PRE_SUBSCRIPTION_NEGATIVE_TEXT_IS_NOT_VALID')}`).max(25, `${t('MAX_CHAR_ALLOWED', { size: 25 })}`),
                                                processingText: yup.string().required(`${t('PROCESSING_TEXT_REQUIRED')}`).matches(/^[^\s]+(\s+[^\s]+)*$/, `${t('PROCESSING_TEXT_IS_NOT_VALID')}`).max(30, `${t('MAX_CHAR_ALLOWED', { size: 30 })}`),
                                                defaultActionText: yup.string().required(`${t('DEFAULT_ACTION_TEXT_REQUIRED')}`).matches(/^[^\s]+(\s+[^\s]+)*$/, `${t('DEFAULT_ACTION_TEXT_IS_NOT_VALID')}`).max(25, `${t('MAX_CHAR_ALLOWED', { size: 25 })}`),
                                                defaultFailureText: yup.string().required(`${t('DEFAULT_FAILURE_TEXT_REQUIRED')}`).matches(/^[^\s]+(\s+[^\s]+)*$/, `${t('DEFAULT_FAILURE_TEXT_IS_NOT_VALID')}`).max(25, `${t('MAX_CHAR_ALLOWED', { size: 25 })}`)
                                            })}
                                            enableReinitialize
                                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
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

                                                <Grid container>
                                                    <div className="row">
                                                        <Grid item xs={12} lg={4} className="form-row">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('PRE_SUBSCRIPTION_TITLE')}`}
                                                                placeholder={`${t('PRE_SUBSCRIPTION_TITLE')}`}
                                                                label={<div className="label-tooltip">{`${t('PRE_SUBSCRIPTION_TITLE')}`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_PRE_SUBSCRIPTION_TITLE')}</label>}
                                                                    /></div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="preSubscriptionTitle"
                                                                error={Boolean(touched.preSubscriptionTitle && errors.preSubscriptionTitle)}
                                                                helperText={touched.preSubscriptionTitle && errors.preSubscriptionTitle}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['vasDefault']['preSubscriptionTitle'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setPreSubTitle(e.target.value)
                                                                }}
                                                                value={preSubscriptionTitle}
                                                                type="text" />
                                                            <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                                                        </Grid>
                                                        <Grid item xs={12} lg={4} className="form-row">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('PRE_SUBSCRIPTION_TEXT')}`}
                                                                placeholder={`${t('PRE_SUBSCRIPTION_TEXT')}`}
                                                                label={<div className="label-tooltip">{`${t('PRE_SUBSCRIPTION_TEXT')} *`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_PRE_SUBSCRIPTION_TEXT')}</label>}
                                                                    /></div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="preSubscriptionText"
                                                                error={Boolean(touched.preSubscriptionText && errors.preSubscriptionText)}
                                                                helperText={touched.preSubscriptionText && errors.preSubscriptionText}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['vasDefault']['preSubscriptionText'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setPreSubText(e.target.value)
                                                                }}
                                                                value={preSubscriptionText}
                                                                type="text" />
                                                        </Grid>
                                                        <Grid item xs={12} lg={4} className="form-row">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('PRE_SUBSCRIPTION_ACTION_TEXT')}`}
                                                                placeholder={`${t('PRE_SUBSCRIPTION_ACTION_TEXT')}`}
                                                                label={<div className="label-tooltip">{`${t('PRE_SUBSCRIPTION_ACTION_TEXT')} *`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_DEFAULT_ACTION_TEXT')}</label>}
                                                                    /></div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="preSubscriptionActionText"
                                                                error={Boolean(touched.preSubscriptionActionText && errors.preSubscriptionActionText)}
                                                                helperText={touched.preSubscriptionActionText && errors.preSubscriptionActionText}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['vasDefault']['preSubscriptionActionText'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setPreSubActionText(e.target.value)
                                                                }}
                                                                value={preSubscriptionActionText}
                                                                type="text" />
                                                        </Grid>
                                                    </div>
                                                    <div className="row">
                                                        <Grid item xs={12} lg={4} className="form-row">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('PRE_SUBSCRIPTION_POSITIVE_TEXT')}`}
                                                                placeholder={`${t('PRE_SUBSCRIPTION_POSITIVE_TEXT')}`}
                                                                label={<div className="label-tooltip">{`${t('PRE_SUBSCRIPTION_POSITIVE_TEXT')} *`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_PRE_SUBSCRIPTION_POSITIVE_TEXT')}</label>}
                                                                    /></div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="preSubscriptionPositiveText"
                                                                error={Boolean(touched.preSubscriptionPositiveText && errors.preSubscriptionPositiveText)}
                                                                helperText={touched.preSubscriptionPositiveText && errors.preSubscriptionPositiveText}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['vasDefault']['preSubscriptionPositiveText'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setPreSubPosText(e.target.value)
                                                                }}
                                                                value={preSubscriptionPositiveText}
                                                                type="text" />
                                                        </Grid>
                                                        <Grid item xs={12} lg={4} className="form-row">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('PRE_SUBSCRIPTION_NEGATIVE_TEXT')}`}
                                                                placeholder={`${t('PRE_SUBSCRIPTION_NEGATIVE_TEXT')}`}
                                                                label={<div className="label-tooltip">{`${t('PRE_SUBSCRIPTION_NEGATIVE_TEXT')} *`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_PRE_SUBSCRIPTION_NEGATIVE_TEXT')}</label>}
                                                                    /></div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="preSubscriptionNegativeText"
                                                                error={Boolean(touched.preSubscriptionNegativeText && errors.preSubscriptionNegativeText)}
                                                                helperText={touched.preSubscriptionNegativeText && errors.preSubscriptionNegativeText}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['vasDefault']['preSubscriptionNegativeText'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setPreSubNegText(e.target.value)
                                                                }}
                                                                value={preSubscriptionNegativeText}
                                                                type="text" />
                                                        </Grid>
                                                        <Grid item xs={12} lg={4} className="form-row">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('PROCESSING_TEXT')}`}
                                                                placeholder={`${t('PROCESSING_TEXT')}`}
                                                                label={<div className="label-tooltip">{`${t('PROCESSING_TEXT')} *`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_PROCESSING_TEXT')}</label>}
                                                                    /></div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="processingText"
                                                                error={Boolean(touched.processingText && errors.processingText)}
                                                                helperText={touched.processingText && errors.processingText}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['vasDefault']['processingText'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setProcessText(e.target.value)
                                                                }}
                                                                value={processingText}
                                                                type="text" />
                                                        </Grid>
                                                    </div>
                                                    <div className="row last-row">
                                                        <Grid item xs={12} lg={4} className="form-row">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('DEFAULT_ACTION_TEXT')}`}
                                                                placeholder={`${t('DEFAULT_ACTION_TEXT')}`}
                                                                label={<div className="label-tooltip">{`${t('DEFAULT_ACTION_TEXT')} *`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_DEFAULT_ACTION_TEXT')}</label>}
                                                                    /></div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="defaultActionText"
                                                                error={Boolean(touched.defaultActionText && errors.defaultActionText)}
                                                                helperText={touched.defaultActionText && errors.defaultActionText}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['vasDefault']['defaultActionText'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setDefaultAcText(e.target.value)
                                                                }}
                                                                value={defaultActionText}
                                                                type="text" />
                                                        </Grid>
                                                        <Grid item xs={12} lg={4} >
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('DEFAULT_FAILURE_TEXT')}`}
                                                                placeholder={`${t('DEFAULT_FAILURE_TEXT')}`}
                                                                label={<div className="label-tooltip">{`${t('DEFAULT_FAILURE_TEXT')} *`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_DEFAULT_FAIL_TEXT')}</label>}
                                                                    /></div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="defaultFailureText"
                                                                error={Boolean(touched.defaultFailureText && errors.defaultFailureText)}
                                                                helperText={touched.defaultFailureText && errors.defaultFailureText}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['vasDefault']['defaultFailureText'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setDefaultFailText(e.target.value)
                                                                }}
                                                                value={defaultFailureText}
                                                                type="text" />
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
            </Grid>
        </S.Container>
    )
}
export default VasDefault