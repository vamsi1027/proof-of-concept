import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
    .rows {
        display: grid;
        gap: 1rem;
        margin:0 -12px;
        flex-wrap: wrap;
        &.cd-data-section{
            padding-left:12px !important;
          }
    }
`;

