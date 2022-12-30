import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`

   
    .cdCard {
        position: absolute;
        width: 99%;
        display:flex;
        justify-content: space-between;

        @media screen and (max-width:991px) {
            width: 95%;
        }

       

        .summaryCard  {
            width: 24%;
            height: 131px;
            box-shadow: 0px 9px 16px rgb(159 162 191 / 18%), 0px 2px 2px rgb(159 162 191 / 32%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

           
    
            
            .title {
                font-size: 22px;
                line-height: 25.78px;
                color: #223354;
                opacity: .5;

                @media screen and (max-width:991px) {
                    font-size: 19px;
                }
            }

            .content {
                display: flex;
                justify-content: center;
                width: 100%;
                height: 70px;
                align-items: center;

                .content-badge {
                    width: 10%;
                    text-align: center;
                    align-items: center;
                }

                .value{
                    color: #223354;
                    font-size: 28px;
                    font-weight: 700;
                    line-height: 37.5px;
                    margin: 0;
                }

                .badge-template {
                    width: 84px;
                    height: 21px;
                    background: #F3F3F3;
                    border-radius: 3px;
                    color: #000;
                    font-weight: 700;
                    line-height: 21.23px;
                    font-size: 13px;
                    text-align: center;
                }
            }
    
            .MuiTypography-subtitle2 {
                font-size: 12px;
                line-height: 14.06px;
                color: #223354;
                opacity: .5;
            }
        }

        
    }
    
`;