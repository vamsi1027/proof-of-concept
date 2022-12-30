import React from "react";
import { classNames } from "../../../../utils";

// components
import { GraphCardLayout } from "../../../../Layouts";

// chart
import { FunnelChart } from "../../../../components/Charts";

import useInAppFunnel from "./useInAppFunnel";
import { useTranslation } from 'react-i18next';

/* Prop definition */
type Props = {
  className?: string;
};

const InAppConversionFunnelComponent: React.FunctionComponent<
  Props & Record<string, any>
> = ({ className, ...rest }) => {
  const { data, isLoading, error } = useInAppFunnel();
  const { t } = useTranslation();

  const props = {
    parent: {
      className: classNames("in-app-cf", className),
      style: {
        minHeight: "20rem",
      },
      title: t("CAMPAIGN_ANALYTICS_IN_APP_CONVERSION_HEADER"),
      raised: true,
      data
    },
    chart: {
      isLoading: isLoading,
      data: data,
      isExportable: true
    }
  };

  return (
    <GraphCardLayout {...props.parent} {...props.chart} {...rest}>
      <FunnelChart
        {...props.chart}
      />
    </GraphCardLayout>
  );
};

export default React.memo(InAppConversionFunnelComponent);
