// import HeaderDatePicker from "./header-date-picker/HeaderDatePicker.component";
import HeaderFilter from "./header-filter/HeaderFilter.component";
import HeaderTitle from "./header-title/HeaderTitle.component";
import React, { useContext, useState } from "react";
import { classNames } from "../../../utils";
import campaignService from "../../../services/campaigns.service";
import { useTranslation } from 'react-i18next';
import * as S from "./ActionsHeader.styles";
// import aggregateContext from '../Context'

/* Prop definition */
type Props = {
  className?: string;
};

const ActionsHeaderComponent: React.FunctionComponent<
  Props & Record<string, any>
> = ({ className, ...rest }) => {
  const [, setSelectedCampaigns] = useState([]);
  const { t } = useTranslation();

  // const { dateRange, setDateRange } = useContext(aggregateContext)
  const { getCampaigns } = campaignService();

  const props = {
    parent: {
      className: classNames("actionsHeader", className),
    },

    actions: { className: "actions" },

    filter: {
      menuItems: getCampaigns(),
      setSelectedItem: setSelectedCampaigns,
    },

    // picker: {
    //   className: "picker",
    //   dateRange,
    //   onChange: setDateRange
    // },
  };

  return (
    <S.Container>
      <section {...props.parent} {...rest}>
        <HeaderTitle />
        <p className="info-text"><img src="/img/info-icon.svg" alt="Information Icon" /> <span><strong className="boldText"></strong> {t('CAMPAIGN_ANALYTICS_AGGREGATE_NOTE')}</span></p>

        <div {...props.actions}>
          <HeaderFilter {...props.filter} />
        </div>
      </section>
    </S.Container>

  );
};

export default React.memo(ActionsHeaderComponent);
