import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";

// chart
import { ClusteredColumnChart } from "../../../components/Charts";
import { CreateDummyData } from "../../../components/Charts/Column/Clustered/utilsClustered";
import { classNames } from "../../../utils";
import { icon_star } from "../../../assets";
import { GraphCardLayout, RowLayout } from "../../../Layouts";

const useStyles = makeStyles({
  boxContainer: {
    display: "flex",
    flexDirection: "column",
    height: "600px",
  },
});

/* Prop definition */
type Props = {
  className?: string;
};

const CampaignsPerformanceComponent: React.FunctionComponent<
  Props & Record<string, any>
> = ({ className, ...rest }) => {
  const SERIES = ["Users Reached", "Impressions"];
  const [dummyData, setDummyData] = useState<any[]>(
    CreateDummyData(SERIES, "Campaign")
  );
  const [actionActive, setActionActive] = useState<string>("Push");

  const onChangeAction = (val: string) => {
    setActionActive(val);
    setDummyData(CreateDummyData(SERIES, "Campaign"));
  };

  const classes = useStyles();
  const props = {
    parent: {
      columns: 1,
      className: classNames("campaigns-performance", className),
      style: {
        minHeight: "30rem",
      },
    },
    graph: {
      avatar: icon_star,
      raised: true,
      title: "Campaigns Performance",
      className: classes.boxContainer,
    },
    chartConfig: {
      data: dummyData,
      series: SERIES,
      usingCampaignTooltip: true,
      usingHistory: true,
      urlType: actionActive
    },
  };

  return (
    <RowLayout {...props.parent} {...rest}>
      {/* if you need more sections in campaigns performance add components as descending of /campaigns-performance path */}
      <GraphCardLayout
        {...props.graph}
        actions={
          <>
            <Button
              variant={actionActive === "Push" ? "contained" : "text"}
              color={actionActive === "Push" ? "primary" : "default"}
              onClick={() => onChangeAction("Push")}
            >
              Push
            </Button>

            <Button
              variant={actionActive === "In-App" ? "contained" : "text"}
              color={actionActive === "In-App" ? "primary" : "default"}
              onClick={() => onChangeAction("In-App")}
            >
              In-App
            </Button>

            <Button
              variant={
                actionActive === "Push with In-App" ? "contained" : "text"
              }
              color={
                actionActive === "Push with In-App" ? "primary" : "default"
              }
              onClick={() => onChangeAction("Push with In-App")}
            >
              Push with In-App
            </Button>
          </>
        }
      >
        <ClusteredColumnChart {...props.chartConfig} />
      </GraphCardLayout>
    </RowLayout>
  );
};

export default React.memo(CampaignsPerformanceComponent);
