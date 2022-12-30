import React from "react";
import SimpleTable from "../../../components/Tables/SimpleTable";
import { GraphCardLayout } from "../../../Layouts";

const UserRelated: React.FunctionComponent = () => {
  const props = {
    parent: { title: "User Related", isExportable: false, raised: true },
  };

  return (
    <GraphCardLayout {...props.parent}>
      <SimpleTable rows={[]} />
    </GraphCardLayout>
  );
};

export default React.memo(UserRelated);
