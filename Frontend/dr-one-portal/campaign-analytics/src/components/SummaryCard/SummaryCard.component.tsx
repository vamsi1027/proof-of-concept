import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import React, { ElementType } from "react";
import { Card, Typography } from "@material-ui/core";
import { Variant } from "@material-ui/core/styles/createTypography";
import { classNames } from "../../utils";
import { green, red } from "@material-ui/core/colors";
import * as S from './SummaryCard.style';
import { InAppCard, PushCard } from "./SummaryCard.style";
import { useTranslation } from 'react-i18next';
import { LightTooltip } from "@dr-one/shared-component";

/* Prop definition */
type Props = {
  className?: string;
  title: string;
  subTitle?: string;
  value: any,
  isUp?: boolean;
  isNone?: boolean;
};

/**
 * Custom component to print a summary card
 * @param title - Summary card title
 * @param subTitle - Summary card sub-title
 * @param value - summary card focused text
 * @param isUp - to print green arrow up, by default red arrow down
 * @param isNone - to hide the arrow
 * @returns Summary Card Component
 */
const SummaryCardComponent: React.FunctionComponent<
  Props & Record<string, any>
> = ({
  className,
  title,
  subTitle,
  value,
  isUp = false,
  isNone = false,
  raised = false,
  tooltip = '',
  ...rest
}) => {
    const { t } = useTranslation();
    const props = {
      /* card parent */
      parent: {
        className: classNames("summaryCard", className),
        elevation: raised ? 2 : 0
      },

      /* card title */
      title: { variant: "h6" as Variant, className: "title" },

      /* card sub-title */
      subTitle: {
        variant: "subtitle2" as Variant,
        style: {
          fontSize: "small",
        },
      },

      /* card content */
      content: {
        className: "content",
      },

      /* card content value */
      contentValue: {
        variant: "h4" as Variant,
        component: "h3" as ElementType,
        className: "value",
      },

      contentValue2: {
        variant: "h4" as Variant,
        component: "h3" as ElementType,
        className: "value2",
      },

      badgeTemplate: {
        className: "badge-template",
      },

      /* Value Up */
      up: {
        style: { color: green[600] },
      },

      /* Value Down */
      down: {
        style: { color: red[600] },
      },
    };

    return (
      <Card {...props.parent} {...rest}>
        <Typography color="textSecondary" {...props.title}>
          <p>
            {title}
            {(title === t('CAMPAIGN_ANALYTICS_TARGETED_LABEL') || title === t('CAMPAIGN_ANALYTICS_REACHED_LABEL')
              || title === t('PERFORMANCE_TYPE_IMPRESSIONS') || title === t('CAMPAIGN_ANALYTICS_SURVEY_SUBMISSION_RATE_LABEL')
              || title === t('CAMPAIGN_ANALYTICS_SURVEY_REJECTED_LABEL') || title === t('CAMPAIGN_ANALYTICS_SURVEY_NO_RESPONSE_LABEL')
              || title === t('CAMPAIGN_ANALYTICS_CLICKS_LABEL') || title === t('CAMPAIGN_ANALYTICS_TYPE_VIDEO_VIEWED')) && <LightTooltip
                title={<label>{tooltip}
                  {/* <a target="_blank" rel="noopener noreferrer" href="https://docs.digitalreef.com/docs/campaign-templates"> {t('KNOW_MORE')}</a>. */}
                </label>}
              />}
          </p>

        </Typography>

        {
          value?.isPushInApp
            ? (
              <div {...props.content}>
                <S.PushCard className="content-badge">
                  <Typography {...props.contentValue}>
                    {value?.push}
                  </Typography>

                  <Typography {...props.badgeTemplate}>
                    {t('CAMPAIGN_ANALYTICS_CAMPAIGN_TYPE_PUSH')}
                  </Typography>
                </S.PushCard>

                <S.InAppCard className="content-badge">
                  <Typography {...props.contentValue}>
                    {value?.inapp}
                  </Typography>

                  <Typography {...props.badgeTemplate}>
                    {t('CAMPAIGN_ANALYTICS_CAMPAIGN_TYPE_IN_APP')}
                  </Typography>
                </S.InAppCard>
              </div>
            ) : (
              <div {...props.content}>
                <Typography {...props.contentValue}>{value}</Typography>

                {/* {!isNone &&
                  (isUp ? (
                    <ArrowUpwardIcon {...props.up} />
                  ) : (
                    <ArrowDownwardIcon {...props.down} />
                  ))} */}
              </div>
            )
        }

        {
          subTitle !== undefined && (
            <Typography color="textSecondary" {...props.subTitle}>
              {subTitle}
            </Typography>
          )
        }

      </Card >
    );
  };

export default React.memo(SummaryCardComponent);
