import React from "react";
import { GraphCardLayout, RowLayout } from "../../../Layouts";
import { classNames } from "../../../utils";
import { icon_place } from "../../../assets";

/* Prop definition */
type Props = {
  className?: string;
};

const GeographyComponent: React.FunctionComponent<Props & Record<string, any>> =
  ({ className, ...rest }) => {
    const props = {
      parent: {
        columns: 1,
        className: classNames("geography", className),
        style: {
          height: "25rem",
        },
      },

      graph: { title: "Geography", raised: true, avatar: icon_place },
    };

    return (
      <RowLayout {...props.parent} {...rest}>
        {/* if you need more sections in geography add components as descending of /geography path */}
        <GraphCardLayout {...props.graph}>Geography</GraphCardLayout>
      </RowLayout>
    );
  };

export default React.memo(GeographyComponent);
