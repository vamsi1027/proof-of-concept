import styled from 'styled-components';
import { Colors } from "@dr-one/utils";

export const Container = styled.div`
    .success-pop-up{

        .modal-header {
            border-bottom: none;
        }
        .modal-body {
            text-align: center;

            h1 {
                margin-bottom: 35px;
                color: ${Colors.HEADERCOLOR};
            }
        }
        .modal-footer {
            padding-bottom:28px;
            border: none;
            text-align:center;

            .MuiButton-root {
                margin: 0 auto;
            }
        }
    }

`;