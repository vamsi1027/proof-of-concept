import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
.performance-report-wrap {
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
    background: #fff;
    padding: 15px;
    border-radius: 5px;
    margin-top: 15px;
    .tooltip-icons {
      width: auto !important;
    }
  }
  .performance-report-wrap .tittle {
    -webkit-box-align: center;
    align-items: center;
      border-bottom: 1px solid rgba(34, 51, 84, 0.208);
      color: rgb(34, 51, 84);
      display: flex;
      flex-direction: row;
      padding:0 1rem 1rem 1rem ;
      justify-content: space-between;
      margin: 0 -15px;
  }
  .performance-report-wrap .tittle h3 {
    font-size: 16px;
    letter-spacing: 0.00938em;
    line-height: 1.75px;
    font-weight: 600;
  }
  .performance-report-wrap .tittle .MuiInputBase-root {
    border: 1px solid #CCCEDD;
    border-radius: 6px;
    padding: 0 10px;
    font-size: 15px;
  }
  .performance-report-wrap .tittle .MuiInputBase-root::before{
    border-bottom: none !important;
  }
  .performance-report-wrap .tittle .MuiInputBase-root::after{
    border-bottom: none !important;
  }
  .performance-report-wrap .list li{
    list-style-type: none;
    font-size: 15px;
    border-bottom: 1px solid #f0f0f0;
    padding: 10px 0;
    font-weight: 700;
    color: rgb(24, 84, 209);
  }
  .performance-report-wrap .list li:last-child{
    border-bottom: none;
  }
  
  .performance-report-wrap .list li span {
    width: 50%;
    display: inline-block;
    font-weight: 400;
    color: #000;
  }

  .export {
    border: 1px solid #CCCEDD;
    border-radius: 6px;
    height: 34px;
    background: #fff;
    box-shadow: none;
    font-weight:600;

    .MuiButton-endIcon .MuiAvatar-root{
      width: 24px;
      height: 24px;
    }
  }
  .rp-select {
    height: 34px;
    margin-right: 15px;
}

    
`;
