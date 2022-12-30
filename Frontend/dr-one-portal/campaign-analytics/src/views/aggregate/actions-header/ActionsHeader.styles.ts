import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
.actionsHeader {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
  
  .actionsHeader .title {
    flex-grow: 1;
  }
  
  .actionsHeader .title h1 {
    margin-top: 0.5rem;
  }
  
  .actionsHeader .actions {
    display: flex;
    flex-direction: row-reverse;
    gap: 1rem;
    position: relative;
    margin-left: auto;
    margin-top: 1rem;
  }
  
  .actionsHeader .actions button {
    font-weight: 600;
    text-transform: none;
  }
  
  .actionsHeader .actions .picker {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
  }
  .header-main-btn.calandar-btn .MuiTextField-root {
    background: rgb(255, 255, 255);
    width: 250px;
    display: flex;
    margin-left: auto;
  }
  .header-main-btn.calandar-btn .calandar-popup {
    position: relative;
    z-index: 3;
    box-shadow: rgb(159 162 191 / 18%) 0px 9px 16px, rgb(159 162 191 / 32%) 0px 2px 2px;
  }
  .actionsHeader .info-text {
    margin: 0;
  }
  

`;