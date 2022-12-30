import CampaignDetailDescription from "./CampaignDetailDescription/CampaignDetailDescription.component";
import CampaignDetailHeader from "./CampaignDetailHeader/CampaignDetailHeader.component";
import CampaignDetailStatistics from "./CampaignDetailStatistics/CampaignDetailStatistics.component";
import useCampaignDetail from "./useCampaignDetail";
import { FC, memo } from "react";

const CampaignDetailComponent: FC = () => {
  const { CAMPAIGN_DESCRIPTION, props } = useCampaignDetail();

  return (
    <>
      <div {...props.parent}>
        <CampaignDetailHeader campaignHeader={props.header} campaignDetail={CAMPAIGN_DESCRIPTION} campaignStatistics={props.statistics} />
        <div className="cd-data-sec">
          {CAMPAIGN_DESCRIPTION?.map((des, index) => (
            <CampaignDetailDescription {...props.description(des, index)} />
          ))}
        </div>
      </div>

      {!props.isMetricsApiFailed && <CampaignDetailStatistics {...props.statistics} />}
    </>
  );
};

export default memo(CampaignDetailComponent);
