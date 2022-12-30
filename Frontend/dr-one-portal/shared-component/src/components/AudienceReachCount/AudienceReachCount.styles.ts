import styled from 'styled-components';
import { Colors } from "@dr-one/utils";

export const Container = styled.div`
    .reach-count{
        position: relative;
        padding: 27px 15px 45px 20px;
        margin-top: -55px;
        margin-bottom: 15px;
        margin-left: auto;
        display: flex;
        width: 100%;
        height: 89px;
        max-width: 280px;
        flex-direction: column;
        background: linear-gradient(
    135deg, #1A75FF 0%, #1854D1 100%);
        border-radius: 6px;
        box-sizing: border-box;

    h4 {
        font-size: 15px;
        color: ${Colors.WHITE};
        font-weight: 900;
        line-height: 17.58px;
    }
   p {
        margin-top: 4px;
        font-size: 12px;
        line-height: 18px;
        color: ${Colors.WHITE};
        letter-spacing: 0.4px;

        span {
            margin-left: 2px;
            font-size: 18px;
            line-height: 21.09px;
            font-weight: 700;
        }
    }

    .spinner-wrapper{

        position: absolute;
        top: 15px;
        right: 15px;
        cursor: pointer;
        img{
            padding: 4px;
            width: 35px;
            height: 35px;
        }


        &.spinner-loader{
            position: absolute;
            top: 15px;
            right: 15px;
            background: transparent;
            animation: loading 2s linear infinite ;
            cursor: default;
            pointer-events: none;
        }

        .warningFlag {
            padding: 4px;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f9b66d;
            border-radius: 50%;
            // pointer-events: none;
        }

        @keyframes loading{
            from{
              transform: rotate(360deg);
            }
            to{
              transform: rotate(0);
            }

          }
    }
    }
`;