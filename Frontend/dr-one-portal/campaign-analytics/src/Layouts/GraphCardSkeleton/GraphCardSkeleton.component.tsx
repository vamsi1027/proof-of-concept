import LoadingData from "../../components/LoadingData/LoadingData.component";
import { Card, CardContent } from "@material-ui/core";
import { FC, memo } from "react";
import { Skeleton } from "@material-ui/lab";
import { classNames } from "../../utils";
import * as S from "./GraphCardSkeleton.styles";

const GraphCardSkeleton: FC<Record<string, any>> = ({
  className = "",
  raised = false,
  children,
  ...rest
}) => {
  return (
    <S.Container>
      <Card
        className={classNames("GraphCardSkeleton", className)}
        elevation={raised ? 2 : 0}
        {...rest}
      >
        <div className="header">
          <div className="title">
            <Skeleton animation="wave" variant="circle" className="avatar" />

            <Skeleton animation="wave" variant="rect" className="header-title" />
          </div>

          <Skeleton animation="wave" variant="rect" className="header-action" />
        </div>

        <CardContent
          
        >
          {children}

          <LoadingData />
        </CardContent>
      </Card>
    </S.Container>

  );
};

export default memo(GraphCardSkeleton);
