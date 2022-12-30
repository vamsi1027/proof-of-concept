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

export const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${Colors.BGGRAY};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;

  > header {
    height: 50px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    > nav {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .title-breadcrumbs {
    color: #1975ff;
    font-weight: bold;
    font-size: 17px;
    opacity: 0.7;
  }
  .link-breadcrumbs {
    color: #1975ff;
    font-size: 17px;
    opacity: 0.7;
  }
  .MuiBreadcrumbs-separator {
    color: #1975ff;
    font-size: 17px;
    opacity: 0.7;
  }
`;

export const Title = styled.h2`
  color: ${Colors.HEADERCOLOR};
  font-size: 30px;
  line-height: 35.16px;
  font-weight: 700;
`;
export const ButtonInvite = styled.button`
  width: 170px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.DEFAULT};
  color: ${Colors.WHITE};
  font-size: 16px;
  line-height: 19px;
  font-weight: 700;
  border: none;
  border-radius: 5px;
`;

export const Content = styled.div`
  margin-top: 35px;
  width: 100%;
  height: 90%;
  background-color: tomato;
  padding: 15px;
  background-color: ${Colors.WHITE};
  box-shadow: 0px 9px 16px rgba(159, 162, 191, 0.18),
    0px 2px 2px rgba(159, 162, 191, 0.32);
  border-radius: 6px;
  display: grid;
  grid-template-columns: 200px auto;
  grid-template-rows: 5% 600px 7%;
  gap: 15px;
  grid-template-areas:
    'search .'
    'tableUsers tablePermisions'
    'pagination pagination';

  > .search {
    grid-area: search;
    > input {
      color: ${Colors.HEADERCOLOR};
      width: 350px;
      height: 35px;
      border-radius: 6px;
      border: 1px solid ${Colors.ARROWGRAY};
      background-color: ${Colors.WHITE};
      padding-left: 30px;
      background-image: url(/img/search-icon.svg);
      background-repeat: no-repeat;
      background-position: 5px center;
      ::placeholder {
        color: rgba(119, 117, 127, 0, 3);
        font-weight: 400;
        font-size: 15px;
        line-height: 17.58px;
      }
      :focus {
        border: 2px solid ${Colors.ARROWGRAY};
      }
    }
  }
  > .tableUsers {
    margin-right: 20px;
    grid-area: tableUsers;
  }
  > .tablePermisions {
    grid-area: tablePermisions;
    overflow-x: auto;
    margin-left: 15px;
  }

  > .pagination {
    grid-area: pagination;
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
