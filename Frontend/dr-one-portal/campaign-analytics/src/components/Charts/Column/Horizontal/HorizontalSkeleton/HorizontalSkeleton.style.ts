import styled from 'styled-components';

export const Container = styled.div`
.horizontalColumnSkeleton {
    filter: grayscale(90%) opacity(75%);
    height: 100%;
  }
  
  .horizontalColumnSkeleton svg text {
    filter: blur(3px);
  }
  .horizontalColumnSkeleton span {
    filter: blur(3px);
  }
`;


  