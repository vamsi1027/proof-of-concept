import styled from 'styled-components';
import { Colors } from "@dr-one/utils";

export const Container = styled.div`
    .switch-wrapper{
        p {
            color: rgba(0, 0, 0, 0.54);
            font-size: 12px;
        }
        .switch-label-wrap {
            display: flex;
            align-items: baseline;

            .switch-label {
                font-size: 14px;
                line-height: 24px;
                color: ${Colors.HEADERCOLOR};
                letter-spacing: 0.09px;
            }
        }

        
    }

    .create-app{
        .file-name{
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            max-width: calc(100% - 150px);
        }
    }

    .apk-detail-wrap{
        width:100%;
        max-height: 400px;
        overflow-y: auto
    }

    .app-heading {
        background: rgba(24, 84, 209, 0.08);
        height: 44px;
        border-radius: 5px;
        color: #223354;
        font-weight: bold;
        line-height: 44px;
        padding: 0 10px;
        margin-bottom: 25px;
        font-size:14px;
    }

    .app-data-list{
        padding: 0 15px;
        margin-bottom: 15px;

        li{
            display: flex;
            justify-content: space-between;
            color: #223354;
            font-size: 12px;
            line-height: 14.06px;
            border-bottom: 1px solid rgba(34, 51, 84, .1);
            align-items: center;
            height: 45px;

            img {
                width: 26px;
                height: 26px;
                border-radius: 4px;
                box-shadow: 0px 4px 8px rgb(0 0 0 / 18%);
            }
        }
    }

    .channel-association{
        p {
            color: #283859;
            font-size: 12px;
            margin-bottom: 5px;
        }
        .MuiInputBase-root{
            height:auto;
            // overflow: hidden;
            // height: 51px;
        }
    }
    .progress-bar-apk {
        float: left;
        width: 100%;
        color: ${Colors.PRIMARY};
    }

    .count-wrapper{
        align-items: center !important;
        margin-top: 3px;

        .count-btn{
            background: #E8F1FF;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 3px;

            .switchery{
                margin:0;
            }
        }
    }
   
`;