import React, { useContext, useState } from "react";
import { FunnelChart } from "../../../../components/Charts";
import { DataForFunnelType } from "../../../../components/Charts/Funnel/FunnelChart.component";
import { GraphCardLayout, RowLayout } from "../../../../Layouts";
import { ContextSpecific } from "../../context/context-specific";
import { constructSeriesWithAPI } from "./utils";
import HorizontalColumnsSpecific from "../HorizontalColumnsSpecific/HorizontalColumnsSpecific";
import { useTranslation } from 'react-i18next';
import { Grid } from '@material-ui/core';


const FunnelComponent: React.FunctionComponent = () => {
  const {
    data: { campaignType, campaignmeterics },
    isLoadingMetricsData,
    campaignInfo,
    errorCode
  } = useContext(ContextSpecific);
  const { t } = useTranslation();
  const { id, type } = campaignInfo;

  const [dataFunnel] = useState<DataForFunnelType[]>(
    constructSeriesWithAPI(type, campaignmeterics)
  );

  const getCampaignName = (): string => {
    switch (type.toLowerCase()) {
      case "push":
        return "Push";
      case "inapp":
        return "In App";
      case "push_inapp":
        return "Push with In-App";
      default:
        return "Push";
    }
  };

  const height: string = "395px";
  const maxHeight: string = "500px";
  const props = {
    parent: {
      title: `${getCampaignName()} ${t('CAMPAIGN_ANALYTICS_FUNNEL_HEADER')}`,
      raised: true,
    },
    graph: {
      data: dataFunnel
        .map((funnelLabel) => {
          switch (funnelLabel?.name) {
            case 'Targeted':
              funnelLabel.name = t('CAMPAIGN_ANALYTICS_TARGETED_LABEL');
              break;
            case 'Reached':
              funnelLabel.name = t('CAMPAIGN_ANALYTICS_REACHED_LABEL');
              break;
            case 'Sent':
              funnelLabel.name = t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_SENT');
              break;
            case 'Impressions':
              funnelLabel.name = t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_IMPRESSIONS')
              break;
            case 'Clicks':
              funnelLabel.name = t('CAMPAIGN_ANALYTICS_FUNNEL_LABEL_CLICKS_OVER_TARGETED')
              break;
          }
          return funnelLabel;
        })
      ,
      height,
      isLoading: isLoadingMetricsData,
      errorCode: errorCode,
      campaignInfo,
      isExportable: false
    }
  };
  return (
    // <RowLayout
    //   // style={{
    //   //   margin: "0  0 1rem 0",
    //   //   display: "flex",
    //   //   flexDirection: 'column',
    //   //   justifyContent: 'space-between',
    //   // }}
    // >
    <Grid item xs={12} md={6}>
      <GraphCardLayout {...props.parent} {...props.graph}>
        <FunnelChart {...props.graph} />
      </GraphCardLayout>

      {
        campaignType !== 'PUSH_INAPP' ? <HorizontalColumnsSpecific type={type} /> : <></>
      }
    </Grid>
  );
};

export default React.memo(FunnelComponent);
