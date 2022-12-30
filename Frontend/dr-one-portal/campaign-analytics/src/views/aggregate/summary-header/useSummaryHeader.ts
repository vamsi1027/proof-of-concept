import { useContext } from 'react';
import { GlobalContext } from '../../../context/globalState';

type StatusQuery = {
  data: any
}

const useSummaryHeader = (): StatusQuery => {
  const { state } = useContext(GlobalContext);
  const pushClicksCount = (Object.keys(state.pushChartData).length !== 0 ? state.pushChartData.clicks : 0) +
    (Object.keys(state.pushInAppData).length !== 0 ? state.pushInAppData.pushClicks : 0);
  const inAppClicksCount = (Object.keys(state.inAppChartData).length !== 0 ? state.inAppChartData.clicks : 0) +
    (Object.keys(state.pushInAppData).length !== 0 ? state.pushInAppData.inAppClicks : 0);
  const pushImpressionsCount = (Object.keys(state.pushChartData).length !== 0 ? state.pushChartData.impressions : 0) +
    (Object.keys(state.pushInAppData).length !== 0 ? state.pushInAppData.pushImpressions : 0);
  const inAppImpressionsCount = (Object.keys(state.inAppChartData).length !== 0 ? state.inAppChartData.impressions : 0) +
    (Object.keys(state.pushInAppData).length !== 0 ? state.pushInAppData.inAppImpressions : 0);
  const videoViewed = (Object.keys(state.pushChartData).length !== 0 ? state.pushChartData.videoViewed : 0) +
    (Object.keys(state.inAppChartData).length !== 0 ? state.inAppChartData.videoViewed : 0) +
    (Object.keys(state.pushInAppData).length !== 0 ? state.pushInAppData.videoViewed : 0);
  const downloads = (Object.keys(state.pushChartData).length !== 0 ? state.pushChartData.downloads : 0) +
    (Object.keys(state.inAppChartData).length !== 0 ? state.inAppChartData.downloads : 0) +
    (Object.keys(state.pushInAppData).length !== 0 ? state.pushInAppData.downloads : 0);
    
  return {
    data: {
      clicks: { push: pushClicksCount, inApp: inAppClicksCount },
      impressions: { push: pushImpressionsCount, inApp: inAppImpressionsCount },
      videoViewed: videoViewed,
      downloads: downloads
    }
  }
}

export default useSummaryHeader;
