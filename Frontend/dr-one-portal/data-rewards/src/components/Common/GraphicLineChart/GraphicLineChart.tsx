import { LineChart, Line, ResponsiveContainer } from "recharts";
export interface IGraphicProps {
  analytics: {
    date: string;
    percent: number;
  }[];
  color: string;
}
const GraphicLineChart = ({ analytics, color }: IGraphicProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={analytics} className="data-rewards-analytics-line-chart">
        <Line
          type="monotone"
          dataKey="percent"
          stroke={color}
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
export default GraphicLineChart;
