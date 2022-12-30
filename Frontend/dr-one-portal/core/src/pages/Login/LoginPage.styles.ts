import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
    &.login-wrapper {
        display: flex;
        width: 100%;
        height:100vh;
        @media (max-width: 800px) {
            flex-direction: column;
        }
        .MuiInputBase-root.Mui-disabled {
          background-color: ${Colors.LIGHT_GREY}38;
          input {
            cursor: not-allowed;
          }
        }
        .change-account {
          text-align: end;
          margin-bottom: 20px;
        }
        .left-column {
            padding: 0 30px;
            width: 39.3%;
            display: flex;
            align-items: center;
            justify-content: center;
            @media (max-width: 800px) {
                width: 100%;
                height:40%;
            }
            .content-wrapper {
                width: 475px;
                height: 275px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            }
            h3 {
                color: ${Colors.WHITE};
                font-weight: 700;
            }
            img {
                width: 331px;
                margin-top: 57px;
                margin-bottom: 55px;
            }
            &.bg-pattern{
                background:url("/img/bg-pattern.svg");
                background-color: ${Colors.BLACK};
            }
        }
        .right-column {
            width: 60%;
            display: flex;
            align-items: center;
            justify-content: center;
            position:relative;
            @media (max-width: 800px) {
                width: 100%;
                height:60%;
            }
            .content-wrapper {
                width: 465px;
                height: 275px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                form{
                    width:100%;
                }
                h1{
                    color: ${Colors.HEADERCOLOR};
                    font-weight: 700;
                }
                h5{
                    margin-top:10px;
                    margin-bottom:55px;
                    color: ${Colors.HEADERCOLOR};
                    font-weight: 400;
                    opacity:.7;
                }
                .login-actions{
                    margin-top: 33px;
                    display:flex;
                    width: 100%;
                    justify-content: space-between;
                    p{
                        font-weight:700;
                        color:${Colors.HEADERCOLOR};
                        span{
                            color:${Colors.BTNPRIMARY};
                            font-weight:700;
                            a{
                                color:${Colors.BTNPRIMARY};
                                text-decoration:none;
                            }
                        }
                    }
                }

            }
            .footer{
                position:absolute;
            }
        }
        h4 {
            font-weight: 400;
            color: ${Colors.WHITE};
        }
    }
`;

export const Form = styled.form`
`;
