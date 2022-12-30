import React, { useState, useContext } from 'react'
import * as yup from 'yup';
import { Formik } from 'formik';
import { GlobalContext } from '../../../context/globalState';
import { Paper, Button, TextField, Grid } from "@material-ui/core";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { useTranslation } from 'react-i18next';
import FileCopy from "@material-ui/icons/FileCopy";
import Publish from "@material-ui/icons/Publish";

function AddAPNS(props) {
    const { t } = useTranslation();
    const [teamId, setApnsTeamId] = useState('');
    const [keyId, setApnsKeyId] = useState('');
    const [authKey, setApnsAuthKey] = useState('');
    const [authKeyContent, setAuthKeyContent] = useState(null);

    const getFileContent = async (sourceFile: File) => {
        return await sourceFile.text();
    }

    const handleSubmitAPNS = (APNSValue): void => {
        APNSValue['authKey'] = authKeyContent;
        handleClose('submit', APNSValue);
    }

    const handleClose = (type: string, apnsInfo: any): void => {
        props.handleClose(type, apnsInfo);
    };

    return (
        <div>
            <Paper square elevation={0}>
                <div className="model-header">
                    <h4 className="model-paper-heading" id="transition-modal-title">{t('ADD_APNS')}</h4>
                    <CloseOutlinedIcon className="modal-close" aria-label="close" onClick={() => handleClose('cancel', null)} />
                </div>
                <div>
                    <Formik
                        initialValues={{
                            teamId: '',
                            keyId: '',
                            authKey: ''
                        }}
                        validationSchema={yup.object().shape({
                            teamId: yup.string()
                                .required(`${t('APNS_TEAM_REQUIRED_FIELD')}`)
                                .matches(
                                    /^[A-Za-z0-9]+$/,
                                    t('APNS_POP_UP_ID_INVALID_FORMAT_ERROR')
                                ).test(
                                    'len',
                                    t('APNS_POP_UP_ID_LENGTH_ERROR'),
                                    val => val?.length === 10
                                ),
                            keyId: yup.string()
                                .required(`${t('APNS_KEY_ID_REQUIRED_FIELD')}`)
                                .matches(
                                    /^[A-Za-z0-9]+$/,
                                    t('APNS_POP_UP_ID_INVALID_FORMAT_ERROR')
                                ).test(
                                    'len',
                                    t('APNS_POP_UP_ID_LENGTH_ERROR'),
                                    val => val?.length === 10
                                ),
                            authKey: yup.mixed().required('A files is required').test(
                                'fileFormat',
                                t('APNS_POP_UP_FILE_INVALID_FORMAT_ERROR'),
                                (value) => {
                                    return value?.split('.').pop() === 'p8';
                                }
                            )
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            values['teamId'] = values['teamId'].toUpperCase();
                            values['keyId'] = values['keyId'].toUpperCase();
                            handleSubmitAPNS(values);
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
                                                    aria-describedby={`${t('APNS_TEAM_PLACEHOLDER')}`}
                                                    placeholder={`${t('APNS_TEAM_PLACEHOLDER')}`}
                                                    label={`${t('APNS_TEAM_ID')} *`}
                                                    InputLabelProps={{ shrink: true }}
                                                    name="teamId"
                                                    error={Boolean(touched.teamId && errors.teamId)}
                                                    helperText={touched.teamId && errors.teamId}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setApnsTeamId(e.target.value)
                                                    }}
                                                    value={teamId}
                                                    type="text"
                                                />
                                            </Grid>

                                            <Grid item xs={12} lg={12} className="form-row">
                                                <TextField
                                                    variant="outlined"
                                                    aria-describedby={`${t('APNS_KEY_ID')}`}
                                                    placeholder={`${t('APNS_KEY_PLACEHOLDER')}`}
                                                    label={`${t('APNS_KEY_ID')} *`}
                                                    InputLabelProps={{ shrink: true }}
                                                    name="keyId"
                                                    error={Boolean(touched.keyId && errors.keyId)}
                                                    helperText={touched.keyId && errors.keyId}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setApnsKeyId(e.target.value)
                                                    }}
                                                    value={keyId}
                                                    type="text" />
                                            </Grid>
                                            <Grid item xs={12} lg={12} className="form-row">
                                                <div className="cr-body-content">
                                                    <div className="file-input-field">
                                                        <p className="label">{`${t('APNS_KEY')} *`}</p>
                                                        <input
                                                            type="file"
                                                            name="authKey"
                                                            id='authKey'
                                                            placeholder={t('APNS_KEY')}
                                                            onChange={async (e) => {
                                                                handleChange(e);
                                                                setAuthKeyContent(null);
                                                                setApnsAuthKey('');
                                                                if (e?.target?.files?.length !== 0) {
                                                                    setApnsAuthKey(e.target.files[0].name);
                                                                    setAuthKeyContent(await getFileContent(e.target.files[0]));
                                                                } 
                                                            }}
                                                            accept=".p8"
                                                            style={{ cursor: "pointer" }}
                                                            onBlur={handleBlur}
                                                        />
                                                        <span>{t('UPLOAD_FILES')} <Publish /></span>
                                                        <p className="file-name">
                                                            <FileCopy /> {authKey.length > 0 ? authKey : `${t('APNS_KEY_FILE_PLACEHOLDER')}`}
                                                        </p>
                                                    </div>
                                                    {touched.authKey && <p className='error' >{errors?.authKey}</p>}
                                                </div>
                                            </Grid>
                                        </div>
                                    </Grid>
                                    <div className="model-footer flex-right">
                                        <Button className="button-xs" disabled={!isValid} variant="contained" color="primary" type="submit">{t('SAVE_BUTTON')}</Button>
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
export default AddAPNS