import { RowLayout } from "../../../Layouts";
import React from "react";
import Audience from "./audience/Audience.component";
import Clicks from "./clicks/Clicks.component";

const ClicksAudienceComponent: React.FunctionComponent = () => {
  return (
    <RowLayout columns={2} style={{ height: "40rem", margin: "1rem 0" }}>
      <Clicks />

      <Audience />
    </RowLayout>
  );
};

export default React.memo(ClicksAudienceComponent);
