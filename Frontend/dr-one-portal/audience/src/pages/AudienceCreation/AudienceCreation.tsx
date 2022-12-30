import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as S from "./AudienceCreation.styles";

import AudienceStepper from "./AudienceStepper/AudienceStepper";
import Registration from "./Registration/Registration";
import { GlobalContext } from '../../context/globalState';
import { Mixpanel } from "@dr-one/utils";


export default function AudienceCreation() {
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const param = useParams()

  useEffect(() => {
    if (!!param.id) {
      Mixpanel.track('Edit Audience Page View');
    } else {
      Mixpanel.track('Create Audience Page View');
    }
  }, []);


  return (
    <S.Container>
      <AudienceStepper />
      <Registration />
    </S.Container>
  );
}
