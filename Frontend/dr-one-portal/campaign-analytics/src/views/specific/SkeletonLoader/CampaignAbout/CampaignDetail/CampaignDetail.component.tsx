import CampaignDetailDescription from "./CampaignDetailDescription/CampaignDetailDescription.component";
import CampaignDetailHeader from "./CampaignDetailHeader/CampaignDetailHeader.component";
import CampaignDetailStatistics from "./CampaignDetailStatistics/CampaignDetailStatistics.component";
import { FC, memo, useState } from "react";
import { RowLayout } from "../../../../../Layouts";
import campaignService from "../../../../../services/campaigns.service";
import { useTranslation } from 'react-i18next';
import * as S from "./CampaignDetail.style";

const CampaignDetailComponent: FC = () => {
  const { t } = useTranslation();
  const { getCampaign } = campaignService();

  let campaignDetailsDescription = getCampaign()?.description;
  campaignDetailsDescription = campaignDetailsDescription.map((campaign) => {
    switch (campaign?.title) {
      case 'Start date':
        campaign.title = t('START_DATE');
        break;
      case 'End date':
        campaign.title = t('END_DATE');
        break;
      case 'Status':
        campaign.title = t('STATUS');
        break;
      case 'Agency':
        campaign.title = t('AGENCY_LABEL')
        break;
      case 'Advertiser':
        campaign.title = t('ADVERTISER_LABEL')
        break;
      case 'Format':
        campaign.title = t('CAMPAIGN_FORMAT_LABEL')
        break;
      case 'Audience':
        campaign.title = t('AUDIENCE')
        break;
      case 'Performance Metrics':
        campaign.title = t('SETTINGS_PERFORMANCE_SECTION_HEADING')
        break;
    }
    return campaign;
  });
  const [campaignDetail] = useState(getCampaign());

  const props = {
    parent: {
      className: "cdContainerSkeleton",
    },

    layout: { autoFlow: true },

    description: (des: any, index: number) => ({
      key: `cdd_${index}`,
      title: des.title,
      isLast: index === campaignDetail.description.length - 1,
    }),
  };

  return (
    <S.Container>
      <>
        <div {...props.parent}>
          <CampaignDetailHeader />
          {/* <RowLayout {...props.layout}> */}
          <div className="cd-data-sec">
          {campaignDetail?.description?.map((des, index) => (
            <CampaignDetailDescription {...props.description(des, index)} />
          ))}
          </div>
          {/* </RowLayout> */}
        </div>

        <CampaignDetailStatistics />
      </>
    </S.Container>

  );
};

export default memo(CampaignDetailComponent);
