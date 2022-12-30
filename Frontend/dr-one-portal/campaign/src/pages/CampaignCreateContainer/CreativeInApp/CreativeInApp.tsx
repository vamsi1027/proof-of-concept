import { useState, useEffect, useContext } from "react";
import * as S from "./CreativeInApp.styles";
import {
  Button,
  TextField,
  Tab,
  Tabs,
  Typography,
  Box,
  AppBar,
  Switch,
  Grid,
  FormControlLabel,
  RadioGroup,
  Radio
} from "@material-ui/core";
import { GlobalContext } from '../../../context/globalState';
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";
import * as yup from 'yup';
import { Formik } from 'formik';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { MobilePreview, SnackBarMessage } from "@dr-one/shared-component";
import ContentPopup from "../../../components/Common/ContentPopup/ContentPopup";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';

function CreativeInApp() {
  const urlRegex = /^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  const userData = JSON.parse(localStorage.getItem('dr-user'));
  const iuUserIndex = userData.organizations.findIndex(orgDetail => orgDetail.id === userData.organizationActive);
  const isIUUser = iuUserIndex > -1 ? userData.organizations[iuUserIndex].legacy : false;
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const [tabValueImage, setTabValueImage] = useState(0);
  const [tabValueVideo, setTabValueVideo] = useState(0);
  const [tabValueSlider, setTabValueSlider] = useState(0);
  const [buttonPersonalizationOptionsInApp, setButtonPersonalizationOptionsInApp] = useState(isIUUser ? false : state.formValues.creative.buttonPersonalizationOptionsInApp);

  const [deepLinksRatingStars, setDeepLinksRatingStars] = useState(state.formValues.creative.deepLinksRatingStars);
  const [sliderImageList, setSliderImageList] = useState(state.formValues.creative.sliderImageList);
  const [isDisableContinueButton, toggleContinueButton] = useState(Object.values(state.formValues.creative.creativeSectionObjectiveFieldError).every(item => item === '') ? false : true);
  const [isShowContentPopup, toggleContentPopup] = useState(false);
  const [fullImageUrlError, setFullImageUrlError] = useState('');
  const [mainImageUrlError, setMainImageUrlError] = useState('');
  const [videoUrlError, setVideoUrlError] = useState('');
  const [fileNameMain, setFileNameMain] = useState('');
  const [fileUploadErrorMain, setFileUploadErrorMain] = useState('');
  const [fileNameFull, setFileNameFull] = useState('');
  const [fileUploadErrorFull, setFileUploadErrorFull] = useState('');
  const [fileNameVideo, setFileNameVideo] = useState('');
  const [fileUploadErrorVideo, setFileUploadErrorVideo] = useState('');
  const [fileNameSlider, setFileNameSlider] = useState('');
  const [fileUploadErrorSlider, setFileUploadErrorSlider] = useState('');
  const [snackbarMessageSuccess, setSnackbarMessageSuccess] = useState(false);
  const [snackbarMessageValue, setSnackbarMessageValue] = useState('');
  const [creativeInAppSectionError, setCreativeInAppSectionError] = useState({ buttonListError: false, deepLinkError: false });
  const [objectiveFieldError, setObjectiveFieldError] = useState(state.formValues.creative.creativeSectionObjectiveFieldError);
  const [packageNameToOpenApp, setPackageNameToOpenApp] = useState(state.formValues.registration.packageNameToOpenApp);
  const [goToWeb, setGoToWeb] = useState(state.formValues.registration.goToWeb);
  const [packageNameToInstallApp, setPackageNameToInstallApp] = useState(state.formValues.registration.packageNameToInstallApp);
  const [packageName, setPackageName] = useState(state.formValues.registration.packageName);
  const [phoneToCall, setPhoneToCall] = useState(state.formValues.registration.phoneToCall);
  const [actionInTheApp, setActionInTheApp] = useState(state.formValues.registration.actionInTheApp);
  const { t } = useTranslation();
  const [gifDuration, setGifDuration] = useState(state.formValues.creative.gifDuration)
  const [buttonList, setButtonList] = useState(state.formValues.creative.buttonsInApp.map(buttonElem => {
    buttonElem.buttonTextError = t(`${buttonElem.buttonTextError}`);
    buttonElem.ctaLinkError = t(`${buttonElem.ctaLinkError}`);
    return buttonElem;
  }));
  const [urlProtocolWarning, setUrlProtocolWarning] = useState('');
  const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;

  useEffect(() => {
    const modifiedPayload = Object.assign({}, state.formValues);
    if (state.formValues.template.primaryTemplateType === 'fullPage' ||
      state.formValues.template.primaryTemplateType === 'popup' ||
      state.formValues.template.primaryTemplateType === 'bottomBanner' ||
      state.formValues.template.primaryTemplateType === 'topBanner' ||
      state.formValues.template.secondaryTemplateType === 'fullPage' ||
      state.formValues.template.secondaryTemplateType === 'popup' ||
      state.formValues.template.secondaryTemplateType === 'bottomBanner' ||
      state.formValues.template.secondaryTemplateType === 'topBanner'
    ) {
      modifiedPayload['creative']['sequenceArray'] = [...state.formValues.creative.sequenceArrayFullPagePopUpTopBottomBanner];
    } else if (state.formValues.template.primaryTemplateType === 'fullPageWithVideo'
      || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo' ||
      state.formValues.template.primaryTemplateType === 'popupWithVideo' ||
      state.formValues.template.secondaryTemplateType === 'popupWithVideo') {
      modifiedPayload['creative']['sequenceArray'] = [...state.formValues.creative.sequenceArrayFullPageVideo];
    }
    updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
    if (state.formValues.registration.campaignType === 'inApp') {
      apiDashboard.get(`campaign-mgmt-api/organizations/${organizationId}`).then(res => {
        dispatch({
          type: CAMPAIGN_ACTIONS.GET_ORG_DETAILS,
          payload: res.data.data
        })
      }, error => {
        dispatch({
          type: CAMPAIGN_ACTIONS.GET_ORG_DETAILS_FAILURE,
          payload: {}
        })
      });
    }
    if (window.location.pathname.indexOf('edit') >= 0 && Object.keys(state.formValues.creative.gifImageContent).length !== 0) {
      const modifiedPayload = Object.assign({}, state.formValues);
      getFileFromUrlForGif(state.formValues.creative.gifImageContent.videoFileUrl, String(new Date().getTime()) + '.gif').then(res => {
        modifiedPayload['creative']['gifDuration'] = res;
        dispatch({
          type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
          payload: {
            campaignPayload: modifiedPayload, currentPageName: state.currentSectionName,
            campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE'],
            campaignStepsArray: state.campaignStepsArray
          }
        })
      });
    }
  }, []);

  useEffect(() => {
    if (state.formValues.creative.gifDuration !== 0) {
      setGifDuration(state.formValues.creative.gifDuration);
    }
  }, [state.formValues]);


  const handleChangeTabImage = (event: any, newValue: number): void => {
    setTabValueImage(newValue);
    if (newValue === 1) {
      toggleContentPopup(isShowContentPopup => !isShowContentPopup);
    }
  }

  const handleChangeTabVideo = (event: any, newValue: number): void => {
    setTabValueVideo(newValue);
    if (newValue === 1 || newValue === 2) {
      toggleContentPopup(isShowContentPopup => !isShowContentPopup);
    }
  }

  const handleChangeTabSlider = (newValue: number): void => {
    setTabValueSlider(newValue);
    if (newValue === 2) {
      toggleContentPopup(isShowContentPopup => !isShowContentPopup);
    }
  }

  const a11yProps = (index: number): any => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const TabPanel = (props: any): any => {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {
          value === index && (
            <Box p={3}>
              <Typography>{children}</Typography>
            </Box>)
        }
      </Typography>
    );
  }

  const handleChangeButtonPersonalizationOptionsInApp = (e: any): void => {
    setButtonPersonalizationOptionsInApp(e.target.checked);
    const modifiedButtonList = [...buttonList];
    const arrayHasError = modifiedButtonList.some((val, i) => (val.isCtaLinkError === true || val.isButtonTextError === true));
    if (!e.target.checked) {
      disableContinueButton('buttonListError', false);
    } else {
      if (arrayHasError) {
        disableContinueButton('buttonListError', true);
      } else {
        disableContinueButton('buttonListError', false);
      }
    }
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload['creative']['buttonPersonalizationOptionsInApp'] = e.target.checked;
    updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
  }

  const handleChangeDeepLinksRatingStars = (e: any): void => {
    setDeepLinksRatingStars(e.target.checked);
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload['creative']['deepLinksRatingStars'] = e.target.checked;
    updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
  }

  const updateCreativeSectionPayload = (payload: any, section: string, isTriggerMixpanelEvent): void => {
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
      payload: {
        campaignPayload: payload, currentPageName: section,
        campaignBreadCrumbList: (section === 'template' || section === 'secondaryTemplate') ? ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE'] :
          (section === 'creative' || section === 'secondaryCreative') ? ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE'] : section === 'survey' ? ['CAMPAIGN_MANAGEMENT',
            'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SURVEY'] : ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS'],
        campaignStepsArray: state.campaignStepsArray
      }
    })

    if (isTriggerMixpanelEvent) {
      switch (section) {
        case 'creative':
          Mixpanel.track("Create Campaign Page View", { "page": "Creative - Push" });
          break;
        case 'settings':
          Mixpanel.track("Create Campaign Page View", { "page": "Settings" });
          break;
        case 'survey':
          Mixpanel.track("Create Campaign Page View", { "page": "Survey" });
          break;
        case 'template':
          Mixpanel.track("Create Campaign Page View", { "page": "Template - In App" });
          break;
      }
    }
  }

  const updateButtonListArray = (type: string, indexValue: number): void => {
    const modifiedButtonList = [...buttonList];
    if (type === 'add') {
      modifiedButtonList.push({
        buttonText: '', ctaLink: '', buttonTextError: t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR'), isButtonTextError: true,
        ctaLinkError: t('CREATIVE_LINK_REQUIRED_ERROR'), isCtaLinkError: true
      });
    } else {
      modifiedButtonList.splice(indexValue, 1);
      if (modifiedButtonList.length === 0 && buttonPersonalizationOptionsInApp) {
        disableContinueButton('buttonListError', true);
      } else {
        disableContinueButton('buttonListError', false);
      }
    }
    setButtonList(modifiedButtonList);
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload['creative']['buttonsInApp'] = modifiedButtonList;
    updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
  }

  const updateButtonListField = (fieldValue: string, indexValue: number, fieldType: string, isBlur: boolean = false): void => {
    const modifiedButtonList = [...buttonList];
    modifiedButtonList[indexValue][fieldType] = fieldValue;
    if (fieldType === 'buttonText') {
      modifiedButtonList[indexValue]['buttonTextCharRemaining'] = 20 - fieldValue.length;
    }

    if (fieldType === 'ctaLink') {
      let ctaLinkValue = fieldValue;
      if (isBlur) {
        if (fieldValue.indexOf('https') === -1 && fieldValue.indexOf('http') === -1) {
          ctaLinkValue = 'http://' + fieldValue;
          modifiedButtonList[indexValue][fieldType] = ctaLinkValue;
        }
      }
      if (ctaLinkValue.length === 0) {
        modifiedButtonList[indexValue]['ctaLinkError'] = t('CREATIVE_LINK_REQUIRED_ERROR');;
        modifiedButtonList[indexValue]['isCtaLinkError'] = true;
      } else if (!urlRegex.test(ctaLinkValue)) {
        modifiedButtonList[indexValue]['ctaLinkError'] = t('CREATIVE_LINK_INVALID_ERROR');
        modifiedButtonList[indexValue]['isCtaLinkError'] = true;
      } else {
        modifiedButtonList[indexValue]['ctaLinkError'] = '';
        modifiedButtonList[indexValue]['isCtaLinkError'] = false;
      }
    } else {
      if (fieldValue.length === 0) {
        modifiedButtonList[indexValue]['buttonTextError'] = t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR');
        modifiedButtonList[indexValue]['isButtonTextError'] = true;
      } else {
        if (fieldValue.length > 20) {
          modifiedButtonList[indexValue]['buttonTextError'] = t('CREATIVE_CTA_TEXT_MAX_LENGTH_ERROR');
          modifiedButtonList[indexValue]['isButtonTextError'] = true;
        } else {
          if (!/^[^.\s]/.test(fieldValue)) {
            modifiedButtonList[indexValue]['buttonTextError'] = t('CREATIVE_BUTTON_TEXT_INVALID_ERROR');
            modifiedButtonList[indexValue]['isButtonTextError'] = true;
          } else {
            modifiedButtonList[indexValue]['buttonTextError'] = '';
            modifiedButtonList[indexValue]['isButtonTextError'] = false;
          }
        }
      }
    }
    setButtonList(modifiedButtonList);
    const arrayHasError = modifiedButtonList.some((val, i) => (val.isCtaLinkError === true || val.isButtonTextError === true));
    if (!buttonPersonalizationOptionsInApp || !arrayHasError) {
      disableContinueButton('buttonListError', false);
    } else {
      disableContinueButton('buttonListError', true);
    }
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload['creative']['buttonsInApp'] = modifiedButtonList;
    updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
  }

  const updateSliderImageListArray = (type: string, indexValue: number): void => {
    const modifiedSliderImageList = [...sliderImageList];
    if (type === 'add') {
      modifiedSliderImageList.push({
        imageUrl: '', imageUrlError: 'Image URL is required', isImageUrlError: true
      });
    } else {
      modifiedSliderImageList.splice(indexValue, 1);
      if (modifiedSliderImageList.length === 0) {
        toggleContinueButton(true);
      } else {
        toggleContinueButton(false);
      }
    }
    setSliderImageList(modifiedSliderImageList);
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload['creative']['sliderImageList'] = modifiedSliderImageList;
    updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
  }

  const updateSliderImageListField = (fieldValue: string, indexValue: number): void => {
    const modifiedSliderImageList = [...sliderImageList];
    modifiedSliderImageList[indexValue]['imageUrl'] = fieldValue;

    if (fieldValue.length === 0) {
      modifiedSliderImageList[indexValue]['imageUrlError'] = 'Image URL is required';
      modifiedSliderImageList[indexValue]['isImageUrlError'] = true;
    } else if (!urlRegex.test(fieldValue)) {
      modifiedSliderImageList[indexValue]['imageUrlError'] = 'Image URL is not valid';
      modifiedSliderImageList[indexValue]['isImageUrlError'] = true;
    } else {
      modifiedSliderImageList[indexValue]['imageUrlError'] = '';
      modifiedSliderImageList[indexValue]['isImageUrlError'] = false;
    }

    setSliderImageList(modifiedSliderImageList);
    const arrayHasError = modifiedSliderImageList.some((val, i) => val.isImageUrlError === true);
    if (!arrayHasError) {
      toggleContinueButton(false);
    } else {
      toggleContinueButton(true);
    }
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload['creative']['sliderImageList'] = modifiedSliderImageList;
    updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
  }

  const modifyTemplateType = (template: string): string => {
    if (template === 'fullPage') {
      return 'FULL';
    } else if (template === 'fullPageWithVideo') {
      return 'FULL-VIDEO';
    } else if (template === 'popup') {
      return 'BANNER';
    } else if (template === 'popupWithVideo') {
      return 'BANNER-VIDEO';
    } else if (template === 'rating') {
      return 'RATING';
    } else if (template === 'slider') {
      return 'SLIDER';
    } else if (template === 'bottomBanner') {
      return 'BOTTOM-BANNER';
    } else if (template === 'topBanner') {
      return 'TOP-BANNER';
    }
  }

  const modifyCampaignType = (campaignType: string): string => {
    if (campaignType === 'push') {
      return 'PUSH';
    } else if (campaignType === 'inApp' || campaignType === 'pushInApp') {
      return 'IN-APP';
    }
  }

  const modifyButtonList = (buttonList: Array<any>): Array<any> => {
    const buttonArray = [];
    buttonList.forEach((buttonEle) => {
      buttonArray.push(buttonEle.buttonText)
    })
    return buttonArray;
  }

  const handleOpenModal = (value: boolean): void => {
    toggleContentPopup(value);
    setTabValueImage(0);
    setTabValueVideo(0);
    setTabValueSlider(0);
  }

  const isContentUrlValidityCheck = (value: string, imageType: string): void => {
    if (value.length === 0) {
      imageType === 'MAIN' ? setMainImageUrlError(t('CREATIVE_INAPP_IMAGE_URL_REQUIRED_ERROR')) : imageType === 'FULL' ? setFullImageUrlError(t('CREATIVE_INAPP_IMAGE_URL_REQUIRED_ERROR')) : setVideoUrlError(t('CREATIVE_INAPP_VIDEO_URL_REQUIRED_ERROR'));
    } else if (!urlRegex.test(value)) {
      imageType === 'MAIN' ? setMainImageUrlError(t('CREATIVE_INAPP_IMAGE_URL_INVALID_ERROR')) : imageType === 'FULL' ? setFullImageUrlError(t('CREATIVE_INAPP_IMAGE_URL_INVALID_ERROR')) : setVideoUrlError(t('CREATIVE_INAPP_VIDEO_URL_INVALID_ERROR'));
    } else {
      imageType === 'MAIN' ? setMainImageUrlError('') : imageType === 'FULL' ? setFullImageUrlError('') : setVideoUrlError('');
      if (imageType !== 'VIDEO') {
        getFileFromUrl(value, (imageType === 'MAIN' || imageType === 'FULL') ? String(new Date().getTime()) + '.jpeg'
          : String(new Date().getTime()) + '.mp4').then(res => {
            setContentValidation(res, (imageType === 'MAIN' || imageType === 'FULL') ? String(new Date().getTime()) + '.jpeg'
              : String(new Date().getTime()) + '.mp4', imageType);
          });
      } else {
        if (value.split(/[#?]/)[0].split('.').pop().trim() === 'gif') {
          getFileFromUrl(value, String(new Date().getTime()) + '.gif').then(res => {
            setContentValidation(res, String(new Date().getTime()) + '.gif', imageType);
          });
        } else {
          const contentPayload = {
            name: String(new Date().getTime()),
            organizationId: JSON.parse(localStorage.getItem('dr-user'))?.organizationActive,
            videoContentHostingType: 'EXTERNAL',
            gifFileId: null,
            videoContentFlag: true,
            externalVideoUrl: value
          }
          apiDashboard.post('campaign-mgmt-api/videocontents', contentPayload).then(res => {
            setFileUploadErrorVideo('');
            const modifiedPayload = Object.assign({}, state.formValues);
            modifiedPayload['creative']['videoContent'] = res.data.data;
            updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
          }, error => {
            setFileUploadErrorVideo(helper.getErrorMessage(error));
          });
        }

      }
    }
  }

  async function getFileFromUrl(url: string, name: string, defaultType = 'image/jpeg') {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], name, {
      type: response.headers.get('content-type') || defaultType,
    });
  }

  const setChosenFileName = (event: any, imageType: string): void => {
    if (imageType === 'FULL') {
      setFileNameFull(event.target.files[0].name);
    } else if (imageType === 'MAIN') {
      setFileNameMain(event.target.files[0].name);
    } else {
      setFileNameVideo(event.target.files[0].name);
    }
    imageType === 'FULL' ? setFileUploadErrorFull('') : imageType === 'MAIN' ? setFileUploadErrorMain('') : setFileUploadErrorVideo('');
    setContentValidation(event.target.files[0], event.target.files[0].name, imageType);
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

  async function setContentValidation(file: any, fileName: string, imageType: string) {
    let maxAllowedContentSize;
    let duration;
    const allowedImageType = ['jpg', 'jpeg', 'png'];
    const allowedVideoType = ['mp4', '3gp', '3gpp', 'gif'];

    if (imageType === 'MAIN') {
      maxAllowedContentSize = parseInt(state.orgDetails.mainImageSize ? state.orgDetails.mainImageSize : 300, helper.radix) * 1000;
    } else if (imageType === 'FULL') {
      maxAllowedContentSize = parseInt(state.orgDetails.fsImageSize ? state.orgDetails.fsImageSize : 500, helper.radix) * 1000;
    } else if (imageType === 'VIDEO') {
      if (fileName.split('.').pop() === 'gif') {
        maxAllowedContentSize = parseInt(state.orgDetails.gifImageSize ? state.orgDetails.gifImageSize : 4000, helper.radix) * 1000;
        duration = await isGifAnimated(file);
        setGifDuration(duration);
      } else {
        maxAllowedContentSize = parseInt(state.orgDetails.videoImageSize ? state.orgDetails.videoImageSize : 4000, helper.radix) * 1000;
      }
    }
    if ((imageType === 'VIDEO' && allowedVideoType.indexOf(fileName.split('.').pop()) === -1) ||
      (imageType === 'FULL' || imageType === 'MAIN') && allowedImageType.indexOf(fileName.split('.').pop()) === -1) {
      imageType === 'MAIN' ? setFileUploadErrorMain(t('CREATIVE_INVALID_IMAGE_FORMAT_ERROR'))
        : imageType === 'FULL' ? setFileUploadErrorFull(t('CREATIVE_INVALID_IMAGE_FORMAT_ERROR')) :
          setFileUploadErrorVideo(fileName.split('.').pop() === 'gif' ? t('CREATIVE_INAPP_INVALID_GIF_FORMAT_ERROR') : t('CREATIVE_INAPP_INVALID_VIDEO_FORMAT_ERROR'));
    } else {
      if (file.size <= maxAllowedContentSize) {
        if (fileName.trim().length > 2) {
          if (fileName.split('.').pop() === 'gif') {
            if (duration < 1) {
              setFileUploadErrorVideo(t('CREATIVE_GIF_IMAGE_DURATION_ERROR'));
            } else {
              apiDashboard.get(imageType === 'VIDEO' ? `campaign-mgmt-api/videocontents/name?name=${fileName.trim()}&videoContentFlag=false` : 'campaign-mgmt-api/imagecontents/name?name=' + fileName.trim() + '&imageContentType=' + imageType).then(res => {
                if (res.data.message === 'false') {
                  imageType === 'MAIN' ? setFileUploadErrorMain('') : imageType === 'FULL' ? setFileNameFull('') : setFileUploadErrorVideo('');
                  fileUpload(file, fileName, imageType, duration);
                } else {
                  imageType === 'MAIN' ? setFileUploadErrorMain(t('CREATIVE_IMAGE_DUPLICATE_NAME_ERROR'))
                    : imageType === 'FULL' ? setFileUploadErrorFull(t('CREATIVE_IMAGE_DUPLICATE_NAME_ERROR')) :
                      setFileUploadErrorVideo(t('CREATIVE_INAPP_VIDEO_DUPLICATE_NAME_ERROR'));
                }
              }, error => {
                imageType === 'MAIN' ? setFileUploadErrorMain(helper.getErrorMessage(error)) :
                  imageType === 'FULL' ? setFileUploadErrorFull(helper.getErrorMessage(error)) : setFileUploadErrorVideo(helper.getErrorMessage(error));
              });
              setFileUploadErrorVideo('');
            }
          } else {
            apiDashboard.get(imageType === 'VIDEO' ? `campaign-mgmt-api/videocontents/name?name=${fileName.trim()}&videoContentFlag=true` : 'campaign-mgmt-api/imagecontents/name?name=' + fileName.trim() + '&imageContentType=' + imageType).then(res => {
              if (res.data.message === 'false') {
                imageType === 'MAIN' ? setFileUploadErrorMain('') : imageType === 'FULL' ? setFileNameFull('') : setFileUploadErrorVideo('');
                fileUpload(file, fileName, imageType, 0);
              } else {
                imageType === 'MAIN' ? setFileUploadErrorMain(t('CREATIVE_IMAGE_DUPLICATE_NAME_ERROR'))
                  : imageType === 'FULL' ? setFileUploadErrorFull(t('CREATIVE_IMAGE_DUPLICATE_NAME_ERROR')) :
                    setFileUploadErrorVideo(t('CREATIVE_INAPP_VIDEO_DUPLICATE_NAME_ERROR'));
              }
            }, error => {
              imageType === 'MAIN' ? setFileUploadErrorMain(helper.getErrorMessage(error)) :
                imageType === 'FULL' ? setFileUploadErrorFull(helper.getErrorMessage(error)) : setFileUploadErrorVideo(helper.getErrorMessage(error));
            });
          }

        } else {
          imageType === 'MAIN' ? setFileUploadErrorMain(t('CREATIVE_IMAGE_FILE_NAME_MIN_LENGTH_ERROR')) :
            imageType === 'FULL' ? setFileUploadErrorFull(t('CREATIVE_IMAGE_FILE_NAME_MIN_LENGTH_ERROR')) : setFileUploadErrorVideo(t('CREATIVE_IMAGE_FILE_NAME_MIN_LENGTH_ERROR'));
        }
      } else {
        imageType === 'MAIN' ? setFileUploadErrorMain(`${t('CREATIVE_IMAGE_FILE_SIZE_MAX_ERROR')} ${maxAllowedContentSize / 1000} kb for ${imageType}`) :
          imageType === 'FULL' ? setFileUploadErrorFull(`${t('CREATIVE_IMAGE_FILE_SIZE_MAX_ERROR')} ${maxAllowedContentSize / 1000} kb for ${imageType}`) : setFileUploadErrorVideo(`${fileName.split('.').pop() === 'gif' ? t('CREATIVE_IMAGE_FILE_SIZE_MAX_ERROR') : t('CREATIVE_INAPP_VIDEO_FILE_SIZE_MAX_ERROR')} ${maxAllowedContentSize / 1000} kb for ${fileName.split('.').pop() === 'gif' ? 'GIF' : imageType}`);
      }
    }
  }

  const fileUpload = (file: any, fileName: string, contentType: string, gifDuration: number): void => {
    const formData: FormData = new FormData();
    let contentPayload;
    if (contentType === 'VIDEO') {
      formData.append('file', file, fileName);
      formData.append('type', file.type);
    } else {
      formData.append('file', file, fileName);
      formData.append('type', contentType);
      formData.append('imageContentType', contentType);
    }
    const headers = new Headers({ "Content-Type-2": 'multipart/form-data' });
    apiDashboard.post('files/upload', formData, headers).then(res => {
      contentType === 'MAIN' ? setFileUploadErrorMain('') : contentType === 'FULL' ? setFileUploadErrorFull('') : setFileUploadErrorVideo('');

      if (contentType === 'VIDEO') {
        contentPayload = {
          videoFileId: fileName.split('.').pop() === 'gif' ? null : res.data.data.id,
          videoFileUrl: res.data.data.url,
          name: fileName,
          organizationId: res.data.data.organizationId,
          userId: res.data.data.userId,
          videoContentHostingType: 'IU',
          gifFileId: fileName.split('.').pop() === 'gif' ? res.data.data.id : null,
          dimensions: res.data.data.dimensions,
          createdDate: res.data.data.createdDate,
          videoContentFlag: fileName.split('.').pop() === 'gif' ? false : true
        }
        apiDashboard.post('campaign-mgmt-api/videocontents', contentPayload).then(res => {
          setFileUploadErrorVideo('');
          const modifiedPayload = Object.assign({}, state.formValues);
          modifiedPayload['creative'][fileName.split('.').pop() === 'gif' ? 'gifImageContent' : 'videoContent'] = res.data.data;
          modifiedPayload['creative'][fileName.split('.').pop() === 'gif' ? 'videoContent' : 'gifImageContent'] = {};
          modifiedPayload['creative']['gifDuration'] = fileName.split('.').pop() === 'gif' ? gifDuration : 0;
          updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
          setSnackbarMessageSuccess(true);
          setSnackbarMessageValue(res.data.message);
        }, error => {
          setFileUploadErrorVideo(helper.getErrorMessage(error));
        });
      } else {
        contentPayload = {
          imageFileId: res.data.data.id,
          imageUrl: res.data.data.url,
          name: fileName,
          organizationId: res.data.data.organizationId,
          userId: res.data.data.userId,
          imageContentType: contentType
        }
        apiDashboard.post('campaign-mgmt-api/imagecontents', contentPayload).then(res => {
          contentType === 'MAIN' ? setFileUploadErrorMain('') : setFileUploadErrorFull('');
          const modifiedPayload = Object.assign({}, state.formValues);
          modifiedPayload['creative'][contentType === 'MAIN' ? 'mainImageContent' : 'fullImageContent'] = res.data.data;
          updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
          setSnackbarMessageSuccess(true);
          setSnackbarMessageValue(res.data.message);
        }, error => {
          contentType === 'MAIN' ? setFileUploadErrorMain(helper.getErrorMessage(error)) : setFileUploadErrorFull(helper.getErrorMessage(error));
        });
      }
    }, error => {
      contentType === 'MAIN' ? setFileUploadErrorMain(helper.getErrorMessage(error)) : contentType === 'FULL' ? setFileUploadErrorFull(helper.getErrorMessage(error)) : setFileUploadErrorVideo(helper.getErrorMessage(error));
    });
  }

  const disableContinueButton = (fieldType: string, error: boolean): void => {
    const errorObject = {
      buttonListError: fieldType === 'buttonListError' ? error : creativeInAppSectionError.buttonListError,
      deepLinkError: fieldType === 'deepLinkError' ? error : creativeInAppSectionError.deepLinkError
    }
    setCreativeInAppSectionError(errorObject);
    const validArray = Object.values(errorObject);
    if (validArray.includes(true)) {
      toggleContinueButton(true);
    } else {
      toggleContinueButton(false);
    }
  }

  const setCallToAction = (fieldValue: string, objectiveType: string, isBlur: boolean = false): void => {
    let isError;
    const modifiedPayload = Object.assign({}, state.formValues);

    if (objectiveType === 'packageNameToOpenApp') {
      setPackageNameToOpenApp(fieldValue);
      modifiedPayload['registration']['packageNameToOpenApp'] = fieldValue;

      if (fieldValue.length === 0) {
        setObjectiveFieldError({
          packageNameToOpenApp: t('PACKAGE_NAME_REQUIRED_ERROR'), goToWeb: '', packageNameToInstallApp: '',
          packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
        })
        isError = true;
      } else {
        if (!/^[^\s]+(\s+[^\s]+)*$/.test(fieldValue)) {
          setObjectiveFieldError({
            packageNameToOpenApp: t('PACKAGE_NAME_IVALID_ERROR'), goToWeb: '', packageNameToInstallApp: '',
            packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
          })
          isError = true;
        } else {
          setObjectiveFieldError({
            packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
            packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
          })
          isError = false;
        }
      }
    } else if (objectiveType === 'goToWeb') {
      let gotoWebUrl = fieldValue;
      if (isBlur) {
        if (goToWeb.indexOf('https') === -1 && goToWeb.indexOf('http') === -1) {
          gotoWebUrl = 'https://' + fieldValue;
        }
      }
      setGoToWeb(gotoWebUrl);
      modifiedPayload['registration']['goToWeb'] = gotoWebUrl;

      if (gotoWebUrl.length === 0) {
        setObjectiveFieldError({
          packageNameToOpenApp: '', goToWeb: t('URL_REQUIRED_ERROR'), packageNameToInstallApp: '',
          packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
        })
        setUrlProtocolWarning('');
        isError = true;
      } else {
        if (isBlur) {
          if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(gotoWebUrl)) {
            setObjectiveFieldError({
              packageNameToOpenApp: '', goToWeb: t('URL_INVALID_ERROR'), packageNameToInstallApp: '',
              packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
            })
            isError = true;
            setUrlProtocolWarning('');
          } else {
            setObjectiveFieldError({
              packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
              packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
            })
            setUrlProtocolWarning('');
            isError = false;
          }
        } else {
          if (gotoWebUrl.indexOf('https') === -1 && gotoWebUrl.indexOf('http') === -1) {
            setUrlProtocolWarning(t('URL_PROTOCOL_WARNING'));
            setObjectiveFieldError({
              packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
              packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
            })
            isError = true;
          } else {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(gotoWebUrl)) {
              setObjectiveFieldError({
                packageNameToOpenApp: '', goToWeb: t('URL_INVALID_ERROR'), packageNameToInstallApp: '',
                packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
              })
              setUrlProtocolWarning('');
              isError = true;
            } else {
              setObjectiveFieldError({
                packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
              })
              setUrlProtocolWarning('');
              isError = false;
            }
          }
        }
      }
    } else if (objectiveType === 'packageNameToInstallApp') {
      let packageNameToInstallAppUrl = fieldValue;
      if (isBlur) {
        if (packageNameToInstallApp.indexOf('https') === -1 && packageNameToInstallApp.indexOf('http') === -1) {
          packageNameToInstallAppUrl = 'https://' + fieldValue;
        }
      }
      setPackageNameToInstallApp(packageNameToInstallAppUrl);
      modifiedPayload['registration']['packageNameToInstallApp'] = packageNameToInstallAppUrl;

      if (packageNameToInstallAppUrl.length === 0) {
        setObjectiveFieldError({
          packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: t('PLAY_STORE_REQUIRED_ERROR'),
          packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
        })
        setUrlProtocolWarning('');
        isError = true;
      } else {
        if (isBlur) {
          if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(packageNameToInstallAppUrl)) {
            setObjectiveFieldError({
              packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: t('URL_INVALID_ERROR'),
              packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
            })
            setUrlProtocolWarning('');
            isError = true;
          } else {
            setObjectiveFieldError({
              packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
              packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
            })
            setUrlProtocolWarning('');
            isError = false;
          }
        } else {
          if (packageNameToInstallAppUrl.indexOf('https') === -1 && packageNameToInstallAppUrl.indexOf('http') === -1) {
            setUrlProtocolWarning(t('URL_PROTOCOL_WARNING'));
            setObjectiveFieldError({
              packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
              packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
            })
            isError = true;
          } else {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(packageNameToInstallAppUrl)) {
              setObjectiveFieldError({
                packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: t('URL_INVALID_ERROR'),
                packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
              })
              setUrlProtocolWarning('');
              isError = true;
            } else {
              setObjectiveFieldError({
                packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
                packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
              })
              setUrlProtocolWarning('');
              isError = false;
            }
          }
        }
      }
    } else if (objectiveType === 'packageName') {
      setPackageName(fieldValue);
      modifiedPayload['registration']['packageName'] = fieldValue;

      if (fieldValue.length === 0) {
        setObjectiveFieldError({
          packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
          packageName: t('PACKAGE_NAME_INSTALL_REQUIRED_ERROR'), phoneToCall: '', actionInTheApp: '', showMessage: ''
        })
        isError = true;
      } else {
        if (!/^([A-Za-z]{1}[A-Za-z\d_]*\.)*[A-Za-z][A-Za-z\d_]*$/.test(fieldValue)) {
          setObjectiveFieldError({
            packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
            packageName: t('PACKAGE_NAME_INSTALL_INVALID_ERROR'), phoneToCall: '', actionInTheApp: '', showMessage: ''
          })
          isError = true;
        } else {
          setObjectiveFieldError({
            packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
            packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
          })
          isError = false;
        }
      }
    } else if (objectiveType === 'phoneToCall') {
      setPhoneToCall(fieldValue);
      modifiedPayload['registration']['phoneToCall'] = fieldValue;

      if (fieldValue.length === 0) {
        setObjectiveFieldError({
          packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
          packageName: '', phoneToCall: t('PHONE_NUMBER_REQUIRED_ERROR'), actionInTheApp: '', showMessage: ''
        })
        isError = true;
      } else {
        if (!/^((^[\*\#\+]?[0-9]{2,4}[\*\#\+]?)|(((\+[0-9]{1,2})|0)?[\s\-]?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{2,5}))?$/.test(fieldValue)) {
          setObjectiveFieldError({
            packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
            packageName: '', phoneToCall: t('PHONE_NUMBER_INVALID_ERROR'), actionInTheApp: '', showMessage: ''
          })
          isError = true;
        } else {
          setObjectiveFieldError({
            packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
            packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
          })
          isError = false;
        }
      }
    } else if (objectiveType === 'actionInTheApp') {
      let actionInTheAppUrl = fieldValue;
      if (isBlur) {
        if (actionInTheApp.indexOf('https') === -1 && actionInTheApp.indexOf('http') === -1) {
          actionInTheAppUrl = 'http://' + fieldValue;
        }
      }
      setActionInTheApp(fieldValue);
      modifiedPayload['registration']['actionInTheApp'] = actionInTheAppUrl;

      if (actionInTheAppUrl.length === 0) {
        setObjectiveFieldError({
          packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
          packageName: '', phoneToCall: '', actionInTheApp: t('URL_REQUIRED_ERROR'), showMessage: ''
        })
        isError = true;
      } else {
        if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(actionInTheAppUrl)) {
          setObjectiveFieldError({
            packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
            packageName: '', phoneToCall: '', actionInTheApp: t('URL_INVALID_ERROR'), showMessage: ''
          })
          isError = true;
        } else {
          setObjectiveFieldError({
            packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
            packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
          })
          isError = false;
        }
      }
    }

    modifiedPayload['registration']['isRegistrationSectionValid'] = !isError;
    updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
    disableContinueButton('deepLinkError', isError);
  }

  const isShowCustomizeCallToAction = (): boolean => {
    if (state.formValues.registration.cpType === 'MONETIZATION') {
      if (state.formValues.registration.campaignType === 'pushInApp') {
        return true;
      } else {
        return false;
      }
    } else {
      if (state.formValues.registration.campaignObjectiveName === 'surveyAd') {
        return false;
      }
      return true;
    }
  }

  async function getFileFromUrlForGif(url: string, name: string, defaultType = 'image/jpeg') {
    const response = await fetch(url);
    const data = await response.blob();
    const file = new File([data], name, {
      type: response.headers.get('content-type') || defaultType,
    });
    const duration = await isGifAnimated(file);
    return duration;
  }

  const disableAddButton = (): boolean => {
    if (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus) {
      return true;
    } else {
      return isIUUser ? buttonList.length === 1 : buttonList.length === 3;
    }
  }

  let buttonListArrayHasError;
  if (state.formValues.registration.campaignObjectiveName === 'showMessage') {
    if (!buttonPersonalizationOptionsInApp || state.formValues.registration.cpType === 'MONETIZATION') {
      buttonListArrayHasError = false;
    } else {
      if (buttonList.length === 0) {
        buttonListArrayHasError = true;
      } else {
        buttonListArrayHasError = buttonList.some((val, i) => (val.isCtaLinkError === true || val.isButtonTextError === true));
      }
    }
  } else {
    buttonListArrayHasError = false;
  }

  const handleChangeDispalyTimeBehaviour = (e: any): void => {
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload['creative']['adDisplayTimeBehaviour'] = e.target.value;
    modifiedPayload['creative']['minimumAdDisplayTimeModified'] = false;
    if (e.target.value === 'MINIMUM_REQUIRED') {
      if ((state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'popup' || state.formValues.template.secondaryTemplateType === 'popup' || state.formValues.template.primaryTemplateType === 'topBanner' || state.formValues.template.secondaryTemplateType === 'topBanner' || state.formValues.template.primaryTemplateType === 'bottomBanner' || state.formValues.template.secondaryTemplateType === 'bottomBanner') && !state.formValues.creative.minimumAdDisplayTimeModified) {
        modifiedPayload['creative']['minimumAdDisplayTime'] = 15;
      } else if ((state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo' || state.formValues.template.primaryTemplateType === 'popupWithVideo' ||
        state.formValues.template.secondaryTemplateType === 'popupWithVideo') && !state.formValues.creative.minimumAdDisplayTimeModified) {
        modifiedPayload['creative']['minimumAdDisplayTime'] = 30;
      }
    } else {
      modifiedPayload['creative']['minimumAdDisplayTime'] = 0;
    }
    updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
  }


  const imageListArrayHasError = tabValueSlider === 1 ? sliderImageList.some((val, i) => val.isImageUrlError === true) : false;

  return (
    <Grid container spacing={3}>
      {snackbarMessageSuccess && (
        <SnackBarMessage open={snackbarMessageSuccess} onClose={() => setSnackbarMessageSuccess(false)}
          severityType="success" message={snackbarMessageValue} />)}
      <Grid item md={8} xs={12}>
        <S.Container>
          <Formik
            initialValues={{
              subjectInApp: state.formValues.creative.subjectInApp,
              messageInApp: state.formValues.creative.messageInApp,
              buttonPersonalizationOptionsInApp: buttonPersonalizationOptionsInApp,
              imageUrl: state.formValues.creative.imageUrl,
              videoUrl: state.formValues.creative.videoUrl,
              noOfStars: state.formValues.creative.noOfStars,
              starColors: state.formValues.creative.starColors,
              deepLinksRatingStars: deepLinksRatingStars,
              ctaTextInApp: state.formValues.creative.ctaTextInApp,
              subjectInAppCharRemaining: state.formValues.creative.subjectInAppCharRemaining,
              messageInAppCharRemaining: state.formValues.creative.messageInAppCharRemaining,
              ctaTextInAppCharRemaining: state.formValues.creative.ctaTextInAppCharRemaining,
              adDisplayTimeBehaviour: state.formValues.creative.adDisplayTimeBehaviour,
              minimumAdDisplayTime: state.formValues.creative.minimumAdDisplayTime
            }}

            validationSchema={yup.object().shape({
              subjectInApp: ((state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.primaryTemplateType === 'popup' || state.formValues.template.primaryTemplateType === 'popupWithVideo' || state.formValues.template.primaryTemplateType === 'slider' ||
                state.formValues.template.primaryTemplateType === 'bottomBanner' || state.formValues.template.primaryTemplateType === 'topBanner' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'popup' || state.formValues.template.secondaryTemplateType === 'popupWithVideo' || state.formValues.template.secondaryTemplateType === 'slider' || state.formValues.template.secondaryTemplateType === 'bottomBanner'
                || state.formValues.template.secondaryTemplateType === 'topBanner') && state.formValues.registration.cpType === 'ENGAGEMENT') ? yup.string()
                  .required(t('CREATIVE_MESSAGE_TITLE_REQUIRED_ERROR'))
                  .max(25, t('CREATIVE_MESSAGE_TITLE_MAX_LENGTH_ERROR'))
                  .matches(
                    /^[^.\s]/,
                    t('CREATIVE_MESSAGE_TITLE_INVALID_ERROR')
                  ) : yup.string(),
              messageInApp: yup.string()
                .max(35, t('CREATIVE_SMALL_MESSAGE_MAX_LENGTH_ERROR'))
                .matches(
                  /^[^.\s]/,
                  t('CREATIVE_SMALL_MESSAGE_INVALID_ERROR')
                ),
              ctaTextInApp: (state.formValues.registration.campaignObjectiveName === 'packageNameToOpenApp' ||
                state.formValues.registration.campaignObjectiveName === 'goToWeb' ||
                state.formValues.registration.campaignObjectiveName === 'packageNameToInstallApp' ||
                state.formValues.registration.campaignObjectiveName === 'phoneToCall' ||
                state.formValues.registration.campaignObjectiveName === 'actionInTheApp' ||
                state.formValues.registration.campaignObjectiveName === 'surveyAd')
                ? yup.string()
                  .required(t('CREATIVE_CTA_TEXT_REQUIRED_ERROR'))
                  .max(20, t('CREATIVE_CTA_TEXT_MAX_LENGTH_ERROR'))
                  .matches(/^[^.\s]/,
                    t('CREATIVE_CTA_TEXT_INVALID_ERROR')) : yup.string(),
              noOfStars: ((state.formValues.template.primaryTemplateType === 'rating' || state.formValues.template.secondaryTemplateType === 'rating') && !isIUUser) ? yup.number().required(t('CREATIVE_INAPP_RATING_REQUIRED_ERROR'))
                .min(1, t('CREATIVE_INAPP_RATING_MIN_ERROR'))
                .max(10, t('CREATIVE_INAPP_RATING_MAX_ERROR')) : yup.number(),
              // starColors: ((state.formValues.template.primaryTemplateType === 'rating' || state.formValues.template.secondaryTemplateType === 'rating') && !isIUUser) ? yup.string().required(t('CREATIVE_INAPP_STAR_COLOR_REQUIRED_ERROR'))
              //   : yup.string(),
              minimumAdDisplayTime: state.formValues.creative.adDisplayTimeBehaviour === 'MINIMUM_REQUIRED' ? yup.number().required(t('MINIMUM_AD_DISPLAY_TIME_FIELD_REQUIRED_ERROR'))
                .min(0, t('MINIMUM_AD_DISPLAY_TIME_FIELD_MINIMUM_ERROR')) : yup.number()

            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              const payload = {
                subjectInApp: values.subjectInApp,
                messageInApp: values.messageInApp,
                subject: state.formValues.creative.subject,
                message: state.formValues.creative.message,
                richNotificationMessageBody: state.formValues.creative.richNotificationMessageBody,
                iconUploadOptions: state.formValues.creative.iconUploadOptions,
                appIconUrl: state.formValues.creative.appIconUrl,
                buttonPersonalizationOptions: state.formValues.creative.buttonPersonalizationOptions,
                buttonPersonalizationOptionsInApp: buttonPersonalizationOptionsInApp,
                imgageUrl: values.imageUrl,
                videoUrl: values.videoUrl,
                bannerUrl: state.formValues.creative.bannerUrl,
                noOfStars: values.noOfStars,
                starColors: values.starColors,
                buttons: state.formValues.creative.buttons,
                buttonsInApp: buttonList,
                sliderImageList: sliderImageList,
                deepLinksRatingStars: deepLinksRatingStars,
                notificationImageContent: state.formValues.creative.notificationImageContent,
                richNotificationImageContent: state.formValues.creative.richNotificationImageContent,
                isCampaignNameValid: state.formValues.registration.isCampaignNameValid,
                videoContent: state.formValues.creative.videoContent,
                mainImageContent: state.formValues.creative.mainImageContent,
                fullImageContent: state.formValues.creative.fullImageContent,
                ctaTextInApp: values.ctaTextInApp,
                ctaText: state.formValues.creative.ctaText,
                gifImageContent: state.formValues.creative.gifImageContent,
                creativeSectionObjectiveFieldError: state.formValues.creative.creativeSectionObjectiveFieldError,
                sequenceArray: state.formValues.creative.sequenceArray,
                sequenceArrayFullPagePopUpTopBottomBanner: state.formValues.creative.sequenceArrayFullPagePopUpTopBottomBanner,
                sequenceArrayFullPageVideo: state.formValues.creative.sequenceArrayFullPageVideo,
                gifDuration: gifDuration,
                orgDetails: state.orgDetails,
                subjectCharRemaining: state.formValues.creative.subjectCharRemaining,
                messageCharRemaining: state.formValues.creative.messageCharRemaining,
                richNotificationMessgaeBodyCharRemaining: state.formValues.creative.richNotificationMessgaeBodyCharRemaining,
                ctaTextCharRemaining: state.formValues.creative.ctaTextCharRemaining,
                ctaTextInAppCharRemaining: state.formValues.creative.ctaTextInAppCharRemaining,
                subjectInAppCharRemaining: state.formValues.creative.subjectInAppCharRemaining,
                messageInAppCharRemaining: state.formValues.creative.messageInAppCharRemaining,
                selectedSurvey: state.formValues.creative.selectedSurvey,
                surveyQuestionDetails: state.formValues.creative.surveyQuestionDetails,
                adDisplayTimeBehaviour: state.formValues.creative.adDisplayTimeBehaviour,
                minimumAdDisplayTime: state.formValues.creative.minimumAdDisplayTime,
                minimumAdDisplayTimeModified: state.formValues.creative.minimumAdDisplayTimeModified
              }
              const modifiedPayload = Object.assign({}, state.formValues);
              modifiedPayload['creative'] = payload;
              updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignObjectiveName === 'surveyAd' ? 'survey' : 'settings', true);
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
              isValid
            }) => (
              <form onSubmit={handleSubmit} className="cc-form-wrapper">
                <div className="cr-top-main">
                  <h5 className="cc-label-text">{t('CREATIVE_SECTION_HEADING')}</h5>

                  {(state.formValues.template.primaryTemplateType === 'slider' || state.formValues.template.secondaryTemplateType === 'slider') && <h5 className="title-padding">{t('CREATIVE_INAPP_SLIDER_IMAGES_CONTENT_LABEL')}</h5>}
                  {(state.formValues.template.primaryTemplateType === 'slider' || state.formValues.template.secondaryTemplateType === 'slider') && <div className="cr-top-wrapper">
                    <div className="">
                      <div className="img-button-header">
                        <Button className={tabValueSlider === 0 ? "active" : ''}
                          type="button"
                          onClick={() => handleChangeTabSlider(0)}>{t('CREATIVE_TAB_DRAG_DROP')}</Button>
                        <Button className={tabValueSlider === 1 ? "active" : ''}
                          type="button"
                          onClick={() => handleChangeTabSlider(1)}>{t('CREATIVE_TAB_URL')}</Button>
                        <Button className={tabValueSlider === 2 ? "active" : ''}
                          type="button"
                          onClick={() => handleChangeTabSlider(2)}>{t('CREATIVE_TAB_CHOOSE_EXISTING')}</Button>
                      </div>
                      <div className="img-button-content">

                        {tabValueSlider === 0 &&
                          <div className="drag-and-drop-wrapper">
                            <TextField type="file" variant="outlined" aria-describedby="desc-slider-image-url" className="custom-file-input"
                              disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                              onChange={(event) => setChosenFileName(event, 'SLIDER')} inputProps={{ accept: "image/*" }} />
                            <span></span>
                            <div className="image-info-box">
                              <p>{fileNameSlider.length === 0 ? t('CREATIVE_FILE_DRAG_DROP_INSTRUCTION') : fileNameSlider}</p>
                              <p className="extension-text">jpg,.jpeg,.png</p>
                            </div>
                            <p className="error-wrap error">{fileUploadErrorSlider}</p>
                          </div>
                        }
                      </div>
                      {tabValueSlider === 1 && <div>
                        {
                          sliderImageList.map((sliderImage, index) => (
                            <div key={index} className="tab-inner-wrapper">
                              <div className="cta-wrapper">
                                <p className="cr-button-label">Image {index + 1}</p>
                                <DeleteIcon onClick={() => updateSliderImageListArray('delete', index)} />
                              </div>
                              <TextField
                                name={`sliderListButton1${index}`}
                                variant="outlined"
                                aria-describedby={`sliderListButton1${index}`}
                                InputLabelProps={{ shrink: true }}
                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                label={t("CREATIVE_TAB_URL_LABEL")}
                                type="text"
                                placeholder={t('CREATIVE_TAB_URL_PLACEHOLDER')}
                                value={sliderImage.imageUrl}
                                onBlur={handleBlur}
                                onChange={e => {
                                  handleChange(e);
                                  updateSliderImageListField(e.currentTarget.value, index);
                                }}
                              />
                              <p className="error-wrap error">{sliderImage.imageUrlError}</p>
                            </div>
                          ))
                        }
                        <Button
                          className="custom-btn"
                          variant="outlined"
                          color="primary"
                          type="button"
                          startIcon={<AddOutlinedIcon fontSize="small" />}
                          disabled={sliderImageList.length === 4}
                          onClick={() => updateSliderImageListArray('add', null)}>
                          {t('CREATIVE_INAPP_IMAGE_CONTENT_LABEL')}
                        </Button>
                      </div>}
                      {(tabValueSlider === 2 && isShowContentPopup) &&
                        <ContentPopup handleOpen={handleOpenModal} imageContentType={'SLIDER'} contentType={'imagecontents'} section={state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative'} />
                      }
                    </div>
                  </div>}
                  {(state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.primaryTemplateType === 'popup' || state.formValues.template.primaryTemplateType === 'rating' || state.formValues.template.primaryTemplateType === 'bottomBanner' || state.formValues.template.primaryTemplateType === 'topBanner' || state.formValues.template.primaryTemplateType === 'fullPage' ||
                    state.formValues.template.secondaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'popup' || state.formValues.template.secondaryTemplateType === 'rating' || state.formValues.template.secondaryTemplateType === 'bottomBanner' || state.formValues.template.secondaryTemplateType === 'topBanner' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'popupWithVideo' || state.formValues.template.secondaryTemplateType === 'popupWithVideo') && <div className="cr-top-wrapper">
                      <h5 className="title-padding">{t('CREATIVE_INAPP_IMAGE_CONTENT_LABEL')} *</h5>
                      <div>
                        <div className="tabs-wrapper secondary">
                          <Tabs value={tabValueImage} onChange={handleChangeTabImage} aria-label="simple tabs example">
                            <Tab label={t('CREATIVE_TAB_DRAG_DROP')} {...a11yProps(0)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} />
                            {/* <Tab label={t('CREATIVE_TAB_URL')} {...a11yProps(1)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} /> */}
                            <Tab label={t('CREATIVE_TAB_CHOOSE_EXISTING')} {...a11yProps(1)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} />
                          </Tabs>
                        </div>
                        <TabPanel className="tab-content-box" value={tabValueImage} index={0}>
                          <div className="drag-and-drop-wrapper">
                            <TextField type="file" variant="outlined" aria-describedby="desc-image-url" className="custom-file-input"
                              disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                              onChange={(event) => setChosenFileName(event, (state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo') ? 'FULL' : 'MAIN')} inputProps={{ accept: "image/*" }} />
                            <span></span>
                            <div className="image-info-box">
                              {(state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo') ? <p>{fileNameFull.length === 0 ? t('CREATIVE_FILE_DRAG_DROP_INSTRUCTION') : fileNameFull}</p> : <p>{fileNameMain.length === 0 ? t('CREATIVE_FILE_DRAG_DROP_INSTRUCTION') : fileNameMain}</p>}
                              <p className="extension-text">jpg,.jpeg,.png</p>
                            </div>
                          </div>
                          <p className="error-wrap error">{(state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo') ? fileUploadErrorFull : fileUploadErrorMain}</p>
                        </TabPanel>
                        {/* <TabPanel className="tab-content-box" value={tabValueImage} index={1}>
                          <TextField
                            type="text"
                            variant="outlined"
                            aria-describedby="Image Url"
                            placeholder={t('CREATIVE_TAB_URL_PLACEHOLDER')}
                            value={values.imageUrl}
                            label={t("CREATIVE_TAB_URL_LABEL")}
                            name="imageUrl"
                            InputLabelProps={{ shrink: true }}
                            disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                            onBlur={(e) => {
                              handleBlur(e);
                              const modifiedPayload = Object.assign({}, state.formValues);
                              modifiedPayload['creative']['imageUrl'] = e.currentTarget.value;
                              updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
                              isContentUrlValidityCheck(e.currentTarget.value, (state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo') ? 'FULL' : 'MAIN');
                            }}
                            onChange={handleChange}
                          />
                          <p className="error-wrap error">{(state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo') ? fullImageUrlError : mainImageUrlError}</p>
                          <p className="error-wrap error">{(state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo') ? fileUploadErrorFull : fileUploadErrorMain}</p>
                        </TabPanel> */}
                        <TabPanel className="tab-content-box" value={tabValueImage} index={1}>
                          {isShowContentPopup && <ContentPopup handleOpen={handleOpenModal} imageContentType={(state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo') ? 'FULL' : 'MAIN'} contentType={'imagecontents'}
                            section={state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative'} />}
                        </TabPanel>
                      </div>
                    </div>}
                  {(state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.primaryTemplateType === 'popupWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'popupWithVideo') && <div className="cr-top-wrapper">
                    <h5 className="title-padding">{t('CREATIVE_INAPP_VIDEO_CONTENT_LABEL')} *</h5>
                    <div>
                      <div className="tabs-wrapper secondary">
                        <Tabs value={tabValueVideo} onChange={handleChangeTabVideo} aria-label="simple tabs example">
                          <Tab label={t('CREATIVE_TAB_DRAG_DROP')} {...a11yProps(0)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} />
                          {/* <Tab label={t('CREATIVE_TAB_URL')} {...a11yProps(1)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} /> */}
                          <Tab label={t('CREATIVE_TAB_CHOOSE_EXISTING_VIDEO')} {...a11yProps(1)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} />
                          <Tab label={t('CREATIVE_TAB_CHOOSE_EXISTING_GIF')} {...a11yProps(2)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} />
                        </Tabs>
                      </div>
                      <TabPanel className="tab-content-box" value={tabValueVideo} index={0}>
                        <div className="drag-and-drop-wrapper">
                          <TextField type="file" variant="outlined" aria-describedby="desc-video-url" className="custom-file-input"
                            disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                            onChange={(event) => setChosenFileName(event, 'VIDEO')} inputProps={{ accept: "video/mp4,.mp4,.3gp, image/gif" }} />
                          <span></span>
                          <div className="image-info-box">
                            <p>{fileNameVideo.length === 0 ? t('CREATIVE_FILE_DRAG_DROP_INSTRUCTION') : fileNameVideo}</p>
                            <p className="extension-text">.gif,.mp4,.3gp,.3gpp</p>
                          </div>
                        </div>
                        <p className="error-wrap error">{fileUploadErrorVideo}</p>
                      </TabPanel>
                      {/* <TabPanel className="tab-content-box" value={tabValueVideo} index={1}>
                        <TextField
                          type="text"
                          variant="outlined"
                          aria-describedby="video Url"
                          placeholder={t('CREATIVE_TAB_URL_PLACEHOLDER')}
                          value={values.videoUrl}
                          label={t("CREATIVE_TAB_URL_LABEL")}
                          name="videoUrl"
                          InputLabelProps={{ shrink: true }}
                          disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                          onBlur={(e) => {
                            handleBlur(e);
                            const modifiedPayload = Object.assign({}, state.formValues);
                            modifiedPayload['creative']['videoUrl'] = e.currentTarget.value;
                            updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
                            isContentUrlValidityCheck(e.currentTarget.value, 'VIDEO');
                          }}
                          onChange={handleChange}
                        />
                        <p className="error-wrap error">{videoUrlError}</p>
                        <p className="error-wrap error">{fileUploadErrorVideo}</p>
                      </TabPanel> */}
                      <TabPanel className="tab-content-box" value={tabValueVideo} index={1}>
                        {isShowContentPopup && <ContentPopup handleOpen={handleOpenModal} imageContentType={'VIDEO'} contentType={'videocontents'} section={state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative'} />}
                      </TabPanel>
                      <TabPanel className="tab-content-box" value={tabValueVideo} index={2}>
                        {isShowContentPopup && <ContentPopup handleOpen={handleOpenModal} imageContentType={'GIF'} contentType={'gifcontents'} section={state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative'} />}
                      </TabPanel>
                    </div>
                  </div>}
                  {state.formValues.registration.cpType === 'ENGAGEMENT' && <div className="cr-top-wrapper">
                    <h5 className="title-padding">{t('CAMPAIGN_TYPE_IN_APP')} {t('CREATIVE_MESSAFE_CONTENT_LABEL')}</h5>
                    <hr />
                    <div className="cr-body-content">
                      <Grid container>
                        <div className="row">
                          {(state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.primaryTemplateType === 'popup' || state.formValues.template.primaryTemplateType === 'popupWithVideo' || state.formValues.template.primaryTemplateType === 'slider' ||
                            state.formValues.template.primaryTemplateType === 'bottomBanner' || state.formValues.template.primaryTemplateType === 'topBanner' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'popup' || state.formValues.template.secondaryTemplateType === 'popupWithVideo' || state.formValues.template.secondaryTemplateType === 'slider' || state.formValues.template.secondaryTemplateType === 'bottomBanner'
                            || state.formValues.template.secondaryTemplateType === 'topBanner') && <Grid item xs={12} md={12} className="form-row">
                              <TextField
                                variant="outlined"
                                aria-describedby="Message Title"
                                placeholder={t('CREATIVE_MESSAGE_TITLE_PLACEHOLDER')}
                                label={`${t('CREATIVE_MESSAGE_TITLE_LABEL')} *`}
                                name="subjectInApp"
                                InputLabelProps={{ shrink: true }}
                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                error={Boolean(touched.subjectInApp && errors.subjectInApp)}
                                helperText={touched.subjectInApp && errors.subjectInApp}
                                onBlur={(e) => {
                                  handleBlur(e);
                                  const modifiedPayload = Object.assign({}, state.formValues);
                                  modifiedPayload['creative']['subjectInApp'] = e.currentTarget.value;
                                  modifiedPayload['creative']['subjectInAppCharRemaining'] = 25 - e.currentTarget.value.length;
                                  updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
                                }}
                                onChange={(e) => {
                                  handleChange(e);
                                  const modifiedPayload = Object.assign({}, state.formValues);
                                  modifiedPayload['creative']['subjectInApp'] = e.currentTarget.value;
                                  modifiedPayload['creative']['subjectInAppCharRemaining'] = 25 - e.currentTarget.value.length;
                                  updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
                                }}
                                value={values.subjectInApp}
                                type="text"
                              />
                              {(state.formValues.creative.subjectInAppCharRemaining >= 0 && state.formValues.creative.subjectInApp.length !== 0)
                                && <p>{state.formValues.creative.subjectInAppCharRemaining} {t('TEXT_FIELD_CHARACTERS_REMAINING')}</p>}
                            </Grid>}

                          <Grid item xs={12} md={12} className="form-row">
                            <TextField
                              variant="outlined"
                              aria-describedby="Small Message"
                              placeholder={t('CREATIVE_SMALL_MESSAGE_PLACEHOLDER')}
                              label={`${t('CREATIVE_SMALL_MESSAGE_LABEL')}`}
                              name="messageInApp"
                              InputLabelProps={{ shrink: true }}
                              disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                              error={Boolean(touched.messageInApp && errors.messageInApp)}
                              helperText={touched.messageInApp && errors.messageInApp}
                              onBlur={(e) => {
                                handleBlur(e);
                                const modifiedPayload = Object.assign({}, state.formValues);
                                modifiedPayload['creative']['messageInApp'] = e.currentTarget.value;
                                modifiedPayload['creative']['messageInAppCharRemaining'] = 35 - e.currentTarget.value.length;
                                updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
                              }}
                              onChange={(e) => {
                                handleChange(e);
                                const modifiedPayload = Object.assign({}, state.formValues);
                                modifiedPayload['creative']['messageInApp'] = e.currentTarget.value;
                                modifiedPayload['creative']['messageInAppCharRemaining'] = 35 - e.currentTarget.value.length;
                                updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
                              }}
                              value={values.messageInApp}
                              type="text"
                            />
                            <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                            {(state.formValues.creative.messageInAppCharRemaining >= 0 && state.formValues.creative.messageInApp.length !== 0)
                              && <p>{state.formValues.creative.messageInAppCharRemaining} {t('TEXT_FIELD_CHARACTERS_REMAINING')}</p>}
                          </Grid>
                        </div>
                      </Grid>
                    </div>
                  </div>}
                  {state.formValues.template.primaryTemplateType === 'rating' && <div className="cr-top-wrapper cr-rating-wrapper">
                    <h5 className="title-padding">{t('TEMPLATE_TYPE_RATING')}</h5>
                    <hr />
                    <div className="cr-body-content">
                      <p className="cr-button-label mb">{t('CRATIVE_INAPP_RATING_SECTION_SUBHEADER')}</p>
                      <div>
                        <Grid container>
                          <div className="row">
                            <Grid item xs={12} md={6}>
                              <TextField
                                variant="outlined"
                                aria-describedby="No of Stars"
                                placeholder="5"
                                label={`${t('CREATIVE_INAPP_NUMBER_OF_STARS_LABEL')} *`}
                                name="noOfStars"
                                InputLabelProps={{ shrink: true }}
                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                error={Boolean(touched.noOfStars && errors.noOfStars)}
                                helperText={touched.noOfStars && errors.noOfStars}
                                onBlur={handleBlur}
                                onChange={e => {
                                  handleChange(e)
                                  const modifiedPayload = Object.assign({}, state.formValues);
                                  modifiedPayload['creative']['noOfStars'] = e.currentTarget.value;
                                  updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
                                }}
                                value={values.noOfStars}
                                type="text"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                variant="outlined"
                                aria-describedby="No of Stars"
                                placeholder={t('CREATIVE_INAPP_STAR_COLOR_PLACEHOLDER')}
                                label={t('CREATIVE_INAPP_STAR_COLOR_LABEL')}
                                name="starColors"
                                InputLabelProps={{ shrink: true }}
                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                error={Boolean(touched.starColors && errors.starColors)}
                                helperText={touched.starColors && errors.starColors}
                                onBlur={handleBlur}
                                onChange={e => {
                                  handleChange(e);
                                  const modifiedPayload = Object.assign({}, state.formValues);
                                  modifiedPayload['creative']['starColors'] = e.currentTarget.value;
                                  updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
                                }}
                                value={values.starColors}
                                type="text"
                              />
                            </Grid>
                          </div>
                        </Grid>


                        <div className="switchery">
                          <FormControlLabel
                            control={<Switch
                              checked={deepLinksRatingStars}
                              onChange={handleChangeDeepLinksRatingStars}
                              name="deepLinksRatingStars"
                              disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                            />}
                            label={t('CREATIVE_INAPP_ADD_DEEPLINK_TO_STARS_SWITCH_LABEL')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>}
                  <div className="cr-top-wrapper cr-rating-wrapper">
                    <h5 className="title-padding">{t('AD_MINIMUM_TIMER_HEADER')}</h5>
                    <hr />
                    <div className="cr-body-content">
                      <div className="label-tooltip cc-label-text-min-video" >
                        {t('AD_DISPLAY_TIME_BEHAVIOR_LABEL')}
                        {/* <LightTooltip title={<label>{t('TOOLTIP_FOR_AUDINCE_CAMPAIGN')}</label>} /> <b>{t('CLICKED')}</b> */}
                      </div>
                      {/* <p className="cr-button-label mb">{t('AD_DISPLAY_TIME_BEHAVIOR_LABEL')}</p> */}
                      <RadioGroup
                        row
                        aria-label="adDisplayTimeBehaviour"
                        name="none"
                        color="primary"
                        value={state.formValues.creative.adDisplayTimeBehaviour}
                        onChange={handleChangeDispalyTimeBehaviour}
                        className="form-row"
                      >
                        <FormControlLabel
                          value="NONE"
                          control={<Radio color="primary" />}
                          label={t('AD_DISPLAY_TIME_BEHAVIOR_OPTION_NONE_LABEL')}
                          disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        />
                        <FormControlLabel
                          value="MINIMUM_REQUIRED"
                          control={<Radio color="primary" />}
                          label={t('AD_DISPLAY_TIME_BEHAVIOR_OPTION_MINIMUM_REQUIRED_LABEL')}
                          disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        />
                        <FormControlLabel
                          value="SHOW_FULL"
                          control={<Radio color="primary" />}
                          label={t('AD_DISPLAY_TIME_BEHAVIOR_OPTION_SHOW_FULL_LABEL')}
                          disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        />
                      </RadioGroup>
                      <div className="row">
                        <Grid item xs={12} md={8} >
                          <TextField
                            variant="outlined"
                            aria-describedby="Minimun ad display time"
                            placeholder={t('MINIMUM_AD_DISPLAY_TIME_FIELD_PLACEHOLDER')}
                            label={state.formValues.creative.adDisplayTimeBehaviour === 'MINIMUM_REQUIRED' ? `${t('MINIMUM_AD_DISPLAY_TIME_LABEL')} *
                         ` : t('MINIMUM_AD_DISPLAY_TIME_LABEL')}
                            name="minimumAdDisplayTime"
                            InputLabelProps={{ shrink: true }}
                            disabled={((window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus) ||
                              (state.formValues.creative.adDisplayTimeBehaviour === 'NONE' || state.formValues.creative.adDisplayTimeBehaviour === 'SHOW_FULL'))}
                            error={Boolean(touched.minimumAdDisplayTime && errors.minimumAdDisplayTime)}
                            helperText={touched.minimumAdDisplayTime && errors.minimumAdDisplayTime}
                            onBlur={handleBlur}
                            onChange={e => {
                              handleChange(e);
                              const modifiedPayload = Object.assign({}, state.formValues);
                              modifiedPayload['creative']['minimumAdDisplayTime'] = e.currentTarget.value;
                              modifiedPayload['creative']['minimumAdDisplayTimeModified'] = true;
                              updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
                            }}
                            value={state.formValues.creative.minimumAdDisplayTime}
                            type="number"
                          />
                        </Grid>
                      </div>

                    </div>
                  </div>
                  {((state.formValues.registration.campaignObjectiveName === 'showMessage' ||
                    state.formValues.registration.campaignObjectiveName === 'displayOnlyAd') && state.formValues.registration.cpType === 'ENGAGEMENT') && <div className="display-block">

                      <div className="switchery">
                        <FormControlLabel
                          control={<Switch
                            checked={buttonPersonalizationOptionsInApp}
                            onChange={handleChangeButtonPersonalizationOptionsInApp}
                            name="buttonPersonalizationOptions"
                            disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                          />}
                          label={t('CREATIVE_BUTTON_PERSONALIZATION_OPTION_SWITCH_LABEL')}
                        />
                      </div>

                    </div>}

                  <div className="cr-top-wrapper">
                    {isShowCustomizeCallToAction() && <div className="cr-top-wrapper cr-customize-section">
                      <h5 className="title-padding">{t('CREATIVE_CUSTOMIZE_CALL_TO_ACTION_BUTTONS_LABEL_IN_APP')}</h5>
                      <hr />
                      {(state.formValues.registration.campaignObjectiveName === 'showMessage' ||
                        state.formValues.registration.campaignObjectiveName === 'displayOnlyAd') &&
                        buttonPersonalizationOptionsInApp && <div className="cr-body-content">
                          {
                            buttonList.map((button, index) => (
                              <div key={index}>
                                <div className="cta-wrapper">
                                  <p className="cr-button-label">{t('BUTTON')} {index + 1}</p>
                                  <DeleteIcon className={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus) ? 'disabled-function' : ''}
                                    onClick={() => updateButtonListArray('delete', index)} />
                                </div>
                                <Grid container>
                                  <Grid item md={6} xs={6} className="form-row">
                                    <TextField
                                      name={`button${index}`}
                                      variant="outlined"
                                      aria-describedby={`button${index}`}
                                      InputLabelProps={{ shrink: true }}
                                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                      label={t('CREATIVE_BUTTON_TEXT_LABEL')}
                                      type="text"
                                      placeholder={t('CREATIVE_TAB_URL_PLACEHOLDER')}
                                      value={button.buttonText}
                                      onBlur={(e) => {
                                        handleBlur(e);
                                        updateButtonListField(e.currentTarget.value, index, 'buttonText');
                                      }}
                                      onChange={e => {
                                        handleChange(e);
                                        updateButtonListField(e.currentTarget.value, index, 'buttonText');
                                      }}
                                    />
                                    {(button.buttonTextCharRemaining >= 0 && button.buttonText.length !== 0)
                                      && <p>{button.buttonTextCharRemaining} {t('TEXT_FIELD_CHARACTERS_REMAINING')}</p>}
                                    <p className="error-wrap error">{button.buttonTextError}</p>
                                  </Grid>
                                  <Grid item md={6} xs={6} className="form-row">
                                    <TextField
                                      name={`cta${index}`}
                                      variant="outlined"
                                      aria-describedby={`cta${index}`}
                                      InputLabelProps={{ shrink: true }}
                                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                      label={t('CREATIVE_LINK_LABEL')}
                                      type="text"
                                      placeholder={t('CREATIVE_TAB_URL_PLACEHOLDER')}
                                      value={button.ctaLink}
                                      onBlur={(e) => {
                                        handleBlur(e);
                                        updateButtonListField(e.currentTarget.value, index, 'ctaLink', true);
                                      }}
                                      onChange={e => {
                                        handleChange(e);
                                        updateButtonListField(e.currentTarget.value, index, 'ctaLink');
                                      }}
                                    />
                                    <p className="error-wrap error">{button.ctaLinkError}</p>
                                  </Grid>
                                </Grid>
                              </div>
                            ))
                          }
                          <Button
                            variant="outlined"
                            color="primary"
                            type="button"
                            startIcon={<AddOutlinedIcon fontSize="small" />}
                            disabled={disableAddButton()}
                            onClick={() => updateButtonListArray('add', null)}>
                            {t('ADD_BUTTON')}
                          </Button>
                        </div>}
                      {((state.formValues.registration.campaignObjectiveName === 'packageNameToOpenApp' ||
                        state.formValues.registration.campaignObjectiveName === 'goToWeb' ||
                        state.formValues.registration.campaignObjectiveName === 'packageNameToInstallApp' ||
                        state.formValues.registration.campaignObjectiveName === 'phoneToCall' ||
                        state.formValues.registration.campaignObjectiveName === 'actionInTheApp' ||
                        state.formValues.registration.campaignObjectiveName === 'surveyAd')
                      )
                        && <div className="cr-body-content">
                          <Grid container>
                            <div className="row">
                              <Grid item md={6} xs={6}>
                                <TextField
                                  name="ctaTextInApp"
                                  variant="outlined"
                                  aria-describedby="cta-text"
                                  InputLabelProps={{ shrink: true }}
                                  disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                  label={`${t('CREATIVE_CTA_TEXT_LABEL')} *`}
                                  type="text"
                                  placeholder={t('CREATIVE_CTA_TEXT_PLACEHOLDER')}
                                  value={values.ctaTextInApp}
                                  onBlur={(e) => {
                                    handleBlur(e);
                                    const modifiedPayload = Object.assign({}, state.formValues);
                                    modifiedPayload['creative']['ctaTextInApp'] = e.currentTarget.value;
                                    modifiedPayload['creative']['ctaText'] = e.currentTarget.value;
                                    modifiedPayload['creative']['ctaTextInAppCharRemaining'] = 20 - e.currentTarget.value.length;
                                    updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
                                  }}
                                  onChange={e => {
                                    handleChange(e);
                                    const modifiedPayload = Object.assign({}, state.formValues);
                                    modifiedPayload['creative']['ctaTextInApp'] = e.currentTarget.value;
                                    modifiedPayload['creative']['ctaText'] = e.currentTarget.value;
                                    modifiedPayload['creative']['ctaTextInAppCharRemaining'] = 20 - e.currentTarget.value.length;
                                    updateCreativeSectionPayload(modifiedPayload, state.formValues.registration.campaignType === 'inApp' ? 'creative' : 'secondaryCreative', false);
                                  }}
                                  error={Boolean(touched.ctaTextInApp && errors.ctaTextInApp)}
                                  helperText={touched.ctaTextInApp && errors.ctaTextInApp}
                                />
                                {(state.formValues.creative.ctaTextInAppCharRemaining >= 0 && state.formValues.creative.ctaTextInApp.length !== 0)
                                  && <p>{state.formValues.creative.ctaTextInAppCharRemaining} {t('TEXT_FIELD_CHARACTERS_REMAINING')}</p>}
                              </Grid>
                              <Grid item md={6} xs={6}>
                                {state.formValues.registration.campaignObjectiveName === 'packageNameToOpenApp' && <div>
                                  <TextField
                                    variant="outlined"
                                    aria-describedby="Call To Action"
                                    placeholder={t('PACKAGE_NAME_PLACEHOLDER')}
                                    label={`${t('PACKAGE_NAME_LABEL')} *`}
                                    name="packageNameToOpenApp"
                                    InputLabelProps={{ shrink: true }}
                                    disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                    onBlur={(e) => {
                                      handleBlur(e);
                                      setCallToAction(e.currentTarget.value, 'packageNameToOpenApp');
                                    }}
                                    onChange={(e) => {
                                      handleChange(e);
                                      setCallToAction(e.currentTarget.value, 'packageNameToOpenApp');
                                    }}
                                    value={packageNameToOpenApp}
                                    type="text"
                                  />
                                  <p className="error-wrap error">{objectiveFieldError['packageNameToOpenApp']}</p>
                                </div>}

                                {state.formValues.registration.campaignObjectiveName === 'goToWeb' && <div>
                                  <TextField
                                    variant="outlined"
                                    aria-describedby="Call To Action"
                                    placeholder={t('GO_TO_WEB_PLACEHOLDER')}
                                    label={`${t('GO_TO_WEB_LABEL')} *`}
                                    name="goToWeb"
                                    InputLabelProps={{ shrink: true }}
                                    disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                    onBlur={(e) => {
                                      handleBlur(e);
                                      setCallToAction(e.currentTarget.value, 'goToWeb', true);
                                    }}
                                    onChange={(e) => {
                                      handleChange(e);
                                      setCallToAction(e.currentTarget.value, 'goToWeb');
                                    }}
                                    value={goToWeb}
                                    type="url"
                                  />
                                  <p className="error-wrap error">{objectiveFieldError['goToWeb']}</p>
                                  <p className="information">{urlProtocolWarning}</p>
                                </div>}
                                {state.formValues.registration.campaignObjectiveName === 'packageNameToInstallApp' && <div className="form-row">
                                  <TextField
                                    variant="outlined"
                                    aria-describedby="Call To Action"
                                    placeholder={t('PACKAGE_NAME_TO_INSTALL_APP_PLACEHOLDER')}
                                    label={`${t('PACKAGE_NAME_APP_URL_LABEL')} *`}
                                    name="packageNameToInstallApp"
                                    InputLabelProps={{ shrink: true }}
                                    disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                    onBlur={(e) => {
                                      handleBlur(e);
                                      setCallToAction(e.currentTarget.value, 'packageNameToInstallApp', true);
                                    }}
                                    onChange={(e) => {
                                      handleChange(e);
                                      setCallToAction(e.currentTarget.value, 'packageNameToInstallApp');
                                    }}
                                    value={packageNameToInstallApp}
                                    type="url"
                                  />
                                  <p className="error-wrap error">{objectiveFieldError['packageNameToInstallApp']}</p>
                                  <p className="information">{urlProtocolWarning}</p>
                                </div>}
                                {state.formValues.registration.campaignObjectiveName === 'packageNameToInstallApp' && <div className="form-row">
                                  <TextField
                                    variant="outlined"
                                    aria-describedby="Package Name"
                                    label={`${t('PACKAGE_NAME_INSTALL_LABEL')} *`}
                                    placeholder={t('PACKAGE_NAME_INSTALL_LABEL')}
                                    name="packageName"
                                    InputLabelProps={{ shrink: true }}
                                    disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                    onBlur={(e) => {
                                      handleBlur(e);
                                      setCallToAction(e.currentTarget.value, 'packageName');
                                    }}
                                    onChange={(e) => {
                                      handleChange(e);
                                      setCallToAction(e.currentTarget.value, 'packageName');
                                    }}
                                    value={packageName}
                                    type="text"
                                  />
                                  <p className="error-wrap error">{objectiveFieldError['packageName']}</p>
                                </div>}
                                {state.formValues.registration.campaignObjectiveName === 'phoneToCall' && <div>
                                  <TextField
                                    variant="outlined"
                                    aria-describedby="Call To Action"
                                    label={`${t('PHONE_NUMER_LABEL')} *`}
                                    name="phoneToCall"
                                    placeholder={t('PHONE_NUMBER_PLACEHOLDER')}
                                    InputLabelProps={{ shrink: true }}
                                    disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                    onBlur={(e) => {
                                      handleBlur(e);
                                      setCallToAction(e.currentTarget.value, 'phoneToCall');
                                    }}
                                    onChange={(e) => {
                                      handleBlur(e);
                                      setCallToAction(e.currentTarget.value, 'phoneToCall');
                                    }}
                                    value={phoneToCall}
                                    type="text"
                                  />
                                  <p className="error-wrap error">{objectiveFieldError['phoneToCall']}</p>
                                </div>}
                                {state.formValues.registration.campaignObjectiveName === 'actionInTheApp' && <div>
                                  <TextField
                                    variant="outlined"
                                    aria-describedby="Call To Action"
                                    placeholder={t('ACTION_IN_APP_PLACEHOLDER')}
                                    label={`${t('ACTION_IN_APP_LABEL')} *`}
                                    name="actionInTheApp"
                                    InputLabelProps={{ shrink: true }}
                                    disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                    onBlur={(e) => {
                                      handleBlur(e);
                                      setCallToAction(e.currentTarget.value, 'actionInTheApp', true);
                                    }}
                                    onChange={(e) => {
                                      handleChange(e);
                                      setCallToAction(e.currentTarget.value, 'actionInTheApp');
                                    }}
                                    value={actionInTheApp}
                                    type="url"
                                  />
                                  <p className="error-wrap error">{objectiveFieldError['actionInTheApp']}</p>
                                </div>}
                              </Grid>
                            </div>
                          </Grid>

                        </div>}
                    </div>}
                  </div>

                </div>

                <div className="cc-global-buttons">
                  <Button
                    variant="outlined"
                    color="primary"
                    type="button"
                    onClick={(e) => updateCreativeSectionPayload(state.formValues, state.formValues.registration.campaignType === 'pushInApp' ? 'creative' : 'template', true)}>
                    {t('BACK_BUTTON')}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                    disabled={!isValid || isDisableContinueButton || buttonListArrayHasError || imageListArrayHasError ||
                      (((state.formValues.template.primaryTemplateType === 'fullPage' || state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' ||
                        state.formValues.template.secondaryTemplateType === 'fullPageWithVideo') && Object.keys(state.formValues.creative.fullImageContent).length === 0)) || ((state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo' || state.formValues.template.primaryTemplateType === 'popupWithVideo' || state.formValues.template.secondaryTemplateType === 'popupWithVideo') && (Object.keys(state.formValues.creative.videoContent).length === 0) &&
                          Object.keys(state.formValues.creative.gifImageContent).length === 0) || ((state.formValues.template.primaryTemplateType === 'popup' || state.formValues.template.secondaryTemplateType === 'popup' ||
                            state.formValues.template.primaryTemplateType === 'bottomBanner' || state.formValues.template.secondaryTemplateType === 'bottomBanner' || state.formValues.template.primaryTemplateType === 'topBanner' || state.formValues.template.secondaryTemplateType === 'topBanner' || state.formValues.template.primaryTemplateType === 'popupWithVideo' || state.formValues.template.secondaryTemplateType === 'popupWithVideo') && Object.keys(state.formValues.creative.mainImageContent).length === 0)
                    }
                  >
                    {t('CONTINUE_BUTTON')}
                  </Button>
                </div>

              </form>
            )}
          </Formik>
        </S.Container>
      </Grid>
      <Grid item md={4} xs={12}>
        <MobilePreview template={
          modifyTemplateType(state.formValues.registration.campaignType !== 'pushInApp' ? state.formValues.template.primaryTemplateType
            : state.formValues.template.secondaryTemplateType)}
          format={modifyCampaignType(state.formValues.registration.campaignType)}
          objectiveType={state.formValues.registration.campaignObjectiveName}
          ctaText={state.formValues.creative.ctaText}
          gifDuration={gifDuration}
          cpType={state.formValues.registration.cpType}
          campaignType={state.formValues.registration.campaignType === 'pushInApp' ? 'PUSH_INAPP' : state.formValues.registration.campaignType?.toUpperCase()}
          message={{
            title: state.formValues.registration.cpType === 'ENGAGEMENT' ? state.formValues.creative.subjectInApp : '',
            body: state.formValues.registration.cpType === 'ENGAGEMENT' ? state.formValues.creative.messageInApp : '',
            text: state.formValues.creative.richNotificationMessageBody,
            button: state.formValues.registration.cpType === 'MONETIZATION' ? [] :
              state.formValues.registration.campaignObjectiveName !== 'showMessage' ? [] :
                !buttonPersonalizationOptionsInApp ? [] : modifyButtonList(!isIUUser ? state.formValues.creative.buttonsInApp : []),
            icon: state.formValues.creative.notificationImageContent?.imageUrl,
            video: Object.keys(state.formValues.creative.gifImageContent).length === 0 ? state.formValues.creative.videoContent?.videoFileUrl : state.formValues.creative.gifImageContent?.videoFileUrl,
            banner: (state.formValues.template.primaryTemplateType === 'fullPage' ||
              state.formValues.template.secondaryTemplateType === 'fullPage' || state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'fullPageWithVideo') ? state.formValues.creative.fullImageContent?.imageUrl : (state.formValues.template.primaryTemplateType === 'popup' ||
                state.formValues.template.secondaryTemplateType === 'popup' || state.formValues.template.primaryTemplateType === 'bottomBanner' || state.formValues.template.secondaryTemplateType === 'bottomBanner' || state.formValues.template.primaryTemplateType === 'topBanner' || state.formValues.template.secondaryTemplateType === 'topBanner' || state.formValues.template.primaryTemplateType === 'popupWithVideo' || state.formValues.template.secondaryTemplateType === 'popupWithVideo') ? state.formValues.creative.mainImageContent?.imageUrl : ''
          }} />
      </Grid>
    </Grid>
  );
}

export default CreativeInApp;
