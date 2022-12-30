import styled from 'styled-components';
export const Container = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  > .MuiButton-outlinedSizeSmall {
    border: 1px solid #cccedd;
    > .MuiButton-label {
      font-size: 12px;
      width: 110px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .data-rewards-analytics-menu-item {
    font-size: 14px;
  }
`;
