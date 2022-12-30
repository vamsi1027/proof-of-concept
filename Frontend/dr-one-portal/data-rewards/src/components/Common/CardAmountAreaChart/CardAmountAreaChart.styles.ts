import styled from 'styled-components';
interface IArticleProps {
  colorInfos: {
    color: string;
    background: string;
    symbol: string;
  };
  colorTime: string;
}
export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const Logo = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
  > p {
    font-size: 22px;
    font-weight: bold;
    margin-left: 5px;
  }
  @media screen and(max-width: 1100px) {
    > p {
      font-size: 12px;
    }
  }
`;
export const Article = styled.article<IArticleProps>`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    > .amount {
      font-weight: bold;
      font-size: 22px;
      margin-right: 5px;
    }
    > span {
      font-size: 13px;
      font-weight: bold;
      margin-right: 15px;
      color: ${({ colorInfos }) => colorInfos.color};
    }
    > .gains {
      background-color: ${({ colorInfos }) => colorInfos.background};
      width: 50px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      border-radius: 3px;
    }
    > .time {
      font-weight: 500;
      color: ${(props) => props.colorTime};
      opacity: 0.45;
    }
    @media (min-width: 1100px) {
      > .amount {
        font-size: 40px;
      }
    }
  }
`;
export const GraphicContent = styled.div`
  width: 100%;
  height: 40%;
  box-sizing: border-box;
`;
