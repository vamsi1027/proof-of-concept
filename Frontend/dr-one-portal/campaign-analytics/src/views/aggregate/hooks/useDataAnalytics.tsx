import { apiDashboard } from "@dr-one/utils";
import { useQuery } from "react-query";
import { Campaign } from "../models/Campaign.model";
import { CampaignMetrics } from "../models/CampaignMetrics.model";
import { helper } from "@dr-one/utils";

export const useDataAnalytics = () => {
  let campaignMetricsMock: CampaignMetrics = {
    price: 0,
    impressions: 0,
    impressionRate: 0,
    downloads: 0,
    totalClientsTargeted: 0,
    totalResponseCount: 0,
    totalAudienceSize: 0,
    clicks: 0,
    videoViewed: 0,
    videoViewedRate: 0,
    eCPM: 0,
    ctiIu: 0,
    apkInstalledIu: 0,
    ctiExt: 0,
    appInstalledExt: 0,
    errors: 0,
    ctr: 0,
  };
  const keyCampaignMetrics = Object.keys(campaignMetricsMock);

  const { data: listCampaigns, isLoading: loadingList } = useQuery(
    "aggregate",
    async () => {
      const organizationId = JSON.parse(
        localStorage.getItem("dr-user")
      )?.organizationActive;
      const queryStringAll = helper.manipulateQueryString(
        ["COMPLETED"],
        0,
        100,
        "updatedAt",
        "desc",
        ""
      );
      const { data } = await apiDashboard.get(
        `campaign-mgmt-api/campaigns/v3/organization/${organizationId}${queryStringAll}`
      );
      return data.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  let campaigns: any[] = listCampaigns?.content ?? [];

  const assignCampaignMetrics = (
    originalMetrics: CampaignMetrics,
    copyMetrics: CampaignMetrics
  ) => {
    keyCampaignMetrics.forEach((key) => {
      originalMetrics[key] += copyMetrics[key];
    });
  };

  const { data, error, isLoading } = useQuery(
    "campaign",
    async () => {
      const campaignsTemp: Campaign[] = [];
      let campaignMetricsPush: CampaignMetrics = {
        price: 0,
        impressions: 0,
        impressionRate: 0,
        downloads: 0,
        totalClientsTargeted: 0,
        totalResponseCount: 0,
        totalAudienceSize: 0,
        clicks: 0,
        videoViewed: 0,
        videoViewedRate: 0,
        eCPM: 0,
        ctiIu: 0,
        apkInstalledIu: 0,
        ctiExt: 0,
        appInstalledExt: 0,
        errors: 0,
        ctr: 0,
      };

      let campaignMetricsInApp: CampaignMetrics = {
        price: 0,
        impressions: 0,
        impressionRate: 0,
        downloads: 0,
        totalClientsTargeted: 0,
        totalResponseCount: 0,
        totalAudienceSize: 0,
        clicks: 0,
        videoViewed: 0,
        videoViewedRate: 0,
        eCPM: 0,
        ctiIu: 0,
        apkInstalledIu: 0,
        ctiExt: 0,
        appInstalledExt: 0,
        errors: 0,
        ctr: 0,
      };

      let campaignMetricsPushWithInApp: CampaignMetrics = {
        price: 0,
        impressions: 0,
        impressionRate: 0,
        downloads: 0,
        totalClientsTargeted: 0,
        totalResponseCount: 0,
        totalAudienceSize: 0,
        clicks: 0,
        videoViewed: 0,
        videoViewedRate: 0,
        eCPM: 0,
        ctiIu: 0,
        apkInstalledIu: 0,
        ctiExt: 0,
        appInstalledExt: 0,
        errors: 0,
        ctr: 0,
      };

      for (const { id } of campaigns) {
        try {
          const { status, data } = await apiDashboard.get(
            `/campaign-mgmt-api/analytics/campaignmetrics?campaignid=${id}`
          );
          assignCampaignMetrics(campaignMetricsPush, data.campaignmeterics);
          assignCampaignMetrics(campaignMetricsInApp, data.campaignmeterics);
          assignCampaignMetrics(
            campaignMetricsPushWithInApp,
            data.campaignmeterics
          );
        } catch (err) {}
      }
      return {
        campaignMetricsPush,
        campaignMetricsInApp,
        campaignMetricsPushWithInApp,
      };
    },
    {
      enabled: campaigns.length > 0,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data,
    error,
    isLoading: loadingList || isLoading,
  };
};
