import React, { useContext, useEffect } from "react";
import * as S from "./CampaignCreateContainer.styles";
import Registration from "./Registration/Registration";
import CampaignProgrssBar from "./CampaignProgressBar/CampaignProgressBar";
import Template from "./Template/Template";
import CreativePush from "./CreativePush/CreativePush";
import CreativeInApp from "./CreativeInApp/CreativeInApp";
import SecondaryTemplate from "./SecondaryTemplate/SecondaryTemplate";
import Survey from "./Survey/Survey";
import { GlobalContext, addDay, inAppAddDay } from "../../context/globalState";
import { CAMPAIGN_ACTIONS } from "../../context/CampaignFormReducer";
import Settings from "./Settings/Settings";
import { days, timezones } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';
const userData = JSON.parse(localStorage.getItem('dr-user'));
const orgIndex = userData.organizations.findIndex(orgDetail => orgDetail.id === userData.organizationActive);
const orgTimezone = orgIndex > -1 ? userData.organizations[orgIndex].timeZone : '';

function CampaignCreateContainer() {
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const { t } = useTranslation();

  useEffect(() => {
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
      modifiedPayload['settings']['schedule']['timezone'] = orgTimezone;
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
      modifiedPayload['settings']['customTrackerLinks']['errorObjectNonCommonUrl'] = {
        notificationShown: '',
        notificationClicked: '',
        bannerShown: '',
        bannerClicked: '',
        actionComplete: ''
      };
      modifiedPayload['settings']['customTrackerLinks']['protocolWarningObjectNonCommonUrl'] = {
        notificationShown: '',
        notificationClicked: '',
        bannerShown: '',
        bannerClicked: '',
        actionComplete: ''
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
        isGeofenceSectionValid: true
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
          campaignStepsArray: ['Registration', 'Template', 'Creative', 'Settings']
        }
      })
    }
  }, [])

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

export default CampaignCreateContainer;
