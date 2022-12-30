import React, { useContext, useEffect, useCallback } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Field } from "formik";
import { apiDashboard, helper } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';
import {
  FormGroup,
  Switch,
  Grid,
  TextField,
  Button,
  Chip,
  FormControlLabel,
} from "@material-ui/core";
import { GlobalContext } from "../../../../context/globalState";
import { CAMPAIGN_ACTIONS } from "../../../../context/CampaignFormReducer";
import { useState } from "react";
import PeopleTwoToneIcon from '@material-ui/icons/PeopleTwoTone';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';

const ClusterElement = ({ values, index, handleChange, innerIndex }: any) => {
  const { state } = useContext(GlobalContext);
  const { dispatch } = useContext(GlobalContext);
  const [clusterValue, setClusterValue] = useState("");
  const [data, setdata] = useState([]);
  const [isClusterListEmpty, setClusterListEmptyFlag] = useState(false);
  const [remove, setremove] = useState(false);
  const [clusterError, setClusterError] = useState('');
  const { t } = useTranslation();
  const [selectedOperator, setSelectedOperator] = useState("OR");

  useEffect(() => {
    if (window.location.pathname.indexOf('edit') >= 0) {
      if (state.formValues.settings.clusterArray.list && state.formValues.settings.clusterArray.list[0].list
        && state.formValues.settings.clusterArray.list[0].list[0].id !== '') {
        const modifiedPayload = Object.assign({}, state.formValues);
        modifiedPayload['settings']['isCallReachCountApi'] = false;

        dispatch({
          type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
          payload: {
            campaignPayload: modifiedPayload,
            currentPageName: 'settings',
            campaignBreadCrumbList: state.campaignBreadCrumbList,
            campaignStepsArray: state.campaignStepsArray
          }
        });
      }
    }
  }, [])

  function handleClusterSearchFn(inputValue) {
    if (inputValue.length >= 3) {
      apiDashboard
        .get(`campaign-mgmt-api/audienceclusters?filter=${inputValue}&limit=20`, {
          value: inputValue,
        })
        .then((res) => {
          setdata(res.data.data.content);
        }, error => {
          setdata([]);
          setClusterListEmptyFlag(true);
          console.log(helper.getErrorMessage(error));
        });
    }
  }
  const debounceOnChange = useCallback(helper.debounce(handleClusterSearchFn, 600), []);

  const clusterValues =
    data.length > 0 &&
    data.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
  const [validCombination, setValidCombination] = useState(false);

  const updateSettingsSectionPayload = (
    payload: any,
    section: string,
    isCallReachCountApi: boolean
  ): void => {
    let isClusterSectionValid;
    let clusterFilterArray = [];
    let isShowClusterWarningFlag = false;
    let isCallAudienceReachCount = false;
    payload.settings.clusterArray.list.forEach(groupElem => {
      groupElem.list.length !== 0 && groupElem.list.forEach(ele => {
        if (ele.id === '') {
          clusterFilterArray.push(ele);
        } else {
          if (groupElem.list.length < 2 && payload.settings.clusterArray.list.length < 2 && !isCallReachCountApi) {
            isCallAudienceReachCount = true;
          } else {
            isCallAudienceReachCount = false;
            isShowClusterWarningFlag = true;
          }
        }
      })
    })

    if (clusterFilterArray.length === 0) {
      if (payload.settings.clusterArray.list.length !== 0 && payload.settings.clusterArray.list.some(val => val.operation == 'INCLUDE')) {
        isClusterSectionValid = true;
      } else {
        isClusterSectionValid = false;
        setValidCombination(true);
      }
    } else {
      isClusterSectionValid = false;
      isCallAudienceReachCount = false;
    }
    payload['settings']['isCallReachCountApi'] = isCallAudienceReachCount;
    payload['settings']['isSettingSectionValid']['isClusterSectionValid'] = isClusterSectionValid;
    payload['settings']['isShowClusterWarningFlag'] = isShowClusterWarningFlag;
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
      payload: {
        campaignPayload: payload,
        currentPageName: section,
        campaignBreadCrumbList: state.campaignBreadCrumbList,
        campaignStepsArray: state.campaignStepsArray
      },
    });
  };

  const removeCluster = (payload: string, sectionName: string): void => {
    updateSettingsSectionPayload(payload, sectionName, true);
  };

  const handleChangeClusterOperation = (e: any, index) => {
    setValidCombination(false);
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload.settings.clusterArray.list[index]["operation"] = e.target
      .checked
      ? "EXCLUDE"
      : "INCLUDE";
    updateSettingsSectionPayload(modifiedPayload, "settings", true);
  };

  const searchCluster = (e) => {
    setClusterValue(e.target.value);
    debounceOnChange(e.target.value);
  };

  const updateOperatorSelection = (event: React.MouseEvent<HTMLElement>, selectedOperator: string | null) => {
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload["settings"]["clusterArray"]["list"][index]["condition"] = (selectedOperator === "OR") ? "ANY" : "ALL";
    modifiedPayload["settings"]['isCallReachCountApi'] = false;
    setSelectedOperator(selectedOperator);
    updateSettingsSectionPayload(modifiedPayload, "settings", true);
  }

  return (
    <div>
      <React.Fragment>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <div className="auto-complete-field vertical-align">
            {state.formValues.settings.clusterArray.list[0 || index].list[
              innerIndex || 0
            ]?.name === '' && <Autocomplete
                // id="tags-filled"
                noOptionsText=''
                options={clusterValues.length > 0 ? clusterValues : []}
                getOptionLabel={(option: any) => option.name}
                onChange={(e, newValue) => {
                  handleChange(e);
                  const modifiedPayload = Object.assign({}, state.formValues);
                  if (innerIndex !== undefined) {
                    const clusterAray = modifiedPayload["settings"]["clusterArray"]["list"][index][
                      "list"
                    ];
                    if (clusterAray.some(e => e.name === newValue.name)) {
                      modifiedPayload["settings"]["clusterArray"]["list"][index]["list"].pop();
                    } else {
                      modifiedPayload["settings"]["clusterArray"]["list"][index][
                        "list"
                      ][innerIndex] = newValue;
                    }
                  } else {
                    modifiedPayload["settings"]["clusterArray"]["list"][index][
                      "list"
                    ][0] = newValue;

                  }
                  setClusterError('');
                  updateSettingsSectionPayload(modifiedPayload, "settings", false);
                  // setremove(true);
                }}
                renderOption={(option) => (
                  <React.Fragment>
                    <div className="select-list">
                      <span>{option.name}</span>
                      {/* <span className="reach-count"> <PeopleTwoToneIcon /> 100000</span> */}
                    </div>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={t("SETTINGS_AUDIENCE_CLUSTER_LABEL")}
                    onChange={(e) => searchCluster(e)}
                    name="clusterValue"
                    InputLabelProps={{ shrink: true }}
                    placeholder={t('SETTINGS_AUDIENCE_PLACEHOLDER')}
                    value={clusterValue}
                  />
                )}
                style={{ display: remove && "none" }}
              />}
            {(data.length === 0 && isClusterListEmpty) && <p >{t('SEARCH_LIST_EMPTY_MESSAGE')}</p>}
            {<p className="error-wrap error">{clusterError} </p>}
            {state.formValues.settings.clusterArray.list[0 || index].list[
              innerIndex || 0
            ]?.name !== '' &&
              (
                <Chip
                  variant="outlined"
                  color="primary"
                  label={
                    state.formValues.settings.clusterArray.list[0 || index]
                      .list[innerIndex || 0]?.name
                  }
                  disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                  onDelete={() => {
                    const modifiedPayload = Object.assign({}, state.formValues);
                    const innerValue =
                      innerIndex === undefined ? '0' : innerIndex;
                    if (innerValue) {
                      modifiedPayload["settings"]["clusterArray"]["list"][
                        index
                      ]["list"].splice(innerValue, 1);
                      if (modifiedPayload["settings"]["clusterArray"]["list"][index]["list"].length === 0) {
                        // modifiedPayload["settings"]["clusterArray"][
                        //   "list"
                        // ].splice(index, 1);
                        modifiedPayload["settings"]["clusterArray"]["list"][index]["list"][0] = {
                          id: "",
                          name: "",
                        }
                        if (modifiedPayload["settings"]["clusterArray"]["list"].length === 1) {
                          setClusterError(t('SETTINGS_AUDIENCE_CLUSTER_REQUIRED_ERROR'));
                        }

                      }
                      removeCluster(modifiedPayload, "settings");
                    } else {
                      modifiedPayload["settings"]["clusterArray"][
                        "list"
                      ].splice(index, 1);
                      setClusterError('');
                      removeCluster(modifiedPayload, "settings");
                    }
                  }}
                />
              )}
          </div>


          <div className="audience-action">
            <div className="switch-wrapper">
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid
                  item
                  className={`${values.list[index].operation === "INCLUDE"
                    ? "switch-label select"
                    : "switch-label"
                    }`}
                >
                  {t('SETTINGS_AUDIENCE_SECTION_SWITCH_INCLUDE')}
                </Grid>
                <Grid item>
                  <div className="switchery">
                    <FormControlLabel
                      control={<Switch
                        id={`list[${index}].operation`}
                        checked={values.list[index].operation === "EXCLUDE"}
                        onChange={(e) => handleChangeClusterOperation(e, index)}
                        disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                      />}
                      label=""
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  className={`${values.list[index].operation === "EXCLUDE"
                    ? "switch-label select"
                    : "switch-label"
                    }`}
                >
                  {t('SETTINGS_AUDIENCE_SECTION_SWITCH_EXCLUDE')}
                </Grid>
              </Grid>
            </div>
            <div className="orbtn-wrap">
              <ToggleButtonGroup
                value={selectedOperator}
                exclusive
                onChange={updateOperatorSelection}
                aria-label="Logic Operator"
              >
                <ToggleButton value="AND" aria-label="AND Operator" className={`${values.list[index].condition === "ALL" ? "active" : ""}`}
                  disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}>
                  {t("SETTINGS_AUDIENCE_SECTION_BUTTON_AND")}
                </ToggleButton>
                <ToggleButton value="OR" aria-label="OR Operator" className={`${values.list[index].condition === "ANY" ? "active" : ""}`}
                  disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}>
                  {t("SETTINGS_AUDIENCE_SECTION_BUTTON_OR")}
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="contained"
                color="primary"
                className="button-add"
                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                onClick={() => {
                  const modifiedPayload = Object.assign({}, state.formValues);
                  modifiedPayload["settings"]["clusterArray"]["list"][index][
                    "list"
                  ].push({
                    id: "",
                    name: "",
                  });
                  updateSettingsSectionPayload(modifiedPayload, "settings", true);
                }}
              >
                +
              </Button>
            </div>

          </div>

          <div className="delete-aud-row"
            onClick={() => {
              const modifiedPayload = Object.assign({}, state.formValues);
              const innerValue =
                innerIndex === undefined ? '0' : innerIndex;
              if (innerValue) {
                modifiedPayload["settings"]["clusterArray"]["list"][
                  index
                ]["list"].splice(innerValue, 1);
                if (modifiedPayload["settings"]["clusterArray"]["list"][index]["list"].length === 0) {
                  // modifiedPayload["settings"]["clusterArray"][
                  //   "list"
                  // ].splice(index, 1);
                  modifiedPayload["settings"]["clusterArray"]["list"][index]["list"][0] = {
                    id: "",
                    name: "",
                  }
                  if (modifiedPayload["settings"]["clusterArray"]["list"].length === 1) {
                    setClusterError(t('SETTINGS_AUDIENCE_CLUSTER_REQUIRED_ERROR'));
                  }

                }
                removeCluster(modifiedPayload, "settings");
              } else {
                modifiedPayload["settings"]["clusterArray"][
                  "list"
                ].splice(index, 1);
                setClusterError('');
                removeCluster(modifiedPayload, "settings");
              }
            }}
          >
            <DeleteTwoToneIcon />
          </div>
        </Grid>
      </React.Fragment>
      {validCombination && <p className="error">{t('SETTINGS_AUDIENCE_CLUSTER_INCLUDE_REQUIRED_ERROR')}</p>}
    </div>
  );
};

export default ClusterElement;