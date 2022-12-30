import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  Chip,
} from "@material-ui/core";
import { Form, Formik, FieldArray } from "formik";
import InstallAppRules from "./InstallAppRules";
import { GlobalContext } from "../../../context/globalState";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useTranslation } from 'react-i18next';

const installApp = () => {
  const { state } = useContext(GlobalContext);
  const { dispatch } = useContext(GlobalContext);
  const [rulesInstallappArray, setrulesInstallappArray] = useState(state.rules);
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
  const removeRules = (payload: string): void => {
    dispatch({
      type: "REMOVE_RULES",
      payload: {
        rulesPayload: payload,
      },
    });
  };
  React.useEffect(() => {
    setSelectedOperator(state.rules?.installedApps?.condition === 'ANY' ? 'OR' : 'AND')
  }, [state.rules?.installedApps?.condition])
  const updateOperatorSelection = (event: React.MouseEvent<HTMLElement>, selectedOperator: string | null) => {
    const modifiedPayload = Object.assign({}, state.rules);
    modifiedPayload["installedApps"]["condition"] = (selectedOperator === "OR") ? "ANY" : "ALL";
    setSelectedOperator(selectedOperator);
    updateRulesPayload(modifiedPayload);
  }
  return (
    <Grid container>
      <div className="row">
        <Grid item md={12} xs={12} >
          <Card variant="outlined" className="pt-10">
            <CardContent>
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
                            {values.installedApps?.list?.length === 0 &&
                              <div className="audience-row">
                                <InstallAppRules
                                  values={values}
                                  index={0}
                                  handleChange={handleChange}
                                />
                              </div>
                            }
                            {values.installedApps?.list?.map(
                              (mylistItem, index) => (
                                <div className="group-box" key={index}>
                                  {index > 0 && (
                                    <div className="seperator-wrap-and">
                                      <div className={`${selectedOperator === "AND" ? "child-button-and" : "child-button-or"} and-box`}>
                                        {/* <h5 className="seperator-text active">
                                        AND{" "}
                                      </h5>
                                      <h5 className="seperator-text">OR </h5> */}
                                        <ToggleButtonGroup
                                          value={selectedOperator}
                                          exclusive
                                          onChange={updateOperatorSelection}
                                          aria-label="Logic Operator"
                                        >
                                          <ToggleButton disabled={selectedOperator === "AND" ? true : false} value="AND" className="seperator-text" aria-label="AND Operator">
                                            {t('AND')}
                                          </ToggleButton>
                                          <ToggleButton disabled={selectedOperator === "OR" ? true : false} value="OR" className="seperator-text" aria-label="OR Operator">
                                            {t('OR')}
                                          </ToggleButton>
                                        </ToggleButtonGroup>
                                      </div>
                                    </div>
                                  )}

                                  <Form key={index} className="audience-row">
                                    <Chip
                                      className="group-label"
                                      label={`${t('GROUP_ONE')}${index + 1}`}
                                      disabled={
                                        state.rules.installedApps.list?.length === 1
                                      }
                                      onDelete={() => {
                                        const modifiedPayload = Object.assign(
                                          {},
                                          state.rules
                                        );
                                        modifiedPayload["installedApps"][
                                          "list"
                                        ].splice(index, 1);
                                        removeRules(modifiedPayload);
                                      }}
                                    />
                                    {index === 0 &&
                                      <InstallAppRules
                                        values={values}
                                        index={index}
                                        handleChange={handleChange}
                                      />
                                    }
                                    {index > 0 &&
                                      <InstallAppRules
                                        values={values}
                                        index={index}
                                        handleChange={handleChange}
                                      />
                                    }
                                    {mylistItem?.list?.map(
                                      (item, innerIndex) =>
                                        innerIndex > 0 && (
                                          <div
                                            className="seperator-wrap"
                                            key={innerIndex}
                                          >
                                            {innerIndex && (
                                              <h5 className="seperator-text">
                                                {state.rules.installedApps.list[index]?.condition === "ANY" ? "OR" : state.rules?.installedApps?.list[index]?.condition === undefined ? "OR" : "AND"}
                                              </h5>
                                            )}
                                            <InstallAppRules
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
                              )
                            )}
                          </React.Fragment>
                          <div className="bottom-btn-wrap">
                            <Grid item>
                              <div className="add-bottom-btn-wrap">
                                <Button
                                  className="add_btn"
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    const modifiedPayload = Object.assign(
                                      {},
                                      state.rules
                                    );
                                    modifiedPayload["installedApps"]["list"].push({
                                      operation: "INCLUDE",
                                      condition: "ANY",
                                      list: [],
                                    });
                                    updateRulesPayload(modifiedPayload);
                                  }}
                                >
                                  {t('PLUS_BUTTON')}
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

export default installApp;
