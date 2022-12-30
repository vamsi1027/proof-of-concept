import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
  .title-button {
    border-radius: 5px;
  }
`;

export const TabFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const SearchInput = styled.div`
  margin-left: 20px;
  .MuiSvgIcon-root {
    color: ${Colors.DEFAULT};
  }
  .MuiInputBase-root {
    width: 250px;
    height: 32px;
    margin: 10px 0;
  }
  .MuiFormControl-root .MuiInputBase-input {
    padding-left: 0px;
  }
`;
