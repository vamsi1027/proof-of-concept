import React from "react";

import * as S from "./TitleView.styles";

interface TitleProps {
  title: string;
  children?: React.ReactNode;
}

function Title({ title, children }: TitleProps) {
  return (
    <S.Container>
      <S.Content>{title}</S.Content>
      {children}
    </S.Container>
  );
}

export default Title;