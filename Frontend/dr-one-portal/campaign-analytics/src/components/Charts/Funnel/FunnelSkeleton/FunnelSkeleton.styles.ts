import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
.funnelSkeleton {
    filter: grayscale(90%) opacity(75%);
    height: 100%;
  }
  
  .funnelSkeleton svg text {
    filter: blur(3px);
  }
  .funnelSkeleton span {
    filter: blur(3px);
  }
`;

