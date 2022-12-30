import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`

  margin-bottom: 12px;
  color: ${Colors.SKYBLUE};
  opacity:0.7;

  > p {
    display: inline;
    font-weight: 400;
    font-size: 17px;
    line-height: 19.92px;

    &:not(:last-child) {
      cursor: pointer;
    }

    &:last-child {
      font-weight:700;
    }
  }
  > span {
    margin: 0 10px;
  }
`;
