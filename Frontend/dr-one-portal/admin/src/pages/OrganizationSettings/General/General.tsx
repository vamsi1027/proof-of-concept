import React, { useContext, useEffect, useState } from 'react'
import * as S from './General.styles'
import { MenuItem, Grid, TextField, FormControl, InputLabel, Select } from "@material-ui/core"
import { SelectTimeZone, LightTooltip } from "@dr-one/shared-component";
import { GlobalContext } from '../../../context/globalState';
import * as yup from 'yup';
import { Formik } from 'formik';
import { apiDashboard, helper } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
function General() {
    const { t } = useTranslation();
    const param = useParams()
    const { state, dispatch } = useContext(GlobalContext);
    const { language, name, timezone, locationHistoryCleanUp,
        dormantDeviceFilterDays, countryISOCode, imageLogo, isValid
    } = state.orgSetting.general
    const [orgName, setOrgName] = useState(name)
    const [timezones, setTimezones] = useState(timezone)
    const [locationHistory, setLocationHistory] = useState(locationHistoryCleanUp)
    const [languageCode, setLanguageCode] = useState(language)
    const [languageList, setLanguageList] = useState([{ name: 'English', code: 'EN' }, { name: 'Portugese', code: 'PT' }, { name: 'Spanish', code: 'ES' }])
    const [dormantDeviceFilter, setdDormatDeviceFilterDays] = useState(dormantDeviceFilterDays)
    const [ISOCountyCode, setISOCountyCode] = useState(countryISOCode)
    const [organizationModifyError, setOrganizationModifyError] = useState('');
    const [imageLogoIcon, setImageLogo] = useState()
    const [ImageErrorMessage, setImageErrorMessage] = useState('')
    const orgId = JSON.parse(localStorage.getItem('dr-user')).organizationActive
    const handleFileUpload = (e): void => {
        setImageLogo(e.target.files[0].name);
        const formData = new FormData();
        formData.append("file", e.target.files[0], e.target.files[0].name);
        const logoMaxImageSize = 50001
        if (e.target.files[0].size < logoMaxImageSize) {
            setImageErrorMessage("")
            apiDashboard
                .post("files/upload", formData)
                .then((response) => {
                    setOrganizationModifyError('')
                    const { id, url } = response.data.data
                    const modifiedPayload = Object.assign({}, state.orgSetting)
                    modifiedPayload['general']['imageLogo'] = url
                    modifiedPayload['general']['imageId'] = id
                    dispatch({
                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                        payload: {
                            orgSetting: modifiedPayload
                        }
                    })
                })
                .catch((error) => {
                    console.log(helper.getErrorMessage(error))
                    setOrganizationModifyError(helper.getErrorMessage(error))
                });
        } else {
            setImageErrorMessage(t('ORG_LOGO_IMAGE_ERROR'))
        }
    };
    const validGeneralSectionComponent = () => {
        let valid = true
        let nameRgx = /^[^\s]+(\s+[^\s]+)*$/
        let countryCodeRgx = /^[A-Za-z]{2}$/
        if ((language.length > 0) && (name.length > 0 && nameRgx.test(name))
            && (timezone.length > 0) && (locationHistoryCleanUp.length > 0)
            && (dormantDeviceFilterDays >= 0)
            && (countryISOCode.length > 0 && countryCodeRgx.test(countryISOCode))
            && imageLogo?.length > 0) {
            valid = false
        }
        else {
            valid = true
        }
        return valid
    }
    useEffect(() => {
        setOrgName(name)
        setTimezones(timezone)
        setLocationHistory(locationHistoryCleanUp)
        setLanguageCode(language)
        setdDormatDeviceFilterDays(dormantDeviceFilterDays)
        setISOCountyCode(countryISOCode)
        const modifiedPayload = Object.assign({}, state.orgSetting)
        modifiedPayload['general']['isValid'] = validGeneralSectionComponent()
        dispatch({
            type: "UPDATE_ORGANIZATION_PAYLOAD",
            payload: {
                orgSetting: modifiedPayload
            }
        })

    }, [validGeneralSectionComponent()])
    return (
        <S.Container>
            <Grid container>
                <div className="row">
                    <Grid item md={12} xs={12}>
                        <div className="cc-form-wrapper">
                            <div className="cr-top-main no-scroll-y">
                                <div className="cr-top-wrapper">
                                    <h5 className="title-padding">
                                        {t('ORG_SECTION_GENERAL')}
                                    </h5>
                                    <hr></hr>
                                    <div className="cr-body-content">
                                        <Formik
                                            enableReinitialize
                                            initialValues={{
                                                name: orgName,
                                                timezone: timezones,
                                                locationHistoryCleanUp: locationHistory,
                                                language: language,
                                                dormantDeviceFilterDays: dormantDeviceFilter,
                                                countryISOCode: ISOCountyCode,
                                                imageLogo: imageLogoIcon
                                            }}
                                            validationSchema={yup.object().shape({
                                                name: yup.string()
                                                    .required(`${t('ORG_NAME_IS_REQUIRED')}`)
                                                    .matches(/^[^\s]+(\s+[^\s]+)*$/, `${t('ORG_NAME_NOT_VALID')}`),
                                                timezone: yup.string().required(`${t('TIMEZONE_IS_REQUIRED')}`),
                                                locationHistoryCleanUp: yup.number().required(`${t('LOCATION_HISTORY_IS_REQUIRED')}`),
                                                dormantDeviceFilterDays: yup.number().min(0, `${t('DAY_VALUE_SHOULD_BE_ZERO', { size: 0 })}`),
                                                countryISOCode: yup.string()
                                                    .required(`${t('ISO_COUNTRY_CODE_IS_REQUIRED')}`)
                                                    .matches(/^[A-Za-z]{2}$/, `${t('IOS_COUNTRY_IS_INVALID')}`),
                                            })}
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
                                                        <Grid item xs={8} lg={10}>
                                                            <Grid container>
                                                                <div className="row first-row">
                                                                    <Grid item xs={12} lg={4} className="form-row">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            aria-describedby={`${t('NAME')}`}
                                                                            placeholder={`${t('NAME')}`}
                                                                            label={<div className="label-tooltip">{`${t('NAME')} *`}
                                                                                <LightTooltip title={<label>{t('TOOLTIP_NAME')}</label>}
                                                                                /> </div>}
                                                                            disabled={param?.id || (orgId && window.location.pathname.indexOf('new') < 0)}
                                                                            error={Boolean(touched.name && errors.name)}
                                                                            helperText={touched.name && errors.name}
                                                                            onBlur={handleBlur}
                                                                            InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                            name="name"
                                                                            onChange={(e) => {
                                                                                handleChange(e);
                                                                                const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                                modifiedPayload['general']['name'] = e.target.value
                                                                                dispatch({
                                                                                    type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                                    payload: {
                                                                                        orgSetting: modifiedPayload
                                                                                    }
                                                                                })
                                                                                setOrgName(e.target.value)
                                                                            }}
                                                                            value={name}
                                                                            type="text"
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} lg={4} >
                                                                        <FormControl className="timezone">
                                                                            <SelectTimeZone value={timezone}
                                                                                label={<div className="label-tooltip">{`${t('HEADER_TIMEZONE')} *`}
                                                                                    <LightTooltip title={<label>{t('TOOLTIP_TIMEZONE')}</label>}
                                                                                    /></div>}
                                                                                onChange={(e) => {
                                                                                    handleChange(e);
                                                                                    const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                                    modifiedPayload['general']['timezone'] = e
                                                                                    dispatch({
                                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                                        payload: {
                                                                                            orgSetting: modifiedPayload
                                                                                        }
                                                                                    })
                                                                                    setTimezones(e)
                                                                                }} />
                                                                        </FormControl>

                                                                    </Grid>
                                                                    <Grid item xs={12} lg={4} className="form-row">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            aria-describedby={`${t('LOCATION_HISTORY')}`}
                                                                            placeholder={`${t('LOCATION_HISTORY')}`}
                                                                            label={<div className="label-tooltip">{`${t('LOCATION_HISTORY')} *`}
                                                                                <LightTooltip title={<label>{t('TOOLTIP_LOCATION_HISTORY')}</label>}
                                                                                /></div>}
                                                                            error={Boolean(touched.locationHistoryCleanUp && errors.locationHistoryCleanUp)}
                                                                            helperText={touched.locationHistoryCleanUp && errors.locationHistoryCleanUp}
                                                                            onBlur={handleBlur}
                                                                            // onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()}
                                                                            InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                            name="locationHistoryCleanUp"
                                                                            type="number"
                                                                            onChange={(e) => {
                                                                                handleChange(e);
                                                                                setLocationHistory(e.target.value)
                                                                                const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                                modifiedPayload['general']['locationHistoryCleanUp'] = e.target.value
                                                                                dispatch({
                                                                                    type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                                    payload: {
                                                                                        orgSetting: modifiedPayload
                                                                                    }
                                                                                })
                                                                            }}
                                                                            value={locationHistory} />
                                                                    </Grid>
                                                                </div>
                                                                <div className="row last-row">
                                                                    {/* <Grid item xs={12} lg={4} className="form-row">
                                                                        <FormControl className="form-select-box">
                                                                            <InputLabel variant="filled" style={{ pointerEvents: "auto" }}>
                                                                                <div className="label-tooltip">{`${t('LANGUAGE')} * `}
                                                                                    <LightTooltip title={<label>{t('TOOLTIP_LANGUAGE')}</label>}
                                                                                    /></div>
                                                                            </InputLabel>
                                                                            <Select
                                                                                label={`${t('LANGUAGE')}`}
                                                                                value={language}
                                                                                onChange={(e) => {
                                                                                    handleChange(e);
                                                                                    setLanguageCode(e.target.value);
                                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                                    modifiedPayload['general']['language'] = e.target.value;
                                                                                    dispatch({
                                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                                        payload: {
                                                                                            orgSetting: modifiedPayload
                                                                                        }
                                                                                    })
                                                                                }}
                                                                                name="language"
                                                                            >
                                                                                {languageList.map((lang) => (
                                                                                    <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Grid> */}
                                                                    <Grid item xs={12} lg={4} className="form-row">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            aria-describedby={`${t('DORMANT_DEVICE_FILTER_DAYS')}`}
                                                                            placeholder={`${t('DORMANT_DEVICE_FILTER_DAYS')}`}
                                                                            InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                            label={<div className="label-tooltip">{`${t('DORMANT_DEVICE_FILTER_DAYS')}`}
                                                                                <LightTooltip title={<label>{t('TOOLTIP_DORMAT')}</label>}
                                                                                /></div>}
                                                                            name="dormantDeviceFilterDays"
                                                                            error={Boolean(touched.dormantDeviceFilterDays && errors.dormantDeviceFilterDays)}
                                                                            helperText={touched.dormantDeviceFilterDays && errors.dormantDeviceFilterDays}
                                                                            onBlur={handleBlur}
                                                                            // onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()}
                                                                            onChange={(e) => {
                                                                                handleChange(e);
                                                                                const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                                modifiedPayload['general']['dormantDeviceFilterDays'] = parseInt(e.target.value)
                                                                                dispatch({
                                                                                    type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                                    payload: {
                                                                                        orgSetting: modifiedPayload
                                                                                    }
                                                                                })
                                                                                setdDormatDeviceFilterDays(e.target.value)
                                                                            }}
                                                                            value={dormantDeviceFilterDays}
                                                                            type="number" />
                                                                        <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                                                                    </Grid>
                                                                    <Grid item xs={12} lg={4} >
                                                                        <TextField
                                                                            variant="outlined"
                                                                            aria-describedby={`${t('ISO_COUNTY_CODE')}`}
                                                                            placeholder={`${t('ISO_COUNTY_CODE')}`}
                                                                            InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                            label={<div className="label-tooltip">{`${t('ISO_COUNTY_CODE')} *`}
                                                                                <LightTooltip title={<label>{t('TOOLTIP_IOS_CODE_COUNTRY')}</label>}
                                                                                /></div>}
                                                                            error={Boolean(touched.countryISOCode && errors.countryISOCode)}
                                                                            helperText={touched.countryISOCode && errors.countryISOCode}
                                                                            onBlur={handleBlur}
                                                                            onChange={(e) => {
                                                                                handleChange(e);
                                                                                const modifiedPayload = Object.assign({}, state.orgSetting)
                                                                                modifiedPayload['general']['countryISOCode'] = e.target.value
                                                                                dispatch({
                                                                                    type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                                    payload: {
                                                                                        orgSetting: modifiedPayload
                                                                                    }
                                                                                })
                                                                                setISOCountyCode(e.target.value)
                                                                            }}
                                                                            value={countryISOCode}
                                                                            name="countryISOCode"
                                                                            type="text" />
                                                                    </Grid>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={4} lg={2}>
                                                            <Grid item xs={12} sm={12} className="form-row">
                                                                <small className="logo-label">{`${t('ORG_LOGO_IMAGE_LABEL')} *`}</small>
                                                                <p className="error" >{organizationModifyError}</p>
                                                                <div className="drag-and-drop-wrapper small">
                                                                    {imageLogo && <img src={imageLogo} alt={imageLogo} className="org_logo" />}
                                                                    <TextField type="file" onChange={(e) => handleFileUpload(e)} variant="outlined" className="custom-file-input" />
                                                                    <span></span>
                                                                    <div className="image-info-box">
                                                                        <p>{t('DRAG_DROP_FILE')}
                                                                        </p>
                                                                        <p className="extension-text">{t('JPG_JPEG_PNG')}</p>
                                                                    </div>
                                                                </div>
                                                                <p className="nnot-allowed-image">{ImageErrorMessage}</p>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </Grid>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </div>
            </Grid>
        </S.Container>
    )
}
export default General