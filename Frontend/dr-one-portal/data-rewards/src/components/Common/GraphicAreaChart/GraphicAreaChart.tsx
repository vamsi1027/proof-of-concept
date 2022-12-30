import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import * as S from "./GraphicAreaChart.styles";
interface IGraphicAreaChartProps {
  data: {
    date: string;
    percent: number;
  }[];
  color: string;
}
const GraphicAreaChart = ({ data, color }: IGraphicAreaChartProps) => {
  return (
    <S.Container>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} className="line">
          <defs>
            <linearGradient
              id={`colorPercent-${color}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="percent"
            stroke={color}
            fillOpacity={1}
            fill={`url(#colorPercent-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </S.Container>
  );
};

export default GraphicAreaChart;
