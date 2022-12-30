import { useTranslation } from "react-i18next";
import * as S from "./BuildingFeatPage.styles";
type BuildingFeatProps = {
  feat: string;
};
function BuildingFeatPage({ feat }: BuildingFeatProps) {
  const { t } = useTranslation();

  return (
    <S.Container className="building-feat-page-wrapper">
      <h4>
        {t(feat)} {t("UNDER_CONSTRUCTION")}
      </h4>
      <img src="/img/building.svg" alt="Building Feat" />
      <p>{t("WORKING_ON_IMPLEMENTING")} </p>
    </S.Container>
  );
}

export default BuildingFeatPage;
