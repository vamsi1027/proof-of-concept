import { apiDashboard, helper } from '@dr-one/utils';
import { useEffect, useState } from 'react';

const useSpecific = ({ match }) => {
  const { params } = match;
  const [campaignData, setCampaignData] = useState<any>(Object);
  const [campaignDataLoader, setCampaignDataLoader] = useState(true);
  const [campaignMetricsLoader, setCampaignMetricsLoader] = useState(true);
  const [campaignMetrics, setCmapignMetrics] = useState<any>(Object);
  const [errorCode, setErrorCode] = useState(null);

  useEffect(() => {
    apiDashboard
      .get(`/campaign-mgmt-api/campaigns/v2/${params.id}`)
      .then(response => {
        const campaignData = response.data.data;
        if (!campaignData.campaignType) {
          if (!!campaignData.notificationImageContent) {
            if (!!campaignData.mainImageContent || !!campaignData.fullImageContent) {
              campaignData['campaignType'] = 'PUSH_INAPP';
            } else {
              campaignData['campaignType'] = 'PUSH';
            }
          } else {
            campaignData['campaignType'] = 'INAPP';
          }
        }
        let notificationType;
        if (!campaignData.adTemplateType) {
          if (!!campaignData.notificationImageContent) {
            if (!!campaignData?.notification.richNotificationSmallImageContent || !!campaignData?.notification.richNotificationLargeImageContent) {
              notificationType = 'RICHIMAGE';
            } else if (!!campaignData?.notification.richNotificationMessageBody) {
              notificationType = 'RICHTEXT';
            } else {
              notificationType = 'STANDARD';
            }
          }

          let containerType;
          if (!!campaignData?.videoContent && !!campaignData?.mainImageContent) {
            containerType = 'POPUPWITHVIDEO';
          } else if (!!campaignData?.mainImageContent) {
            containerType = 'POPUP';
          } else if (!!campaignData?.videoContent && !!campaignData?.fullImageContent) {
            containerType = 'FULLPAGEWITHVIDEO';
          } else if (!!campaignData?.fullImageContent) {
            containerType = 'FULLPAGE';
          }
          const adTemplateTypeForIUPortalCampaigns = (notificationType && containerType) ? `${notificationType}_${containerType}` : (notificationType && !containerType) ? notificationType : containerType;
          campaignData['adTemplateType'] = adTemplateTypeForIUPortalCampaigns;
        }

        setCampaignData(campaignData);
        setCampaignDataLoader(false);
      }, error => {
        setCampaignData({});
        setCampaignDataLoader(false);
        console.log(helper.getErrorMessage(error));
      });

    apiDashboard
      .get(`/campaign-mgmt-api/analytics/campaignmetrics?campaignid=${params.id}`)
      .then(response => {
        setCmapignMetrics(response.data);
        setCampaignMetricsLoader(false);
      }, error => {
        setCmapignMetrics({})
        console.log(helper.getErrorMessage(error));
        setCampaignMetricsLoader(false);
        setErrorCode(error.response.status ? error.response.status : 100);
      });

    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
  }, []);

  const props = {
    context: {
      value: {
        data: {
          ...campaignData,
          campaignmeterics: campaignMetrics?.campaignmeterics,
        },
        isLoadingCampaignData: campaignDataLoader,
        isLoadingMetricsData: campaignMetricsLoader,
        errorCode: errorCode,
        campaignInfo: {
          id: params.id,
          type: params.type,
          name: campaignData.name
        }
      }
    },
    campaignInfo: {
      id: params.id,
      type: params.type
    }
  };

  return {
    campaignData,
    campaignMetrics,
    props,
    campaignDataLoader,
    campaignMetricsLoader
  };
};

export default useSpecific;
