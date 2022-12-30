import { Grid, TextField, FormGroup, Switch } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useContext, useState, useCallback, useEffect } from "react";
import { GlobalContext } from "../../../context/globalState";
import { Chip, FormControlLabel } from "@material-ui/core";
import { apiDashboard } from "@dr-one/utils";
import _ from "lodash";
import { useTranslation } from 'react-i18next';
import HelpIcon from '@material-ui/icons/Help';
import { LightTooltip } from "@dr-one/shared-component";
const MakerWrapper = () => {
  const [makerAppValue, setmakerAppValue] = useState("");
  const [data, setdata] = useState([]);
  const { state, dispatch } = useContext(GlobalContext);
  // const { state } = useContext(GlobalContext);
  const [operation, setOperation] = useState(false);
  const { makers } = state.rules;
  const [makerValues, setmakerValues] = useState([]);
  const [makerEmptyListFlag, seMakerEmptyListFlag] = useState(false);
  const { t } = useTranslation();

  function handlemakerSearchFn(inputValue): void {
    apiDashboard
      .get(
        `campaign-mgmt-api/makers/?filter=${inputValue}&sort=weight&limit=20`,
        {
          value: inputValue,
        }
      )
      .then(
        (res) => {
          setdata(res.data.data);
        },
        (error) => {
          seMakerEmptyListFlag(true);
        }
      );
  }

  const debounceFn = useCallback(_.debounce(handlemakerSearchFn, 1000), []);

  useEffect(() => {
    const maker = data.length > 0 && data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        count: item.count,
        scope: item.scope,
      };
    });
    setmakerValues(maker);
  }, [data]);

  const updateRulesPayload = (payload: any): void => {
    dispatch({
      type: "MODIFY_RULES",
      payload: {
        rulesPayload: payload,
      },
    });
  };
  const removemaker = (payload: string): void => {
    dispatch({
      type: "REMOVE_RULES",
      payload: {
        rulesPayload: payload,
      },
    });
  };
  const [makerList, setMakerList] = useState(state.rules.makers?.list)
  const handlemakersOperation = (e: any): void => {
    const modifiedPayload = Object.assign({}, state.rules);
    if (state.rules.makers.list?.length === 0) {
      modifiedPayload.makers.list.push({
        list: [],
        operation: e.target.checked
          ? "EXCLUDE"
          : "INCLUDE",
        condition: 'ANY'
      })
      updateRulesPayload(modifiedPayload);
    } else {
      modifiedPayload.makers.list[0]["operation"] = e.target.checked
        ? "EXCLUDE"
        : "INCLUDE";
      updateRulesPayload(modifiedPayload);
    }
  };
  const handlemakerDropdown = (value: any): void => {
    setmakerAppValue("")
    const modifiedPayload = Object.assign({}, state.rules.makers);
    const newMakerValue = value.map((item, id) => {
      return {
        id: item.id,
        name: item.name,
        count: item.count,
        scope: item.scope,
      };
    });
    const check = state.rules.makers?.list?.findIndex((item) => item?.id === newMakerValue[0]?.id)
    if (check === -1 || 0) {
      modifiedPayload.list?.push({
        id: newMakerValue[0]?.id, operation: operation ? "EXCLUDE" : "INCLUDE",
        condition: "ANY", list: newMakerValue,
      });
    }
    dispatch({
      type: "MODIFY_RULES_PAYLOAD",
      makerPayload: modifiedPayload
    });
    setmakerValues([])
  };
  const searchMakerApp = (e) => {
    // setmakerAppValue(e.target.value);
    debounceFn(e.target.value);
  };
  return (
    <div className="rules-row">
      <div className="rules-top">
        <p className="rules-name">
          <p>{state.rules.makers?.list?.length === 0 && <Chip label="All Device" />}</p>
          {makers?.list?.map((list, i) => {
            return (
              <div key={i} style={{ display: "flex" }}>
                <p>{list.operation?.length > 0 ? list.operation : "All Device"}</p>
                {list.list[0]?.name.length > 0 ? <Chip
                  label={
                    list.list[0]?.name === undefined
                      ? "All Device"
                      : `${list.list[0]?.name}${list.list[0]?.scope === "make" ? "*" : ""
                      }${" "}${list.list[0]?.count ? list.list[0]?.count : ''}`
                  }
                  onDelete={(): void => {
                    const modifiedPayload = Object.assign({}, state.rules);
                    // if (i) {
                    modifiedPayload["makers"]["list"].splice(i, 1);
                    removemaker(modifiedPayload);
                    // } else {
                    //   modifiedPayload["makers"]["list"][0]["list"].splice(0);
                    //   removemaker(modifiedPayload);
                    // }
                  }}
                /> : <Chip label="All Device" />}
              </div>
            );
          })}
        </p>

        <div className="switch-wrapper">
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item className={`${operation ? "switch-label " : "switch-label select"}`} >
              {t('SETTINGS_AUDIENCE_SECTION_SWITCH_INCLUDE')}
            </Grid>
            <Grid item>
              <div className="switchery">
                <FormControlLabel
                  control={<Switch
                    checked={operation}
                    onChange={(e) => {
                      handlemakersOperation(e);
                      setOperation(e.target.checked);
                    }}
                  />}
                  label=""
                />
              </div>
            </Grid>
            <Grid item className={`${operation ? "switch-label select" : "switch-label "}`}>
              {t('SETTINGS_AUDIENCE_SECTION_SWITCH_EXCLUDE')}
            </Grid>
          </Grid>
        </div>
      </div>

      <div className="rules-select">
        <Autocomplete
          id="list"
          noOptionsText=''
          disableClearable
          options={makerValues.length > 0 ? makerValues : []}
          getOptionLabel={(option: any) => option.name || ''}
          onChange={(e, newValue): void => {
            const dropdown = [newValue].map((item, innerindex) => {
              return {
                id: item.id,
                name: item.name,
                count: item.count,
                scope: item.scope,
              };
            });
            handlemakerDropdown(dropdown);
          }}
          value={makerAppValue}
          // renderOption={(option) => <>{option.name}</>}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t('SELECT_MANUFACTURE_AND_MODEL')}
              variant="outlined"
              InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
              label={
                <div className="label-tooltip">{t('DEVICE_MANUFACTURE_AND_MODEL')}
                  <LightTooltip title={<label>{t('TOOLTIP_RULE_SECTION_DEVICE_MANUFACTURE')}</label>}
                  /></div>
              }
              onKeyDown={(e) => {
                searchMakerApp(e)
                setmakerAppValue(e.currentTarget.nodeValue)
              }}
              name="makerAppValue"
              value={makerAppValue}
            />
          )}
        />
        {data.length === 0 && makerEmptyListFlag && (
          <p className="error" >{t('SEARCH_LIST_EMPTY_MESSAGE')}</p>
        )}
      </div>
    </div>
  );
};
export default MakerWrapper;
