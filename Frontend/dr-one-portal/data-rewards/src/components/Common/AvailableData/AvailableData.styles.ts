import styled from 'styled-components';
export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const header = styled.header`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(34, 51, 84, 0.1);
  color: #223354;
  font-weight: bold;
  font-size: 16px;
`;
export const GraphicContent = styled.div`
  width: 100%;
  height: calc(100% - 50px);
`;
