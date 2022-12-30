import { days, timezones } from "@dr-one/utils";
import React, { createContext, useReducer } from "react";
import { v1 } from "uuid";
import CampaignAnalyticsReducer from "./CampaignAnalyticsReducer";
const userData = JSON.parse(localStorage.getItem('dr-user'));
const orgIndex = userData.organizations.findIndex(orgDetail => orgDetail.id === userData.organizationActive);
const orgTimezone = orgIndex > -1 ? userData.organizations[orgIndex].timeZone : '';

export const initialState: any = {
  dateRange: {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  },
  pushChartData: {},
  inAppChartData: {},
  pushInAppData: {},
  funnelPerMonth: {
    campaignSelectionType: 'PUSH',
    PUSH: {},
    INAPP: {},
    PUSH_INAPP: {}
  }
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CampaignAnalyticsReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
