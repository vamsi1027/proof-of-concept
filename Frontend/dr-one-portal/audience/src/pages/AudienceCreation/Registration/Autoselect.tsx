import { Grid, TextField, Switch, Chip, FormControlLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useContext, useState } from "react";
import { GlobalContext } from "../../../context/globalState";
import { useTranslation } from 'react-i18next';
import { LightTooltip } from "@dr-one/shared-component";
export default function Autoselect({
  dropDownOption,
  label,
  handleDeviceDropdown,
  handleChangeOperation,
  index,
  showInSide,
  parentKey,
  placeholder, tooltipLabel
}) {
  const { state, dispatch } = useContext(GlobalContext);
  const [operation, setOperation] = useState(false);
  const [value, setValue] = React.useState([]);
  const { t } = useTranslation();
  const removeSelected = (payload: string): void => {
    dispatch({
      type: "REMOVE_RULES",
      payload: {
        rulesPayload: payload,
      },
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
  React.useEffect(() => {
    if (dropDownOption?.length > 0) {
      const modifiedPayload = Object.assign({}, state.rules);
      modifiedPayload['loadIntialPage'] = dropDownOption?.length > 0 ? true : false
      updateRulesPayload(modifiedPayload);
    }
  }, [dropDownOption?.length > 0])
  return (
    <div className="rules-row">
      <div className="rules-top">
        <p className="rules-name">
          <p>{showInSide?.list?.length === 0 && <Chip label="All Device" />}</p>
          {showInSide?.list?.map((list, i) => {
            return (
              <div key={i} style={{ display: "flex" }}>
                <p>{list?.operation}</p>
                {list.list[0]?.name.length > 0 ?
                  <Chip
                    label={list.list[0]?.name?.length > 0 ? list.list[0]?.name : `${t('ALL_DEVICE')}`}
                    // disabled={state.rules[parentKey]["list"].length === 1}
                    onDelete={() => {
                      const modifiedPayload = Object.assign({}, state.rules);
                      modifiedPayload[parentKey]["list"].splice(i, 1);
                      removeSelected(modifiedPayload);
                    }}
                  /> : <Chip label="All Device" />}
              </div>
            );
          })}
        </p>
        <div className="switch-wrapper">
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid
              item
              className={state.rules[parentKey]?.list?.[index]?.operation === 'INCLUDE' || undefined ? "switch-label select" : "switch-label"}
              style={{ fontWeight: state.rules[parentKey]?.list?.[index]?.operation === 'INCLUDE' ? 'bolder' : 'initial' }}
            >
              {t('SETTINGS_AUDIENCE_SECTION_SWITCH_INCLUDE')}
            </Grid>
            <Grid item>

              <div className="switchery">
                <FormControlLabel
                  control={<Switch
                    checked={operation}
                    onChange={(e) => {
                      handleChangeOperation(parentKey, e, index);
                      setOperation(e.target.checked);
                    }}
                  />}
                  label=""
                />
              </div>
            </Grid>
            <Grid
              item
              className={state.rules[parentKey]?.list?.[index]?.operation === 'EXCLUDE' ? "switch-label select" : "switch-label "}
              style={{ fontWeight: state.rules[parentKey]?.list?.[index]?.operation === 'EXCLUDE' ? 'bolder' : 'initial' }}
            >
              {t('SETTINGS_AUDIENCE_SECTION_SWITCH_EXCLUDE')}
            </Grid>
          </Grid>
        </div>
      </div>

      <div className="rules-select">
        <Autocomplete
          id="list"
          clearText=""
          disableClearable
          options={dropDownOption.length > 0 ? dropDownOption : []}
          getOptionLabel={(option: any) => option.name}
          onChange={(e, newValue) => {
            const dropdown = [newValue].map((item, innerindex) => {
              return {
                id: item.id,
                name: item.name,
              };
            });
            handleDeviceDropdown(dropdown, parentKey, operation, value);
            setValue(dropdown);
          }}
          renderOption={(option) => <p>{option.name}</p>}
          inputValue=''
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
              label={
                <div className="label-tooltip">{label}
                  <LightTooltip title={<label>{tooltipLabel}</label>} /></div>}
              placeholder={placeholder}
              variant="outlined"
            />
          )}
        />
      </div>
    </div>
  );
}
