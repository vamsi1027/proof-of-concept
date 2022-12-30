import AvaliableDataProgress from "../AvaliableDataProgress/AvaliableDataProgress";
import SelectOptions from "../SelectOptions/SelectOptions";
import Title from "../Title/TitleView";
import * as S from "./AvailableData.styles";
interface IAvailableDataProps {
  percentage: number;
}
const AvailableData = ({ percentage }: IAvailableDataProps) => {
  return (
    <S.Container>
      <S.header>
        <Title title="Available data" />
        <SelectOptions />
      </S.header>
      <S.GraphicContent>
        <AvaliableDataProgress percentage={percentage} />
      </S.GraphicContent>
    </S.Container>
  );
};
export default AvailableData;
