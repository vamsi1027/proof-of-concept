import { Divider } from "@material-ui/core";
import { Colors } from "@dr-one/utils";
import Title from "../Title/TitleView";
import * as S from "./CardStatus.styles";
interface ICardStatusProps {
  status: {
    start: string;
    end: string;
    status: string;
  };
  nameCampaing: string;
}
const CardStatus = ({ status, nameCampaing }: ICardStatusProps) => {
  const active = Colors.ACTIVE;
  const completed = Colors.COMPLETED;
  const statusCampaign = status.status === "Active" ? active : completed;
  return (
    <S.Container>
      <Title title={nameCampaing}>
        <Divider />
      </Title>
      <main>
        <S.Article>
          <S.Labels>
            <p>Start:</p>
            <p>End:</p>
            <p>Status:</p>
          </S.Labels>
          <S.Properties statusCampaign={statusCampaign}>
            <p>{status.start}</p>
            <p>{status.end}</p>
            <p className="status">{status.status}</p>
          </S.Properties>
        </S.Article>
      </main>
    </S.Container>
  );
};

export default CardStatus;
