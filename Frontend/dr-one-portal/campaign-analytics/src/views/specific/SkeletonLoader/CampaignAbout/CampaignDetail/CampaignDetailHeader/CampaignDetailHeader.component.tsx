import { CSSProperties } from "@material-ui/styles";
import { ElementType, FC, memo } from "react";
import { Skeleton } from "@material-ui/lab";
import { Typography } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import * as S from "./CampaignDetailHeader.style";

const CampaignDetailHeaderComponent: FC = () => {
  const { t } = useTranslation();

  const props = {
    parent: { className: "cdHeaderSkeleton" },

    title: { className: "title" },

    nameTitle: {
      component: "h2" as ElementType,
      style: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      } as CSSProperties,
    },

    objectiveTitle: {
      component: "h3" as ElementType,
      style: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      } as CSSProperties,
    },
  };

  return (
    <S.Container>
      <div {...props.parent}>
        <div {...props.title}>
          <Typography variant="h6" {...props.nameTitle}>
            {t('CAMPAIGN_NAME_LABEL')}: <Skeleton animation="wave" className="h1" />
          </Typography>

          <Typography variant="h6" {...props.objectiveTitle}>
            {t('CAMPAIGN_OBJECTIVE_LABEL')}: <Skeleton animation="wave" className="h5" />
          </Typography>
        </div>

        <Skeleton animation="wave" variant="rect" className="action" />
      </div>
    </S.Container>
  );
};

export default memo(CampaignDetailHeaderComponent);
