import React from "react";
import { NavLink as NavLinkRRD } from "react-router-dom";
import { Tooltip } from "@material-ui/core";

import { Colors } from "@dr-one/utils";
import * as S from "./NavLink.styles";

interface Props {
  children: React.ReactNode;
  icon: React.ReactNode;
  collapse?: boolean;
  to: string;
}
function NavLink(props: Props): React.ReactElement {
  const { children, to, icon, collapse } = props;
  return (
    <Tooltip title={!!collapse ? children : ""}>
      <S.Container className='nav-link'>
        <NavLinkRRD
          to={to}
          activeStyle={{
            color: Colors.DEFAULT,
            textDecoration: "none",
          }}
        >
          {icon} <label>{children}</label>
        </NavLinkRRD>
      </S.Container>
    </Tooltip>
  );
}

export default NavLink;
