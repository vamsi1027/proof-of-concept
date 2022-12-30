import styled from 'styled-components';

export const Container = styled.div`
    #mui-component-select-app{
        display:flex;

        .app-img-thumb {
            width: 26px;
            height: 26px;
            border-radius: 6px;
        }

        
        .app-details-div {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            text-align: left;
            margin-left: 8px;

            .camp-name {
                font-size: 12px;
                line-height: 14.06px;
                color: rgb(34, 51, 84);
                font-weight: 700;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                width: 100px;
            }

            .app-version {
                font-size: 10px;
                line-height: 11.72px;
                opacity: .5;
            }
        }
    }
    .more-action{
        .more-action-dropdown  {
            padding: 5px 7px;

            li {
                padding: 0px 8px !important;
                height: 35px;
                margin-bottom: 0 !important;
            }
        }
    }
    .preload-table{

        .form-select-box{
            width:180px;
        }
        .more-action-dropdown {
            &.position-left {
                left: 25px;
                right: inherit;
                z-index: 9;
            }
        }
    }

    .preload-table-wrapper {
        position: relative;
        width: 100%;
        height: 530px;

        
        .table-section {
            position: absolute;
            width: 100%;
            overflow-x: auto;
            background: #fff;
            height: 100%
        }

        
        .MuiPagination-root {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    .form-select-box {
        .Mui-disabled {
            opacity: 0.5;
        }
    }
    .width-180 {
        min-width: 180px;
    }
`;
