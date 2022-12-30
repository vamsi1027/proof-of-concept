import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
.rdrDefinedRangesWrapper {
    display: none;
  }

  .header-main-btn.calandar-btn {
    position: absolute;
    right: 0px;
    top: 0px;
    
    .MuiTextField-root{
      background:#fff;
      width: 250px;
      display: flex;
      margin-left: auto;

      .MuiInputBase-root{
        padding:0;

        .MuiInputBase-input {
          line-height: 18.75px;
          font-size: 14px;
          font-weight: 700;
          color: #223354;
          cursor:pointer;
        }
      }
    }

    .calandar-icon{
      margin-left: 5px;
      cursor: pointer;
      .MuiSvgIcon-root{
        color:#1975FF;
      }
    }

    .MuiOutlinedInput-notchedOutline {
      border-color: #CCCEDD;
    }
    .calandar-popup{
      position: relative;
      z-index: 3;
      box-shadow:0px 9px 16px rgba(159, 162, 191, 0.18), 0px 2px 2px rgba(159, 162, 191, 0.32);
    }
  }

  .analytics-table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    height: 75px;

    p {
      font-size: 16px;
      line-height: 18.75px;
      font-weight: 700;
      color: #223354;
    }

    .analytics-right{
      display: flex;

      .MuiAutocomplete-root{
        margin-right: 15px;

        .MuiInputBase-root{
          border-color: rgb(211, 214, 221);
          min-height: 44px;
          padding: 0px 40px 0px 10px;
          height: auto;
          width: 400px;
          background-color: ${Colors.WHITE};
         

          .MuiAutocomplete-tag{
            height: 28px;

            .MuiChip-label{
              width: 100px;
            }
          }
        }
      }
      &.autocomplete-selection {
        margin-left: auto;
      }
      
    }
  }

  .export-btn{
    margin: 0;
    padding: 0;
    border-radius: 6px;
    border: 1px solid #CCCEDD;
    height: 40px;

    .MuiCardHeader-action{
      height: 40px;
      margin-top: 0;
      margin-right: auto;

      .MuiButtonBase-root{
        box-shadow: none;
        height: 100%;

        .MuiButton-label{
          font-size: 14px;
          line-height: 16.41px;
          color: #223354;
          font-weight: 700;
        }
    }
    }

    .MuiAvatar-root {
      width: 22px;
      height: 22px;
  }
  }

  .graph-tab{
    .MuiToggleButton-root{
      padding: 7px 27px;
      font-size: 12px;
      line-height: 14.06px;
      font-weight: 700;
      text-transform: capitalize;
      border:none;
      border-radius: 6px;
    }
    .MuiToggleButton-root.Mui-selected{
      color: #fff;
      background-color: #1975FF;
      box-shadow: 0px 2px 10px rgb(25 117 255 / 50%);
    }
  }

  .graph-label{
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.09px;
    text-transform: capitalize;
    color: #9D9D9D;
    margin:0;

    .MuiButtonBase-root  {
      padding: 0 5px 0 0;
    }
  }

  .spinner-wrap{
    top:0;
    left:0;
  }
  
.show-more-btn {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-top: 15px;
}
`;