import CampaignAbout from "./CampaignAbout/CampaignAbout.component";
import { FC, memo } from "react";
import { RowLayout } from "../../../Layouts";
import { Skeleton } from "@material-ui/lab";
import campaignService from "../../../services/campaigns.service";
import * as S from "./SkeletonLoader.styles";
import GraphCardSkeleton from "../../../Layouts/GraphCardSkeleton/GraphCardSkeleton.component";
import { HeatmapSkeleton, FunnelSkeleton, ClusteredSkeleton, HorizontalColumnSkeleton } from '../../../components/Charts'

const SkeletonLoader: FC = () => {
  const { clickables } = campaignService();

  return (
    <S.Container>
      <div className="specific-skeleton">
        <div className="title">
          <Skeleton animation="wave" className="nav" />
        </div>

        <CampaignAbout />

        <RowLayout className="wrapper" columns={2}>
          <GraphCardSkeleton raised />

          <GraphCardSkeleton raised >
            <FunnelSkeleton />
          </GraphCardSkeleton>
        </RowLayout>

        <RowLayout className="wrapper-little" columns={2}>
          <GraphCardSkeleton raised >
            <HorizontalColumnSkeleton />
          </GraphCardSkeleton>

          <GraphCardSkeleton raised >
            <HorizontalColumnSkeleton />
          </GraphCardSkeleton>
        </RowLayout>

        <RowLayout className="wrapper" columns={2}>
          <GraphCardSkeleton raised>
            <Skeleton animation="wave" variant="rect" className="action" />

            <HeatmapSkeleton data={clickables[0]?.value || []} />
          </GraphCardSkeleton>

          <GraphCardSkeleton raised >
            <ClusteredSkeleton />
          </GraphCardSkeleton>
        </RowLayout>

        <GraphCardSkeleton
          raised
          className="wrapper"
        // style={{
        //   height: "40rem",
        // }}
        />

        <GraphCardSkeleton
          raised
          className="wrapper"
        // style={{
        //   height: "40rem",
        // }}
        />
      </div>
    </S.Container>

  );
};

export default memo(SkeletonLoader);
