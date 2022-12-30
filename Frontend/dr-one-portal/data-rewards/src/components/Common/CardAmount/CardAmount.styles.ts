import styled from 'styled-components';
interface IArticleProps {
  colors: {
    color: string;
    symbol: string;
  };
}
interface IHeaderProps {
  backgroudColorTag: string;
}
export const Container = styled.div`
  width: 100%;
  height: 100%;
`;
export const Header = styled.header<IHeaderProps>`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  > span {
    font-weight: bold;
    font-size: 13px;
    opacity: 0.3;
    background: ${({ backgroudColorTag }) => backgroudColorTag};
    width: 50px;
    line-height: 23px;
    text-align: center;
  }
`;
export const Logo = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  bottom: 7px;
  > img {
    margin-right: 5px;
  }
`;
export const Article = styled.article<IArticleProps>`
  width: 100%;
  height: 20%;
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-weight: bold;
  > p {
    font-size: 22px;
  }
  > span {
    font-size: 13px;
    color: ${({ colors }) => colors.color};
    margin-left: 5px;
  }
  @media screen and (min-width: 1400px) {
    > p {
      font-size: 30px;
    }
  }
`;
export const ContentGraphic = styled.div`
  width: 100%;
  height: calc(80% - 50px);
  display: flex;
  align-items: center;
  justify-content: center;
`;
