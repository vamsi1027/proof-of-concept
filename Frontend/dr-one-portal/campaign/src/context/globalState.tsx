import { days, timezones, helper } from "@dr-one/utils";
import React, { createContext, useReducer } from "react";
import { v1, v4 } from "uuid";
import CampaignFormReducer from "./CampaignFormReducer";
const userData = JSON.parse(localStorage.getItem('dr-user'));
const orgIndex = userData.organizations.findIndex(orgDetail => orgDetail.id === userData.organizationActive);
const orgTimezone = orgIndex > -1 ? userData.organizations[orgIndex].timeZone : '';

export const addDay = (day = "") => ({
  day,
  id: v1(),
  time: new Date(),
  dayError: ''
});
export const inAppAddDay = (day = "") => ({
  id: v1(),
  day,
  time: [2, 5],
  dayError: ''
});

export const initialState: any = {
  loading: false,
  reloadTab: false,
  status: '',
  currentSectionName: "registration",
  currentSurveySection: "registration",
  activeStepper: 0,
  cpQuestionSetLimit: '',
  surveyForm: {
    questionTypeMain: 'CHECKBOX',
    intervalArray: [{ id: '1', name: '1' }],
    surveyName: '',
    surveyDesc: '',
    surveyUrl: '',
    questionArrayId: [],
    minMaxError: false,
    validForm: {},
    conditionalQuestionArrayFlag: false,
    conditionalQuestionArray: [],
    welcomeText: '',
    startButtonText: '',
    imageFlag: true,
    surveyFileUploadSection: {},
    conditionFlag: true,
    finalTitle: '',
    finalText: '',
    addImageLastFlag: true,
    finalButtonFlag: true,
    textButton: '',
    buttonLink: '',
    surveyLastFileUploadSection: {},
    cpQuestionLimit: '',
    surveyQuestionSet: [{
      id: helper.generateMongoObjectId(),
      interval: '1',
      intervalArray: [{ id: '1', name: '1' }],
      answerType: '',
      questionType: 'CHECKBOX',
      answerOptionsError: false,
      answerSubType: false,
      answerOptionEachLengthErrorFlag: false,
      min: '',
      max: '',
      decimalErrorMin: false,
      decimalErrorMax: false,
      answerOptions: [],
      freeText: '',
      units: '',
      questionTitle: '',
      minMaxError: false,
      conditionalPathEnable: false,
      randomizeOrder: false,
      path: [],
      conditionalQuestionArray: [],
      defaultTarget: '',
      answerOptionsWithAlternative: [],
      cpAssociatedId: '',
      surveyAlternativeOther: {
        enable: false,
        label: 'Other',
        placeholder: 'Enter your option',
        mode: 'read',
        key: 'other'
      },
      surveyAlternativeNoneOfTheAbove: {
        enable: false,
        label: 'None of the Above',
        mode: 'read',
        key: 'noneOfTheAbove',
        targetQuestion: ''
      }
    }]
  },
  campaignObjectiveList: [],
  orgDetails: {},
  formValues: {
    isCampaignLoaded: false,
    initialPayload: false,
    campaignVersion: '2.0',
    registration: {
      name: '',
      agencyId: '',
      campaignCategoryName: '',
      advertiserId: '',
      emailDistributionList: '',
      campaignObjectiveId: '',
      campaignObjectiveName: '',
      campaignType: '',
      packageNameToOpenApp: '',
      goToWeb: '',
      packageNameToInstallApp: '',
      packageName: '',
      phoneToCall: '',
      actionInTheApp: '',
      showMessage: '',
      isRegistrationSectionValid: false,
      isCampaignNameValid: false,
      insertionOrderId: '',
      cpType: 'MONETIZATION'
    },
    template: {
      primaryTemplateType: "",
      secondaryTemplateType: "",
      targetSDKVersion: '2.7.0'
    },
    creative: {
      subject: "",
      message: "",
      subjectCharRemaining: -1,
      messageCharRemaining: -1,
      richNotificationMessgaeBodyCharRemaining: -1,
      richNotificationMessageBody: "",
      deepLink: "",
      iconUploadOptions: true,
      appIconUrl: "",
      buttonPersonalizationOptions: false,
      buttons: [
        {
          buttonText: "",
          ctaLink: "",
          buttonTextError: "Button Text is required",
          isButtonTextError: true,
          ctaLinkError: "Link is required",
          isCtaLinkError: true,
          buttonTextCharRemaining: -1
        }
      ],
      ctaText: "See More",
      ctaTextCharRemaining: 12,
      ctaTextInApp: "See More",
      ctaTextInAppCharRemaining: 12,
      bannerUrl: "",
      imageUrl: "",
      videoUrl: "",
      noOfStars: 1,
      starColors: "",
      deepLinksRatingStars: true,
      sliderImageList: [{ imageUrl: '', imageUrlError: 'Image URL is required', isImageUrlError: true }],
      notificationImageContent: {},
      richNotificationImageContent: {},
      fullImageContent: {},
      mainImageContent: {},
      videoContent: {},
      gifImageContent: {},
      gifDuration: 0,
      subjectInApp: "",
      subjectInAppCharRemaining: -1,
      messageInApp: "",
      messageInAppCharRemaining: -1,
      buttonPersonalizationOptionsInApp: false,
      buttonsInApp: [
        {
          buttonText: "",
          ctaLink: "",
          buttonTextError: "Button Text is required",
          isButtonTextError: true,
          ctaLinkError: "Link is required",
          isCtaLinkError: true,
          buttonTextCharRemaining: -1
        }
      ],
      creativeSectionObjectiveFieldError: {
        packageNameToOpenApp: '', goToWeb: '', packageNameToInstallApp: '',
        packageName: '', phoneToCall: '', actionInTheApp: '', showMessage: ''
      },
      sequenceArrayFullPagePopUpTopBottomBanner: ['image', 'messageContent', 'cta'],
      sequenceArrayFullPageVideo: ['image', 'video', 'messageContent', 'cta'],
      sequenceArray: ['image', 'messageContent', 'cta'],
      selectedSurvey: {},
      surveyQuestionDetails: [],
      adDisplayTimeBehaviour: 'NONE',
      minimumAdDisplayTime: 0,
      minimumAdDisplayTimeModified: false
    },
    settings: {
      schedule: {
        network: "ALL",
        // timezone: timezones.includes(Intl.DateTimeFormat().resolvedOptions().timeZone) ?
        //   Intl.DateTimeFormat().resolvedOptions().timeZone : '',
        timezone: orgTimezone,
        repeat: false,
        distributeInTime: true,
        repeatMonth: false,
        specificDays: false,
        endAt: null,
        expAt: null,
        monthlyDayTime: "",
        repeatMany: "1",
        repeatEvery: "day",
        startAt: new Date(),
        sendDayTime: ["9", "20"],
        weekDays: [addDay(days[new Date().getDay()])],
        inAppWeekDays: [inAppAddDay(days[new Date().getDay()])],
        targetBehavior: "ALL_AUDIENCE",
        scheduleBehavior: "DAILY",
        multiShow: false,
        multiShowRangeType: 'DAY'
      },
      metrics: {
        typePerformance: "",
        target: '',
        ctr: 5,
        reach: 70,
        cpc: null,
        impressions: 'Total',
        totalCost: 'Total',
        performanceError: {
          costFieldError: '',
          ctrFieldError: '',
          estimatedReachFieldError: '',
          targetFieldError: ''
        }
      },
      customTrackerLinks: {
        notificationShown: '',
        notificationClicked: '',
        bannerShown: '',
        bannerClicked: '',
        actionComplete: '',
        surveyOpen: '',
        surveyClosed: '',
        surveyCompleted: '',
        commonUrl: '',
        iscommonUrl: false,
        eventList: [],
        commonUrlError: '',
        errorObjectNonCommonUrl: {
          notificationShown: '',
          notificationClicked: '',
          bannerShown: '',
          bannerClicked: '',
          actionComplete: '',
          surveyOpen: '',
          surveyClosed: '',
          surveyCompleted: ''
        },
        protocolWarningObjectNonCommonUrl: {
          notificationShown: '',
          notificationClicked: '',
          bannerShown: '',
          bannerClicked: '',
          actionComplete: '',
          surveyOpen: '',
          surveyClosed: '',
          surveyCompleted: ''
        }
      },
      clusterArray: {
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
      },
      geofence: {
        enableGeofence: false,
        locationList: [],
        geoRadius: 100,
        locationError: ''
      },
      isSettingSectionValid: {
        isMetricsSectionValid: false,
        isScheduleSectionValid: false,
        isClusterSectionValid: false,
        isCustomTrackerLinkSectionValid: false,
        isCampaignOptionSectionValid: true,
        isGeofenceSectionValid: true
      },
      isCallReachCountApi: false,
      campaignOptions: 'sendtoactivedevices=true,allowduplicates=false',
      campaignOptionsError: '',
      isShowClusterWarningFlag: false
    },
    campaignStatus: '',
    campaignId: null,
    lockCampaignStatus: false,
    campaignResponse: {}
  },
  campaignBreadCrumbList: [
    "CAMPAIGN_MANAGEMENT",
    "CREATE_CAMPAIGN",
    "REGISTRATION",
  ],
  campaignStepsArray: ['REGISTRATION', 'TEMPLATE', 'CREATIVE', 'SETTINGS'],
  surveyBreadCrumbList: ["SURVEY", "REGISTRATION"]
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CampaignFormReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
