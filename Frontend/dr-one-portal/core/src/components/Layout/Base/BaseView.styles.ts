import styled from 'styled-components';
import { Colors } from '@dr-one/utils';
export const Container = styled.div`
  &.base-view {
    display: grid;
    min-height: 100vh;
    background: ${Colors.WHITE};
    /**overflow-y: hidden;*/
    -webkit-transition: all 0.4s ease;
    -moz-transition: all 0.4s ease;
    -ms-transition: all 0.4s ease;
    -o-transition: all 0.4s ease;
    transition: all 0.4s ease;
    grid-template-columns: 281px auto;
    grid-template-rows: 75px auto 62px;
    grid-template-areas:
      'menu header'
      'menu content'
      'menu footer';
    > header {
      grid-area: header;
    }
    > section {
      grid-area: menu;
    }
    > .content-area {
      grid-area: content;
      position: relative;
    }
    > footer {
      grid-area: footer;
    }
    .footer {
      justify-content: flex-start;
    }
  }
  @media (max-width: 800px) {
    grid-template-columns: 0 auto;
  }
  &.collapse-true {
    grid-template-columns: 70px auto;
  }
  &.sm-collapse-true {
    grid-template-columns: 70px auto;
    > section {
      display: flex;
    }
  }
`;
export const Layout = styled.div`
  padding: 38px 33px 30px;
  height: auto;
  background-color: ${Colors.BACKGROUND};

  .dr-tab-status {
    margin: 10px 0;

    .MuiButtonBase-root:first-child {
      margin: 0 5px 0 0;
    }
    .Mui-selected {
      margin: 0 5px;
      border-radius: 5px;
      background-color: ${Colors.SUCCESS};
      border: 1px solid ${Colors.SUCCESS_BORDER};
      span {
        color: ${Colors.WHITE};
      }
    }
    .MuiTabs-indicator {
      background-color: transparent;
    }
    .MuiButtonBase-root {
      border-radius: 5px;
      border: 1px solid transparent;
      span {
        margin: 0 10px;
      }
      &:hover {
        border-radius: 5px;
        border: 1px solid ${Colors.SUCCESS_BORDER}A1;
      }
    }
  }
  .dr-setting-icon {
    padding: 7px;
    width: 37px;
    height: 37px;
    border: 1px solid ${Colors.BUTTON_GRAY}A1;
    cursor: pointer;
    border-radius: 3px;
    color: ${Colors.DEFAULT};
    &:hover {
      color: ${Colors.DEFAULT}A1;
    }
  }
`;
