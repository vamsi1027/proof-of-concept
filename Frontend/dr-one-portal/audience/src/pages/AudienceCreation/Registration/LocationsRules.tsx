import React, { useContext, useEffect, useCallback } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Field } from "formik";
import { apiDashboard } from "@dr-one/utils";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import _ from "lodash";

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
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { useParams } from 'react-router-dom'
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
const LocationsRules = ({ values, index, handleChange, innerIndex }: any) => {
  const param = useParams()
  const { state } = useContext(GlobalContext);
  const { dispatch } = useContext(GlobalContext);
  const [locationValue, setLocationValue] = useState("");
  const [data, setdata] = useState([]);
  const [remove, setRemove] = useState(false)
  const [locationValues, setlocationValues] = useState([]);
  const [locationEmptyFlag, setLocationEmptyFlag] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState("OR");
  const { t } = useTranslation();
  function handleLocationSearchFn(inputValue): void {
    apiDashboard
      .get(`campaign-mgmt-api/locations?filter=${inputValue}&limit=20`, {
        value: inputValue,
      })
      .then(
        (res) => {
          setdata(res.data.data);
        },
        (error) => {
          setdata([]);
          setLocationEmptyFlag(true);
        }
      );
  }
  const debounceFn = useCallback(_.debounce(handleLocationSearchFn, 1000), []);

  useEffect(() => {
    const location =
      data.length > 0 &&
      data.map((item) => {
        return {
          id: item.id,
          name: item.location,
        };
      });
    setlocationValues(location);
  }, [data]);
  const updateRulesPayload = (payload: any): void => {
    dispatch({
      type: "MODIFY_RULES",
      payload: {
        rulesPayload: payload,
      },
    });
  };
  const removeRules = (payload: string): void => {
    dispatch({
      type: "REMOVE_RULES",
      payload: {
        rulesPayload: payload,
      },
    });
  };

  const handleChangeRulesLocationOperation = (e: any, index): void => {
    const modifiedPayload = Object.assign({}, state.rules);
    if (index === 0 && innerIndex === undefined && state.rules.locations.list?.length === 0) {
      modifiedPayload.locations.list.push({
        list: [],
        operation: e.target.checked ? "EXCLUDE" : "INCLUDE"
      })
      updateRulesPayload(modifiedPayload);
    } else {
      modifiedPayload.locations.list[index]["operation"] = e.target.checked
        ? "EXCLUDE"
        : "INCLUDE";
      updateRulesPayload(modifiedPayload);
    }
  };
  const searchLocation = (e) => {
    setLocationValue(e.target.value);
    debounceFn(e.target.value);
  };
  const updateOperatorSelection = (event: React.MouseEvent<HTMLElement>, selectedOperator: string | null) => {
    const modifiedPayload = Object.assign({}, state.rules);
    if (index === 0 && innerIndex === undefined && state.rules.locations.list?.length === 0) {
      modifiedPayload.locations.list.push({
        list: [],
        condition: selectedOperator === "OR" ? "ANY" : "ALL"
      })
      updateRulesPayload(modifiedPayload);
    }
    else {
      modifiedPayload.locations.list[index]["condition"] = (selectedOperator === "OR") ? "ANY" : "ALL";
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
        >
          <div className="auto-complete-field">
            <Autocomplete
              options={locationValues.length > 0 ? locationValues : []}
              getOptionLabel={(option: any) => option.name}
              closeIcon=""
              noOptionsText=''
              onChange={(e, newValue) => {
                handleChange(e);
                const modifiedPayload = Object.assign({}, state.rules);
                if (index === 0 && innerIndex === undefined && state.rules.locations.list?.length === 0) {
                  modifiedPayload["locations"]["list"].push({ list: [newValue] })
                  updateRulesPayload(modifiedPayload);
                }
                else {
                  modifiedPayload["locations"]["list"][index]["list"][innerIndex === undefined ? 0 : innerIndex] = newValue
                  updateRulesPayload(modifiedPayload);
                }
                setRemove(true);
                // searchLocation("")
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  classes={{ root: classes.customTextField }}
                  variant="outlined"
                  InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                  label={
                    <div className="label-tooltip">{t('AUDEINCE_VISITED_LOCATION')}
                      <LightTooltip title={<label>{t('TOOLTIP_RULE_SECTION_VISITED_LOCATION')}</label>}
                      /> </div>}
                  onChange={(e) => searchLocation(e)}
                  placeholder={t('AUDIENCE_LOCATION_PLACEHOLDER')}
                  name="locationValue"
                  value={locationValue}
                />
              )}
              style={{
                display: (param?.id && state?.rules?.locations?.list[index || 0]?.list[innerIndex || 0]
                  ?.name !== undefined) ? "none" : state?.rules?.locations?.list[index || 0]?.list[innerIndex || 0]
                    ?.name !== undefined ? "none" : remove && "none"
              }}
            />
            {data.length === 0 && locationEmptyFlag && (
              <p className="error" >{t('SEARCH_LIST_EMPTY_MESSAGE')}</p>
            )}
            {state?.rules?.locations?.list[index]?.list[innerIndex || 0]
              ?.name !== undefined &&
              (
                <Chip
                  variant="outlined"
                  color="primary"
                  label={
                    state.rules?.locations?.list[0 || index]?.list[
                      innerIndex || 0
                    ]?.name
                  }
                  onDelete={() => {
                    const modifiedPayload = Object.assign({}, state.rules);
                    const innerValue =
                      innerIndex === undefined ? 0 : innerIndex;
                    if (innerValue) {
                      modifiedPayload["locations"]["list"][index][
                        "list"
                      ].splice(innerValue, 1);
                      removeRules(modifiedPayload);
                    } else {
                      modifiedPayload["locations"]["list"][index][
                        "list"
                      ].splice(innerValue, 1);
                      removeRules(modifiedPayload);
                      setLocationValue("");
                    }
                    if (modifiedPayload["locations"]["list"][index]["list"].length === 0) {
                      modifiedPayload["locations"]["list"][index]["list"][0] = []
                      setRemove(false)

                      if (modifiedPayload["locations"]["list"].length === 1) {
                        setRemove(false)
                      }
                      removeRules(modifiedPayload);
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
                  className={`${values.locations?.list[index]?.operation === "INCLUDE"
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
                        checked={values.locations?.list[index]?.operation === "EXCLUDE"}
                        onChange={(e) => { handleChangeRulesLocationOperation(e, index) }}
                      />}
                      label=""
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  className={`${values.locations?.list[index]?.operation === "EXCLUDE"
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
                <ToggleButton disabled={values.locations?.list[index]?.condition === "ALL" ? true : false} value="AND" aria-label="AND Operator" className={values.locations?.list[index]?.condition === "ALL" ? 'active' : ''} >
                  {t('SETTINGS_AUDIENCE_SECTION_BUTTON_AND')}
                </ToggleButton>
                <ToggleButton disabled={values.locations?.list[index]?.condition === "ANY" ? true : false} value="OR" aria-label="OR Operator" className={`${values.locations?.list[index]?.condition === "ANY" ? 'active' : values.locations?.list[index]?.condition === "ALL" ? '' : 'active'}`}>
                  {t('SETTINGS_AUDIENCE_SECTION_BUTTON_OR')}
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="contained"
                color="primary"
                className="button-add"
                onClick={() => {
                  const modifiedPayload = Object.assign({}, state.rules);
                  modifiedPayload["locations"]?.list[index]["list"].push({});
                  updateRulesPayload(modifiedPayload);
                }}
              >
                +
              </Button>
            </div>

          </div>

          <div className="delete-aud-row"
            onClick={() => {
              const modifiedPayload = Object.assign({}, state.rules);
              const innerValue = innerIndex === undefined ? 0 : innerIndex;
              if (innerValue) {
                modifiedPayload["locations"]["list"][index][
                  "list"
                ].splice(innerValue, 1);
                removeRules(modifiedPayload);
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

export default LocationsRules;