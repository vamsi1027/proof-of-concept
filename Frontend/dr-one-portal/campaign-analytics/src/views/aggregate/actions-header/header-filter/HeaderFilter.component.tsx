import React from "react";
import useHeaderFilter, { Props } from "./useHeaderFilter.hook";
import { Button } from "@material-ui/core";
import { CustomFilter } from "../../../../components";

const HeaderFilterComponent: React.FunctionComponent<Props> = ({
  menuItems,
  setSelectedItem,
}) => {
  const { props, nextLevel } = useHeaderFilter({ menuItems, setSelectedItem });

  return (
    <React.Fragment>
      <Button style={{ display: 'none' }} endIcon={<img {...props.icon} />} {...props.button}>
        {props.label}
      </Button>

      <CustomFilter {...props.filter} />

      {nextLevel !== undefined && (
        <HeaderFilterComponent
          menuItems={nextLevel}
          setSelectedItem={setSelectedItem}
        />
      )}
    </React.Fragment>
  );
};

export default React.memo(HeaderFilterComponent);
