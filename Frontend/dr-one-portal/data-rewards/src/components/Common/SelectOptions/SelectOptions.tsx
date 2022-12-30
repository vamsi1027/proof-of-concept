import ExpandMoreTwoToneIcon from "@material-ui/icons/ExpandMoreTwoTone";
import { Button, Menu, MenuItem } from "@material-ui/core";
import { useRef, useState } from "react";
import * as S from "./SelectOptions.styles";

const SelectOptions = () => {
  const dataSelect = [
    { value: "lastMonth", label: "Last Month" },
    { value: "Today", label: "Today" },
    { value: "Yasterday", label: "Yasterday" },
    { value: "LastYear", label: "Last Year" },
  ];
  const [openPeriod, setOpenMenuPeriod] = useState(false);
  const [period, setPeriod] = useState("month");
  const actionRef1 = useRef(null);
  return (
    <S.Container>
      <Button
        size="small"
        variant="outlined"
        ref={actionRef1}
        onClick={() => setOpenMenuPeriod(true)}
        endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
      >
        {period}
      </Button>
      <Menu
        anchorEl={actionRef1.current}
        onClose={() => setOpenMenuPeriod(false)}
        open={openPeriod}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {dataSelect.map((periodo) => (
          <MenuItem
            style={{ fontSize: 14, width: 130 }}
            key={periodo.value}
            onClick={() => {
              setPeriod(periodo.label);
              setOpenMenuPeriod(false);
            }}
          >
            {periodo.label}
          </MenuItem>
        ))}
      </Menu>
    </S.Container>
  );
};

export default SelectOptions;
