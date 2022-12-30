import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
.specific-skeleton {
    padding: 1rem;
    // position:relative;
  }
  
  .specific-skeleton .header {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .specific-skeleton .title {
    display: flex;
    flex-direction: column;
  }
  
  .specific-skeleton .nav {
    height: 1.5rem;
    width: 25rem;
  }
  
  .specific-skeleton .h1 {
    height: 4rem;
    margin-left: 1rem;
    width: 23rem;
  }
  
  .specific-skeleton .h5 {
    height: 1.5rem;
    margin-left: 1rem;
    width: 15rem;
  }
  
  .specific-skeleton .actions {
    display: flex;
    flex-direction: row;
  }
  
  .specific-skeleton .action {
    height: 2.5rem;
    margin: 0 1rem;
    width: 10rem;
  }
  
  .specific-skeleton .summary {
    height: 8rem;
    margin: 1rem 0;
  }
  
  .specific-skeleton .summary-item {
    height: 100%;
  }
  
  .specific-skeleton .wrapper {
    height: 40rem;
    margin: 1rem 0;
    position: relative;
  }
  
  .specific-skeleton .wrapper-little {
    height: 15rem;
    margin: 1rem 0;
  }
  
`;

