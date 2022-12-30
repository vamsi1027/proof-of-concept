import * as S from "./spinner.styles";
export type SpinnerProps = {
  color: string;
};
function Spinner({ color = "blue" }: SpinnerProps) {
  return <S.Container className="spiner-container" color={color}></S.Container>;
}

export default Spinner;