import * as S from "./TablePermisions.styles";
import { useState } from "react";
import DropdownPermisions from "../DropdownPermisions/DropdownPermisions";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Menu,
  MenuItem,
} from "@material-ui/core";
interface ITablePermisionsProps {
  listUsers: {
    name: string;
    email: string;
    company: string;
    is_active: boolean;
    mfa_on: boolean;
    phone: string;
    roles: Array<string>;
  }[];
  colorArrowSort: {
    name: string;
    company: string;
    phone: string;
    email: string;
  };
  handleChangeStatus: (e: any, email: string) => void;
  handleChangeMFA: (e: any, email: string) => void;
  setRoles: (email: string, role: string) => void;
  handleUpdateFilters: (key: string, value: any) => void;
  handleUpdateFilterRoles: (value: string, role: string) => void;
  setSortTable: ({}: any) => void;
  changeColorArrowSort: (direction: string, head: string) => void;
}

const TablePermisions = ({
  listUsers,
  handleChangeStatus,
  handleChangeMFA,
  handleUpdateFilterRoles,
  setRoles,
  handleUpdateFilters,
  setSortTable,
  changeColorArrowSort,
  colorArrowSort,
}: ITablePermisionsProps) => {
  const headers = [
    "Preload Approver",
    "Preload Creator",
    "Business Manager",
    "Administrator",
    "Campaign Creator",
    "Campaign Admin",
  ];
  const [load, setLoad] = useState(false);
  const [isUp, setIsUp] = useState(true);
  const [usersState, setUsersState] = useState<any>(listUsers);
  const [openMFA, setOpenMFA] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filtersActive, setFiltersActive] = useState({
    mfa: false,
    status: false,
    PreloadAprover: false,
    PreloadCreator: false,
    BusinessManager: false,
    CampaignCreator: false,
    CampaignAdmin: false,
  });
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.id;
    if (id === "mfa") {
      setOpenMFA(!openMFA);
    } else {
      setOpenStatus(!openStatus);
    }
    setAnchorEl(e.currentTarget);
  };

  const handleStyleActiveFilter = (key: string, value: boolean) => {
    setFiltersActive({ ...filtersActive, [key]: value });
  };
  return (
    <>
      {load && (
        <S.LoadPage>
          <CircularProgress />
        </S.LoadPage>
      )}
      <S.Table>
        <thead>
          <tr>
            <th>
              <S.ThContent className="phone">
                PHONE
                <div className="icons">
                  <span>
                    <ArrowDropUpIcon
                      cursor="pointer"
                      fontSize="small"
                      className={
                        colorArrowSort.phone === "up"
                          ? "arrow-icon arrow-icon-active"
                          : "arrow-icon"
                      }
                      onClick={() => {
                        setSortTable({ key: "phone", direction: false });
                        changeColorArrowSort("up", "phone");
                      }}
                    />
                  </span>
                  <span>
                    <ArrowDropDownIcon
                      onClick={() => {
                        setSortTable({ key: "phone", direction: true });
                        changeColorArrowSort("down", "phone");
                      }}
                      className={
                        colorArrowSort.phone === "down"
                          ? "arrow-icon arrow-icon-active"
                          : "arrow-icon"
                      }
                      fontSize="small"
                    />
                  </span>
                </div>
              </S.ThContent>
            </th>
            <th>
              <S.ThContent>
                EMAIL
                <div className="icons">
                  <span>
                    <ArrowDropUpIcon
                      cursor="pointer"
                      fontSize="small"
                      className={
                        colorArrowSort.email === "up"
                          ? "arrow-icon arrow-icon-active"
                          : "arrow-icon"
                      }
                      onClick={() => {
                        setSortTable({ key: "email", direction: false });
                        changeColorArrowSort("up", "email");
                      }}
                    />
                  </span>
                  <span>
                    <ArrowDropDownIcon
                      onClick={() => {
                        setSortTable({ key: "email", direction: true });
                        changeColorArrowSort("down", "email");
                      }}
                      fontSize="small"
                      className={
                        colorArrowSort.email === "down"
                          ? "arrow-icon arrow-icon-active"
                          : "arrow-icon"
                      }
                    />
                  </span>
                </div>
              </S.ThContent>
            </th>
            <th>
              <S.ThContent>
                MFA
                <div className="icons" onClick={handleClick} id="mfa">
                  <img
                    src="/img/filter_icon.svg"
                    alt="icon filter"
                    id="mfa"
                    className={filtersActive.mfa && "filter-active"}
                  />
                  {openMFA && (
                    <Menu
                      className="menu"
                      id="simple-menu"
                      anchorEl={anchorEl}
                      open={openMFA}
                      onClose={() => setOpenMFA(false)}
                      style={{
                        position: "absolute",
                        height: "350px",
                      }}
                    >
                      <MenuItem
                        divider={true}
                        onClick={() => {
                          handleStyleActiveFilter("mfa", false);
                          handleUpdateFilters("mfa", "");
                          setOpenMFA(false);
                        }}
                      >
                        <S.OptionDropdown>Show All</S.OptionDropdown>
                      </MenuItem>
                      <MenuItem
                        divider={true}
                        onClick={(e) => {
                          handleUpdateFilters("mfa", "active");
                          handleStyleActiveFilter("mfa", true);
                          setOpenMFA(false);
                        }}
                      >
                        <S.OptionDropdown>Enable</S.OptionDropdown>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleUpdateFilters("mfa", "inactive");
                          handleStyleActiveFilter("mfa", true);
                          setOpenMFA(false);
                        }}
                      >
                        <S.OptionDropdown>Disable</S.OptionDropdown>
                      </MenuItem>
                    </Menu>
                  )}
                </div>
              </S.ThContent>
            </th>
            <th>
              <S.ThContent>
                STATUS
                <div className="icons" id="status" onClick={handleClick}>
                  <img
                    src="/img/filter_icon.svg"
                    alt="icon filter"
                    className={filtersActive.status && "filter-active"}
                  />
                  {openStatus && (
                    <Menu
                      className="menu"
                      id="simple-menu"
                      anchorEl={anchorEl}
                      open={openStatus}
                      onClose={() => setOpenStatus(false)}
                    >
                      <MenuItem
                        divider={true}
                        onClick={() => {
                          handleStyleActiveFilter("status", false);

                          handleUpdateFilters("status", "");

                          setOpenStatus(false);
                        }}
                      >
                        <S.OptionDropdown>Show All</S.OptionDropdown>
                      </MenuItem>
                      <MenuItem
                        divider={true}
                        onClick={() => {
                          handleUpdateFilters("status", "active");
                          handleStyleActiveFilter("status", true);
                          setOpenStatus(false);
                        }}
                      >
                        <S.OptionDropdown>Active</S.OptionDropdown>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleUpdateFilters("status", "inactive");
                          handleStyleActiveFilter("status", true);
                          setOpenStatus(false);
                        }}
                      >
                        <S.OptionDropdown>Inactive</S.OptionDropdown>
                      </MenuItem>
                    </Menu>
                  )}
                </div>
              </S.ThContent>
            </th>
            {headers.map((head, index) => {
              return (
                <th key={index}>
                  <S.ThContent className="roles">
                    {head.toUpperCase()}
                    <DropdownPermisions
                      title={head}
                      handleUpdateFilterRoles={handleUpdateFilterRoles}
                      handleStyleActiveFilter={handleStyleActiveFilter}
                      filtersActive={filtersActive}
                    />
                  </S.ThContent>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {!!listUsers &&
            listUsers.map((user) => {
              return (
                <tr key={user.email}>
                  <S.Td className="phone">{user.phone}</S.Td>
                  <S.Td>{user.email}</S.Td>
                  <S.Td>
                    <S.SelectNative
                      value={user.mfa_on ? "enable" : "disable"}
                      onChange={(e) => {
                        user.mfa_on =
                          e.target.value === "enable" ? true : false;
                        handleChangeMFA(e, user.email);
                      }}
                    >
                      <option value="enable">Enable</option>
                      <option value="disable">Disable</option>
                    </S.SelectNative>
                  </S.Td>
                  <S.Td>
                    <S.SelectNative
                      value={user.is_active ? "active" : "inactive"}
                      onChange={(e) => {
                        handleChangeStatus(e, user.email);

                        user.is_active =
                          e.target.value === "active" ? true : false;
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </S.SelectNative>
                  </S.Td>
                  {headers.map((role) => (
                    <S.Td key={role}>
                      <FormControlLabel
                        className="checkbox"
                        onChange={() => {
                          setRoles(user.email, role);
                        }}
                        control={
                          <Checkbox
                            color="primary"
                            name="roles"
                            value={user.roles.includes(role)}
                          />
                        }
                        checked={user.roles.includes(role)}
                        label={""}
                      />
                    </S.Td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </S.Table>
    </>
  );
};

export default TablePermisions;
