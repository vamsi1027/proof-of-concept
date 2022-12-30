import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.header`
    padding-right: 25px;
    padding-left: 15px;
	display: flex;
    justify-content: space-between;
	z-index: 100;
    background-color: ${Colors.WHITE};
    min-height:75px;
    box-shadow:3px 4px 5px #EFEFEF, 3px 2px 3px #EFEFEF;

    .header-left {
        display: flex;
        align-items: center;

        .mob-nav-icon {
            width: 44px;
            height: 44px;
            background: ${Colors.BLACK};
            border-radius: 7px;
            align-items: center;
            display: flex;
            justify-content: center;
            cursor:pointer;

            .MuiSvgIcon-root{
                fill:${Colors.WHITE};
            }
        }

        .location-text {
            margin-left: 15px;
            display: flex;
            color: ${Colors.LIGHTGRAY};
            font-size: 14px;
            line-height: 16.41px;

            .MuiSvgIcon-root{
                margin-right: 8px;
            }
        }
    }

    .header-right {
        display: flex;
        flex-direction: row;
        margin-left: auto;
        align-items: center;
        position:relative;


        .profile-image {
            margin-left: 15px;
            width: 37px;
            height: 37px;
            background: #0053D6;
            border-radius: 6px;
            img{
                object-fit: contain;
            }
        }

        .profile-info{
            margin-left: 10px;
            margin-right:15px;
            display: flex;
            align-items: center;
            p{
                font-size: 14px;
                font-weight: 400;
                line-height: 16px;
                color:${Colors.LIGHTGRAY};

                &.user-name-text{
                    margin-bottom: 3px;
                    font-weight: 700;
                    text-transform: capitalize;
                    max-width: 270px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color:${Colors.DARKBLUE};

                }
            }
        }

        .MuiSvgIcon-root{
            fill: ${Colors.ARROWGRAY};
            transform: rotate(180deg);
            cursor:pointer;

            &.expand{
                transform: rotate(0);
            }
        }

        .option-dropdown{
            position: absolute;
            width: 242px;
            top: 80px;

            div{
                position: absolute;
                top: 0px;
                left: 0px;
                transform: unset !important ;
                will-change: unset !important;
                width:100%;
                box-shadow:0px 9px 16px rgba(159, 162, 191, 0.18), 0px 2px 2px rgba(159, 162, 191, 0.32) !important;
            }


            .MuiList-padding {
                padding-top: 15px;
                padding-bottom: 5px;
                padding-left: 9px;
                padding-right: 10px;

                li {
                    padding-top: 5px;
                    padding-bottom: 5px;
                    padding-left: 30px;
                    padding-right: 30px;
                    margin-bottom: 5px;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    line-height: 17px;
                    color: ${Colors.LIGHTGRAY};
                    justify-content: flex-start;
                    border-radius:6px;

                    &:hover{
                        background:rgba(24, 84, 209, 0.08);
                    }



                    .MuiSvgIcon-root{
                        transform: rotate(0deg);
                        fill: ${Colors.LIGHTGRAY};
                        margin-right: 10px;
                    }



                    &.logout{
                        padding: 10px 11px 10px 12px;
                        border-top: 1px solid #E8EAEE;
                        margin-bottom: 0;
                        font-weight:500;
                        color: ${Colors.SKYBLUE};

                        .MuiSvgIcon-root{
                            fill: ${Colors.SKYBLUE};
                        }
                    }
                }
            }

            .user-details {
                margin-bottom: 25px;
                margin-left: 12px;
                display: flex;
                position: inherit;
                box-shadow: none !important;

                .profile-image {
                    margin: 0;
                    width: 48px;
                    height: 48px;
                    border-radius: 6px;
                    position: inherit;
                    box-shadow: none !important;

                    img {
                        width: 48px;
                        height: 48px;
                    }
                }

                .user-data-text {
                    position: inherit;
                    box-shadow: none !important;
                    margin-left: 10px;
                    line-height: 16.41px;
                    font-size: 14px;
                    color: #6E759F;
                    font-weight: 400;

                    .user-name-text {
                        margin-top: 6px;
                        margin-bottom: 2px;
                        font-weight: 700;
                        color: #000C57;
                        line-height: 16.41px;
                        width: 150px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .user-email-text {
                        line-height: 16.41px;
                        width: 150px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
    }

    & .link-settings{
      color: ${Colors.LIGHTGRAY};
      text-decoration: none;
    }


`;



