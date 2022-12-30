import styled from 'styled-components';
import { Colors } from "@dr-one/utils";

export const Container = styled.div`
.model-container {
    min-width: 510px;
    max-width: 510px;
    background: ${Colors.WHITE};
    box-shadow: 0px 9px 16px rgb(159 162 191 / 18%), 0px 2px 2px rgb(159 162 191 / 32%);
    border-radius: 6px;

    &.pick-image-wrapper{

        .modal-header {
            margin-bottom: 12px !important;
            h4{
                padding:0;
            }
        }

        .modal-body{
            padding:0;

            .search-box{

                padding: 0px 16px 12px !important;
                border-top:none;
                border-bottom:1px solid rgba(34,51,84,.1);

                &:hover{
                    fieldset{
                        border-color: ${Colors.PRIMARY};
                    }
                    .search-icon-magnifier{
                        color: ${Colors.PRIMARY};
                    }
                }

                fieldset{
                    top: 0;
                    border-color: rgba(233, 235, 238, 1);

                    &:hover{
                        border-color: ${Colors.PRIMARY};
                    }
                }



                .MuiInputAdornment-positionStart {
                    margin-right: 8px;
                    height: 45px;

                    .search-icon-magnifier{
                        padding-right: 17px;
                        margin-right:15px;
                        width: auto;
                        cursor: pointer;
                        color: rgba(34,51,84,0.5);
                        font-size: 25px;
                        border-right: 1px solid rgba(34,51,84,.1);

                    }

                    .MuiChip-root {
                        padding: 10px 4px 10px 10px;
                        margin-left: 7px;
                        height: 26px;
                        background:rgba(34, 51, 84, 0.1);

                        .MuiChip-label {
                            padding-left: 0;
                            padding-right: 0;
                            margin-right: 15px;
                            overflow: hidden;
                            white-space: nowrap;
                            font-size: 13px;
                            text-overflow: ellipsis;
                            line-height: 15.23px;
                            color: #223354;
                            font-weight: 700;
                        }

                        .MuiChip-deleteIcon {
                            margin-right: 0;
                            font-size: 16px;
                            color: rgba(255, 26, 67, 1);
                        }
                    }
                }

                .MuiOutlinedInput-root {
                    padding: 6px 18px;

                    .MuiInputBase-input{
                        border-left:none;
                    }
                }
            }

            .images-list-wrapper {
                position:relative;
                padding: 12px 16px !important;
                color: rgba(34, 51, 84, 0.5);
                font-size: 14px;
                line-height: 19.64px;


                ul {
                    display: flex;
                    list-style-type: none;
                    height: 140px;
                    flex-wrap: wrap;
                    overflow-y: auto;

                    li {
                        position: relative;
                        margin: 0 20px 15px 0;
                        padding: 20px 20px 10px;
                        width: 126px;
                        min-height: 126px;
                        border: 1px solid ${Colors.HR_COLOR};
                        border-radius: 6px;
                        text-align: center;
                        flex-grow:1;

                        &.active{
                            border: 1px solid ${Colors.PRIMARY};
                        }

                        p {
                            margin-top: 8px;
                            width: 100%;
                            height: 18px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            font-size: 11px;
                            text-align: left;
                            color: rgba(34,51,84,0.5);
                        }

                        img.img-uploaded {
                            width: 64px;
                            height: 64px;
                            object-fit: contain;
                            border-radius: 6px;
                        }
                        .delete-icon {
                            position: absolute;
                            top: 0;
                            right: 0;
                            padding: 2px 0 3px;
                            background-color: #FFE8EC;
                            border-radius: 0px 5px;
                            color: #FF1943;
                            font-size: 1.2rem;
                        }
                        .edit-icon {
                            position: absolute;
                            right: 5px;
                            bottom: 5px;
                            color: ${Colors.SKYBLUE};
                            font-size: 1rem;
                        }
                        .delete-icon-loading {
                            pointer-events: none;
                        }
                    }
                    &.video-wrapper {
                        li {
                            width: 35%;

                            .video-uploaded {
                                width: 100%;
                                height: auto;
                                object-fit: contain;
                                border-radius: 6px;
                            }
                        }
                    }
                }
            }

            .load-btn-wrap {
                margin-bottom: 15px;
                display: flex;
                justify-content: space-around;

                .MuiButton-root {
                    min-width: 100px;
                    height: 32px;
                    font-size: 13px;
                }
            }
        }

    .MuiOutlinedInput-notchedOutline {
        border-color: rgba(233, 235, 238, 1);
    }

}
h4 {
    color: ${Colors.HEADERCOLOR};
    font-size: 14px;
    line-height: 16px;
    padding: 20px 20px 12px;
}
p.added-file-title {
    padding-bottom: 15px;
    color: rgba(34, 51, 84, 0.5);
}
.m-body-wrapper {
    padding: 12px 20px;
}
.MuiInputBase-input {
    padding: 8px;
    border-left: 1px solid rgba(34,51,84,.1);
}
.MuiOutlinedInput-root { padding: 8px 18px; }
.search-box,
.modal-footer {
    padding: 15px 20px;
    border-width: 1px 0;
    border-color: rgba(34,51,84,.1);
    border-style: solid;
    button {
        min-width: 100px;
        font-size: 13px;
        line-height: 15.2px;
        text-transform: capitalize;
        font-weight: 700;
    }
    .MuiButton-startIcon {
        order: 1;
        margin: 0 0 0 5px;
        svg { font-size: 15px; }
    }
}
ul {
    display: flex;
    list-style-type: none;
    height: 140px;
    flex-wrap: wrap;
    overflow-y: auto;
    li {
        margin: 0 20px 15px 0;
        padding: 20px 20px 10px;
        position: relative;
        width: 126px;
        min-height: 126px;
        border: 1px solid ${Colors.HR_COLOR};
        border-radius: 6px;
        text-align: center;
        flex-grow:1;
        cursor: pointer;
        &.active{
            border: 1px solid ${Colors.PRIMARY};
        }

        p {
            margin-top: 8px;
            width: 100%;
            height: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 11px;
            text-align: left;
            color: rgba(34,51,84,0.5);
        }

        img.img-uploaded {
            width: 64px;
            height: 64px;
            object-fit: contain;
            border-radius: 6px;
        }
        .delete-icon {
            position: absolute;
            top: 0;
            right: 0;
            padding: 2px 0 3px;
            background-color: #FFE8EC;
            border-radius: 0px 5px;
            color: #FF1943;
            font-size: 1.2rem;
        }
        .edit-icon {
            position: absolute;
            bottom: 5px;
            right: 5px;
            color: ${Colors.SKYBLUE};
            font-size: 1rem;
        }
    }
    &.video-wrapper {
        li {
            width: 35%;

            .video-uploaded {
                width: 100%;
                height: auto;
                object-fit: contain;
                border-radius: 6px;
            }
        .modal-footer{
            padding: 16px;
        }
    }
}
`;