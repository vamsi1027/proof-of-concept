import { useState, useContext, useCallback, useEffect, useRef } from "react";
import * as S from "./Registration.styles";
import {
  Grid,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody, CircularProgress
} from "@material-ui/core";
import { Spinner, SnackBarMessage, LightTooltip, LinearBarWithValueLabel } from "@dr-one/shared-component";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { apiDashboard, helper, isoIsdCodes, Mixpanel } from "@dr-one/utils";
import { GlobalContext } from "../../../context/globalState";
import { useHistory, useParams } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import _ from "lodash";
import Rules from "./Rules";
import Publish from "@material-ui/icons/Publish";
import FileCopy from "@material-ui/icons/FileCopy";
import { useTranslation } from 'react-i18next';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import ClusterParameter from '../../../components/Common/ClusterWarring/ClusterWarring'
import Axios from 'axios'
interface CampaignNameList {
  campaignId: string,
  name: string,
  isClicked: string,
}
const useStyles = makeStyles((theme) => ({
  // root: {
  //   flexGrow: 1,
  // },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    width: "100%",
    maxWidth: 360,
    // backgroundColor: theme.palette.background.paper
  },
  menuItemRoot: {
    "&$menuItemSelected, &$menuItemSelected:focus, &$menuItemSelected:hover": {
      backgroundColor: "blue",
      fontWeight: 'bold',
      color: '#fff'
    }
  },
  menuItemSelected: {}
}));
function Registration() {
  const classes = useStyles();
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const [audienceName, setAudienceName] = useState(state.rules.name);
  const [nameSearchFlag, setNameSearchFlag] = useState(false);
  const [audienceNameCheckError, checkAudienceName] = useState("");
  const [clusterType, setClusterType] = useState(state.rules.clusterType);
  const [uploadfiles, setUploadFiles] = useState(true);
  const [clusterId, setClusterId] = useState();
  const [isClicked, setisClicked] = useState(state.rules.yesNoIgnore);
  const [orAnd, setOrAnd] = useState(state.rules.orAnd);
  const [CampignData, setCampignData] = useState([]);
  const [files, setFiles] = useState("");
  const [clusterValue, setClusterValue] = useState("");
  const [data, setdata] = useState([]);
  const [clusterData, setClusterData] = useState(state.rules.campaignList);
  const history = useHistory();
  const [campaignEmptyFlag, setCampaignEmptyFlag] = useState(false);
  const [sucessMessage, setSucessMessage] = useState(false);
  const [FileSanitationData, setFileSanitationData] = useState<string[]>([]);
  let fileSanitationTimeout: any = null;
  const [isFileSanitationProgress, setisFileSanitationProgress] =
    useState<boolean>(false);
  const [fileSanitationError, setfileSanitationError] = useState<string>("");
  let fileSanitationErrorCount = 0;
  const [checkPreview, setCheckPreview] = useState(false);
  const [previewFlag, setPreviewFlag] = useState(false);
  const { t } = useTranslation();
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [errorMessageFlag, setErrorMessageFlag] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [validFileUpload, setValidFileUpload] = useState(false)
  const [fileUploadErrorTxt, setFileUploadErrorTxt] = useState('')
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const param = useParams()
  const [isOpenPopup, togglePopup] = useState(false);
  const [clusterParameter, setClusterParameter] = useState('')
  const orgId = JSON.parse(localStorage.getItem('dr-user')).organizationActive
  const [cancelAxios, setcancelAxios] = useState(true)
  const [errorFlag, setErrorFlag] = useState(false)
  const [campaignChangeFlag, setCampaignChangeFlag] = useState(false)
  const [audienceLoadPayload, setAudienceLoadPayload] = useState<any>({});
  const [copyAudienceLoadPayload, setCopyAudienceLoadPayload] = useState<any>({});
  const clusterTypeList = [
    { id: "CAMPAIGN", name: "Campaign" },
    { id: "CLIENTID", name: "Client Ids" },
    { id: "PHONENUMBER", name: "Phone Number" },
    { id: "RULE", name: "Rules" },
  ];
  const allowedFileType = [
    'text/plain', 'text/csv', 'application/csv', 'text/x-comma-separated-values',
    'text/comma-separated-values', 'application/octet-stream', 'application/vnd.ms-excel',
    'application/excel', 'application/vnd.msexcel'
  ];
  const cancelFileUpload = useRef(null)
  const [countryISOCode, setCountryISOCode] = useState('')
  const handleActiveStepper = (payload): void => {
    dispatch({
      type: "ACTIVE_STEPPER",
      payload,
    });
  };
  const updateRulesPayload = (payload: any): void => {
    dispatch({
      type: "MODIFY_RULES",
      payload: {
        rulesPayload: payload,
      },
    });
  };
  const openPopup = (ClusterType: string): void => {
    if (state?.rules?.locations?.list?.length > 0 ||
      state?.rules?.customAttribute?.list?.length > 0 ||
      state?.rules?.deviceTier?.list?.length > 0 ||
      state?.rules?.installedApps?.list?.length > 0 ||
      state?.rules?.makers?.list?.length > 0 ||
      state?.rules?.osVersions?.list?.length > 0 ||
      state?.rules?.sourcePackages?.list?.length > 0 ||
      state?.rules?.wirelessOperators?.list?.length > 0 ||
      files.length > 0 || campaignChangeFlag ||
      // state?.rules?.orAnd?.length > 0 ||
      // state?.rules?.yesNoIgnore?.length > 0 ||
      state?.rules?.campaignList?.length > 0) {
      togglePopup(true);
      setClusterParameter(ClusterType);
    } else {
      setClusterType(ClusterType)
      const modifiedPayload = Object.assign({}, state.rules);
      modifiedPayload["clusterType"] = ClusterType;
      modifiedPayload['rulesToggle'] = false
      dispatch({
        type: "MODIFY_RULES",
        payload: {
          rulesPayload: modifiedPayload,
        },
      });
    }
  }
  const handleOpenModal = (value: boolean): void => {
    togglePopup(value);
  }

  const handleChangeAudienceName = (audienceName: string): void => {
    setAudienceName(audienceName);
    if (audienceName.length >= 3) {
      setNameSearchFlag(true);
      handleActiveStepper(1);
      apiDashboard
        .get(
          "campaign-mgmt-api/campaigns/name?name=" +
          encodeURIComponent(audienceName)
        )
        .then(
          (response) => {
            setNameSearchFlag(false);
            if (response.data.message === "false") {
              checkAudienceName("");
            } else {
              checkAudienceName(t('NAME_ALREADY_USED_FOR_AUDIENCE'));
              handleActiveStepper(0);
            }
          },
          (error) => {
            setNameSearchFlag(false);
            checkAudienceName(t('ERROR_MESSAGE'));
          }
        );
    } else {
      handleActiveStepper(0);
    }
  };

  const debounceOnChange = useCallback(
    helper.debounce(handleChangeAudienceName, 600),
    []
  );
  const handleClickedChange = (e): void => {
    let isClick = e.target.value;
    const modifiedPayload = Object.assign({}, state.rules);
    modifiedPayload["yesNoIgnore"] = isClick;
    updateRulesPayload(modifiedPayload);
    setisClicked(isClick);
    isClick === "YES" ? setCampaignChangeFlag(false) : setCampaignChangeFlag(true)
  };

  function getOrganization() {
    apiDashboard
      .get(`campaign-mgmt-api/organizations/${orgId}`).then((response) => {
        setCountryISOCode(response?.data?.data?.countryISOCode)
      }).catch((error) => {
        console.log(helper.getErrorMessage(error))
      })
  }
  const handleFileUpload = (e): void => {
    if (e.target.files && e.target.files[0]) {
      let errorFlag = false;
      setValidFileUpload(false);
      setisFileSanitationProgress(false)
      setFileUploadErrorTxt('');
      setcancelAxios(true)
      const fileExtension = e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf('.'));
      if (e.target.files[0].size > 200715200) {
        errorFlag = true;
        setValidFileUpload(true);
        setFileUploadErrorTxt(t('MAXIMUM_FILE_SIZE'));
      }
      if (!errorFlag
        && allowedFileType.indexOf(e.target.files[0].type) === -1
        && ['.txt', '.csv'].indexOf(fileExtension) === -1
      ) {
        errorFlag = true;
        setValidFileUpload(false);
        setFileUploadErrorTxt(t('FILE_FORMAT_NOT_ALLOWED'));
      }
      if (!errorFlag) {
        setFiles(e.target.files[0].name);
        const formData = new FormData();
        formData.append("file", e.target.files[0], e.target.files[0].name);
        if (clusterType === "PHONENUMBER") {
          formData.append("type", "phoneNumber");
          formData.append('countryISOCode', countryISOCode);
          formData.append('countryISDCode', countryISOCode && isoIsdCodes[countryISOCode]['isd_code']);
        }
        if (clusterType === "CLIENTID") {
          formData.append("type", "clientId");
        }
        const options = {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            let percent = Math.floor((loaded * 100) / total)
            setUploadPercentage(percent);
            setValidFileUpload(false);
          },
          cancelToken: new Axios.CancelToken(
            cancel => (cancelFileUpload.current = cancel)
          )
        }
        apiDashboard
          .post("files/upload/text", formData, options)
          .then((res) => {
            const clusterID = res.data.data.id;
            setValidFileUpload(true)
            setClusterId(clusterID);
            setCheckPreview(true);
            setUploadPercentage(0)
            clusterType === "PHONENUMBER" && getFileSanitationData(res.data.data.id)
          })
          .catch((err) => {
            setFileUploadErrorTxt(t('SERVER_TIME_OUT_ERROR_MESSAGE'))
            setValidFileUpload(false)
            setUploadPercentage(0)
          });
        setUploadFiles(false);
      }
    }
  };
  const cancelUpload = () => {
    if (cancelFileUpload.current) {
      cancelFileUpload.current("User has cancel file upload")
    }
  }
  const source = Axios.CancelToken.source();
  const getFileSanitationData = (id: any): void => {
    setValidFileUpload(false)
    if (id !== null) {
      apiDashboard
        .get(`files/preview/${id}`)
        .then((res) => {
          if (res.data.status === '101') {
            if (fileSanitationTimeout) {
              clearTimeout(fileSanitationTimeout);
              fileSanitationTimeout = null;
            }
            fileSanitationTimeout = setTimeout(() => {
              getFileSanitationData(id);
            }, 5000);
          } else if (res.data.status === '102') {
            setisFileSanitationProgress(false);
            setPreviewFlag(false);
            setfileSanitationError(res.data.message);
          } else {
            setisFileSanitationProgress(true);
            setPreviewFlag(false);
            setValidFileUpload(true)
            setfileSanitationError(" ");
            const fileSanitationData = [];
            res.data?.data?.content.forEach((item) => {
              const numbers = item.split(",");
              fileSanitationData.push({
                before: numbers[0],
                after: numbers[1],
              });
            });
            setFileSanitationData(fileSanitationData);
          }
        })
        .catch((errors) => {
          if (errors.response.status === 404) {
            fileSanitationErrorCount += 1;
            setPreviewFlag(true);
            setfileSanitationError(t('FILE_NORMALIZATION_IS_IN_PROGRESS'));
            if (fileSanitationErrorCount > 2) {
              setisFileSanitationProgress(true);
            } else {
              if (fileSanitationTimeout) {
                clearTimeout(fileSanitationTimeout);
                fileSanitationTimeout = null;
              }
              fileSanitationTimeout = setTimeout(() => {
                getFileSanitationData(id);
              }, 5000);
            }
          } else {
            setfileSanitationError(errors.response.data.error);
            setisFileSanitationProgress(false);
          }
        });
    }
  };
  const handleCluster = (type: string): void => {
    const modifiedPayload = Object.assign({}, state.rules);
    modifiedPayload['orAnd'] = "OR";
    modifiedPayload['yesNoIgnore'] = "YES";
    updateRulesPayload(modifiedPayload);
    setClusterType(type);
    setFiles("")
    setFileSanitationData([])
    setisFileSanitationProgress(false)
    setOrAnd("OR")
    setisClicked("YES")
    setCampaignChangeFlag(false)
    setErrorFlag(false)
    setCampignData([])
    setcancelAxios(false)
    setfileSanitationError('')
    setFileUploadErrorTxt('')
    setValidFileUpload(false);
    cancelUpload()
    source.cancel('Operation canceled by the user.');
    // controller.abort();
  }
  const onSubmitPhoneOrClientPost = (): void => {
    apiDashboard
      .post("campaign-mgmt-api/audienceclusters", {
        clusterFileId: clusterId,
        clusterType: clusterType,
        name: state.rules.name,
      })
      .then((res) => {
        setSucessMessage(true);
        setSnackBarMessage(res.data.message)
        Mixpanel.track('Audience Created', {
          id: res.data.data.id,
          name: state.rules.name,
          type: clusterType
        });
      })
      .catch((err) => {
        setErrorMessageFlag(true);
        setSnackBarMessage(err.response.data.error)
      });
    handleActiveStepper(0);
    sessionStorage.setItem('enablePrompt', 'false')
    setTimeout(() => {
      history.push("/audience/manage");
    }, 3000);
  };
  function getApiLocationandInstallData(apiData) {
    const getApiListLocationAndInstallApp = {
      'condition': apiData.condition,
      'list': apiData?.list?.map((item) => {
        return {
          'operation': item.operation,
          'condition': item.condition,
          'list': item?.list?.map((list) => {
            return {
              'id': list.id,
              'name': list?.location || list?.appName || list?.name,
            }
          })
        }
      })
    }
    return getApiListLocationAndInstallApp
  }
  function handleCampaignSearchFn(inputValue) {
    apiDashboard
      .get(
        `campaign-mgmt-api/campaigns?filter=${inputValue}&limit=20&status=COMPLETED&status=STOPPED&status=APPROVED`,
        {
          value: inputValue,
        }
      )
      .then(
        (res) => {
          setdata(res.data.data.content);
        },
        (error) => {
          setdata([]);
          setCampaignEmptyFlag(true);
        }
      );
  }
  const debounceFn = useCallback(_.debounce(handleCampaignSearchFn, 1000), []);

  useEffect(() => {
    const clusterValues =
      data?.length > 0 &&
      data.map((item) => {
        return {
          campaignId: item.id,
          name: item.name,
          isClicked: "",
        };
      });
    // if (data.length > 0) {
    setErrorFlag(false)
    // }
    setClusterData(clusterValues);
  }, [data, param?.id]);
  const searchCluster = (e): void => {
    setClusterValue(e.target.value);
    debounceFn(e.target.value);
  };
  const onCampaignSubmit = () => {
    const campaign = state.rules?.campaignList?.length > 0 && state.rules?.campaignList.map((data) => {
      return {
        campaignId: data.campaignId,
        isClicked: isClicked,
      };
    });
    if (param?.id && clusterType === "CAMPAIGN") {
      apiDashboard
        .put(`campaign-mgmt-api/audienceclusters/${param?.id}`, {
          campaignCluster: {
            campaignClusterData: campaign,
            condition: orAnd,
          },
          clusterType: clusterType,
          name: state.rules.name,
        })
        .then((res) => {
          setSucessMessage(true);
          setSnackBarMessage(res.data.message)
          handleActiveStepper(0);
          setTimeout(() => {
            history.push("/audience/manage");
          }, 6000);
        })
        .catch((err) => {
          setErrorMessageFlag(true);
          setSnackBarMessage(err.response.data.error)
        });

    } else {
      apiDashboard
        .post("campaign-mgmt-api/audienceclusters", {
          campaignCluster: {
            campaignClusterData: campaign,
            condition: orAnd,
          },
          clusterType: clusterType,
          name: state.rules.name,
        })
        .then((res) => {
          setSucessMessage(true);
          setSnackBarMessage(res.data.message);
          Mixpanel.track('Audience Created', {
            id: res.data.data.id,
            name: state.rules.name,
            type: clusterType
          });
          handleActiveStepper(0);
          setTimeout(() => {
            history.push("/audience/manage");
          }, 6000);
        })
        .catch((err) => {
          setErrorMessageFlag(true);
          setSnackBarMessage(err.response.data.error)
        });

    }
    sessionStorage.setItem('enablePrompt', 'false')
  };
  // if toggleRule on
  const allAudience = {
    condition: "ANY",
    list: [],
  }

  function filterRulesObject(array): any {
    const filterMakers = {
      condition: "ANY",
      list: array?.list?.map((item, i) => {
        return {
          condition: item.condition,
          list: item.list,
          operation: item.operation
        }
      })
    }
    return filterMakers
  }

  const onRuleSubmit = (): void => {
    apiDashboard
      .post("campaign-mgmt-api/audienceclusters", {
        clusterType: clusterType,
        name: state.rules.name,
        deviceTier: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(filterRulesObject(state.rules.deviceTier))),
        installedApps: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(state.rules.installedApps)),
        locations: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(state.rules.locations)),
        makers: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(filterRulesObject(state.rules.makers))),
        osVersions: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(filterRulesObject(state.rules.osVersions))),
        sourcePackages: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(filterRulesObject(state.rules.sourcePackages))),
        wirelessOperators: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(filterRulesObject(state.rules.wirelessOperators))),
        clientAttributes: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(state.rules.customAttribute)),
        supplementary: { gender: "ALL", ageFrom: 16, ageTo: 60 }
      })
      .then((res) => {
        setSucessMessage(true);
        setSnackBarMessage(res.data.message);
        Mixpanel.track('Audience Created', {
          id: res.data.data.id,
          name: state.rules.name,
          type: clusterType
        });
        handleActiveStepper(0);
        setTimeout(() => {
          history.push("/audience/manage");
        }, 6000);
      })
      .catch((err) => {
        setErrorMessageFlag(true);
        setSnackBarMessage(err.response.data.error);
      });
    sessionStorage.setItem('enablePrompt', 'false')
  };
  const onRuleEditSubmit = (): void => {
    apiDashboard
      .put(`campaign-mgmt-api/audienceclusters/${param?.id}`, {
        clusterType: clusterType,
        name: state.rules.name,
        deviceTier: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(filterRulesObject(state.rules.deviceTier))),
        installedApps: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(state.rules.installedApps)),
        locations: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(state.rules.locations)),
        makers: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(filterRulesObject(state.rules.makers))),
        osVersions: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(filterRulesObject(state.rules.osVersions))),
        sourcePackages: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(filterRulesObject(state.rules.sourcePackages))),
        wirelessOperators: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(filterRulesObject(state.rules.wirelessOperators))),
        clientAttributes: state.rules?.rulesToggle ? JSON.stringify(allAudience) : JSON.stringify(helper.formatClusterCriteria(state.rules.customAttribute)),
        supplementary: { gender: "ALL", ageFrom: 16, ageTo: 60 }
      })
      .then((res) => {
        setSucessMessage(true);
        setSnackBarMessage(res.data.message)
        Mixpanel.track('Audience Updated', {
          id: param.id,
          name: state.rules.name,
          type: clusterType
        });
        handleActiveStepper(0);
        setTimeout(() => {
          history.push("/audience/manage");
        }, 6000);
      })
      .catch((err) => {
        setErrorMessageFlag(true);
        setSnackBarMessage(err.response.data.error)
      });
    sessionStorage.setItem('enablePrompt', 'false')
  };
  let valid = true;
  function validRules(rulesArray: any): boolean {
    if (helper.formatClusterCriteria(rulesArray?.locations)?.list?.length > 0 ||
      helper.formatClusterCriteria(rulesArray?.customAttribute)?.list?.length > 0 ||
      helper.formatClusterCriteria(rulesArray?.deviceTier)?.list?.length > 0 ||
      helper.formatClusterCriteria(rulesArray?.installedApps)?.list?.length > 0 ||
      helper.formatClusterCriteria(rulesArray?.makers)?.list?.length > 0 ||
      helper.formatClusterCriteria(rulesArray?.osVersions)?.list?.length > 0 ||
      helper.formatClusterCriteria(rulesArray?.sourcePackages)?.list?.length > 0 ||
      helper.formatClusterCriteria(rulesArray?.wirelessOperators)?.list?.length > 0) {
      valid = false
    }
    return valid
  }
  const handleValidation = (): boolean => {
    var valid = true;
    if (clusterType === "PHONENUMBER" || clusterType === "CLIENTID") {
      if (state.rules.name.length > 3 && validFileUpload) {
        valid = false;
      }
    }
    if (clusterType === "CAMPAIGN") {
      if (state.rules.name.length > 3 && state.rules?.campaignList?.length > 0) {
        valid = false;
      }
    }
    if (clusterType === "RULE") {
      if (state.rules?.name?.length > 3) {
        valid = false;
      }
    }
    if (clusterType === "RULE" && !state.rules?.rulesToggle) {
      if (state.rules.name.length > 3 && validRules(state.rules)) {
        valid = validRules(state.rules);
      }
    }
    return valid;
  };

  const resetState = () => {
    setAudienceName('')
    setOrAnd("OR")
    setisClicked("YES")
    const modifiedPayload = Object.assign({}, state.rules);
    modifiedPayload['name'] = ""
    modifiedPayload['propmptLoader'] = false;
    modifiedPayload['locations'] = {
      condition: "ANY",
      list: [],
    }
    modifiedPayload['installedApps'] = {
      condition: "ANY",
      list: [],
    }
    modifiedPayload['osVersions'] = {
      condition: "ANY",
      list: [],
    }
    modifiedPayload['makers'] = {
      condition: "ANY",
      list: [],
    }
    modifiedPayload['wirelessOperators'] = {
      condition: "ANY",
      list: [],
    }
    modifiedPayload['sourcePackages'] = {
      condition: "ANY",
      list: [],
    }
    modifiedPayload['deviceTier'] = {
      condition: "ANY",
      list: [],
    }
    modifiedPayload['customAttribute'] = {
      condition: "ANY",
      list: [],
    }
    modifiedPayload['campaignList'] = []
    modifiedPayload['orAnd'] = "OR"
    modifiedPayload['yesNoIgnore'] = "YES"
    modifiedPayload['loadIntialPage'] = false;
    if (window.location.pathname.search('new') > 0) {
      modifiedPayload['rulesToggle'] = window.location.pathname.search('new') > 0 && false
    }
    dispatch({
      type: 'RESET_STATE',
      payload: {
        rulesPayload: modifiedPayload,
      },
    })
  }
  useEffect(() => {
    const modifiedPayload = Object.assign({}, state);
    if (param?.id && (helper.formatClusterCriteria(state.rules?.locations)?.list?.length > 0 ||
      helper.formatClusterCriteria(state.rules?.customAttribute)?.list?.length > 0 ||
      helper.formatClusterCriteria(state.rules?.deviceTier)?.list?.length > 0 ||
      helper.formatClusterCriteria(state.rules?.installedApps)?.list?.length > 0 ||
      helper.formatClusterCriteria(state.rules?.makers)?.list?.length > 0 ||
      helper.formatClusterCriteria(state.rules?.osVersions)?.list?.length > 0 ||
      helper.formatClusterCriteria(state.rules?.sourcePackages)?.list?.length > 0 ||
      helper.formatClusterCriteria(state.rules?.wirelessOperators)?.list?.length > 0)) {
      modifiedPayload['rules']['rulesToggle'] = false;
    } else {
      modifiedPayload['rules']['rulesToggle'] = true;
      if (window.location.pathname.search('new') > 0) {
        modifiedPayload['rules']['rulesToggle'] = false;
      }
    }
    dispatch({
      type: "MODIFY_RULES_TOOGLE",
      payload: modifiedPayload
    });
  }, [showLoader])

  useEffect(() => {
    getOrganization()
    resetState()
    if (param?.id) {
      setShowLoader(true)
      apiDashboard.get(`campaign-mgmt-api/audienceclusters/v2/${param.id}`).then((response) => {
        const modifiedPayload = Object.assign({}, state.rules);
        modifiedPayload['name'] = response.data?.data?.name
        modifiedPayload['clusterType'] = response.data?.data?.clusterType
        setClusterType(response?.data?.data?.clusterType || state.rules.clusterType)
        if (response.data.data.clusterType === "RULE") {
          const locationList = response.data?.data?.locations && JSON.parse(response.data?.data?.locations)
          const installedAppsList = response.data?.data?.installedApps && JSON.parse(response.data?.data?.installedApps)
          modifiedPayload['locations'] = getApiLocationandInstallData(locationList)
          modifiedPayload['installedApps'] = getApiLocationandInstallData(installedAppsList)
          modifiedPayload['makers'] = JSON.parse(response.data?.data?.makers)
          modifiedPayload['osVersions'] = JSON.parse(response.data?.data?.osVersions) === null ? state.rules.osVersions : JSON.parse(response.data?.data?.osVersions)
          modifiedPayload['wirelessOperators'] = JSON.parse(response.data?.data?.wirelessOperators) === null ? state.rules.wirelessOperators : JSON.parse(response.data?.data?.wirelessOperators)
          modifiedPayload['sourcePackages'] = JSON.parse(response.data?.data?.sourcePackages)
          modifiedPayload['deviceTier'] = JSON.parse(response.data?.data?.deviceTier)
          modifiedPayload['customAttribute'] = JSON.parse(response.data?.data?.clientAttributes)
        }
        if (response.data.data.clusterType === "CAMPAIGN") {
          setisClicked(response.data?.data?.campaignCluster?.campaignClusterData[0]?.isClicked)
          setOrAnd(response.data?.data?.campaignCluster?.condition)
          setdata(response.data.data?.campaignCluster?.campaignClusterData)
          modifiedPayload['orAnd'] = response.data?.data?.campaignCluster?.condition
          const campaignList = response.data?.data?.campaignCluster?.campaignClusterData.map((item) => {
            return {
              campaignId: item.campaignId,
              name: item.campaignName,
              isClicked: item.isClicked
            }
          })
          modifiedPayload['campaignList'] = response.data?.data?.campaignCluster?.campaignClusterData?.length > 0 ? campaignList : []
        }
        handleActiveStepper(1)
        // modifiedPayload['propmptLoader'] = true;
        updateRulesPayload(modifiedPayload)
        setShowLoader(false)
      }).catch((error) => {
        setErrorMessageFlag(true);
        setSnackBarMessage(error.response.data.error)
        setTimeout(() => {
          history.push("/audience/manage")
        }, 5000);
      })
    }
  }, [param?.id])
  const [copyAudienceLength, setcopyAudienceLength] = useState(0);
  const [originalAudience, setoriginalAudience] = useState(0)
  function audienceLengthCount(audienceAll: any) {
    return JSON.stringify(audienceAll).length
  }
  const pageLoad = () => {
    // setCopyAudienceLoadPayload(state.rules)
    setcopyAudienceLength(audienceLengthCount(state.rules));
    //   setCopyAudienceLoadPayload(state.rules)
  }
  let copylistAudience = [];
  function allInOne(name, locations, installedApps, osVersions, makers, wirelessOperators, sourcePackages, deviceTier, customAttribute, campaignListData, rulesToggle): any {
    locations?.list?.forEach((allTypeAudience) => {
      allTypeAudience.list.map((innerList) => {
        copylistAudience.push(innerList.id)
        copylistAudience.push(allTypeAudience.operation)
      })
      copylistAudience.push(allTypeAudience.condition)
    })
    copylistAudience.push(locations.condition)
    //
    installedApps?.list?.forEach((allTypeAudience) => {
      allTypeAudience.list.map((innerList) => {
        copylistAudience.push(innerList.id)
        copylistAudience.push(allTypeAudience.operation)
      })
      copylistAudience.push(allTypeAudience.condition)
    })
    copylistAudience.push(installedApps.condition)
    //
    osVersions?.list?.forEach((allTypeAudience) => {
      allTypeAudience.list.map((innerList) => {
        copylistAudience.push(innerList.id)
        copylistAudience.push(allTypeAudience.operation)
      })
      copylistAudience.push(allTypeAudience.condition)
    })
    copylistAudience.push(osVersions.condition)
    makers?.list?.forEach((allTypeAudience) => {
      allTypeAudience.list.map((innerList) => {
        copylistAudience.push(innerList.id)
        copylistAudience.push(allTypeAudience.operation)
      })
      copylistAudience.push(allTypeAudience.condition)
    })
    copylistAudience.push(makers.condition)
    //
    wirelessOperators?.list?.forEach((allTypeAudience) => {
      allTypeAudience.list.map((innerList) => {
        copylistAudience.push(innerList.id)
        copylistAudience.push(allTypeAudience.operation)
      })
      copylistAudience.push(allTypeAudience.condition)
    })
    copylistAudience.push(wirelessOperators.condition)
    //
    sourcePackages?.list?.forEach((allTypeAudience) => {
      allTypeAudience.list.map((innerList) => {
        copylistAudience.push(innerList.id)
        copylistAudience.push(allTypeAudience.operation)
      })
      copylistAudience.push(allTypeAudience.condition)
    })
    copylistAudience.push(sourcePackages.condition)
    //
    deviceTier?.list?.forEach((allTypeAudience) => {
      allTypeAudience.list.map((innerList) => {
        copylistAudience.push(innerList.id)
        copylistAudience.push(allTypeAudience.operation)
      })
      copylistAudience.push(allTypeAudience.condition)
    })
    copylistAudience.push(deviceTier.condition)
    //
    customAttribute?.list?.forEach((allTypeAudience) => {
      allTypeAudience.list.map((innerList) => {
        copylistAudience.push(innerList?.key);
        copylistAudience.push(innerList?.value);
        copylistAudience.push(allTypeAudience.operation)
      })
      copylistAudience.push(allTypeAudience.condition)
    })
    copylistAudience.push(customAttribute?.condition)
    //
    campaignListData?.forEach((campaign) => {
      copylistAudience.push(campaign.campaignId)
    })
    copylistAudience.push(name);
    copylistAudience.push(rulesToggle);
    return copylistAudience;
  }
  let chekcAudeince = allInOne(
    state.rules?.name,
    state.rules?.locations,
    state.rules?.installedApps,
    state.rules?.osVersions,
    state.rules?.makers,
    state.rules?.wirelessOperators,
    state.rules?.sourcePackages,
    state.rules?.deviceTier,
    state.rules?.customAttribute,
    state.rules?.campaignList,
    state.rules?.rulesToggle
  )
  useEffect(() => {
    if (window.location.pathname.indexOf('edit') > 0 && state.rules.loadIntialPage) {
      const newEditList = Object.assign({}, chekcAudeince)
      setCopyAudienceLoadPayload(newEditList)
    }
    if (window.location.pathname.indexOf('new') > 0 && state.rules.loadIntialPage) {
      pageLoad()
    }
    sessionStorage.setItem('enablePrompt', 'false')
  }, [state.rules.loadIntialPage, showLoader, window.location.pathname.indexOf('new') > 0])
  useEffect(() => {
    setoriginalAudience(audienceLengthCount(state.rules))
    if (window.location.pathname.indexOf('new') > 0 && state.rules.loadIntialPage) {
      sessionStorage.setItem('enablePrompt', 'false')
      copyAudienceLength === originalAudience ? sessionStorage.setItem('enablePrompt', 'false') : sessionStorage.setItem('enablePrompt', 'true');
    }
  }, [state.rules.loadIntialPage, showLoader, state.rules, copyAudienceLength === originalAudience, window.location.pathname.indexOf('new') > 0])

  useEffect(() => {
    // setAudienceLoadPayload(state.rules)
    if (window.location.pathname.indexOf('edit') > 0 && state.rules.name.length > 0) {
      // if (state.rules.rulesToggle && !validRules(state.rules)) {
      const newEditList = Object.assign({}, chekcAudeince)
      setAudienceLoadPayload(newEditList)
      setoriginalAudience(audienceLengthCount(state.rules))
      JSON.stringify(audienceLoadPayload) === JSON.stringify(copyAudienceLoadPayload) ? sessionStorage.setItem('enablePrompt', 'false') : sessionStorage.setItem('enablePrompt', 'true');
      // copyAudienceLength === originalAudience ? sessionStorage.setItem('enablePrompt', 'false') : sessionStorage.setItem('enablePrompt', 'true');
      // }
    }
  }, [state.rules, JSON.stringify(audienceLoadPayload) === JSON.stringify(copyAudienceLoadPayload),
  state.rules?.locations?.list,
  state.rules?.customAttribute?.list,
  state.rules?.deviceTier?.list,
  state.rules?.installedApps?.list,
  state.rules?.makers?.list,
  state.rules?.osVersions?.list,
  state.rules?.sourcePackages?.list,
  state.rules?.wirelessOperators?.list]);
  const handleSelectedRules = () => {
    switch (clusterType) {
      case "PHONENUMBER":
        return (
          <div className="cr-top-wrapper">
            <h5 className="label-tooltip title-padding small-tooltip">{t('TARGET_BY_PHONE_NUMBER')}
              <LightTooltip title={<label>{t('TOOLTIP_FOR_PHONE_BASE_CLUSTER_HEADER')}</label>}
              /></h5>
            <hr></hr>
            <div className="cr-body-content">
              <div className="file-input-field">
                <p className="label">{`${t('TARGET_BY_PHONE_NUMBER')} *`}</p>
                <input
                  type="file"
                  name="file"
                  placeholder={t('TARGET_BY_PHONE_NUMBER')}
                  onChange={(e) => handleFileUpload(e)}
                  accept=".csv"
                  style={{ cursor: "pointer" }}
                />
                <span>
                  {t('UPLOAD_FILES')} <Publish />
                </span>
                <p className="file-name">
                  <FileCopy /> {files.length > 0 ? files : "No files"}
                </p>
                {uploadPercentage > 1 && cancelAxios && <LinearBarWithValueLabel uploadPercentage={uploadPercentage} />}
                <p className="progress-bar" style={{ padding: "4px", color: "blue" }} >{uploadPercentage > 0 && uploadPercentage < 50 && cancelAxios && t('FILE_UPLOAD_PROGRESS_INITIAL')} {uploadPercentage > 50 && cancelAxios && t('FILE_UPLOAD_PROGRESS_LATER')}</p>
                {/* {uploadPercentage > 5 && <Button variant="contained"
                  color="primary"
                  type="submit"
                  className="button-xs"
                >Cancel</Button>} */}
              </div>
              <div className="table-preview">
                <p className="error">{cancelAxios && fileSanitationError}</p>
                <p className="error">{cancelAxios && fileUploadErrorTxt}</p>
                {previewFlag && cancelAxios && <Spinner color="lightblue" />}
                {isFileSanitationProgress && cancelAxios && (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('BEFORE_NORMALIZATION')}</TableCell>
                          <TableCell>{t('AFTER_NORMALIZATION')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {FileSanitationData.map((row: any, index: number) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{row.before}</TableCell>
                              <TableCell>{row.after}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </div>
            </div>
          </div>
        );
      case "CLIENTID":
        return (
          <div className="cr-top-wrapper">
            <h5 className="label-tooltip title-padding small-tooltip">{t('CLIENT_ID')}
              <LightTooltip title={<label>{t('TOOLTIP_FOR_CLIENT_BASE_CLUSTER_HEADER')}</label>}
              /> </h5>
            <hr></hr>
            <div className="cr-body-content">
              <div className="file-input-field">
                <p className="label">{`${t('TARGET_BY_CLIENT_ID')} *`}</p>
                <input
                  type="file"
                  name="file"
                  placeholder={"Target By Client Ids"}
                  onChange={(e) => handleFileUpload(e)}
                  accept=".csv"
                  style={{ cursor: "pointer" }}
                />
                <span>
                  {t('UPLOAD_FILES')} <Publish />
                </span>
                <p className="file-name">
                  <FileCopy /> {files.length > 0 ? files : "No files"}
                </p>
                {uploadPercentage > 1 && cancelAxios && <LinearBarWithValueLabel uploadPercentage={uploadPercentage} />}
                <p className="progress-bar" style={{ padding: "4px", color: "blue" }} >{uploadPercentage > 0 && uploadPercentage < 50 && cancelAxios && t('FILE_UPLOAD_PROGRESS_INITIAL')} {uploadPercentage > 50 && cancelAxios && t('FILE_UPLOAD_PROGRESS_LATER')}</p>
                {/* {uploadPercentage > 5 && <Button variant="contained"
                  color="primary"
                  type="submit"
                  className="button-xs"
                  onClick={() => setCancleRequest(true)}
                >Cancel</Button>} */}
                <p className="error">{cancelAxios && fileUploadErrorTxt}</p>
              </div>
            </div>
          </div>
        );
      case "CAMPAIGN":
        return (
          <div className="targeting-rules cr-top-wrapper">
            <h5 className="title-padding">{t('CAMPAIGN')}</h5>
            <hr></hr>
            <div className="cr-body-content">
              <Autocomplete
                multiple
                id="campaign-list"
                noOptionsText=""
                value={state.rules.campaignList ?? ""}
                options={clusterData.length > 0 ? clusterData : []}
                disableCloseOnSelect
                getOptionLabel={(option: any) => option.name || ''}
                onChange={(e, newValue) => {
                  setCampignData(newValue);
                  const modifiedPayload = Object.assign({}, state.rules);
                  modifiedPayload['campaignList'] = newValue
                  updateRulesPayload(modifiedPayload);
                }}
                renderInput={(params) => (
                  <TextField
                    className="multi-select-field"
                    {...params}
                    placeholder={t('AUDIENCE_CAMPAIGN_PLACEHOLDER')}
                    onChange={(e) => searchCluster(e)}
                    onBlur={() => {
                      if (CampignData.length > 0) {
                        setErrorFlag(false)
                      } else
                        setErrorFlag(true)
                    }
                    }
                    error={errorFlag}
                    helperText={errorFlag && t('SEARCH_AND_SELECT_CAMPAIGN')}
                    name="clusterValue"
                    value={clusterValue}
                    // label={`${t('SELECT_CAMPAIGN')} *`}
                    label={<div className="label-tooltip">{`${t('SELECT_CAMPAIGN')} *`}
                      <LightTooltip title={<label>{t('TOOLTIP_FOR_CAMPAIGN_TYPE')}</label>} /></div>}
                    variant="outlined"
                    InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                    defaultValue={CampignData || {}}
                  />
                )}
              />
              {data.length === 0 && campaignEmptyFlag && (
                <p className="error">{t('SEARCH_LIST_EMPTY_MESSAGE')}</p>
              )}
              <div className="bottom-btn-wrap">
                <div className="camp-btn-wrap">
                  <Button
                    className={`${orAnd === "AND" && "active"} add_btn`}
                    color="primary"
                    onClick={() => {
                      setCampaignChangeFlag(true)
                      setOrAnd("AND");
                      const modifiedPayload = Object.assign({}, state.rules);
                      modifiedPayload["orAnd"] = "AND";
                      updateRulesPayload(modifiedPayload);
                    }}
                  >
                    {t('AND')}
                  </Button>
                  <Button
                    className={`${orAnd === "OR" && "active"} add_btn`}
                    color="primary"
                    onClick={() => {
                      setCampaignChangeFlag(false)
                      setOrAnd("OR");
                      const modifiedPayload = Object.assign({}, state.rules);
                      modifiedPayload["orAnd"] = "OR";
                      updateRulesPayload(modifiedPayload);
                    }}
                  >
                    {t('OR')}
                  </Button>
                </div>
              </div>
              <div className="bottom-btn-wrap mt-25">
                <FormControl component="fieldset">
                  <FormLabel component="legend" className="legend">
                    <div className="label-tooltip cc-label-text" >
                      {`${t('TARGET_THE_ACTION')} * :`}
                      <LightTooltip title={<label>{t('TOOLTIP_FOR_AUDINCE_CAMPAIGN')}</label>} /> <b>{t('CLICKED')}</b>
                    </div>
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="isCliked"
                    name="isClicked"
                    color="primary"
                    value={isClicked}
                    onChange={handleClickedChange}
                  // color="primary"
                  >
                    <FormControlLabel
                      value="YES"
                      control={<Radio color="primary" />}
                      label={<div className="label-tooltip small-tooltip">{`${t('YES')}`}
                        <LightTooltip title={<label>{t('TOOLTIP_FOR_YES')}</label>} /></div>}

                    />
                    <FormControlLabel
                      value="NO"
                      control={<Radio color="primary" />}
                      label={<div className="label-tooltip small-tooltip">{`${t('NO')}`}
                        <LightTooltip title={<label>{t('TOOLTIP_FOR_NO')}</label>} /></div>}
                    />
                    <FormControlLabel
                      value="IGNORE"
                      control={<Radio color="primary" />}
                      label={<div className="label-tooltip small-tooltip">{`${t('IGNORE')}`}
                        <LightTooltip title={<label>{t('TOOLTIP_FOR_IGNORE')}</label>} /></div>}
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>
        );
      case "RULE":
        return <Rules validRule={validRules} />;
      default:
        return <h1>No match</h1>;
    }
  };

  return (
    <Grid container spacing={3}>
      <Backdrop className={classes.backdrop} open={showLoader}>
        <CircularProgress color="primary" />
      </Backdrop>
      {
        sucessMessage && (
          <SnackBarMessage open={sucessMessage} onClose={(): void => setSucessMessage(false)}
            severityType={"success"} message={snackBarMessage} />)
      }
      {
        errorMessageFlag && (
          <SnackBarMessage open={errorMessageFlag} onClose={(): void => setErrorMessageFlag(false)}
            severityType={"error"} message={snackBarMessage} />)
      }
      <Grid item md={8} xs={12}>
        <div className="cc-form-wrapper">
          <div className="cr-top-main">
            <div className="cr-top-wrapper">
              <h5 className="title-padding">
                {t('INFORMATION_FOR_REGISTER_AUDIENCE')}
              </h5>
              <hr></hr>
              <div className="cr-body-content audience-section">
                <S.Container className="cc-form-wrapper">
                  <div className="form-row">
                    <TextField
                      variant="outlined"
                      aria-describedby="audience-name"
                      placeholder={t('ENTER_AUDIENCE_NAME')}
                      label={`${t('AUDIENCE_NAME')} *`}
                      name="name"
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => {
                        setAudienceName(e.currentTarget.value);
                        debounceOnChange(e.currentTarget.value);
                        const modifiedPayload = Object.assign({}, state.rules);
                        modifiedPayload["name"] = e.currentTarget.value;
                        updateRulesPayload(modifiedPayload);
                      }}
                      value={state.rules.name}
                      type="text"
                    />
                    <p style={{ color: "red" }}>{audienceNameCheckError}</p>
                  </div>

                  <div className="form-row">
                    <FormControl className="form-select-box">
                      <InputLabel variant="filled" style={{ pointerEvents: "auto" }} >
                        {/* {t('CLUSTERIZATION_BASED_ON')} */}
                        <div className="label-tooltip">{`${t('CLUSTERIZATION_BASED_ON')} *`}
                          <LightTooltip title={<label>{t('TOOLTIP_FOR_CLUSTER_TYPE')}</label>} /></div>
                      </InputLabel>
                      <Select
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left"
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left"
                          },
                          getContentAnchorEl: null
                        }}
                        label={t('CLUSTER')}
                        value={state.rules.clusterType}
                        onChange={(e) => {
                          // setClusterType(e.target.value.toString());
                          openPopup(e.target.value.toString())
                          // const modifiedPayload = Object.assign({}, state.rules);
                          // modifiedPayload["clusterType"] = e.target.value.toString();
                          // updateRulesPayload(modifiedPayload);
                        }}
                        name="clusterType"
                        disabled={param.id?.length > 0}
                      >
                        {clusterTypeList.map((type) => (
                          <MenuItem
                            key={type.id}
                            value={type.id}
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                              setUploadFiles(true);
                            }}
                            classes={{
                              root: classes.menuItemRoot,
                              selected: classes.menuItemSelected
                            }}
                          >
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </S.Container>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>{handleSelectedRules()}</div>
          </div>

          <div className="cc-global-buttons registration-btn">
            <Button
              variant="outlined"
              color="primary"
              type="button"
              className="button-xs"
              onClick={() => {
                sessionStorage.setItem('enablePrompt', 'false');
                setTimeout(() => {
                  history.push("/audience/manage");
                }, 500);
              }}
            >
              {t('CANCEL_BUTTON')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="button-xs"
              onClick={
                clusterType === "CAMPAIGN" ? onCampaignSubmit :
                  (param?.id && clusterType === "RULE") ? onRuleEditSubmit :
                    (param?.id && clusterType === "CAMPAIGN") ? onCampaignSubmit :
                      clusterType === "RULE" ? onRuleSubmit : onSubmitPhoneOrClientPost
              }
              endIcon={
                !sucessMessage ? (
                  <ArrowForwardIcon />
                ) : (
                  <Spinner color="lightblue" />
                )
              }
              disabled={handleValidation() || sucessMessage}
            >
              {t('FINISH_BUTTON')}
            </Button>
          </div>
        </div>
      </Grid>
      <Grid item md={4} xs={12}></Grid>
      {isOpenPopup && <ClusterParameter resetState={resetState} type={clusterParameter} handleOpen={handleOpenModal} setCluster={handleCluster} />}
    </Grid >
  );
}

export default Registration;