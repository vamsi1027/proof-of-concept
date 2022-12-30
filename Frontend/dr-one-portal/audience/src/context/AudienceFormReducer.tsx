const AudienceFormReducer = (state, action) => {
  switch (action.type) {
    case "SHOW_LOADER":
      return {
        ...state,
        loading: true,
      };
    case "ACTIVE_STEPPER":
      return {
        ...state,
        activeStepper: action.payload,
      };
    case "MODIFY_RULES":
      return {
        ...state,
        rules: action.payload.rulesPayload,
      };
    case "MODIFY_RULES_PAYLOAD":
      return {
        ...state,
        makers: action.makerPayload,
      };
    case "RESET_STATE":
      return {
        ...state,
        rules: action.payload.rulesPayload,
      };
    case "NO_DATA_FOUND":
      return {
        ...state,
        rules: action.payload.rulesPayload,
      };
    case "REMOVE_RULES":
      return {
        ...state,
        rules: action.payload.rulesPayload,
      };
    case "MODIFY_RULES_TOOGLE":
      return {
        ...state,
        rulesToggle: action.payload,
      };
    case "TOGGLE_REACH_COUNT_API":
      return {
        ...state,
        isShowClusterWarningFlag: action.payload
      }
    default:
      return state;
  }
};

export default AudienceFormReducer;
