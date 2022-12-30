import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
  .funnel {
    width: 100%;
    height: 100%;
    min-height: 330px;
  }
  
  .funnel .foreignObject {
    overflow: visible;
  }
  
  .funnel .foreignObject div:first-child {
    margin-top: 30px;
  }
  .analytics-no-data {
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.5);
    width: 100%;
    height: 100%; 
    
    .analytics-no-data-content {
      display: flex;
      flex-direction: column;
      position: absolute;
      width: 235px;
      left: 50%;
      top: 25%;
      transform: translateX(-50%);
      img {
        margin-bottom: 10px;
      }
    }
  }

  
}



`;


