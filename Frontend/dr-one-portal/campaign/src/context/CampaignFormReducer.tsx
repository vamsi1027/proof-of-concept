export const CAMPAIGN_ACTIONS = {
  SHOW_LOADER: "SHOW_LOADER",
  GET_AGENCY_LIST: "GET_AGENCY_LIST",
  GET_CATEGORY_LIST: "GET_CATEGORY_LIST",
  GET_ADVERTISER_LIST: "GET_ADVERTISER_LIST",
  GET_OBJECTIVE_LIST: "GET_OBJECTIVE_LIST",
  MODIFY_CAMPAIGN_PAYLOAD: "MODIFY_CAMPAIGN_PAYLOAD",
  GET_CAMPAIGN_OBJECTIVE_LIST: "GET_CAMPAIGN_OBJECTIVE_LIST",
  REGISTRATION_SECTION_VALIDITY_MODIFY: "REGISTRATION_SECTION_VALIDITY_MODIFY",
  TEMPLATE_SECTION_VALIDITY_MODIFY: "TEMPLATE_SECTION_VALIDITY_MODIFY",
  MODIFY_CAMPAIGN_SETTINGS: "MODIFY_CAMPAIGN_SETTINGS",
  REMOVE_CAMPAIGN_CLUSTER: "REMOVE_CAMPAIGN_CLUSTER",
  TAB_RELOAD: "TAB_RELOAD",
  GET_ORG_DETAILS: "GET_ORG_DETAILS",
  GET_ORG_DETAILS_FAILURE: "GET_ORG_DETAILS_FAILURE",
  CHANGE_PAGE: "CHANGE_PAGE",
  ACTIVE_STEPPER: "ACTIVE_STEPPER",
  MODIFY_SURVEY_PAYLOAD: "MODIFY_SURVEY_PAYLOAD",
  MODIFY_SURVEY_STATE_PAYLOAD: "MODIFY_SURVEY_STATE_PAYLOAD"
};

const CampaignFormReducer = (state, action) => {
  switch (action.type) {
    case CAMPAIGN_ACTIONS.SHOW_LOADER:
      return {
        ...state,
        loading: true,
      };
    case CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD:
      return {
        ...state,
        formValues: { ...state.formValues, ...action.payload.campaignPayload },
        currentSectionName: action.payload.currentPageName,
        campaignBreadCrumbList: action.payload.campaignBreadCrumbList,
        campaignStepsArray: action.payload.campaignStepsArray
      };
    case CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_SETTINGS:
      return {
        ...state,
        formValues: {
          ...state.formValues,
          settings: action.payload,
        },
      };
    case CAMPAIGN_ACTIONS.REMOVE_CAMPAIGN_CLUSTER:
      return {
        ...state,
        formValues: action.payload.campaignPayload,
        currentSectionName: action.payload.currentPageName,
        campaignBreadCrumbList: action.payload.campaignBreadCrumbList
      }
    case CAMPAIGN_ACTIONS.TAB_RELOAD:
      return {
        ...state,
        reloadTab: action.payload.reloadTab,
        status: action.payload.status
      }
    case CAMPAIGN_ACTIONS.GET_ORG_DETAILS:
      return {
        ...state,
        orgDetails: action.payload
      }
    case CAMPAIGN_ACTIONS.GET_ORG_DETAILS_FAILURE:
      return {
        ...state,
        orgDetails: {}
      }
    case CAMPAIGN_ACTIONS.CHANGE_PAGE:
      return {
        ...state,
        currentSurveySection: action.payload.currentPageName
      }
    case CAMPAIGN_ACTIONS.ACTIVE_STEPPER:
      return {
        ...state,
        activeStepper: action.payload,
        surveyBreadCrumbList: action.surveyBreadCrumbList
      }
    case CAMPAIGN_ACTIONS.MODIFY_SURVEY_PAYLOAD:
      return {
        ...state,
        surveyForm: { ...state.surveyForm, ...action.payload.surveyPayload },
        surveyBreadCrumbList: action.payload.surveyBreadCrumbList
      }
    case CAMPAIGN_ACTIONS.MODIFY_SURVEY_STATE_PAYLOAD:
      return {
        ...state,
        surveyForm: { ...state.surveyForm, ...action.payload.surveyPayload },
      }
    case 'MODIFY_SURVEY_PAYLOAD_PATH':
      return {
        ...state,
        surveyForm: { ...action.payload.surveyPayload },
        // cpQuestionSetLimit: action.payload.cpQuestionLimit
      }
    case 'MODIFY_SURVEY_REARRANGE':
      return {
        ...state,
        surveyForm: { ...action.payload.surveyPayload },
      }
    default:
      return state;
  }
};

export default CampaignFormReducer;
