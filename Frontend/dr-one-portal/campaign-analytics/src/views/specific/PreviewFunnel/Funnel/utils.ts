import { DataForFunnelType } from "../../../../components/Charts/Funnel/FunnelChart.component";

const CAMPAIGN_TITLES = {
  "push": ["Targeted", "Reached", "Impressions", "Clicks"],
  "inapp": ["Targeted", "Reached", "Impressions", "Clicks"],
  "push_inapp": [
    "Targeted",
    "Reached",
    "Push Impressions",
    "Push Clicks",
    "Inapp Impressions",
    "Inapp Clicks",
  ]
}

enum BACKEND_KEYS_METRICS {
  "Targeted" = "totalClientsTargeted",
  "Reached" = "downloads",
  "Impressions" = "impressions",
  "Clicks" = "clicks",
  "Push Clicks" = "adContainerShown",
  "Push Impressions" = "adContainerShown",
  "Inapp Impressions" = "adContainerShown",
  "Inapp Clicks" = "adContainerShown"
}

const constructSeriesWithAPI = (type: string = "push", campaignmeterics: any): DataForFunnelType[] => {


  if (!campaignmeterics) return []
  type = (type === "null") ? "push" : type
  const keys = [...CAMPAIGN_TITLES[type.toLowerCase()]] || [
    "Targeted",
    "Reached",
    "Impressions",
    "Clicks",
  ];
  const data: DataForFunnelType[] = []
  keys.forEach((val: string) => {
    const quantity: number = campaignmeterics[BACKEND_KEYS_METRICS[val]] || 0
    // if(quantity > 0) {
    data.push({
      name: val,
      value: quantity
    })
    // }
  })
  return data
}

interface CAMPAIGN_TYPES {
  "push": string[],
  "in-app": string[],
  "push with in-app": string[],
}

const createInlineData = (type: string = "push"): string[] => {
  return [...CAMPAIGN_TITLES[type.toLowerCase()]] || [
    "Targeted",
    "Sent",
    "Reached",
    "Impressions",
    "Clicks",
  ];
}

export {
  constructSeriesWithAPI,
  createInlineData
}
