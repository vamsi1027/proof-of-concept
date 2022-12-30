import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { icon_audience } from "../../../../assets";
import { GraphCardLayout } from "../../../../Layouts";

// charts
import { ClusteredColumnChart } from "../../../../components/Charts";
import { CreateDummyData } from "../../../../components/Charts/Column/Clustered/utilsClustered";

const useStyles = makeStyles({
  boxContainer: {
    display: "flex",
    flexDirection: "column",
  },
});

const AudienceComponent: React.FunctionComponent = () => {
  const SERIES = ["Users Reached", "Impressions"];
  const [dummyData] = useState<any[]>(CreateDummyData(SERIES, "Audience"));
  const classes = useStyles();

  const props = {
    parent: {
      title: "Audience",
      avatar: icon_audience,
      raised: true,
      className: classes.boxContainer,
    },
    chartConfig: {
      data: dummyData,
      series: SERIES,
      usingCampaignTooltip: true,
    },
  };

  return (
    <GraphCardLayout {...props.parent}>
      <ClusteredColumnChart {...props.chartConfig} />
    </GraphCardLayout>
  );
};

export default React.memo(AudienceComponent);
