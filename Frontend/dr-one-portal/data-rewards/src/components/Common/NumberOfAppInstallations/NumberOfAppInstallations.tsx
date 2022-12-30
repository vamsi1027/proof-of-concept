import { Colors } from "@dr-one/utils";
import { Divider } from "@material-ui/core";
import { barColor } from "../../../../../utils/src/styles/colors";
import GraphicTwoLines from "../GraphicTwoLines/GraphicTwoLines";
import SelectOptions from "../SelectOptions/SelectOptions";
import Title from "../Title/TitleView";
import * as S from "./NumberOfAppInstallations.styles";
interface INumberOfAppInstallationsProps {
  data: {
    name: string;
    pv: number;
    uv: number;
  }[];
}
const NumberOfAppInstallations = ({ data }: INumberOfAppInstallationsProps) => {
  const colors = {
    dark: barColor[11],
    light: Colors.BTNPRIMARY,
  };
  return (
    <S.Container>
      <S.Header>
        <Title title="Number of app instalations" />
        <SelectOptions />
      </S.Header>
      <Divider />
      <S.GraphicContent colors={colors}>
        <div>
          <span>Open the app</span>
          <span className="light">Install the app</span>
        </div>
        <GraphicTwoLines data={data} colors={colors} />
      </S.GraphicContent>
    </S.Container>
  );
};

export default NumberOfAppInstallations;
