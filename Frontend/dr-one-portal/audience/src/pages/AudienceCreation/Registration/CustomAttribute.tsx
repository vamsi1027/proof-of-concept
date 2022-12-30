import React, { useState, useContext } from "react";
import { Card, CardContent, Grid, Button, Chip } from "@material-ui/core";
import { Form, Formik, FieldArray } from "formik";
import CustomAttributeRule from "./CustomAttributeRule";
import { GlobalContext } from "../../../context/globalState";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useTranslation } from 'react-i18next';

const CustomAttribute = ({ customAttribute }) => {
    const { state, dispatch } = useContext(GlobalContext);
    const [selectedOperator, setSelectedOperator] = useState("OR");
    React.useEffect(() => {
        setSelectedOperator(state.rules?.customAttribute?.condition === 'ANY' ? 'OR' : 'AND')
    }, [state.rules?.customAttribute?.condition])
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
    const updateOperatorSelection = (event: React.MouseEvent<HTMLElement>, selectedOperator: string | null) => {
        const modifiedPayload = Object.assign({}, state.rules);
        modifiedPayload["customAttribute"]["condition"] = (selectedOperator === "OR") ? "ANY" : "ALL";
        setSelectedOperator(selectedOperator);
        updateRulesPayload(modifiedPayload);
    }
    return (
        <Grid container>
            <div className="row">
                <Grid item md={12} xs={12} >
                    <Card variant="outlined" className="pt-10 mt-15">
                        <CardContent>
                            <Formik initialValues={state.rules} onSubmit={(values: any) => { }}
                                enableReinitialize={true}
                                render={({ values, handleChange }) => (
                                    <Form>
                                        <FieldArray
                                            name="list"
                                            render={(arrayHelpers) => (
                                                <div>
                                                    <React.Fragment>
                                                        {values.customAttribute?.list?.length === 0 &&
                                                            <div className="audience-row">
                                                                <CustomAttributeRule
                                                                    values={values}
                                                                    index={0}
                                                                    handleChange={handleChange}
                                                                    attribute={customAttribute}
                                                                />
                                                            </div>
                                                        }
                                                        {values.customAttribute?.list?.map(
                                                            (mylistItem, index) => (
                                                                <div className="group-box" key={index}>
                                                                    {index > 0 && (
                                                                        <div className="seperator-wrap-and">
                                                                            <div className={`${selectedOperator === "AND" ? "child-button-and" : "child-button-or"} and-box`}>
                                                                                <ToggleButtonGroup value={selectedOperator} exclusive onChange={updateOperatorSelection} aria-label="Logic Operator">
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
                                                                            disabled={state.rules.customAttribute.list?.length === 1}
                                                                            onDelete={() => {
                                                                                const modifiedPayload = Object.assign({}, state.rules);
                                                                                modifiedPayload["customAttribute"]["list"].splice(index, 1);
                                                                                removeRules(modifiedPayload);
                                                                            }}
                                                                        />
                                                                        {index === 0 &&
                                                                            <CustomAttributeRule
                                                                                values={values}
                                                                                index={index}
                                                                                handleChange={handleChange}
                                                                                attribute={customAttribute}

                                                                            />
                                                                        }
                                                                        {index > 0 &&
                                                                            <CustomAttributeRule
                                                                                values={values}
                                                                                index={index}
                                                                                handleChange={handleChange}
                                                                                attribute={customAttribute}

                                                                            />
                                                                        }
                                                                        {mylistItem?.list?.map(
                                                                            (item, innerIndex) =>
                                                                                innerIndex > 0 && (
                                                                                    <div className="seperator-wrap" key={innerIndex}>
                                                                                        {innerIndex && (
                                                                                            <h5 className="seperator-text">
                                                                                                {state.rules.customAttribute.list[index]?.condition === "ANY" ? "OR" : state.rules?.customAttribute?.list[index]?.condition === undefined ? "OR" : "AND"}
                                                                                            </h5>
                                                                                        )}
                                                                                        <CustomAttributeRule
                                                                                            innerList={mylistItem.list}
                                                                                            values={values}
                                                                                            innerIndex={innerIndex}
                                                                                            index={index}
                                                                                            handleChange={handleChange}
                                                                                            attribute={customAttribute}

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
                                                                        const modifiedPayload = Object.assign({}, state.rules);
                                                                        modifiedPayload["customAttribute"]["list"].push({
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

export default CustomAttribute;
