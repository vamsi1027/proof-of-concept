import { ElementType, FC, memo } from "react";
import { Skeleton } from "@material-ui/lab";
import { Typography } from "@material-ui/core";
import * as S from "./CampaignDetailDescription.style";

/* Prop definition */
type Props = {
  title: string;
  isLast?: boolean;
};

const CampaignDetailDescriptionComponent: FC<Props & Record<string, any>> = ({
  title,
  isLast = false,
  ...rest
}) => {
  const props = {
    parent: { className: "cdDescriptionSkeleton" },

    content: {
      className: "content",
    },

    title: {
      component: "h4" as ElementType,
    },

    value: {
      component: "span" as ElementType,
    },

    divider: { className: "cdDivider" },
  };

  return (
    <S.Container className="cd-item">
      <div {...props.parent} {...rest}>
        <div {...props.content}>
          <Typography variant="subtitle2" {...props.title}>
            {title}:
          </Typography>

          <Skeleton
            animation="wave"
            style={{
              height: "1.5rem",
            }}
          />
        </div>

        {!isLast && <div {...props.divider}></div>}
      </div>
    </S.Container>
  );
};

export default memo(CampaignDetailDescriptionComponent);
