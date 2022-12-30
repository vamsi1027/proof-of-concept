import { Colors } from '@dr-one/utils';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 115vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: rgba(50, 50, 50, 0.7);
`;

export const Content = styled.div`
  width: 700px;
  height: 400px;
  background-color: ${Colors.WHITE};
  box-shadow: 0px 9px 16px rgba(46, 46, 46, 0.18),
    0px 2px 2px rgba(92, 92, 92, 0.32);
  border-radius: 6px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  > header {
    width: 100%;
    height: 70px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${Colors.BORDER};
    color: ${Colors.FADEGRAY};

    > p {
      width: auto;
      height: 70px;
      font-size: 20px;
      line-height: 24px;
      display: flex;
      align-items: center;
      color: inherit;
      font-weight: 700;
      color: ${Colors.HEADERCOLOR};
      > span {
        color: ${Colors.PRIMARY};
        margin-left: 5px;
        margin-top: -15px;

        .MuiSvgIcon-fontSizeSmall {
          font-size: 16px;
        }
      }
    }
  }

  > main {
    width: 100%;
    height: 60%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    color: ${Colors.HEADERCOLOR};

    > .input {
      width: 45%;
      margin: 20px auto;
    }
    > .email {
      width: 95%;
      margin: 20px auto;
    }
  }
  > footer {
    width: 100%;
    padding: 20px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  }
`;

export const ButtonSave = styled.div`
  width: 130px;
  height: 35px;
  color: ${Colors.PRIMARY};
  border: 1px solid;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;

  .MuiSvgIcon-fontSizeSmall {
    font-size: 16px;
    margin-left: 5px;
  }
`;
