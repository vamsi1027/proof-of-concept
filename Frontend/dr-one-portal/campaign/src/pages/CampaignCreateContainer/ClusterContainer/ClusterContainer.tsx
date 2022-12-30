import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  Chip,
  Avatar
} from "@material-ui/core";
import { Form, Formik, FieldArray } from "formik";
import ClusterElement from "./ClusterElement/ClusterElement";
import { GlobalContext } from "../../../context/globalState";
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";
import { useTranslation } from 'react-i18next';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useHistory } from "react-router-dom";

const ClusterContainer = () => {
  const { state } = useContext(GlobalContext);
  const { dispatch } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [selectedOperator, setSelectedOperator] = useState("AND");
  let history = useHistory();
  const [clusterArray, setClusterArray] = useState(
    state.formValues.settings.clusterArray
  );
  const updateSettingsSectionPayload = (
    payload: any,
    section: string
  ): void => {
    let isClusterSectionValid;
    let clusterFilterArray = [];
    payload.settings.clusterArray.list.forEach(groupElem => {
      groupElem.list.length !== 0 && groupElem.list.forEach(ele => {
        if (ele.id === '') {
          clusterFilterArray.push(ele);
        }
      })
    })
    if (clusterFilterArray.length === 0) {
      isClusterSectionValid = true;
    } else {
      isClusterSectionValid = false;
    }
    payload['settings']['isSettingSectionValid']['isClusterSectionValid'] = isClusterSectionValid;
    payload['settings']['isCallReachCountApi'] = false;
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

  const removeCluster = (payload: string, setting: string): void => {
    dispatch({
      type: CAMPAIGN_ACTIONS.REMOVE_CAMPAIGN_CLUSTER,
      payload: {
        campaignPayload: payload,
        currentPageName: 'settings',
        campaignBreadCrumbList: state.campaignBreadCrumbList
      },
    });
  };

  const updateOperatorSelection = (event: React.MouseEvent<HTMLElement>, selectedOperator: string | null) => {

    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload["settings"]["clusterArray"]["condition"] = (selectedOperator === "OR") ? "ANY" : "ALL";

    setSelectedOperator(selectedOperator);
    updateSettingsSectionPayload(modifiedPayload, "settings");
  }

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <Avatar aria-label="recipe">
            {" "}
            <img src={"/img/audience-icon.svg"} alt="avatar" />
          </Avatar>
        }
        title={t('SETTINGS_AUDIENCE_SECTION_HEADER')}
        subheader={t('SETTINGS_AUDIENCE_SECTION_SUBHEADER')}
      />
      <CardContent>
        <Formik
          initialValues={clusterArray}
          onSubmit={(values: any) => {
          }}
          render={({ values, handleChange }) => (
            <Form>
              <FieldArray
                name="lists"
                render={(arrayHelpers) => (
                  <div>
                    <React.Fragment>
                      {values.list.map((mylistItem, index) => (
                        <div key={index} className="group-box">
                          {index > 0 && (
                            <div className="seperator-wrap-and">
                              <div className={`${selectedOperator === "AND" ? "child-button-and" : "child-button-or"} and-box`}>
                                { /* <h5 className="seperator-text active">AND </h5> */}
                                { /* <h5 className="seperator-text">OR </h5> */}
                                <ToggleButtonGroup
                                  value={selectedOperator}
                                  exclusive
                                  onChange={updateOperatorSelection}
                                  aria-label="Logic Operator"
                                >
                                  <ToggleButton value="AND" className={`${selectedOperator === "AND" ? "active" : ""} seperator-text`} aria-label="AND Operator"
                                    disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}>
                                    {t("SETTINGS_AUDIENCE_SECTION_BUTTON_AND")}
                                  </ToggleButton>
                                  <ToggleButton value="OR" className={`${selectedOperator === "OR" ? "active" : ""} seperator-text`} aria-label="OR Operator"
                                    disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)} >
                                    {t("SETTINGS_AUDIENCE_SECTION_BUTTON_OR")}
                                  </ToggleButton>
                                </ToggleButtonGroup>
                              </div>
                            </div>
                          )}

                          <Form key={index} className="audience-row">
                            <Chip
                              className="group-label"
                              label={`${t('SETTINGS_AUDIENCE_CLUSTER_GROUP_HEADING')} ${index + 1}`}
                              disabled={(state.formValues.settings.clusterArray.list.length === 1) ||
                                (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                              onDelete={() => {
                                const modifiedPayload = Object.assign(
                                  {},
                                  state.formValues
                                );
                                modifiedPayload["settings"][
                                  "clusterArray"
                                ]["list"].splice(index, 1);
                                removeCluster(
                                  modifiedPayload,
                                  "settings"
                                );
                              }}
                            />
                            {
                              <ClusterElement
                                values={values}
                                index={index}
                                handleChange={handleChange}
                              />
                            }
                            {mylistItem.list.map(
                              (item, innerIndex) =>
                                innerIndex > 0 && (
                                  <div
                                    className="seperator-wrap"
                                    key={innerIndex}
                                  >
                                    {innerIndex && (
                                      <h5 className="seperator-text">{
                                        (state.formValues.settings.clusterArray.list[index]['condition'] === "ANY")
                                          ? t("SETTINGS_AUDIENCE_SECTION_BUTTON_OR")
                                          : t("SETTINGS_AUDIENCE_SECTION_BUTTON_AND")
                                      }</h5>
                                    )}
                                    <ClusterElement
                                      innerList={mylistItem.list}
                                      values={values}
                                      innerIndex={innerIndex}
                                      index={index}
                                      handleChange={handleChange}
                                    />
                                  </div>
                                )
                            )}
                          </Form>
                        </div>
                      ))}
                    </React.Fragment>
                    <div className="bottom-btn-wrap">
                      <Grid item>
                        <div className="row">
                          <div className="add-bottom-btn-wrap">
                            <Button
                              className="add_btn"
                              variant="contained"
                              color="primary"
                              disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                              onClick={() => {
                                const modifiedPayload = Object.assign(
                                  {},
                                  state.formValues
                                );
                                modifiedPayload["settings"]["clusterArray"][
                                  "list"
                                ].push({
                                  operation: "INCLUDE",
                                  condition: "ANY",
                                  list: [
                                    {
                                      name: "",
                                      id: "",
                                    },
                                  ],
                                });
                                updateSettingsSectionPayload(
                                  modifiedPayload,
                                  "settings"
                                );
                              }}
                            >
                              +
                            </Button>
                          </div>
                          <a href={`${window.location.origin}/audience/new`} target="_blank"
                            className={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus) ? "disabled-function create-audiance-btn" : "create-audiance-btn"}> <span>+</span> {t('SETTINGS_AUDIENCE_SECTION_BUTTON_CREATE_AUDIENCE')} </a>
                        </div>
                        {/* <Button
                          variant="outlined"
                          color="primary"
                          className="create-audiance-btn"
                          onClick={redirectToCreateAudienceCluster}
                        >
                          <AddIcon /> {t('SETTINGS_AUDIENCE_SECTION_BUTTON_CREATE_AUDIENCE')}
                        </Button> */}
                      </Grid>
                    </div>
                  </div>
                )}
              />
            </Form>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ClusterContainer;
