import React from "react";
import * as S from "./FooterView.styles";
import { useTranslation } from 'react-i18next';

function FooterView() {
  const { t } = useTranslation();

  return (
    <S.Container className='footer'>
      <p> {t('COPYRIGHT')} DigitalReef &copy; {new Date().getFullYear()}</p>
    </S.Container>
  );
}

export default FooterView;
