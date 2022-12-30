import React from "react";
import "./styles.css";

/* Prop definition */
type Props = {
  value: string;
};

const Badge: React.FunctionComponent<Props & Record<string, any>> = ({
  value,
  ...rest
}) => {
  return (
    <div className="RelatedBadge" {...rest}>
      {value}
    </div>
  );
};

export default React.memo(Badge);
