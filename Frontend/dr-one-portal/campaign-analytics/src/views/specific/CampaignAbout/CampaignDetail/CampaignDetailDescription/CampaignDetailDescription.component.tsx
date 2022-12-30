import React, { ElementType } from "react";
import { Typography } from "@material-ui/core";
import * as S from "./CampaignDetailDescription.style";

type Props = {
  title: string;
  value: string | {};
  isLast?: boolean;
  isBadge?: boolean;
};

const CampaignDetailDescriptionComponent: React.FunctionComponent<
  Props & Record<string, any>
> = ({ title, value, isLast = false, isBadge = false, ...rest }) => {
  const props = {
    parent: { className: "cdDescription" },

    content: {
      className: "content",
    },

    title: {
      component: "h4" as ElementType,
    },

    value: {
      className: 'value',
      title: value,
      component: "span" as ElementType,
    },

    badge: { className: "myBadge" },

    divider: { className: "cdDivider" },
  };

  return (
    <S.Container className="cd-item">
      <div {...props.parent} {...rest} >
        <div {...props.content}>
          <Typography variant="subtitle2" {...props.title}>
            {title}:
          </Typography>

          {isBadge ? (
            <div {...props.badge}>
              <span>{value}</span>
            </div>
          ) : (
            <Typography variant="caption" {...props.value}>
              {value}
            </Typography>
          )}
        </div>

      </div>
    </S.Container>
  );
};

export default React.memo(CampaignDetailDescriptionComponent);
