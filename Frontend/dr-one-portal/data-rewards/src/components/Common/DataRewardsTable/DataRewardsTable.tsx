import { useState, MouseEvent } from "react";
import { useHistory } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import ArchiveOutlinedIcon from "@material-ui/icons/ArchiveOutlined";
import ToggleOnOutlinedIcon from "@material-ui/icons/ToggleOnOutlined";
import SwapVerticalCircleOutlinedIcon from "@material-ui/icons/SwapVerticalCircleOutlined";
import ListAltOutlinedIcon from "@material-ui/icons/ListAltOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CardTravelOutlinedIcon from "@material-ui/icons/CardTravelOutlined";
import DoneAllOutlinedIcon from "@material-ui/icons/DoneAllOutlined";
import * as S from "./DataRewardsTable.styles";

const menuItemStyle = {
  display: "flex",
  padding: "5px 10px",
  justifyContent: "space-between",
};

const iconStyle = {
  width: "1rem",
};
export type IDataRewardsList = {
  id: number;
  name: string;
  creator: string;
  startAt: string;
  endAt: string;
  status: string;
  target: number;
  archived: number;
};
type IDataRewardsListProps = {
  data: IDataRewardsList[];
  pagination: {
    page: number;
    setPage(_e: any, newPage: number): void;
  };
};

function DataRewardsTable({ data, pagination }: IDataRewardsListProps) {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState<IDataRewardsList>();

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>, content) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(content);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(null);
  };
  const handleRedirection = ({ id, status }: IDataRewardsList) => {
    const url = "/data-rewards";
    if (["Completed", "Active"].includes(status)) {
      history.push(`${url}/analytics/${id}`);
    } else {
      history.push(`${url}/create/${id}`);
    }
  };
  const dataLength = data.length;
  const tableStart = dataLength < 10 ? 0 : pagination.page * 10 - 10;
  const tableData =
    dataLength < 10 ? data : data.slice(tableStart, pagination.page * 10);

  const pageCount =
    Math.ceil(dataLength / 10) < 1 ? 1 : Math.ceil(dataLength / 10);
  return (
    <S.Container className="data-rewards-table">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="thead-main-row">
              <TableCell>CAMPAIGN NAME</TableCell>
              <TableCell>CREATOR</TableCell>
              <TableCell>START DATE</TableCell>
              <TableCell>END DATE</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell>PERFORMANCE</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>TARGET</TableCell>
              <TableCell>ARCHIVED</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((content) => {
              return (
                <TableRow hover key={content.id}>
                  <TableCell
                    className="data-rewards-name"
                    onClick={() => handleRedirection(content)}
                  >
                    {content.name}
                  </TableCell>
                  <TableCell>{content.creator}</TableCell>
                  <TableCell>{content.startAt}</TableCell>
                  <TableCell>{content.endAt}</TableCell>
                  <TableCell className="data-rewards-status">
                    <label
                      className={`${content.status
                        .split(" ")[0]
                        .toLocaleLowerCase()}`}
                    >
                      {content.status}
                    </label>
                  </TableCell>
                  <TableCell>{content.target}</TableCell>
                  <TableCell>{content.archived}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-controls={`data-rewards-menu:${content.id}`}
                      aria-haspopup="true"
                      onClick={(event) => handleOpenMenu(event, content)}
                      className="menu-button"
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      keepMounted
                      anchorEl={anchorEl}
                      id={`data-rewards-menu:${content.id}`}
                      open={!!menuOpen && content.id === menuOpen?.id}
                      onClose={handleClose}
                      PaperProps={{
                        style: {
                          maxHeight: 230,
                          width: "130px",
                        },
                      }}
                    >
                      <MenuItem
                        style={menuItemStyle}
                        onClick={() => handleRedirection(content)}
                      >
                        <p>Edit</p>
                        <CreateOutlinedIcon style={iconStyle} />
                      </MenuItem>
                      <MenuItem style={menuItemStyle} onClick={handleClose}>
                        <p>Duplicate</p>
                        <FileCopyOutlinedIcon style={iconStyle} />
                      </MenuItem>
                      <MenuItem style={menuItemStyle} onClick={handleClose}>
                        <p>Archived</p>
                        <ArchiveOutlinedIcon style={iconStyle} />
                      </MenuItem>
                      {["Completed", "Active"].includes(content.status) && (
                        <>
                          <MenuItem style={menuItemStyle} onClick={handleClose}>
                            <p>Stop/Play</p>
                            <ToggleOnOutlinedIcon style={iconStyle} />
                          </MenuItem>
                          <MenuItem style={menuItemStyle} onClick={handleClose}>
                            <p>Boost</p>
                            <SwapVerticalCircleOutlinedIcon style={iconStyle} />
                          </MenuItem>
                        </>
                      )}
                      {["Completed"].includes(content.status) && (
                        <MenuItem style={menuItemStyle} onClick={handleClose}>
                          <p>Job</p>
                          <CardTravelOutlinedIcon style={iconStyle} />
                        </MenuItem>
                      )}
                      {["Waiting for Approval"].includes(content.status) && (
                        <>
                          <MenuItem style={menuItemStyle} onClick={handleClose}>
                            <p>Approve</p>
                            <DoneAllOutlinedIcon style={iconStyle} />
                          </MenuItem>
                          <MenuItem style={menuItemStyle} onClick={handleClose}>
                            <p>Test Ad</p>
                            <ListAltOutlinedIcon style={iconStyle} />
                          </MenuItem>
                        </>
                      )}
                    </Menu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        shape="rounded"
        count={pageCount}
        page={pagination.page}
        onChange={pagination.setPage}
      />
    </S.Container>
  );
}

export default DataRewardsTable;
