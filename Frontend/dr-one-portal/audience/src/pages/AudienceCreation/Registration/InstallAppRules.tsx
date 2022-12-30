import React, { useContext, useEffect, useCallback } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Field } from "formik";
import { apiDashboard } from "@dr-one/utils";
import _ from "lodash";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';

import {
  FormGroup,
  Switch,
  Grid,
  TextField,
  Button,
  Chip,
  FormControlLabel,
} from "@material-ui/core";
import { GlobalContext } from "../../../context/globalState";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import makeStyles from "@material-ui/core/styles/makeStyles";
import HelpIcon from '@material-ui/icons/Help';
import { LightTooltip } from "@dr-one/shared-component";
const useStyles = makeStyles({
  customTextField: {
    "& input::placeholder": {
      fontSize: "10px"
    }
  }
})
const installAppRules = ({ values, index, handleChange, innerIndex }: any) => {
  const param = useParams()
  const { state } = useContext(GlobalContext);
  const { dispatch } = useContext(GlobalContext);
  const [installAppValue, setinstallAppValue] = useState("");
  const [data, setdata] = useState([]);
  const [remove, setremove] = useState(false);
  const [installAppValues, setinstallAppValues] = useState([]);
  const [installAppEmptyFlag, setInstallAppEmptyFlag] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState("OR");
  const { t } = useTranslation();

  function handleallInstallSearchFn(inputValue): void {
    apiDashboard
      .get(`campaign-mgmt-api/installedapps?filter=${inputValue}&limit=20`, {
        value: inputValue,
      })
      .then(
        (res) => {
          setdata(res.data.data);
        },
        (error) => {
          setdata([]);
          setInstallAppEmptyFlag(true);
        }
      );
  }
  const debounceFn = useCallback(
    _.debounce(handleallInstallSearchFn, 1000),
    []
  );
  useEffect(() => {
    const installApp =
      data.length > 0 &&
      data.map((item) => {
        return {
          id: item.id,
          name: item.appName,
          count: item.count,
          packageName: item.packageName,
        };
      });
    setinstallAppValues(installApp);
  }, [data]);

  const updateRulesPayload = (payload: any): void => {
    dispatch({
      type: "MODIFY_RULES",
      payload: {
        rulesPayload: payload,
      },
    });
  };
  const removeRulesInstallApp = (payload: string): void => {
    dispatch({
      type: "REMOVE_RULES",
      payload: {
        rulesPayload: payload,
      },
    });
  };
  const searchInstallApp = (e) => {
    setinstallAppValue(e.target.value);
    debounceFn(e.target.value);
  };
  const handleInstallappOperation = (e: any, index): void => {
    const modifiedPayload = Object.assign({}, state.rules);
    if (index === 0 && innerIndex === undefined && state.rules.installedApps.list?.length === 0) {
      modifiedPayload.installedApps.list.push({
        list: [],
        operation: e.target.checked ? "EXCLUDE" : "INCLUDE"
      })
      updateRulesPayload(modifiedPayload);
    } else {
      modifiedPayload.installedApps.list[index]["operation"] = e.target.checked
        ? "EXCLUDE"
        : "INCLUDE";
      updateRulesPayload(modifiedPayload);
    }
  };
  const updateOperatorSelection = (event: React.MouseEvent<HTMLElement>, selectedOperator: string | null) => {

    const modifiedPayload = Object.assign({}, state.rules);
    if (index === 0 && innerIndex === undefined && state.rules.installedApps.list?.length === 0) {
      modifiedPayload.installedApps.list.push({
        list: [],
        condition: selectedOperator === "OR" ? "ANY" : "ALL"
      })
      updateRulesPayload(modifiedPayload);
    }
    else {
      modifiedPayload.installedApps.list[index]["condition"] = (selectedOperator === "OR") ? "ANY" : "ALL";
    }
    setSelectedOperator(selectedOperator);
    updateRulesPayload(modifiedPayload);
  }
  const classes = useStyles();
  return (
    <div>
      <React.Fragment>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <div className="auto-complete-field">
            <Autocomplete
              options={installAppValues.length > 0 ? installAppValues : []}
              getOptionLabel={(option: any) => option.name}
              closeIcon=""
              noOptionsText=''
              onChange={(e, newValue): void => {
                handleChange(e);
                const modifiedPayload = Object.assign({}, state.rules);
                if (index === 0 && innerIndex === undefined && state.rules?.installedApps?.list?.length === 0) {
                  modifiedPayload["installedApps"]["list"].push({ list: [newValue] })
                  updateRulesPayload(modifiedPayload);
                }
                else {
                  modifiedPayload["installedApps"]["list"][index]["list"][innerIndex === undefined ? 0 : innerIndex] = newValue
                  updateRulesPayload(modifiedPayload);
                }
                setremove(true);
                // searchInstallApp("")
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  classes={{ root: classes.customTextField }}
                  variant="outlined"
                  placeholder={t('AUDIENCE_INSTALL_APP_PLACEHOLDER')}
                  InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                  label={
                    <div className="label-tooltip">{t('INSTALLED_APPLICATIONS')}
                      <LightTooltip title={<label>{t('TOOLTIP_RULE_SECTION_INSTALL_APPLICATION')}</label>}
                      /> </div>
                  }
                  onChange={(e) => { searchInstallApp(e); setinstallAppValue(e.target.value); }}
                  name="installAppValue"
                  value={installAppValue || ''}
                />
              )}
              style={{
                display: (param?.id && state?.rules?.installedApps?.list[index || 0]?.list[innerIndex || 0]
                  ?.name !== undefined) ? "none" : state?.rules?.installedApps?.list[index || 0]?.list[innerIndex || 0]
                    ?.name !== undefined ? "none" : remove && "none"
              }}
            />
            {data.length === 0 && installAppEmptyFlag && (
              <p className="error">{t('SEARCH_LIST_EMPTY_MESSAGE')}</p>
            )}
            {state?.rules?.installedApps?.list[index || 0]?.list[
              innerIndex || 0]?.name !== undefined && (
                <Chip
                  variant="outlined"
                  color="primary"
                  label={
                    state.rules?.installedApps?.list[0 || index]?.list[
                      innerIndex || 0
                    ]?.name
                  }
                  onDelete={(): void => {
                    const modifiedPayload = Object.assign({}, state.rules);
                    const innerValue = innerIndex === undefined ? 0 : innerIndex;
                    modifiedPayload["installedApps"]["list"][index]["list"].splice(innerValue, 1);
                    setremove(false);
                    if (innerIndex === undefined) {
                      modifiedPayload["installedApps"]["list"][index]["list"].splice(1, 1)
                    }
                    removeRulesInstallApp(modifiedPayload);
                    setremove(false);
                    // if (innerValue) {
                    //   modifiedPayload["installedApps"]["list"][index][
                    //     "list"
                    //   ].splice(innerValue, 1);
                    //   removeRulesInstallApp(modifiedPayload);
                    // } else {
                    //   modifiedPayload["installedApps"]["list"][index][
                    //     "list"
                    //   ].splice(innerValue, 1);
                    //   removeRulesInstallApp(modifiedPayload);
                    //   // setLocationValue("");
                    // }
                    // if (
                    //   modifiedPayload["installedApps"]["list"][index]["list"]
                    //     .length === 0
                    // ) {
                    //   modifiedPayload["installedApps"]["list"][index][
                    //     "list"
                    //   ][0] = []
                    //   setremove(false);

                    //   if (
                    //     modifiedPayload["installedApps"]["list"].length === 1
                    //   ) {
                    //     setremove(false);
                    //   }
                    //   removeRulesInstallApp(modifiedPayload);
                    // }
                  }}
                />
              )}
          </div>

          <div className="audience-action">
            <div className="switch-wrapper">
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid
                  item
                  className={`${values?.installedApps?.list[index]?.operation === "INCLUDE"
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
                        checked={
                          values.installedApps?.list[index]?.operation === "EXCLUDE"
                        }
                        onChange={(e) => { handleInstallappOperation(e, index) }}
                      />}
                      label=""
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  className={`${values.installedApps?.list[index]?.operation === "EXCLUDE"
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
                <ToggleButton disabled={values.installedApps?.list[index]?.condition === "ALL" ? true : false} value="AND" aria-label="AND Operator" className={values.installedApps.list[index]?.condition === "ALL" ? 'active' : ''}>
                  {t("AND")}
                </ToggleButton>
                <ToggleButton disabled={values.installedApps?.list[index]?.condition === "ANY" ? true : false} value="OR" aria-label="OR Operator" className={`${values.installedApps?.list[index]?.condition === "ANY" ? 'active' : values.installedApps?.list[index]?.condition === "ALL" ? '' : 'active'}`}>
                  {t("OR")}
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="contained"
                color="primary"
                className="button-add"
                // disabled={index === 0 && innerIndex === undefined && state.rules?.installedApps?.list?.length === 0}
                onClick={() => {
                  const modifiedPayload = Object.assign({}, state.rules);
                  modifiedPayload["installedApps"]?.list[index]["list"].push({});
                  updateRulesPayload(modifiedPayload);
                }}
              >
                +
              </Button>
            </div>

          </div>

          <div className="delete-aud-row"
            onClick={(): void => {
              const modifiedPayload = Object.assign({}, state.rules);
              const innerValue = innerIndex === undefined ? 0 : innerIndex;
              if (innerValue) {
                modifiedPayload["installedApps"]["list"][index][
                  "list"
                ].splice(innerValue, 1);
                removeRulesInstallApp(modifiedPayload);
              }
            }}
          >
            <DeleteTwoToneIcon />
          </div>
        </Grid>
      </React.Fragment>
    </div>
  );
};

export default installAppRules;