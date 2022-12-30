import React from "react";
import { makeStyles } from "@material-ui/core";
import { icon_place } from "../../../assets";
import { GraphCardLayout, RowLayout } from "../../../Layouts";

// chart
import GeoMap from "../../../components/Charts/Geomap";

const useStyles = makeStyles({
  boxContainer: {
    display: "flex",
    flexDirection: "column",
    height: "600px",
  },
});

const GeographyComponent: React.FunctionComponent = () => {
  const classes = useStyles();
  const props = {
    parent: { columns: 1, style: { height: "25rem", margin: "1rem 0" } },
    graph: {
      title: "Clicks per Geography",
      avatar: icon_place,
      raised: true,
      className: classes.boxContainer,
    },
  };

  return (
    <RowLayout {...props.parent}>
      <GraphCardLayout {...props.graph}>
        <GeoMap />
      </GraphCardLayout>
    </RowLayout>
  );
};

export default React.memo(GeographyComponent);
