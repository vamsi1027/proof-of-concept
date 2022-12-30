import React, { useEffect, useState, useContext } from "react";
import Autoselect from "./Autoselect";
import { apiDashboard, helper } from "@dr-one/utils";
import { FormControlLabel, Switch } from "@material-ui/core";
import { GlobalContext } from "../../../context/globalState";
import { Form, Formik, FieldArray } from "formik";
import LocationWrapper from "./LocationWrapper";
import InstallApp from "./InstallApp";
import MakerWrapper from "./MakerWrapper";
import { useTranslation } from 'react-i18next';
import { LightTooltip } from "@dr-one/shared-component";
import CustomAttribute from './CustomAttribute'
import { useParams } from "react-router-dom";
const Rules = ({ validRule }) => {
  const [device, setDevice] = useState([]);
  const [wirelessoperators, setWirelessoperators] = useState([]);
  const [osversions, setOsversions] = useState([]);
  const [sourcepackages, setSourcepackages] = useState([]);
  const [customAttribute, setCustomAttribute] = useState([])
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const [rulesArray, setrulesArray] = useState(state.rules);
  const { t } = useTranslation();
  const [rulesToggle, setRulesToggle] = useState(state.rules?.rulesToggle)
  const organazationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive
  const { id } = useParams()
  useEffect(() => {
    apiDashboard.get(`campaign-mgmt-api/devicetier`).then(
      (res) => {
        setDevice(res.data.data);
      },
      (error) => {
        setDevice([]);
      }
    );
    apiDashboard.get(`campaign-mgmt-api/wirelessoperators`).then(
      (res) => {
        setWirelessoperators(res.data.data);
      },
      (error) => {
        setWirelessoperators([]);
      }
    );
    apiDashboard.get(`campaign-mgmt-api/osversions`).then(
      (res) => {
        setOsversions(res.data.data);
      },
      (error) => {
        setOsversions([]);
      }
    );
    apiDashboard.get(`campaign-mgmt-api/sourcepackages`).then(
      (res) => {
        setSourcepackages(res.data.data);
      },
      (error) => {
        setSourcepackages([]);
      }
    );
    apiDashboard.get(`campaign-mgmt-api/clientattributes/${organazationId}`).then(
      (res) => {
        setCustomAttribute(res.data.data);
      },
      (error) => {
        setCustomAttribute([]);
      }
    );
  }, []);
  const updateRulesPayload = (payload: any): void => {
    dispatch({
      type: "MODIFY_RULES",
      payload: {
        rulesPayload: payload,
      },
    });
  };
  const handleChangeOperation = (parentKey: string, e: any, index: number): void => {
    const modifiedPayload = Object.assign({}, state.rules);
    if (modifiedPayload[parentKey].list?.length === 0) {
      modifiedPayload[parentKey].list.push({
        list: [],
        operation: e.target.checked
          ? "EXCLUDE"
          : "INCLUDE",
        condition: 'ANY'
      })
    } else {
      modifiedPayload[parentKey].list[index]["operation"] = e.target.checked
        ? "EXCLUDE"
        : "INCLUDE";
    }
    updateRulesPayload(modifiedPayload);
  };
  const handleDeviceDropdown = (value: Object, parentKey: string, operation: string, values: Object): void => {
    const modifiedPayload = Object.assign({}, state.rules);
    const check = state.rules[parentKey]?.list?.findIndex((item) => item?.id === value[0]?.id)
    if (check === -1 || 0) {
      modifiedPayload[parentKey].list.push({
        operation: operation ? "EXCLUDE" : "INCLUDE",
        condition: "ANY",
        list: value,
        id: value[0]?.id
      });
    }
    updateRulesPayload(modifiedPayload);
  };
  return (
    <div>
      <div className="cr-top-wrapper">
        <div className="toggle_rules">
          <h5 className="label-tooltip title-padding small-tooltip">{t('TARGET_RULES_BASE_CLUSTER')}
            <LightTooltip title={<label>{t('TOOLTIP_FOR_RULE_BASE_CLUSTER_HEADER')}</label>}
            /> </h5>
          <div className="switchery org-switchery">
            <FormControlLabel
              value={state.rules?.rulesToggle}
              control={<Switch
                checked={state.rules?.rulesToggle}
                onChange={(e) => {
                  setRulesToggle(e.target.checked)
                  const modifiedPayload = Object.assign({}, state.rules);
                  modifiedPayload['rulesToggle'] = e.target.checked;
                  dispatch({
                    type: "MODIFY_RULES",
                    payload: {
                      rulesPayload: modifiedPayload,
                    },
                  });
                }}
                name="rulesToggle" />}
              label={t('REACH_ENTIRE_AUDIENCE')}
            />
          </div>
        </div>
        <hr></hr>
        {!state.rules?.rulesToggle && <div className="cr-body-content audience-section">
          <LocationWrapper />
          <InstallApp />
          <Formik
            initialValues={rulesArray}
            onSubmit={(values: any) => { }}
            render={({ values, handleChange }) => (
              <Form className="">
                <FieldArray
                  name="autoselect"
                  render={(arrayHelpers) => (
                    <React.Fragment>
                      {[values].map((devices, index) => (
                        <div key={index}>
                          <MakerWrapper />
                          <Autoselect
                            dropDownOption={device}
                            label={t('DEVICE_TIER')}
                            placeholder={t('CHOOSE_DEVICE_TIER')}
                            handleDeviceDropdown={handleDeviceDropdown}
                            handleChangeOperation={handleChangeOperation}
                            index={index}
                            showInSide={state.rules.deviceTier}
                            parentKey="deviceTier"
                            tooltipLabel={t('TOOLTIP_RULE_SECTION_DEVICE_TIER')}
                          />

                          <Autoselect
                            dropDownOption={wirelessoperators}
                            label={t('WIRELESS_OPERATORS')}
                            placeholder={t('CHOOSE_WIRELESS_OPERATORS')}
                            handleDeviceDropdown={handleDeviceDropdown}
                            handleChangeOperation={handleChangeOperation}
                            index={index}
                            showInSide={state.rules.wirelessOperators}
                            parentKey="wirelessOperators"
                            tooltipLabel={t('TOOLTIP_RULE_SECTION_WIRELESS_OPERATOR')}
                          />

                          <Autoselect
                            dropDownOption={osversions}
                            label={t('OPERATING_SYSTEM')}
                            placeholder={t('CHOOSE_OPERATING_SYSTEM')}
                            handleDeviceDropdown={handleDeviceDropdown}
                            handleChangeOperation={handleChangeOperation}
                            index={index}
                            showInSide={state.rules.osVersions}
                            parentKey="osVersions"
                            tooltipLabel={t('TOOLTIP_RULE_SECTION_OPERATING_SYSTEM')}
                          />

                          <Autoselect
                            dropDownOption={sourcepackages}
                            label={t('SOURCE_PACKAGE')}
                            placeholder={t('CHOOSE_SOURCE_PACKAGE')}
                            handleDeviceDropdown={handleDeviceDropdown}
                            handleChangeOperation={handleChangeOperation}
                            index={index}
                            showInSide={state.rules.sourcePackages}
                            parentKey="sourcePackages"
                            tooltipLabel={t('TOOLTIP_RULE_SECTION_SOURCE_PACKAGE')}
                          />
                          {customAttribute?.length > 0 && <CustomAttribute customAttribute={customAttribute} />}
                        </div>
                      ))}
                    </React.Fragment>
                  )}
                />
              </Form>
            )}
          />
        </div>}
      </div>
    </div>
  );
};
export default Rules;
