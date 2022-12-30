import React, { useState } from "react";
import FooterView from "../Footer/FooterView";
import HeaderView from "../Header/HeaderView";
import SidebarView from "../Sidebar/SidebarView";

import * as S from "./BaseView.styles";

type Props = {
  children: React.ReactNode;
};

function BaseView({ children }: Props) {
  const [isNavigationToggleClick, toggleNavigationClick] = useState(false);

  const isNavigationToggle = (clickValue: boolean) => {
    toggleNavigationClick(clickValue);
  }

  return (
    <S.Container className='base-view'>
      <HeaderView navigationToggleClick={isNavigationToggle}/>
      <SidebarView navigationClick={isNavigationToggleClick}/>
      <S.Layout>{children}</S.Layout>
      <FooterView />
    </S.Container>
  );
}

export default BaseView;
