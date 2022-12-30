import React, { ElementType } from "react";
import { Button, Typography, Avatar } from "@material-ui/core";
import { icon_download } from "../../../../../assets";
import * as S from "./CampaignDetailHeader.style";
import { helper } from '@dr-one/utils';
import { useTranslation } from 'react-i18next';

/* Prop definition */
type Props = {
  campaignHeader: {
    name: string,
    objective: string
  };
  campaignDetail: any;
  campaignStatistics: any;
};

const CampaignDetailHeaderComponent: React.FunctionComponent<
  Props & Record<string, any>
> = ({ campaignHeader, campaignDetail, campaignStatistics, ...rest }) => {
  const { t } = useTranslation();

  const props = {
    parent: { className: "cdHeader" },

    title: { className: "title" },

    nameTitle: { component: "h2" as ElementType },

    nameContent: { component: "span" as ElementType },

    objectiveTitle: {
      component: "h3" as ElementType,
    },

    objectiveContent: { component: "span" as ElementType },

    export: { className: "export" },

    icon: { src: icon_download, alt: "Export Campaign Info" },
  };

  const exportCSV = () => {
    const exportArray: any = [{
      'Start Date': campaignDetail[0]?.value,
      'End Date': campaignDetail[1]?.value,
      'Report Date': helper.formatDate(new Date()),
      'Audience': campaignDetail[6]?.value,
      'Targeted': campaignStatistics['campaignStatistics'][0]?.value,
      'Reached': campaignStatistics['campaignStatistics'][1]?.value,
      'Impressions': campaignStatistics['campaignStatistics'][2]?.value,
      'Clicks': campaignStatistics['campaignStatistics'][3]?.value
    }];

    if (window.location.pathname.indexOf('PUSH_INAPP') > -1) {
      delete exportArray[0]['Impressions'];
      delete exportArray[0]['Clicks'];
      exportArray[0]['Push Impressions'] = campaignStatistics['campaignStatistics'][2]?.value?.['push'];
      exportArray[0]['In App Impressions'] = campaignStatistics['campaignStatistics'][2]?.value?.['inapp'];
      exportArray[0]['Push Clicks'] = campaignStatistics['campaignStatistics'][3]?.value?.['push'];
      exportArray[0]['In App Clicks'] = campaignStatistics['campaignStatistics'][3]?.value?.['inapp'];
    }

    if (campaignHeader.objective === 'Survey') {
      exportArray[0][t('CAMPAIGN_ANALYTICS_SURVEY_VIEWED_LABEL')] = campaignStatistics['surveyStatistics'][0]?.value;
      exportArray[0][t('CAMPAIGN_ANALYTICS_SURVEY_SUBMITTED_LABEL')] = campaignStatistics['surveyStatistics'][1]?.value;
      exportArray[0][t('CAMPAIGN_ANALYTICS_SURVEY_SUBMISSION_RATE_LABEL')] = campaignStatistics['surveyStatistics'][2]?.value;
      exportArray[0][t('CAMPAIGN_ANALYTICS_SURVEY_REJECTED_LABEL')] = campaignStatistics['surveyStatistics'][3]?.value;
      exportArray[0][t('CAMPAIGN_ANALYTICS_SURVEY_NO_RESPONSE_LABEL')] = campaignStatistics['surveyStatistics'][4]?.value;
    }
    
    exportArray.map(label => {
      switch (label) {
        case 'Start Date':
          label = t('START_DATE');
          break;
        case 'End Date':
          label = t('END_DATE');
          break;
        case 'Report Date':
          label = t('CAMPAIGN_ANALYTICS_REPORT_DATE');
          break;
        case 'Audience':
          label = t('AUDIENCE')
          break;
        case 'Targeted':
          label = t('CAMPAIGN_ANALYTICS_TARGETED_LABEL');
          break;
        case 'Reached':
          label = t('CAMPAIGN_ANALYTICS_REACHED_LABEL');
          break;
        case 'Impressions':
          label = t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_IMPRESSIONS');
          break;
        case 'Clicks':
          label = t('PERFORMANCE_TYPE_CLICKS');
          break;
        case 'Push Impressions':
          label = t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_PUSH_IMPRESSIONS');
          break;
        case 'In App Impressions':
          label = t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_IN_APP_IMPRESSIONS');
          break;
        case 'Push Clicks':
          label = t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_PUSH_CLICKS');
          break;
        case 'In App Clicks':
          label = t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_IN_APP_CLICKS');
          break;
      }
      return label;
    })

    const modifiedArray = [Object.keys(exportArray[0])].concat(exportArray);
    const csvElement = document.createElement('a');
    csvElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(modifiedArray.map(it => {
      return Object.values(it).map(value => {
        return typeof value === 'string' ? JSON.stringify(value) : value
      }).toString()
    }).join('\n'));

    csvElement.target = '_blank';
    csvElement.download = `${t('CAMPAIGN_ANALYTICS_CSV_FILE_NAME_PREFIX')} - ${campaignHeader?.name?.replace(/[/\\?%*:|"<>]/g, '-')}_${helper.formatDate(new Date())}.csv`;
    csvElement.click();
    csvElement.remove();
  }

  return (
    <S.Container>
      <div {...props.parent} {...rest}>
        <div {...props.title}>
          <Typography variant="h6" {...props.nameTitle}>
            {t('CAMPAIGN_NAME_LABEL')}:{" "}
            <Typography variant="h5" {...props.nameContent}>
              {campaignHeader.name}
            </Typography>
          </Typography>

          <Typography variant="h6" {...props.objectiveTitle}>
            {t('CAMPAIGN_OBJECTIVE_LABEL')}:{" "}
            <Typography variant="h5" {...props.objectiveContent}>
              {campaignHeader.objective}
            </Typography>
          </Typography>
        </div>

        <Button
          variant="contained"
          endIcon={<Avatar {...props.icon} />}
          {...props.export}
          onClick={() => exportCSV()}
        >
          {t('EXPORT_BUTTON')}
        </Button>
      </div>
    </S.Container>
  );
};

export default React.memo(CampaignDetailHeaderComponent);
