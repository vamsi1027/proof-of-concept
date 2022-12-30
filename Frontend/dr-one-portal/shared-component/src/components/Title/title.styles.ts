import { Colors } from '@dr-one/utils';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  * {
    text-decoration: none;
  }
`;
export const Content = styled.h2`
  color: ${Colors.BLACK};
  font-size: 21px;
  font-weight: 500;
`;
export const Breadcrumbs = styled.div`
  display: flex;
  margin-bottom: 5px;
  color: ${Colors.GRAY};
`;
