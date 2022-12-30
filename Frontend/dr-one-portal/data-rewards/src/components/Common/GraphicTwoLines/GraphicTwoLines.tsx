import * as S from "./GraphicTwoLines.styles";
import { LineChart, Line, ResponsiveContainer } from "recharts";
export interface IGraphicTwoLinesProps {
  data: {
    name: string;
    pv: number;
    uv: number;
  }[];
  colors: {
    dark: string;
    light: string;
  };
}
const GraphicTwoLines = ({ data, colors }: IGraphicTwoLinesProps) => {
  return (
    <ResponsiveContainer width="100%" height="120%">
      <LineChart
        width={600}
        height={200}
        data={data}
        margin={{
          top: 10,
        }}
      >
        <Line dataKey="pv" stroke={colors.light} strokeWidth={3} dot={false} />
        <Line dataKey="uv" stroke={colors.dark} strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GraphicTwoLines;
