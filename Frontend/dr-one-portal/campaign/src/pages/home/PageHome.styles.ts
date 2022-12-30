import styled from 'styled-components';

export const Container = styled.div`
`;

export const Row = styled.div`
  display: flex;
  margin: 20px 0;
  @media(max-width: 700px) {
    flex-direction: column;
    > div {
      width: fit-content;
    }
  }
`
export const MiniView = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

