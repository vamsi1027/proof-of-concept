import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
  &.signup-wrapper {
    margin-top: 50px;
    margin-bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: calc(100vh - 62px);
    @media (min-width: 1440px) {
      margin-top: 0px;
      margin-bottom: 0px;
    }
    .required-field {
      .MuiInputBase-input {
        border: 1px solid ${Colors.RED};
      }
    }
    #phone {
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      &[type='number'] {
        -moz-appearance: textfield;
      }
    }
    .MuiInputBase-input {
      color: ${Colors.HEADERCOLOR} !important;
      line-height: 24px;
      letter-spacing: 0.09000000357627869px;
    }
    #password,
    #comfirm_password {
      padding-right: 50px;
    }
    .MuiOutlinedInput-root {
      height: 56px;
    }
    .MuiButton-root {
      text-transform: capitalize;
      &:hover {
        background-color: ${Colors.BTNPRIMARY}e6 !important;
      }
    }
    .MuiCheckbox-colorPrimary {
      .MuiIconButton-label {
        .MuiSvgIcon-root {
          fill: ${Colors.WHITE} !important;
          border: 0.1px solid ${Colors.BTNPRIMARY} !important;
          border-radius: 7px;
        }
      }
    }
    .Mui-checked {
      .MuiIconButton-label {
        .MuiSvgIcon-root {
          background: ${Colors.BTNPRIMARY} !important;
        }
      }
    }
    .MuiButtonBase-root {
      height: 38px;
    }
    .center-box {
      width: 545px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .logo {
        margin-bottom: 40px;
      }

      .white-box {
        padding: 40px;
        background: ${Colors.WHITE};
        box-shadow: 0px 9px 16px rgb(159 162 191 / 18%),
          0px 2px 2px rgb(159 162 191 / 32%);
        border-radius: 6px;
        width: 100%;
        display: inline-block;

        h3 {
          font-size: 25px;
          margin-bottom: 8px;
          color: ${Colors.HEADERCOLOR};
          line-height: 29.3px;
        }

        h6 {
          margin-bottom: 33px;
          font-weight: 400;
          color: ${Colors.HEADERCOLOR};
          opacity: 0.5;
          line-height: 18.75px;
        }
        .login-actions {
          margin-top: 33px;
          display: flex;
          width: 100%;
          justify-content: center;
          p {
            font-weight: 700;
            color: ${Colors.HEADERCOLOR};

            span {
              color: ${Colors.BTNPRIMARY};
              font-weight: 700;
              a {
                color: ${Colors.BTNPRIMARY};
                text-decoration: none;
              }
            }
          }
        }
      }
    }
    .half-name-fields {
      display: flex;
      justify-content: space-between;
      .MuiFormControl-root {
        width: 200px;
      }
    }
    .error-view-true {
      top: 28px;
    }
  }
`;
