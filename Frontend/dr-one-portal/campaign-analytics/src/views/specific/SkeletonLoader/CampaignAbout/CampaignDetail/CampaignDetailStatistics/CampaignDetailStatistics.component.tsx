import { FC, memo } from "react";
import { RowLayout } from "../../../../../../Layouts";
import { Skeleton } from "@material-ui/lab";
import * as S from "./CampaignDetailStatistics.style";

const CampaignDetailStatisticsComponent: FC = () => {
  const props = {
    content: { className: "cdCardSkeleton" },
    layout: { autoFlow: true },
  };

  return (
    <S.Container>
      <div {...props.content}>
        {/* <RowLayout {...props.layout}> */}
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={`skt_${index}`}
              variant="rect"
              animation="wave"
              style={{
                height: "10rem",
              }}
            />
          ))}
        {/* </RowLayout> */}
      </div>
    </S.Container>
  );
};

export default memo(CampaignDetailStatisticsComponent);
