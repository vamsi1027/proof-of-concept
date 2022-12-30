import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`

.cdDescriptionSkeleton {
    color: #fffd;
    display: flex;
    flex-direction: row;
  }
  
  .cdDescriptionSkeleton .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .cdDescriptionSkeleton .content h4 {
    max-width: max-content;
    font-size: 12px;
    line-height: 14.06px;
    margin-bottom: 5px;
  }
  
  .cdDescriptionSkeleton .content span {
    font-size: 16px;
    line-height: 18.75px;
  }
  
  .cdDescriptionSkeleton .cdDivider {
    margin-top: 2px;
    height: 30px;
    width: 1px;
    background: rgba(255, 255, 255, 0.533);
  }
  
`;


