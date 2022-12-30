import { Colors, punctuateNumber } from "@dr-one/utils";
import { barColor } from "../../../../../utils/src/styles/colors";
import GraphicLineChart from "../GraphicLineChart/GraphicLineChart";
import Title from "../Title/TitleView";
import * as S from "./CardAmount.styles";
interface ICardAmountProps {
  title: string;
  amount: number;
  percentage: number;
  time: number;
  icon: string;
  color: string;
  analytics: {
    date: string;
    percent: number;
  }[];
}

const CardAmount = ({
  title,
  amount,
  percentage,
  time,
  icon,
  color,
  analytics,
}: ICardAmountProps) => {
  const success = {
    color: Colors.TAGSUCCESS,
    symbol: "+",
  };
  const warning = {
    color: Colors.TAGWARNING,
    symbol: "-",
  };
  const status = percentage > 0 ? success : warning;
  return (
    <S.Container>
      <S.Header backgroudColorTag={barColor[10]}>
        <span>{time}h</span>
        <S.Logo>
          <img src={icon} alt={title} />
          <Title title={title} />
        </S.Logo>
      </S.Header>
      <S.Article colors={status}>
        <p>${punctuateNumber(amount)}</p>
        <span>{status.symbol + percentage}%</span>
      </S.Article>
      <S.ContentGraphic>
        <GraphicLineChart analytics={analytics} color={color} />
      </S.ContentGraphic>
    </S.Container>
  );
};
export default CardAmount;
