export interface Campaign {
  id:                           string;
  organizationId:               string;
  userId:                       string;
  name:                         string;
  adContentType:                string;
  videoContent:                 null;
  notificationImageContent:     ImageContent;
  mainImageContent:             null;
  fullImageContent:             null;
  campaignObjective:            CampaignObjective;
  campaignCategoryId:           string;
  audienceClusters:             string;
  distribution:                 Distribution;
  performance:                  Performance;
  distributionNetwork:          DistributionNetwork;
  notification:                 Notification;
  status:                       string;
  rejection:                    null;
  lockCampaign:                 null;
  reviewById:                   null;
  reviewByUserFirstName:        null;
  reviewByUserLastName:         null;
  enableGeoFence:               boolean;
  geoLocationDetail:            null;
  targetSDKVersion:             string;
  emailDistributionList:        string[];
  agency:                       Advertiser;
  advertiser:                   Advertiser;
  showAdOnUnlock:               boolean;
  showNotification:             boolean;
  performActionOnNotification:  boolean;
  imageType:                    string;
  campaignOptions:              string;
  enableVas:                    boolean;
  enableInterstitial:           boolean;
  vasInfo:                      VasInfo;
  audienceClusterScope:         string;
  campaignPerformanceColorCode: string;
  campaignBoost:                CampaignBoost;
  adDisplayTimeBehaviour:       string;
  minimumAdDisplayTime:         number;
  enableSurvey:                 boolean;
  survey:                       null;
  showPositiveFeedback:         boolean;
  showNegativeFeedback:         boolean;
  actionForPositiveFeedback:    null;
  actionForNegativeFeedback:    null;
  videoContentFlag:             boolean;
  externalAdType:               null;
  purposeType:                  string;
  campaignType:                 string;
  adTemplateType:               string;
  container:                    null;
  phoneNumber:                  string;
  engagement:                   null;
}

export interface Advertiser {
  id:          string;
  name:        string;
  description: string;
  active:      boolean;
  createdDate: number;
  updatedAt:   null;
}

export interface CampaignBoost {
  adsSentTo:      number;
  analyticsCount: number;
  targetMetrics:  number;
}

export interface CampaignObjective {
  id:     string;
  name:   string;
  hidden: boolean;
  fields: string[];
}

export interface Distribution {
  isEndDateSpecified:                 boolean;
  startDate:                          Date;
  endDate:                            Date;
  times:                              Time[];
  expirationDate:                     Date;
  distributionStrategy:               string;
  distributionAllocation:             string;
  reTargetOption:                     null;
  reTargetOptionForMultipleSlots:     null;
  maxRepetitionCount:                 number;
  distributionAllocationInterstitial: null;
  startTime:                          null;
  endTime:                            null;
  showMessageInSpecificTime:          null;
  multiShow:                          null;
  multiShowTimes:                     null;
  multiShowRange:                     null;
  multiShowRangeType:                 null;
  showSpecificDayOfMonth:             null;
  dayOfMonth:                         null;
  inappTimes:                         null;
  timeZone:                           string;
  endDateSpecified:                   boolean;
  isDistributeInTime:                 boolean;
}

export interface Time {
  dayOfWeek: number;
  startTime: number;
  endTime:   number;
}

export interface DistributionNetwork {
  type:              string;
  videoDeliveryType: string;
  appDeliveryType:   string;
}

export interface Notification {
  goToWeb:                           null;
  packageNameToInstallApp:           null;
  apkToInstall:                      null;
  packageNameToOpenApp:              string;
  phoneToCall:                       null;
  subject:                           string;
  message:                           string;
  notificationType:                  string;
  richNotificationMessageBody:       null;
  richNotificationActionButtonText:  string;
  richNotificationLargeImageContent: ImageContent;
  richNotificationSmallImageContent: null;
  richNotificationTheme:             null;
  richNotificationBgColor:           null;
  displayOnlyAd:                     string;
  customAdTracker:                   null;
  adActionText:                      string;
  buttons:                           any[];
}

export interface ImageContent {
  id:               string;
  organizationId:   string;
  userId:           string;
  name:             string;
  imageFileId:      string;
  imageUrl:         string;
  imageContentType: string;
  updatedAt:        number;
  createdDate:      number | null;
  dimensions:       Dimensions;
  size:             number;
}

export interface Dimensions {
  height: number;
  width:  number;
}

export interface Performance {
  pricingType:                    string;
  type:                           string;
  maximumBudget:                  null;
  maximumMetric:                  number;
  isMaximumBudgetSpecified:       boolean;
  isMaximumMetricSpecified:       boolean;
  proposedPrice:                  number;
  enablePerformanceOveride:       boolean;
  assumedPerformance:             number;
  assumedImpressionRateSpecified: boolean;
  assumedImpressionRate:          number;
  maximumMetricSpecified:         boolean;
  maximumBudgetSpecified:         boolean;
}

export interface VasInfo {
  productCode:                 null;
  providerId:                  null;
  preSubscriptionText:         null;
  preSubscriptionPositiveText: null;
  preSubscriptionNegativeText: null;
  preSubscriptionTitle:        null;
  processingText:              null;
  defaultFailureText:          null;
  defaultActionText:           null;
  preSubscriptionActionText:   null;
}
