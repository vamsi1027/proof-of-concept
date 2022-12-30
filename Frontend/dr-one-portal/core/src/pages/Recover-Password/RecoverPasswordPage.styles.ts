import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
  &.signup-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 62px);

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
          margin-bottom: 8px;
          color: ${Colors.HEADERCOLOR};
        }

        h6 {
          margin-bottom: 33px;
          font-weight: 400;
          color: ${Colors.HEADERCOLOR};
          opacity: 0.5;
        }

        &.action-messages {
          margin-top: 40px;
          padding-top: 90px;
          h3 {
            margin-top: 35px;
            margin-bottom: 0;
          }
          .success.badge {
            position: relative;
          }
        }
      }

      .login-actions {
        margin-top: 16px;
        display: flex;
        width: 100%;
        justify-content: flex-end;
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
`;
