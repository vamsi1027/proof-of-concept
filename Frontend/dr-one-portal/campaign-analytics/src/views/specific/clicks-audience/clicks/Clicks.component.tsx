import React from "react";
import { GraphCardLayout } from "../../../../Layouts";
import { icon_clicks } from "../../../../assets";

import Heatmap from "../../../../components/Charts/Heatmap";
import campaignService from "../../../../services/campaigns.service";
import { MenuItem, Select } from "@material-ui/core";
import "./styles.css";

const ClicksComponent: React.FunctionComponent = () => {
  const [selectable, setSelectable] = React.useState<any>(0);
  const { clickables } = campaignService();

  const props = {
    parent: { title: "Clicks per Time", avatar: icon_clicks, raised: true },

    select: {
      className: "ApoSpecificClickSelect",
      value: selectable,
      onChange: (e) => setSelectable(e.target?.value),
      style: {
        borderRadius: "0.5rem",
        marginLeft: "1rem",
      },
    },

    heatmap: { data: clickables[selectable]?.value || [] },
  };

  return (
    <GraphCardLayout {...props.parent}>
      <Select variant="outlined" {...props.select}>
        {clickables?.map((value, index) => (
          <MenuItem key={index} value={index}>
            {value.label}
          </MenuItem>
        ))}
      </Select>

      <Heatmap {...props.heatmap} />
    </GraphCardLayout>
  );
};

export default React.memo(ClicksComponent);
