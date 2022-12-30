import { Menu, MenuItem } from "@material-ui/core";
import { useState } from "react";
import * as S from "./DropdownSettings.styles";
import ModalEditUser from "../ModalEditUser/ModalEditUser";

interface IDropdownSettingsProps {
  dataUser: {
    name: string;
    email: string;
    company: string;
    is_active: boolean;
    phone: string;
    roles: [];
  };
  setApiUpdate: (value: boolean) => void;
}

const DropdownSettings = ({ dataUser, setApiUpdate }: IDropdownSettingsProps) => {
  const [openModal, setOpenModal] = useState("");
  const [openDropdown, setOpenDropdown] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, email: string) => {
    setOpenDropdown(email);
    setAnchorEl(e.currentTarget);
  };

  return (
    <S.Container>
      <div
        onClick={(e) => handleClick(e, dataUser.email)}
        aria-controls="simple-menu"
        aria-haspopup="true"
      >
        <img src="/img/more-icon.svg" alt="more icon" />
      </div>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={!!openDropdown && openDropdown === dataUser.email}
        onClose={() => setOpenDropdown("")}
      >
        <MenuItem
          key="edit"
          onClick={() => {
            setOpenDropdown("");
            setOpenModal(dataUser.email);
          }}
        >
          <S.OptionDropdown>
            Edit
            <img src="/img/pencil-icon.svg" alt="icon edit" />
          </S.OptionDropdown>
        </MenuItem>
      </Menu>
      {openModal === dataUser.email && (
        <ModalEditUser setOpen={setOpenModal} dataUser={dataUser} setApiUpdate={setApiUpdate}/>
      )}
    </S.Container>
  );
};

export default DropdownSettings;
