import styled from 'styled-components';
import { Colors } from "@dr-one/utils";


export const Container = styled.div`
    .preload-right-sec{
        display:flex;
        margin-left: auto;

        .device-dropdown{
            display: flex;
            align-items: center;

            p {
                font-size: 14px;
                line-height: 19.45px;
                color: rgba(34, 51, 84, 0.5);
                margin-right: 10px;
            }           

            
            .MuiAutocomplete-root {
                background: #fff;

                .MuiInputBase-root {
                    border-color: #D3D6DD;
                    min-height: 44px;
                    padding: 0 40px 0 10px;
                    height:auto;
                    width:400px;

                    .MuiAutocomplete-tag{
                        height: 26px;
                        margin: 0 3px;

                        .MuiChip-label {
                            font-size: 13px;
                            line-height: 15.23px;
                        }
                    }
                }
            }
        }
    }
    .table-head-top{
        display: flex;
        background: #fff;
        padding:11px 20px;

        .last-date{
            color: #223354;
            font-size: 15px;
            line-height: 18px;
            display: flex;
            align-items: center;
        }

        .form-select-box{
            width: 245px;
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-basis: fit-content;
            margin-left:auto;

            span {
                margin-right: 12px;
                color: rgba(34, 51, 84, 0.5);
                font-size: 14px;
                line-height: 19.45px;
            }
            .MuiInputBase-root {
                width: 151px;
                height: 36px;
            }
        }
    }

    .action-icons-container{
        width: 44px;
        height: 44px;
        border: 1px solid #D3D6DD;
        border-radius: 6px;
        background: ${Colors.WHITE};
        cursor:pointer;

        .icon-wrap {
            width: 43px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;

            .MuiSvgIcon-root{
                color: ${Colors.PRIMARY};
            }
        }
    }
    .preload-action{
        margin-right:15px;
        margin-left: 3px;

        .MuiButton-root {
            width: 107px;
            min-width: 107px !important;
            height: 44px;
            background: #fff;
            border: 1px solid #CCCEDD;
            border-radius: 6px;

            
            .MuiButton-label {
                font-size: 14px;
                line-height: 16.41px;
                color: #223354;
                justify-content: center;

                .MuiSvgIcon-root {
                    color: #1A75FF;
                    margin-left: 8px;
                    font-size: 22px;
                    margin-right: 0;
                }
            }
        }
    }

    .alert{
        margin-right:15px;
    }

    

   
`;

