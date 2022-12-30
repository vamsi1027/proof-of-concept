import { Colors } from '@dr-one/utils';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 25px 20px;
  background-color: ${Colors.WHITE};
  border-radius: 6px;
  box-shadow: 0px 9px 16px rgba(159, 162, 191, 0.18),
    0px 2px 2px rgba(159, 162, 191, 0.32);
`;
export const Logo = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 15px;

  > article {
    margin-left: 10px;

    > p {
      font-weight: bold;
      font-size: 16px;
      line-height: 18px;
    }

    > small {
      font-weight: 300;
      font-size: 14;
      line-height: 16px;
      opacity: 0.5;
    }
  }
`;

export const Radios = styled.div`
  width: 100%;
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;


export const Metrics = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;

  > section{
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: flex-start;

    > .total{
      display: flex;
    flex-direction: column;
    align-items: baseline;
    justify-content: flex-start;
    }
  }

  @media screen and (max-width: 769px) {

    height: 500;

  }

`
export const Target = styled.div`
  width: 100%;
  height: 40%;
  box-shadow: 0px 9px 16px rgba(159, 162, 191, 0.18), 0px 2px 2px rgba(159, 162, 191, 0.32);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  font-size: 20px;
  font-weight: 700;
  padding: 20px;

  > p{
    font-size: 20px;
  }

  > section{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;

    > img{
      width: 25px;
      cursor: pointer;
    }
  }
`

export const Inputs = styled.div`
  margin-top: 30px;
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
`
export const Total = styled.div`
  margin-right: 30px;
  width: 100%;
  height: 116px;
  color: ${Colors.WHITE};
  background: linear-gradient(135deg, ${Colors.BTNPRIMARY} 0%, ${Colors.PRIMARY} 100%);
  border-radius: 6px;
  padding: 15px;
  font-size: 17px;
  > p{
    font-size: 18px;
    line-height: 16px;
    font-weight: bold;

  }
  .matrics-label{
    font-size: 10px;
  }
  > div{
    width: 100%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;

    > .spinner{
    animation: loading 2s linear infinite ;
  }
  }



  @keyframes loading{
    from{
      transform: rotate(360deg);
    }
    to{
      transform: rotate(0);
    }

  }


`
