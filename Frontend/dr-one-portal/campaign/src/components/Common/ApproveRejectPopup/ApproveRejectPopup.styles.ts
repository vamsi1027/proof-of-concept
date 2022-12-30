import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
.reject-approve{
    top: 10px;
    max-height: 100vh;
    overflow-y: auto;

    .launch-body{
        .launch-img {
            margin: 0px auto 15px;        
            display: flex;
            width: 180px;
            height: 150px;
        }
        .launch-heading{
            font-size: 23px;
            line-height: 30.11px;
            color: ${Colors.HEADERCOLOR};
            font-weight: 700;
            text-align: center;
        }
        h5{
            padding-left: 10px;
            margin-top: 15px;
            height: 35px;
            background: rgba(34, 51, 84, 0.1);
            border-radius: 6px;
            font-size: 14px;
            line-height: 19.45px;
            color: ${Colors.HEADERCOLOR};
            text-transform: uppercase;
            line-height: 35px;
        }
        ul{
            li {
                position: relative;
                padding-right: 15px;
                padding-left: 15px;
                display: flex;
                height: 38px;
                list-style-type: none;
                border-bottom: 1px solid rgba(34, 51, 84, 0.1);
                align-items: center;
                color: ${Colors.HEADERCOLOR};
                font-size: 14px;
                line-height: 16.41px;
                font-weight: 700;
                .reach-count {
                    display: flex;
                    margin-left: auto;
                    color: rgb(144, 153, 169);
                }
                p{
                    color: ${Colors.FADEGRAY};
                    font-weight: 400;
                    text-align: right;
                    display: flex;
                    margin-left: auto;
                }
            }
        }
    }
}


.reject-comment{
    margin-top: 22px;
    padding: 0 16px 24px;

    .MuiInputBase-root{
        margin-bottom: 15px;
        height: 70px;

        .MuiOutlinedInput-notchedOutline {
            height: 70px;
        }
    }

    button {
        display: flex;
        margin-left: auto;
        margin-right: auto;
    }

   
}
.reach-count-button {
    min-width: 30px !important;
    padding: 0 !important;
    margin-left: 5px;
}
.MuiButton-startIcon{
    margin: 0;
}
.spinner-wrapper{
    position: relative;
    top: 2px;
    left: 5px;
    cursor: pointer;
    img{
        padding: 4px;
        width: 22px;
        height: 22px;
        border-radius: 20px; 
        background: ${Colors.BTNPRIMARY};
    }
    &.spinner-loader{
        position: relative;
        top: 2px;
        left: 5px;
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
        pointer-events: none;
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

`;