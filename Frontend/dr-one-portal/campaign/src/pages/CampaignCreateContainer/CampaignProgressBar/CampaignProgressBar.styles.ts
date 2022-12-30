import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`



span.divider { padding: 0 5px; }
  h5 {
    margin-bottom: 8px;
    color: ${Colors.SKYBLUE};
  }
  .cp-main-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    div:first-child {
      flex: 0 0 60%;
      max-width: 60%;
    }
  }

  
  ul {
    position: relative;
    z-index: 1;
    display: flex;
    margin-bottom: 5px;
    list-style-type: none;
    text-align: center;
    li {
      flex: 0 0 25%;
      max-width: 25%;
      position: relative;
    }
  }
  hr {
    position: absolute;
    top: 16px;
    width: 100%;
    z-index: 0;
    border-width: 1px 0 0;
    border-color: ${Colors.HR_COLOR};
  }
  ul:first-child {
    li span {
      position: relative;
      display: inline-block;
      width: 34px;
      height: 34px;
      padding: 5px;
      color: ${Colors.WHITE};
      background-color: ${Colors.PROGRESS_GREY};
      border-radius: 50%; 
      font-size: 15px;
      line-height: 18px;
      font-weight: 700;
      border: 4px solid ${Colors.BGGRAY};
    }
    li img {display:none;}
    li.cp-active span {
      background-color: ${Colors.SKYBLUE};
    }
    li.cp-completed span {
      background-color: ${Colors.SUCCESS};
      font-size: 0;
      border: 4px solid ${Colors.WHITE};
    }
    li.cp-completed img {
      position: absolute;
      top: 7px;
      left: 5px;
      display:block;
    }
  } 
  ul li {
    color: ${Colors.PROGRESS_GREYTEXT};
    font-size: 14px;
    line-height: 16.4px;
  }
  li.cp-active,
  li.cp-completed { color: ${Colors.HEADERCOLOR}; }


`;

export const Row = styled.div`
  display: flex;
  margin: 20px 0;
  @media(max-width: 700px) {
    flex-direction: column;
    > div {
      width: fit-content;
    }
  }
`;

export const MiniView = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Title = styled.h1`
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

    .MuiStep-completed{
      .MuiStepLabel-iconContainer{
        border-color:${Colors.WHITE};
      }
    }

    .MuiStepConnector-alternativeLabel{
        top: 16px;
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

