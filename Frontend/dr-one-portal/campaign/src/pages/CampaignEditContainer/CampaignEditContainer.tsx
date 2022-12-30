import React, { useContext, useEffect, useState } from "react";
import * as S from "./CampaignEditContainer.styles";
import Registration from "../CampaignCreateContainer/Registration/Registration";
import CampaignProgrssBar from "../CampaignCreateContainer/CampaignProgressBar/CampaignProgressBar";
import Template from "../CampaignCreateContainer/Template/Template";
import CreativePush from "../CampaignCreateContainer/CreativePush/CreativePush";
import CreativeInApp from "../CampaignCreateContainer/CreativeInApp/CreativeInApp";
import SecondaryTemplate from "../CampaignCreateContainer/SecondaryTemplate/SecondaryTemplate";
import Survey from "../CampaignCreateContainer/Survey/Survey";
import { GlobalContext, addDay, inAppAddDay } from "../../context/globalState";
import Settings from "../CampaignCreateContainer/Settings/Settings";
import { apiDashboard, helper, days, timezones } from "@dr-one/utils";
import { CAMPAIGN_ACTIONS } from "../../context/CampaignFormReducer";
import { v1 } from "uuid";
import { useTranslation } from 'react-i18next';

function CampaignEditContainer(props) {
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const [campaignData, setCampaignData] = useState(Object);
  const { t } = useTranslation();
  const userData = JSON.parse(localStorage.getItem('dr-user'));
  const orgIndex = userData.organizations.findIndex(orgDetail => orgDetail.id === userData.organizationActive);
  const isIUUser = orgIndex > -1 ? userData.organizations[orgIndex].legacy : false;
  const timezone = orgIndex > -1 ? userData.organizations[orgIndex].timeZone : 'America/Sao_Paulo';

  useEffect(() => {
    apiDashboard
      .get(`campaign-mgmt-api/campaigns/v2/${props.match.params.id}`)
      .then(response => {
        setCampaignData(response.data.data);
        const modifiedPayload = Object.assign({}, state.formValues);
        modifiedPayload['registration'] = {
          name: response?.data?.data?.name,
          agencyId: (response.data?.data?.agency && response.data?.data?.agency?.id) ? response.data?.data?.agency?.id : '',
          advertiserId: (response.data?.data?.advertiser && response.data?.data?.advertiser?.id) ? response.data?.data?.advertiser?.id : '',
          campaignObjectiveId: (response.data?.data?.campaignObjective && response.data?.data?.campaignObjective?.id) ? response.data?.data?.campaignObjective?.id : '',
          campaignCategoryName: response.data?.data?.campaignCategoryId ? response.data?.data?.campaignCategoryId : '',
          goToWeb: response.data?.data?.notification?.goToWeb || '',
          campaignType: response.data?.data?.campaignType ? modifyCampaignType(response.data?.data?.campaignType) : getCampaignTypeForV1(response.data?.data),
          campaignObjectiveName: response.data?.data?.campaignObjective?.fields[0],
          packageNameToOpenApp: response.data?.data?.notification?.packageNameToOpenApp || '',
          packageNameToInstallApp: response.data?.data?.notification?.packageNameToInstallApp?.appUrl || '',
          packageName: response.data?.data?.notification?.packageNameToInstallApp?.packageName || '',
          phoneToCall: response.data?.data?.notification?.phoneToCall || '',
          actionInTheApp: response.data?.data?.notification?.actionInTheApp || '',
          emailDistributionList: response.data?.data?.emailDistributionList ? response.data?.data?.emailDistributionList.toString()
            : '',
          insertionOrderId: response.data?.data?.insertionOrderId ? response.data?.data?.insertionOrderId : '',
          cpType: response.data?.data?.purposeType ? response.data?.data?.purposeType : isIUUser ? 'MONETIZATION' : response.data?.data?.purposeType === null ? 'MONETIZATION' : 'ENGAGEMENT',
          isCampaignNameValid: true
        }
        modifiedPayload['campaignVersion'] = response.data?.data?.version;
        if (modifiedPayload['registration']['campaignObjectiveName'] === 'displayOnlyAd') {
          modifiedPayload['registration']['campaignObjectiveName'] = 'showMessage';
        }

        let primaryTemplate, secondaryTemplate;
        if (modifyCampaignType(response.data?.data?.campaignType) === 'pushInApp') {
          const template = response.data?.data?.adTemplateType?.split('_');
          primaryTemplate = template && template.length !== 0 ? modifyTemplateType(template[0]) : '';
          secondaryTemplate = template && template.length !== 0 ? modifyTemplateType(template[1]) : '';
        }
        modifiedPayload['template'] = {
          primaryTemplateType: (response.data?.data?.purposeType === null || !response.data?.data?.adTemplateType) ? getTemplateTypeForV1(response.data?.data.notification) : modifyCampaignType(response.data?.data?.campaignType) !== 'pushInApp' ? modifyTemplateType(response.data?.data?.adTemplateType) : primaryTemplate,
          secondaryTemplateType: (response.data?.data?.purposeType === null || !response.data?.data?.adTemplateType) ? getSecondryTemplateTypeForV1(response.data?.data) : modifyCampaignType(response.data?.data?.campaignType) === 'pushInApp' ? secondaryTemplate : ''
        }
        if (modifiedPayload['registration']['cpType'] === 'ENGAGEMENT') {
          modifiedPayload['template']['targetSDKVersion'] = '4.0.0';
        } else {
          if (modifiedPayload['registration']['campaignObjectiveName'] === 'surveyAd') {
            const isSurveyAlternativeOtherOptionPresent = response.data?.data?.survey?.questions.filter(question => question.other !== null);
            const isSurveyAlternativeNoneOfTheAbovePresent = response.data?.data?.survey?.questions.filter(question => question.noneOfTheAbove !== null);
            const isRouteOptionsPresentArray = response.data?.data?.survey?.questions.filter(question => question.routeOptions !== null);

            if (isSurveyAlternativeOtherOptionPresent === undefined && isSurveyAlternativeNoneOfTheAbovePresent === undefined
              && isRouteOptionsPresentArray === undefined) {
              modifiedPayload['template']['targetSDKVersion'] = '3.2.0';
            } else {
              if (isRouteOptionsPresentArray === undefined && (isSurveyAlternativeOtherOptionPresent !== undefined || isSurveyAlternativeNoneOfTheAbovePresent !== undefined)) {
                if (isSurveyAlternativeOtherOptionPresent?.length !== 0 || isSurveyAlternativeNoneOfTheAbovePresent?.length !== 0) {
                  modifiedPayload['template']['targetSDKVersion'] = '4.5.0';
                } else {
                  modifiedPayload['template']['targetSDKVersion'] = '3.2.0';
                }
              } else {
                if (isRouteOptionsPresentArray.length !== 0) {
                  const isConditionalPathQuestionPresent = isRouteOptionsPresentArray.some(question => question => question.routeOptions.type === 'C');
                  if (isConditionalPathQuestionPresent) {
                    modifiedPayload['template']['targetSDKVersion'] = '4.5.0';
                  } else {
                    modifiedPayload['template']['targetSDKVersion'] = '3.2.0';
                  }
                } else {
                  modifiedPayload['template']['targetSDKVersion'] = '3.2.0';
                }
              }
            }
          } else {
            if (modifiedPayload['registration']['campaignObjectiveName'] === 'showMessage') {
              modifiedPayload['template']['targetSDKVersion'] = '2.16.0';
            } else {
              if (modifiedPayload['template']['primaryTemplateType'] === 'richText' || modifiedPayload['template']['primaryTemplateType'] === 'richImage') {
                modifiedPayload['template']['targetSDKVersion'] = '2.9.0';
              } else {
                modifiedPayload['template']['targetSDKVersion'] = '2.7.0';
              }
            }
          }
        }
        let buttonsArray = [], buttonsArrayInApp = [];
        let buttonTextError;
        let ctaLinkError;
        let ctaText;

        if (modifiedPayload['registration']['campaignObjectiveName'] === 'showMessage') {
          if (modifiedPayload['registration']['cpType'] === 'ENGAGEMENT') {
            if (response.data?.data?.notification?.buttons.length !== 0) {
              response.data?.data?.notification?.buttons.forEach(buttonElem => {
                if (buttonElem?.label.length === 0) {
                  buttonTextError = t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR');
                } else {
                  if (buttonElem?.label.length > 20) {
                    buttonTextError = t('CREATIVE_CTA_TEXT_MAX_LENGTH_ERROR');
                  } else {
                    if (!/^[^.\s]/.test(buttonElem?.label)) {
                      buttonTextError = t('CREATIVE_BUTTON_TEXT_INVALID_ERROR');
                    } else {
                      buttonTextError = '';
                    }
                  }
                }
                if (buttonElem?.ctaLink.length === 0) {
                  ctaLinkError = t('CREATIVE_LINK_REQUIRED_ERROR');
                } else {
                  if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(buttonElem?.ctaLink)) {
                    ctaLinkError = t('CREATIVE_LINK_INVALID_ERROR');
                  } else {
                    ctaLinkError = '';
                  }
                }
                buttonsArray.push({
                  buttonText: buttonElem.label ? helper.trimString(buttonElem.label) : '',
                  ctaLink: buttonElem.ctaLink,
                  buttonTextError: buttonTextError,
                  isButtonTextError: buttonTextError.length === 0 ? false : true,
                  ctaLinkError: ctaLinkError,
                  isCtaLinkError: ctaLinkError.length === 0 ? false : true,
                  buttonTextCharRemaining: buttonElem.label ? (20 - helper.trimString(buttonElem.label).length) : -1
                });
              })
              ctaText = 'See More';
            } else {
              buttonsArray = [{
                buttonText: "",
                ctaLink: "",
                buttonTextError: t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR'),
                isButtonTextError: true,
                ctaLinkError: t('CREATIVE_LINK_REQUIRED_ERROR'),
                isCtaLinkError: true,
                buttonTextCharRemaining: -1
              }];
              ctaText = 'See More';
            }
          } else {
            buttonsArray = [{
              buttonText: "",
              ctaLink: "",
              buttonTextError: t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR'),
              isButtonTextError: true,
              ctaLinkError: t('CREATIVE_LINK_REQUIRED_ERROR'),
              isCtaLinkError: true,
              buttonTextCharRemaining: -1
            }];
            ctaText = 'See More';
          }
        } else {
          buttonsArray = [{
            buttonText: "",
            ctaLink: "",
            buttonTextError: t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR'),
            isButtonTextError: true,
            ctaLinkError: t('CREATIVE_LINK_REQUIRED_ERROR'),
            isCtaLinkError: true,
            buttonTextCharRemaining: -1
          }];
          ctaText = response.data?.data?.notification?.adActionText ? response.data?.data?.notification?.adActionText : 'See More';
        }
        modifiedPayload['creative'] = {
          subject: response.data?.data?.notification?.subject ? response.data?.data?.notification?.subject : '',
          message: response.data?.data?.notification?.message ? response.data?.data?.notification?.message : '',
          subjectCharRemaining: response.data?.data?.notification?.subject ? (25 - (response.data?.data?.notification?.subject.length)) : -1,
          messageCharRemaining: response.data?.data?.notification?.message ? (35 - (response.data?.data?.notification?.message.length)) : -1,
          richNotificationMessageBody: response.data?.data?.notification?.richNotificationMessageBody ? response.data?.data?.notification?.richNotificationMessageBody : '',
          richNotificationMessgaeBodyCharRemaining: response.data?.data?.notification?.richNotificationMessageBody ? (250 - (response.data?.data?.notification?.richNotificationMessageBody.length)) : -1,
          iconUploadOptions: response.data?.data?.notificationImageContent ? true : false,
          buttonPersonalizationOptions: modifiedPayload['registration']['campaignObjectiveName'] !== 'showMessage' ? false : (response.data?.data?.notification?.buttons && response.data?.data?.notification?.buttons?.length !== 0) ? true : false,
          buttons: buttonsArray,
          notificationImageContent: response.data?.data?.notificationImageContent ? response.data?.data?.notificationImageContent : {},
          richNotificationImageContent: response.data?.data?.notification?.richNotificationLargeImageContent ? response.data?.data?.notification?.richNotificationLargeImageContent : {},
          ctaText: ctaText,
          ctaTextCharRemaining: 20 - ctaText.length,
          ctaTextInApp: ctaText,
          ctaTextInAppCharRemaining: 20 - ctaText.length,
          fullImageContent: response.data?.data?.fullImageContent ? response.data?.data?.fullImageContent : {},
          mainImageContent: response.data?.data?.mainImageContent ? response.data?.data?.mainImageContent : {},
          videoContent: (response.data?.data?.videoContent && (response.data?.data?.videoContent?.videoFileId
            || response.data?.data?.videoContent?.externalVideoUrl)) ? response.data?.data?.videoContent : {},
          gifImageContent: (response.data?.data?.videoContent && response.data?.data?.videoContent?.gifFileId) ? response.data?.data?.videoContent : {}
        }
        if (response.data?.data?.campaignObjective?.fields[0] === 'surveyAd') {
          if (response.data?.data?.survey) {
            modifiedPayload['creative']['selectedSurvey'] = response.data?.data?.survey;
            modifiedPayload['creative']['surveyQuestionDetails'] = response.data?.data?.survey?.questions;
            modifiedPayload['creative']['selectedSurvey']['finalBannerUrl'] = (response.data?.data?.survey && response.data?.data?.survey?.finalBannerImageContent) ? response.data?.data?.survey?.finalBannerImageContent?.imageUrl : '';
            modifiedPayload['creative']['selectedSurvey']['welcomeBannerUrl'] = (response.data?.data?.survey && response.data?.data?.survey?.welcomeBannerImageContent) ? response.data?.data?.survey?.welcomeBannerImageContent?.imageUrl : '';
          } else {
            modifiedPayload['creative']['selectedSurvey'] = {};
            modifiedPayload['creative']['surveyQuestionDetails'] = [];
          }
        } else {
          modifiedPayload['creative']['selectedSurvey'] = {};
          modifiedPayload['creative']['surveyQuestionDetails'] = [];
        }

        modifiedPayload['creative']['sequenceArrayFullPagePopUpTopBottomBanner'] = ['image', 'messageContent', 'cta'];
        modifiedPayload['creative']['sequenceArrayFullPageVideo'] = ['image', 'video', 'messageContent', 'cta'];
        modifiedPayload['creative']['sequenceArray'] = ['image', 'messageContent', 'cta'];

        if (modifiedPayload['registration']['cpType'] === 'ENGAGEMENT') {
          if (response.data?.data?.engagement) {
            if (modifiedPayload['registration']['campaignType'] !== 'push') {
              if (response.data?.data?.engagement?.in_app_content?.some(eleType => eleType.type === 'text')) {
                const titleIndex = response.data?.data?.engagement?.in_app_content?.findIndex(ele => ele.type === 'text' && ele.style === 'bold');
                modifiedPayload['creative']['subjectInApp'] = titleIndex > -1 ? response.data?.data?.engagement?.in_app_content[titleIndex].text : '';
                modifiedPayload['creative']['subjectInAppCharRemaining'] = modifiedPayload['creative']['subjectInApp'] ? (25 - modifiedPayload['creative']['subjectInApp'].length) : -1;
                const smallMessageIndex = response.data?.data?.engagement?.in_app_content?.findIndex(ele => ele.type === 'text' && ele.style === 'regular');
                modifiedPayload['creative']['messageInApp'] = smallMessageIndex > -1 ? response.data?.data?.engagement?.in_app_content[smallMessageIndex].text : '';
                modifiedPayload['creative']['messageInAppCharRemaining'] = modifiedPayload['creative']['messageInApp'] ? (35 - modifiedPayload['creative']['messageInApp'].length) : -1;
              }
              if (response.data?.data?.engagement?.in_app_content?.some(eleType => eleType.type === 'button')) {
                const filteredButtonArray = response.data?.data?.engagement?.in_app_content.filter(ele => {
                  return ele.type === 'button';
                })
                if (modifiedPayload['registration']['campaignObjectiveName'] === 'showMessage') {
                  if (filteredButtonArray.length !== 0) {
                    filteredButtonArray.forEach(buttonElm => {
                      if (buttonElm?.text.length === 0) {
                        buttonTextError = t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR');
                      } else {
                        if (buttonElm?.text.length > 20) {
                          buttonTextError = t('CREATIVE_CTA_TEXT_MAX_LENGTH_ERROR');
                        } else {
                          if (!/^[^.\s]/.test(buttonElm?.text)) {
                            buttonTextError = t('CREATIVE_BUTTON_TEXT_INVALID_ERROR');
                          } else {
                            buttonTextError = '';
                          }
                        }
                      }
                      if (buttonElm?.deeplink.length === 0) {
                        ctaLinkError = t('CREATIVE_LINK_REQUIRED_ERROR');
                      } else {
                        if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(buttonElm?.deeplink)) {
                          ctaLinkError = t('CREATIVE_LINK_INVALID_ERROR');
                        } else {
                          ctaLinkError = '';
                        }
                      }
                      buttonsArrayInApp.push({
                        buttonText: buttonElm.text ? helper.trimString(buttonElm.text) : '',
                        ctaLink: buttonElm.deeplink,
                        buttonTextError: buttonTextError,
                        isButtonTextError: buttonTextError.length === 0 ? false : true,
                        ctaLinkError: ctaLinkError,
                        isCtaLinkError: ctaLinkError.length === 0 ? false : true,
                        buttonTextCharRemaining: buttonElm.text ? (20 - helper.trimString(buttonElm.text).length) : -1
                      })
                    })
                    modifiedPayload['creative']['buttonsInApp'] = buttonsArrayInApp;
                    modifiedPayload['creative']['buttonPersonalizationOptionsInApp'] = true;
                  } else {
                    modifiedPayload['creative']['buttonsInApp'] = [{
                      buttonText: "",
                      ctaLink: "",
                      buttonTextError: t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR'),
                      isButtonTextError: true,
                      ctaLinkError: t('CREATIVE_LINK_REQUIRED_ERROR'),
                      isCtaLinkError: true,
                      buttonTextCharRemaining: -1
                    }];
                    modifiedPayload['creative']['buttonPersonalizationOptionsInApp'] = false;
                  }
                } else {
                  modifiedPayload['creative']['buttonPersonalizationOptionsInApp'] = false;
                  modifiedPayload['creative']['buttonsInApp'] = [{
                    buttonText: "",
                    ctaLink: "",
                    buttonTextError: t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR'),
                    isButtonTextError: true,
                    ctaLinkError: t('CREATIVE_LINK_REQUIRED_ERROR'),
                    isCtaLinkError: true,
                    buttonTextCharRemaining: -1
                  }];
                }
              } else {
                modifiedPayload['creative']['buttonPersonalizationOptionsInApp'] = false;
                modifiedPayload['creative']['buttonsInApp'] = [{
                  buttonText: "",
                  ctaLink: "",
                  buttonTextError: t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR'),
                  isButtonTextError: true,
                  ctaLinkError: t('CREATIVE_LINK_REQUIRED_ERROR'),
                  isCtaLinkError: true,
                  buttonTextCharRemaining: -1
                }];
              }
            } else {
              modifiedPayload['creative']['buttonPersonalizationOptionsInApp'] = false;
              modifiedPayload['creative']['subjectInApp'] = '';
              modifiedPayload['creative']['messageInApp'] = '';
              modifiedPayload['creative']['subjectInAppCharRemaining'] = -1;
              modifiedPayload['creative']['messageInAppCharRemaining'] = -1;
              modifiedPayload['creative']['buttonsInApp'] = [{
                buttonText: "",
                ctaLink: "",
                buttonTextError: t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR'),
                isButtonTextError: true,
                ctaLinkError: t('CREATIVE_LINK_REQUIRED_ERROR'),
                isCtaLinkError: true,
                buttonTextCharRemaining: -1
              }];
            }
          } else {
            modifiedPayload['creative']['buttonPersonalizationOptionsInApp'] = false;
            modifiedPayload['creative']['subjectInApp'] = '';
            modifiedPayload['creative']['messageInApp'] = '';
            modifiedPayload['creative']['subjectInAppCharRemaining'] = -1;
            modifiedPayload['creative']['messageInAppCharRemaining'] = -1;
            modifiedPayload['creative']['buttonsInApp'] = [{
              buttonText: "",
              ctaLink: "",
              buttonTextError: t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR'),
              isButtonTextError: true,
              ctaLinkError: t('CREATIVE_LINK_REQUIRED_ERROR'),
              isCtaLinkError: true,
              buttonTextCharRemaining: -1
            }];
          }
        } else {
          modifiedPayload['creative']['buttonPersonalizationOptionsInApp'] = false;
          modifiedPayload['creative']['subjectInApp'] = '';
          modifiedPayload['creative']['subjectInAppCharRemaining'] = -1;
          modifiedPayload['creative']['messageInApp'] = '';
          modifiedPayload['creative']['messageInAppCharRemaining'] = -1;
          modifiedPayload['creative']['buttonsInApp'] = [{
            buttonText: "",
            ctaLink: "",
            buttonTextError: t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR'),
            isButtonTextError: true,
            ctaLinkError: t('CREATIVE_LINK_REQUIRED_ERROR'),
            isCtaLinkError: true,
            buttonTextCharRemaining: -1
          }];
        }

        let isError, errorObject = {
          packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
          packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
        };
        if (modifiedPayload.registration?.campaignObjectiveName === 'packageNameToOpenApp') {
          if (response.data?.data?.notification?.packageNameToOpenApp.length === 0) {
            isError = true;
          } else {
            if (!/^[^\s]+(\s+[^\s]+)*$/.test(response.data?.data?.notification?.packageNameToOpenApp)) {
              isError = true;
            } else {
              isError = false;
            }
          }
          if (response.data?.data?.container?.packageNameToOpenApp) {
            if (!/^[^\s]+(\s+[^\s]+)*$/.test(response.data?.data?.container?.packageNameToOpenApp)) {
              errorObject['packageNameToOpenApp'] = t('PACKAGE_NAME_IVALID_ERROR');
            } else {
              errorObject['packageNameToOpenApp'] = '';
            }
          }
        } else if (modifiedPayload.registration?.campaignObjectiveName === 'goToWeb') {
          if (response.data?.data?.notification?.goToWeb.length === 0) {
            isError = true;
          } else {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.notification?.goToWeb)) {
              isError = true;
            } else {
              isError = false;
            }
          }
          if (response.data?.data?.container?.goToWeb) {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.container?.goToWeb)) {
              errorObject['goToWeb'] = t('URL_INVALID_ERROR');
            } else {
              errorObject['goToWeb'] = '';
            }
          }
        } else if (modifiedPayload.registration?.campaignObjectiveName === 'packageNameToInstallApp') {
          if (response.data?.data?.notification?.packageNameToInstallApp?.appUrl.length === 0
            || response.data?.data?.notification?.packageNameToInstallApp?.packageName.length === 0) {
            isError = true;
          } else {
            if ((!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.notification?.packageNameToInstallApp?.appUrl))
              || (!/^([A-Za-z]{1}[A-Za-z\d_]*\.)*[A-Za-z][A-Za-z\d_]*$/.test(response.data?.data?.notification?.packageNameToInstallApp?.packageName))
            ) {
              isError = true;
            } else {
              isError = false;
            }
          }
          if (response.data?.data?.container?.packageNameToInstallApp && response.data?.data?.container?.packageNameToInstallApp?.appUrl) {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.container?.packageNameToInstallApp?.appUrl)) {
              errorObject['packageNameToInstallApp'] = t('URL_INVALID_ERROR');
            } else {
              errorObject['packageNameToInstallApp'] = '';
            }
          }
          if (response.data?.data?.container?.packageNameToInstallApp && response.data?.data?.container?.packageNameToInstallApp?.packageName) {
            if (!/^([A-Za-z]{1}[A-Za-z\d_]*\.)*[A-Za-z][A-Za-z\d_]*$/.test(response.data?.data?.container?.packageNameToInstallApp?.packageName)) {
              errorObject['packageName'] = t('PACKAGE_NAME_INSTALL_INVALID_ERROR');
            } else {
              errorObject['packageName'] = '';
            }
          }
        } else if (modifiedPayload.registration?.campaignObjectiveName === 'phoneToCall') {
          if (response.data?.data?.notification?.phoneToCall.length === 0) {
            isError = true;
          } else {
            if (!/^((^[\*\#\+]?[0-9]{2,4}[\*\#\+]?)|(((\+[0-9]{1,2})|0)?[\s\-]?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{2,5}))?$/.test(response.data?.data?.notification?.phoneToCall)) {
              isError = true;
            } else {
              isError = false;
            }
          }
          if (response.data?.data?.container?.phoneToCall) {
            if (!/^((^[\*\#\+]?[0-9]{2,4}[\*\#\+]?)|(((\+[0-9]{1,2})|0)?[\s\-]?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{2,5}))?$/.test(response.data?.data?.container?.phoneToCall)) {
              errorObject['phoneToCall'] = t('PHONE_NUMBER_INVALID_ERROR');
            } else {
              errorObject['phoneToCall'] = '';
            }
          }
        } else if (modifiedPayload.registration?.campaignObjectiveName === 'actionInTheApp') {
          if (response.data?.data?.notification?.actionInTheApp.length === 0) {
            isError = true;
          } else {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.notification?.actionInTheApp)) {
              isError = true;
            } else {
              isError = false;
            }
          }
          if (response.data?.data?.container?.actionInTheApp) {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.container?.actionInTheApp)) {
              errorObject['actionInTheApp'] = t('URL_INVALID_ERROR');
            } else {
              errorObject['actionInTheApp'] = '';
            }
          }
        } else if (modifiedPayload.registration?.campaignObjectiveName === 'showMessage') {
          if (!response.data?.data.adTemplateType) {
            isError = true;
          }
        }
        modifiedPayload['creative']['creativeSectionObjectiveFieldError'] = errorObject;
        modifiedPayload['registration']['isRegistrationSectionValid'] = !isError;

        modifiedPayload['creative']['adDisplayTimeBehaviour'] = response.data?.data?.adDisplayTimeBehaviour ? response.data?.data?.adDisplayTimeBehaviour
          : 'NONE';
        modifiedPayload['creative']['minimumAdDisplayTimeModified'] = true;
        if (modifiedPayload['creative']['adDisplayTimeBehaviour'] === 'NONE' || modifiedPayload['creative']['adDisplayTimeBehaviour'] === 'SHOW_FULL') {
          modifiedPayload['creative']['minimumAdDisplayTime'] = 0;
        } else {
          if (response.data?.data?.minimumAdDisplayTime) {
            modifiedPayload['creative']['minimumAdDisplayTime'] = response.data?.data?.minimumAdDisplayTime;
          } else {
            if (modifiedPayload['template']['primaryTemplateType'] === 'fullPage' || modifiedPayload['template']['secondaryTemplateType'] === 'fullPage' ||
              modifiedPayload['template']['primaryTemplateType'] === 'popup' || modifiedPayload['template']['secondaryTemplateType'] === 'popup' ||
              modifiedPayload['template']['primaryTemplateType'] === 'topBanner' || modifiedPayload['template']['secondaryTemplateType'] === 'topBanner' ||
              modifiedPayload['template']['primaryTemplateType'] === 'bottomBanner' || modifiedPayload['template']['secondaryTemplateType'] === 'bottomBanner') {
              modifiedPayload['creative']['minimumAdDisplayTime'] = 15;
            } else if (modifiedPayload['template']['primaryTemplateType'] === 'fullPageWithVideo' || modifiedPayload['template']['secondaryTemplateType'] === 'fullPageWithVideo' ||
              modifiedPayload['template']['primaryTemplateType'] === 'popupWithVideo' || modifiedPayload['template']['secondaryTemplateType'] === 'popupWithVideo') {
              modifiedPayload['creative']['minimumAdDisplayTime'] = 30;
            }
          }
        }
        modifiedPayload['settings']['metrics'] = {
          typePerformance: modifiedPayload['registration']['cpType'] === 'ENGAGEMENT' ? 'CPM' :
            response.data?.data?.performance?.type ? (!response.data?.data?.videoContent && response.data?.data?.performance?.type === 'CPV')
              ? 'CPM' : response.data?.data?.performance?.type : '',
          target: modifiedPayload['registration']['cpType'] === 'ENGAGEMENT' ? 10000000
            : response.data?.data?.performance?.maximumMetric ? response.data?.data?.performance?.maximumMetric : '',
          ctr: modifiedPayload['registration']['cpType'] === 'ENGAGEMENT'
            ? '' : response.data?.data?.performance?.type === 'CPM' ? '' : response.data?.data?.performance?.assumedPerformance ? response.data?.data?.performance?.assumedPerformance : 5,
          reach: modifiedPayload['registration']['cpType'] === 'ENGAGEMENT'
            ? '' : response.data?.data?.performance?.assumedImpressionRate ? response.data?.data?.performance?.assumedImpressionRate : 70,
          cpc: modifiedPayload['registration']['cpType'] === 'ENGAGEMENT'
            ? '' : response.data?.data?.performance?.proposedPrice ? response.data?.data?.performance?.proposedPrice : '',
          impressions: (response.data?.data?.performance?.maximumMetric && Number(response.data?.data?.performance?.maximumMetric) > 0) &&
            (response.data?.data?.performance?.assumedPerformance && Number(response.data?.data?.performance?.assumedPerformance > 0)) &&
            (response.data?.data?.performance?.assumedImpressionRate && Number(response.data?.data?.performance?.assumedImpressionRate > 0)) ?
            response.data?.data?.performance?.type === 'CPM' ? Math.ceil((response.data?.data?.performance?.maximumMetric * 1000) / (response.data?.data?.performance?.assumedImpressionRate / 100))
              : Math.ceil(response.data?.data?.performance?.maximumMetric / (response.data?.data?.performance?.assumedImpressionRate / 100) / (response.data?.data?.performance?.assumedPerformance / 100)) : 'Total',
          totalCost: (response.data?.data?.performance?.maximumMetric && Number(response.data?.data?.performance?.maximumMetric) > 0) && (response.data?.data?.performance?.proposedPrice && Number(response.data?.data?.performance?.proposedPrice) > 0) ? (Number(response.data?.data?.performance?.maximumMetric) * Number(response.data?.data?.performance?.proposedPrice)) : 'Total',
        };

        modifiedPayload['settings']['clusterArray'] = response.data?.data?.audienceClusters ?
          JSON.parse(response.data?.data?.audienceClusters) : {
            condition: "ALL",
            list: [
              {
                operation: 'INCLUDE',
                condition: "ANY",
                list: [{
                  id: "",
                  name: "",
                }]
              }
            ]
          };
        modifiedPayload['settings']['isCallReachCountApi'] = response.data?.data?.audienceClusters ? true : false;
        let isClusterValid;
        if (JSON.parse(response.data?.data?.audienceClusters)?.list) {
          if (JSON.parse(response.data?.data?.audienceClusters).list.length === 0) {
            isClusterValid = false;
          } else {
            isClusterValid = true;
          }
        } else {
          isClusterValid = false;
        }
        modifiedPayload['settings']['isSettingSectionValid']['isClusterSectionValid'] = isClusterValid;
        let weekDays = [];
        if (response.data?.data?.distribution?.times) {
          if (response.data?.data?.distribution?.times.length !== 0) {
            response.data?.data?.distribution?.times.forEach((day) => {
              weekDays.push({ id: v1(), day: helper.convertWeekNumberToDay(day.dayOfWeek), time: helper.secondsToDate(day.startTime), dayError: '' })
            })
          } else {
            weekDays = [addDay(days[new Date().getDay()])];
          }
        } else {
          weekDays = [addDay(days[new Date().getDay()])];
        }

        let inAppWeekDays = [];
        if (response.data?.data?.distribution?.inappTimes) {
          if (response.data?.data?.distribution?.inappTimes.length !== 0) {
            response.data?.data?.distribution?.inappTimes.forEach((day) => {
              inAppWeekDays.push({
                id: v1(), day: helper.convertWeekNumberToDay(day.dayOfWeek), time: [day.startTime ? ((day.startTime + 1) / 60) : 2,
                day.endTime ? ((day.endTime + 1) / 60) : 5], dayError: ''
              })
            })
          } else {
            inAppWeekDays = [inAppAddDay(days[new Date().getDay()])];
          }
        } else {
          inAppWeekDays = [inAppAddDay(days[new Date().getDay()])];
        }
        let expiryDate;
        if (response.data?.data?.version === '2.0') {
          if (response.data?.data?.distribution?.expirationDate) {
            expiryDate = helper.convertDateToObject(response.data?.data?.distribution?.expirationDate);
          } else {
            expiryDate = null;
          }
        } else {
          if (!response.data?.data?.distribution?.endDate) {
            expiryDate = null;
          } else {
            if (response.data?.data?.distribution?.expirationDate) {
              expiryDate = helper.convertDateToObject(response.data?.data?.distribution?.expirationDate);
            } else {
              expiryDate = null;
            }
          }
        }
        modifiedPayload['settings']['schedule'] = {
          network: response.data?.data?.distributionNetwork?.type,
          // timezone: response.data?.data?.distribution?.timeZone ? response.data?.data?.distribution?.timeZone : timezones.includes(Intl.DateTimeFormat().resolvedOptions().timeZone) ? Intl.DateTimeFormat().resolvedOptions().timeZone : '',
          timezone: timezone,
          repeat: modifyCampaignType(response.data?.data?.campaignType) === 'inApp' ? true : response.data?.data?.distribution?.distributionAllocation === 'RETARGET' ? true : false,
          distributeInTime: (response.data?.data?.version === '2.0' && response.data?.data?.distribution?.isDistributeInTime) ? response.data?.data?.distribution?.isDistributeInTime :
            (response.data?.data?.distribution?.times && response.data?.data?.distribution?.times.length !== 0) ? true : false,
          startAt: response.data?.data?.distribution?.startDate ? helper.convertDateToObject(response.data?.data?.distribution?.startDate) : new Date(),
          endAt: setEndDate(response.data?.data?.distribution, modifyCampaignType(response.data?.data?.campaignType), response.data?.data?.version),
          expAt: expiryDate,
          targetBehavior: response.data?.data?.distribution?.reTargetOption || 'ALL_AUDIENCE',
          scheduleBehavior: response.data?.data?.distribution?.reTargetOptionForMultipleSlots || 'DAILY',
          weekDays: weekDays,
          repeatEvery: "day",
          multiShow: response.data?.data?.distribution?.multiShow || false,
          multiShowRangeType: response.data?.data?.distribution?.multiShowRangeType || 'DAY',
          repeatMany: response.data?.data?.distribution?.multiShowTimes || 1,
          monthlyDayTime: (response.data?.data?.distribution?.dayOfMonth && (Number(response.data?.data?.distribution?.dayOfMonth) > 31 || Number(response.data?.data?.distribution?.dayOfMonth) <= 0) ? String(1) : String(response.data?.data?.distribution?.dayOfMonth)) || '',
          sendDayTime: [response.data?.data?.distribution?.startTime ? String(response.data?.data?.distribution?.startTime / 60) : '9', response.data?.data?.distribution?.endTime ? String(response.data?.data?.distribution?.endTime / 60) : '20'],
          repeatMonth: response.data?.data?.distribution?.showSpecificDayOfMonth || false,
          specificDays: response.data?.data?.distribution?.showMessageInSpecificTime || false,
          inAppWeekDays: inAppWeekDays
        }
        modifiedPayload['settings']['customTrackerLinks'] = {
          iscommonUrl: response.data?.data?.notification?.customAdTracker?.commonURL ? response.data?.data?.notification?.customAdTracker?.commonURL : false,
          notificationShown: response.data?.data?.notification?.customAdTracker?.eventListURL?.NOTIFICATION ? response.data?.data?.notification?.customAdTracker?.eventListURL?.NOTIFICATION : '',
          notificationClicked: response.data?.data?.notification?.customAdTracker?.eventListURL?.NOTIFICATION_CLICK ? response.data?.data?.notification?.customAdTracker?.eventListURL?.NOTIFICATION_CLICK : '',
          bannerShown: response.data?.data?.notification?.customAdTracker?.eventListURL?.AD_CONTAINER ? response.data?.data?.notification?.customAdTracker?.eventListURL?.AD_CONTAINER : '',
          bannerClicked: response.data?.data?.notification?.customAdTracker?.eventListURL?.CTA ? response.data?.data?.notification?.customAdTracker?.eventListURL?.CTA : '',
          actionComplete: response.data?.data?.notification?.customAdTracker?.eventListURL?.ACTION_COMPLETE ? response.data?.data?.notification?.customAdTracker?.eventListURL?.ACTION_COMPLETE : '',
          surveyOpen: response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_OPEN ? response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_OPEN : '',
          surveyClosed: response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_CLOSED ? response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_CLOSED : '',
          surveyCompleted: response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_COMPLETED ? response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_COMPLETED : '',
          commonUrl: response.data?.data?.notification?.customAdTracker?.url ? response.data?.data?.notification?.customAdTracker?.url : '',
          eventList: response.data?.data?.notification?.customAdTracker?.eventList ? response.data?.data?.notification?.customAdTracker?.eventList : []
        }
        let isCustomTrackerLinkSectionValid;
        if (!response.data?.data?.notification?.customAdTracker?.commonURL) {
          let errorObjectNonCommonUrl = {};
          if (response.data?.data?.notification?.customAdTracker?.eventListURL?.NOTIFICATION) {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.notification?.customAdTracker?.eventListURL?.NOTIFICATION)) {
              errorObjectNonCommonUrl['notificationShown'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_SHOWN_URL_INVALID_ERROR');
            } else {
              if (!response.data?.data?.notification?.customAdTracker?.eventListURL?.NOTIFICATION.includes('{{timestamp}}')) {
                errorObjectNonCommonUrl['notificationShown'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_UNCOMMON_URL_INVALID_FORMAT_ERROR');
              } else {
                errorObjectNonCommonUrl['notificationShown'] = '';
              }
            }
          }
          if (response.data?.data?.notification?.customAdTracker?.eventListURL?.NOTIFICATION_CLICK) {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.notification?.customAdTracker?.eventListURL?.NOTIFICATION_CLICK)) {
              errorObjectNonCommonUrl['notificationClicked'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_NOTIFICATION_CLICKED_URL_INVALID_ERROR');
            } else {
              if (!response.data?.data?.notification?.customAdTracker?.eventListURL?.NOTIFICATION_CLICK.includes('{{timestamp}}')) {
                errorObjectNonCommonUrl['notificationClicked'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_UNCOMMON_URL_INVALID_FORMAT_ERROR');
              } else {
                errorObjectNonCommonUrl['notificationClicked'] = '';
              }
            }
          }
          if (response.data?.data?.notification?.customAdTracker?.eventListURL?.AD_CONTAINER) {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.notification?.customAdTracker?.eventListURL?.AD_CONTAINER)) {
              errorObjectNonCommonUrl['bannerShown'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_SHOWN_URL_INVALID_ERROR');
            } else {
              if (!response.data?.data?.notification?.customAdTracker?.eventListURL?.AD_CONTAINER.includes('{{timestamp}}')) {
                errorObjectNonCommonUrl['bannerShown'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_UNCOMMON_URL_INVALID_FORMAT_ERROR');
              } else {
                errorObjectNonCommonUrl['bannerShown'] = '';
              }
            }
          }
          if (response.data?.data?.notification?.customAdTracker?.eventListURL?.CTA) {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.notification?.customAdTracker?.eventListURL?.CTA)) {
              errorObjectNonCommonUrl['bannerClicked'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_BANNER_CLICKED_URL_INVALID_ERROR');
            } else {
              if (!response.data?.data?.notification?.customAdTracker?.eventListURL?.CTA.includes('{{timestamp}}')) {
                errorObjectNonCommonUrl['bannerClicked'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_UNCOMMON_URL_INVALID_FORMAT_ERROR');
              } else {
                errorObjectNonCommonUrl['bannerClicked'] = '';
              }
            }
          }
          if (response.data?.data?.notification?.customAdTracker?.eventListURL?.ACTION_COMPLETE) {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.notification?.customAdTracker?.eventListURL?.ACTION_COMPLETE)) {
              errorObjectNonCommonUrl['actionComplete'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_ACTION_COMPLETE_URL_INVALID_ERROR');
            } else {
              if (!response.data?.data?.notification?.customAdTracker?.eventListURL?.ACTION_COMPLETE.includes('{{timestamp}}')) {
                errorObjectNonCommonUrl['actionComplete'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_UNCOMMON_URL_INVALID_FORMAT_ERROR');
              } else {
                errorObjectNonCommonUrl['actionComplete'] = '';
              }
            }
          }
          if (response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_OPEN) {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_OPEN)) {
              errorObjectNonCommonUrl['surveyOpen'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_OPEN_URL_INVALID_ERROR');
            } else {
              if (!response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_OPEN.includes('{{timestamp}}')) {
                errorObjectNonCommonUrl['surveyOpen'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_OPEN_URL_INVALID_ERROR');
              } else {
                errorObjectNonCommonUrl['surveyOpen'] = '';
              }
            }
          }
          if (response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_CLOSED) {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_CLOSED)) {
              errorObjectNonCommonUrl['surveyClosed'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_CLOSED_URL_INVALID_ERROR');
            } else {
              if (!response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_CLOSED.includes('{{timestamp}}')) {
                errorObjectNonCommonUrl['surveyClosed'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_CLOSED_URL_INVALID_ERROR');
              } else {
                errorObjectNonCommonUrl['surveyClosed'] = '';
              }
            }
          }
          if (response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_COMPLETED) {
            if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_COMPLETED)) {
              errorObjectNonCommonUrl['surveyCompleted'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_COMPLETED_URL_INVALID_ERROR');
            } else {
              if (!response.data?.data?.notification?.customAdTracker?.eventListURL?.SURVEY_COMPLETED.includes('{{timestamp}}')) {
                errorObjectNonCommonUrl['surveyCompleted'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_SURVEY_COMPLETED_URL_INVALID_ERROR');
              } else {
                errorObjectNonCommonUrl['surveyCompleted'] = '';
              }
            }
          }
          modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl'] = errorObjectNonCommonUrl;
          modifiedPayload['settings']['customTrackerLinks']['protocolWarningObjectNonCommonUrl'] = {
            notificationShown: '',
            notificationClicked: '',
            bannerShown: '',
            bannerClicked: '',
            actionComplete: '',
            surveyOpen: '',
            surveyClosed: '',
            surveyCompleted: ''
          };
          isCustomTrackerLinkSectionValid = Object.values(errorObjectNonCommonUrl).every((urlError: any) => (urlError.length === 0));
          modifiedPayload['settings']['isSettingSectionValid']['isCustomTrackerLinkSectionValid'] = isCustomTrackerLinkSectionValid;
        } else {
          if (!/^(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(response.data?.data?.notification?.customAdTracker?.url)) {
            modifiedPayload['settings']['customTrackerLinks']['commonUrlError'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_INVALID_ERROR');
            modifiedPayload['settings']['isSettingSectionValid']['isCustomTrackerLinkSectionValid'] = false;
          } else {
            if (response.data?.data?.notification?.customAdTracker?.url.includes('{{timestamp}}') &&
              response.data?.data?.notification?.customAdTracker?.url.includes('{{event}}')) {
              if (!response.data?.data?.notification?.customAdTracker?.eventList ||
                (response.data?.data?.notification?.customAdTracker?.eventList && response.data?.data?.notification?.customAdTracker?.eventList.lengh === 0)) {
                modifiedPayload['settings']['customTrackerLinks']['commonUrlError'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_EVENT_ERROR');
                modifiedPayload['settings']['isSettingSectionValid']['isCustomTrackerLinkSectionValid'] = false;
              } else {
                modifiedPayload['settings']['customTrackerLinks']['commonUrlError'] = '';
                modifiedPayload['settings']['isSettingSectionValid']['isCustomTrackerLinkSectionValid'] = true;
              }
            } else {
              modifiedPayload['settings']['customTrackerLinks']['commonUrlError'] = t('SETTINGS_CUSTOM_TRACKER_SECTION_COMMON_URL_INVALID_FORMAT_ERROR');
              modifiedPayload['settings']['isSettingSectionValid']['isCustomTrackerLinkSectionValid'] = false;
            }
          }
          modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl'] = {
            notificationShown: '',
            notificationClicked: '',
            bannerShown: '',
            bannerClicked: '',
            actionComplete: '',
            surveyOpen: '',
            surveyClosed: '',
            surveyCompleted: ''
          }
          modifiedPayload['settings']['customTrackerLinks']['protocolWarningObjectNonCommonUrl'] = {
            notificationShown: '',
            notificationClicked: '',
            bannerShown: '',
            bannerClicked: '',
            actionComplete: '',
            surveyOpen: '',
            surveyClosed: '',
            surveyCompleted: ''
          }
        }
        if (modifiedPayload['registration']['cpType'] === 'ENGAGEMENT') {
          modifiedPayload['settings']['isSettingSectionValid']['isMetricsSectionValid'] = true;
        } else {
          const isErrorPresentInMetrics = (currentValue) => currentValue.length === 0;
          const isMetricsSectionValid = Object.values(metricsSectionValid(modifiedPayload['settings']['metrics']).errorObject).every(isErrorPresentInMetrics);
          modifiedPayload['settings']['isSettingSectionValid']['isMetricsSectionValid'] = isMetricsSectionValid;
        }

        modifiedPayload['settings']['metrics']['performanceError'] = metricsSectionValid(modifiedPayload['settings']['metrics']).errorObject;
        modifiedPayload['settings']['isSettingSectionValid']['isScheduleSectionValid'] = !scheduleSectionValid(modifiedPayload['settings']['schedule'], modifiedPayload['registration']['campaignType']);
        modifiedPayload['campaignStatus'] = response.data?.data?.status;
        modifiedPayload['campaignId'] = response.data?.data?.id;
        modifiedPayload['isCampaignLoaded'] = true;
        modifiedPayload['lockCampaignStatus'] = response.data?.data?.lockCampaign;
        if (response.data?.data?.campaignOptions) {
          const isCampaignOptionObjectValuesInvalid = Object.values(buildCampaignOptionObject(response.data?.data?.campaignOptions)).some((option: any) => !option || option === undefined || option === '' || option?.length === 0);
          modifiedPayload['settings']['isSettingSectionValid']['isCampaignOptionSectionValid'] = !isCampaignOptionObjectValuesInvalid;
          modifiedPayload['settings']['campaignOptionsError'] = isCampaignOptionObjectValuesInvalid ? t('CAMPAIGN_OPTIONS_ERROR') : '';
          modifiedPayload['settings']['campaignOptions'] = response.data?.data?.campaignOptions;
        } else {
          if (response.data?.data?.campaignOptions.length === 0) {
            modifiedPayload['settings']['campaignOptions'] = '';
            modifiedPayload['settings']['campaignOptionsError'] = '';
            modifiedPayload['settings']['isSettingSectionValid']['isCampaignOptionSectionValid'] = true;
          } else {
            modifiedPayload['settings']['campaignOptions'] = 'sendtoactivedevices=true,allowduplicates=false';
            modifiedPayload['settings']['campaignOptionsError'] = '';
            modifiedPayload['settings']['isSettingSectionValid']['isCampaignOptionSectionValid'] = true;
          }
        }
        modifiedPayload['campaignResponse'] = {
          startDate: response.data?.data?.distribution?.startDate,
          campaignType: response.data?.data?.campaignType,
          campaignBoost: {
            targetMetrics: response.data?.data?.campaignBoost?.targetMetrics
          },
          performance: {
            proposedPrice: response.data?.data?.performance?.proposedPrice,
            pricingType: response.data?.data?.performance?.pricingType,
            type: response.data?.data?.performance?.type
          },
          audienceClusters: response.data?.data?.audienceClusters,
          enableVas: response.data?.data?.enableVas,
          enableInterstitial: response.data?.data?.enableInterstitial,
          id: response.data?.data?.id,
          adTemplateType: response.data?.data?.adTemplateType
        }
        modifiedPayload['settings']['isShowClusterWarningFlag'] = true;

        modifiedPayload['initialPayload'] = true;
        if (modifiedPayload['registration']['cpType'] === 'ENGAGEMENT') {
          modifiedPayload['settings']['isSettingSectionValid']['isGeofenceSectionValid'] = true;
          modifiedPayload['settings']['geofence']['enableGeofence'] = false;
          modifiedPayload['settings']['geofence']['locationList'] = [];
          modifiedPayload['settings']['geofence']['locationError'] = '';
          modifiedPayload['settings']['geofence']['geoRadius'] = 100;
        } else {
          modifiedPayload['settings']['geofence']['enableGeofence'] = response.data?.data?.enableGeoFence;
          if (response.data.data?.geoLocationDetail) {
            modifiedPayload['settings']['geofence']['locationList'] = response.data.data?.geoLocationDetail?.geoLocations ?
              JSON.parse(response.data.data?.geoLocationDetail?.geoLocations) : [];

            modifiedPayload['settings']['geofence']['geoRadius'] = response.data.data?.geoLocationDetail?.geoRadius
              ? response.data.data?.geoLocationDetail?.geoRadius : 100;
            if (response.data?.data?.enableGeoFence) {
              if (modifiedPayload['settings']['geofence']['locationList'].length > 0) {
                modifiedPayload['settings']['isSettingSectionValid']['isGeofenceSectionValid'] = true;
                modifiedPayload['settings']['geofence']['locationError'] = '';
              } else {
                modifiedPayload['settings']['isSettingSectionValid']['isGeofenceSectionValid'] = false;
                modifiedPayload['settings']['geofence']['locationError'] = t('SETTINGS_GEOFENCE_REQUIRED_ERROR');
              }
            } else {
              modifiedPayload['settings']['isSettingSectionValid']['isGeofenceSectionValid'] = true;
            }
          } else {
            modifiedPayload['settings']['geofence']['locationList'] = [];
            modifiedPayload['settings']['geofence']['locationError'] = t('SETTINGS_GEOFENCE_REQUIRED_ERROR');
            modifiedPayload['settings']['geofence']['geoRadius'] = 100;
            modifiedPayload['settings']['isSettingSectionValid']['isGeofenceSectionValid'] = modifiedPayload['settings']['geofence']['enableGeofence'] ?
              false : true;
          }
        }
        dispatch({
          type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
          payload: {
            campaignPayload: modifiedPayload,
            currentPageName: 'registration',
            campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
            campaignStepsArray: response.data?.data?.campaignObjective?.fields[0] === 'surveyAd' ? ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SURVEY', 'SETTINGS'] : ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS']
          }
        })
      }, error => {
        console.log(helper.getErrorMessage(error));
        dispatch({
          type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
          payload: {
            campaignPayload: {},
            currentPageName: 'registration',
            campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
            campaignStepsArray: ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS']
          }
        })
      });

    return () => {
      const modifiedPayload = Object.assign({}, state.formValues);
      modifiedPayload['registration']['name'] = '';
      modifiedPayload['registration']['agencyId'] = '';
      modifiedPayload['registration']['campaignCategoryName'] = '';
      modifiedPayload['registration']['advertiserId'] = '';
      modifiedPayload['registration']['campaignObjectiveId'] = '';
      modifiedPayload['registration']['campaignObjectiveName'] = '';
      modifiedPayload['registration']['emailDistributionList'] = '';
      modifiedPayload['registration']['campaignType'] = '';
      modifiedPayload['registration']['packageNameToOpenApp'] = '';
      modifiedPayload['registration']['goToWeb'] = '';
      modifiedPayload['registration']['packageNameToInstallApp'] = '';
      modifiedPayload['registration']['packageName'] = '';
      modifiedPayload['registration']['phoneToCall'] = '';
      modifiedPayload['registration']['actionInTheApp'] = '';
      modifiedPayload['registration']['showMessage'] = '';
      modifiedPayload['registration']['isRegistrationSectionValid'] =
        state.formValues.registration.campaignObjectiveName === 'showMessage' ? true : false;
      modifiedPayload['registration']['isCampaignNameValid'] = false;
      modifiedPayload['registration']['insertionOrderId'] = '';
      modifiedPayload['registration']['cpType'] = 'MONETIZATION';
      modifiedPayload['template']['primaryTemplateType'] = '';
      modifiedPayload['template']['secondaryTemplateType'] = '';
      modifiedPayload['creative']['subject'] = '';
      modifiedPayload['creative']['message'] = '';
      modifiedPayload['creative']['richNotificationMessageBody'] = '';
      modifiedPayload['creative']['deepLink'] = '';
      modifiedPayload['creative']['iconUploadOptions'] = true;
      modifiedPayload['creative']['appIconUrl'] = '';
      modifiedPayload['creative']['buttonPersonalizationOptions'] = false;
      modifiedPayload['creative']['buttons'] = [
        {
          buttonText: "",
          ctaLink: "",
          buttonTextError: t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR'),
          isButtonTextError: true,
          ctaLinkError: t('CREATIVE_LINK_REQUIRED_ERROR'),
          isCtaLinkError: true,
          buttonTextCharRemaining: -1
        }
      ];
      modifiedPayload['creative']['ctaText'] = 'See More';
      modifiedPayload['creative']['ctaTextInApp'] = 'See More';
      modifiedPayload['creative']['bannerUrl'] = '';
      modifiedPayload['creative']['imageUrl'] = '';
      modifiedPayload['creative']['videoUrl'] = '';
      modifiedPayload['creative']['starColors'] = '';
      modifiedPayload['creative']['noOfStars'] = 1;
      modifiedPayload['creative']['deepLinksRatingStars'] = true;
      modifiedPayload['creative']['sliderImageList'] = [{ imageUrl: '', imageUrlError: 'Image URL is required', isImageUrlError: true }];
      modifiedPayload['creative']['notificationImageContent'] = {};
      modifiedPayload['creative']['richNotificationImageContent'] = {};
      modifiedPayload['creative']['fullImageContent'] = {};
      modifiedPayload['creative']['mainImageContent'] = {};
      modifiedPayload['creative']['videoContent'] = {};
      modifiedPayload['creative']['gifImageContent'] = {};
      modifiedPayload['creative']['messageInApp'] = '';
      modifiedPayload['creative']['subjectInApp'] = '';
      modifiedPayload['creative']['buttonPersonalizationOptionsInApp'] = false;
      modifiedPayload['creative']['buttonsInApp'] = [
        {
          buttonText: "",
          ctaLink: "",
          buttonTextError: t('CREATIVE_BUTTON_TEXT_REQUIRED_ERROR'),
          isButtonTextError: true,
          ctaLinkError: t('CREATIVE_LINK_REQUIRED_ERROR'),
          isCtaLinkError: true,
          buttonTextCharRemaining: -1
        }
      ];
      modifiedPayload['creative']['creativeSectionObjectiveFieldError'] = {
        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
        packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
      };
      modifiedPayload['creative']['gifDuration'] = 0;
      modifiedPayload['creative']['subjectCharRemaining'] = -1;
      modifiedPayload['creative']['messageCharRemaining'] = -1;
      modifiedPayload['creative']['richNotificationMessgaeBodyCharRemaining'] = -1;
      modifiedPayload['creative']['ctaTextCharRemaining'] = 12;
      modifiedPayload['creative']['ctaTextInAppCharRemaining'] = 12;
      modifiedPayload['creative']['subjectInAppCharRemaining'] = -1;
      modifiedPayload['creative']['messageInAppCharRemaining'] = -1;
      modifiedPayload['creative']['selectedSurvey'] = {};
      modifiedPayload['creative']['surveyQuestionDetails'] = [];
      modifiedPayload['creative']['adDisplayTimeBehaviour'] = 'NONE';
      modifiedPayload['creative']['minimumAdDisplayTime'] = 0;
      modifiedPayload['creative']['minimumAdDisplayTimeModified'] = false;
      modifiedPayload['settings']['schedule']['network'] = 'ALL';
      // modifiedPayload['settings']['schedule']['timezone'] = timezones.includes(Intl.DateTimeFormat().resolvedOptions().timeZone) ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';
      modifiedPayload['settings']['schedule']['timezone'] = timezone;
      modifiedPayload['settings']['schedule']['repeat'] = false;
      modifiedPayload['settings']['schedule']['distributeInTime'] = true;
      modifiedPayload['settings']['schedule']['repeatMonth'] = false;
      modifiedPayload['settings']['schedule']['specificDays'] = false;
      modifiedPayload['settings']['schedule']['endAt'] = null;
      modifiedPayload['settings']['schedule']['expAt'] = null;
      modifiedPayload['settings']['schedule']['monthlyDayTime'] = '';
      modifiedPayload['settings']['schedule']['repeatMany'] = '1';
      modifiedPayload['settings']['schedule']['repeatEvery'] = 'day';
      modifiedPayload['settings']['schedule']['startAt'] = new Date();
      modifiedPayload['settings']['schedule']['sendDayTime'] = ["9", "20"];
      modifiedPayload['settings']['schedule']['weekDays'] = [addDay(days[new Date().getDay()])];
      modifiedPayload['settings']['schedule']['inAppWeekDays'] = [inAppAddDay(days[new Date().getDay()])];
      modifiedPayload['settings']['schedule']['targetBehavior'] = 'ALL_AUDIENCE';
      modifiedPayload['settings']['schedule']['scheduleBehavior'] = 'DAILY';
      modifiedPayload['settings']['schedule']['multiShow'] = false;
      modifiedPayload['settings']['schedule']['multiShowRangeType'] = 'DAY';
      modifiedPayload['settings']['metrics']['typePerformance'] = '';
      modifiedPayload['settings']['metrics']['target'] = '';
      modifiedPayload['settings']['metrics']['ctr'] = 5;
      modifiedPayload['settings']['metrics']['reach'] = 70;
      modifiedPayload['settings']['metrics']['cpc'] = null;
      modifiedPayload['settings']['metrics']['impressions'] = 'Total';
      modifiedPayload['settings']['metrics']['totalCost'] = 'Total';
      modifiedPayload['settings']['metrics']['performanceError'] = {
        costFieldError: '',
        ctrFieldError: '',
        estimatedReachFieldError: '',
        targetFieldError: ''
      };
      modifiedPayload['settings']['customTrackerLinks']['notificationShown'] = '';
      modifiedPayload['settings']['customTrackerLinks']['notificationClicked'] = '';
      modifiedPayload['settings']['customTrackerLinks']['bannerShown'] = '';
      modifiedPayload['settings']['customTrackerLinks']['bannerClicked'] = '';
      modifiedPayload['settings']['customTrackerLinks']['actionComplete'] = '';
      modifiedPayload['settings']['customTrackerLinks']['commonUrl'] = '';
      modifiedPayload['settings']['customTrackerLinks']['iscommonUrl'] = false;
      modifiedPayload['settings']['customTrackerLinks']['eventList'] = [];
      modifiedPayload['settings']['customTrackerLinks']['commonUrlError'] = '';
      modifiedPayload['settings']['customTrackerLinks']['surveyOpen'] = '';
      modifiedPayload['settings']['customTrackerLinks']['surveyClosed'] = '';
      modifiedPayload['settings']['customTrackerLinks']['surveyCompleted'] = '';
      modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl'] = {
        notificationShown: '',
        notificationClicked: '',
        bannerShown: '',
        bannerClicked: '',
        actionComplete: '',
        surveyOpen: '',
        surveyClosed: '',
        surveyCompleted: ''
      };
      modifiedPayload['settings']['customTrackerLinks']['protocolWarningObjectNonCommonUrl'] = {
        notificationShown: '',
        notificationClicked: '',
        bannerShown: '',
        bannerClicked: '',
        actionComplete: '',
        surveyOpen: '',
        surveyClosed: '',
        surveyCompleted: ''
      };
      modifiedPayload['settings']['clusterArray'] = {
        condition: "ALL",
        list: [
          {
            operation: 'INCLUDE',
            condition: "ANY",
            list: [{
              id: "",
              name: "",
            }]
          }
        ]
      }
      modifiedPayload['settings']['isSettingSectionValid'] = {
        isMetricsSectionValid: false,
        isScheduleSectionValid: false,
        isClusterSectionValid: false,
        isCustomTrackerLinkSectionValid: false,
        isCampaignOptionSectionValid: true,
        isSettingSectionValid: true
      }
      modifiedPayload['settings']['isCallReachCountApi'] = false;
      modifiedPayload['campaignStatus'] = '';
      modifiedPayload['campaignId'] = null;
      modifiedPayload['lockCampaignStatus'] = false;
      modifiedPayload['campaignResponse'] = {};
      modifiedPayload['settings']['campaignOptions'] = 'sendtoactivedevices=true,allowduplicates=false',
        modifiedPayload['settings']['campaignOptionsError'] = '';
      modifiedPayload['settings']['isShowClusterWarningFlag'] = false;
      modifiedPayload['settings']['geofence']['enableGeofence'] = false;
      modifiedPayload['settings']['geofence']['locationList'] = [];
      modifiedPayload['settings']['geofence']['geoRadius'] = 100;
      modifiedPayload['settings']['geofence']['locationError'] = '';
      modifiedPayload['campaignVersion'] = '2.0';

      dispatch({
        type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
        payload: {
          campaignPayload: modifiedPayload, currentPageName: 'registration',
          campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'],
          campaignStepsArray: ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS']
        }
      })
    }
  }, []);

  const modifyCampaignType = (campaignType: string): string => {
    if (campaignType === 'PUSH') {
      return 'push';
    } else if (campaignType === 'INAPP') {
      return 'inApp';
    } else if (campaignType === 'PUSH_INAPP') {
      return 'pushInApp';
    } else {
      return '';
    }
  }
  //Campaign V1  
  const getCampaignTypeForV1 = (campaignDetails: any): string => {
    if (!!campaignDetails.mainImageContent || !!campaignDetails.fullImageContent) {
      return 'pushInApp';
    } else {
      return 'push';
    }
  }

  const getTemplateTypeForV1 = (campaignNotificationDetails: any): string => {
    let type = 'standard'
    if (!!campaignNotificationDetails?.richNotificationSmallImageContent || !!campaignNotificationDetails?.richNotificationLargeImageContent) {
      type = 'richImage';
    } else if (!!campaignNotificationDetails?.richNotificationMessageBody) {
      type = 'richText';
    }
    return type;
  }

  const getSecondryTemplateTypeForV1 = (campaignDetails: any): string => {
    if (!!campaignDetails?.videoContent && !!campaignDetails?.mainImageContent) {
      return 'popupWithVideo';
    } else if (!!campaignDetails?.mainImageContent) {
      return 'popup';
    } else if (!!campaignDetails?.videoContent && !!campaignDetails?.fullImageContent) {
      return 'fullPageWithVideo';
    } else if (!!campaignDetails?.fullImageContent) {
      return 'fullPage';
    }
  }

  const modifyTemplateType = (templateType: string): string => {
    if (templateType === 'STANDARD') {
      return 'standard';
    } else if (templateType === 'RICHTEXT') {
      return 'richText';
    } else if (templateType === 'RICHIMAGE') {
      return 'richImage';
    } else if (templateType === 'FULLPAGE') {
      return 'fullPage';
    } else if (templateType === 'FULLPAGEWITHVIDEO') {
      return 'fullPageWithVideo';
    } else if (templateType === 'POPUP') {
      return 'popup';
    } else if (templateType === 'POPUPWITHVIDEO') {
      return 'popupWithVideo';
    } else if (templateType === 'RATING') {
      return 'rating';
    } else if (templateType === 'TOPBANNER') {
      return 'topBanner';
    } else if (templateType === 'BOTTOMBANNER') {
      return 'bottomBanner';
    } else if (templateType === 'SLIDER') {
      return 'slider';
    } else {
      return '';
    }
  }

  const metricsSectionValid = (performance: any): any => {
    let errorObject = {
      costFieldError: '',
      ctrFieldError: '',
      estimatedReachFieldError: '',
      targetFieldError: ''
    };

    if (performance.target) {
      if (Number(performance.target) <= 0) {
        errorObject['targetFieldError'] = t('SETTINGS_PERFORMANCE_TARGET_MIN_ERROR');
      } else {
        if (Number(performance.target) > 10000000) {
          errorObject['targetFieldError'] = t('SETTINGS_PERFORMANCE_TARGET_MAX_ERROR');
        } else {
          if (!/^[0-9]*$/.test(performance.target)) {
            errorObject['targetFieldError'] = t('SETTINGS_PERFORMANCE_TARGET_INVALID_ERROR');
          }
        }
      }
    } else {
      errorObject['targetFieldError'] = t('SETTINGS_PERFORMANCE_TARGET_REQUIRED_ERROR');
    }

    if (performance.cpc) {
      if (Number(performance.cpc) <= 0) {
        errorObject['costFieldError'] = t('SETTINGS_PERFORMANCE_COST_MIN_ERROR');
      } else {
        if (Number(performance.cpc) > 100) {
          errorObject['costFieldError'] = t('SETTINGS_PERFORMANCE_COST_MAX_ERROR');
        } else {
          errorObject['costFieldError'] = '';
        }
      }
    } else {
      errorObject['costFieldError'] = '';
    }

    if (performance.ctr) {
      if (Number(performance.ctr) <= 0) {
        errorObject['ctrFieldError'] = t('SETTINGS_PERFORMANCE_CTR_MIN_ERROR');
      } else {
        if (Number(performance.ctr) > 100) {
          errorObject['ctrFieldError'] = t('SETTINGS_PERFORMANCE_CTR_MAX_ERROR');
        } else {
          errorObject['ctrFieldError'] = '';
        }
      }
    } else {
      errorObject['ctrFieldError'] = '';
    }

    if (performance.reach) {
      if (Number(performance.reach) <= 0) {
        errorObject['estimatedReachFieldError'] = t('SETTINGS_PERFORMANCE_REACH_MIN_ERROR');
      } else {
        if (Number(performance.reach) > 100) {
          errorObject['estimatedReachFieldError'] = t('SETTINGS_PERFORMANCE_REACH_MAX_ERROR');
        } else {
          errorObject['estimatedReachFieldError'] = '';
        }
      }
    } else {
      errorObject['estimatedReachFieldError'] = '';
    }

    return { errorObject: errorObject };
  }

  const scheduleSectionValid = (distribution: any, campaignType: string): boolean => {
    let isError;
    if (campaignType === 'inApp') {
      if (distribution.startAt && !isNaN(new Date(distribution.startAt).getTime()) && distribution.endAt &&
        !isNaN(new Date(distribution.endAt).getTime()) && distribution.expAt && !isNaN(new Date(distribution.expAt).getTime())) {
        if ((today(timezone) > helper.formatDate(distribution.startAt)) ||
          (today(timezone) > helper.formatDate(distribution.endAt)) ||
          (helper.formatDate(distribution.startAt) > helper.formatDate(distribution.endAt))) {
          isError = true;
        } else {
          if (helper.formatDate(distribution.endAt) > helper.formatDate(distribution.expAt)) {
            isError = true;
          } else {
            if (distribution.repeatMonth) {
              if (distribution.monthlyDayTime && distribution.sendDayTime && String(distribution.sendDayTime).length !== 0) {
                isError = false;
              } else {
                isError = true;
              }
            } else {
              if (distribution.specificDays) {
                if (distribution.inAppWeekDays.length === 0) {
                  isError = true;
                } else {
                  isError = false;
                }
              } else {
                isError = false;
              }
            }

          }
        }
      } else {
        isError = true;
      }
    } else if (campaignType === 'push' || campaignType === 'pushInApp') {
      if (distribution.repeat || distribution.distributeInTime) {
        if (distribution.startAt && !isNaN(new Date(distribution.startAt).getTime()) && distribution.endAt && !isNaN(new Date(distribution.endAt).getTime())
          && distribution.expAt && !isNaN(new Date(distribution.expAt).getTime()) && distribution.weekDays) {
          if (distribution.weekDays.length == 0) {
            isError = true;
          } else {
            if ((today(timezone) > helper.formatDate(distribution.startAt)) ||
              (today(timezone) > helper.formatDate(distribution.endAt)) ||
              (helper.formatDate(distribution.startAt) > helper.formatDate(distribution.endAt))) {
              isError = true;
            } else {
              if (helper.formatDate(distribution.endAt) > helper.formatDate(distribution.expAt)) {
                isError = true;
              } else {
                isError = false;
              }
            }
          }
        } else {
          isError = true;
        }
      } else {
        if (distribution.startAt && !isNaN(new Date(distribution.startAt).getTime())) {
          if (today(timezone) > helper.formatDate(distribution.startAt)) {
            isError = true;
          } else {
            isError = false;
          }
        } else {
          isError = true;
        }
      }
    } else {
      isError = true;
    }
    return isError;
  }

  const setEndDate = (distribution: any, campaignType: string, campaignVersion: string): any => {
    if (distribution.endDate) {
      if (campaignType === 'inApp') {
        return helper.convertDateToObject(distribution.endDate);
      } else {
        if (campaignVersion === '2.0') {
          if (!distribution.isDistributeInTime && distribution?.distributionAllocation !== 'RETARGET') {
            if (distribution?.times && distribution?.times.length !== 0) {
              return helper.convertDateToObject(distribution.endDate);
            } else {
              return null;
            }
          } else {
            return helper.convertDateToObject(distribution.endDate);
          }
        } else {
          if (distribution?.times && distribution?.times.length !== 0) {
            return helper.convertDateToObject(distribution.endDate);
          } else {
            return null;
          }
        }
      }
    } else {
      return null;
    }
  }

  const today = (timeZone: string): any => {
    return helper.formatDate(
      helper.convertDateByTimeZone(
        timeZone ? timeZone : 'America/Sao_Paulo'
      )
    );
  }

  const buildCampaignOptionObject = (options: string): any => {
    const optionObject = {};
    if (options && options.trim() !== '') {
      const optionArray = options.split(',');
      for (const value of Object.keys(optionArray)) {
        const optionKeyArray = optionArray[value].split('=');
        optionObject[optionKeyArray[0]] = optionKeyArray[1];
      }
    }
    return optionObject;
  }

  return (
    <S.Container>
      <CampaignProgrssBar />
      {state.currentSectionName === "registration" && <Registration />}
      {state.currentSectionName === "template" && <Template />}
      {state.currentSectionName === "secondaryTemplate" && (
        <SecondaryTemplate />
      )}
      {state.currentSectionName === "creative" &&
        (state.formValues.registration.campaignType === "push" ||
          state.formValues.registration.campaignType === "pushInApp") && (
          <CreativePush />
        )}
      {((state.currentSectionName === "creative" &&
        state.formValues.registration.campaignType === "inApp") ||
        (state.currentSectionName === "secondaryCreative" &&
          state.formValues.registration.campaignType === "pushInApp")) && (
          <CreativeInApp />
        )}
      {state.currentSectionName === "survey" && <Survey />}
      {state.currentSectionName === "settings" && <Settings />}
    </S.Container>
  );
}

export default CampaignEditContainer;
