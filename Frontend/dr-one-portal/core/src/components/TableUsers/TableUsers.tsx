import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import * as S from "./TableUsers.styles";
import { CircularProgress } from "@material-ui/core";

interface ITablesUsersProps {
  listUsers: {
    name: string;
    email: string;
    company: string;
    is_active: boolean;
    mfa_on: boolean;
    phone: string;
    roles: [];
  }[];
  colorArrowSort: {};
  changeColorArrowSort: (direction: string, head: string) => void;
  setSortTable: ({}: any) => void;
}

const TableUsers = ({
  listUsers,
  setSortTable,
  changeColorArrowSort,
  colorArrowSort,
}: ITablesUsersProps) => {
  const headers = ["name", "company"];

  return (
    <>
      <S.Table>
        <thead>
          <tr>
            {headers.map((head, index) => {
              return (
                <th key={index}>
                  <S.ThContent>
                    {head.toUpperCase()}
                    <div className="icons">
                      <span>
                        <ArrowDropUpIcon
                          cursor="pointer"
                          fontSize="small"
                          className={
                            colorArrowSort[head] === "up"
                              ? "arrow-icon arrow-icon-active"
                              : "arrow-icon"
                          }
                          onClick={() => {
                            setSortTable({ key: head, direction: false });
                            changeColorArrowSort("up", head);
                          }}
                        />
                      </span>
                      <span>
                        <ArrowDropDownIcon
                          onClick={() => {
                            setSortTable({ key: head, direction: true });
                            changeColorArrowSort("down", head);
                          }}
                          fontSize="small"
                          className={
                            colorArrowSort[head] === "down"
                              ? "arrow-icon arrow-icon-active"
                              : "arrow-icon"
                          }
                        />
                      </span>
                    </div>
                  </S.ThContent>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {!listUsers ? (
            <CircularProgress />
          ) : (
            listUsers.length > 0 &&
            listUsers.map((user, index) => {
              return (
                <tr key={index}>
                  <S.Td className="name">{user.name}</S.Td>
                  <S.Td>{user.company}</S.Td>
                </tr>
              );
            })
          )}
        </tbody>
      </S.Table>
      {listUsers.length === 0 && <S.NotFound>Not Found</S.NotFound>}
    </>
  );
};

export default TableUsers;
