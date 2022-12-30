import styled from 'styled-components';
import { Colors } from "@dr-one/utils";

export const Container = styled.div`
    .switch-wrapper{
        p {
            color: rgba(0, 0, 0, 0.54);
            font-size: 12px;
        }
        .switch-label-wrap {
            display: flex;
            align-items: baseline;

            .switch-label {
                font-size: 14px;
                line-height: 24px;
                color: ${Colors.HEADERCOLOR};
                letter-spacing: 0.09px;
            }
        }

        
    }

`;