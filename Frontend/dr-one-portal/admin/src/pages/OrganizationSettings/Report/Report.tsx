
import React, { useContext, useState, useEffect } from 'react'
import { Grid, MenuItem, TextField, FormControlLabel, FormControl, Card, InputLabel, Select, FormLabel, Checkbox, FormGroup } from "@material-ui/core"
import { apiDashboard, helper } from "@dr-one/utils";
import { GlobalContext } from '../../../context/globalState';
import { useTranslation } from 'react-i18next';
import HelpIcon from '@material-ui/icons/Help';
import { LightTooltip } from "@dr-one/shared-component";
import * as yup from 'yup';
import { Formik } from 'formik';
function Report() {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(GlobalContext);
    const { automaticallyEmailReport, emailDistribution, roles } = state.orgSetting.report
    const [autoEmailReport, setAutoEmailReport] = useState(automaticallyEmailReport)
    const [autoEmailReportList, setAutoEmailReportList] = useState([{ name: t('YES'), id: "true" }, { name: t('NO'), id: "false" }])
    const [email, setEmail] = useState(state.orgSetting?.report?.emailDistribution)
    const [reportRoles, setReportRoles] = useState(roles);
    const [rolesList, setRolesList] = useState([]);
    const [reportModifyError, setreportModifyError] = useState('');
    useEffect(() => {
        apiDashboard
            .get('campaign-mgmt-api/roles')
            .then(response => {
                const filterRoles = response.data.roles.filter((role) => role.shortCode !== "PA" && role.shortCode !== "PC")
                setRolesList(response.data.roles.filter((role) => role.shortCode !== "PA" && role.shortCode !== "PC"))
                // setReportRoles(filterRoles);
                // setRolesList(filterRoles)
                // const modifiedPayload = Object.assign({}, state.orgSetting);
                // modifiedPayload['report']['roles'] = filterRoles.map((role) => { return role.id });
                // dispatch({
                //     type: "UPDATE_ORGANIZATION_PAYLOAD",
                //     payload: {
                //         orgSetting: modifiedPayload
                //     }
                // })
                // }
            }, error => {
                // setReportRoles([]);
                setreportModifyError(helper.getErrorMessage(error));
            });
    }, [])

    const [emailListErrorMessage, setEmailListErrorMessage] = useState('')
    const [emailValidFlag, setEmailValidFlag] = useState(false)
    function validateEmailList(e) {
        const emailRegEx = /^[\w._+-]+@[\w.-]+\.[a-zA-Z]{2,}$/
        setEmailListErrorMessage('');
        setEmailValidFlag(false)
        const modifiedPayload = Object.assign({}, state.orgSetting);
        let emils = e.target.value
        let emailList = emils.toString().trim().split(',');
        emailList = emailList.map((email) => email.trim());
        setEmail(emailList)
        modifiedPayload['report']['emailDistribution'] = emailList;
        dispatch({
            type: "UPDATE_ORGANIZATION_PAYLOAD",
            payload: {
                orgSetting: modifiedPayload
            }
        })
        let validFlag = true;
        for (let i = 0; i < emailList.length; i++) {
            if (emailList[i] !== '') {
                if (!emailRegEx.test(emailList[i])) {
                    validFlag = false;
                    setEmailListErrorMessage('Invalid email address');
                    setEmailValidFlag(true)
                }
            }
        }
        return validFlag;
    }
    return (
        <Grid container>
            <div className="row">
                <Grid item md={12} xs={12}>
                    <div className="cc-form-wrapper">
                        <div className="cr-top-main">
                            <div className="cr-top-wrapper">
                                <h5 className="title-padding">
                                    {t('ORG_SECTION_REPORT')}
                                </h5>
                                <hr></hr>
                                <div className="cr-body-content">
                                    {<p className="error">{reportModifyError}</p>}
                                    <Formik
                                        initialValues={{
                                            roles: []
                                        }}
                                        validationSchema={yup.object().shape({

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
                                                    {/* <p>{reportModifyError}</p> */}
                                                    <Grid item xs={12} lg={4} className="form-row">
                                                        <FormControl className="form-select-box">
                                                            <InputLabel variant="filled" style={{ pointerEvents: "auto" }}>
                                                                <div className="label-tooltip">{`${t('AUTO_EMAIL_REPORT')}`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_AUTO_EMAIL_REPORTS')}</label>}
                                                                    /></div>
                                                            </InputLabel>
                                                            <Select
                                                                label="Yes"
                                                                value={automaticallyEmailReport}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setAutoEmailReport(e.target.value);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                    modifiedPayload['report']['automaticallyEmailReport'] = e.target.value;
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                name="automaticallyEmailReport"
                                                            >
                                                                {autoEmailReportList.map((advertiser) => (
                                                                    <MenuItem key={advertiser.id} value={advertiser.id}>{advertiser.name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} lg={5} className="form-row ">
                                                        <FormControl className="form-select-box">
                                                            <TextField
                                                                variant="outlined"
                                                                multiline
                                                                aria-describedby={`${t('EMAIL_DISTRIBUTION')}`}
                                                                placeholder={`${t('EMAIL_DISTRIBUTION')}`}
                                                                label={<div className="label-tooltip">{`${t('EMAIL_DISTRIBUTION')}`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_EMAIL_DISTRIBUTION')}</label>}
                                                                    /></div>}
                                                                InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                                value={emailDistribution}
                                                                error={Boolean(emailValidFlag)}
                                                                helperText={emailListErrorMessage}
                                                                name="email"
                                                                onChange={(e) => {
                                                                    handleChange(e); validateEmailList(e)
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                    modifiedPayload['report']['validEmail'] = Boolean(emailValidFlag);
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                                type="text" />
                                                                <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                                                        </FormControl>
                                                    </Grid>
                                                </div>
                                                <div className="row">
                                                    <Grid item xs={12} lg={12}>
                                                        <FormControl component="fieldset" >
                                                            <FormLabel component="legend" style={{ fontSize: 12 }}>
                                                                <div className="label-tooltip small-tooltip">{`${t('EMAIL_DISTRIBUTION_ROLES')}`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_EMAIL_DISTRIBUTION_ROLES')}</label>}
                                                                    /></div>
                                                            </FormLabel>
                                                            <FormGroup row className="last-row"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    const newRoles = e.target['value']
                                                                    setReportRoles(newRoles);
                                                                    const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                    modifiedPayload['report']['roles'] = roles;
                                                                    dispatch({
                                                                        type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                        payload: {
                                                                            orgSetting: modifiedPayload
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                {rolesList.map((role, index) => (
                                                                    <Grid item xs={4} lg={3} className="form-row" key={index} >
                                                                        <div className="row">
                                                                            <FormControlLabel
                                                                                control={<Checkbox
                                                                                    color='primary'
                                                                                    name="roles" value={role.id} />}
                                                                                label={role.name}
                                                                                checked={state.orgSetting?.report?.roles?.includes(role.id)}
                                                                                onChange={e => {
                                                                                    if (e.target['checked']) {
                                                                                        const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                                        modifiedPayload['report']['roles']?.push(role.id);
                                                                                        dispatch({
                                                                                            type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                                            payload: {
                                                                                                orgSetting: modifiedPayload
                                                                                            }
                                                                                        })
                                                                                    } else {
                                                                                        const idx = state.orgSetting.report.roles.indexOf(role.id);
                                                                                        const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                                        modifiedPayload['report']['roles'].splice(idx, 1)
                                                                                        dispatch({
                                                                                            type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                                            payload: {
                                                                                                orgSetting: modifiedPayload
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }}
                                                                            />

                                                                        </div>
                                                                    </Grid>
                                                                ))
                                                                }
                                                            </FormGroup>
                                                        </FormControl>
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

export default Report
