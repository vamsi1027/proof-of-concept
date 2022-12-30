import React, { Fragment } from "react";
import { Breadcrumb } from "@dr-one/shared-component";
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import  HeaderDatePicker from '../header-date-picker/HeaderDatePicker.component';
import * as S from "./HeaderTitle.styles";

const HeaderTitleComponent: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const hierarchyList = [t('CAMPAIGN_MANAGEMENT'), t('ANALYTICS')];
  let history = useHistory();

  const changeHierarchy = (hierarchyItem: string): void => {
    switch (hierarchyItem) {
      case 'Campaign Management':
        history.push("/campaign/manage");
        break;
    }
  }

  return (
    <S.Container>
      <Breadcrumb hierarchy={hierarchyList} onHierarchyChange={(item) => changeHierarchy(item)} />
      <div className="mb-20 header-right-aggregate">
        <div>
          <h1 className="page-title">{t('CAMPAIGN_ANALYTICS')}</h1>
        </div>
        <HeaderDatePicker />
      </div>
     
    </S.Container>
  );
};

export default React.memo(HeaderTitleComponent);
