import React from "react";
import { SummaryCard } from "../../../../../components";
import * as S from "./CampaignDetailStatistics.style";
import { useTranslation } from 'react-i18next';

/* Prop definition */
type Props = {
  campaignStatistics: any;
  surveyStatistics: any;
  data: any;
};

const CampaignDetailStatisticsComponent: React.FunctionComponent<Props> = ({
  campaignStatistics,
  surveyStatistics,
  data
}) => {
  const { t } = useTranslation();

  const props = {
    content: { className: "cdCard" },

    layout: { autoFlow: true },

    card: (statistic: any, index: number) => ({
      key: `cdstatistic_${index}`,
      title: statistic?.title,
      subTitle: statistic?.subTitle,
      value: statistic?.value,
      isNone: true,
      raised: true,
      tooltip: statistic?.tooltip
    }),
  };

  let modifiedSurveyStatistics = surveyStatistics;
  modifiedSurveyStatistics = modifiedSurveyStatistics.filter(statistics => {
    return statistics.key !== 'surveyRejected';
  })
  modifiedSurveyStatistics = modifiedSurveyStatistics.filter(statistics => {
    return statistics.key !== 'surveyNoResponse';
  })

  return (
    <S.Container className={data.enableSurvey ? 'survey-widget' : 'default-widget'}>
      <div {...props.content}>
        {campaignStatistics.map((statistic, index) => (
          <SummaryCard {...props.card(statistic, index)} />
        ))}
      </div>
      <h6>{t('CAMPAIGN_ANALYTICS_SURVEY_METRICS_LABEL')} :</h6>
      {data.enableSurvey && <div {...props.content}>
        {modifiedSurveyStatistics.map((surveyStatistic, index) => (
          <SummaryCard {...props.card(surveyStatistic, index)} />
        ))}
      </div>}
    </S.Container>
  );
};

export default React.memo(CampaignDetailStatisticsComponent);
