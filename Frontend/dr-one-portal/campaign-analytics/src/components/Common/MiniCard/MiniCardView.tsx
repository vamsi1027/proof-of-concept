import React, { memo } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";

import InfoIcon from "@material-ui/icons/Info";

import * as S from "./MiniCardView.styles";

interface CardProps {
  load: boolean;
  title: string;
  value?: number | string;
  description?: string;
  tooltip?: string | React.ReactNode;
}

function MiniCardView(props: CardProps) {
  return (
    <S.Container>
      <Card variant="outlined">
        <CardContent>
          <S.CardBody>
            <h3>{props.load ? <CircularProgress /> : props.value}</h3>
            <h4>
              {props.title}
              {!!props.tooltip && (
                <Tooltip title={props.tooltip}>
                  <label>
                    <InfoIcon />
                  </label>
                </Tooltip>
              )}
            </h4>
            {props.description && <span>{props.description}</span>}
          </S.CardBody>
        </CardContent>
      </Card>
    </S.Container>
  );
}

export default memo(MiniCardView);
