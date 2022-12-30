import React, { useState, useContext } from "react";
import * as S from "./ShowLinkedCampaignPopup.style";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { Spinner } from "@dr-one/shared-component";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { useTranslation } from 'react-i18next';
import { GlobalContext } from '../../../context/globalState';
import { Button, Modal, makeStyles } from "@material-ui/core";

function ShowLinkedCampaignPopup(props) {
    const useStyles = makeStyles((theme) => ({
        paper: {

        },
        modal: {
            display: 'flex',
            padding: theme.spacing(1),
            alignItems: 'center',
            justifyContent: 'center',
        }
    }));
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const { t } = useTranslation();
    const { dispatch, state } = useContext(GlobalContext);
    const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
    const orgObject = JSON.parse(localStorage.getItem('dr-user'))?.organizations;
    const organizationIndex = orgObject.findIndex(org => org.id === organizationId);
    const timezone = orgObject[organizationIndex > -1 ? organizationIndex : 0].timeZone;
    const [linkedCampaignList, setLinkedCampaignList] = React.useState([])
    const [showError, toggleError] = useState('');
    const [loader, setLoader] = useState(true)
    const rand = () => {
        return Math.round(Math.random() * 20) - 10;
    }

    const getModalStyle = () => {
        const top = 50 + rand();
        const left = 50 + rand();

        return {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
        };
    }
    const [modalStyle] = React.useState(getModalStyle);

    const handleClose = (action: string, message: string): void => {
        setOpen(false);
        props.handleOpen(false, action, message);
    };
    React.useEffect(() => {
        apiDashboard
            .get(`campaign-mgmt-api/campaigns/survey/${props.rowId}`).then((res) => {
                setLinkedCampaignList(res.data.data)
                setLoader(false)
            }, error => {
                setLinkedCampaignList([])
                console.log(helper.getErrorMessage(error))
                toggleError(helper.getErrorMessage(error));
                setLoader(false)
            })
    }, [props.rowId])
    const body = (
        <S.Container>
            <div className="model-container pop-up-style">
                <div className="modal-header">
                    <h4>{`${t('LINKED_WITH_CAMPAIGN')}`}</h4>
                    <CloseOutlinedIcon className="modal-close" aria-label="close" onClick={(e) => handleClose('cancel', '')} />
                </div>
                <div className="modal-body">
                    <div className="show-loader" >
                        {loader && <Spinner color="blue" />}
                    </div>
                    {linkedCampaignList?.length === 0 ? <p>{showError}</p> : linkedCampaignList?.map((item, index) => {
                        return <ul key={index} className="show-linked-campaign">
                            <li>
                                {index + 1}. {item.name}
                            </li>
                        </ul>
                    })}
                </div>
            </div>
        </S.Container >
    );

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                disableEscapeKeyDown
                className={classes.modal}
                disableBackdropClick
            >
                {body}
            </Modal>
        </div>
    );
}

export default ShowLinkedCampaignPopup;