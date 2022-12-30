import React, { useContext, useState, useEffect } from 'react'
import { Grid, TextField, Card } from "@material-ui/core"
import * as yup from 'yup';
import { Formik } from 'formik';
import { GlobalContext } from '../../../context/globalState';
import { useTranslation } from 'react-i18next';
import HelpIcon from '@material-ui/icons/Help';
import { LightTooltip } from "@dr-one/shared-component";
function Campaign() {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(GlobalContext);
    const { campaignSchedulerAdLimit, max, rollingDays } = state.orgSetting.adLimit
    const [campaignSchedulerAd, setCampaignScheduler] = useState(campaignSchedulerAdLimit)
    const [overAllAd, setOverAllAd] = useState(max)
    const [rollingDaysAd, setRollingDaysAd] = useState(rollingDays)

    const validAdlimitSectionComponent = (): boolean => {
        let campaignSchedulerAdLimitRgx = /^[0-9]$|^[1-9][0-9]$|^(99)$/g
        let maxRgximage = /^[0-9]$|^[1-9][0-9]$|^(99)$/g
        let rollingDaysRgx = /\b(0?[1-9]|1[0-9]|2[0-9]|3[0-1])\b/g
        let valid = true
        if ((campaignSchedulerAdLimitRgx.test(campaignSchedulerAdLimit))
            && (maxRgximage.test(max))
            && (rollingDaysRgx.test(rollingDays))) {
            valid = false
        } else {
            valid = true
        }
        return valid
    }
    useEffect(() => {
        setCampaignScheduler(campaignSchedulerAdLimit)
        setOverAllAd(max)
        setRollingDaysAd(rollingDays)
        const modifiedPayload = Object.assign({}, state.orgSetting)
        modifiedPayload['adLimit']['isValidAdlimit'] = validAdlimitSectionComponent()
        dispatch({
            type: "UPDATE_ORGANIZATION_PAYLOAD",
            payload: {
                orgSetting: modifiedPayload
            }
        })
    }, [validAdlimitSectionComponent()])
    return (
        <Grid container>
            <div className="row">
                <Grid item md={12} xs={12}>
                    <div className="cc-form-wrapper">
                        <div className="cr-top-main">
                            <div className="cr-top-wrapper">
                                <h5 className="title-padding">
                                    {t('ORG_SECTION_ADLIMIT')}
                                </h5>
                                <hr></hr>
                                <div className="cr-body-content">
                                    <Formik
                                        initialValues={{
                                            campaignSchedulerAdLimit: campaignSchedulerAd,
                                            max: overAllAd,
                                            rollingDays: rollingDaysAd
                                        }}
                                        validationSchema={yup.object().shape({
                                            campaignSchedulerAdLimit: yup.number().required(`${t('CAMPAIGN_SCHEDULER_IS_REQUIRED')}`).max(99, `${t('CAMPAIGN_SCHEDULER_AD_LIMIT_CANNOT_EXCEED', { size: 99 })}`).min(1, `${t('CAMPAIGN_SCHEDULER_AD_LIMIT_SHOULD_BE_ONE', { size: 1 })}`),
                                            max: yup.number().required(`${t('OVERALL_IS_REQUIRED')}`).max(99, `${t('OVERALL_AD_LIMIT_CONNOT_EXCEED', { size: 99 })}`).min(1, `${t('OVERALL_MINIMUM_AD_LIMIT_SHOULD_BE_ONE', { size: 1 })}`),
                                            rollingDays: yup.number().required(`${t('ROLLING_DAYS_IS_REQUIRED')}`).min(1, `${t('ROLLING_DAYS_MINIMUM_SHOULD_BE_ONE', { size: 1 })}`).max(31, `${t('ROLLING_DAYS_CANNOT_EXCEED', { size: 31 })}`)
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
                                                <div className="row last-row">
                                                    <Grid item xs={12} lg={4} className="form-row">
                                                        <TextField
                                                            variant="outlined"
                                                            aria-describedby={`${t('CAMPAIGN_SCHEDULER')}`}
                                                            placeholder={`${t('CAMPAIGN_SCHEDULER')}`}
                                                            label={<div className="label-tooltip">{`${t('CAMPAIGN_SCHEDULER')} *`}
                                                                <LightTooltip title={<label>{t('TOOLTIP_CAMPAIGN_SCHEDULER')}</label>}
                                                                /></div>}
                                                            InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                            name="campaignSchedulerAdLimit"
                                                            error={Boolean(touched.campaignSchedulerAdLimit && errors.campaignSchedulerAdLimit)}
                                                            helperText={touched.campaignSchedulerAdLimit && errors.campaignSchedulerAdLimit}
                                                            onBlur={handleBlur}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                modifiedPayload['adLimit']['campaignSchedulerAdLimit'] = parseInt(e.target.value)
                                                                dispatch({
                                                                    type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                    payload: {
                                                                        orgSetting: modifiedPayload
                                                                    }
                                                                })
                                                                setCampaignScheduler(e.target.value)
                                                            }}
                                                            value={campaignSchedulerAdLimit}
                                                            type="number" />
                                                    </Grid>
                                                    <Grid item xs={12} lg={4} className="form-row">
                                                        <TextField
                                                            variant="outlined"
                                                            aria-describedby={`${t('OVERALL')}`}
                                                            placeholder={`${t('OVERALL')}`}
                                                            label={<div className="label-tooltip">{`${t('OVERALL')} *`}
                                                                <LightTooltip title={<label>{t('TOOLTIP_OVERALL')}</label>} />
                                                            </div>}
                                                            InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                            name="max"
                                                            error={Boolean(touched.max && errors.max)}
                                                            helperText={touched.max && errors.max}
                                                            onBlur={handleBlur}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                modifiedPayload['adLimit']['max'] = parseInt(e.target.value)
                                                                dispatch({
                                                                    type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                    payload: {
                                                                        orgSetting: modifiedPayload
                                                                    }
                                                                })
                                                                setOverAllAd(e.target.value)
                                                            }}
                                                            value={max}
                                                            type="number" />
                                                    </Grid>
                                                    <Grid item xs={12} lg={4} >
                                                        <TextField
                                                            variant="outlined"
                                                            aria-describedby={`${t('ROLLING_DAYS')}`}
                                                            placeholder={`${t('ROLLING_DAYS')}`}
                                                            label={<div className="label-tooltip">{`${t('ROLLING_DAYS')} *`}
                                                                <LightTooltip title={<label>{t('TOOLTIP_ROLLING_DAYS')}</label>} />
                                                            </div>}
                                                            InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                            name="rollingDays"
                                                            error={Boolean(touched.rollingDays && errors.rollingDays)}
                                                            helperText={touched.rollingDays && errors.rollingDays}
                                                            onBlur={handleBlur}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                modifiedPayload['adLimit']['rollingDays'] = parseInt(e.target.value)
                                                                dispatch({
                                                                    type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                    payload: {
                                                                        orgSetting: modifiedPayload
                                                                    }
                                                                })
                                                                setRollingDaysAd(e.target.value)
                                                            }}
                                                            value={rollingDays}
                                                            type="number" />
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
    )
}
export default Campaign