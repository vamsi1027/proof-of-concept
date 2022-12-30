import styled from 'styled-components';
export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7f7e87;
  font-size: 14px;
  text-align: center;
  > article {
    margin-top: 15px;
    margin-right: 10px;
  }
  @media screen and (min-width: 1000px) {
    > img {
      width: 40%;
    }
    > article {
      margin-top: 15px;
      margin-right: 15px;
    }
  }
`;
