import React from "react";
import { classNames } from "../../../../utils";

// components
import { GraphCardLayout } from "../../../../Layouts";

// chart
import { FunnelChart } from "../../../../components/Charts";

import usePushFunnel from "./usePushFunnel";
import { useTranslation } from 'react-i18next';

/* Prop definition */
type Props = {
  className?: string;
};

const PushConversionFunnelComponent: React.FunctionComponent<
  Props & Record<string, any>
> = ({ className, ...rest }) => {
  const { data, isLoading, error } = usePushFunnel();
  const { t } = useTranslation();

  const props = {
    parent: {
      className: classNames("push-cf", className),
      style: {
        minHeight: "20rem",
      },
      title: t("CAMPAIGN_ANALYTICS_PUSH_CONVERSION_HEADER"),
      raised: true,
    },
    chart: {
      isLoading: isLoading,
      data: data,
      inlineData: ["Targeted", "Sent", "Reached", "Impressions", "Clicks"],
      isExportable: true
    }
  };
  return (
    <GraphCardLayout {...props.parent} {...props.chart} {...rest}>
      <FunnelChart {...props.chart} />
    </GraphCardLayout>
  );
};

export default React.memo(PushConversionFunnelComponent);
