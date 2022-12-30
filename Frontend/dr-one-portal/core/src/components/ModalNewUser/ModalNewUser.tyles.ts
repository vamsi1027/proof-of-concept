import { Colors } from '@dr-one/utils';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100vh;
  height: 100vh;
  color: ${Colors.HEADERCOLOR};
`;

export const Content = styled.div`
  width: 600px;
  height: 400px;
  background-color: ${Colors.WHITE};
  box-shadow: 0px 9px 16px rgba(46, 46, 46, 0.18),
    0px 2px 2px rgba(92, 92, 92, 0.32);
  border-radius: 6px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

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
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    color: ${Colors.HEADERCOLOR};

    > div{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100px;
      color: rgba(119, 117, 127, 0,3);
      > .inputEmail {
        width: 95%;
        margin: 20px auto;
        ::placeholder{
        color: rgba(119, 117, 127, 0,3);
        font-weight: 400;
        font-size: 15px;
        line-height: 17.58px;
      }
      }
      > p{
        margin-top: -15px;
        font-weight: bold;
        color: ${Colors.ERROR}

      }
    }

    > section {
      width: 100%;
      height: 40%;
      padding: 20px;

      margin-bottom: 15px;
      > p {
        margin-top: -15px;
        margin-bottom: 15px;
        font-size: 14px;
        line-height: 24px;
        font-weight: 700;
      }
    }

    > fieldset {
      display: flex;
      align-items: center;
      margin-left: 20px;
      margin-bottom: 15px;
      font-size: 14px;
      line-height: 24px;
      font-weight: 500;
      border: none;
      > .roles-checkbox{
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
      > label {
        margin-left: 5px;
      }

      >.MFA-checkbox{
        width: 18px;
        height: 18px;
        cursor: pointer;

      }
      > .MFA-checkbox ~ label{
        font-weight: bold;
      }
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

export const CheckRoles = styled.div`
  height: 90%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  > fieldset {
    flex-grow: 1;
    font-size: 14px;
    line-height: 24px;
    font-weight: 400;
    border: none;

    > label {
      margin-left: 5px;
    }
  }
`;

export const ButtonSave = styled.button`
  width: 130px;
  height: 35px;
  background-color: transparent;
  color: ${Colors.PRIMARY};
  border: 1px solid;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;

  :disabled{
    cursor: not-allowed;
  }
  .MuiSvgIcon-fontSizeSmall {
    font-size: 16px;
    margin-left: 5px;
  }
`;
