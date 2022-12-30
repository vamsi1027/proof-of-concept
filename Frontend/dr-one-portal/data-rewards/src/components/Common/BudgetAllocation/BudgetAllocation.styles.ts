import styled from 'styled-components';
import { barColor } from '../../../../../utils/src/styles/colors';
export const Container = styled.div`
  width: 100%;
  height: 100%;
`;
export const List = styled.ul`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
export const ItemList = styled.li`
  width: 100%;
  height: 30%;
  border-bottom: 1px solid ${barColor[10]};
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > small {
    font-size: 14px;
    opacity: 0.3;
  }
`;
export const IconAndTitle = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  align-items: center;
  > p {
    display: flex;
    align-items: center;
    font-size: 15px;
    line-height: 18px;
    font-weight: bold;
    margin-left: 5px;
  }
`;
