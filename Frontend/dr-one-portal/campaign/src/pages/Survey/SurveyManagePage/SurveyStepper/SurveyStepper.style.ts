import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Title = styled.h1`
  margin-bottom: 12px;
  color: ${Colors.HEADERCOLOR};
`;

export const StepperContainer = styled.div`
  .MuiStepper-root {
    padding: 0 0 20px;
    background: none;
  }
  .MuiStepConnector-line {
    border-color: ${Colors.HR_COLOR};
  }
  .step-wrapper{
    position:relative;
    width: 97.5%;

    &::after{
        position: absolute;
        content: "";
        width: 100%;
        height: 1px;
        top: 16px;
        background: ${Colors.HR_COLOR};
        left: 0;
        z-index: 1;
    }

    .MuiStepConnector-alternativeLabel{
        top: 16px;
    }

    .MuiStep-completed{
      .MuiStepLabel-iconContainer{
        border-color:${Colors.WHITE};
      }
    }

    .MuiStep-alternativeLabel {
        flex: 1;
        position: relative;
        z-index: 2;
    }
    .MuiStepIcon-text {
        fill: ${Colors.WHITE};
        font-size: 14px;
        font-family: "Roboto", "Helvetica", "Arial", sans-serif;
        font-weight: 700;
    }

    .MuiStepLabel-iconContainer{
        border: 5px solid #f6f8fb;
        border-radius: 50%;

        .MuiSvgIcon-root{
            fill:  ${Colors.PROGRESS_GREY};

            &.MuiStepIcon-active{
                fill: ${Colors.SKYBLUE};
            }

            &.MuiStepIcon-completed {
                fill: ${Colors.SUCCESS};
            }
        }
    }
  }
`;