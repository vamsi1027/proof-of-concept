import { Colors } from '@dr-one/utils';
import styled from 'styled-components';

export const Icon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  .filter-active {
    opacity: 1;
  }
  .filterOpacity{
    opacity: 0.4;
  }
`;

export const OptionDropdown = styled.p`
  color: ${Colors.HEADERCOLOR};
  font-weight: 400;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  > input {
    cursor: pointer;
    margin-right: 5px;
  }
  input:checked {
    background-color: blue;
  }
`;
