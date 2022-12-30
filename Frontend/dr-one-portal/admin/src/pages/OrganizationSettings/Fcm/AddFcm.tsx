import React, { useState, useContext } from 'react'
import * as yup from 'yup';
import { Formik, Field } from 'formik';
import { GlobalContext } from '../../../context/globalState';
import { Paper, Button, TextField, Grid } from "@material-ui/core";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { useTranslation } from 'react-i18next';

function AddFcm({ handleClose }) {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(GlobalContext);
    const { srcPkg, fcmDatabaseUrl, fcmApiKey, fcmDataList } = state.orgSetting.fcm
    const [sourcePackage, setSourcePackage] = useState(srcPkg)
    const [dataUrl, setDataUrl] = useState(fcmDatabaseUrl)
    const [api, setApi] = useState(fcmApiKey)
    const handleSubmitFcm = (fcmValue) => {
        const modifiedPayload = Object.assign({}, state.orgSetting)
        modifiedPayload['fcm']['fcmDataList'] = [fcmValue, ...fcmDataList]
        dispatch({
            type: "ADD_NEW_FCM",
            payload: {
                newFcm: modifiedPayload
            }
        })
        handleClose()
    }
    return (
        <div >

            <Paper square elevation={0}>
                <div className="model-header">
                    <h4 className="model-paper-heading" id="transition-modal-title">{t('ADD_FCM')}</h4>
                    <CloseOutlinedIcon className="modal-close" aria-label="close" onClick={handleClose} />

                </div>

                <div>
                    <Formik
                        initialValues={{
                            srcPkg: sourcePackage,
                            fcmDatabaseUrl: dataUrl,
                            fcmApiKey: api
                        }}
                        validationSchema={yup.object().shape({
                            srcPkg: yup.string().required(`${t('SOURCE_PACKAGE_REQUIRED')}`).matches(/^([A-Za-z]{1}[A-Za-z\d_]*\.)*[A-Za-z][A-Za-z\d_]*$/, `${t('MUST_BE_VALID_PACKAGE_NAME')}`),
                            fcmApiKey: yup.string().required(`${t('API_KEY_REQUIRED')}`),
                            fcmDatabaseUrl: yup.string().required(`${t('DATABASE_URL_REQUIRED')}`).matches(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/, `${t('MUST_BE_VALID_URL')}`)
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            handleSubmitFcm(values)
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
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <Grid container className="modal-body">
                                        <div className="row">
                                            <Grid item xs={12} lg={12} className="form-row">
                                                <TextField
                                                    variant="outlined"
                                                    aria-describedby={`${t('SOURCE_PACK_NAME')}`}
                                                    placeholder={`${t('SOURCE_PACK_NAME')}`}
                                                    label={`${t('SOURCE_PACK_NAME')}`}
                                                    InputLabelProps={{ shrink: true }}
                                                    name="srcPkg"
                                                    error={Boolean(touched.srcPkg && errors.srcPkg)}
                                                    helperText={touched.srcPkg && errors.srcPkg}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        const modifiedPayload = Object.assign({}, state.orgSetting)
                                                        modifiedPayload['fcm']['srcPkg'] = e.target.value
                                                        dispatch({
                                                            type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                            payload: {
                                                                orgSetting: modifiedPayload
                                                            }
                                                        })
                                                        setSourcePackage(e.target.value)
                                                    }}
                                                    value={srcPkg}
                                                    type="text"
                                                />
                                            </Grid>

                                            <Grid item xs={12} lg={12} className="form-row">
                                                <TextField
                                                    variant="outlined"
                                                    aria-describedby={`${t('DATABASE_URL')}`}
                                                    placeholder={`${t('DATABASE_URL')}`}
                                                    label={`${t('DATABASE_URL')}`}
                                                    InputLabelProps={{ shrink: true }}
                                                    name="fcmDatabaseUrl"
                                                    error={Boolean(touched.fcmDatabaseUrl && errors.fcmDatabaseUrl)}
                                                    helperText={touched.fcmDatabaseUrl && errors.fcmDatabaseUrl}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        const modifiedPayload = Object.assign({}, state.orgSetting)
                                                        modifiedPayload['fcm']['fcmDatabaseUrl'] = e.target.value
                                                        dispatch({
                                                            type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                            payload: {
                                                                orgSetting: modifiedPayload
                                                            }
                                                        })
                                                        setDataUrl(e.target.value)
                                                    }}
                                                    value={fcmDatabaseUrl}
                                                    type="text" />
                                            </Grid>

                                            <Grid item xs={12} lg={12} className="form-row">
                                                <TextField
                                                    variant="outlined"
                                                    aria-describedby={`${t('API_KEY')}`}
                                                    placeholder={`${t('API_KEY')}`}
                                                    label={`${t('API_KEY')}`}
                                                    InputLabelProps={{ shrink: true }}
                                                    name="fcmApiKey"
                                                    error={Boolean(touched.fcmApiKey && errors.fcmApiKey)}
                                                    helperText={touched.fcmApiKey && errors.fcmApiKey}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        const modifiedPayload = Object.assign({}, state.orgSetting)
                                                        modifiedPayload['fcm']['fcmApiKey'] = e.target.value
                                                        dispatch({
                                                            type: "UPDATE_ORGANIZATION_PAYLOAD",
                                                            payload: {
                                                                orgSetting: modifiedPayload
                                                            }
                                                        })
                                                        setApi(e.target.value)
                                                    }}
                                                    value={fcmApiKey}
                                                    type="text" />
                                            </Grid>
                                        </div>
                                    </Grid>

                                    <div className="model-footer flex-right">

                                        <Button className="button-xs" variant="contained"
                                            color="primary" type="submit" disabled={!isValid}>{t('SAVE_BUTTON')}</Button>


                                    </div>
                                </form>
                            </div>
                        )}
                    </Formik>
                </div>
            </Paper>
        </div>
    )
}
export default AddFcm