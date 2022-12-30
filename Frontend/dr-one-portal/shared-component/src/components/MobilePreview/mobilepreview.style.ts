import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
  &.mobile-preview {
    justify-content: flex-end;
    box-shadow: 0px 9px 16px rgb(159 162 191 / 18%),
      0px 2px 2px rgb(159 162 191 / 32%);
    border-radius: 6px;
    border-width: 6px 1px 1px;
    border-color: ${Colors.SKYBLUE} ${Colors.BUTTON_GRAY} ${Colors.BUTTON_GRAY};
    border-style: solid;
    padding: 16px;
    background: ${(props) => props.color};

    @media (max-width: 800px) {
      flex-direction: column;
    }


    .toggle-buttons {
      display: flex;
      width: 100%;
      justify-content: flex-end;

      .MuiButtonGroup-root{
        button{
          min-width: 27px !important;
          max-width: 27px;

          .MuiButton-startIcon{
            margin-right: 0;
            margin-left: 0;
            color:${Colors.DEFAULT};
          }
        }
      }

      &.active-android {
        .MuiButtonGroup-root{
          button{
            &:first-child{
              background:${Colors.DEFAULT};

              .MuiButton-startIcon{
                color:${Colors.WHITE};
              }
            }

          }
        }
      }

      &.active-ios{
        .MuiButtonGroup-root{
          button{
            &:last-child{
              background:${Colors.DEFAULT};

              .MuiButton-startIcon{
                color:${Colors.WHITE};
              }
            }

          }
        }
      }
    }

    .mobile-screen {
      background-image: ${(props) => props.theme};
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      display: flex;
      width: auto;
      height: 485px;
      justify-content: center;
      align-items: center;
      margin: 1rem 0;


      .standard-button{
        &.horizontal-alignment{
          justify-content: space-between;

          button{
            min-width: 57px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            flex-grow:1;
          }
        }
      }


      .mobile-notification-screen{
            .white-screen{
              margin-bottom: 10px;
              .white-screen-content-notification{
                  display: flex;
                  justify-content: space-between;
                  width:100%;
              }
              .standard-button{
                margin: 5px 0 0 0;
                display: flex;
                justify-content: flex-start;
                width: 100%;


            }
        }
      }

      .ws-left-section {
        max-width: 80%;

        .app-name {
          font-size: 10px;
          line-height: 11.72px;
          color: #0026D9;
          font-weight: 500;
          display: flex;
          margin-bottom: 10px;
          align-items: end;

          .MuiSvgIcon-root {
            width: 14px;
            height: 14px;
            margin-right: 3px;
          }
        }
      }
      .ws-left-section h5,
        h5 {
          margin-bottom:5px;
          font-size: 10px;
          line-height: 12px;
          color: ${Colors.GREY};
          word-break: break-all;
          font-weight: 400;
        }
        .ws-left-section p,
        .inapp-full-text,
        .white-screen p {
          padding-bottom: 5px;
          font-size: 10px;
          line-height: 11px;
          color: ${Colors.BLACK};
          word-break: break-all;
        }
        .ws-right-section {
          max-width:20%;
          .icon-image {
            margin-top: 20px;
            height: auto;
            width: 35px;
            border-radius: 2px;
          }
        }

      .mobile-preview-bottom {
        display: flex;
        width: 100%;
        align-items: center;
        background:#fff;


        p {
          padding: 0;
          font-size: 10px;
          font-weight: 700;
          color: ${Colors.SKYBLUE};
          max-width: 80%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          // text-transform: uppercase;
        }
        .MuiSvgIcon-root{
          margin-left:auto;
          display: flex;
          width: 20%;
          fill: #868788;
          font-size: 17px;
          text-align: center;
        }
      }

        .pr-wrapper-templete{
          max-height: 395px;
          overflow-y: auto;
          background:#000000;

          .inapp-full-img-wrapper{

              &.full-height{
                height: calc(100% - 53px);
              }
              margin-bottom:12px;
              height: 130px;

              img {
                object-fit: contain;
              }
          }

          &.inApp-template{
            padding: 0;
          }
        }
      }



    .icon-image {
      height: 45px;
      width: 45px;
      border-radius: 50px;
    }
    .wrapper-templete {
      background: white;
      padding: 12px;
    }
    .inapp-full-img-wrapper,
    .inapp-full-video-wrapper {
      width: 100%;
      .spiner-container {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .inapp-full-img-wrapper { margin-bottom: 8px; }
    .white-screen,
    .pr-text-wrapper {
      display: flex;
      justify-content: center;
      padding-bottom: 8px;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .pr-wrapper-templete,
    .white-screen {
      margin-left: 20px;
      width: 205px;
      padding: 12px;
    }
    .pr-img-wrapper { padding: 0; }
    .pr-wrapper-templete,
    .white-screen {
      background: white;
      border-radius: 7px;
    }
    .pr-wrapper-templete .pr-img-wrapper img,
    .pr-wrapper-templete video,
    .pr-wrapper-templete img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .banner-image {
      height: auto;
      width: 100%;
    }
    .pr-wrapper-templete.custom-rich-templete .white-screen {
      width: auto;
      margin: 0;
      padding: 0;
    }
    .pr-close-wrapper {
      flex: 0 0 100%;
      max-width: 100%;
      margin-top: -3px;
      text-align: right;
      img { width: auto; height: auto; margin-right: -4px;}

      .MuiSvgIcon-root{
        color: #3c3c3c;
      }
    }
    .standard-button {
        margin: 5px 0;
        display: flex;
        width: 100%;
      }
    .white-screen button,
    .pr-wrapper-templete button,
    .standard-button button.pr-slider-btn {
      min-width: 85px;
      padding: 9px !important;
      margin: 0 5px 10px 0;
      background-color: ${Colors.DARK_BLUEBUTTON};
      color: ${Colors.WHITE};
      border-radius: 13.5px;
      outline: none;
      border: none;
      font-size: 8px;
      line-height: 10px;
    }

    .inApp-template{
      .banner-video{
        position:relative;
        .play-video{
          top: 50%;
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .MuiSvgIcon-root{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 50px;
          border: 1px solid #fff;
          background: rgba(255,255,255,0.5);
        }
      }

      .standard-button{
          flex-direction: column;
          button{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
      }

      .mobile-prev-box{
        position: relative;
        width: 100%;
        height: calc(100% - 55px);

        .inapp-full-img-wrapper{
            height: 100%;
        }

        .inapp-full-video-wrapper{
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;

          video{
            height:100px;
          }

          img{
            height:auto;
          }

          .MuiSvgIcon-root{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 50px;
            border: 1px solid #fff;
            background: rgba(255,255,255,0.5);
          }
          }
        }
      }


    }
    .inApp-template p,
    .inApp-template h5,
    .inApp-template,
    .inApp-template { text-align: center; }
    .slider-template {
      button {
        min-width: auto;
        padding: 0 !important;
        margin: 0 !important;
        background-color: transparent;
        color: ${Colors.BLACK};
        font-size: 8px;
        line-height: 0;
      }
      svg {font-size: 14px;}
    }
    // .bottom-banner {
    //   align-self: flex-end;
    //   margin-bottom: 45px;
    // }
    .top-banner {
      align-self: flex-start;
      margin-top: 38px;
    }
    .show-image {
      display: block;
    }
    .hide-image {
      display: none;
    }
    .video-height {
      height:395px;
      overflow-y:hidden;
    }
  }
  .rich-text{
    .mobile-preview-bottom{
      justify-content: center !important;
    }
  }

  .rich-image {
    background: #fff !important;

    .mobile-preview-bottom{
      justify-content: center !important;
    }
  }

  .engagement-top-bottom{
    background:transparent !important;

    .bottom-top-banner-inner{
      margin: 0 5px;
      background: #fff;
      border-radius: 8px;

      .bottom-banner-image{
        img{
          border-radius: 6px 6px 0 0;
        }
      }

      .mobile-preview-bottom{
        border-radius:0 0 6px 6px;
      }
  }
 

    .mobile-preview-bottom{
      p{
        width: 80%;
      }
    }
  }
  .notification-image-icon {
    width: 46px !important;
    height: 46px !important;
    background: #C4C4C4;
    margin-top: 30px;
  }
  .remove-height {
    height: 0px !important;
  }
  .welcome-text{
    padding-left: 12px;
    padding-right: 12px;
    word-break: break-all;
  }

  .welcome-button {
    pointer-events: none;
  }
`;
