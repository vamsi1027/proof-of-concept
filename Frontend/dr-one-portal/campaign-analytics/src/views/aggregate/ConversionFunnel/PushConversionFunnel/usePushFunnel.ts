import { useState, useEffect, useContext } from 'react';
import { apiDashboard, helper } from '@dr-one/utils';
import { useTranslation } from 'react-i18next';
import { DataForFunnelType } from "../../../../components/Charts/Funnel/FunnelChart.component";
import { GlobalContext } from '../../../../context/globalState';
import { CAMPAIGN_ANALYTICS_ACTIONS } from '../../../../context/CampaignAnalyticsReducer';

type StatusQuery = {
  isLoading: boolean,
  error: any,
  data: any
}

const usePushFunnel = (): StatusQuery => {
  const { state } = useContext(GlobalContext);
  const { dispatch } = useContext(GlobalContext);
  const [dataChart, setDataChart] = useState<DataForFunnelType[]>([])
  const fromDate = Object.values(state.dateRange).length !== 0 ? helper.formatDateWithSlash(state?.dateRange?.startDate).split('/').join('-') : '';
  const toDate = Object.values(state.dateRange).length !== 0 ? helper.formatDateWithSlash(state?.dateRange?.endDate).split('/').join('-') : '';
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    if (Object.values(state.dateRange).length !== 0) {
      apiDashboard
        .get(`/campaign-mgmt-api/analytics/campaign/aggregated?startDate=${fromDate}&endDate=${toDate}&campaignType=PUSH`)
        .then((response) => {
          setDataChart((response?.data?.metrics?.targeted > 0) ? [
            { name: t('CAMPAIGN_ANALYTICS_TARGETED_LABEL'), value: response.data.metrics.targeted },
            // { name: t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_SENT'), value: response.data.metrics.sent },
            { name: t('CAMPAIGN_ANALYTICS_REACHED_LABEL'), value: response.data.metrics.reached },
            { name: t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_IMPRESSIONS'), value: response.data.metrics.impressions },
            { name: t('CAMPAIGN_ANALYTICS_CLICKS_LABEL'), value: response.data.metrics.clicks },
          ] : []);
          dispatch({
            type: CAMPAIGN_ANALYTICS_ACTIONS.SET_PUSH_CHART_DATA,
            payload: response?.data?.metrics
          })
          setLoading(false);
          setError('');
        }, error => {
          setLoading(false);
          setError(error.response.message);
          dispatch({
            type: CAMPAIGN_ANALYTICS_ACTIONS.SET_PUSH_CHART_DATA,
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

export default usePushFunnel;
