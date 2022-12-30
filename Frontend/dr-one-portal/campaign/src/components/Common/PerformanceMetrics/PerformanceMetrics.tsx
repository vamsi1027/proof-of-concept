import { useContext, useEffect, useState } from "react";
import * as S from "./PerformanceMetrics.styles";
import { TextField } from "@material-ui/core";
import { GlobalContext } from "../../../context/globalState";
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";
import TypePerformanceRadio from "../TypePerformance/TypePerformance";
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import { LightTooltip } from "@dr-one/shared-component";
import InputAdornment from '@material-ui/core/InputAdornment';

const PerformanceMetrics = () => {
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const {
    settings,
    settings: { metrics },
  } = state.formValues;
  const { cpc, ctr, impressions, reach, target, totalCost, typePerformance, performanceError } =
    metrics;
  const { t } = useTranslation();
  const [costFieldError, setCostFieldError] = useState(performanceError.costFieldError);
  const [ctrFieldError, setCtrFieldError] = useState(performanceError.ctrFieldError);
  const [estimatedReachFieldError, setEstimatedReachFieldError] = useState(performanceError.estimatedReachFieldError);
  const [targetFieldError, setTargetFieldError] = useState(performanceError.targetFieldError);
  const [isMetricsSectionValid, toggleMetricsSectionValidity] = useState(state.formValues.settings.isSettingSectionValid.isMetricsSectionValid);

  const setMetrics = (key: string, value: any): void => {
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_SETTINGS,
      payload: {
        ...settings, metrics: { ...metrics, [key]: value }, isSettingSectionValid: {
          isMetricsSectionValid: ((key === 'typePerformance') && costFieldError.length === 0 &&
            ctrFieldError.length === 0 && estimatedReachFieldError.length === 0 && targetFieldError.length == 0 && target.length !== 0) ? true : isMetricsSectionValid,
          isScheduleSectionValid: state.formValues.settings.isSettingSectionValid.isScheduleSectionValid,
          isClusterSectionValid: state.formValues.settings.isSettingSectionValid.isClusterSectionValid,
          isCustomTrackerLinkSectionValid: state.formValues.settings.isSettingSectionValid.isCustomTrackerLinkSectionValid,
          isCampaignOptionSectionValid: state.formValues.settings.isSettingSectionValid.isCampaignOptionSectionValid
        }, isCallReachCountApi: window.location.pathname.indexOf('edit') >= 0 ? true : state.formValues.settings.isCallReachCountApi
      }
    });
  };

  const [isLoadingImpressions, setIsLoadingImpressions] = useState(settings.metrics.impressions === 'Total' ? true : false);
  const [isLoadingTotalCost, setIsLoadingTotalCost] = useState(settings.metrics.totalCost === 'Total' ? true : false);

  useEffect(() => {
    if ((typePerformance !== 'CPM' && target > 0 && reach > 0 && ctr > 0) ||
      (typePerformance === 'CPM' && target > 0 && reach > 0)) {
      setIsLoadingImpressions(false);
      // const reachPercentage = reach / 100;
      // const ctrPercentage = ctr / 100;
      // const total = Math.ceil(target / reachPercentage / ctrPercentage);
      // if (window.location.pathname.indexOf('edit') < 0) {
      //   setMetrics("impressions", total);
      // }
    } else {
      setIsLoadingImpressions(true);
      // setMetrics("impressions", "Total");
    }
  }, [target, reach, ctr, typePerformance]);

  useEffect(() => {
    if (target && cpc) {
      setIsLoadingTotalCost(false);
      // const total = (target * cpc).toString();
      // if (window.location.pathname.indexOf('edit') < 0) {
      //   setMetrics("totalCost", total);
      // }
    } else {
      setIsLoadingTotalCost(true);
      // setMetrics("totalCost", "Total");
    }
  }, [target, cpc]);

  const isCostFieldValid = (value: string): void => {
    let costFieldErrorMessage;
    if (value.length !== 0) {
      if (Number(value) <= 0) {
        costFieldErrorMessage = t('SETTINGS_PERFORMANCE_COST_MIN_ERROR');
      } else if (Number(value) > 100) {
        costFieldErrorMessage = t('SETTINGS_PERFORMANCE_COST_MAX_ERROR');
      } else {
        costFieldErrorMessage = '';
      }
    } else {
      costFieldErrorMessage = '';
    }
    isPerformanceSectionValid(costFieldErrorMessage, "cpc", parseFloat(value));
    setCostFieldError(costFieldErrorMessage);
    // setMetrics("cpc", parseFloat(value));
  }

  const isCtrFieldValid = (value: string): void => {
    let ctrFieldErrorMessage;
    if (value.length !== 0) {
      if (Number(value) <= 0) {
        ctrFieldErrorMessage = t('SETTINGS_PERFORMANCE_CTR_MIN_ERROR');
      } else if (Number(value) > 100) {
        ctrFieldErrorMessage = t('SETTINGS_PERFORMANCE_CTR_MAX_ERROR');
      } else {
        ctrFieldErrorMessage = '';
      }
    } else {
      ctrFieldErrorMessage = '';
    }
    isPerformanceSectionValid(ctrFieldErrorMessage, "ctr", parseFloat(value));
    setCtrFieldError(ctrFieldErrorMessage);
    // setMetrics("ctr", parseFloat(value));
  }

  const isEstimatedReachFieldValid = (value: string): void => {
    let reachFieldErrorMessage;
    if (value.length !== 0) {
      if (Number(value) < 0) {
        reachFieldErrorMessage = t('SETTINGS_PERFORMANCE_REACH_MIN_ERROR');
      } else if (Number(value) > 100) {
        reachFieldErrorMessage = t('SETTINGS_PERFORMANCE_REACH_MAX_ERROR');
      } else {
        reachFieldErrorMessage = '';
      }
    } else {
      reachFieldErrorMessage = '';
    }
    isPerformanceSectionValid(reachFieldErrorMessage, "reach", value);
    setEstimatedReachFieldError(reachFieldErrorMessage);
    // setMetrics("reach", value);
  }

  const isTargetFieldValid = (value: string): void => {
    let targetFieldErrorMessage;
    if (value.length !== 0) {
      if (Number(value) <= 0) {
        targetFieldErrorMessage = t('SETTINGS_PERFORMANCE_TARGET_MIN_ERROR');
      } else if (Number(value) > 10000000) {
        targetFieldErrorMessage = t('SETTINGS_PERFORMANCE_TARGET_MAX_ERROR');
      } else if (!/^[0-9]*$/.test(value)) {
        targetFieldErrorMessage = t('SETTINGS_PERFORMANCE_TARGET_INVALID_ERROR');
      } else {
        targetFieldErrorMessage = '';
      }
    } else {
      targetFieldErrorMessage = t('SETTINGS_PERFORMANCE_TARGET_REQUIRED_ERROR');
    }
    isPerformanceSectionValid(targetFieldErrorMessage, "target", value);
    setTargetFieldError(targetFieldErrorMessage);
  }

  const isPerformanceSectionValid = (errorMessage: string, fieldType: string, fieldValue: any): void => {
    const errorObject = {
      costFieldError: '',
      ctrFieldError: '',
      estimatedReachFieldError: '',
      targetFieldError: ''
    }
    let isPerformanceSectionValid;
    if (fieldType === 'ctr') {
      if (target && target.length !== 0) {
        if (costFieldError.length === 0) {
          if (errorMessage.length === 0) {
            errorObject['ctrFieldError'] = '';
            if (estimatedReachFieldError.length > 0) {
              isPerformanceSectionValid = false;
            } else {
              isPerformanceSectionValid = true;
            }
          } else {
            isPerformanceSectionValid = false;
            errorObject['ctrFieldError'] = errorMessage;
          }
        } else {
          isPerformanceSectionValid = false;

        }
      } else {
        isPerformanceSectionValid = false;
      }
    }
    if (fieldType === 'cpc') {
      if (target && target.length !== 0) {
        if (ctrFieldError.length === 0) {
          if (errorMessage.length === 0) {
            errorObject['costFieldError'] = '';
            if (estimatedReachFieldError.length > 0) {
              isPerformanceSectionValid = false;
            } else {
              isPerformanceSectionValid = true;
            }
          } else {
            isPerformanceSectionValid = false;
            errorObject['costFieldError'] = errorMessage;
          }
        } else {
          isPerformanceSectionValid = false;
        }
      } else {
        isPerformanceSectionValid = false;
      }
    }

    if (fieldType === 'reach') {
      if (target && target.length !== 0) {
        if (ctrFieldError.length === 0) {
          if (errorMessage.length === 0) {
            errorObject['estimatedReachFieldError'] = '';
            if (costFieldError.length > 0) {
              isPerformanceSectionValid = false;
            } else {
              isPerformanceSectionValid = true;
            }
          } else {
            isPerformanceSectionValid = false;
            errorObject['estimatedReachFieldError'] = errorMessage;
          }
        } else {
          isPerformanceSectionValid = false;
        }
      } else {
        isPerformanceSectionValid = false;
      }
    }
    if (fieldType === 'target') {
      if (errorMessage.length === 0) {
        errorObject['targetFieldError'] = '';
        if (ctrFieldError.length === 0) {
          if (estimatedReachFieldError.length > 0) {
            isPerformanceSectionValid = false;
          } else {
            isPerformanceSectionValid = true;
          }
        } else {
          isPerformanceSectionValid = false;
        }
      } else {
        isPerformanceSectionValid = false;
        errorObject['targetFieldError'] = errorMessage;
      }
    }

    toggleMetricsSectionValidity(isPerformanceSectionValid);
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_SETTINGS,
      payload: {
        ...settings, metrics: { ...metrics, [fieldType]: fieldValue, performanceError: errorObject }, isSettingSectionValid: {
          isMetricsSectionValid: isPerformanceSectionValid,
          isScheduleSectionValid: state.formValues.settings.isSettingSectionValid.isScheduleSectionValid,
          isClusterSectionValid: state.formValues.settings.isSettingSectionValid.isClusterSectionValid,
          isCustomTrackerLinkSectionValid: state.formValues.settings.isSettingSectionValid.isCustomTrackerLinkSectionValid,
          isCampaignOptionSectionValid: state.formValues.settings.isSettingSectionValid.isCampaignOptionSectionValid
        }, isCallReachCountApi: false
      }
    });
  }

  return (
    <S.Container>
      <S.Logo>
        <img src="/img/campaign-settings-performance-metrics-icon.svg" alt="audience icon" />
        <article>
          <p className="label-tooltip cc-label-text">{t('SETTINGS_PERFORMANCE_SECTION_HEADING')}
            <LightTooltip title={
              <label>{t('TOOLTIP_FOR_PERFORMANCE')}
                <a target="_blank" href="https://docs.digitalreef.com/docs/performance-metrics-know-more"> {t('KNOW_MORE')}</a>.
              </label>
            }
            />

          </p>
          <small>{t('SETTINGS_PERFORMANCE_SECTION_SUBHEADING')}</small>
        </article>
      </S.Logo>
      <S.Radios>
        <Grid container>
          <div className="row mt-25">
            <TypePerformanceRadio
              title={<div className="label-tooltip cc-label-text">
                {`${t('PERFORMANCE_TYPE_CLICKS')}`}
                <LightTooltip title={<label>{t('TOOLTIP_FOR_CLICKS')} <a target="_blank" href="https://docs.digitalreef.com/docs/performance-metrics-know-more"> {t('KNOW_MORE')}</a>.</label>}
                /></div>}
              value="CPC"
              iconDefault="/img/touch_app-icon.svg"
              iconWhite="/img/touch_app_white-icon.svg"
              setMetrics={setMetrics}
              typePerformance={typePerformance}
              disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
            />
            {((state.formValues.registration.campaignType === 'inApp' && (state.formValues.template.primaryTemplateType === 'fullPageWithVideo' || state.formValues.template.primaryTemplateType === 'popupWithVideo')) ||
              (state.formValues.registration.campaignType === 'pushInApp' && (state.formValues.template.secondaryTemplateType === 'fullPageWithVideo' || state.formValues.template.secondaryTemplateType === 'popupWithVideo'))) && <TypePerformanceRadio
                // title={t('PERFORMANCE_TYPE_VIEWS')}
                title={<div className="label-tooltip cc-label-text" >
                  {`${t('PERFORMANCE_TYPE_VIEWS')}`}
                  <LightTooltip title={<label>{t('TOOLTIP_FOR_VIEW')} <a target="_blank" href="https://docs.digitalreef.com/docs/performance-metrics-know-more"> {t('KNOW_MORE')}</a>.</label>}
                  /> </div>}
                value="CPV"
                iconDefault="/img/visibility-icon.svg"
                iconWhite="/img/visibility-icon-white.svg"
                setMetrics={setMetrics}
                typePerformance={typePerformance}
                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
              />}
            <TypePerformanceRadio
              // title={t('PERFORMANCE_TYPE_IMPRESSIONS')}
              title={<div className="label-tooltip cc-label-text">
                {`${t('PERFORMANCE_TYPE_IMPRESSIONS')}`}
                <LightTooltip title={<label>{t('TOOLTIP_FOR_IMPRESSIONS')} <a target="_blank" href="https://docs.digitalreef.com/docs/performance-metrics-know-more"> {t('KNOW_MORE')}</a>.</label>}
                /> </div>}
              value="CPM"
              iconDefault="/img/verified_user-icon.svg"
              iconWhite="/img/verified_user-icon-white.svg"
              setMetrics={setMetrics}
              typePerformance={typePerformance}
              disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
            />
            {state.formValues.registration.campaignObjectiveName === 'packageNameToInstallApp' && <TypePerformanceRadio
              title={<div className="label-tooltip cc-label-text">{`${t('PERFORMANCE_TYPE_INSTALLS')}`}
                <LightTooltip title={<label>{t('TOOLTIP_FOR_INSTALLS')} <a target="_blank" href="https://docs.digitalreef.com/docs/performance-metrics-know-more"> {t('KNOW_MORE')}</a>.</label>} /> </div>}
              value="CPI"
              iconDefault="/img/assignment_returned.svg"
              iconWhite="/img/assignment_returned-white.svg"
              setMetrics={setMetrics}
              typePerformance={typePerformance}
              disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
            />}
          </div>
        </Grid>

      </S.Radios>

      {!!metrics.typePerformance && (
        <S.Metrics>
          <section>
            {/* <S.Target>
              <p>Target</p>
              <section>
                <img
                  src="/img/subtract-icon.svg"
                  alt="icon subtract"
                  onClick={() => {
                    const value = target <= 1 ? 1 : target - 1;
                    setMetrics("target", value);
                  }}
                />
                {target}
                <img
                  src="/img/add-icon.svg"
                  alt="icon add"
                  onClick={() => {
                    const value = target < 10000000 ? target + 1 : 10000000;
                    setMetrics("target", value);
                  }}
                />
              </section>
            </S.Target> */}

            <S.Inputs>

              <Grid container>
                <div className="row">
                  <Grid item xs={6} md={3} className="form-row">

                    {typePerformance === 'CPM' && <TextField
                      id="outlined-required"
                      // label={`${t('SETTINGS_PERFORMANCE_TARGET_LABEL')} *`}
                      InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                      label={<div className="label-tooltip">
                        {`${t('SETTINGS_PERFORMANCE_TARGET_LABEL_IN_THOUSAND')} *`}
                        <LightTooltip title={<label>{t('TOOLTIP_FOR_TARGET')} <a target="_blank" href="https://docs.digitalreef.com/docs/performance-metrics-know-more"> {t('KNOW_MORE')}</a>.</label>}
                        /> </div>}
                      InputProps={{ endAdornment: <InputAdornment position="end">000</InputAdornment>, inputProps: { type: "number", min: 1, max: 10000000 } }}
                      value={target}
                      onBlur={(e) => {
                        isTargetFieldValid(e.target.value);
                      }}
                      onChange={(e) => {
                        isTargetFieldValid(e.target.value);
                      }}
                      placeholder={t('SETTINGS_PERFORMANCE_TARGET_PLACEHOLDER')}
                      variant="outlined"
                      // InputLabelProps={{
                      //   shrink: true,
                      // }}
                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                    />}
                    {typePerformance !== 'CPM' &&
                      <TextField
                        id="outlined-required"
                        // label={`${t('SETTINGS_PERFORMANCE_TARGET_LABEL')} *`}
                        InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                        label={<div className="label-tooltip">
                          {`${t('SETTINGS_PERFORMANCE_TARGET_LABEL')} *`}
                          <LightTooltip title={<label>{t('TOOLTIP_FOR_TARGET')} <a target="_blank" href="https://docs.digitalreef.com/docs/performance-metrics-know-more"> {t('KNOW_MORE')}</a>.</label>}
                          /> </div>}
                        InputProps={{ inputProps: { type: "number", min: 1, max: 10000000 } }}
                        value={target}
                        onBlur={(e) => {
                          isTargetFieldValid(e.target.value);
                        }}
                        onChange={(e) => {
                          isTargetFieldValid(e.target.value);
                        }}
                        placeholder={t('SETTINGS_PERFORMANCE_TARGET_PLACEHOLDER')}
                        variant="outlined"
                        // InputLabelProps={{
                        //   shrink: true,
                        // }}
                        disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                      />}
                    <p className="error-wrap error">{targetFieldError}</p>
                  </Grid>

                  {typePerformance !== 'CPM' && <Grid item xs={6} md={3} className="form-row">
                    <TextField
                      id="outlined-required"
                      InputProps={{ inputProps: { type: "number", min: 1, max: 100 } }}
                      // label={`${t('CTR')} %`}
                      InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                      label={<div className="label-tooltip">{`${t('CTR')} %`}
                        <LightTooltip title={<label>{t('TOOLTIP_FOR_SETTING_CTA')} <a target="_blank" href="https://docs.digitalreef.com/docs/performance-metrics-know-more"> {t('KNOW_MORE')}</a>.</label>}
                        /> </div>}
                      value={ctr}
                      onChange={(e) => {
                        isCtrFieldValid(e.target.value);
                      }}
                      placeholder={t('SETTINGS_PERFORMANCE_CTR_PLACEHOLDER')}
                      variant="outlined"
                      // InputLabelProps={{
                      //   shrink: true,
                      // }}
                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                    />
                    <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                    <p className="error-wrap error">{ctrFieldError}</p>
                  </Grid>}

                  <Grid item xs={6} md={3} className="form-row">
                    <TextField
                      id="outlined-required"
                      // label={t('SETTINGS_PERFORMANCE_REACH_LABEL')}
                      InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                      label={<div className="label-tooltip">{`${t('SETTINGS_PERFORMANCE_REACH_LABEL')}`}
                        <LightTooltip title={<label>{t('TOOLTIP_FOR_ESTIMATED_REACH')} <a target="_blank" href="https://docs.digitalreef.com/docs/performance-metrics-know-more"> {t('KNOW_MORE')}</a>.</label>}
                        /> </div>}
                      InputProps={{ inputProps: { type: "number", min: 1, max: 100 } }}
                      value={reach}
                      onChange={(e) => {
                        isEstimatedReachFieldValid(e.target.value);
                      }}
                      placeholder={t('SETTINGS_PERFORMANCE_REACH_PLACEHOLDER')}
                      variant="outlined"
                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                    />
                    <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                    <p className="error-wrap error">{estimatedReachFieldError}</p>
                  </Grid>
                  <Grid item xs={6} md={3} className="form-row">
                    <TextField
                      id="outlined-required"
                      InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                      label={<div className="label-tooltip">{`${t('SETTINGS_PERFORMANCE_COST_LABEL')}`}
                        <LightTooltip title={<label>{t('TOOLTIP_FOR_COST')} <a target="_blank" href="https://docs.digitalreef.com/docs/performance-metrics-know-more"> {t('KNOW_MORE')}</a>.</label>}
                        /> </div>}
                      InputProps={{ inputProps: { type: "number", min: 1, max: 100 } }}
                      value={cpc}
                      onChange={(e) => {
                        isCostFieldValid(e.target.value);
                      }}
                      placeholder={t('SETTINGS_PERFORMANCE_COST_PLACEHOLDER')}
                      variant="outlined"
                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                    />
                    <p className="optional-msg">{`${t('OPTIONAL')}`}</p>
                    <p className="error-wrap error">{costFieldError}</p>
                  </Grid>
                </div>
              </Grid>
            </S.Inputs>
          </section>

          <section className="total">

            <Grid container>
              <div className="row">
                <Grid item xs={6} md={4} className="form-row">
                  <S.Total>
                    <p className="title">{t('SETTINGS_PERFORMANCE_COST_FORMULA_HEADER')}</p>
                    <div>
                      <p>
                        {target ? target : t('SETTINGS_PERFORMANCE_TARGET_LABEL')} X {cpc ? cpc : t('CPC')} ={" "}
                        {target && cpc ? (target * cpc).toString() : 'Total'}
                      </p>

                      <div className={isLoadingTotalCost && "spinner"}>
                        <img
                          src="/img/loading-performance-metrics-icon.svg"
                          alt="loading icon"
                        />
                      </div>
                    </div>
                  </S.Total>
                </Grid>
                <Grid item xs={6} md={4} className="form-row">
                  <S.Total>
                    <p className="title matrics-label" >{t('SETTINGS_PERFORMANCE_IMPRESSIONS_FORMULA_HEADER')}</p>
                    <div>
                      <p>
                        {target ? typePerformance === 'CPM' ? (target * 1000) : target : t('SETTINGS_PERFORMANCE_TARGET_LABEL')} / {reach ? reach + "%" : t('REACH')}{" "}
                        {typePerformance === 'CPM' ? '' : ctr ? '/ ' + ctr + "%" : '/ ' + t('CTR')} =  {(typePerformance === 'CPM' && target && reach) ? Math.ceil((target * 1000) / (reach / 100)) : (target && reach && ctr) ? Math.ceil(target / (reach / 100) / (ctr / 100)) : 'Total'}
                      </p>

                      <div className={isLoadingImpressions && "spinner"}>
                        <img
                          src="/img/loading-performance-metrics-icon.svg"
                          alt="loading icon"
                        />
                      </div>
                    </div>
                  </S.Total>
                </Grid>
              </div>
            </Grid>
          </section>
        </S.Metrics>
      )}
    </S.Container>
  );
};

export default PerformanceMetrics;
