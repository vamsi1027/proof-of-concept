import { Colors } from '@dr-one/utils';
import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  height: auto;
  font-size: 12px;
  border-collapse: collapse;
  text-align: start;

  > thead {
    width: 100%;
    background-color: ${Colors.BGGRAY};
    height: 71px;
    color: ${Colors.HEADERCOLOR};
    font-weight: bold;
    line-height: 14px;
  }
  > tbody {
    > tr {
      height: 62px !important;
      > .name {
        max-width: 100px;
        padding-left: 5px;
        font-size: 14px;
      }
    }
  }
`;
export const ThContent = styled.div`
  width: 116px;
  height: 71px !important;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 10px;
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
      margin-top: -2px;
    }
  }
`;

export const OptionDropdown = styled.p`
  color: ${Colors.HEADERCOLOR};
  font-weight: 400;
  font-size: 12px;
`;
export const Td = styled.td`
  min-width: 100px;
  max-width: 120px;
  line-height: 16.41px;
  width: 100px;
  text-align: start;
  letter-spacing: 0;
  padding-right: 5px;
  color: ${Colors.HEADERCOLOR};
  font-weight: 400;
  font-size: 13px;
  border-bottom: 1px solid ${Colors.BORDER};
  word-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const NotFound = styled.h2`
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 15px;
  color: ${Colors.HEADERCOLOR};
`;
