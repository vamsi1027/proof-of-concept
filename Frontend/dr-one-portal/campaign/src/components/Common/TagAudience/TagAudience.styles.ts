import styled from "styled-components";
import { barColor } from "../../../../../utils/src/styles/colors";


export const Tag = styled.div`
  min-width: 100px;
  line-height: 30px;
  border-radius: 99px;
  font-weight: bold;
  background-color: ${barColor[10]};
  padding: 0 5px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  > img{
    cursor: pointer;
  }

`
