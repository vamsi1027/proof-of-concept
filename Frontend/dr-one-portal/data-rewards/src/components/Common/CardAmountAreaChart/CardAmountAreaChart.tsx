import { Colors, punctuateNumber } from "@dr-one/utils";
import GraphicAreaChart from "../GraphicAreaChart/GraphicAreaChart";
import Title from "../Title/TitleView";
import * as S from "./CardAmountAreaChart.styles";
interface ICardAmountAreaChartProps {
  title: string;
  amount: number;
  percentage: number;
  color: string;
  time: number;
  gains: number;
  icon: string;
  data: {
    date: string;
    percent: number;
  }[];
}
const CardAmountAreaChart = ({
  title,
  amount,
  percentage,
  color,
  time,
  gains,
  icon,
  data,
}: ICardAmountAreaChartProps) => {
  const success = {
    color: Colors.TAGSUCCESS,
    background: Colors.TAGSUCCESSBACKGROUND,
    symbol: "+$",
  };
  const warning = {
    color: Colors.TAGWARNING,
    background: Colors.TAGWARNINGBACKRGOUND,
    symbol: "-$",
  };
  const status = percentage > 0 ? success : warning;
  const amountFormated = punctuateNumber(amount);
  return (
    <S.Container>
      <S.Logo>
        <img src={icon} alt={title} />
        <Title title={title} />
      </S.Logo>
      <S.Article colorInfos={status} colorTime={Colors.HEADERCOLOR}>
        <div>
          <p className="amount">${amountFormated}</p>
          <span>{percentage}%</span>
        </div>
        <div>
          <span className="gains">{status.symbol + gains}</span>
          <span className="time">last {time}h</span>
        </div>
      </S.Article>
      <S.GraphicContent>
        <GraphicAreaChart color={color} data={data} />
      </S.GraphicContent>
    </S.Container>
  );
};
export default CardAmountAreaChart;
