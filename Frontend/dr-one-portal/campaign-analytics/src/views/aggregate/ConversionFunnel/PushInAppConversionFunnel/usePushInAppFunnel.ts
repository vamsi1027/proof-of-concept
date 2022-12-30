import { useState, useEffect, useContext } from 'react';
import { apiDashboard, helper } from '@dr-one/utils';
import { useTranslation } from 'react-i18next';
import { DataForWaterfallChartType } from "../../../../components/Charts/Waterfall";
import { GlobalContext } from '../../../../context/globalState';
import { CAMPAIGN_ANALYTICS_ACTIONS } from '../../../../context/CampaignAnalyticsReducer';
// import * as am4core from "@amcharts/amcharts4/core";
// import { WATERFALL_COLORS } from "../../../../components/Charts/Utils/constants";

type StatusQuery = {
  isLoading: boolean,
  error: any,
  data: any
}

const usePushInAppFunnel = (): StatusQuery => {
  const { state } = useContext(GlobalContext);
  const { dispatch } = useContext(GlobalContext);
  const [dataChart, setDataChart] = useState<DataForWaterfallChartType[]>([])
  const fromDate = Object.values(state.dateRange).length !== 0 ? helper.formatDateWithSlash(state?.dateRange?.startDate).split('/').join('-') : '';
  const toDate = Object.values(state.dateRange).length !== 0 ? helper.formatDateWithSlash(state?.dateRange?.endDate).split('/').join('-') : '';
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    if (Object.values(state.dateRange).length !== 0) {
      apiDashboard
        .get(`/campaign-mgmt-api/analytics/campaign/aggregated?startDate=${fromDate}&endDate=${toDate}&campaignType=PUSH_INAPP`)
        .then((response) => {
          const Targeted = response.data.metrics["targeted"] || 0;
          const Sent = response.data.metrics["sent"] || 0;
          const Reached = response.data.metrics["reached"] || 0;
          const Push_Impressions = response.data.metrics["pushImpressions"] || 0;
          const Push_Clicks = response.data.metrics["pushClicks"] || 0;
          const Inapp_Clicks = response.data.metrics["inAppClicks"] || 0;
          const Inapp_Impressions = response.data.metrics["inAppImpressions"] || 0;
          const dataFormatter: DataForWaterfallChartType[] = (Targeted > 0) ? [
            {
              category: t('CAMPAIGN_ANALYTICS_TARGETED_LABEL'),
              value: Targeted,
              open: 0,
              stepValue: Targeted,
              tooltipValue: Targeted,
              // color: am4core.color(WATERFALL_COLORS[0]),
            },
            // {
            //   category: t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_SENT'),
            //   value: Targeted - Sent,
            //   open: Targeted,
            //   stepValue: Targeted - Sent,
            //   tooltipValue: Sent,
            //   // color: am4core.color(WATERFALL_COLORS[1]),
            // },
            // {
            //   category: t('CAMPAIGN_ANALYTICS_REACHED_LABEL'),
            //   value: Targeted - Sent - Reached,
            //   open: Targeted - Sent,
            //   stepValue: Targeted - Sent - Reached,
            //   tooltipValue: Reached,
            //   // color: am4core.color(WATERFALL_COLORS[2]),
            // },
            {
              category: t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_PUSH_IMPRESSIONS'),
              value: Targeted - Sent - Reached - Push_Impressions,
              open: Targeted - Sent - Reached,
              stepValue: Targeted - Sent - Reached - Push_Impressions,
              tooltipValue: Push_Impressions,
              // color: am4core.color(WATERFALL_COLORS[3]),
            },
            {
              category: t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_PUSH_CLICKS'),
              value: Targeted - Sent - Reached - Push_Impressions - Push_Clicks,
              open: Targeted - Sent - Reached - Push_Impressions,
              stepValue: Targeted - Sent - Reached - Push_Impressions - Push_Clicks,
              tooltipValue: Push_Clicks,
              // color: am4core.color(WATERFALL_COLORS[4]),
            },
            {
              category: t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_IN_APP_IMPRESSIONS'),
              value: Targeted - Sent - Reached - Push_Impressions - Push_Clicks - Inapp_Clicks - Inapp_Impressions,
              open: Targeted - Sent - Reached - Push_Impressions - Push_Clicks - Inapp_Clicks,
              stepValue: Targeted - Sent - Reached - Push_Impressions - Push_Clicks - Inapp_Clicks - Inapp_Impressions,
              tooltipValue: Inapp_Impressions,
              // color: am4core.color(WATERFALL_COLORS[6]),
            },
            {
              category: t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_IN_APP_CLICKS'),
              value: Targeted - Sent - Reached - Push_Impressions - Push_Clicks - Inapp_Clicks,
              open: Targeted - Sent - Reached - Push_Impressions - Push_Clicks,
              stepValue: Targeted - Sent - Reached - Push_Impressions - Push_Clicks - Inapp_Clicks,
              tooltipValue: Inapp_Clicks,
              // color: am4core.color(WATERFALL_COLORS[5]),
            }
          ] : [];

          setDataChart(dataFormatter);
          dispatch({
            type: CAMPAIGN_ANALYTICS_ACTIONS.SET_PUSH_IN_APP_CHART_DATA,
            payload: response?.data?.metrics
          })
          setLoading(false);
          setError('');
        }, error => {
          setLoading(false);
          setError(error.response.message);
          dispatch({
            type: CAMPAIGN_ANALYTICS_ACTIONS.SET_PUSH_IN_APP_CHART_DATA,
            payload: {}
          })
        });
    }
  }, [state.dateRange])

  return {
    isLoading,
    error,
    data: dataChart || []
  }
}

export default usePushInAppFunnel;
