import CampaignDetail from "./CampaignDetail/CampaignDetail.component";
import React from "react";
import { Skeleton } from "@material-ui/lab";
import * as S from "./CampaignAbout.style";

const CampaignAboutComponent: React.FunctionComponent = () => {
  const props = {
    parent: { className: "campaignAboutSkeleton" },
  };

  return (
    <S.Container>
      <div {...props.parent}>
        <Skeleton variant="rect" animation="wave" className="img" />
        <CampaignDetail />
      </div>
    </S.Container>
  );
};

export default React.memo(CampaignAboutComponent);
