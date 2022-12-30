import { RowLayout } from "../../../Layouts";
import React from "react";
import Funnel from "./funnel/Funnel.component";
import Clicks from "./clicks/Clicks.component";

/* Prop definition */
type Props = {
  className?: string;
};

const ClicksFunnelComponent: React.FunctionComponent<Props> = ({
  className,
}) => {
  return (
    <RowLayout className={className} columns={2} style={{ height: "40rem" }}>
      <Clicks />

      <Funnel />
    </RowLayout>
  );
};

export default React.memo(ClicksFunnelComponent);
