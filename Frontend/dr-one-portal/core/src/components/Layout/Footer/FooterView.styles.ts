import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.footer`
  &.footer {
    background:${Colors.BGGRAY};
    border-top: 1px solid ${Colors.BORDER};
    position: relative;
    bottom: 0;
    width: 100%;
    min-height: 62px;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 50%;
    transform: translateX(-50%);
    p {
      font-size: 12px;
      padding-left: 15px;
      line-height: 13.92px;
      color: ${Colors.FADEGRAY};
    }
  }
`;
