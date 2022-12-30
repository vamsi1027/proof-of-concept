import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
    .cdContainerSkeleton {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 1rem;
    }

    .cd-data-sec{
        display:flex;
        width: 100%;
        flex-wrap: wrap;     
        
  
        .sc-dlMDgC {
          width: 17%;
          margin-bottom: 15px;
          border-right: 1px solid rgba(255, 255, 255, 0.533);
          margin-right: 15px;
  
          @media screen and (max-width:991px) {
            width: 46%;
          }
        }
      }
`;


