import { Colors } from "@dr-one/utils";
import styled from "styled-components";


export const SelectRadio = styled.div`
width: 155px;
height:100px;
display: flex;
align-items: flex-start;

> section {
  width:119px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  > div {
    width: 100%;
    height: 74px;
    border: 1px solid ${Colors.BUTTON_GRAY};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: ${Colors.BUTTON_GRAY};


  }
  > p {
      color: ${Colors.PRIMARY};
      opacity: 0.5;
      font-size: 14px;
    }
}
.MuiRadio-colorPrimary {
  color: ${Colors.BUTTON_GRAY};
}
`;
