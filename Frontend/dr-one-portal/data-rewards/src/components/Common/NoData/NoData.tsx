import React from "react";
import * as S from "./NoData.styles";
interface NoDataProps {
  icon?: React.ReactNode | string;
  text?: React.ReactNode | string;
  description?: React.ReactNode | string;
}
function NoData({ icon, text, description }: NoDataProps) {
  return (
    <S.Container>
      <em>{icon}</em>
      <p>{text}</p>
      <label>{description}</label>
    </S.Container>
  );
}

export default NoData;
