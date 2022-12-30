import { Colors } from '@dr-one/utils';
import styled from 'styled-components';

export const LoadPage = styled.div`
  width: 100%;
  height: 150vh;
  background-color: rgba(250, 250, 250, 0.7);
  position: absolute;
  left: 0px;
  top: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Table = styled.table`
  width: auto;
  height: auto;
  font-size: 13px;
  border-collapse: collapse;

  > thead {
    background-color: ${Colors.BGGRAY};
    width: auto;
    height: 71px;
    color: ${Colors.HEADERCOLOR};
    font-weight: bold;
    line-height: 14px;
    > tr > th > .phone {
      padding-left: 10px;
    }
    > tr > th > .roles {
      min-width: 200px;
      padding: 5px;
      justify-content: center;
    }
  }
  > tbody {
    width: 100%;
    > tr {
      height: 62px !important;
      > td.phone {
        padding-left: 10px;
        max-width: 150px;
      }
    }
  }
`;
export const ThContent = styled.div`
  min-width: 150px;
  height: 71px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: bold;

  > .icons {
    width: 20px;
    height: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    color: ${Colors.GRAY};
    cursor: pointer;
    margin-left: 5px;
    margin-top: 3px;
    letter-spacing: 0;
    > span {
      height: 7px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      > .arrow-icon {
        opacity: 0.4;
      }
      > .arrow-icon-active {
        opacity: 1;
      }
    }
    > img {
      opacity: 0.4;
      margin-top: -2px;
    }
    > .filter-active {
      opacity: 1;
    }
  }
`;

export const OptionDropdown = styled.p`
  color: ${Colors.HEADERCOLOR};
  font-weight: 400;
  font-size: 12px;
`;

export const Td = styled.td`
  max-width: 270px;
  text-align: start;
  padding-right: 15px;
  color: ${Colors.HEADERCOLOR};
  height: 50px;
  font-weight: 400;
  font-size: 13px;
  border-bottom: 1px solid ${Colors.BORDER};
  word-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 2px;

  > .checkbox {
    margin: 0 auto;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: ${Colors.HEADERCOLOR};
    height: 20px;
    margin-bottom: 2px;
    > input {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .MuiCheckbox-colorPrimary.Mui-checked,
    .MuiCheckbox-colorPrimary,
    .Mui-unchecked {
      color: ${Colors.PRIMARY};
      padding: 0;
    }
  }
  > .status {
    width: 100px;
  }
`;

export const SelectNative = styled.select`
  width: 85px;
  height: 35px;
  border-radius: 4px;
  background: transparent;
  font-size: 13px;
  padding-left: 6px;
  padding-right: 6px;
  cursor: pointer;
  color: rgba(34, 51, 84, 1);
  border: 1px solid rgba(204, 206, 221, 1);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url(/icons/arrow-down.svg);
  background-repeat: no-repeat;
  background-position: 84%;
  background-size: 11px;

  :focus {
    background-color: rgba(0, 0, 0, 0.05);
    border-color: ${Colors.DEFAULT};
  }
`;
