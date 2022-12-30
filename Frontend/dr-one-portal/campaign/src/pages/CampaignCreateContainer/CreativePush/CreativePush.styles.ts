import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
    .call-to-action-wrap{
        .MuiGrid-root{

            @media screen and (max-width: 768px) {
                margin-bottom:24px;
             }

            &:last-child{
                @media screen and (max-width: 768px) {
                    margin-bottom:0;
                 }
            }
           
        }   
    }
    .message-info-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

