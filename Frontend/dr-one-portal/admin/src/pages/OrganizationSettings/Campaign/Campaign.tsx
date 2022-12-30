import React, { useContext, useEffect, useState } from 'react'
import * as S from './Campaign.styles'
import { Grid, TextField, Switch, FormControl, FormControlLabel } from "@material-ui/core"
import * as yup from 'yup';
import { Formik, Field } from 'formik';
import { GlobalContext } from '../../../context/globalState';
import { useTranslation } from 'react-i18next';
import HelpIcon from '@material-ui/icons/Help';
import { LightTooltip } from "@dr-one/shared-component";
const Campaign = (props) => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(GlobalContext);
    const { s3AdUrl, mainImageSize, videoImageSize, clientIdForReachCount, gifImageSize,
        notificationImageSize, fsImageSize, apkImageSize } = state?.orgSetting?.campaign
    const [s3AdUrlLink, setS3AdUrlLink] = useState(s3AdUrl)
    const [imageMaxSize, setImageMaxSize] = useState(mainImageSize)
    const [fullImageSize, setFullImageSize] = useState(fsImageSize)
    const [notificationImageMaxSize, setNotificationImageMaxSize] = useState(notificationImageSize)
    const [videoMaxsize, setVideoMaxsize] = useState(videoImageSize)
    const [gifImageMaxSize, setGifImageMaxSize] = useState(gifImageSize)
    const validCampaignSectionComponent = (): boolean => {
        let UrlRgx = /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
        let notificationImageSizeRgx = /^[0-9]$|^[1-9][0-9]$|^(100)$/g
        let videoImageSizeRgx = /\b([1-9]|[1-8][0-9]|9[0-9]|[1-8][0-9]{2}|9[0-8][0-9]|99[0-9]|[1-3][0-9]{3}|4000)\b/g
        let gifImageSizeRgx = /\b([1-9]|[1-8][0-9]|9[0-9]|[1-8][0-9]{2}|9[0-8][0-9]|99[0-9]|[1-3][0-9]{3}|4000)\b/g
        let mainImageSizeRgx = /\b([1-9]|[1-8][0-9]|9[0-9]|[12][0-9]{2}|300)\b/g
        let fsImageSizeRgx = /\b([1-9]|[1-8][0-9]|9[0-9]|[1-4][0-9]{2}|500)\b/g
        let valid = true
        if ((UrlRgx.test(s3AdUrl)) && (notificationImageSizeRgx.test(notificationImageSize))
            && (mainImageSizeRgx.test(mainImageSize)) && (videoImageSizeRgx.test(videoImageSize))
            && (fsImageSizeRgx.test(fsImageSize)) && (gifImageSizeRgx.test(gifImageSize))
        ) {
            valid = false
        } else {
            valid = true
        }
        return valid
    }
    useEffect(() => {
        setS3AdUrlLink(s3AdUrl)
        setImageMaxSize(mainImageSize)
        setFullImageSize(fsImageSize)
        setVideoMaxsize(videoImageSize)
        setNotificationImageMaxSize(notificationImageSize)
        setGifImageMaxSize(gifImageSize)
        const modifiedPayload = Object.assign({}, state.orgSetting)
        modifiedPayload['campaign']['isValidCampaign'] = validCampaignSectionComponent()
        dispatch({
            type: "UPDATE_ORGANIZATION_PAYLOAD",
            payload: {
                orgSetting: modifiedPayload
            }
        })
    }, [validCampaignSectionComponent()])

    return (
        <S.Container>
            <Grid container>
                <div className="row">
                    <Grid item md={12} xs={12}>
                        <div className="cc-form-wrapper">
                            <div className="cr-top-main">
                                <div className="cr-top-wrapper">
                                    <h5 className="title-padding">
                                        {t('ORG_SECTION_CAMPAIGN')}
                                    </h5>
                                    <hr></hr>
                                    <div className="cr-body-content">
                                        <Formik
                                            initialValues={{
                                                s3AdUrl: s3AdUrlLink,
                                                mainImageSize: imageMaxSize,
                                                videoImageSize: videoMaxsize,
                                                fsImageSize: fullImageSize,
                                                notificationImageSize: notificationImageMaxSize,
                                                gifImageSize: gifImageMaxSize
                                            }}
                                            validationSchema={yup.object().shape({
                                                s3AdUrl: yup.string().matches(/^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
                                                    , `${t('MUST_BE_VALID_URL')}`)
                                                    .required(`${t('S3_AD_URL_IS_REQUIRED')}`),
                                                notificationImageSize: yup.number().required(`${t('NOTIFICATION_IMAGE_MAX_IS_REQUIRED')}`).min(1, `${t('NOTIFICATION_IMAGE_MINIMUM_SIZE_SHOULD_BE_ONE', { size: 1 })}`).max(100, `${t('NOTIFICATION_IMAGE_MAX_CANNOT_EXCEED', { size: 100 })}`),
                                                mainImageSize: yup.number().required(`${t('PARTIAL_OMAGE_MAX_SIZE_IS_REQUIRED')}`).min(1, `${t('PARTIAL_IMAGE_MINIMUM_SIZE_SHOULD_BE_ONE')}`).max(300, `${t('PARTIAL_OMAGE_MAX_SIZE_CANNOT_EXCEED', { size: 300 })}`),
                                                videoImageSize: yup.number().required(`${t('VIDEO_FILE_REQUIRED')}`).min(1, `${t('VIDEO_FILE_SHOULD_ONE_KB', { size: 1 })}`).max(4000, `${t('VIDEO_FILE_SIZE_CANNOT_EXCEED', { size: 4000 })}`),
                                                fsImageSize: yup.number().required(`${t('FULLSCREEN_IMAGE_REQUIRED')}`).min(1, `${t('FULLSCREEN_SHOULD_ONE_KB', { size: 1 })}`).max(500, `${t('FULLSCREEN_CANNOT_EXCEED', { size: 500 })}`),
                                                gifImageSize: yup.number().required(`${t('GIF_IMAGE_IS_REQUIRED')}`).min(1, `${t('GIF_IMAGE_MINIMUM_SIZE_ONE_KB', { size: 1 })}`).max(4000, `${t('GIF_IMAGE_SIZE_CANNOT_EXCEED', { size: 4000 })}`)
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
                                                        <Grid item xs={12} lg={6} className="form-row">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('S3URLAD')}`}
                                                                placeholder={`${t('S3URLAD')}`}
                                                                label={<div className="label-tooltip">{`${t('S3URLAD')} *`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_S3_AD_URL')}</label>} />
                                                                </div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="s3AdUrl"
                                                                error={Boolean(touched.s3AdUrl && errors.s3AdUrl)}
                                                                helperText={touched.s3AdUrl && errors.s3AdUrl}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['campaign']['s3AdUrl'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setS3AdUrlLink(e.target.value)
                                                                }}
                                                                value={s3AdUrl}
                                                                type="text" />
                                                        </Grid>
                                                        <Grid item xs={12} lg={3} className="form-row label-width-250">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('PARTIAL_IMAGE_MAX_SIZE')}`}
                                                                placeholder={`${t('PARTIAL_IMAGE_MAX_SIZE')}`}
                                                                label={<div className="label-tooltip">{`${t('PARTIAL_IMAGE_MAX_SIZE')}*`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_PARTIAL_IMAGE_MAX')}</label>}
                                                                    /> </div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="mainImageSize"
                                                                error={Boolean(touched.mainImageSize && errors.mainImageSize)}
                                                                helperText={touched.mainImageSize && errors.mainImageSize}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['campaign']['mainImageSize'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setImageMaxSize(e.target.value)
                                                                }}
                                                                value={mainImageSize}
                                                                type="number" />
                                                        </Grid>
                                                        <Grid item xs={12} lg={3} className="form-row label-width-220">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('VIDEO_FILE_MAX')}`}
                                                                placeholder={`${t('VIDEO_FILE_MAX')}`}
                                                                label={<div className="label-tooltip">{`${t('VIDEO_FILE_MAX')}*`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_PARTIAL_VIDEO_MAX')}</label>}
                                                                    /> </div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="videoImageSize"
                                                                error={Boolean(touched.videoImageSize && errors.videoImageSize)}
                                                                helperText={touched.videoImageSize && errors.videoImageSize}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['campaign']['videoImageSize'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setVideoMaxsize(e.target.value)
                                                                }}
                                                                value={videoImageSize}
                                                                type="number" />
                                                        </Grid>

                                                    </div>

                                                    <div className="row">
                                                        <Grid item xs={12} lg={6} className="form-row">
                                                            <FormControl>
                                                                <label className="MuiFormLabel-root" style={{ fontSize: 12 }}>
                                                                    <div className="label-tooltip small-tooltip">{t('DIGITAL_REEF_CLIENT_FOR_REACHCOUNT')}
                                                                        <LightTooltip title={<label>{t('TOOLTIP_CLIENT_REACH_COUNT_RADIO')}</label>}
                                                                        /></div>
                                                                </label>
                                                                <div className="switchery org-switchery">
                                                                    <FormControlLabel
                                                                        control={<Field
                                                                            label={`${t('ENABLE')}`}
                                                                            name="enable"
                                                                            component={Switch}
                                                                            onChange={(e) => {
                                                                                handleChange(e);
                                                                                const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                                modifiedPayload['campaign']['clientIdForReachCount'] = !e.target.checked;
                                                                                dispatch({
                                                                                    type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                                    payload: {
                                                                                        orgSetting: modifiedPayload
                                                                                    }
                                                                                })
                                                                            }}
                                                                            checked={!clientIdForReachCount}
                                                                        />}
                                                                        label={`${t('ENABLE')}`}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} lg={3} className="form-row label-width-220">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('GIF_IMAGE_SIZE')}`}
                                                                placeholder={`${t('GIF_IMAGE_SIZE')}`}
                                                                label={<div className="label-tooltip">{`${t('GIF_IMAGE_SIZE')}*`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_IMAGE_MAX_SIZE')}</label>}
                                                                    /> </div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="gifImageSize"
                                                                error={Boolean(touched.gifImageSize && errors.gifImageSize)}
                                                                helperText={touched.gifImageSize && errors.gifImageSize}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['campaign']['gifImageSize'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setGifImageMaxSize(e.target.value)
                                                                }}
                                                                value={gifImageSize}
                                                                type="number" />
                                                        </Grid>
                                                        <Grid item xs={12} lg={3} className="form-row label-width-288">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('NOTIFICATION_MAX_IMAGE_SIZE')}`}
                                                                placeholder={`${t('NOTIFICATION_MAX_IMAGE_SIZE')}`}
                                                                label={<div className="label-tooltip">{`${t('NOTIFICATION_MAX_IMAGE_SIZE')} *`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_NOTIFICATION_GIF_IMAGE_MAX_SIZE')}</label>}
                                                                    /> </div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="notificationImageSize"
                                                                type="number"
                                                                error={Boolean(touched.notificationImageSize && errors.notificationImageSize)}
                                                                helperText={touched.notificationImageSize && errors.notificationImageSize}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['campaign']['notificationImageSize'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setNotificationImageMaxSize(e.target.value)
                                                                }}
                                                                value={notificationImageSize}
                                                            />
                                                        </Grid>
                                                    </div>

                                                    <div className="row last-row">
                                                        <Grid item xs={12} lg={3} className="label-width-270">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('FULLSCREEN_IMAGE_SIZE')}`}
                                                                placeholder={`${t('FULLSCREEN_IMAGE_SIZE')}`}
                                                                label={<div className="label-tooltip">{`${t('FULLSCREEN_IMAGE_SIZE')} *`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_FULLSCREEN_IMAGE_SIZE')}</label>}
                                                                    /> </div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="fsImageSize"
                                                                error={Boolean(touched.fsImageSize && errors.fsImageSize)}
                                                                helperText={touched.fsImageSize && errors.fsImageSize}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                    modifiedPayload['campaign']['fsImageSize'] = e.target.value
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                    setFullImageSize(e.target.value)
                                                                }}
                                                                value={fsImageSize}
                                                                type="number"
                                                            />
                                                        </Grid>

                                                    </div>

                                                </Grid>
                                            )}
                                        </Formik>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid >

                </div >
            </Grid >
        </S.Container >
    )
}
export default Campaign