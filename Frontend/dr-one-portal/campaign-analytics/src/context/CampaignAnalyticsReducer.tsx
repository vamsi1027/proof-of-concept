export const CAMPAIGN_ANALYTICS_ACTIONS = {
  SET_DATE_RANGE: "SET_DATE_RANGE",
  SET_PUSH_CHART_DATA: "SET_PUSH_CHART_DATA",
  SET_IN_APP_CHART_DATA: "SET_IN_APP_CHART_DATA",
  SET_PUSH_IN_APP_CHART_DATA: "SET_PUSH_IN_APP_CHART_DATA",
  SET_FUNNEL_PER_MONTH: "SET_FUNNEL_PER_MONTH"
};

const CampaignAnalyticsReducer = (state, action) => {
  switch (action.type) {
    case CAMPAIGN_ANALYTICS_ACTIONS.SET_DATE_RANGE:
      return {
        ...state,
        dateRange: action.payload,
      };
    case CAMPAIGN_ANALYTICS_ACTIONS.SET_PUSH_CHART_DATA:
      return {
        ...state,
        pushChartData: action.payload,
      };
    case CAMPAIGN_ANALYTICS_ACTIONS.SET_IN_APP_CHART_DATA:
      return {
        ...state,
        inAppChartData: action.payload,
      };
    case CAMPAIGN_ANALYTICS_ACTIONS.SET_PUSH_IN_APP_CHART_DATA:
      return {
        ...state,
        pushInAppData: action.payload,
      };
    case CAMPAIGN_ANALYTICS_ACTIONS.SET_FUNNEL_PER_MONTH:
      return {
        ...state,
        funnelPerMonth: action.payload
      };
    default:
      return state;
  }
};

export default CampaignAnalyticsReducer;
