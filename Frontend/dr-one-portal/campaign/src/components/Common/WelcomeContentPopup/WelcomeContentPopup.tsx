import React, { useState, useEffect, useContext } from "react";
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import BorderColorTwoToneIcon from '@material-ui/icons/BorderColorTwoTone';
import * as S from "./WelcomeContentPopup.style";
import DeleteOutlineTwoToneIcon from '@material-ui/icons/DeleteOutlineTwoTone';
import { apiDashboard, helper } from "@dr-one/utils";
import { ImageContentResponse, VideoContent } from '../../../Campaign.model';
import { Spinner } from "@dr-one/shared-component";
import { GlobalContext } from '../../../context/globalState';
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";
import { useTranslation } from 'react-i18next';

import {
    TextField,
    Button,
    Modal,
    makeStyles,
    InputAdornment
} from "@material-ui/core";

function WelcomeContentPopup(props) {
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
    const { dispatch } = useContext(GlobalContext);
    const { state } = useContext(GlobalContext);
    const [open, setOpen] = React.useState(true);
    const [searchText, setSearchText] = useState('');
    const [contentData, setContentData] = useState<ImageContentResponse>(Object);
    const [contentList, setContentList] = useState([]);
    const [showLoader, toggleLoader] = useState(false);
    const [selectedContent, selectContent] = useState<VideoContent>(Object);
    const [selectedIndex, setSelectionIndex] = useState(null);
    const [contentDeleteError, setContentDeleteError] = useState('');

    const { t } = useTranslation();

    useEffect(() => {
        getContentList(0, 20);
    }, []);

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

    const handleClose = () => {
        setOpen(false);
        props.handleOpen(false);
    };

    const appendList = () => {
        let offset = contentList.length;
        let limit = 20;
        getContentList(offset, limit);
    }

    const getContentList = (offset: number, limit: number, isDelete = false): void => {
        toggleLoader(true);
        apiDashboard.get(props.contentType === 'videocontents' ? `campaign-mgmt-api/videocontents?offset=${offset}&limit=${limit}&videoContentFlag=true` : props.contentType === 'gifcontents' ? `campaign-mgmt-api/videocontents?offset=${offset}&limit=${limit}&videoContentFlag=false`
            : `campaign-mgmt-api/${props.contentType}/?imageContentType=${props.imageContentType}&offset=${offset}&limit=${limit}`).then(res => {
                setContentData(res.data.data);
                setContentList(isDelete ? res.data.data.content : contentList.concat(res.data.data.content));
                toggleLoader(false);
                setContentDeleteError('');
            }, error => {
                setContentData(Object);
                setContentList([]);
                toggleLoader(false);
                console.log(helper.getErrorMessage(error))
            });
    }

    const contentSelect = (item: any, index: number): void => {
        selectContent(item);
        setSelectionIndex(index);
    }

    const searchContent = (): void => {
        if (searchText.trim().length > 0) {
            toggleLoader(true);
            apiDashboard.get(props.contentType === 'videocontents' ? `campaign-mgmt-api/videocontents/?filter=${searchText}&limit=50&videoContentFlag=true` : props.contentType === 'gifcontents' ? `campaign-mgmt-api/videocontents/?filter=${searchText}&limit=50&videoContentFlag=false` : `campaign-mgmt-api/imagecontents/?filter=${searchText}&imageContentType=${props.imageContentType}&limit=50`
            ).then(res => {
                setContentData(res.data.data);
                setContentList((res.data.data.content));
                toggleLoader(false);
            }, error => {
                setContentData(Object);
                setContentList([]);
                toggleLoader(false);
                console.log(helper.getErrorMessage(error));
            });
        } else {
            getContentList(0, 20, true);
        }
    }

    const searchContentOnEnter = (e): void => {
        if (e.key === "Enter") {
            searchContent();
        }
    }

    const deleteContent = (id: string): void => {
        toggleLoader(true);
        apiDashboard.delete((props.contentType === 'videocontents' || props.contentType === 'gifcontents') ? `campaign-mgmt-api/videocontents/${id}` : `campaign-mgmt-api/imagecontents/${id}`).then(res => {
            setContentDeleteError('');
            getContentList(0, 20, true);
            toggleLoader(false);
        }, error => {
            setContentDeleteError(helper.getErrorMessage(error));
            toggleLoader(false);
        });
    }

    async function getFileFromUrl(url: string, name: string, defaultType = 'image/jpeg') {
        const response = await fetch(url);
        const data = await response.blob();
        const file = new File([data], name, {
            type: response.headers.get('content-type') || defaultType,
        });
        const duration = await isGifAnimated(file);
        return duration;
    }

    const isGifAnimated = (file) => {
        return new Promise((resolve, reject) => {
            try {
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);
                fileReader.onload = (event) => {
                    const data: string | ArrayBuffer = fileReader.result;
                    if (typeof data !== 'string') {
                        let arr = new Uint8Array(data);
                        let duration = 0;
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] == 0x21
                                && arr[i + 1] == 0xF9
                                && arr[i + 2] == 0x04
                                && arr[i + 7] == 0x00) {
                                const delay = (arr[i + 5] << 8) | (arr[i + 4] & 0xFF)
                                duration += delay < 2 ? 10 : delay;
                            }
                        }
                        resolve(duration / 100);
                    }
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    const body = (
        <S.Container>
            <div className="model-container pick-image-wrapper">
                <div className="modal-header">
                    <h4 id="simple-modal-title">{t('CREATIVE_CONTENT_POPUP_HEADER')}</h4>
                </div>

                <div className="modal-body">
                    <div className="search-box multi-search">
                        <TextField
                            onChange={(e) => {
                                setSearchText(e.target.value);
                            }}
                            onKeyPress={searchContentOnEnter}
                            value={searchText}
                            type="text"
                            variant="outlined"
                            aria-describedby="desc-search-text"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlinedIcon className="search-icon-magnifier" onClick={searchContent} />
                                    </InputAdornment>
                                )
                            }}
                        />

                    </div>
                    <div className="images-list-wrapper">
                        <p className="added-file-title">{t('CREATIVE_CONTENT_POPUP_SUBHEADER')}</p>
                        {showLoader && <div className="spinner-wrap"><Spinner color={"blue"} /></div>}
                        {contentList.length !== 0 && <ul className={props.imageContentType === 'VIDEO'
                            ? 'video-wrapper' : ''}>
                            {
                                contentList.map((item, index) => {
                                    return (
                                        <li key={index} className={(Object.keys(selectedContent).length !== 0 && selectedIndex === index) ? 'active' : ''} onClick={(e) => contentSelect(item, index)}>
                                            {props.imageContentType !== 'VIDEO' ? <img className="img-uploaded" src={props.contentType === 'imagecontents' ? item.imageUrl : item.videoFileUrl} /> : <video className="video-uploaded" controls controlsList="nodownload nofullscreen noremoteplayback" preload="metadata" disablePictureInPicture>
                                                <source src={item.externalVideoUrl ? item.externalVideoUrl : item.videoFileUrl} type="video/mp4" />
                                            </video>}
                                            <DeleteOutlineTwoToneIcon className={showLoader ? 'delete-icon delete-icon-loading' : 'delete-icon'} onClick={() => deleteContent(item.id)} />
                                            <p>{item.name}</p>
                                        </li>
                                    )
                                })
                            }
                        </ul>}
                        {(!showLoader && contentList.length === 0) && <p className="error-wrap error">{t('CREATIVE_CONTENT_POPUP_LIST_EMPTY')}</p>}
                        <p className="error-wrap error">{contentDeleteError}</p>
                    </div>
                    <div className="load-btn-wrap">
                        {(!contentData?.lastPage || contentList?.length === 0) && <Button onClick={appendList} variant="contained" color="primary" disabled={showLoader}>{t('LOAD_MORE_BUTTON')}</Button>}
                    </div>
                </div>
                <div className="modal-footer align-right cc-global-buttons">
                    <Button variant="outlined" color="primary" className="button-xs" type="button" onClick={(e) => handleClose()}>{t('CANCEL_BUTTON')} </Button>
                    <Button className="button-xs" variant="contained" color="primary" type="submit" disabled={Object.keys(selectedContent).length === 0} startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                        onClick={(e) => {
                            const modifiedPayload = Object.assign({}, state.surveyForm);
                            if (props.section === 'surveywelcomepage') {
                                modifiedPayload['surveyFileUploadSection'] = selectedContent;
                                dispatch({
                                    type: 'MODIFY_SURVEY_PAYLOAD',
                                    payload: {
                                        surveyPayload: modifiedPayload, currentPageName: 'surveywelcomepage',
                                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`]
                                    }
                                })
                            }
                            if (props.section === 'surveylastpage') {
                                modifiedPayload['surveyLastFileUploadSection'] = selectedContent;
                                dispatch({
                                    type: 'MODIFY_SURVEY_PAYLOAD',
                                    payload: {
                                        surveyPayload: modifiedPayload, currentPageName: 'surveylastpage',
                                        surveyBreadCrumbList: ['SURVEY', 'REGISTRATION', `${t('WELCOMEPAGE')}`, `${t('SURVEY_QUESTION_PROGRESS')}`, `${t('LAST_SURVEY_PAGE')}`]
                                    }
                                })
                            }
                            handleClose();
                        }}>{t('SAVE_BUTTON')}</Button>
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

export default WelcomeContentPopup;