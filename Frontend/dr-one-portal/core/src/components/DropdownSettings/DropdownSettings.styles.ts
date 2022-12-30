import { Colors } from '@dr-one/utils';
import styled from 'styled-components';

export const Container = styled.div`
  > img {
    cursor: pointer;
  }
`;

export const OptionDropdown = styled.div`
  width: 100px;
  height: 100%;
  color: ${Colors.HEADERCOLOR};
  font-weight: 400;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
