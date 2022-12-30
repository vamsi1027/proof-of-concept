import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
.GraphCardSkeleton .header {
    align-items: center;
    border-bottom:1px solid #22335435;
    color: #223354;
    display: flex;
    flex-direction: row;
    padding: 1rem;
    position: relative;
  }
  
  .GraphCardSkeleton .title {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  
  .GraphCardSkeleton .avatar {
    height: 3rem;
    margin-right: 1rem;
    width: 3rem;
  }
  
  .GraphCardSkeleton .header-title {
    height: 1.5rem;
    width: 10rem;
  }
  
  .GraphCardSkeleton .header-action {
    height: 2.5rem;
    margin-left: auto;
    width: 6rem;
  }
  
`;

