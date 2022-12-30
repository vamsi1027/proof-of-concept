import { MenuItemType } from '../models';
import useSummaryHeader from '../views/aggregate/summary-header/useSummaryHeader';
import { useTranslation } from 'react-i18next';
import { helper } from "@dr-one/utils";

const campaignService = () => {
  const { t } = useTranslation();

  const CAMPAIGNS: MenuItemType[] = [
    {
      id: '0',
      label: 'Audience',
      value: [
        {
          id: '1',
          label: 'Sao Paulo Residents',
          value: [
            {
              id: '2',
              label: 'Show Ads',
              value: 'Show Ads',
            },
            {
              id: '3',
              label: 'App Install',
              value: 'App Install',
            },
          ],
        },
        {
          id: '4',
          label: 'Rio Residents',
          value: 'Rio Residents',
        },
        {
          id: '5',
          label: 'Samsung Users',
          value: 'Samsung Users',
        },
      ],
    },
    {
      id: '6',
      label: 'Agency',
      value: 'Agency',
    },
    {
      id: '7',
      label: 'Objetive',
      value: 'Objetive',
    },
    {
      id: '8',
      label: 'Status',
      value: 'Status',
    },
    {
      id: '9',
      label: 'Campaign',
      value: 'Campaign',
    },
    {
      id: '10',
      label: 'Audience',
      value: 'Audience',
    },
  ];

  const STATISTICS = [
    {
      key: 'impressions',
      title: t('PERFORMANCE_TYPE_IMPRESSIONS'),
      value: {
        isPushInApp: true, push: useSummaryHeader().data.impressions.push.toString().length <=
          5 ? useSummaryHeader().data.impressions.push : helper.numberFormatter(useSummaryHeader().data.impressions.push), inapp: useSummaryHeader().data.impressions.inApp.toString().length <= 5 ? useSummaryHeader().data.impressions.inApp :
            helper.numberFormatter(useSummaryHeader().data.impressions.inApp)
      },
      isUp: false,
      subTitle: '',
      tooltip: t('CAMPAIGN_ANALYTICS_IMPRESSIONS_TOOLTIP')

    },
    {
      key: 'clicks',
      title: t('PERFORMANCE_TYPE_CLICKS'),
      value: { isPushInApp: true, push: useSummaryHeader().data.clicks.push.toString().length <= 5 ? useSummaryHeader().data.clicks.push : helper.numberFormatter(useSummaryHeader().data.clicks.push), inapp: useSummaryHeader().data.clicks.inApp.toString().length <= 5 ? useSummaryHeader().data.clicks.inApp : helper.numberFormatter(useSummaryHeader().data.clicks.inApp) },
      isUp: false,
      subTitle: '',
      tooltip: t('CAMPAIGN_ANALYTICS_CLICKS_TOOLTIP')
    },
    {
      key: 'videoViewed',
      title: t('CAMPAIGN_ANALYTICS_TYPE_VIDEO_VIEWED'),
      value: useSummaryHeader().data.videoViewed.toString().length <= 5 ? useSummaryHeader().data.videoViewed
        : helper.numberFormatter(useSummaryHeader().data.videoViewed),
      isUp: false,
      subTitle: '',
      tooltip: t('CAMPAIGN_ANALYTICS_VIDEO_VIEWS_TOOLTIP')
    },
    // {
    //   key: 'downloads',
    //   title: t('CAMPAIGN_ANALYTICS_TYPE_DOWNLOADS'),
    //   value: useSummaryHeader().data.downloads.toString().length <= 5 ? useSummaryHeader().data.downloads
    //     : helper.numberFormatter(useSummaryHeader().data.downloads),
    //   isUp: false,
    //   subTitle: '',
    //   tooltip: ''
    // }
  ];

  const CAMPAIGN_DESCRIPTION = [
    {
      title: 'Start date',
      value: '08.31.2021',
    },
    {
      title: 'End date',
      value: '08.31.2021',
    },
    {
      title: 'Status',
      value: 'Active',
      badge: true,
    },
    {
      title: 'Agency',
      value: 'Placeholder',
    },
    {
      title: 'Advertiser',
      value: 'Placeholder',
    },
    // {
    //   title: 'Contract Number',
    //   value: 'Placeholder',
    // },
    {
      title: 'Format',
      value: 'Rich Image',
    },
    {
      title: 'Audience',
      value: '10.000.000',
    },
    {
      title: 'Performance Metrics',
      value: 'CPC',
    },
    // {
    //   title: 'Total Cost',
    //   value: '50',
    // },
    // {
    //   title: 'Unit Cost',
    //   value: '50',
    // },
  ];

  const getCampaigns = (): MenuItemType[] => {
    return CAMPAIGNS;
  };

  const getCampaignsStatistics = () => {
    return STATISTICS;
  };

  const getCampaign = (id?: number) => ({
    name: 'Test_11Feb_2021',
    objective: 'Send People to website',
    description: CAMPAIGN_DESCRIPTION,
    statistics: [
      {
        title: 'Sent',
        value: '99.73%',
      },
      {
        title: 'Impressions',
        value: '40%',
      },
      {
        title: 'CTR',
        subTitle: '*CTR = Clicks / Impressions',
        value: '11.89%',
      },
      {
        title: 'Dismissed',
        value: '0.82%',
      },
      {
        title: 'ROAS',
        value: 'U$0.3',
      },
    ],
  });

  const clicks = [
    {
      hour: '08:00 - 10:00',
      day: 'Sun',
      value: 1,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Sun',
      value: 2,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Sun',
      value: 3,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Sun',
      value: 4,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Sun',
      value: 5,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Sun',
      value: 6,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Sun',
      value: 7,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Sun',
      value: 8,
    },
    {
      hour: '08:00 - 10:00',
      day: 'Mon',
      value: 9,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Mon',
      value: 10,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Mon',
      value: 11,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Mon',
      value: 12,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Mon',
      value: 13,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Mon',
      value: 14,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Mon',
      value: 15,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Mon',
      value: 16,
    },
    {
      hour: '08:00 - 10:00',
      day: 'Tue',
      value: 17,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Tue',
      value: 18,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Tue',
      value: 19,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Tue',
      value: 20,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Tue',
      value: 21,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Tue',
      value: 22,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Tue',
      value: 23,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Tue',
      value: 24,
    },
    {
      hour: '08:00 - 10:00',
      day: 'Wed',
      value: 25,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Wed',
      value: 26,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Wed',
      value: 27,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Wed',
      value: 28,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Wed',
      value: 29,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Wed',
      value: 30,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Wed',
      value: 31,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Wed',
      value: 32,
    },
    {
      hour: '08:00 - 10:00',
      day: 'Thu',
      value: 33,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Thu',
      value: 34,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Thu',
      value: 35,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Thu',
      value: 36,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Thu',
      value: 37,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Thu',
      value: 38,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Thu',
      value: 39,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Thu',
      value: 40,
    },
    {
      hour: '08:00 - 10:00',
      day: 'Fri',
      value: 41,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Fri',
      value: 42,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Fri',
      value: 43,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Fri',
      value: 44,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Fri',
      value: 45,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Fri',
      value: 46,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Fri',
      value: 47,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Fri',
      value: 48,
    },
    {
      hour: '08:00 - 10:00',
      day: 'Sat',
      value: 49,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Sat',
      value: 50,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Sat',
      value: 51,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Sat',
      value: 52,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Sat',
      value: 53,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Sat',
      value: 54,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Sat',
      value: 55,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Sat',
      value: 56,
    },
  ];

  const clicks2 = [
    {
      hour: '08:00 - 10:00',
      day: 'Sun',
      value: 56,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Sun',
      value: 55,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Sun',
      value: 54,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Sun',
      value: 53,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Sun',
      value: 52,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Sun',
      value: 51,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Sun',
      value: 50,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Sun',
      value: 49,
    },
    {
      hour: '08:00 - 10:00',
      day: 'Mon',
      value: 48,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Mon',
      value: 47,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Mon',
      value: 46,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Mon',
      value: 45,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Mon',
      value: 44,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Mon',
      value: 43,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Mon',
      value: 42,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Mon',
      value: 41,
    },
    {
      hour: '08:00 - 10:00',
      day: 'Tue',
      value: 40,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Tue',
      value: 39,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Tue',
      value: 38,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Tue',
      value: 37,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Tue',
      value: 36,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Tue',
      value: 35,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Tue',
      value: 34,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Tue',
      value: 33,
    },
    {
      hour: '08:00 - 10:00',
      day: 'Wed',
      value: 32,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Wed',
      value: 31,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Wed',
      value: 30,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Wed',
      value: 29,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Wed',
      value: 28,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Wed',
      value: 27,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Wed',
      value: 26,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Wed',
      value: 25,
    },
    {
      hour: '08:00 - 10:00',
      day: 'Thu',
      value: 24,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Thu',
      value: 23,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Thu',
      value: 22,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Thu',
      value: 21,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Thu',
      value: 20,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Thu',
      value: 19,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Thu',
      value: 18,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Thu',
      value: 17,
    },
    {
      hour: '08:00 - 10:00',
      day: 'Fri',
      value: 16,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Fri',
      value: 15,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Fri',
      value: 14,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Fri',
      value: 13,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Fri',
      value: 12,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Fri',
      value: 11,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Fri',
      value: 10,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Fri',
      value: 9,
    },
    {
      hour: '08:00 - 10:00',
      day: 'Sat',
      value: 8,
    },
    {
      hour: '10:00 - 12:00',
      day: 'Sat',
      value: 7,
    },
    {
      hour: '12:00 - 14:00',
      day: 'Sat',
      value: 6,
    },
    {
      hour: '14:00 - 16:00',
      day: 'Sat',
      value: 5,
    },
    {
      hour: '16:00 - 18:00',
      day: 'Sat',
      value: 4,
    },
    {
      hour: '18:00 - 20:00',
      day: 'Sat',
      value: 3,
    },
    {
      hour: '20:00 - 22:00',
      day: 'Sat',
      value: 2,
    },
    {
      hour: '22:00 - 00:00',
      day: 'Sat',
      value: 1,
    },
  ];

  const funnelPerMonth = [
    {
      month: 'Jan',
      clicks: 19,
      impressions: 25,
      target: 50,
    },
    {
      month: 'Feb',
      clicks: 22,
      impressions: 25,
      target: 30,
    },
    {
      month: 'Mar',
      clicks: 17,
      impressions: 19,
      target: 20,
    },
    {
      month: 'Apr',
      clicks: 9,
      impressions: 12,
      target: 16,
    },
    {
      month: 'May',
      clicks: 9,
      impressions: 13,
      target: 25,
    },
    {
      month: 'Jun',
      clicks: 8,
      impressions: 8,
      target: 12,
    },
    {
      month: 'Jul',
      clicks: 9,
      impressions: 9,
      target: 14,
    },
  ];

  const clickables = [
    { id: '1', label: 'Button 1', value: clicks },
    { id: '2', label: 'Button 2', value: clicks2 },
    { id: '3', label: 'Image 1', value: clicks },
    { id: '4', label: 'Image 2', value: clicks2 },
  ];

  return {
    getCampaigns,
    getCampaignsStatistics,
    getCampaign,
    clickables,
    funnelPerMonth,
  };
}

export default campaignService;