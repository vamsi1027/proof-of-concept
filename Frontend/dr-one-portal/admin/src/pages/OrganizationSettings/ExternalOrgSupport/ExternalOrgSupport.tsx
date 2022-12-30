import React, { useContext, useState } from 'react'
import { Card, Grid, TextField, Switch, FormControlLabel, FormControl } from "@material-ui/core"
import * as yup from 'yup';
import { Formik, Field } from 'formik';
import { GlobalContext } from '../../../context/globalState';
import { useTranslation } from 'react-i18next';
import { LightTooltip } from "@dr-one/shared-component";
function ExternalOrgSupport() {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(GlobalContext);
    const { externalIdRequired, orgId } = state.orgSetting.externalOrgSupport
    const [externalEnable, setExternalEnable] = useState(externalIdRequired)
    const [orgIds, setOrgids] = useState(orgId);

    const validExternalOrgSupportSectionComponent = (): boolean => {
        let valid = true
        if (orgId) {
            valid = false
        } else if (!externalIdRequired) {
            valid = externalIdRequired
        }
        else {
            valid = externalIdRequired
        }
        return valid
    }
    React.useEffect(() => {
        setExternalEnable(externalIdRequired)
        setOrgids(orgId)
        const modifiedPayload = Object.assign({}, state.orgSetting)
        modifiedPayload['externalOrgSupport']['isValidExternalOrgSupport'] = validExternalOrgSupportSectionComponent()
        dispatch({
            type: "UPDATE_ORGANIZATION_PAYLOAD",
            payload: {
                orgSetting: modifiedPayload
            }
        })
    }, [validExternalOrgSupportSectionComponent()])
    return (
        <Grid container>
            <div className="row">
                <Grid item md={12} xs={12}>
                    <div className="cc-form-wrapper">
                        <div className="cr-top-main">
                            <div className="cr-top-wrapper">
                                <h5 className="title-padding">
                                    {t('ORG_SECTION_EXTERNAL_ORGANIZATION_SUPPORT')}
                                </h5>
                                <hr></hr>
                                <div className="cr-body-content">
                                    <Formik
                                        initialValues={{
                                            orgId: orgIds
                                        }}
                                        validationSchema={yup.object().shape({
                                            orgId: orgId?.length === 0 && yup.number().required(t('ORG_EXTERNAL_ORGANIZATION_ID_REQUIRED'))
                                        })}
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
                                                    <Grid item xs={6} lg={4} className="form-row">
                                                        <FormControl component="fieldset">
                                                            <label className="MuiFormLabel-root" style={{ fontSize: 12 }}>
                                                                <div className="label-tooltip small-tooltip">{`${t('EXTERNAL_EXT_ORG')}`}
                                                                    <LightTooltip title={<label>{t('TOOLTIP_ENABLE_EXTERNAL_ORG')}</label>}
                                                                    /> </div>
                                                            </label>
                                                            <div className="switchery org-switchery">
                                                                <FormControlLabel
                                                                    value={externalIdRequired}
                                                                    control={<Field
                                                                        label={`${t('ENABLE')}`}
                                                                        name="enable"
                                                                        component={Switch}
                                                                        onChange={(e) => {
                                                                            setExternalEnable(!externalEnable)
                                                                            handleChange(e);
                                                                            const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                            modifiedPayload['externalOrgSupport']['externalIdRequired'] = e.target.checked;
                                                                            dispatch({
                                                                                type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                                payload: {
                                                                                    orgSetting: modifiedPayload
                                                                                }
                                                                            })
                                                                        }}
                                                                        checked={externalIdRequired}
                                                                    />}
                                                                    label={`${t('ENABLE')}`}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={6} lg={8} >
                                                        <TextField
                                                            variant="outlined"
                                                            aria-describedby={`${t('EXTERNAL_ORG_ID')}`}
                                                            placeholder={`${t('EXTERNAL_ORG_ID')}`}
                                                            label={<div className="label-tooltip">{`${t('EXTERNAL_ORG_ID')} ${externalIdRequired ? '*' :''}`}
                                                                <LightTooltip title={<label>{t('TOOLTIP_ENABLE_EXTERNAL_ID')}</label>}
                                                                /></div>}
                                                            InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                                            value={orgId}
                                                            name="orgId"
                                                            disabled={!externalIdRequired}
                                                            InputProps={{ inputProps: { min: 1, max: 10 } }}
                                                            error={externalIdRequired && Boolean(touched.orgId && errors.orgId)}
                                                            helperText={externalIdRequired && touched.orgId && errors.orgId}
                                                            onBlur={externalIdRequired && handleBlur}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                setOrgids(e.target.value);
                                                                const modifiedPayload = Object.assign({}, state.orgSetting);
                                                                modifiedPayload['externalOrgSupport']['orgId'] = e.target.value;
                                                                dispatch({
                                                                    type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                                    payload: {
                                                                        orgSetting: modifiedPayload
                                                                    }
                                                                })
                                                            }}
                                                            type="text" />
                                                       {!externalIdRequired && <p className="optional-msg">{`${t('OPTIONAL')}`}</p>}
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

            </div >
        </Grid >
    )
}
export default ExternalOrgSupport