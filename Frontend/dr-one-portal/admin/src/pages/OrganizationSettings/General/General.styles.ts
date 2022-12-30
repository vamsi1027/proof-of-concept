import styled from 'styled-components';
import { Colors } from "@dr-one/utils";

export const Container = styled.div`

    
    .org_logo{
        height: 100%;
        background-color: #fff;
         width: 100%;
         border: 1px solid rgb(204, 204, 204);
         position: absolute;
         z-index: 1;
         pointer-events: none;
    }
    .nnot-allowed-image{
        width: 20ch;
        color: red;
    }

    .logo-label{
        font-size: 12px;
        line-height: 12px;
        color: rgba(0, 0, 0, 0.54);
        margin-top: -1px;
        display: flex;
        margin-bottom: 6px;
    }
    .form-row{
        margin-bottom:33px !important;
    }
`;