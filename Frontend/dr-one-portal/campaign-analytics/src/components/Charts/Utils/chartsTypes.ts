export type BaseChartType = {
  id?: string | undefined;
  series?: string[];
  seriesConfig?: SeriesConfig[];
  colors?: string[];
  style?: ChartStyle;
  usingDummyData?: Boolean;
  loading?: boolean;
};

export type SeriesConfig = {
  key: string;
  name: string;
};

type ChartStyle = {
  width?: string | number;
  height?: string | number;
};
