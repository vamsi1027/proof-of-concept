import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
    .MuiOutlinedInput-notchedOutline{
      border-color:${Colors.BUTTON_GRAY};
    }

    
`;

export const Row = styled.div`

      &.push-wrap{
        margin-bottom: 20px;

        .delete-icon-section{
          margin-top: 8px;

          .MuiSvgIcon-root{
            cursor:pointer;
          }
        }
        
        .MuiTextField-root{
            .MuiFormLabel-root {
                padding-right: 7px;
                transform: translate(14px, -6px) scale(0.75);
                background: ${Colors.WHITE};                
            }
        }
       

        
      }
      &.push-wrap:last-child{
        margin-bottom: 0px !important;
      }

      .switchery{
        margin-bottom:0;
      }
`;

export const Card = styled.div`
    padding: 25px 28px;
    box-shadow: 0px 9px 16px rgb(159 162 191 / 18%), 0px 2px 2px rgb(159 162 191 / 32%);
    background: ${Colors.WHITE};
    border-radius: 6px;
`;

export const ScheduleHeader = styled.div`
  margin-bottom: 25px;
  display: flex;
  align-items: center;

  img {
    width: 32px;
    margin-right: 20px;
  }
  p {
    font-weight: 700;
  }
  small {
    font-weight: 300;
    opacity:0.5;
  }
`;

export const ScheduleContainer = styled.div`
  margin-top:25px;

`;


export const WeekRow = styled.div`
    &.inapp-week{
      margin-top:15px;
      margin-bottom:15px;

      .inapp-week-row{
        display: flex;
        justify-content: space-between;
        align-items: center;

        .MuiSvgIcon-root {
          width: 25px;
        }

        .form-select-box {
          width: 135px;
        }

        .MuiTextField-root {
          width: 30%;

          .MuiInputBase-root {
            height: 36px;
          }

          legend{
            display:none;
          }

          .MuiInputLabel-outlined.MuiInputLabel-shrink {
            transform: translate(14px, -10px) scale(0.75);
            background: #fff;
            padding: 0 6px;
          }
        }

        .MuiSlider-root {
          width: 30%;
        }

        p {
          width: 20%;
        }

        &:last-child{
          margin-bottom:0;
        }

      }
    }
`;
