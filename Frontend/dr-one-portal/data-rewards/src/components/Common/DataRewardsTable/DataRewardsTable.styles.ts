import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
  &.data-rewards-table {
    .thead-main-row {
      background-color: ${Colors.BACKGROUND};
    }
    .menu-button .MuiSvgIcon-root {
      border-radius: 5px;
      color: ${Colors.PRIMARY};
      background-color: ${Colors.BTN_COLOR};
    }
    .menu-button .MuiSvgIcon-root:hover {
      background-color: ${Colors.BTN_COLOR}0A;
    }
    .menu-button:hover {
      background-color: transparent;
    }
    .data-rewards-name {
      cursor: pointer;
      min-width: 150px;
      font-weight: 600;
    }
    .data-rewards-status {
      label {
        padding: 5px;
        max-width: 130px;
        overflow: hidden;
        border-radius: 3px;
        white-space: nowrap;
        display: inline-block;
        text-overflow: ellipsis;
        background-color: ${Colors.BTN_COLOR};
      }
      .waiting {
        color: ${Colors.WAITING};
      }
      .completed {
        color: ${Colors.COMPLETED};
      }
      .active {
        color: ${Colors.ACTIVE};
      }
      .draft {
        color: ${Colors.DRAFT};
      }
    }
    .data-rewards-menu {
      display: flex;
      justify-content: center;
      margin: 15px 0;
    }
    .MuiPagination-root {
      margin: 10px 0px;
      display: flex;
      justify-content: center;
    }
    .MuiPaginationItem-page:hover,
    .MuiPaginationItem-page.Mui-selected:hover,
    .MuiPaginationItem-page.Mui-selected.Mui-focusVisible {
      background-color: ${Colors.BTNPRIMARY}A1;
      color: ${Colors.WHITE};
    }
    .Mui-selected {
      background-color: ${Colors.BTNPRIMARY};
      color: ${Colors.WHITE};
    }
  }
`;
