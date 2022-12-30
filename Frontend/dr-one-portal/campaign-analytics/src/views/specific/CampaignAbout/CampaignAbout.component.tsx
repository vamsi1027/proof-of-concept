import CampaignDetail from "./CampaignDetail/CampaignDetail.component";
import { FC, memo, useContext } from "react";

import { ContextSpecific } from "../context/context-specific";
import { CAMPIGNTYPES, getInAppTemplateImage, getPushTemplateImage } from "./image-types";
import { useTranslation } from 'react-i18next';
import * as S from "./CampaignAbout.style";

const CampaignAboutComponent: FC = () => {
  const { data, isLoadingMetricsData, errorCode } = useContext(ContextSpecific);
  const { t } = useTranslation();

  const getCampaignImage = (data) => {
    return getInAppTemplateImage(data?.adTemplateType)
      ?? getPushTemplateImage(data?.adTemplateType)
      ?? CAMPIGNTYPES[data?.campaignType]
      ?? CAMPIGNTYPES.PUSH;
  }

  const isDisplayErrorMessage = () => {
    if (!isLoadingMetricsData && !data.campaignmeterics) {
      if (errorCode === 404) {
        // if (data.campaignType === 'PUSH_INAPP') {
        //   return true;
        // } else  {
        return false;
        // }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  const props = {
    parent: { className: "campaignAbout" },

    wrapper: { className: "campaignImg" },

    img: { src: getCampaignImage(data), alt: "Campaign" },
  };

  return (
    <S.Container>
      <div {...props.parent}>
        <div {...props.wrapper}>
          <img {...props.img} />
        </div>
        <CampaignDetail />

      </div>
      {(!data.campaignmeterics && !isLoadingMetricsData && errorCode === 404 && window.location.pathname.indexOf('PUSH_INAPP') > 0) && <div className="analytics-no-data">
        <div className="analytics-no-data-content error-no-data-push-in-app">
          <img src="/img/campaign-analytics-no-data.svg" />
          <img src="/img/campaign-analytics-no-data-text.svg" />
        </div>
      </div>}
      {isDisplayErrorMessage() && <p className="analytics-error">{t('CAMPAIGN_ANALYTICS_ERROR')}</p>}
    </S.Container>

  );
};

export default memo(CampaignAboutComponent);
