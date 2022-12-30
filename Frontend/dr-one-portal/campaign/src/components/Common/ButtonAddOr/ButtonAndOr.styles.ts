import { Colors } from "@dr-one/utils";
import styled from "styled-components";
import { barColor } from "../../../../../utils/src/styles/colors";

export const Container = styled.div`
width: 100%;
height: 30px;
display: flex;
align-items: center;
justify-content: space-around;
`

export const Button = styled.button`
  width: 50px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background-color: ${barColor[12]};
  border: none;
  color: ${Colors.PRIMARY};
  font-size: 14px;
  font-weight: bold;
`
