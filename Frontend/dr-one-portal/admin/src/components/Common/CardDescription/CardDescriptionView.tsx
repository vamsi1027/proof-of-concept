import React, { memo } from "react";
import Card from "@material-ui/core/Card";

import * as S from "./CardDescriptionView.styles";
import DateRangeIcon from "@material-ui/icons/DateRange";

interface CardProps {
  title: string | React.ReactNode;
  time?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

function CardDescriptionView(props: CardProps) {
  return (
    <S.Container>
      <Card style={{ width: "100%" }}>
        <S.TitleContent>
          <p>{props.title}</p>
          {!!props?.time && (
            <small>
              <DateRangeIcon fontSize="small" /> {`Last ${props.time} days`}
            </small>
          )}
        </S.TitleContent>
        <S.CardBody>{props.children}</S.CardBody>
      </Card>
    </S.Container>
  );
}

export default memo(CardDescriptionView);
