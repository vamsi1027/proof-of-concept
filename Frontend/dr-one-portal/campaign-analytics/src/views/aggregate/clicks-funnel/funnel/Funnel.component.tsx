import React from "react";
import Stacked from "../../../../components/Charts/Column/Stacked";
import { GraphCardLayout } from "../../../../Layouts";
import campaignService from "../../../../services/campaigns.service";

const FunnelComponent: React.FunctionComponent = () => {
  const { funnelPerMonth } = campaignService()

  const props = {
    parent: {
      title: "Funnel per month",
      raised: true,
    },
  };

  return (
    <GraphCardLayout {...props.parent}>
      <Stacked data={funnelPerMonth} />
    </GraphCardLayout>
  );
};

export default React.memo(FunnelComponent);
