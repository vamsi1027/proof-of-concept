import React, { createContext, useReducer } from "react";
import AudienceFormReducer from "./AudienceFormReducer";
const initialState: any = {
  loading: false,
  currentSectionName: "registration",
  activeStepper: 0,
  rules: {
    rulesToggle: false,
    loadIntialPage:false,
    name: '',
    propmptLoader: false,
    orAnd: "OR",
    yesNoIgnore: "YES",
    clusterType: 'RULE',
    campaignList: [],
    locations: {
      condition: "ANY",
      list: [],
    },
    installedApps: {
      condition: "ANY",
      list: [],
    },
    osVersions: {
      condition: "ANY",
      list: [],
    },
    makers: {
      condition: "ANY",
      list: [],
    },
    wirelessOperators: {
      condition: "ANY",
      list: [],
    },
    sourcePackages: {
      condition: "ANY",
      list: [],
    },
    deviceTier: {
      condition: "ANY",
      list: [],
    },
    customAttribute: {
      condition: "ANY",
      list: [],
    },
  },
  isShowClusterWarningFlag: false
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AudienceFormReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
