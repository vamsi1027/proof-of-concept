import React from "react";
import { Colors } from "@dr-one/utils";
import * as S from './ButtonAndOr.styles'


interface IButtonAddOrProps {
  and: () => void;
  or: () => void;
}

const ButtonAndOr = ({ or, and }: IButtonAddOrProps) => {
  return (
    <S.Container>
      <S.Button onClick={and}>+ And</S.Button>
      <S.Button onClick={or}>+ Or</S.Button>
    </S.Container>
  );
};

export default ButtonAndOr;
