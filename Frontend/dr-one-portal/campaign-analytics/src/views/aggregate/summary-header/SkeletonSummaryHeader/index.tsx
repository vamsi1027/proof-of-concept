import {Skeleton} from "@material-ui/lab";
import {RowLayout} from "../../../../Layouts";

import './styles.css';

const SkeletonSummaryHeader = () => {
  return (
    <div className="aggregate-skeleton">
    <RowLayout className="summary" columns={5}>
      <Skeleton animation="wave" variant="rect" className="summary-item" />
      <Skeleton animation="wave" variant="rect" className="summary-item" />
      <Skeleton animation="wave" variant="rect" className="summary-item" />
      <Skeleton animation="wave" variant="rect" className="summary-item" />
    </RowLayout>
    </div>
  )
}

export default  SkeletonSummaryHeader;
