import React from "react";
import useHeaderLinks from "./useHeaderLinks.hook";
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from "@dr-one/shared-component";
import { useHistory } from "react-router-dom";

const HeaderLinksComponent: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const hierarchyList = [t('CAMPAIGN_MANAGEMENT'), t('CAMPAIGN_LIST'), t('CAMPAIGN_ANALYTICS')];
  let history = useHistory();

  const changeHierarchy = (hierarchyItem: string): void => {
    switch (hierarchyItem) {
      case 'Campaign Management':
        history.push("/campaign/manage");
        break;
      case 'Campaign List':
        history.push("/campaign/manage");
        break;
      case 'Campaign Analytics':
        break;
    }
  }

  return (
    <Breadcrumb hierarchy={hierarchyList} onHierarchyChange={(item) => changeHierarchy(item)} />
  );
};

export default React.memo(HeaderLinksComponent);
