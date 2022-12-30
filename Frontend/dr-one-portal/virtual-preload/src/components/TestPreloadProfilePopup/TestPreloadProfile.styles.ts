
import styled from 'styled-components';
import { Colors } from '@dr-one/utils';
export const Container = styled.div`

.boost-summary-wrapper{    
    h6{
        margin-bottom: 5px;
        font-weight:bold;
    }
    .boost-summary{
        .boost-row {
            display: flex;
            justify-content: flex-start;

            .boost-col{
                padding: 10px;
                width: 33.3%;
                border-bottom: 1px solid #ddd;
                border-right: 1px solid #ddd;

                p{
                    color:#717171;

                    &:last-child{
                        font-weight:700;
                        color:${Colors.HEADERCOLOR};
                    }
                }

                &:last-child{
                    border-right:none;

                }
            }

            &:last-child{
                .boost-col{
                    border-bottom:none;
                }
            }
        }

        .boost-option-wrap{
            display: flex;
            align-items: center;
            margin-top: 25px;
            margin-bottom: 15px;

            p{
                margin-right:15px;
            }

            .boost-checkbox-wrap{
                margin-right: 20px;
                display: flex;
                align-items: center;

                span {
                    font-size: 14px;
                    margin-left: 5px;
                }
            }
        }
    }
}


.google-id-wrapper{
    .google-ad-id {
        margin-bottom: 20px;
    }
    h6{
        margin-bottom:10px;
    }
    .ad-container{
        margin-top:15px;
        margin-bottom:15px;
    }
}  

.preload-app-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .preload-app-items{
        margin-bottom:10px;
        width: 63px;
        height: 60px;
        border-radius: 12px;

        img{
            width: 100%;
            object-fit: cover;
            border-radius: 12px;
        }

        &.empty {
            border: 1px dashed #B6BDC9;
        }
    }
}
.preload-head {
    color: #838B9C;
    font-size: 13px;
    line-height: 19.5px;
    margin-bottom: 10px;
}

.disable-app-image {
    opacity: 0.5;
}

   
    
`;

