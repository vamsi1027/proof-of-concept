import "./styles.css";
import { FC, memo } from "react";
import { RowLayout } from "../../../Layouts";
import { Skeleton } from "@material-ui/lab";
import GraphCardSkeleton from "../../../Layouts/GraphCardSkeleton/GraphCardSkeleton.component";
import {
  FunnelSkeleton,
  ClusteredSkeleton,
  WaterfallSkeleton,
  HeatmapSkeleton,
  StackedSkeleton
} from "../../../components/Charts";
import { TableMetricSkeleton } from "../../../components/Tables";

import campaignService from "../../../services/campaigns.service";

const SkeletonLoader: FC = () => {
  const { clickables, funnelPerMonth } = campaignService();

  return (
    <div className="aggregate-skeleton">
      <div className="header">
        <div className="title">
          <Skeleton animation="wave" className="nav" />

          <Skeleton animation="wave" className="h1" />
        </div>

        <div className="actions">
          <Skeleton animation="wave" variant="rect" className="action" />

          <Skeleton animation="wave" variant="rect" className="action" />
        </div>
      </div>

      <RowLayout className="summary" columns={5}>
        <Skeleton animation="wave" variant="rect" className="summary-item" />
        <Skeleton animation="wave" variant="rect" className="summary-item" />
        <Skeleton animation="wave" variant="rect" className="summary-item" />
        <Skeleton animation="wave" variant="rect" className="summary-item" />
      </RowLayout>

      <RowLayout className="wrapper" columns={2}>
        <GraphCardSkeleton raised>
          <FunnelSkeleton />
        </GraphCardSkeleton>

        <GraphCardSkeleton raised>
          <FunnelSkeleton />
        </GraphCardSkeleton>
      </RowLayout>

      <GraphCardSkeleton
        raised
        className="wrapper"
        style={{
          height: "69rem",
        }}
      >
        <WaterfallSkeleton />
        <TableMetricSkeleton />
      </GraphCardSkeleton>

      <RowLayout
        className="wrapper"
        columns={2}
        style={{
          height: "40rem",
        }}
      >
        <GraphCardSkeleton raised>
          <Skeleton animation="wave" variant="rect" className="action" />

          <HeatmapSkeleton data={clickables[0]?.value || []} />
        </GraphCardSkeleton>

        <GraphCardSkeleton raised>
          <StackedSkeleton data={funnelPerMonth} />
        </GraphCardSkeleton>
      </RowLayout>

      <GraphCardSkeleton
        raised
        className="wrapper"
        style={{
          height: "37.5rem",
        }}
      >
        <ClusteredSkeleton />
      </GraphCardSkeleton>

      <GraphCardSkeleton
        raised
        className="wrapper"
        style={{
          height: "37.5rem",
        }}
      >
        <ClusteredSkeleton />
      </GraphCardSkeleton>

      <GraphCardSkeleton raised className="wrapper" />
    </div>
  );
};

export default memo(SkeletonLoader);
