import React, { useContext, useState } from "react";
import { RowLayout } from "../../../Layouts";
import { SummaryCard } from "../../../components";
import SkeletonSummaryHeader from './SkeletonSummaryHeader';
import { classNames } from "../../../utils";
import campaignService from "../../../services/campaigns.service";

import useSummaryHeader from './useSummaryHeader';

import aggregateContext from '../Context'
import { GlobalContext } from '../../../context/globalState';

/* Prop definition */
type Props = {
  className?: string;
};

const SummaryHeaderComponent: React.FunctionComponent<Props & Record<string, any>> = ({ className, ...rest }) => {
  const STATUS_CAMPAIGN: string = "COMPLETED";
  const { dateRange, organizationId } = useContext(aggregateContext);
  const { data } = useSummaryHeader();
  const { getCampaignsStatistics } = campaignService();
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);

  const props = {
    parent: {
      className: classNames("summary-header", className),
      columns: 3
    },
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
  return (
    <RowLayout {...props.parent} {...rest}>
      {getCampaignsStatistics().map((campaign, index) => {
        return (
          <SummaryCard {...props.card(campaign, index)} raised />
        )
      })}
    </RowLayout>
  );
};

export default React.memo(SummaryHeaderComponent);
