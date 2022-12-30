import {
  ListItem,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { useState } from "react";
import * as S from "./DropdownPermisions.atyle";
interface IDropdownPermisionsProps {
  title: string;
  handleUpdateFilterRoles: (by: string, value?: any, type?: any) => void;
  handleStyleActiveFilter: (key: string, value: boolean) => void;
  filtersActive: {};
}

const DropdownPermisions = ({
  title,
  handleUpdateFilterRoles,
  handleStyleActiveFilter,
  filtersActive,
}: IDropdownPermisionsProps) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [checkboxValues, setCheckboxValues] = useState<any>({
    selected: false,
    unSelected: false,
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setOpen(!open);
    setAnchorEl(e.currentTarget);
  };

  const handleCheckedFilter = (e: any) => {
    const key = e.target.name;
    if (key === "selected") {
      setCheckboxValues({ selected: true, unSelected: false });
    } else {
      setCheckboxValues({ selected: false, unSelected: true });
    }
    setOpen(false);
    handleUpdateFilterRoles(key, title);
    handleStyleActiveFilter(title.split(" ").join(""), true);
  };
  return (
    <S.Icon onClick={(e) => handleClick(e)}>
      <img
        src="/img/filter_icon.svg"
        alt="icon filter"
        className={
          filtersActive[title.split(" ").join("")]
            ? "filter-active"
            : "filterOpacity"
        }
      />
      {open && (
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setOpen(false)}
        >
          <MenuItem
            onClick={() => {
              setCheckboxValues({ selected: false, unSelected: false });
              handleStyleActiveFilter(title.split(" ").join(""), false);
              handleUpdateFilterRoles("", title);
              setOpen(false);
            }}
          >
            Show All
          </MenuItem>
          <MenuItem>
            <S.OptionDropdown>
              <input
                type="checkbox"
                name="selected"
                checked={checkboxValues.selected}
                onChange={handleCheckedFilter}
              />
              <label>Selected</label>
            </S.OptionDropdown>
          </MenuItem>
          <ListItem>
            <S.OptionDropdown>
              <input
                type="checkbox"
                name="unSelected"
                onChange={handleCheckedFilter}
                checked={checkboxValues.unSelected}
              />
              <label>Un Selected</label>
            </S.OptionDropdown>
          </ListItem>
        </Menu>
      )}
    </S.Icon>
  );
};

export default DropdownPermisions;
