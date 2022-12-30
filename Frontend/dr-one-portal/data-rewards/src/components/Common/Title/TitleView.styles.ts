import { Colors } from '@dr-one/utils';
import styled from 'styled-components';
export const Container = styled.div`
	display: flex;
  flex-direction: column;
`;
export const Content = styled.h2`
	color: ${Colors.HEADERCOLOR};
	font-size: 18px;
	font-weight: 700;

  @media screen and (min-width: 1400px) {
    font-size: 30px;
  }

  @media screen and (max-width: 1100px) {
    font-size: 26px;
  }
`;
