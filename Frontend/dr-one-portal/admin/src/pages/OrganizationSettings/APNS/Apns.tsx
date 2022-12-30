import React from 'react'
import { Grid, Backdrop, Card, Modal, Fade } from "@material-ui/core"
import AddAPNS from './AddAPNS';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { useTranslation } from 'react-i18next';
import { LightTooltip } from "@dr-one/shared-component";

function Apns(props) {
    const { t } = useTranslation();
    const { apnsInfo } = props;
    const [open, setOpen] = React.useState(false);
    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (keyType, apnsData): void => {
        setOpen(false);
        if (keyType === 'submit') {
            props.updateApnsData(apnsData);
        }
    };

    const resetAPNS = (): void => {
        props.updateApnsData(null);
    }

    return (
        <Grid container>
            <div className="row">
                <Grid item md={12} xs={12}>
                    <div className="cc-form-wrapper">
                        <div className="cr-top-main no-scroll-y">
                            <div className="cr-top-wrapper">
                                <h5 className="title-padding">
                                    <div className="label-tooltip small-tooltip">{`${t('APNS_CONF')}`}
                                        <LightTooltip title={<label>{t('APNS_HEADER_TOOLTIP')}</label>}
                                        /></div>
                                </h5>
                                <hr></hr>
                                <div className="cr-body-content">
                                    <Grid container>
                                        <div className="row">
                                            {apnsInfo && apnsInfo?.teamId !== null &&

                                                <Grid item xs={12} lg={4} className="form-row">
                                                    <div className="fcm-col">
                                                        <CloseOutlinedIcon className="close-col" aria-label="close" onClick={() => resetAPNS()} />
                                                        <div className="fcm-row">
                                                            <p><b>{t('SHOWTEAM_ID')}</b></p>
                                                            <p>{apnsInfo.teamId}</p>
                                                        </div>
                                                        <div className="fcm-row">
                                                            <p><b>{t('SHOWKEY_ID')}</b></p>
                                                            <p>{apnsInfo.keyId}</p>
                                                        </div>
                                                    </div>
                                                </Grid>
                                            }
                                        </div>
                                        <div className="row">
                                            {apnsInfo === null &&
                                                <Grid item xs={6} sm={6}>
                                                    <p className="add-fcm-btn" onClick={handleOpen}><span>+</span> {t('ADD_APNS')}</p>
                                                </Grid>
                                            }
                                        </div>

                                        <Modal
                                            className="apns-modal"
                                            open={open}
                                            onClose={handleClose}
                                            closeAfterTransition
                                            BackdropComponent={Backdrop}
                                            BackdropProps={{
                                                timeout: 500,
                                            }}
                                            aria-labelledby="simple-modal-title"
                                            aria-describedby="simple-modal-description"
                                            disableEscapeKeyDown
                                            disableBackdropClick
                                        >
                                            <Fade in={open}>
                                                <div className="model-paper">
                                                    <AddAPNS handleClose={handleClose} />
                                                </div>
                                            </Fade>
                                        </Modal>
                                    </Grid>
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
export default Apns