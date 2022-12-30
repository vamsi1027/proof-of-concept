import React, { useContext, useState, useEffect } from 'react'
import { Chip, MenuItem, Grid, TextField, InputLabel, Select, Card, FormControl } from "@material-ui/core"
import Autocomplete from '@material-ui/lab/Autocomplete';
import { apiDashboard, helper } from "@dr-one/utils";
import * as yup from 'yup';
import { Formik } from 'formik';
import { GlobalContext } from '../../../context/globalState';
import { useTranslation } from 'react-i18next';
import HelpIcon from '@material-ui/icons/Help';
import { LightTooltip } from "@dr-one/shared-component";

function VirtualPreload() {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(GlobalContext);
    const orgId = JSON.parse(localStorage.getItem('dr-user')).organizationActive
    const { agencyId, advertiserId, clusterId, campaignCategoryid, campaignObjectiveId,
        sourcePackage, preloadDeliveryStrategyid, maxAcceleratedTimeDuration, apkFileMaxSize, maxSlot, } = state.orgSetting.virtualPayload
    const [agency, setAgency] = useState(agencyId);
    const [agencyList, setAgencyList] = useState([]);
    const [advertiser, setAdvertiser] = useState(advertiserId);
    const [advertiserList, setAdvertiserList] = useState([]);
    const [cluster, setCluster] = useState(clusterId);
    const [clusterList, setClusterList] = useState([]);
    const [campaignCategory, setCampignCategory] = useState(campaignCategoryid)
    const [campaignCategoryList, setCampignCategoryList] = useState([])
    const [campaingObjective, setCampaingObjective] = useState(campaignObjectiveId)
    const [campaingObjectiveList, setCampaingObjectiveList] = useState([])
    const [preload, setPreload] = useState(preloadDeliveryStrategyid)
    const [source, setSource] = useState(sourcePackage)
    const [maxAccTimeDuration, setMaxAccTimeDuration] = useState(maxAcceleratedTimeDuration)
    const [apkFileSize, setApkFileSize] = useState(apkFileMaxSize)
    const [maxSlotVirtual, setMaxSlotVirtual] = useState(maxSlot)

    const [preloadDeliveryStrategyList, setPreloadDeliveryStrategyList] = useState([{ id: t('IMEI_CHANNEL_MAPPING'), name: t('IMEI') }, { id: t('MAKE_MODEL_MAPPING'), name: t('MAKE_MODEL') }])
    useEffect(() => {
        apiDashboard
            .get('campaign-mgmt-api/configurations/campaignobjectives?showHidden=true')
            .then(response => {
                setCampaingObjectiveList(response.data.data.filter(item => item.hidden).sort((a, b) => a.name.localeCompare(b.name)));
                if (window.location.pathname.indexOf('edit') < 0) {
                    if (!campaignObjectiveId) {
                        setCampaingObjective(response.data.data[0].id);
                        const modifiedPayload = Object.assign({}, state.orgSetting);
                        modifiedPayload['virtualPayload']['campaignObjectiveId'] = response.data.data[0].id;
                        dispatch({
                            type: "UPDATE_ORGANIZATION_PAYLOAD",
                            payload: {
                                orgSetting: modifiedPayload
                            }
                        })
                    }
                }
            }, error => {
                setCampaingObjectiveList([]);
                console.log(helper.getErrorMessage(error));
            });
        apiDashboard
            .get('campaign-mgmt-api/configurations/campaigncategories')
            .then(response => {
                setCampignCategoryList(response.data.data);
                if (window.location.pathname.indexOf('edit') < 0) {
                    if (!campaignCategoryid) {
                        setCampignCategory(response.data.data[0].id);
                        const modifiedPayload = Object.assign({}, state.orgSetting);
                        modifiedPayload['virtualPayload']['campaignCategoryid'] = response.data.data[0].id;
                        dispatch({
                            type: "UPDATE_ORGANIZATION_PAYLOAD",
                            payload: {
                                orgSetting: modifiedPayload
                            }
                        })
                    }
                }
            }, error => {
                setCampignCategoryList([]);
                console.log(helper.getErrorMessage(error));
            });
        apiDashboard
            .get('campaign-mgmt-api/agency')
            .then(response => {
                setAgencyList(response.data.data);
                if (window.location.pathname.indexOf('edit') < 0) {
                    if (!agencyId) {
                        setAgency(response.data.data[0].id);
                        const modifiedPayload = Object.assign({}, state.orgSetting);
                        modifiedPayload['virtualPayload']['agencyId'] = response.data.data[0].id;
                        dispatch({
                            type: "UPDATE_ORGANIZATION_PAYLOAD",
                            payload: {
                                orgSetting: modifiedPayload
                            }
                        })
                    }
                }

            }, error => {
                setAgencyList([]);
                console.log(helper.getErrorMessage(error));
            });
        apiDashboard
            .get('campaign-mgmt-api/advertiser')
            .then(response => {
                setAdvertiserList(response.data.data);
                if (window.location.pathname.indexOf('edit') < 0) {
                    if (!advertiserId) {
                        setAdvertiser(response.data.data[0].id);
                        const modifiedPayload = Object.assign({}, state.orgSetting);
                        modifiedPayload['virtualPayload']['advertiserId'] = response.data.data[0].id;
                        dispatch({
                            type: "UPDATE_ORGANIZATION_PAYLOAD",
                            payload: {
                                orgSetting: modifiedPayload
                            }
                        })
                    }
                }
            }, error => {
                setAdvertiserList([]);
                console.log(helper.getErrorMessage(error));
            });
        apiDashboard
            .get(`campaign-mgmt-api/audienceclusters/v2/organizationid/${orgId}`)
            .then(response => {
                setClusterList(response.data.data);
                if (window.location.pathname.indexOf('edit') < 0) {
                    if (!clusterId) {
                        setCluster(response.data.data[0].id);
                        const modifiedPayload = Object.assign({}, state.orgSetting);
                        modifiedPayload['virtualPayload']['clusterId'] = response.data.data[0].id;
                        dispatch({
                            type: "UPDATE_ORGANIZATION_PAYLOAD",
                            payload: {
                                orgSetting: modifiedPayload
                            }
                        })
                    }
                }

            }, error => {
                setClusterList([]);
                console.log(helper.getErrorMessage(error));
            });
    }, [])
    const validVirtualSectionComponent = (): boolean => {
        let maxSlotRgx = /\b(0?[1-9]|1[0-9]|2[0])\b/g
        let apkFileSizeRgx = /\b([1-9]|[1-8][0-9]|9[0-9]|[1-8][0-9]{2}|9[0-8][0-9]|99[0-9]|[1-8][0-9]{3}|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9]|[1-8][0-9]{4}|9[0-8][0-9]{3}|99[0-8][0-9]{2}|999[0-8][0-9]|9999[0-9]|1[0-9]{5}|2[0-4][0-9]{4}|25[0-5][0-9]{3}|256000)\b/g
        let valid = true
        if ((apkFileSizeRgx.test(apkFileMaxSize)) && (maxSlotRgx.test(maxSlot))) {
            valid = false
        } else {
            valid = true
        }
        return valid
    }
    setTimeout(() => {
        setApkFileSize(apkFileMaxSize)
        setMaxSlotVirtual(maxSlot)
        setMaxAccTimeDuration(maxAcceleratedTimeDuration)
    }, 1000);
    useEffect(() => {
        const modifiedPayload = Object.assign({}, state.orgSetting)
        modifiedPayload['virtualPayload']['isValidVirtualPayload'] = validVirtualSectionComponent()
        dispatch({
            type: "UPDATE_ORGANIZATION_PAYLOAD",
            payload: {
                orgSetting: modifiedPayload
            }
        })
    }, [validVirtualSectionComponent()])

    return (
        <Grid container>
            <div className="row">
                <Grid item md={12} xs={12}>
                    <div className="cc-form-wrapper">
                        <div className="cr-top-main">
                            <div className="cr-top-wrapper">
                                <h5 className="title-padding">
                                    {t('ORG_SECTION_VIRTUAL_PRELOAD')}
                                </h5>
                                <hr></hr>
                                <div className="cr-body-content">
                                    <Formik
                                        initialValues={{
                                            apkFileMaxSize: apkFileSize,
                                            maxSlot: maxSlotVirtual,
                                            maxAcceleratedTimeDuration: maxAccTimeDuration
                                        }}
                                        validationSchema={yup.object().shape({
                                            apkFileMaxSize: yup.number().required(`${t('APK_FILE_REQUIRED')}`).min(1, `${t('APK_FILE_SIZE_SHOULD_BE_1KB', { size: 20 })}`).max(256000, `${t('APK_FILE_CANNOT_EXCEED', { size: 256000 })}`),
                                            maxSlot: yup.number().required(`${t('MAX_SLOT_REQUIRED')}`).max(20, `${t('MAX_SLOT_CANNOT_EXCEED', { size: 20 })}`).min(1, `${t('MAX_SLOT_MIMIMUM_SHOULD_ONE')}`),
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
                                                <div className="row">
                                                    <Grid item xs={12} lg={4} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <InputLabel variant="filled">{t('AGENCY_NAME')}</InputLabel>
                                                            <Select
                                                                MenuProps={{
                                                                    anchorOrigin: {
                                                                        vertical: "bottom",
                                                                        horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                        vertical: "top",
                                                                        horizontal: "left"
                                                                    },
                                                                    getContentAnchorEl: null
                                                                }}
                                                                label={`${t('AGENCY_LABEL')}`}
                                                                value={agencyId}
                                                                name="agencyId"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setAgency(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                    modifiedPayload['virtualPayload']['agencyId'] = e.target.value;
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                {agencyList.map((agency) => (
                                                                    <MenuItem key={agency.id} value={agency.id}>{agency.name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                            <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} lg={4} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <InputLabel variant="filled">{t('ADVERTISER_LABEL')}</InputLabel>
                                                            <Select
                                                                MenuProps={{
                                                                    anchorOrigin: {
                                                                        vertical: "bottom",
                                                                        horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                        vertical: "top",
                                                                        horizontal: "left"
                                                                    },
                                                                    getContentAnchorEl: null
                                                                }}
                                                                label={`${t('ADVERTISER_LABEL')}`}
                                                                value={advertiserId}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setAdvertiser(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                    modifiedPayload['virtualPayload']['advertiserId'] = e.target.value;
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                name="advertiserId"
                                                            >
                                                                {advertiserList.map((advertiser) => (
                                                                    <MenuItem key={advertiser.id} value={advertiser.id}>{advertiser.name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                            <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} lg={4} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <InputLabel variant="filled">{t('CLUSTER')}</InputLabel>
                                                            <Select
                                                                MenuProps={{
                                                                    anchorOrigin: {
                                                                        vertical: "bottom",
                                                                        horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                        vertical: "top",
                                                                        horizontal: "left"
                                                                    },
                                                                    getContentAnchorEl: null
                                                                }}
                                                                label={`${t('CLUSTER')}`}
                                                                value={clusterId}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setCluster(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                    modifiedPayload['virtualPayload']['clusterId'] = e.target.value;
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                name="clusterId"
                                                            >
                                                                {clusterList.map((cluster) => (
                                                                    <MenuItem key={cluster.id} value={cluster.id}>{cluster.name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                            <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                                                        </FormControl>
                                                    </Grid>
                                                </div>
                                                <div className="row">

                                                    <Grid item xs={12} lg={4} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <InputLabel variant="filled">{t('CAMPAIGN_CATEGORY')}</InputLabel>
                                                            <Select
                                                                MenuProps={{
                                                                    anchorOrigin: {
                                                                        vertical: "bottom",
                                                                        horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                        vertical: "top",
                                                                        horizontal: "left"
                                                                    },
                                                                    getContentAnchorEl: null
                                                                }}
                                                                label={`${t('CAMPAIGN_CATEGORY')}`}
                                                                value={campaignCategoryid}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setCampignCategory(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                    modifiedPayload['virtualPayload']['campaignCategoryid'] = e.target.value;
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                name="campaignCategoryid"
                                                            >
                                                                {campaignCategoryList.map((camcategory) => (
                                                                    <MenuItem key={camcategory.id} value={camcategory.id}>{camcategory.name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                            <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} lg={4} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <InputLabel variant="filled">{t('CAMPAIGN_OBJECTIVE')}</InputLabel>
                                                            <Select
                                                                MenuProps={{
                                                                    anchorOrigin: {
                                                                        vertical: "bottom",
                                                                        horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                        vertical: "top",
                                                                        horizontal: "left"
                                                                    },
                                                                    getContentAnchorEl: null
                                                                }}
                                                                label={`${t('CAMPAIGN_OBJECTIVE')}`}
                                                                value={campaignObjectiveId}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setCampaingObjective(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                    modifiedPayload['virtualPayload']['campaignObjectiveId'] = e.target.value;
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                name="campaignObjectiveId"
                                                            >
                                                                {campaingObjectiveList.map((camObjective) => (
                                                                    <MenuItem key={camObjective.id} value={camObjective.id}>{camObjective.name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                            <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} lg={4} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <Autocomplete
                                                                multiple
                                                                id="sourcepackage"
                                                                options={[]}
                                                                getOptionLabel={(option) => option}
                                                                defaultValue={sourcePackage || []}
                                                                value={sourcePackage}
                                                                freeSolo
                                                                renderTags={(value, getTagProps) =>
                                                                    value.map((option, index) => (
                                                                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                                                    ))
                                                                }
                                                                onChange={(e, newValue) => {
                                                                    handleChange(e);
                                                                    setSource(newValue);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                    modifiedPayload['virtualPayload']['sourcePackage'] = newValue;
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} variant="outlined" label={t('SOURCE_PACKAGE_LABEL')} placeholder={t('SOURCE_PACKAGE_LABEL')} />
                                                                )}
                                                            />
                                                        </FormControl>
                                                        <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                                                    </Grid>
                                                </div>
                                                <div className="row last-row">
                                                    <Grid item xs={12} lg={4} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <InputLabel variant="filled">{t('DELIVERY_STRATEGY')}</InputLabel>
                                                            <Select
                                                                MenuProps={{
                                                                    anchorOrigin: {
                                                                        vertical: "bottom",
                                                                        horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                        vertical: "top",
                                                                        horizontal: "left"
                                                                    },
                                                                    getContentAnchorEl: null
                                                                }}
                                                                label={`${t('IMEI')}`}
                                                                value={preloadDeliveryStrategyid}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setPreload(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                    modifiedPayload['virtualPayload']['preloadDeliveryStrategyid'] = e.target.value;
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                name="preload"
                                                            >
                                                                {preloadDeliveryStrategyList.map((preloaddel) => (
                                                                    <MenuItem key={preloaddel.id} value={preloaddel.id}>{preloaddel.name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                            <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} lg={4} className="form-row label-width-330">
                                                        <FormControl className="form-select-box">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('MAX_ACCELERATED_TIME')}`}
                                                                placeholder={`${t('MAX_ACCELERATED_TIME')}`}
                                                                label={<div className="label-tooltip">{`${t('MAX_ACCELERATED_TIME')}`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_MAX_ACCELERATED_TIME_DURATION')}</label>}
                                                                    /></div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="maxAcceleratedTimeDuration"
                                                                value={maxAcceleratedTimeDuration}
                                                                // error={Boolean(touched.maxAcceleratedTimeDuration && errors.maxAcceleratedTimeDuration)}
                                                                // helperText={touched.maxAcceleratedTimeDuration && errors.maxAcceleratedTimeDuration}
                                                                // onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setMaxAccTimeDuration(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                    modifiedPayload['virtualPayload']['maxAcceleratedTimeDuration'] = parseInt(e.target.value);
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                type="number" />
                                                            <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} lg={4} >
                                                        <FormControl className="form-select-box">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('APK_FILE_MAX_SIZE')}`}
                                                                placeholder={`${t('APK_FILE_MAX_SIZE')}`}
                                                                label={<div className="label-tooltip">{`${t('APK_FILE_MAX_SIZE')} *`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_APK_FILE_MAX_SIZE')}</label>}
                                                                    /></div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                name="apkFileMaxSize"
                                                                value={apkFileMaxSize}
                                                                error={Boolean(touched.apkFileMaxSize && errors.apkFileMaxSize)}
                                                                helperText={touched.apkFileMaxSize && errors.apkFileMaxSize}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setApkFileSize(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                    modifiedPayload['virtualPayload']['apkFileMaxSize'] = e.target.value;
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                type="number" />
                                                        </FormControl>
                                                    </Grid>

                                                    {/* <Grid item xs={12} lg={4} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <TextField
                                                                variant="outlined"
                                                                aria-describedby={`${t('MAX_SLOT')}`}
                                                                placeholder={`${t('MAX_SLOT')}`}
                                                                label={`${t('MAX_SLOT')} *`}
                                                                InputLabelProps={{ shrink: true }}
                                                                InputProps={{ inputProps: { min: 1, max: 20 } }}
                                                                name="maxSlot"
                                                                value={maxSlot}
                                                                error={Boolean(touched.maxSlot && errors.maxSlot)}
                                                                helperText={touched.maxSlot && errors.maxSlot}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setMaxSlotVirtual(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                    modifiedPayload['virtualPayload']['maxSlot'] = e.target.value;
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                type="number" />
                                                        </FormControl>
                                                    </Grid> */}
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
export default VirtualPreload