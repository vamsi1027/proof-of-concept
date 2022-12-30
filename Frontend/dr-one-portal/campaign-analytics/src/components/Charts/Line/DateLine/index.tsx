import React, { useEffect, useRef, useState } from "react";

// types
import { BaseChartType } from "../../Utils/chartsTypes";
import { CreateRandomIdChart } from "../../Utils";

// utils for config chart
import { MakeChartConfig, CreateDummyData } from "./utilsDateLine";

type Props = BaseChartType & {
  data?: any[];
  listSeriesVisible?: string[];
};

const DateLine: React.FC<Props> = ({
  id,
  data,
  listSeriesVisible,
  usingDummyData,
  seriesConfig,
}) => {
  const chartRef: any = useRef(null);
  const [idChart] = useState<string>(id || CreateRandomIdChart("dateline"));

  useEffect(() => {
    chartRef.current && chartRef.current.dispose();
    chartRef.current = MakeChartConfig(idChart, seriesConfig);
    chartRef.current.data = usingDummyData
      ? CreateDummyData(seriesConfig)
      : data;
    return () => {
      chartRef.current && chartRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    /*if(chartRef.current) {
			chartRef.current.data = data
		}*/
  }, [data]);

  return (
    <div
      id={idChart}
      style={{
        width: "100%",
        height: "100%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    />
  );
};

export default DateLine;
