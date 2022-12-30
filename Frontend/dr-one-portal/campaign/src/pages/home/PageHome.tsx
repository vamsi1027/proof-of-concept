import { useEffect, useState } from "react";

// IMPORTING UTILS FUNCTION FROM OTHER MICRO-APP
import { apiDashboard, punctuateNumber } from "@dr-one/utils";

import { Title } from "@dr-one/shared-component";
import MiniCardView from "../../components/Common/MiniCard/MiniCardView";

import * as S from "./PageHome.styles";

import { useUser } from "../../hooks/userHooks";
interface Count {
  count?: number;
}
export default function PageHome() {
  const { user } = useUser();
  const [deviceData, setDevice] = useState<Count>();
  useEffect(() => {
    if (user && !!user.activePartner) {
      setDevice(null);
      const partnerUUID = user.activePartner.partner_uuid;
      apiDashboard
        .get(`/api/devices/count/?partner_uuid=${partnerUUID}`)
        .then(({ data }) => {
          setDevice(data.count);
        });
    }
  }, [user]);
  return (
    <S.Container>
      <Title title="Dashboard" />
      <br />
      <S.Row>
        <S.MiniView style={{ marginRight: 20 }}>
          <MiniCardView
            title={"HISTORICAL USERS"}
            load={!deviceData && typeof deviceData !== "number"}
            value={`${punctuateNumber(deviceData)}`}
          />
        </S.MiniView>
      </S.Row>
    </S.Container>
  );
}
