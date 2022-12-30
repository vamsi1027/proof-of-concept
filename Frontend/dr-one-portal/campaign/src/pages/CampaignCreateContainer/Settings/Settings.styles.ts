import styled from 'styled-components';
import { Colors } from '@dr-one/utils';
export const Container = styled.div`
  width: 100% !important;
  height: 100%;
  color: ${Colors.HEADERCOLOR};
  display: grid;
  grid-template-columns: 55% 43%;
  gap: 20px;
  grid-template-rows: repeat(3, auto);
  grid-template-areas:
    'audience tracker'
    'metrics tracker'
    'schedule schedule'
    'finish finish';

    &.engagement-settings{
      display:block;

      .audience{
        margin-bottom:30px;
      }

      .orbtn-wrap {
        justify-content: flex-start !important;

        .button-add {
          margin-left: 10px;
        }
      }
    }
  > .audience {
    grid-area: audience;
    // min-height: 30vh;

    @media screen and (max-width: 769px) {
      // min-height: 20vh;
    }

    .MuiCardHeader-root{
      padding: 25px 28px;
    }

    .MuiCardContent-root {
      padding: 13px 25px 28px;
    }

    .seperator-wrap{
        .switch-wrapper {
            visibility: hidden;
        }
        .orbtn-wrap {
            visibility: hidden;
        }
    }

    .group-box {
      .child-button-and {
          margin-right: auto;
          margin-left: auto;
          .MuiButtonBase-root{
              &:last-child{
                  display:none;
              }
          }
      }
      .child-button-or {
          margin-right: auto;
          margin-left: auto;
          .MuiButtonBase-root{
              &:first-child{
                  display:none;
              }
          }
      }
      &:nth-child(2) {
          .child-button-and {
              margin-right: auto;
              margin-left: auto;
              .MuiButtonBase-root{
                  &:last-child{
                      display:flex;
                  }
              }
          }
          .child-button-or {
              margin-right: auto;
              margin-left: auto;
              .MuiButtonBase-root{
                  &:first-child{
                      display:flex;
                  }
              }
          }
      }

    }
  }
  > .metrics {
    grid-area: metrics;
    margin-bottom: 30px;
    // min-height: 70vh;

    .kMrjiY{
      padding:25px 28px;

      .iNjEhG{
        margin-bottom:35px;
      }
    }


    @media screen and (max-width: 769px) {
      min-height: auto;
    }
  }
  > .tracker {
    grid-area: tracker;
    margin-bottom: 30px;
    // min-height: 358px;
    // max-height: calc(60vh + 35px);

    @media screen and (max-width: 768px) {
      min-height: auto;
    }
  }
  > .schedule {
    grid-area: schedule;
    margin-bottom: 30px;
    // min-height: 40vh;
  }
  > .finish {
    grid-area: finish;

    @media screen and (max-width: 769px) {
      grid-area: auto;
    }

  
  }

  @media screen and (max-width: 769px) {
    display: grid;
    grid-template-columns: 100%;
    gap: 30px;
    grid-template-rows: repeat(4, auto);
    grid-template-areas:
      'audience'
      'tracker'
      'metrics'
      'schedule';
  }



 
 
`;
