const AdminFormReducer = (state, action) => {
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
    case "UPDATE_ORGANIZATION_PAYLOAD":
      return {
        ...state,
        orgSetting: action.payload.orgSetting,
      };
    case "ADD_NEW_FCM":
      return {
        ...state,
        orgSetting: action.payload.newFcm
      }
    case "REMOVE_FCM":
      return {
        ...state,
        orgSetting: action.payload.removeFcm
      }
    case "REMOVE_ROLES":
      return {
        ...state,
        orgSetting: action.payload.removeRoles
      }
    case "RESET_ORGANIZATION_STATE":
      return {
        ...state,
        orgSetting: action.payload.resetOrgSetting
      }
    case "ADD_NEW_APNS":
      return {
        ...state,
        orgSetting: action.payload.newAPNS
      }
    case "REMOVE_APNS":
      return {
        ...state,
        orgSetting: action.payload.removeApns
      }
    case "RESET_APNS":
      return {
        ...state,
        orgSetting: action.payload.resetApns
      }
    default:
      return state;
  }
};

export default AdminFormReducer;
