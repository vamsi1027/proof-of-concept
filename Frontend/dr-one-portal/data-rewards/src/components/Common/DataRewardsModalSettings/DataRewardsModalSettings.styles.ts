import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
  &.data-rewards-modal-settings {
    width: 500px;
    .MuiTypography-root {
      display: flex;
      justify-content: space-between;
      p:first-child {
        font-size: 1.2rem;
        font-weight: 700;
      }
    }
    .pointer {
      color: ${Colors.FADEGRAY};
    }
    hr {
      border-top-color: ${Colors.HEADERCOLOR}2E;
    }
    .data-rewards-modal-settings-actions {
      border-radius: 5px;
      margin-right: 24px;
      margin-bottom: 30px;
      color: ${Colors.PRIMARY};
      border: 1px solid ${Colors.PRIMARY};
      p {
        display: flex;
        margin: 0 20px;
        align-items: center;
      }
    }
  }
`;
