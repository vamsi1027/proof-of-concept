import styled from 'styled-components';
import { Colors } from "@dr-one/utils";

export const Container = styled.div`

    .organisation-page{

        
        

        .cr-top-main{
            max-height: fit-content;
            overflow: hidden;
        }
    }
   
    .organisation-footer {
        display: flex;
        justify-content: end;
        padding-top: 15px;
    }

    
    
    .last-row{
        .form-row{

            @media screen and (min-width: 991px) {
                margin-bottom:0 !important;
            }
        }
    }

    .MuiAutocomplete-inputRoot{
        height:auto;
    }

    .add-fcm-btn {
        cursor: pointer;
        letter-spacing: 0.4px;
        font-size: 12px;
        font-style: italic;
        font-weight: 700;
        color:${Colors.HEADERCOLOR};
        opacity:.5;

        span {
            font-size: 16px;
        }

        &:hover{
            opacity: 1;
        }
    }

    .fcm-button{
        .MuiButton-label {
            font-style: italic;
            font-size: 12px;
            line-height: 12px;
            letter-spacing: 0.4px;

            span {
                font-style: italic;
                font-size: 12px;
                line-height: 12px;
                letter-spacing: 0.4px;
            }
        }

    }
    .fcm-col {
        border: 1px solid rgba(0, 0, 0, 0.23);
        border-radius: 6px;
        padding: 20px 10px 15px;
        position: relative;

        .close-col {
            position: absolute;
            right: 8px;
            top: 3px;
            width: 16px;
            color: rgb(144, 153, 169);
            cursor:pointer;
        }
        .fcm-row{
            p{
                color:rgba(34, 51, 84, .8);

                &:first-child{
                    color:rgb(34, 51, 84);
                }
            }
        }
    }

    .timezone{
        .MuiGrid-grid-lg-6{
            padding: 0 !important; 
            flex-grow: 0;
            max-width: 100%;
            flex-basis: 100%;

            .jss8{
                max-width: 0.01px !important;
            }
        }
    }

    
`;