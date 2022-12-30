import { Colors } from '@dr-one/utils';
import styled from 'styled-components';

export const Container = styled.div`
  // width: 100%;
  // height: 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: flex-start;
  // justify-content: flex-start;
  padding: 17px 26px 34px 26px;
  background-color: ${Colors.WHITE};
  border-radius: 6px;
  box-shadow: 0px 9px 16px rgba(159, 162, 191, 0.18),
    0px 2px 2px rgba(159, 162, 191, 0.32);
`;

export const Logo = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 15px;

  > article {
    margin-left: 10px;

    > p {
      font-weight: bold;
      font-size: 16px;
      line-height: 18px;
    }

    > small {
      font-weight: 300;
      font-size: 14;
      line-height: 16px;
      opacity: 0.5;
    }
  }
`;



