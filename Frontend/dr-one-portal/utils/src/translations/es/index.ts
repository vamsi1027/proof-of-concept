import { CORE_ES } from './core'
import { CAMPAIGN_ES } from './campaign';
import { AUDIENCE_ES } from './audience';
import { ADMIN_ES } from './admin';
import { CAMPAIGN_ANALYTICS_ES } from './campaignAnalytics';
import { VIRTUAL_PRELOAD_ES } from './virtualPreload';
import { SURVEY_ES } from './survey';

export default {
  ...CORE_ES,
  ...CAMPAIGN_ES,
  ...AUDIENCE_ES,
  ...ADMIN_ES,
  ...CAMPAIGN_ANALYTICS_ES,
  ...VIRTUAL_PRELOAD_ES,
  ...SURVEY_ES
}
