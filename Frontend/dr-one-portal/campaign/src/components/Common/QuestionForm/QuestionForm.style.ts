import styled from 'styled-components';
import { Colors } from "@dr-one/utils";

export const Container = styled.div`

    &.inner-container{
        position:relative;

        .header-main-btn {
            position: absolute;
            right: 0;
            top: 0;
        }

        .action-icons-container{
            display: flex;
    
            .icon-wrap {
                margin-right:10px;
                width: 44px;
                height: 44px;
                background: ${Colors.WHITE};
                border: 1px solid #D3D6DD;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor:pointer;
    
                .MuiSvgIcon-root{
                    color: ${Colors.PRIMARY};
                }
    
                &:last-child{
                    margin-right:0px;
                }
            }
        }
    }
      
    .qs-items{
        display: flex;
        justify-content: space-between;
        margin-top: 5px;

        h1 {
            width: 30px;
            height: 30px;
            border: 1px solid #0053D6;
            border-radius: 25px;
            font-size: 17px;
            line-height: 18.75px;
            color: #0053D6;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .question-box {
            display: flex;
            width: calc(100% - 50px);

            .option-values {
                max-height: 250px;
                overflow: auto;
                margin-bottom: 15px;
            }
        }
    }

    .option-rigt{
        display: flex;
        flex-direction: column;
        margin-left: auto;
    }
    
    .question-row{
        display: flex;
        
        .cr-top-wrapper {
            width: 100%;
            box-shadow: none;
        }

        .cr-top-wrapper{
            box-shadow:none !important;
        }

        .delete-aud-row{
            width: 25px;
            margin-top: 21px;
            min-width: 30px !important;

           .MuiSvgIcon-root {
                color: #8B94A5;
                font-size: 22px;
            }
        }
    }

   
    .radio-inline{
        display: flex;
        align-items: center;

        .radio-label{
            min-width:150px;  
            max-width: 500px;
            word-break: break-all;        
        }

        .delete-aud-row{
            margin:0;

            .MuiSvgIcon-root {
                color: #FF1A43;
                display: none;
            }
        }
        &:hover {
            .MuiSvgIcon-root {
                display: block;
                color: #FF1A43;
            }
        }
        &.read-only{
            &:hover {
                .MuiSvgIcon-root {
                    display: block;
                    color:rgba(0, 0, 0, 0.26);
                }
            }
        }
    }

   .qus-right-btn {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .delete-aud-row{
            cursor:pointer;

            &:hover{

                .MuiSvgIcon-root{
                    color: #FF1A43;
                }
               
            }
        }

        .MuiSvgIcon-root{
            color: #8B94A5;
            font-size: 22px;
            cursor:pointer;

            &:hover{
                color:rgb(25, 117, 255);
            }
        }
    }

   

    
}
`;

