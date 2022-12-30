import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
	&.nav-link {
    display: inline;
    width: 100%;
    height: 44px;
    > a {
      width: 100%;
      height: 44px;
      display: inline-block;
    }
    > a:hover {
      color: ${Colors.WHITE};
      text-decoration: none;
    }
    > a:active,
    > a:enabled,
    > a:focus,
    > a:target,
    > a:visited {
      text-decoration: none;
    }
    > a > svg {
      font-size: 14px;
    }
  }
`;
