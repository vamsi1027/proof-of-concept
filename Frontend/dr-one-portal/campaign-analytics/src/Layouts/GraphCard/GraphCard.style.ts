import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`

.graphCard {
  // height:347px;
  position: relative;
}


.graphCard .title {
    align-items: center;
    border-bottom:1px solid #22335435;
    color: #223354;
    display: flex;
    flex-direction: row;
    padding: 1rem;
  }
  
  .graphCard .title img {
    margin-right: 0.5rem;
  }
  
  .graphCard .title h3 {
    font-weight: 600;
  }
  
  .graphCard .title .actions {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    justify-content: center;
    margin: 0 1rem;
  }
  
  .graphCard .title .actions div {
    border-left:1px solid #22335435;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .graphCard .title .actions div button {
    font-weight: 600;
    min-width: max-content;
    text-transform: none;
  }
  
  .graphCard .title .export span {
    font-weight: 600;
    text-transform: none;
  }
  .export {
    border: 1px solid #CCCEDD;
    border-radius: 6px;
  }
  
  .graph-tab-month-funnel{
    margin-right: 285px;
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
`;

