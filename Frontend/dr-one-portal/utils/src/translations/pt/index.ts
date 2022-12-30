import { CORE_PT } from './core';
import { CAMPAIGN_PT } from './campaign';
import { AUDIENCE_PT } from './audience';
import { ADMIN_PT } from './admin';
import { CAMPAIGN_ANALYTICS_PT } from './campaignAnalytics';
import { VIRTUAL_PRELOAD_PT } from './virtualPreload';
import { SURVEY_PT } from './survey';

export default {
  ...CORE_PT,
  ...CAMPAIGN_PT,
  ...AUDIENCE_PT,
  ...ADMIN_PT,
  ...CAMPAIGN_ANALYTICS_PT,
  ...VIRTUAL_PRELOAD_PT,
  ...SURVEY_PT
}
