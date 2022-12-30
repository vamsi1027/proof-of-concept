import "./styles.css";
import CampaignRelated from "./CampaignRelated";
import ControlPanel from "./ControlPanel";
import React from "react";
import SkeletonLoader from "./SkeletonLoader";
import UserRelated from "./UserRelated";
import { RowLayout } from "../../Layouts";
import { useQuery } from "react-query";

const PerformanceReportView: React.FunctionComponent = () => {
  const { isLoading } = useQuery("aggregate", () => {
    return new Promise((resolve) => setTimeout(resolve.bind(null), 5000));
  });

  const props = {
    parent: { className: "PerformanceReport" },

    wrapper: {
      autoFlow: true,
      style: {
        height: "25rem",
        gap: "4rem",
      },
    },
  };

  if (isLoading) return <SkeletonLoader />;

  return (
    <main {...props.parent}>
      <ControlPanel />

      <RowLayout {...props.wrapper}>
        <UserRelated />

        <CampaignRelated />
      </RowLayout>
    </main>
  );
};

export default React.memo(PerformanceReportView);
