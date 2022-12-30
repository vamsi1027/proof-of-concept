import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
  &.data-rewards-modal-settings-inputs {
  }
`;
export const Content = styled.div`
  .number-section {
    width: 40px;
    padding: 10px;
    font-weight: 700;
    font-size: 1.3rem;
    text-align: center;
    margin-right: 20px;
    border-radius: 50%;
    height: fit-content;
    background-color: ${Colors.HEADERCOLOR}33;
  }
  .data-rewards-modal-settings-title {
    margin-bottom: 20px;
    margin-top: 10px;
  }
  .data-rewards-modal-settings-descriptions {
    font-weight: 300;
  }
  .data-rewards-modal-settings-inputs {
    left: -17px;
    position: relative;
    .MuiInputBase-root {
      width: 60px;
      margin: 10px;
      .MuiInputBase-input {
        text-align: center;
        border-radius: 6px;
        background-color: ${Colors.BACKGROUND};
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
    .MuiButton-label {
      border-radius: 6px;
      color: ${Colors.PRIMARY};
      padding: 5px 0 !important;
      background-color: ${Colors.BUTTON_BTN};
    }
  }
  display: flex;
  margin-bottom: 20px;
`;
