import React, { useContext } from "react";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { Switch, Grid, TextField, Button, Chip, FormControlLabel, FormControl, InputLabel, Select, MenuItem, ListSubheader } from "@material-ui/core";
import { GlobalContext } from "../../../context/globalState";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { LightTooltip } from "@dr-one/shared-component";

const CustomAttributeRule = ({ values, index, handleChange, innerIndex, attribute }: any) => {
    const param = useParams()
    const { state } = useContext(GlobalContext);
    const { dispatch } = useContext(GlobalContext);
    const [remove, setremove] = useState(false);
    const [customAttribute, setCustomAttribute] = React.useState('')
    const [attributeValue, setAttributeValue] = React.useState('')
    const [selectedOperator, setSelectedOperator] = useState("OR");
    const { t } = useTranslation();
    const updateRulesPayload = (payload: any): void => {
        dispatch({
            type: "MODIFY_RULES",
            payload: {
                rulesPayload: payload,
            },
        });
    };
    const removeRulesCustomAttribute = (payload: string): void => {
        dispatch({
            type: "REMOVE_RULES",
            payload: {
                rulesPayload: payload,
            },
        });
    };
    const handleCustomAttributeOperation = (e: any, index): void => {
        const modifiedPayload = Object.assign({}, state.rules);
        if (index === 0 && innerIndex === undefined && state.rules.customAttribute.list?.length === 0) {
            modifiedPayload.customAttribute.list.push({
                list: [],
                operation: e.target.checked ? "EXCLUDE" : "INCLUDE"
            })
            updateRulesPayload(modifiedPayload);
        } else {
            modifiedPayload.customAttribute.list[index]["operation"] = e.target.checked
                ? "EXCLUDE"
                : "INCLUDE";
            updateRulesPayload(modifiedPayload);
        }
    };
    const updateOperatorSelection = (event: React.MouseEvent<HTMLElement>, selectedOperator: string | null) => {
        const modifiedPayload = Object.assign({}, state.rules);
        if (index === 0 && innerIndex === undefined && state.rules.customAttribute.list?.length === 0) {
            modifiedPayload.customAttribute.list.push({
                list: [],
                condition: selectedOperator === "OR" ? "ANY" : "ALL"
            })
            updateRulesPayload(modifiedPayload);
        }
        else {
            modifiedPayload.customAttribute.list[index]["condition"] = (selectedOperator === "OR") ? "ANY" : "ALL";
        }
        setSelectedOperator(selectedOperator);
        updateRulesPayload(modifiedPayload);
    }
    const handleChangeSelect = (key, value) => {
        setremove(true);
        const attributeItem = {
            key: key,
            value: value
        }
        const modifiedPayload = Object.assign({}, state.rules);
        if (index === 0 && innerIndex === undefined && state.rules?.customAttribute?.list?.length === 0) {
            modifiedPayload["customAttribute"]["list"].push({ list: [attributeItem] })
            updateRulesPayload(modifiedPayload);
        }
        else {
            modifiedPayload["customAttribute"]["list"][index]["list"][innerIndex === undefined ? 0 : innerIndex] = attributeItem
            updateRulesPayload(modifiedPayload);
        }
    };
    const addCustomAttributeOnEnter = (e): void => {
        if (e.key === "Enter") {
            handleChangeSelect(customAttribute, attributeValue);
        }
    }
    return (
        <div>
            <React.Fragment>
                <Grid container>
                    <div className="auto-complete-fields">
                        <FormControl className="form-select-box"
                            style={{
                                display: (param?.id && state?.rules?.customAttribute?.list[index || 0]?.list[innerIndex || 0]
                                    ?.key !== undefined) ? "none" : state?.rules?.customAttribute?.list[index || 0]?.list[innerIndex || 0]
                                        ?.key !== undefined ? "none" : remove && "none"
                            }}
                        >
                            <InputLabel variant="filled" style={{ pointerEvents: "auto" }} htmlFor="grouped-select">
                                <div className="label-tooltip">{`${t('CUSTOM_ATTRIBUTE')}`}
                                    <LightTooltip
                                        title={<label>{t('TOOLTIP_FOR_CUSTOM_ATTRIBUTE')}</label>}
                                    />
                                </div>
                            </InputLabel>
                            <Select fullWidth style={{ pointerEvents: "auto" }} value={customAttribute || ''}
                                onChange={(event: any) => {
                                    setCustomAttribute(event.target.value);
                                }}
                                displayEmpty
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
                                renderValue={customAttribute !== "" ? undefined : () => <p style={{ fontSize: '14px', color: '#ccc' }} >{t('CHOOSE_CUSTOM_ATTRIBUTE')}</p>}
                                id="grouped-select"

                            >{attribute.map((item, i) => {
                                return (
                                    <MenuItem key={i} value={item}>{item}</MenuItem>
                                )
                            })}
                            </Select>
                        </FormControl>
                        <TextField id="outlined-basic"
                            label={`${t('ATTRIBUTE_VALUE')}`}
                            placeholder={`${t('ENTER_ATTRIBUTE_VALUE')}`}
                            name="attributeValue"
                            InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                            value={attributeValue}
                            onKeyPress={addCustomAttributeOnEnter}
                            onChange={(e) => {
                                setAttributeValue(e.target.value)
                            }}
                            variant="outlined"
                            style={{
                                display: (param?.id && state?.rules?.customAttribute?.list[index || 0]?.list[innerIndex || 0]
                                    ?.key !== undefined) ? "none" : state?.rules?.customAttribute?.list[index || 0]?.list[innerIndex || 0]
                                        ?.key !== undefined ? "none" : remove && "none"
                            }}
                        />
                        <Button onClick={() => { handleChangeSelect(customAttribute, attributeValue) }}
                            variant="contained" color="primary" size="small"
                            className="btn-small"
                            disabled={(customAttribute.length > 0 && attributeValue.length > 0 && attributeValue.trim()) ? false : true}
                            style={{
                                display: (param?.id && state?.rules?.customAttribute?.list[index || 0]?.list[innerIndex || 0]
                                    ?.key !== undefined) ? "none" : state?.rules?.customAttribute?.list[index || 0]?.list[innerIndex || 0]
                                        ?.key !== undefined ? "none" : remove && "none"
                            }}
                        > {t("ADD")}</Button></div>
                    {/* {data.length === 0 && customAttribute && (
                            <p className="error">{t('SEARCH_LIST_EMPTY_MESSAGE')}</p>
                        )} */}
                    {state?.rules?.customAttribute?.list[index || 0]?.list[
                        innerIndex || 0]?.key !== undefined && <div className="auto-complete-field" >
                            {state?.rules?.customAttribute?.list[index || 0]?.list[
                                innerIndex || 0]?.key !== undefined && (
                                    <Chip variant="outlined"
                                        color="primary"
                                        label={`${state.rules?.customAttribute?.list[0 || index]?.list[innerIndex || 0]?.key},${state.rules?.customAttribute?.list[0 || index]?.list[innerIndex || 0]?.value}`}
                                        onDelete={(): void => {
                                            const modifiedPayload = Object.assign({}, state.rules);
                                            const innerValue = innerIndex === undefined ? 0 : innerIndex;
                                            modifiedPayload["customAttribute"]["list"][index]["list"].splice(innerValue, 1);
                                            removeRulesCustomAttribute(modifiedPayload);
                                            setremove(false);
                                        }}
                                    />
                                )}
                        </div>}
                    <div className="audience-action">
                        <div className="switch-wrapper">
                            <Grid component="label" container alignItems="center" spacing={1}>
                                <Grid
                                    item
                                    className={`${values?.customAttribute?.list[index]?.operation === "INCLUDE"
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
                                                    values.customAttribute?.list[index]?.operation === "EXCLUDE"
                                                }
                                                onChange={(e) => { handleCustomAttributeOperation(e, index) }}
                                            />}
                                            label=""
                                        />
                                    </div>
                                </Grid>
                                <Grid
                                    item
                                    className={`${values.customAttribute?.list[index]?.operation === "EXCLUDE"
                                        ? "switch-label select"
                                        : "switch-label"
                                        }`}
                                >{t('SETTINGS_AUDIENCE_SECTION_SWITCH_EXCLUDE')}</Grid>
                            </Grid>
                        </div>
                        <div className="orbtn-wrap">
                            <ToggleButtonGroup value={selectedOperator} exclusive onChange={updateOperatorSelection} aria-label="Logic Operator" >
                                <ToggleButton disabled={values.customAttribute?.list[index]?.condition === "ALL" ? true : false}
                                    value="AND" aria-label="AND Operator"
                                    className={values.customAttribute.list[index]?.condition === "ALL" ? 'active' : ''}>
                                    {t("AND")}
                                </ToggleButton>
                                <ToggleButton disabled={values.customAttribute?.list[index]?.condition === "ANY" ? true : false}
                                    value="OR" aria-label="OR Operator"
                                    className={`${values.customAttribute?.list[index]?.condition === "ANY" ? 'active' : values.customAttribute?.list[index]?.condition === "ALL" ? '' : 'active'}`}>
                                    {t("OR")}
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <Button variant="contained" color="primary" className="button-add"
                                onClick={() => {
                                    const modifiedPayload = Object.assign({}, state.rules);
                                    modifiedPayload["customAttribute"]?.list[index]["list"].push({});
                                    updateRulesPayload(modifiedPayload);
                                }}
                            >{t('PLUS_BUTTON')}</Button>
                        </div>
                    </div>
                    <div className="delete-aud-row"
                        onClick={(): void => {
                            const modifiedPayload = Object.assign({}, state.rules);
                            const innerValue = innerIndex === undefined ? 0 : innerIndex;
                            modifiedPayload["customAttribute"]["list"][index]["list"].splice(innerValue, 1);
                            removeRulesCustomAttribute(modifiedPayload);
                        }}
                    >
                        <DeleteTwoToneIcon />
                    </div>
                </Grid>
            </React.Fragment>
        </div>
    );
};

export default CustomAttributeRule;