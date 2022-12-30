import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`

.cdDescription {
    color: #fffd;
    display: flex;
    flex-direction: row;
  }
  
  .cdDescription .content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
  }
  
  .cdDescription .value {
    /*display: flex;*/
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    /*white-space: nowrap;*/
  }
  
  .cdDescription .content h4 {
    max-width: max-content;
    font-size: 12px;
    line-height: 14.06px;
    margin-bottom: 5px;
  }
  
  .cdDescription .content span {
    font-size: 16px;
    line-height: 18.75px;
    word-break: break-all;
  }
  
  .cdDescription .content .myBadge {
    background-color: #fff;
    border-radius: 0.25rem;
    padding: 0.025rem 0.5rem;
    max-width: max-content;
  }
  
  .cdDescription .content .myBadge span {
    color: #1854d1;
    font-size: 13px;
    font-weight: 500;
    line-height:15.23px;
  }
  
  .cdDescription .cdDivider {
    margin-top: 2px;
    height: 30px;
    width: 1px;
    background: rgba(255, 255, 255, 0.533);
  }
  
`;

