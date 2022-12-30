import { FC, memo } from "react";
import * as S from "./LoadingData.style";
import { useTranslation } from 'react-i18next';

const LoadingData: FC = () => {
  const { t } = useTranslation();

  return <S.Container>
    <div className="SkeletonLoadingData">{t('CAMPAIGN_ANALYTICS_CHART_LOADING_DATA')}
    </div>
  </S.Container>;
};

export default memo(LoadingData);
