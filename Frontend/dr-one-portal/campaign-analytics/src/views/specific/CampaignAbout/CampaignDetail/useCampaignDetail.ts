import { useContext, useEffect, useState } from 'react';
import { ContextSpecific } from '../../context/context-specific';
import { ContextCampaignType } from "../../context/context-campaign-type";
import { useTranslation } from 'react-i18next';

enum PerformanceMetricsConversion {
  CPC = 'Cost per click',
  CPI = 'Cost per install',
  CPM = 'Cost per thousand',
  CPV = 'Cost Per Visit'
}

enum PushTemplateTypeConversion {
  STANDARD = 'Standard',
  RICHTEXT = 'Rich Text',
  RICHIMAGE = 'Rich Image',
  CUSTOMRICHIMAGE = 'Custom Rich Image',
}

enum InAppTemplateTypeConversion {
  FULLPAGE = 'Full Page',
  FULLPAGEWITHVIDEO = 'Full Page With Video',
  POPUPBANNER = 'Pop-up Banner',
  POPUPVIDEO = 'Pop-up Video',
  RATING = 'Rating',
  SLIDER = 'Slider',
  BOTTOMBANNER = 'Bottom Banner',
  TOPBANNER = 'Top Banner'
}

enum PushWithInAppTemplateTypeConversion {
  STANDARD_FULLPAGE = 'STANDARD_FULLPAGE',
  STANDARD_FULLPAGEWITHVIDEO = 'Standard Full Page With Video',
  STANDARD_POPUP = 'Standard Pop-up',
  STANDARD_POPUPWITHVIDEO = 'Standard Pop-up With Video',
  RICHTEXT_FULLPAGE = 'Rich Text Full Page',
  RICHTEXT_FULLPAGEWITHVIDEO = 'Rich Text Full Page With Video',
  RICHTEXT_POPUP = 'Rich Text Pop-up',
  RICHTEXT_POPUPWITHVIDEO = 'Rich Text Pop-up With Video',
  RICHIMAGE_FULLPAGE = 'Rich Image Full Page',
  RICHIMAGE_FULLPAGEWITHVIDEO = 'Rich Image Full Page With Video',
  RICHIMAGE_POPUP = 'Rich Image Pop-up',
  RICHIMAGE_POPUPWITHVIDEO = 'Rich Image Pop-up With Video'
}

const useCampaignDetail = () => {
  const { data } = useContext(ContextSpecific);
  const { campaignTypeValue } = useContext(ContextCampaignType);
  const { t } = useTranslation();

  const impressions = {
    PUSH: data?.campaignmeterics?.impressions,
    INAPP: data?.campaignmeterics?.adContainerShown,
    PUSH_INAPP: data?.campaignmeterics?.adContainerShown
  };

  const rows = {
    goToWeb:
      data?.campaignmeterics?.clicks / (impressions[data?.campaignType] || 1),
    packageNameToInstallApp:
      data?.campaignmeterics?.ctiExt / (impressions[data?.campaignType] || 1),
    fileIdToInstallApp: '',
    packageNameToOpenApp: '',
    phoneToCall: '',
    displayOnlyAd: '',
    surveyAd: '',
    actionInTheApp: '',
  };

  const CAMPAIGN_DESCRIPTION = [
    {
      title: t('START_DATE'),
      value: data?.distribution?.startDate,
    },
    {
      title: t('End Date'),
      value: data?.distribution?.endDateSpecified
        ? data?.distribution?.endDate
        : data?.distribution?.expirationDate,
    },
    {
      title: t('STATUS'),
      value: data?.status,
      badge: true,
    },
    {
      title: t('AGENCY_LABEL'),
      value: data?.agency?.name,
    },
    {
      title: t('ADVERTISER_LABEL'),
      value: data?.advertiser?.name,
    },
    {
      title: t('CAMPAIGN_FORMAT_LABEL'),
      value: PushTemplateTypeConversion[data?.adTemplateType]
        ?? InAppTemplateTypeConversion[data?.adTemplateType]
        ?? PushWithInAppTemplateTypeConversion[data?.adTemplateType]
        ?? data?.adTemplateType,
    },
    {
      title: t('AUDIENCE'),
      value: data?.campaignmeterics?.totalAudienceSize,
    },
    {
      title: t('SETTINGS_PERFORMANCE_SECTION_HEADING'),
      value: PerformanceMetricsConversion[data?.performance?.type],
    }
  ];

  const STATISTICS = [
    {
      title: t('CAMPAIGN_ANALYTICS_TARGETED_LABEL'),
      subTitle: t('CAMPAIGN_ANALYTICS_STATISTICS_SUBHEADER'),
      value: data?.campaignmeterics?.totalClientsTargeted || 0,
      tooltip: t('CAMPAIGN_ANALYTICS_TARGETED_TOOLTIP')
    },
    {
      title: t('CAMPAIGN_ANALYTICS_REACHED_LABEL'),
      subTitle: t('CAMPAIGN_ANALYTICS_STATISTICS_SUBHEADER'),
      value: data?.campaignmeterics?.downloads || 0,
      tooltip: t('CAMPAIGN_ANALYTICS_REACHED_TOOLTIP')
    },
    {
      title: t('PERFORMANCE_TYPE_IMPRESSIONS'),
      subTitle: t('CAMPAIGN_ANALYTICS_STATISTICS_SUBHEADER'),
      value: !(data?.campaignType === 'PUSH_INAPP')
        ? impressions[data?.campaignType] || 0
        : { isPushInApp: true, push: impressions['PUSH'] || 0, inapp: impressions['INAPP'] || 0 },
      tooltip: t('CAMPAIGN_ANALYTICS_IMPRESSIONS_TOOLTIP')
    },
    {
      title: t('PERFORMANCE_TYPE_CLICKS'),
      subTitle: t('CAMPAIGN_ANALYTICS_STATISTICS_SUBHEADER'),
      value: !(data?.campaignType === 'PUSH_INAPP') ? data?.campaignmeterics?.clicks || 0
        : { isPushInApp: true, push: impressions['INAPP'] || 0, inapp: data?.campaignmeterics?.clicks || 0 },
      tooltip: t('CAMPAIGN_ANALYTICS_CLICKS_TOOLTIP')
    }
  ];


  const surveyStatistics = [
    {
      title: t('CAMPAIGN_ANALYTICS_SURVEY_VIEWED_LABEL'),
      subTitle: t('CAMPAIGN_ANALYTICS_STATISTICS_SUBHEADER'),
      value: data?.campaignmeterics?.surveyInvoked || '',
      tooltip: t(''),
      key: 'surveyViewed'
    },
    {
      title: t('CAMPAIGN_ANALYTICS_SURVEY_SUBMITTED_LABEL'),
      subTitle: t('CAMPAIGN_ANALYTICS_STATISTICS_SUBHEADER'),
      value: data?.campaignmeterics?.surveySubmit || '',
      tooltip: t(''),
      key: 'surveySubmitted'
    },
    {
      title: t('CAMPAIGN_ANALYTICS_SURVEY_SUBMISSION_RATE_LABEL'),
      subTitle: t('CAMPAIGN_ANALYTICS_STATISTICS_SUBHEADER'),
      value: (data?.campaignmeterics?.surveyInvoked && data?.campaignmeterics?.surveyInvoked !== 0) ? ((data?.campaignmeterics?.surveySubmit / data?.campaignmeterics?.surveyInvoked) * 100).toLocaleString('en-US', { maximumFractionDigits: 2 }) + '%' : 0 + '%',
      tooltip: `(${t('CAMPAIGN_ANALYTICS_SURVEY_SUBMITTED_LABEL')} / ${t('CAMPAIGN_ANALYTICS_SURVEY_VIEWED_LABEL')}) %`,
      key: 'surveySubmissionRate'
    },
    {
      title: t('CAMPAIGN_ANALYTICS_SURVEY_REJECTED_LABEL'),
      subTitle: t('CAMPAIGN_ANALYTICS_STATISTICS_SUBHEADER'),
      value: data?.campaignmeterics?.surveyCancel + data?.campaignmeterics?.surveyBack + data?.campaignmeterics?.surveyX || '',
      tooltip: t('CAMPAIGN_ANALYTICS_SURVEY_REJECTED_TOOLTIP'),
      key: 'surveyRejected'
    },
    {
      title: t('CAMPAIGN_ANALYTICS_SURVEY_NO_RESPONSE_LABEL'),
      subTitle: t('CAMPAIGN_ANALYTICS_STATISTICS_SUBHEADER'),
      value: data?.campaignmeterics?.surveyOther || '',
      tooltip: t('CAMPAIGN_ANALYTICS_SURVEY_NO_RESPONSE_TOOLTIP'),
      key: 'surveyNoResponse'
    }
  ]

  const props = {
    parent: {
      className: 'cdContainer',
    },

    header: { name: data?.name, objective: data?.campaignObjective?.name },

    layout: { autoFlow: true },

    description: (des: any, index: number) => ({
      key: `cdd_${index}`,
      title: des.title,
      value: des.value,
      isLast: index === CAMPAIGN_DESCRIPTION.length - 1,
      isBadge: des.badge,
    }),

    statistics: {
      campaignStatistics: STATISTICS,
      surveyStatistics: surveyStatistics,
      data: data
    },
    isMetricsApiFailed: data?.campaignmeterics ? false : true
  };

  return { CAMPAIGN_DESCRIPTION, props };
};

export default useCampaignDetail;
