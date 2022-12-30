import styled from 'styled-components';
interface IGraphicContentProps {
  colors: {
    dark: string;
    light: string;
  };
}
export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const Header = styled.header`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > p {
    font-weight: bold;
    font-size: 16px;
  }
`;
export const GraphicContent = styled.div<IGraphicContentProps>`
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  > div {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 15px;
    font-weight: 400;
    > span::before {
      content: '•';
      color: ${({ colors }) => colors.dark};
      font-size: 50px;
      position: relative;
      top: 13px;
      margin-left: 5px;
    }
    > .light::before {
      color: ${({ colors }) => colors.light};
    }
  }
`;
