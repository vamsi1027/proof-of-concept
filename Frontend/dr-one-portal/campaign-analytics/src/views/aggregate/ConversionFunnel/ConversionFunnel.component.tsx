import InAppConversionFunnel from "./InAppConversionFunnel/InAppConversionFunnel.component";
import PushConversionFunnel from "./PushConversionFunnel/PushConversionFunnel.component";
import React from "react";
import { RowLayout } from "../../../Layouts";
import { classNames } from "../../../utils";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  boxContainer: {
    display: "flex",
    flexDirection: "column",
  },
});

/* Prop definition */
type Props = {
  className?: string;
};

const ConversionFunnelComponent: React.FunctionComponent<
  Props & Record<string, any>
> = ({ className, ...rest }) => {
  const props = {
    parent: {
      className: classNames("conversion-funnel", className),
      columns: 2,
    },
  };
  const classes = useStyles();

  return (
    <RowLayout {...props.parent} {...rest}>
      <PushConversionFunnel className={classes.boxContainer} />
      <InAppConversionFunnel className={classes.boxContainer} />
    </RowLayout>
  );
};

export default React.memo(ConversionFunnelComponent);
