import ArrowBackIosNewIcon from "@material-ui/icons/ArrowBackIos";
import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import useCustomFilter, { Props } from "./useCustomFilter.hook";
import {
  Checkbox,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { MenuItemType } from "../../models";

/**
 * Custom component to manage menu
 * @param menuItems - array to print as descending menu
 * @param anchorEl - to bind the menu
 * @param isOpen - is current menu open
 * @param handleClose - to close the menu
 * @param onSelected - to execute when menu iten is clicked
 * @param currentSelected - to manage the checked state
 * @returns Custom Filter Component
 */
const CustomFilterComponent: React.FunctionComponent<
  Props & Record<string, any>
> = ({
  className,
  menuItems,
  anchorEl,
  isOpen,
  handleClose,
  onSelected,
  currentSelected,
  ...rest
}) => {
  const { filteredData, props } = useCustomFilter({
    className,
    anchorEl,
    isOpen,
    menuItems,
    handleClose,
    onSelected,
    currentSelected,
  });

  return (
    <Menu {...props.parent} {...rest}>
      <TextField
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
        {...props.filter}
      />

      <div {...props.items}>
        {filteredData?.map((item: MenuItemType, index: number) => (
          <React.Fragment key={`mi_${item.id}_${index}`}>
            <MenuItem {...props.menuItem(item)}>
              {Array.isArray(item.value) ? (
                <ArrowBackIosNewIcon />
              ) : (
                <Checkbox {...props.checkbox(item)} />
              )}
              {item.label}
            </MenuItem>

            {Array.isArray(item.value) && (
              <CustomFilterComponent {...props.nested(item.value)} />
            )}
          </React.Fragment>
        ))}
      </div>
    </Menu>
  );
};

export default React.memo(CustomFilterComponent);
