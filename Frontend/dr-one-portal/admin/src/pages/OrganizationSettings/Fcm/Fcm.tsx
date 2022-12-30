import React, { useContext } from 'react'
import { Grid, Backdrop, Card, Modal, Fade } from "@material-ui/core"
import * as yup from 'yup';
import { Formik } from 'formik';
import { GlobalContext } from '../../../context/globalState';
import AddFcm from './AddFcm';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { useTranslation } from 'react-i18next';
import { LightTooltip } from "@dr-one/shared-component";
function Fcm() {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(GlobalContext);
    const { fcmDataList } = state.orgSetting.fcm
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const removeFcm = (id: string) => {
        const modifiedPayload = Object.assign({}, state.orgSetting)
        modifiedPayload['fcm']['fcmDataList'].splice(id, 1)
        dispatch({
            type: "REMOVE_FCM",
            payload: {
                removeFcm: modifiedPayload
            }
        })
    }
    return (
        <Grid container>
            <div className="row">
                <Grid item md={12} xs={12}>
                    <div className="cc-form-wrapper">
                        <div className="cr-top-main no-scroll-y">
                            <div className="cr-top-wrapper">
                                <h5 className="title-padding">
                                    <div className="label-tooltip small-tooltip">{`${t('ORG_SECTION_FCM')}`}
                                        <LightTooltip title={<label>{t('TOOLTIP_FCM')}</label>}
                                        /></div>
                                </h5>
                                <hr></hr>
                                <div className="cr-body-content">
                                    <Formik
                                        initialValues={{}}
                                        validationSchema={yup.object().shape({})}
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
                                                    {fcmDataList.length > 0 &&
                                                        fcmDataList.map((fcm, index) => {
                                                            return (
                                                                <Grid item xs={12} lg={4} className="form-row" key={index}>
                                                                    <div className="fcm-col">
                                                                        <CloseOutlinedIcon className="close-col" aria-label="close" onClick={() => removeFcm(index)} />
                                                                        <div className="fcm-row">
                                                                            <p><b>{t('DATABASE_URL')}</b></p>
                                                                            <p>{fcm.srcPkg}</p>
                                                                        </div>
                                                                        <div className="fcm-row">
                                                                            <p><b>{t('SOURCE_PACKAGE_NAME')}</b></p>
                                                                            <p>{fcm.fcmDatabaseUrl}</p>
                                                                        </div>
                                                                    </div>


                                                                </Grid>
                                                            )
                                                        })}
                                                </div>

                                                <div className="row">
                                                    <Grid item xs={6} sm={6}>
                                                        <p className="add-fcm-btn" onClick={handleOpen}><span>+</span> {t('ADD_FCM')}</p>
                                                    </Grid>
                                                </div>

                                                <Modal
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                    open={open}
                                                    onClose={handleClose}
                                                    closeAfterTransition
                                                    BackdropComponent={Backdrop}
                                                    BackdropProps={{
                                                        timeout: 500,
                                                    }}
                                                >
                                                    <Fade in={open}>
                                                        <div className="model-paper">
                                                            <AddFcm handleClose={handleClose} />

                                                        </div>
                                                    </Fade>
                                                </Modal>
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
export default Fcm