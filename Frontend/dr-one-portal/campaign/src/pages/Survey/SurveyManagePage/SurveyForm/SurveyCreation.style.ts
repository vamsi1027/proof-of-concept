import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`

.legend{
    font-size:14px;
    color:#898989;
    
    &.Mui-focused{
        color:#898989;
    }
}
.camp-btn-wrap{
    margin-top: 3px;
    position: relative;
    display: flex;
    width: 105px;

    &::after{
        position: absolute;
        height: 11px;
        width: 1px;
        background: ${Colors.BUTTON_GRAY}; 
        left: 50%;
        top: -14px;;
        content: "";
        transform: translateX(-50%);
        
    }

    button{
        margin-right:5px;
        width: 50px !important;
        min-width: 50px !important;
        height: 29px;
        background: rgba(211, 214, 221, 0.5);
        border-radius: 3px !important;
        text-align: center;
        line-height: 29px;
        font-size: 14px;
        font-weight: 700;
        color: ${Colors.PRIMARY};
        
        .MuiButton-label {
            justify-content: center;
        }

        &:hover{
            background: ${Colors.PRIMARY};
           
            span{
                color:${Colors.WHITE} !important;
            }
        }
    }

    .add_btn{
        &:first-child{
            margin-right:4px;
        }

        &.active{
            background :${Colors.PRIMARY} !important;
            .MuiButton-label{
                 color: ${Colors.WHITE};
             }
         }
    }
    
}

.rules-row{
    padding: 25px 14px 12px 13px;
    margin-top: 15px;
    display:flex;
    justify-content: space-between;
    flex-direction: column;
    border: 1px solid ${Colors.BUTTON_GRAY};   
    border-radius: 4px;

    .MuiChip-root{
        background-color: rgba(24,84,209,0.1);
        height: 26px;
        border: none;

        .MuiChip-label {
            color: ${Colors.HEADERCOLOR};
            font-size: 13px;
            line-height: 15.23px;
            font-weight: 700;
        }

        .MuiChip-deleteIcon {
            margin-right: 5px;
            width: 16px;
            margin-left: 0;
            color: ${Colors.DEL_RED};
        }
    }

    .rules-top {
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;

        .rules-name{
            p{
                font-size: 12px;
                font-weight: 700;
                margin-right: 10px;
                color: ${Colors.LIGHT_GREY};
            }
        }

        
    }

    .rules-select{
       .MuiFormLabel-root {
            top: -5px;
            font-size: 14px;
            letter-spacing: 0.4px;
        }
        .MuiInputBase-root {
            padding: 3px;
        }

    }

    .switch-wrapper{
        .switch-label{
            font-size: 14px;
            color: ${Colors.HEADERCOLOR};
            line-height: 24px;
            letter-spacing: 0.09px;
        }

        .switchery{
            margin-bottom:0;

            .MuiSwitch-root{

                .MuiSwitch-track{
                    background-color:${Colors.BTNPRIMARY} !important; 
                    opacity: 0.5;
                }
            }
        }
    }
}

    .table-preview {
        position: relative;
        min-height:50px;
        .spiner-container{
        left: 50%;
        position: absolute;
        top: 23px;
        }
    }
`;