import "./styles.css";
import GraphCardSkeleton from "../../../Layouts/GraphCardSkeleton/GraphCardSkeleton.component";
import { Card } from "@material-ui/core";
import { FC, memo } from "react";
import { RowLayout } from "../../../Layouts";
import { Skeleton } from "@material-ui/lab";

const SkeletonLoader: FC = () => {
  return (
    <div className="performance-report-skeleton">
      <Card className="PerformanceReportControlPanel" elevation={2}>
        <Skeleton
          animation="wave"
          variant="rect"
          className="action"
          style={{
            width: "20rem",
          }}
        />

        <RowLayout columns={2}>
          <Skeleton
            animation="wave"
            variant="rect"
            className="action"
            style={{
              margin: "0",
              width: "6rem",
            }}
          />

          <Skeleton
            animation="wave"
            variant="rect"
            className="action"
            style={{
              margin: "0",
              width: "6rem",
            }}
          />
        </RowLayout>
      </Card>

      <RowLayout
        columns={2}
        style={{
          height: "25rem",
          gap: "4rem",
        }}
      >
        <GraphCardSkeleton raised />

        <GraphCardSkeleton raised />
      </RowLayout>
    </div>
  );
};

export default memo(SkeletonLoader);
