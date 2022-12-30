import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
} from "@material-ui/core";
import { Form, Formik, FieldArray } from "formik";
import LocationsRules from "./LocationsRules";
import { GlobalContext } from "../../../context/globalState";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useTranslation } from 'react-i18next';

const LocationsWrapper = () => {
  const { state } = useContext(GlobalContext);
  const { dispatch } = useContext(GlobalContext);
  const [selectedOperator, setSelectedOperator] = useState("OR");
  const { t } = useTranslation();
  const updateSettingsSectionPayload = (payload: any): void => {
    dispatch({
      type: "MODIFY_RULES",
      payload: {
        rulesPayload: payload,
      },
    });
  };
  const removeCluster = (payload: string): void => {
    dispatch({
      type: "REMOVE_RULES",
      payload: {
        rulesPayload: payload,
      },
    });
  };
  React.useEffect(() => {
    setSelectedOperator(state.rules?.locations?.condition === 'ANY' ? 'OR' : 'AND')
  }, [state.rules?.locations?.condition])
  const updateOperatorSelection = (event: React.MouseEvent<HTMLElement>, selectedOperator: string | null) => {
    const modifiedPayload = Object.assign({}, state.rules);
    modifiedPayload["locations"]["condition"] = (selectedOperator === "OR") ? "ANY" : "ALL";
    setSelectedOperator(selectedOperator);
    updateSettingsSectionPayload(modifiedPayload);
  }

  return (
    <Grid container>
      <div className="row">
        <Grid item md={12} xs={12}>
          <Card variant="outlined" className="mb-20 pt-10">
            <CardContent className="pb-15">
              <Formik
                initialValues={state.rules}
                onSubmit={(values: any) => {
                }}
                enableReinitialize={true}
                render={({ values, handleChange }) => (
                  <Form>
                    <FieldArray
                      name="list"
                      render={(arrayHelpers) => (
                        <div>
                          <React.Fragment>
                            {values.locations?.list?.length === 0 &&
                              <div className="audience-row">
                                <LocationsRules
                                  values={values}
                                  index={0}
                                  handleChange={handleChange}
                                />
                              </div>}
                            {values.locations?.list?.map((mylistItem, index, list) => (
                              <div className="group-box" key={index}>
                                {index > 0 && (
                                  <div className="seperator-wrap-and">
                                    <div className={`${selectedOperator === "AND" ? "child-button-and" : "child-button-or"} and-box`}>
                                      <ToggleButtonGroup
                                        value={selectedOperator}
                                        exclusive
                                        onChange={updateOperatorSelection}
                                        aria-label="Logic Operator"
                                      >
                                        <ToggleButton disabled={selectedOperator === "AND" ? true : false} value="AND" className="seperator-text" aria-label="AND Operator">
                                          {t('SETTINGS_AUDIENCE_SECTION_BUTTON_AND')}
                                        </ToggleButton>
                                        <ToggleButton disabled={selectedOperator === "OR" ? true : false} value="OR" className="seperator-text" aria-label="OR Operator">
                                          {t('SETTINGS_AUDIENCE_SECTION_BUTTON_OR')}
                                        </ToggleButton>
                                      </ToggleButtonGroup>
                                    </div>
                                  </div>
                                )}
                                <Form key={index} className="audience-row">
                                  <Chip
                                    className="group-label"
                                    disabled={
                                      state.rules.locations.list.length === 1
                                    }
                                    label={`Group 0${index + 1}`}
                                    onDelete={() => {
                                      const modifiedPayload = Object.assign({}, state.rules);
                                      modifiedPayload["locations"]["list"].splice(index, 1);
                                      removeCluster(modifiedPayload);
                                    }}
                                  />
                                  {index === 0 &&
                                    <LocationsRules
                                      values={values}
                                      index={index}
                                      handleChange={handleChange}
                                    />
                                  }
                                  {
                                    index > 0 &&
                                    <LocationsRules
                                      values={values}
                                      index={index}
                                      handleChange={handleChange}
                                    />
                                  }
                                  {mylistItem.list?.map(
                                    (item, innerIndex) =>
                                      innerIndex > 0 && (
                                        <div
                                          className="seperator-wrap"
                                          key={innerIndex}
                                        >
                                          {innerIndex && (
                                            <h5 className="seperator-text">
                                              {state.rules?.locations?.list[index]?.condition === "ANY" ? "OR" : state.rules?.locations?.list[index]?.condition === undefined ? "OR" : "AND"}
                                            </h5>
                                          )}
                                          <LocationsRules
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
                              <div className="add-bottom-btn-wrap">
                                <Button
                                  className="add_btn"
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    const modifiedPayload = Object.assign({}, state.rules);
                                    modifiedPayload["locations"]["list"].push({
                                      operation: "INCLUDE",
                                      condition: "ANY",
                                      list: [],
                                    });
                                    updateSettingsSectionPayload(modifiedPayload);
                                  }}
                                >
                                  +
                                </Button>
                              </div>
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
        </Grid>
      </div>
    </Grid>
  );
};

export default LocationsWrapper;
