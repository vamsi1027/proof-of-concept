import React from "react";
import { GraphCardLayout, RowLayout } from "../../../../Layouts";
import { classNames } from "../../../../utils";

import { WaterFallChart } from "../../../../components/Charts";

import usePushInAppFunnel from "./usePushInAppFunnel";
import { useTranslation } from 'react-i18next';

/* Prop definition */
type Props = {
  className?: string;
};

const PushInAppConversionFunnelComponent: React.FunctionComponent<Props & Record<string, any>> =
  ({ className, ...rest }) => {
    const { data, isLoading, error } = usePushInAppFunnel();
    const { t } = useTranslation();

    const props = {
      parent: {
        columns: 1,
        className: classNames("geography", className),
        style: {
          height: "auto"
        },
      },
      graph: { title: t("CAMPAIGN_ANALYTICS_PUSH_IN_APP_CONVERSION_HEADER"), raised: true },
      chart: {
        data: data,
        isLoading: isLoading,
        isExportable: true
      }
    };

    return (
      <RowLayout {...props.parent} {...rest}>
        <GraphCardLayout {...props.graph} {...props.chart}>
          <WaterFallChart {...props.chart} />
        </GraphCardLayout>
      </RowLayout>
    );
  };

export default React.memo(PushInAppConversionFunnelComponent);
