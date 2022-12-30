import { useState, useContext, useEffect } from "react";
import * as S from "./CreativePush.styles";
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
  FormControlLabel
} from "@material-ui/core";
import { GlobalContext } from '../../../context/globalState';
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";
import * as yup from 'yup';
import { Formik } from 'formik';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import ContentPopup from "../../../components/Common/ContentPopup/ContentPopup";
import { MobilePreview, SnackBarMessage } from "@dr-one/shared-component";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';

function CreativePush() {
  const urlRegex = /^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const userData = JSON.parse(localStorage.getItem('dr-user'));
  const iuUserIndex = userData.organizations.findIndex(orgDetail => orgDetail.id === userData.organizationActive);
  const isIUUser = iuUserIndex > -1 ? userData.organizations[iuUserIndex].legacy : false;
  const [tabValueAppIcon, setTabValueAppIcon] = useState(0);
  const [tabValueBanner, setTabValueBanner] = useState(0);
  const [iconUploadOptions, setIconUploadUptions] = useState(state.formValues.creative.iconUploadOptions);
  const [buttonPersonalizationOptions, setButtonPersonalizationOptions] = useState(state.formValues.creative.buttonPersonalizationOptions);
  const [isShowContentPopup, toggleContentPopup] = useState(false);
  const [isDisableContinueButton, toggleContinueButton] = useState(false);
  const [notificationImageUrlError, setNotificationImageUrlError] = useState('');
  const [bannerImageUrlError, setBannerUrlError] = useState('');
  const [fileNameNotification, setFileNameNotification] = useState('');
  const [fileUploadErrorNotification, setFileUploadErrorNotification] = useState('');
  const [fileNameRichNotification, setFileNameRichNotification] = useState('');
  const [fileUploadErrorRichNotification, setFileUploadErrorRichNotification] = useState('');
  const [packageNameToOpenApp, setPackageNameToOpenApp] = useState(state.formValues.registration.packageNameToOpenApp);
  const [goToWeb, setGoToWeb] = useState(state.formValues.registration.goToWeb);
  const [packageNameToInstallApp, setPackageNameToInstallApp] = useState(state.formValues.registration.packageNameToInstallApp);
  const [packageName, setPackageName] = useState(state.formValues.registration.packageName);
  const [phoneToCall, setPhoneToCall] = useState(state.formValues.registration.phoneToCall);
  const [actionInTheApp, setActionInTheApp] = useState(state.formValues.registration.actionInTheApp);
  const [objectiveFieldError, setObjectiveFieldError] = useState({
    packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
    packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
  });
  const [creativeSectionError, setCreativeSectionError] = useState({ buttonListError: false, deepLinkError: false });
  const { t } = useTranslation();
  const [snackbarMessageSuccess, setSnackbarMessageSuccess] = useState(false);
  const [snackbarMessageValue, setSnackbarMessageValue] = useState('');
  const [buttonList, setButtonList] = useState(state.formValues.creative.buttons.map(buttonElem => {
    buttonElem.buttonTextError = t(`${buttonElem.buttonTextError}`);
    buttonElem.ctaLinkError = t(`${buttonElem.ctaLinkError}`);
    return buttonElem;
  }));
  const [urlProtocolWarning, setUrlProtocolWarning] = useState('');
  const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;

  useEffect(() => {
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
  }, [])

  const handleChangeTabAppIcon = (event: any, newValue: number): void => {
    setTabValueAppIcon(newValue);
    setFileUploadErrorNotification('');
    if (newValue === 1) {
      toggleContentPopup(isShowContentPopup => !isShowContentPopup);
    }
  };

  const handleChangeTabBanner = (event: any, newValue: number): void => {
    setTabValueBanner(newValue);
    setFileUploadErrorRichNotification('');
    if (newValue === 1) {
      toggleContentPopup(isShowContentPopup => !isShowContentPopup);
    }
  }

  const updateCreativeSectionPayload = (payload: any, section: string): void => {
    switch (section) {
      case 'secondaryCreative':
        if (section !== state.currentSectionName)
          Mixpanel.track("Create Campaign Page View", { "page": "Creative - In App" });
        break;
      case 'secondaryTemplate':
        if (section !== state.currentSectionName)
          Mixpanel.track("Create Campaign Page View", { "page": "Template - In App" });
        break;
      case 'settings':
        if (section !== state.currentSectionName)
          Mixpanel.track("Create Campaign Page View", { "page": "Settings" });
        break;
      case 'survey':
        if (section !== state.currentSectionName)
          Mixpanel.track("Create Campaign Page View", { "page": "Survey" });
        break;
      case 'template':
        if (section !== state.currentSectionName)
          Mixpanel.track("Create Campaign Page View", { "page": "Template - Push" });
        break;
    }

    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
      payload: {
        campaignPayload: payload, currentPageName: section,
        campaignBreadCrumbList: (section === 'template' || section === 'secondaryTemplate') ? ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE'] :
          (section === 'creative' || section === 'secondaryCreative') ? ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE'] : section === 'survey' ? ['CAMPAIGN_MANAGEMENT',
            'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SURVEY'] : ['CAMPAIGN_MANAGEMENT',
            'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS'],
        campaignStepsArray: state.campaignStepsArray
      }
    })
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

  const handleChangeIconUploadOptions = (e: any): void => {
    setIconUploadUptions(e.target.checked);
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload['creative']['iconUploadOptions'] = e.target.checked;
    updateCreativeSectionPayload(modifiedPayload, 'creative');
  }

  const handleChangeButtonPersonalizationOptions = (e: any): void => {
    setButtonPersonalizationOptions(e.target.checked);
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
    modifiedPayload['creative']['buttonPersonalizationOptions'] = e.target.checked;
    updateCreativeSectionPayload(modifiedPayload, 'creative');
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
        modifiedButtonList[indexValue]['ctaLinkError'] = t('CREATIVE_LINK_REQUIRED_ERROR');
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
    if (!buttonPersonalizationOptions || !arrayHasError) {
      disableContinueButton('buttonListError', false);
    } else {
      disableContinueButton('buttonListError', true);
    }
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload['creative']['buttons'] = modifiedButtonList;
    updateCreativeSectionPayload(modifiedPayload, 'creative');
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
      if (modifiedButtonList.length === 0 && buttonPersonalizationOptions) {
        disableContinueButton('buttonListError', true);
      } else {
        disableContinueButton('buttonListError', false);
      }
    }
    setButtonList(modifiedButtonList);
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload['creative']['buttons'] = modifiedButtonList;
    updateCreativeSectionPayload(modifiedPayload, 'creative');
  }

  const handleOpenModal = (value: boolean): void => {
    toggleContentPopup(value);
    setTabValueAppIcon(0);
    setTabValueBanner(0);
  }

  const modifyTemplateType = (template: string): string => {
    if (template === 'standard') {
      return 'STANDARD';
    } else if (template === 'richText') {
      return 'RICH-TEXT';
    } else if (template === 'richImage') {
      return 'RICH-IMAGE';
    }
  }

  const modifyCampaignType = (campaignType: string): string => {
    if (campaignType === 'push' || campaignType === 'pushInApp') {
      return 'PUSH';
    } else if (campaignType === 'inApp') {
      return 'IN-APP';
    }
  }

  const modifyButtonList = (buttonList: Array<any>): Array<any> => {
    const buttonArray = [];
    buttonList.forEach((buttonEle) => {
      buttonArray.push(buttonEle.buttonText);
    })
    return buttonArray;
  }

  const isImageUrlValidityCheck = (value: string, imageType: string): void => {
    if (value.length === 0) {
      imageType === 'NOTIFICATION' ? setNotificationImageUrlError(t('CREATIVE_APP_ICON_URL_REQUIRED_ERROR'))
        : setBannerUrlError(t('CREATIVE_BANNER_URL_REQUIRED_ERROR'));
    } else if (!urlRegex.test(value)) {
      imageType === 'NOTIFICATION' ? setNotificationImageUrlError(t('CREATIVE_APP_ICON_URL_INVALID_ERROR')) : setBannerUrlError(t('CREATIVE_BANNER_URL_INVALID_ERROR'));
    } else {
      getFileFromUrl(value, String(new Date().getTime()) + '.jpeg').then(res => {
        setImageValidation(res, String(new Date().getTime()) + '.jpeg', imageType);
      });
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
    if (imageType === 'NOTIFICATION') {
      setFileNameNotification(event.target.files[0].name);
    } else {
      setFileNameRichNotification(event.target.files[0].name);
    }
    imageType === 'NOTIFICATION' ? setFileUploadErrorNotification('') : setFileUploadErrorRichNotification('');
    setImageValidation(event.target.files[0], event.target.files[0].name, imageType);
  }

  const setImageValidation = (file: any, fileName: string, imageType: string): void => {
    let maxAllowedImageSize;
    const allowedImageType = ['jpg', 'jpeg', 'png'];
    if (imageType === 'NOTIFICATION') {
      maxAllowedImageSize = parseInt(state.orgDetails.notificationImageSize ? state.orgDetails.notificationImageSize : 100, helper.radix) * 1000;
    } else {
      maxAllowedImageSize = parseInt(state.orgDetails.mainImageSize ? state.orgDetails.mainImageSize : 300, helper.radix) * 1000;
    }
    if (allowedImageType.indexOf(fileName.split('.').pop()) === -1) {
      imageType === 'NOTIFICATION' ? setFileUploadErrorNotification(t('CREATIVE_INVALID_IMAGE_FORMAT_ERROR')) :
        setFileUploadErrorRichNotification(t('CREATIVE_INVALID_IMAGE_FORMAT_ERROR'));
    } else {
      if (file.size <= maxAllowedImageSize) {
        if (fileName.trim().length > 2) {
          apiDashboard.get('campaign-mgmt-api/imagecontents/name?name=' + fileName.trim() + '&imageContentType=' + imageType).then(res => {
            if (res.data.message === 'false') {
              imageType === 'NOTIFICATION' ? setFileUploadErrorNotification('') : setFileUploadErrorRichNotification('');
              fileUpload(file, fileName, imageType);
            } else {
              imageType === 'NOTIFICATION' ? setFileUploadErrorNotification(t('CREATIVE_IMAGE_DUPLICATE_NAME_ERROR'))
                : setFileUploadErrorRichNotification(t('CREATIVE_IMAGE_DUPLICATE_NAME_ERROR'));
            }
          }, error => {
            imageType === 'NOTIFICATION' ? setFileUploadErrorNotification(helper.getErrorMessage(error)) :
              setFileUploadErrorRichNotification(helper.getErrorMessage(error));
          });
        } else {
          imageType === 'NOTIFICATION' ? setFileUploadErrorNotification(t('CREATIVE_IMAGE_FILE_NAME_MIN_LENGTH_ERROR')) :
            setFileUploadErrorRichNotification(t('CREATIVE_IMAGE_FILE_NAME_MIN_LENGTH_ERROR'));
        }
      } else {
        imageType === 'NOTIFICATION' ? setFileUploadErrorNotification(`${t('CREATIVE_IMAGE_FILE_SIZE_MAX_ERROR')} ${maxAllowedImageSize / 1000} kb for ${imageType}`)
          : setFileUploadErrorRichNotification(`${t('CREATIVE_IMAGE_FILE_SIZE_MAX_ERROR')} ${maxAllowedImageSize / 1000} kb for ${imageType}`)
      }
    }
  }

  const fileUpload = (file: any, fileName: string, contentType: string): void => {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    formData.append('type', contentType);
    formData.append('imageContentType', contentType);
    const headers = new Headers({ 'Content-Type-2': 'multipart/form-data' });
    apiDashboard.post('files/upload', formData, headers).then(res => {
      contentType === 'NOTIFICATION' ? setFileUploadErrorNotification('') : setFileUploadErrorRichNotification('');

      const contentPayload = {
        imageFileId: res.data.data.id,
        imageUrl: res.data.data.url,
        name: fileName,
        organizationId: res.data.data.organizationId,
        userId: res.data.data.userId,
        imageContentType: contentType
      }
      apiDashboard.post('campaign-mgmt-api/imagecontents', contentPayload).then(res => {
        contentType === 'NOTIFICATION' ? setFileUploadErrorNotification('') : setFileUploadErrorRichNotification('');
        const modifiedPayload = Object.assign({}, state.formValues);
        modifiedPayload['creative'][contentType === 'NOTIFICATION' ? 'notificationImageContent' : 'richNotificationImageContent'] = res.data.data;
        updateCreativeSectionPayload(modifiedPayload, 'creative');
        setSnackbarMessageSuccess(true);
        setSnackbarMessageValue(res.data.message);
      }, error => {
        contentType === 'NOTIFICATION' ? setFileUploadErrorNotification(helper.getErrorMessage(error)) :
          setFileUploadErrorRichNotification(helper.getErrorMessage(error));
      });
    }, error => {
      contentType === 'NOTIFICATION' ? setFileUploadErrorNotification(helper.getErrorMessage(error)) :
        setFileUploadErrorRichNotification(helper.getErrorMessage(error));
    });
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
      setActionInTheApp(actionInTheAppUrl);
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
    updateCreativeSectionPayload(modifiedPayload, 'creative');
    disableContinueButton('deepLinkError', isError);
  }

  const disableContinueButton = (fieldType: string, error: boolean): void => {
    const errorObject = {
      buttonListError: fieldType === 'buttonListError' ? error : creativeSectionError.buttonListError,
      deepLinkError: fieldType === 'deepLinkError' ? error : creativeSectionError.deepLinkError
    }
    setCreativeSectionError(errorObject);
    const validArray = Object.values(errorObject);
    if (validArray.includes(true)) {
      toggleContinueButton(true);
    } else {
      toggleContinueButton(false);
    }
  }

  const disableAddButton = (): boolean => {
    if (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus) {
      return true;
    } else {
      return isIUUser ? buttonList.length === 1 : buttonList.length === 3;
    }
  }

  let buttonListArrayHasError;
  if (state.formValues.registration.cpType === 'MONETIZATION') {
    buttonListArrayHasError = false;
  } else {
    if (state.formValues.registration.campaignObjectiveName === 'showMessage') {
      if (!buttonPersonalizationOptions) {
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
  }
  
  return (
    <Grid container spacing={3}>
      {snackbarMessageSuccess && (
        <SnackBarMessage open={snackbarMessageSuccess} onClose={() => setSnackbarMessageSuccess(false)}
          severityType="success" message={snackbarMessageValue} />)}
      <Grid item md={8} xs={12}>
        <S.Container>
          <div className="cc-form-wrapper">

            <Formik
              initialValues={{
                subject: state.formValues.creative.subject,
                message: state.formValues.creative.message,
                richNotificationMessageBody: state.formValues.creative.richNotificationMessageBody,
                iconUploadOptions: iconUploadOptions,
                appIconUrl: state.formValues.creative.appIconUrl,
                buttonPersonalizationOptions: buttonPersonalizationOptions,
                bannerUrl: state.formValues.creative.bannerUrl,
                packageNameToOpenApp: state.formValues.registration.packageNameToOpenApp,
                goToWeb: state.formValues.registration.goToWeb,
                packageNameToInstallApp: state.formValues.registration.packageNameToInstallApp,
                packageName: state.formValues.registration.packageName,
                phoneToCall: state.formValues.registration.phoneToCall,
                actionInTheApp: state.formValues.registration.actionInTheApp,
                showMessage: state.formValues.registration.showMessage,
                ctaText: state.formValues.creative.ctaText,
                subjectCharRemaining: state.formValues.creative.subjectCharRemaining,
                messageCharRemaining: state.formValues.creative.messageCharRemaining,
                richNotificationMessgaeBodyCharRemaining: state.formValues.creative.richNotificationMessgaeBodyCharRemaining,
                ctaTextCharRemaining: state.formValues.creative.ctaTextCharRemaining
              }}

              validationSchema={yup.object().shape({
                subject: yup.string()
                  .required(t('CREATIVE_MESSAGE_TITLE_REQUIRED_ERROR'))
                  .max(25, t('CREATIVE_MESSAGE_TITLE_MAX_LENGTH_ERROR'))
                  .matches(
                    /^[^.\s]/,
                    t('CREATIVE_MESSAGE_TITLE_INVALID_ERROR')
                  ),
                message: (state.formValues.template.primaryTemplateType !== 'richText') ?
                  yup.string()
                    .required(t('CREATIVE_SMALL_MESSAGE_REQUIRED_ERROR'))
                    .max(35, t('CREATIVE_SMALL_MESSAGE_MAX_LENGTH_ERROR'))
                    .matches(
                      /^[^.\s]/,
                      t('CREATIVE_SMALL_MESSAGE_INVALID_ERROR')
                    ) : yup.string(),
                richNotificationMessageBody: (state.formValues.template.primaryTemplateType === 'richText')
                  ? yup.string()
                    .required(t('CREATIVE_BIG_MESSAGE_REQUIRED_ERROR'))
                    .max(250, t('CREATIVE_BIG_MESSAGE_MAX_LENGTH_ERROR'))
                    .matches(
                      // /^[^\s]+(\s+[^\s]+)*$/,
                      /^[^.\s]/,
                      t('CREATIVE_BIG_MESSAGE_INVALID_ERROR')
                    )
                  : yup.string(),
                ctaText: ((state.formValues.registration.campaignObjectiveName === 'packageNameToOpenApp' ||
                  state.formValues.registration.campaignObjectiveName === 'goToWeb' ||
                  state.formValues.registration.campaignObjectiveName === 'packageNameToInstallApp' ||
                  state.formValues.registration.campaignObjectiveName === 'phoneToCall' ||
                  state.formValues.registration.campaignObjectiveName === 'actionInTheApp' ||
                  state.formValues.registration.campaignObjectiveName === 'surveyAd') &&
                  state.formValues.registration.campaignType === 'push')
                  ? yup.string()
                    .required(t('CREATIVE_CTA_TEXT_REQUIRED_ERROR'))
                    .max(20, t('CREATIVE_CTA_TEXT_MAX_LENGTH_ERROR'))
                    .matches(/^[^.\s]/,
                      t('CREATIVE_CTA_TEXT_INVALID_ERROR')) : yup.string()
              })}

              onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                const payload = {
                  subject: values.subject,
                  message: state.formValues.template.primaryTemplateType !== 'richText' ? values.message : values.richNotificationMessageBody?.substring(0, 35),
                  subjectInApp: state.formValues.creative.subjectInApp,
                  messageInApp: state.formValues.creative.messageInApp,
                  richNotificationMessageBody: values.richNotificationMessageBody,
                  iconUploadOptions: iconUploadOptions,
                  appIconUrl: values.appIconUrl,
                  buttonPersonalizationOptions: buttonPersonalizationOptions,
                  buttonPersonalizationOptionsInApp: state.formValues.creative.buttonPersonalizationOptionsInApp,
                  bannerUrl: values.bannerUrl,
                  imageUrl: state.formValues.creative.imageUrl,
                  videoUrl: state.formValues.creative.videoUrl,
                  noOfStars: state.formValues.creative.noOfStars,
                  starColors: state.formValues.creative.starColors,
                  buttons: buttonList,
                  buttonsInApp: state.formValues.creative.buttonsInApp,
                  sliderImageList: state.formValues.creative.sliderImageList,
                  deepLinksRatingStars: state.formValues.creative.deepLinksRatingStars,
                  notificationImageContent: state.formValues.creative.notificationImageContent,
                  richNotificationImageContent: state.formValues.creative.richNotificationImageContent,
                  isCampaignNameValid: state.formValues.registration.isCampaignNameValid,
                  videoContent: state.formValues.creative.videoContent,
                  mainImageContent: state.formValues.creative.mainImageContent,
                  fullImageContent: state.formValues.creative.fullImageContent,
                  ctaText: values.ctaText,
                  ctaTextInApp: state.formValues.creative.ctaTextInApp,
                  gifImageContent: state.formValues.creative.gifImageContent,
                  creativeSectionObjectiveFieldError: state.formValues.creative.creativeSectionObjectiveFieldError,
                  sequenceArrayFullPagePopUpTopBottomBanner: state.formValues.creative.sequenceArrayFullPagePopUpTopBottomBanner,
                  sequenceArrayFullPageVideo: state.formValues.creative.sequenceArrayFullPageVideo,
                  sequenceArray: state.formValues.creative.sequenceArray,
                  gifDuration: state.formValues.creative.gifDuration,
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
                let section;

                if (state.formValues.registration.campaignType !== 'pushInApp') {
                  if (state.formValues.registration.campaignObjectiveName === 'surveyAd') {
                    section = 'survey';
                  } else {
                    section = 'settings';
                  }
                } else {
                  section = 'secondaryCreative';
                }
                updateCreativeSectionPayload(modifiedPayload, section);
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
                    <div className="cr-top-wrapper">
                      <h5 className="title-padding">{t('CAMPAIGN_TYPE_PUSH')} {t('CREATIVE_MESSAFE_CONTENT_LABEL')}</h5>
                      <hr />
                      <div className="cr-body-content">
                        <Grid container>
                          <div className="row">
                            <Grid item xs={12} md={12} className="form-row">
                              <TextField
                                variant="outlined"
                                aria-describedby="Message Title"
                                placeholder={t('CREATIVE_MESSAGE_TITLE_PLACEHOLDER')}
                                label={`${t('CREATIVE_MESSAGE_TITLE_LABEL')} *`}
                                name="subject"
                                InputLabelProps={{ shrink: true }}
                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                error={Boolean(touched.subject && errors.subject)}
                                helperText={touched.subject && errors.subject}
                                onBlur={(e) => {
                                  handleBlur(e);
                                  const modifiedPayload = Object.assign({}, state.formValues);
                                  modifiedPayload['creative']['subject'] = e.currentTarget.value;
                                  modifiedPayload['creative']['subjectCharRemaining'] = 25 - e.currentTarget.value.length;
                                  updateCreativeSectionPayload(modifiedPayload, 'creative');
                                }}
                                onChange={(e) => {
                                  handleChange(e)
                                  const modifiedPayload = Object.assign({}, state.formValues);
                                  modifiedPayload['creative']['subject'] = e.currentTarget.value;
                                  modifiedPayload['creative']['subjectCharRemaining'] = 25 - e.currentTarget.value.length;
                                  updateCreativeSectionPayload(modifiedPayload, 'creative');
                                }}
                                value={values.subject}
                                type="text"
                              />
                              {(state.formValues.creative.subjectCharRemaining >= 0 && state.formValues.creative.subject.length !== 0)
                                && <p>{state.formValues.creative.subjectCharRemaining} {t('TEXT_FIELD_CHARACTERS_REMAINING')}</p>}
                            </Grid>

                            {state.formValues.template.primaryTemplateType !== 'richText' && <Grid item xs={12} md={12} className="form-row">
                              <TextField
                                variant="outlined"
                                aria-describedby="Small Message"
                                placeholder={t('CREATIVE_SMALL_MESSAGE_PLACEHOLDER')}
                                label={`${t('CREATIVE_SMALL_MESSAGE_LABEL')} *`}
                                name="message"
                                InputLabelProps={{ shrink: true }}
                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                error={Boolean(touched.message && errors.message)}
                                helperText={touched.message && errors.message}
                                onBlur={(e) => {
                                  handleBlur(e);
                                  const modifiedPayload = Object.assign({}, state.formValues);
                                  modifiedPayload['creative']['message'] = e.currentTarget.value;
                                  modifiedPayload['creative']['messageCharRemaining'] = 35 - e.currentTarget.value.length;
                                  updateCreativeSectionPayload(modifiedPayload, 'creative');
                                }}
                                onChange={(e) => {
                                  handleChange(e);
                                  const modifiedPayload = Object.assign({}, state.formValues);
                                  modifiedPayload['creative']['message'] = e.currentTarget.value;
                                  modifiedPayload['creative']['messageCharRemaining'] = 35 - e.currentTarget.value.length;
                                  updateCreativeSectionPayload(modifiedPayload, 'creative');
                                }}
                                value={values.message}
                                type="text"
                              />
                              {(state.formValues.creative.messageCharRemaining >= 0 && state.formValues.creative.message.length !== 0)
                                && <p>{state.formValues.creative.messageCharRemaining} {t('TEXT_FIELD_CHARACTERS_REMAINING')}</p>}
                            </Grid>}

                            {state.formValues.template.primaryTemplateType === 'richText' && <Grid item xs={12} md={12} className="form-row">
                              <TextField
                                variant="outlined"
                                aria-describedby="Big Message"
                                placeholder={t('CREATIVE_BIG_MESSAGE_PLACEHOLDER')}
                                label={`${t('CREATIVE_BIG_MESSAGE_LABEL')} *`}
                                name="richNotificationMessageBody"
                                InputLabelProps={{ shrink: true }}
                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                error={Boolean(touched.richNotificationMessageBody && errors.richNotificationMessageBody)}
                                helperText={touched.richNotificationMessageBody && errors.richNotificationMessageBody}
                                onBlur={(e) => {
                                  handleBlur(e);
                                  const modifiedPayload = Object.assign({}, state.formValues);
                                  modifiedPayload['creative']['richNotificationMessageBody'] = e.currentTarget.value;
                                  modifiedPayload['creative']['message'] = e.currentTarget.value?.substring(0, 35);
                                  modifiedPayload['creative']['messageCharRemaining'] = 35 - e.currentTarget.value?.substring(0, 35).length;
                                  modifiedPayload['creative']['richNotificationMessgaeBodyCharRemaining'] = 250 - e.currentTarget.value.length;
                                  updateCreativeSectionPayload(modifiedPayload, 'creative');
                                }}
                                onChange={(e) => {
                                  handleChange(e);
                                  const modifiedPayload = Object.assign({}, state.formValues);
                                  modifiedPayload['creative']['richNotificationMessageBody'] = e.currentTarget.value;
                                  modifiedPayload['creative']['message'] = e.currentTarget.value?.substring(0, 35);
                                  modifiedPayload['creative']['messageCharRemaining'] = 35 - e.currentTarget.value?.substring(0, 35).length;
                                  modifiedPayload['creative']['richNotificationMessgaeBodyCharRemaining'] = 250 - e.currentTarget.value.length;
                                  updateCreativeSectionPayload(modifiedPayload, 'creative');
                                }}
                                value={values.richNotificationMessageBody}
                                type="text"
                              />
                              {(state.formValues.creative.richNotificationMessgaeBodyCharRemaining >= 0 && state.formValues.creative.richNotificationMessageBody.length !== 0)
                                && <p>{state.formValues.creative.richNotificationMessgaeBodyCharRemaining} {t('TEXT_FIELD_CHARACTERS_REMAINING')}</p>}
                            </Grid>}
                          </div>
                        </Grid>
                      </div>
                    </div>
                    <div className="message-switch-box">
                      <p>{t('CREATIVE_ICON_UPLOAD_OPTIONS')}</p>
                      <div className="switch-inline">
                        <Grid className="switch-label-wrap switch-2-options mb-20" component="label" container alignItems="center">

                          <Grid
                            item className="switch-label"
                          >
                          </Grid>
                          <Grid item className="no-padding">
                            <div className="switchery">
                              <FormControlLabel
                                control={<Switch
                                  checked={iconUploadOptions}
                                  onChange={handleChangeIconUploadOptions}
                                  name="iconUploadOptions"
                                  disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                />}
                                label={''}
                              />
                            </div>
                          </Grid>


                        </Grid>

                      </div>
                      <p>{t('SWITCH_ON')}</p>
                    </div>

                    {iconUploadOptions && <div className="cr-top-wrapper">
                      <div className="message-info-header">
                        <h5 className="title-padding">{t('CREATIVE_APP_ICON_HEADING')}</h5>
                        <span className="info-text warning-info"><img src="/img/info-icon.svg" alt="Information Icon" /> <span>{t('ICON_NOT_SUPPORTED')}</span></span>
                      </div>
                      <div>
                        <div className="tabs-wrapper secondary">
                          <Tabs value={tabValueAppIcon} onChange={handleChangeTabAppIcon} aria-label="simple tabs example">
                            <Tab label={t('CREATIVE_TAB_DRAG_DROP')} {...a11yProps(0)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} />
                            {/* <Tab label={t('CREATIVE_TAB_URL')} {...a11yProps(1)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} /> */}
                            <Tab label={t('CREATIVE_TAB_CHOOSE_EXISTING')} {...a11yProps(1)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} />
                          </Tabs>
                        </div>
                        <TabPanel className="tab-content-box" value={tabValueAppIcon} index={0}>
                          <div className="drag-and-drop-wrapper">
                            <TextField type="file" variant="outlined" aria-describedby="desc-app-icon-url" className="custom-file-input"
                              disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                              onChange={(event) => setChosenFileName(event, 'NOTIFICATION')} inputProps={{ accept: "image/*" }} />
                            <span></span>
                            <div className="image-info-box">
                              <p>{fileNameNotification.length === 0 ? t('CREATIVE_FILE_DRAG_DROP_INSTRUCTION') : fileNameNotification}</p>
                              <p className="extension-text">jpg,.jpeg,.png</p>
                            </div>

                          </div>
                          <p className="error-wrap error">{fileUploadErrorNotification}</p>
                        </TabPanel>
                        {/* <TabPanel className="tab-content-box" value={tabValueAppIcon} index={1}>
                          <TextField
                            type="text"
                            variant="outlined"
                            aria-describedby="App Icon Url"
                            placeholder={t('CREATIVE_TAB_URL_PLACEHOLDER')}
                            value={values.appIconUrl}
                            label={t("CREATIVE_TAB_URL_LABEL")}
                            name="appIconUrl"
                            InputLabelProps={{ shrink: true }}
                            disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                            onBlur={(e) => {
                              handleBlur(e);
                              const modifiedPayload = Object.assign({}, state.formValues);
                              modifiedPayload['creative']['appIconUrl'] = e.currentTarget.value;
                              updateCreativeSectionPayload(modifiedPayload, 'creative');
                              isImageUrlValidityCheck(e.currentTarget.value, 'NOTIFICATION');
                            }}
                            onChange={handleChange}
                          />
                          <p className="error-wrap error">{notificationImageUrlError}</p>
                          <p className="error-wrap error">{fileUploadErrorNotification}</p>
                        </TabPanel> */}
                        <TabPanel className="tab-content-box" value={tabValueAppIcon} index={1}>
                          {isShowContentPopup && <ContentPopup handleOpen={handleOpenModal} imageContentType={'NOTIFICATION'} contentType={'imagecontents'} section={'creative'} />}
                        </TabPanel>
                      </div>
                    </div>
                    }
                    {
                      state.formValues.template.primaryTemplateType === 'richImage' && <div className="cr-top-wrapper">
                        <h5 className="title-padding">{t('CREATIVE_BANNER_IMAGE_LABEL')} *</h5>
                        <div >
                          <div className="tabs-wrapper secondary">
                            <Tabs value={tabValueBanner} onChange={handleChangeTabBanner} aria-label="simple tabs example">
                              <Tab label="Drag & Drop" {...a11yProps(0)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} />
                              {/* <Tab label="URL" {...a11yProps(1)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} /> */}
                              <Tab label="Choose Existing Assets" {...a11yProps(1)} disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} />
                            </Tabs>
                          </div>
                          <TabPanel className="tab-content-box" value={tabValueBanner} index={0}>
                            <div className="drag-and-drop-wrapper">
                              <TextField type="file" variant="outlined" aria-describedby="desc-banner-image" className="custom-file-input"
                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                onChange={(event) => setChosenFileName(event, 'RICHNOTIFICATION_BIG')} inputProps={{ accept: "image/*" }} />
                              <span></span>
                              <div className="image-info-box">
                                <p>{fileNameRichNotification.length === 0 ? t('CREATIVE_FILE_DRAG_DROP_INSTRUCTION') : fileNameRichNotification}</p>
                                <p className="extension-text">jpg,.jpeg,.png</p>
                              </div>
                            </div>
                            <p className="error-wrap error">{fileUploadErrorRichNotification}</p>
                          </TabPanel>
                          {/* <TabPanel className="tab-content-box" value={tabValueBanner} index={1}>
                            <TextField
                              type="text"
                              variant="outlined"
                              aria-describedby="Banner Url"
                              placeholder={t('CREATIVE_TAB_URL_PLACEHOLDER')}
                              value={values.bannerUrl}
                              label={t("CREATIVE_TAB_URL_LABEL")}
                              name="bannerUrl"
                              InputLabelProps={{ shrink: true }}
                              disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                              error={Boolean(touched.bannerUrl && errors.bannerUrl)}
                              helperText={touched.bannerUrl && errors.bannerUrl}
                              onBlur={(e) => {
                                handleBlur(e);
                                const modifiedPayload = Object.assign({}, state.formValues);
                                modifiedPayload['creative']['bannerUrl'] = e.currentTarget.value;
                                updateCreativeSectionPayload(modifiedPayload, 'creative');
                                isImageUrlValidityCheck(e.currentTarget.value, 'RICHNOTIFICATION_BIG');
                              }}
                              onChange={handleChange}
                            />
                            <p className="error-wrap error">{bannerImageUrlError}</p>
                            <p className="error-wrap error">{fileUploadErrorRichNotification}</p>
                          </TabPanel> */}
                          <TabPanel className="tab-content-box" value={tabValueBanner} index={1}>
                            {isShowContentPopup && <ContentPopup handleOpen={handleOpenModal} imageContentType={'RICHNOTIFICATION_BIG'} contentType={'imagecontents'} section={'creative'} />}
                          </TabPanel>
                        </div>

                      </div>}
                    {((state.formValues.registration.campaignObjectiveName === 'showMessage' ||
                      state.formValues.registration.campaignObjectiveName === 'displayOnlyAd') &&
                      state.formValues.registration.cpType === 'ENGAGEMENT')
                      && <div className="display-block">
                        <div className="switchery">
                          <FormControlLabel
                            control={<Switch
                              checked={buttonPersonalizationOptions}
                              onChange={handleChangeButtonPersonalizationOptions}
                              name="buttonPersonalizationOptions"
                              disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                            />}
                            label={t('CREATIVE_BUTTON_PERSONALIZATION_OPTION_SWITCH_LABEL')}
                          />
                        </div>
                      </div>}

                    {((state.formValues.registration.cpType === 'ENGAGEMENT' && (state.formValues.registration.campaignType === 'push' || (state.formValues.registration.campaignType === 'pushInApp' && state.formValues.registration.campaignObjectiveName === 'showMessage'))) ||
                      (state.formValues.registration.cpType === 'MONETIZATION' && state.formValues.registration.campaignObjectiveName !== 'showMessage' && state.formValues.registration.campaignType === 'push')) &&
                      <div className="cr-top-wrapper cr-customize-section">
                        <h5 className="title-padding">{t('CREATIVE_CUSTOMIZE_CALL_TO_ACTION_BUTTONS_LABEL_PUSH')}</h5>
                        <hr />
                        {((state.formValues.registration.campaignObjectiveName === 'showMessage' ||
                          state.formValues.registration.campaignObjectiveName === 'displayOnlyAd') &&
                          state.formValues.registration.cpType === 'ENGAGEMENT') &&
                          buttonPersonalizationOptions && <div className="cr-body-content">
                            {
                              buttonList.map((button, index) => (
                                <div key={index} className="form-row">
                                  <div className="cta-wrapper">
                                    <p className="cr-button-label">{t('BUTTON')} {index + 1}</p>
                                    <DeleteIcon className={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus) ? 'disabled-function' : ''}
                                      onClick={() => updateButtonListArray('delete', index)} />
                                  </div>
                                  <Grid container>
                                    <div className="row">
                                      <Grid item xs={12} sm={6}>
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
                                          onBlur={e => {
                                            handleBlur(e);
                                            updateButtonListField(e.currentTarget.value, index, 'buttonText');
                                          }}
                                          onChange={e => {
                                            handleChange(e);
                                            updateButtonListField(e.currentTarget.value, index, 'buttonText');
                                          }}
                                        />
                                        {(button.buttonTextCharRemaining >= 0 && button.buttonText.length !== 0) && <p>{button.buttonTextCharRemaining} {t('TEXT_FIELD_CHARACTERS_REMAINING')}</p>}
                                        <p className="error-wrap error">{button.buttonTextError}</p>
                                      </Grid>
                                      <Grid item xs={12} sm={6} >
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
                                    </div>
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
                        {(state.formValues.registration.campaignObjectiveName === 'packageNameToOpenApp' ||
                          state.formValues.registration.campaignObjectiveName === 'goToWeb' ||
                          state.formValues.registration.campaignObjectiveName === 'packageNameToInstallApp' ||
                          state.formValues.registration.campaignObjectiveName === 'phoneToCall' ||
                          state.formValues.registration.campaignObjectiveName === 'actionInTheApp' ||
                          state.formValues.registration.campaignObjectiveName === 'surveyAd')
                          && <div className="cr-body-content">
                            <Grid container>
                              <div className="row call-to-action-wrap">
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    name="ctaText"
                                    variant="outlined"
                                    aria-describedby="cta-text"
                                    InputLabelProps={{ shrink: true }}
                                    disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                    label={`${t('CREATIVE_CTA_TEXT_LABEL')} *`}
                                    type="text"
                                    placeholder={t('CREATIVE_CTA_TEXT_PLACEHOLDER')}
                                    value={values.ctaText}
                                    onBlur={(e) => {
                                      handleBlur(e);
                                      const modifiedPayload = Object.assign({}, state.formValues);
                                      modifiedPayload['creative']['ctaText'] = e.currentTarget.value;
                                      modifiedPayload['creative']['ctaTextInApp'] = e.currentTarget.value;
                                      modifiedPayload['creative']['ctaTextCharRemaining'] = 20 - e.currentTarget.value.length;
                                      updateCreativeSectionPayload(modifiedPayload, 'creative');
                                    }}
                                    onChange={e => {
                                      handleChange(e);
                                      const modifiedPayload = Object.assign({}, state.formValues);
                                      modifiedPayload['creative']['ctaText'] = e.currentTarget.value;
                                      modifiedPayload['creative']['ctaTextInApp'] = e.currentTarget.value;
                                      modifiedPayload['creative']['ctaTextCharRemaining'] = 20 - e.currentTarget.value.length;
                                      updateCreativeSectionPayload(modifiedPayload, 'creative');
                                    }}
                                    error={Boolean(touched.ctaText && errors.ctaText)}
                                    helperText={touched.ctaText && errors.ctaText}
                                  />
                                  {(state.formValues.creative.ctaTextCharRemaining >= 0 && state.formValues.creative.ctaText.length !== 0)
                                    && <p>{state.formValues.creative.ctaTextCharRemaining} {t('TEXT_FIELD_CHARACTERS_REMAINING')}</p>}
                                </Grid>
                                <Grid item xs={12} md={6}>
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
                                    <p className="error-wrap error" style={{ position: 'inherit' }}>{objectiveFieldError['packageName']}</p>
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
                  <div className="cc-global-buttons registration-btn">
                    <Button
                      variant="outlined"
                      color="primary"
                      type="button" onClick={(e) => updateCreativeSectionPayload(state.formValues, state.formValues.registration.campaignType === 'pushInApp' ? 'secondaryTemplate' : 'template')}>
                      {t('BACK_BUTTON')}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={!isValid || isDisableContinueButton || buttonListArrayHasError ||
                        (iconUploadOptions && Object.keys(state.formValues.creative.notificationImageContent).length === 0) || (state.formValues.template.primaryTemplateType === 'richImage' &&
                          Object.keys(state.formValues.creative.richNotificationImageContent).length === 0)}
                      startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                    >
                      {t('CONTINUE_BUTTON')}
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </S.Container>
      </Grid>
      <Grid item md={4} xs={12}>
        <MobilePreview template={modifyTemplateType(state.formValues.template.primaryTemplateType)}
          format={modifyCampaignType(state.formValues.registration.campaignType)}
          objectiveType={state.formValues.registration.campaignObjectiveName}
          ctaText={state.formValues.registration.campaignType === 'push' ? state.formValues.creative.ctaText : ''}
          cpType={state.formValues.registration.cpType}
          campaignType={state.formValues.registration.campaignType === 'pushInApp' ? 'PUSH_INAPP' : state.formValues.registration.campaignType?.toUpperCase()}
          message={{
            title: state.formValues.creative.subject,
            body: state.formValues.template.primaryTemplateType === 'richText'
              ? state.formValues.creative?.richNotificationMessageBody?.substring(0, 35) : state.formValues.creative.message,
            text: state.formValues.creative.richNotificationMessageBody,
            button: state.formValues.registration.cpType === 'MONETIZATION' ? [] : state.formValues.registration.campaignObjectiveName !== 'showMessage' ? [] : !buttonPersonalizationOptions ? [] : modifyButtonList(state.formValues.creative.buttons),
            icon: iconUploadOptions ? state.formValues.creative.notificationImageContent?.imageUrl : '',
            banner: state.formValues.creative.richNotificationImageContent?.imageUrl
          }} />
      </Grid>
    </Grid >
  );
}

export default CreativePush;
