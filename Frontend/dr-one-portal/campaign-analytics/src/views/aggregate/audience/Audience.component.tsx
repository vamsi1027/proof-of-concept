import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";
import { ClusteredColumnChart } from "../../../components/Charts";
import { CreateDummyData } from "../../../components/Charts/Column/Clustered/utilsClustered";
import { classNames } from "../../../utils";
import { icon_audience } from "../../../assets";
import { GraphCardLayout, RowLayout } from "../../../Layouts";

const useStyles = makeStyles({
  boxContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "600px",
  },
});

/* Prop definition */
type Props = {
  className?: string;
};

const AudienceComponent: React.FunctionComponent<Props & Record<string, any>> =
  ({ className, ...rest }) => {
    const SERIES = ["Users Reached", "Impressions"];
    const [dummyData, setDummyData] = useState<any[]>(
      CreateDummyData(SERIES, "Audience")
    );
    const [actionActive, setActionActive] = useState<string>("Push");

    const onChangeAction = (val: string) => {
      setActionActive(val);
      setDummyData(CreateDummyData(SERIES, "Audience"));
    };

    const classes = useStyles();

    const props = {
      parent: {
        columns: 1,
        className: classNames("audience", className),
        style: {
          minHeight: "25rem",
        },
      },

      graph: {
        avatar: icon_audience,
        raised: true,
        title: "Audience",
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
        {/* if you need more sections in audience add components as descending of /audience path */}
        <GraphCardLayout
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
          {...props.graph}
        >
          <ClusteredColumnChart {...props.chartConfig} />
        </GraphCardLayout>
      </RowLayout>
    );
  };

export default React.memo(AudienceComponent);
