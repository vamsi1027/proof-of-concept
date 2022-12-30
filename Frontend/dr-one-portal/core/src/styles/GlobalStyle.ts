import { createGlobalStyle } from 'styled-components';
import { Colors } from '@dr-one/utils';
const fonts = "'Roboto', 'Source Sans Pro', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' !important;";
export default createGlobalStyle`
// Common style ------------------------------------------------------------------------------------------------------------
    * {
        padding: 0;
        margin:0;
        outline:0;
        box-sizing:border-box
    }
    html, body, #root {
        height: 100%;
    }
    body{
        background:${Colors.BGGRAY};
    }

    body, * {
        font-family: ${fonts};
        text-rendering: optimizeLegibility !important;
        -webkit-font-smoothing: antialiased !important;
    }
    ::selection {
        background: ${Colors.DEFAULT};
    }
    .MuiPaper-elevation1{
        box-shadow:none !important;
    }
    .pointer {
        cursor: pointer;
    }
    .display-inline{
        display:inline-block;
    }
// Common style End --------------------------------------------------------------------------------------------------------
//  Srollbar Style ---------------------------------------------------------------------------------------------------------
    .no-scroll-y{
        overflow:hidden !important;
        max-height: fit-content !important;
    }
    .no-scroll{
        overflow-x:unset !important;;
    }
    *::-webkit-scrollbar {
        height: 8px;
        width: 8px;
    }
    *::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey;
        border-radius: 10px;
    }
    *::-webkit-scrollbar-thumb {
        background: ${Colors.BODY};
        border-radius: 10px;
    }
    *::-webkit-scrollbar-thumb:hover {
        background: ${Colors.SECONDARY};
}

/* Custom scrollbar for Application */

*::-webkit-scrollbar {
	background-color: #eee;
	border-radius: 0.25rem;
	height: 0.25rem;
	width: 0.25rem;
}

*::-webkit-scrollbar-thumb {
	background-color: #aaa;
	border-radius: 0.25rem;
}
//  Srollbar Style End ---------------------------------------------------------------------------------------------------------

//  Typography Style -----------------------------------------------------------------------------------------------------------
    h1, h2, h3, h4, h5, h6, p, ul, li {
        margin: 0px;
    }
    h1{
        font-size: 30px;
        line-height: 35.16px;
        &.header{
            font-weight:bold;
        }
        &.page-title{
            color:${Colors.HEADERCOLOR};
            font-weight:700;
        }
    }
    h2{
        font-size: 28px;
        line-height: 32.2px;
    }
    h3{
        font-size: 26px;
        line-height: 31.2px;
    }
    h4{
        font-size: 22px;
        line-height: 28.6px;
    }
    h5{
        font-size: 17px;
        line-height: 19.92px;
    }
    h6{
        font-size: 16px;
        line-height: 18.05px;
    }
    p{
        font-size:14px;
        line-height: 24px;
    }
//  Typography Style End ---------------------------------------------------------------------------------------------------------
//  Alignment Style --------------------------------------------------------------------------------------------------------------
    .align-left{
        text-align:left !important;
    }
    .align-center{
        text-align:center;
    }
    .align-right {
        text-align:right;
    }
    .flex-right {
        display:flex !important;
        justify-content: end !important;
    }
    .flex-space-between{
        display: flex;
        justify-content: space-between;
    }
    .position-relative{
        position:relative;
    }
//  Alignment Style End ---------------------------------------------------------------------------------------------------------
// Helper Styles ----------------------------------------------------------------------------------------------------------------
    .no-margin {
        margin: 0 !important;
    }
    .no-padding {
        padding: 0 !important;
    }
    .mt-10 {
        margin-top: 10px;
    }
    .mt-15{
        margin-top:15px !important; 
    }
    .mt-25 {
        margin-top: 25px !important;
    }
    .mr-15 {
        margin-right: 15px;
    }
    .mr-10 {
        margin-right: 10px;
    }
    .mb-8 {
        margin-bottom: 8px;
    }
    .mb-10 {
        margin-bottom: 10px;
    }
    .mb-20 {
        margin-bottom: 20px;
    }
    .mb-25 {
        margin-bottom: 25px;
    }
    .ml-10 {
        margin-left: 10px;
    }
    .pt-10 {
        padding-top: 10px;
    }
    .pb-15{
        padding-bottom:15px !important;
    }
// Helper Styles End -----------------------------------------------------------------------------------------------------------
// Form Layout Elements---------------------------------------------------------------------------------------------------------
    input, button {
        font-family: ${fonts};
    }
    .MuiInputBase-root{
        height:40px;
    }
    .row {
        margin:0 -12px;
        display: flex;
        width:calc(100% + 22px);
        flex-wrap: wrap;
    }
    .optional-msg {
        margin-left: 14px;
        height: 14px;
        font-size: 8px;
        line-height: 20px;
        letter-spacing: 0.09px;
        font-style: italic;
        color:${Colors.FADEGRAY};
    }
    .information{
        color:${Colors.BTNPRIMARY};
    }
    .required {
        color: ${Colors.FADEGRAY};
        font-size: 8px;
        letter-spacing: 0.09px;
        line-height: 24px;
        font-style: italic;
    }
    .long-name-labels{
        width:412px !important;
    }
    .email-long-label{
        .MuiInputLabel-formControl {
            width:400px !important;
        }
    }
    .form-row{
        margin-bottom:24px !important;
        width:100%;
        &:last-child{
            margin-bottom:0;
        }
    }
    .MuiGrid-item{
        padding:0 12px;
    }
    .error {
        margin-top: 3px;
        margin-left: 14px;
        font-size: 0.75rem;
        color: ${Colors.DEL_RED};
    }
    .MuiPickersTimePickerToolbar-hourMinuteLabel{
        .MuiButton-root.MuiPickersToolbarButton-toolbarBtn{
            min-width:auto !important;
            .MuiButton-label{
                h2 {
                    font-size: 34px !important;
                }
            }
        }
        .MuiPickersTimePickerToolbar-separator {
            font-size: 34px;
            margin: 0 5px;
            height: 33px !important;
            display: flex;
            align-items: center;
        }
    }
    .MuiGrid-align-items-xs-flex-end{
        .MuiButton-root.MuiPickersToolbarButton-toolbarBtn{
            min-width:auto !important;
            .MuiButton-label{
                h3 {
                    font-size: 34px !important;
                }
            }
        }
        .MuiPickerDTToolbar-separator {
            font-size: 34px;
            margin: 0 5px;
            height: 33px !important;
            display: flex;
            align-items: center;
        }
    }
    .MuiPaper-outlined{
        border: none !important;
        box-shadow: 0px 9px 16px rgb(159 162 191 / 18%), 0px 2px 2px rgb(159 162 191 / 32%);
    }
    .disabled-function {
        opacity: .5;
        cursor: not-allowed;
        pointer-events: none;
    }


// Form Layout End ---------------------------------------------------------------------------------------------------------
// Input Style  ------------------------------------------------------------------------------------------------------------
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        transition: background-color 5000s ease-in-out 0s;
    }
    .MuiTextField-root{
        .MuiInputLabel-outlined.MuiInputLabel-shrink {
            background: ${Colors.WHITE};
        }
        .MuiInputBase-root{
            font-size:14px;
            &:hover{
                border-color:${Colors.PRIMARY};
                .MuiOutlinedInput-notchedOutline{
                    border-color:${Colors.PRIMARY};
                }
            }
        }
    }
// Input Style End  ------------------------------------------------------------------------------------------------------------
// Seletbox Styles -------------------------------------------------------------------------------------------------------------
    .form-select-box{
        .MuiFormLabel-root{
            padding: 0 9px;
            transform:translate(9px, -6px) scale(0.75) !important;
            background:${Colors.WHITE};
            letter-spacing: 0.4px
            color:rgba(34, 51, 84, 0.5);
        }
        .MuiInputBase-root{
            margin:0;
            border:1px solid rgba(0, 0, 0, 0.23);
            border-radius:6px;
            font-size:14px;
            .MuiSelect-selectMenu{
                padding-left: 14px;
                &:focus{
                    background-color: transparent;
                }
            }
            &.MuiInput-underline{
                &::before{
                    display:none;
                }
                &::after{
                    display:none;
                }
            }
            .MuiSelect-icon{
                right:10px;
            }
            &:hover{
                border-color:${Colors.PRIMARY};
            }
            &.Mui-disabled {
                &:hover {
                    border-color: rgba(0, 0, 0, 0.23);
                }
            }
        }
        .MuiOutlinedInput-notchedOutline{
            border-color:transparent;
        }

        &:hover{
            .MuiOutlinedInput-notchedOutline{
                border-color:transparent !important;
            }
        }
    }
    .MuiSelect-select{
        &:focus{
            background-color:transparent !important;
        }
    }
// Seletbox Styles End ---------------------------------------------------------------------------------------------------------
// Check Box Style -------------------------------------------------------------------------------------------------------------
    .MuiCheckbox-colorPrimary{
        .MuiIconButton-label{
            .MuiSvgIcon-root{
                fill: ${Colors.BTNPRIMARY} !important;
            }
        }
    }
    .MuiFormControl-root .form-row span{
        color: ${Colors.BTNPRIMARY} !important;
    }
    .MuiCheckbox-colorPrimary.Mui-checked {
        color: ${Colors.BTNPRIMARY} !important;
    }
// Check Box Style End ---------------------------------------------------------------------------------------------------------
// Radio Button Style ---------------------------------------------------------------------------------------------------------
    .MuiRadio-colorPrimary.Mui-checked{
        color: ${Colors.BTNPRIMARY} !important;
        .MuiSvgIcon-root{
            fill: ${Colors.BTNPRIMARY} !important;
        }
    }
// Radio Button Style End ---------------------------------------------------------------------------------------------------------
// Time Filed Style ------------------------------------------------------------------------------------------------------------
    .select-timezone-container{
        .MuiInputLabel-outlined {
            z-index: 1;
            transform: translate(14px , -6px) scale(0.75);
            pointer-events: none;
            background: ${Colors.WHITE};
            padding-right: 7px;
        }
        .MuiSelect-select{
            &:focus{
                background-color:transparent;
            }
        }
    }
// Time Filed Style End ---------------------------------------------------------------------------------------------------------
// Date Filed Style -------------------------------------------------------------------------------------------------------------
    .select-date-container{
        .MuiInputLabel-outlined {
            z-index: 1;
            transform: translate(14px , -6px) scale(0.75);
            pointer-events: none;
            background: ${Colors.WHITE};
        }
        .MuiInputBase-root{
            padding-right: 10px;
            .MuiIconButton-root{
                padding:0;
                .MuiIconButton-label {
                    color: rgba(34, 51, 84, 0.5);
                }
            }
        }
    }
// Date Filed Style End ---------------------------------------------------------------------------------------------------------
// switchery Style --------------------------------------------------------------------------------------------------------------
    .switchery{
        margin-bottom: 12px;
        .MuiFormControlLabel-root{
            margin-right:0;
            margin-left:0;
            .MuiSwitch-root{
                padding:12px 0;
                margin-right: 7px;
                width: 39px;
                height: 38px;
                .MuiSwitch-colorSecondary{
                    position:absolute;
                    padding:9px 0;
                    color: ${Colors.BTNPRIMARY};
                    &.Mui-checked {
                        color: ${Colors.BTNPRIMARY};
                        & + .MuiSwitch-track{
                            background-color:${Colors.BTNPRIMARY} !important;
                            opacity: 0.5;
                        }
                    }
                    &.Mui-disabled {
                        color: ${Colors.DISABLEDCOLOR};
                    }
                    .MuiSwitch-thumb{
                        width: 18px;
                        height: 18px;
                    }
                    &:hover{
                        background-color: transparent;
                    }
                }
                .MuiSwitch-track{
                    position: relative;
                    top: 2px;
                    height: 8px;
                    background:#E9E9EA;
                    box-shadow: inset 0px 1px 1px rgb(119 126 165 / 25%);
                    opacity: 1;
                }
            }
            .MuiFormControlLabel-label{
                font-size: 14px;
                line-height: 24px;
                letter-spacing: 0.09px;
                color: ${Colors.HEADERCOLOR};
            }
        }

        &.org-switchery{
            margin-bottom:10px;
            .MuiFormControlLabel-root{
                .MuiSwitch-root{
                    padding: 6px 0px;
                    height: 25px;

                    .MuiSwitch-colorSecondary{
                        padding: 3px 0px;
                    }
                }
            }
        }
    }
    .switch-2-options{
        margin-left:-12px;

        .switch-label{
            display: flex;
            align-items: center;
            font-size: 14px;
            line-height: 24px;
            letter-spacing: 0.09px;
            color: ${Colors.HEADERCOLOR};
        }
        .switchery {
            margin-bottom: 0px;
            .MuiFormControlLabel-root {
                .MuiSwitch-root{
                    margin-right: 0;
                }
            }
        }
    }
// switchery Style End ---------------------------------------------------------------------------------------------------------
// Slider Style ----------------------------------------------------------------------------------------------------------------
    .MuiSlider-root{
        color: ${Colors.BTNPRIMARY} !important;
        .MuiSlider-rail{
            background-color: ${Colors.HEADERCOLOR} !important;
            opacity:.2;
        }
    }
// Slider Style End ------------------------------------------------------------------------------------------------------------
// Button Style ----------------------------------------------------------------------------------------------------------------
    .MuiButton-root{
        min-width: 130px !important;
        height: 30px;
        text-transform: capitalize !important;
        font-size: 13px;
        line-height: 15px;
        font-weight: 700;
        cursor: pointer;
        &.MuiButton-containedPrimary{
            color: ${Colors.WHITE} !important;
            background: ${Colors.BTNPRIMARY} !important;
            border-radius:4px;
        }
        &:hover {
            box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
        }
        &.button-xs {
            padding: 5px 25px !important;
            color: ${Colors.LIGHTGRAY};
            border-radius: 6px;
            border: 1px solid ${Colors.LIGHTGRAY};
            font-size: 13px;
            line-height:15px;
            text-transform: capitalize;
            &.MuiButton-outlinedPrimary{
                color: ${Colors.PRIMARY};
                border: 1px solid ${Colors.PRIMARY};
            }
            &.MuiButton-textPrimary{
                padding: 5px 8px 5px 5px !important;
                min-width: 80px;
                border: none;
                color: ${Colors.BTNPRIMARY};
                .MuiButton-label {
                    font-size: 13px;
                    line-height: 15.23px;
                    font-weight: 700;
                    .MuiSvgIcon-root {
                        margin-right: 5px;
                        font-size: 18px;
                    }
                }
            }
        }
        &.button-sm{
            padding: 7px 16px !important;
            border-radius: 6px;
            box-shadow: none;
            text-transform: capitalize;
            .MuiButton-label {
                font-size: 13px;
                line-height: 15.23px;
                color: ${Colors.WHITE};
            }
        }
        &.button-lg{
            padding: 14px 15px !important;
            height:auto;
            border-radius: 6px;
            text-transform: capitalize;
            .MuiButton-label{
                font-size: 16px;
                line-height: 18.75px;
                font-weight: 700;
                .MuiButton-startIcon {
                    margin-right: 5px ;
                    margin-left: 0 ;
                    display: inherit;
                    .MuiSvgIcon-root {
                        font-size: 23px;
                    }
                }
            }
            &.dark-blue{
                background-color: ${Colors.DEFAULT} !important;
                color: ${Colors.WHITE};
            }
            &.success{
                background-color: ${Colors.SUCCESS} !important;
                color: ${Colors.WHITE};
            }
        }
        &.Mui-disabled{
            opacity:.5;
        }
        &.MuiButton-text {
            background-color: transparent;
            box-shadow: none;
            text-align: left;
            .MuiButton-label {
                justify-content: flex-start;
                font-size: 13px;
                line-height: 15.23px;
                font-weight: 700;
                color: ${Colors.BTNPRIMARY};
                .MuiSvgIcon-root {
                    margin-right: 3px;
                    font-size: 18px;
                }
            }
            &:hover{
                background:transparent;
            }
            .MuiTouchRipple-root{
                display:none;
            }
        }
    }
// Button Style End ---------------------------------------------------------------------------------------------------------
// Login Password Style --------------------------------------------------------------------------------------------
    .MuiFormControl-root{
        width: 100%;
        .form-row{
            position:relative;
            margin-bottom:25px;
            &:last-child{
                margin-bottom:0;
            }
            .view-password-icon {
                position: absolute;
                top: 50%;
                right: 14px;
                transform: translateY(-50%);
                cursor: pointer;
                svg{
                    fill: ${Colors.HEADERCOLOR};
                    opacity:.5;
                }
                .view-eye{
                    display:block;
                }
                .close-eye{
                    display:none;
                }
                &.view_icon{
                    .view-eye{
                        display:none;
                    }
                    .close-eye{
                        display:block;
                    }
                }
            }
            .jss5 {
                padding: 0px !important;
            }
            span {
                font-size: 14px;
                FONT-VARIANT: JIS04;
                letter-spacing: 0.3px;
                color: ${Colors.HEADERCOLOR} !important;
                a{
                    color: ${Colors.BTNPRIMARY} !important;
                    text-decoration:none;
                }
            }
        }
        &:hover{
            border-color:${Colors.HEADERCOLOR};
        }
    }
// Login Password Style End ----------------------------------------------------------------------------------------
// Audience And / OR Section Style  -----------------------------------------------------------------------------------------
    .audience-row {
        padding: 25px 14px 12px 13px;
        margin:0 0 0 0;
        position:relative;
        width: 100%;
        display: flex;
        flex-direction:column;
        justify-content: space-between;
        border: 1px solid ${Colors.BUTTON_GRAY};
        border-radius: 4px;
        &:hover{
            border-color:${Colors.PRIMARY};
            .MuiOutlinedInput-root{
                border-color: ${Colors.PRIMARY};
            }
        }
        .seperator-wrap{
            margin-top:10px;
            position:relative;
            &:before{
                position: absolute;
                top: 15px;
                left: 0;
                width: 100%;
                height: 1px;
                content: "";
                background: ${Colors.PRIMARY};
                z-index:8;
            }
            .seperator-text {
                margin-bottom: 15px;
                position: relative;
                left: 50%;
                transform: translateX(-50%);
                width: 50px;
                height: 29px;
                background: rgb(209 221 246) !important;
                border-radius: 3px;
                text-align: center;
                line-height: 29px !important;
                font-size: 14px;
                color: ${Colors.PRIMARY} !important;
                z-index:9;
            }
            .delete-aud-row{
                width: 3%;
                display: flex;
                align-items: center;
                margin-left: auto;
                .MuiSvgIcon-root {
                    color: ${Colors.PRIMARY};
                    cursor:pointer;
                    display:block;
                }
            }
        }
        .group-label {
            position: absolute;
            top: -14px;
            left: 13px
            z-index: 3;
            height: 26px !important;
            background: #efefef;
            font-weight: 700;
            color: ${Colors.HEADERCOLOR};
            opacity:1 !important;
            z-index:2;
            .MuiChip-deleteIcon {
                width: 16px;
                color: ${Colors.DEL_RED};
            }
        }
        .auto-complete-field{
            width: 35%;
            .MuiAutocomplete-endAdornment{
                display:none;
            }
            .MuiInputLabel-outlined {
                padding-right: 4px;
                padding-left: 4px;
                z-index: 1;
                transform: translate(14px, -6px) scale(0.75);
                pointer-events: none;
                background: ${Colors.WHITE};
                color:rgba(34, 51, 84, 0.5);
            }
            .MuiInputBase-root{
                height:40px;
                .MuiInputBase-input {
                    padding:0;
                }
            }
            .MuiIconButton-root{
                &.MuiAutocomplete-popupIndicator{
                    padding:2px !important;
                }
            }
            .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
                border-color: ${Colors.PRIMARY} !important;
                border-width:1px;
            }
            .MuiChip-root{
                width: 100%;
                height: auto;
                min-height: 26px;
                background-color: rgba(24, 84, 209, 0.1);
                border: none;
                .MuiChip-label {
                    padding-top: 6px;
                    padding-bottom: 6px;
                    width: 100%;
                    white-space: normal;
                    overflow: hidden;
                    font-size: 13px;
                    line-height: 15.23px;
                    font-weight: 700;
                    text-overflow: ellipsis;
                    color: ${Colors.HEADERCOLOR};
                }
                .MuiChip-deleteIcon {
                    margin-right: 5px;
                    margin-left: 0;
                    width: 16px;
                    color:${Colors.DEL_RED};
                }
            }
            &.vertical-align {
                .MuiAutocomplete-endAdornment{
                    top: -2px !important;
                }
            }
        }
        .auto-complete-fields{
            display:flex;
            place-items: center;
            gap: 5px;
            width: calc(100% - 4%);
        }
        .btn-small{
            min-width:60px !important;
        }
        .switch-wrapper{
            .switchery {
                margin-bottom: 0;
                .MuiSwitch-root{
                    margin-right: 5px;
                    margin-left: 5px;
                    .MuiSwitch-track{
                        background-color:${Colors.BTNPRIMARY} !important;
                        opacity: 0.5;
                    }
                }
            }
            .switch-label{
                font-size: 14px;
                color: ${Colors.HEADERCOLOR};
                line-height: 24px;
                letter-spacing: 0.09px;
                &.select {
                    font-weight: bold;
                }
            }
        }
        .orbtn-wrap {
            display: flex;
            width: 25%;
            text-align: right;
            justify-content: space-between;
            align-items: center;
            .MuiButtonBase-root{
                padding-right: 9px !important;
                padding-left: 9px !important;
                margin-right:5px;
                min-width: 43px;
                height: 29px;
                background-color: rgba(24, 84, 209, 0.2) !important;
                border-radius: 3px;
                box-shadow: none;
                font-weight: 700;
                line-height: 29px;
                color: ${Colors.PRIMARY};
                &.active {
                    background-color: ${Colors.PRIMARY} !important;
                    color: ${Colors.WHITE};
                }
                &.button-add {
                    width: 20px;
                    height: 19px;
                    min-width: 20px !important;
                    border: 1px solid rgba(24, 84, 209, 0.2) !important;
                    .MuiButton-label{
                        color: ${Colors.PRIMARY};
                        font-weight:700;
                    }
                }
            }
            .MuiOutlinedInput-root{
                height:40px;
            }
        }
        &.padding-0{
            .MuiGrid-item{
                padding:inherit !important;
            }
        }
        .audience-action {
            display: flex;
            position: absolute;
            top: -20px;
            justify-content: flex-end;
            right: 15px;
            width: 75%;
            @media screen and (max-width:991px) {
                width: 100%;
                right: 50px;
            }
            .switch-wrapper {
                padding-right: 50px;
                background: #fff;
                padding-left: 15px;
            }
            .orbtn-wrap{
                width:18%;
                background: #fff;
            }
        }
        .delete-aud-row{
            width: 3%;
            .MuiSvgIcon-root {
                color: ${Colors.PRIMARY};
                cursor:pointer;
                display:none;
            }
        }
    }
// Audience And / OR Section Style End ---------------------------------------------------------------------------------------
// Tag Style -----------------------------------------------------------------------------------------------------------------
    .MuiAutocomplete-tag {
        height: 26px;
        border: none;
        background-color: rgba(24,84,209,0.1) !important;
        font-size: 13px;
        line-height: 15.23px;
        font-weight: 700;
        color:  ${Colors.HEADERCOLOR};
        .MuiChip-deleteIcon {
            margin-right: 5px;
            margin-left: 0;
            width: 16px;
            color:${Colors.DEL_RED};
            &:hover{
                color:${Colors.DEL_RED};
            }
        }
    }
    span.MuiAutocomplete-tag{
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-radius: 25px;
    }
// Tag Style End -------------------------------------------------------------------------------------------------------------
// Search Audience Cluster Style --------------------------------------------------------------------------------------
    .select-list{
        padding:0;
        display: flex;
        width:100%;
        justify-content: space-between;
        align-items:center;
        span{
            margin-right:10px;
            width:60%;
            font-size:11px;
            line-height:12.89px;
            word-break: break-all;
            &.reach-count{
                display:flex;
                width:40%;
                align-items:center;
                text-align:right;
                color:${Colors.PRIMARY};
                svg{
                    width:14px;
                }
            }
        }
    }
// Search Audience Cluster Style End ----------------------------------------------------------------------------------
.targeting-rules{
    .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input {
        padding: 2.5px 4px !important;
    }
    .MuiAutocomplete-root{
        .MuiInputBase-root{
            min-height: 40px;
            height: auto;
        }
    }
}
.seperator-wrap-and{
    padding-top: 15px;
    padding-bottom: 20px;
    position: relative;
    display: flex;
    width: 115px;
    background: ${Colors.WHITE};
    z-index: 2;
    &:before{
        position: absolute;
        top: 50%;
        left: 46%;
        z-index: 1;
        content: "";
        width: 1px;
        height: 80%;
        background: ${Colors.BUTTON_GRAY};
        transform: translate(-50%, -50%);
    }
    .and-box {
        position: relative;
        z-index: 3;
        display: flex;
        background: ${Colors.WHITE};
        .MuiButtonBase-root{
            &.Mui-selected{
                background:${Colors.PRIMARY};
                color:${Colors.WHITE};
            }
        }
    }
    .seperator-text {
        margin-right:5px;
        width: 50px;
        height: 29px;
        background: rgba(211, 214, 221, 0.5);
        border-radius: 3px !important;
        text-align: center;
        line-height: 29px;
        font-size: 14px;
        font-weight: 700;
        color: ${Colors.PRIMARY};
        &.active{
            background:${Colors.PRIMARY};
            color:${Colors.WHITE};
        }
    }
}
.bottom-btn-wrap{
    margin-top:15px;
    display:flex;
    width:100%;
    .MuiGrid-item{
        display: flex;
        width: 100%;
        justify-content: space-between;
    }
    .add-bottom-btn-wrap{
        position:relative;
        margin-left: 43px;
        &:before{
            position: absolute;
            top: -7px;
            left: 50%;
            z-index: 1;
            content: "";
            width: 1px;
            height: 13px;
            background: ${Colors.BUTTON_GRAY};
            transform: translate(-50%, -50%);
        }
        .add_btn {
            position: relative;
            margin-top: 0px !important;
            padding: 0 !important;
            z-index: 2;
            width: 20px;
            height: 19px;
            min-width: 20px !important;
            background: rgba(24,84,209,0.2) !important;
            border-radius: 3px !important;
            box-shadow: none !important;
            border:1px solid rgba(24,84,209,0.2) !important;
            font-weight: 700;
            font-size: 14px !important;
            .MuiButton-label{
                color: ${Colors.PRIMARY};
                font-weight:700;
            }
            &:hover{
                border:1px solid rgba(24,84,209,0.2) !important;
            }
            &.active{
               background :${Colors.PRIMARY} !important;
               .MuiButton-label{
                    color: ${Colors.WHITE};
                }
            }
        }
    }
    .create-audiance-btn {
        margin-left: auto;
        padding: 0 7px !important;
        display: flex;
        height: 35px;
        border: 1px solid ${Colors.DEFAULT} !important;
        border-radius: 6px !important;
        height: 35px;
        text-decoration: none;
        color: ${Colors.DEFAULT};
        font-size: 12px;
        line-height: 32px;
        span {
            margin-right: 3px;
            font-size: 16px;
        }
        .MuiButton-label {
            font-size: 12px;
            line-height: 14.06px;
            text-transform: capitalize;
            font-weight: 500;
            color: ${Colors.DEFAULT};
            .MuiSvgIcon-root {
                width: 22px;
            }
        }
        &:hover{
            background: ${Colors.DEFAULT};
            color: ${Colors.WHITE};
        }
    }
}
.small-tooltip{
    .tooltip-icons{
    .MuiSvgIcon-root{
                font-size:15px;
            }
        }
}
.MuiTooltip-tooltip{
    a{
        color: ${Colors.PENDING};
    }
}
.label-tooltip{
    display:flex;
    align-items: center;
    .tooltip-icons{
        position:relative;
        top:-10px;
        .MuiSvgIcon-root{
            color: ${Colors.PROGRESS_GREY};
            &:hover{
            color: ${Colors.PRIMARY};
            }
        }
    }
    &.cc-label-text{
        .tooltip-icons{
            top:-2px;
            .MuiSvgIcon-root{
               font-size: 15px;
            }
        }
    }
}


// Custom File Style -----------------------------------------------------------------------------------------------------
    .file-input-field{
        position: relative;
        padding: 4px 0;
        height: 40px;
        border: 1px solid ${Colors.BUTTON_GRAY};
        border-radius: 4px;
        .label {
            position: absolute;
            padding: 0 4px;
            top: -7px;
            left: 13px;
            background: ${Colors.WHITE};
            color: rgba(34, 51, 84, 0.5);
            font-size: 12px;
            line-height: 12px;
        }
        input {
            position: absolute;
            top: 50%;
            z-index: 2;
            right: 12px;
            width: 105px;
            height: 24px;
            transform: translateY(-50%);
            opacity: 0;
            + span{
                position: absolute;
                top: 50%;
                right: 12px;
                padding-left: 3px;
                display:flex;
                width: 105px;
                height: 24px;
                transform: translateY(-50%);
                align-items:center;
                justify-content:center;
                background: ${Colors.PRIMARY};
                color: ${Colors.WHITE};
                font-size: 11px;
                line-height: 24px;
                border-radius: 4px;
                .MuiSvgIcon-root {
                    margin-left: 7px;
                    font-size: 13px;
                }
            }
        }
        .file-name {
            margin-top: 6px;
            margin-left: 15px;
            display: flex;
            align-items: center;
            font-size: 11px;
            color: ${Colors.HEADERCOLOR};
            .MuiSvgIcon-root {
                margin-top: -2px;
                margin-right: 3px;
                font-size: 13px;
                opacity:.5;
            }
        }
    }
// Custom File Style End  ------------------------------------------------------------------------------------------------
// Dran and Drop Style ---------------------------------------------------------------------------------------------------
    .drag-and-drop-wrapper{
        position: relative;
        background: ${Colors.LIGHTBLUEBG};
        border-radius:6px;
        border: 1px dashed rgba(34,51,84,.1);
        cursor:pointer;
        .custom-file-input {
            position:relative;
            height: 113px;
            opacity:0;
            z-index:3;
            cursor:pointer;
            .MuiInputBase-root {
                height:100% !important;
                .MuiOutlinedInput-input{
                    padding: 0;
                    height:113px;
                }
            }
        }
        .custom-file-input + span{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            pointer-events: none;
            &::after{
                position:absolute;
                top: 37%;
                left: 50%;
                height: 30px;
                content: url(/img/upload-icon.svg);
                transform: translate(-50%, -63%);
            }
        }
        .image-info-box {
            position: absolute;
            top: 64%;
            left: 50%;
            transform: translate(-50%,-36%);
            width: 50%;
            height: 40px;
            p{
                position: absolute;
                top: 0;
                left: 50%;
                transform: translate(-50%, -34%);
                font-size: 13px;
                line-height: 16.94px;
                font-weight:600;
                color: rgba(34, 51, 84, 0.5);
                &.extension-text {
                    top: 15px;
                    font-size: 12px;
                    line-height: 15.64px;
                    font-weight: 300;
                }
            }
        }
        &.small{
            margin: 0 auto;
            width: 150px;
            height:97px;
            .image-info-box{
                width: 250px;
                height: auto;
                p{
                    top: -7px;
                    &.extension-text{
                        top: 12px;
                    }
                }
            }
        }
    }
// Dran and Drop Style End ------------------------------------------------------------------------------------------------
// Register Layout -------------------------------------------------------------------------------------------------
    .cc-form-wrapper {
        .cr-top-main {
            max-height: calc(100vh - 92px);
            overflow:auto;
            .cr-top-wrapper {
                margin-bottom: 15px;
                background-color: ${Colors.WHITE};
                border-radius: 6px;
                box-shadow: 0px 9px 16px rgb(159 162 191 / 18%), 0px 2px 2px rgb(159 162 191 / 32%);
                h5 {
                    font-size: 15px;
                    line-height: 18px;
                    color: ${Colors.HEADERCOLOR};
                    &.title-padding {
                        padding: 20px 30px;
                    }
                }
                .toggle_rules{
                    display:flex;
                    justify-content:space-between;
                    place-items:center;
                    padding-right: 15px;
                }
                hr {
                    border-color: ${Colors.HEADERCOLOR};
                    border-width: 1px 0 0;
                    opacity: .1;
                }
                .cr-body-content {
                    padding: 24px 40px 30px;
                    .MuiGrid-container {
                        padding: 0;
                        margin: 0;
                        .MuiGrid-item {
                            padding: 0 12px;
                            position:relative;
                        }
                       
                    }
                    &.audience-section{
                        padding:13px 25px 28px;
                        .MuiGrid-container{
                            .MuiGrid-item{
                            }
                        }
                        .seperator-wrap{
                            .switch-wrapper {
                                visibility: hidden;
                            }
                            .orbtn-wrap {
                                visibility: hidden;
                            }
                        }
                        .group-box{
                            .child-button-and {
                                margin-right: auto;
                                margin-left: auto;
                                .MuiButtonBase-root{
                                    &:last-child{
                                        display:none;
                                    }
                                }
                            }
                            .child-button-or {
                                margin-right: auto;
                                margin-left: auto;
                                .MuiButtonBase-root{
                                    &:first-child{
                                        display:none;
                                    }
                                }
                            }
                            &:nth-child(2) {
                                .child-button-and {
                                    margin-right: auto;
                                    margin-left: auto;
                                    .MuiButtonBase-root{
                                        &:last-child{
                                            display:flex;
                                        }
                                    }
                                }
                                .child-button-or {
                                    margin-right: auto;
                                    margin-left: auto;
                                    .MuiButtonBase-root{
                                        &:first-child{
                                            display:flex;
                                        }
                                    }
                                }
                            }
                        }
                        .audience-action{
                                right: 15px;
                                width: auto;
                                @media screen and (max-width:991px) {
                                    width: 77%;
                                    right: 20px;
                                }
                            .orbtn-wrap{
                                width: 30%;
                                padding-right: 15px;
                            }
                        }
                    }
                }
            }
            .cc-label-text {
                padding: 5px 0 15px;
                font-size: 13px;
                line-height: 19.5px;
                font-weight: 400;
                color: ${Colors.LIGHT_GREY};
            }
            .cc-label-text-min-video {
                padding: 5px 0 15px;
                font-size: 15px;
                line-height: 19.5px;
                font-weight: 400;
                color: ${Colors.LIGHT_GREY}; 
            }
        }
        .cc-global-buttons{
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
        }
    }
// Register Layout End --------------------------------------------------------------------------------------------
    .cta-wrapper{
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        align-items: center;
        .MuiSvgIcon-root {
            font-size: 1rem;
            color: ${Colors.DEL_RED};
            &:hover {
                cursor: pointer;
            }
        }
    }
    .MuiMenu-list {
        padding-top: 12px !important;
        padding-right: 15px !important;
        padding-left: 9px !important;
        outline: 0;
        .MuiMenuItem-root{
            height: 44px;
            border-radius: 5px;
            font-size: 14px;
            line-height: 24px;
            color:#9D9D9D;
        }
        .MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected:hover {
            background-color: rgba(24, 84, 209, 0.08);
        }
        .MuiSelect-select.MuiSelect-select:focus{
            border-color: ${Colors.PRIMARY};
        }
        .MuiListItem-button:hover {
            background-color: rgba(24, 84, 209, 0.08);
            text-decoration: none;
        }
    }
// Bottom Template Widget Box Style --------------------------------------------------------------------------------
    .cc-global-wrapper {
        ul.campaign-type {
            display: flex;
            width: 98.8%;
            flex-wrap: wrap;
            list-style-type: none;
            li {
                position:relative;
                margin: 0 15px 15px 0;
                display: flex;
                width: 206px;
                height: 205px;
                flex-direction: column;
                align-items: center;
                justify-content: space-evenly;
                background: ${Colors.WHITE};
                border: 1px solid ${Colors.BUTTON_GRAY};
                border-radius: 6px;
                .checkmark-wrapper {
                    display: none;
                }
                &.campaign-type-active,
                &.template-type-active {
                    border-color: ${Colors.SKYBLUE};
                    box-shadow: 0px 9px 16px rgba(159, 162, 191, 0.18), 0px 2px 2px rgba(159, 162, 191, 0.32);
                    span {
                        font-weight: 700;
                        color: ${Colors.SKYBLUE};
                    }
                    .checkmark-wrapper {
                        position: absolute;
                        top: -10px;
                        right: -10px;
                        display: block;
                        padding: 5px 4px 5px;
                        width: 28px;
                        height: 28px;
                        background: ${Colors.SKYBLUE};
                        border-radius: 50%;
                        border: 2px solid ${Colors.BGGRAY};
                    }
                }
                &:hover {
                    cursor: pointer;
                    border-color: ${Colors.SKYBLUE};
                }
                span {
                    font-size: 12px;
                    line-height: 12px;
                    color: ${Colors.TEMP_TEXT_COLOR};
                }
                &:last-child {
                    margin: 0 0 15px 0;
                }
                // &:nth-child(3n) {
                //     margin-right:0;
                // }
                @media screen and (max-width: 768px) {
                    width: 185px;
                }
            }
        }
    }
// Bottom Template Widget Box Style End ----------------------------------------------------------------------------
// Alert Style -----------------------------------------------------------------------------------------------------
    .alert{
        padding-top: 7px;
        padding-right: 12px;
        padding-bottom: 7px;
        padding-left: 12px;
        display: flex;
        min-height: 36px;
        height:45px;
        border-radius: 6px;
        align-items: center;
        .alert-message{
            font-size: 13px;
            line-height: 15.23px;
        }
        .alert-icon{
            margin-right:5px;
            display:flex;
        }
        .alert-close {
            margin-left: auto;
            display: flex;
            cursor:pointer;
            opacity:.4;
            &:hover{
                opacity:1;
            }
            .MuiSvgIcon-root{
                font-size:18px;
            }
        }
        &.info {
            background:${Colors.INFO};
            color: ${Colors.INFODARK};
        }
        &.error{
            background: ${Colors.TAGWARNINGBACKRGOUND};
            color: ${Colors.DEL_RED};
        }
        &.waring{
            background: rgba(255, 163, 26, 0.2);;
            color: #FF6F03;
        }

        &.status-inactive{
            color: rgb(242, 2, 2);
            background: rgba(246, 163, 146, 0.2);
        }
        &.draft{
            background: rgba(0,0,0,0.05);
            color: #000;
        }
        &.success{
            background: rgb(215 240 168);
            color: #3BB900;
        }
        &.lg{
            margin:15px;
        }
    }
// Alert Style End -------------------------------------------------------------------------------------------------
// Label Style -----------------------------------------------------------------------------------------------------
    .label-badge{
        padding: 3px 8px;
        background: ${Colors.LIGHTSKYBLUE};
        border-radius: 3px;
        font-size: 13px;
        line-height: 15px;
        text-transform: capitalize;
        &.active{
            color:${Colors.ACTIVE};
        }
        &.draft{
            color:${Colors.DRAFT};
        }
        &.completed{
            color:${Colors.COMPLETED};
        }
        &.pending{
            color:${Colors.PENDING};
        }
        &.ready{
            color:${Colors.SUCCESS};
        }
        &.status-active{
            color:${Colors.PRIMARY};
        }
        &.status-inactive{
            color:${Colors.RED};
        }
    }
    .info-text {
        margin: 45px auto 20px;
        padding: 5px 12px;
        display:flex;
        width: fit-content;
        align-items: center;
        justify-content: center;
        background-color: ${Colors.INFO};
        border-radius: 6px;
        span {
            padding-left: 5px;
            font-size: 12px;
            line-height: 16px;
            color: ${Colors.PRIMARY};
            .boldText {
                font-weight: 500;
            }
        }
    }
    .warning-info{
        margin-left: auto !important;
        margin-top: 5px;
        margin-right: 10px;
        margin-bottom: 0;
        height: 30px;
    }
    .success{
        background:${Colors.SUCCESS};
    }
// Label Style End ------------------------------------------------------------------------------------------------
// Tab Style  -----------------------------------------------------------------------------------------------------
    .tabs-wrapper{
        display:flex;
        margin-bottom:22px;
        justify-content: space-between;
        .MuiTabs-root{
            min-height: auto !important ;
            align-items: center;
            .MuiTabs-flexContainer{
                .MuiTab-root{
                    padding-right: 23px;
                    padding-left: 23px;
                    min-width: auto;
                    min-height: 37px ;
                    width: auto;
                    border-radius: 6px;
                    text-transform: capitalize;
                    font-size: 14px;
                    line-height: 16px;
                    font-weight: 700;
                    color:${Colors.HEADERCOLOR};
                    opacity: .8;
                    &.Mui-selected {
                        color: ${Colors.WHITE};
                        opacity: 1;
                    }
                    &.cm-btn-campaign {
                        background: ${Colors.SUCCESS};
                        border:1px solid ${Colors.SUCCESS_BORDER};
                        box-shadow: 0px 2px 10px rgb(68 214 0 / 50%);
                    }
                    &.cm-btn-active {
                        background: ${Colors.ACTIVE_BLUE};
                        border:1px solid #254CCA;
                        box-shadow: 0px 2px 10px rgb(51 99 255 / 50%);
                    }
                    &.cm-btn-completed {
                        background: ${Colors.COMPLETED};
                        border:1px solid #1FA483;
                        box-shadow: 0px 2px 10px rgb(37 193 154 / 50%);
                    }
                    &.cm-btn-waiting {
                        background: ${Colors.PENDING};
                        border:1px solid #B66529;
                        box-shadow: 0px 2px 10px rgb(255 111 3 / 50%);
                    }
                    &.cm-btn-draft {
                        background: ${Colors.DRAFT};
                        border:1px solid #2D2A36;
                        box-shadow: 0px 2px 10px rgb(57 53 68 / 50%);
                    }
                }
            }
            .MuiTabs-indicator{
                display:none;
            }
        }
        &.secondary {
            padding:0 20px;
            margin-bottom:0;
            background: #F6F8FB;
            height: 65px;
            border-top: 1px solid rgba(34, 51, 84, .1);
            border-bottom: 1px solid rgba(34, 51, 84, .1);
            .MuiTabs-root{
                .MuiTab-root{
                    &.Mui-selected {
                        background: ${Colors.ACTIVE_BLUE};
                        border:1px solid #254CCA;
                        box-shadow: 0px 2px 10px rgb(51 99 255 / 50%);
                    }
                }
            }
        }
    }
    .tab-content-box{
        .MuiBox-root{
            padding: 14px 20px !important;
        }
    }
// Tab Style End  -------------------------------------------------------------------------------------------------
// Badge Style  ---------------------------------------------------------------------------------------------------
    .badge{
        position: absolute;
        top: -50px;
        left: 50%;
        display:flex;
        width: 100px;
        height: 100px;
        align-items:center;
        justify-content:center;
        border-radius: 50%;
        transform: translateX(-50%);
        box-shadow: 0px 1px 4px rgb(68 214 0 / 25%), 0px 3px 12px 2px rgb(68 214 0 / 35%);
        .MuiSvgIcon-root {
            color: ${Colors.WHITE};
            font-size: 60px;
        }
    }
// Badge Style End ------------------------------------------------------------------------------------------------
// Modal Style ----------------------------------------------------------------------------------------------------
    .model-container{
        position:relative;
        padding:0;
        min-width: 510px;
        max-Width:510px;
        background: ${Colors.WHITE};
        box-shadow: 0px 9px 16px rgba(46, 46, 46, 0.18), 0px 2px 2px rgba(92, 92, 92, 0.32);
        border-radius: 6px;
        .modal-header{
            position: relative;
            padding: 18px 16px;
            border-bottom: 1px solid rgba(34, 51, 84, .1);
            h4 {
                position:relative;
                font-size: 14px;
                line-height: 16.41px;
                color: ${Colors.HEADERCOLOR};
                font-weight: 700;
            }
            .modal-close {
                position: absolute;
                top: 15px;
                right: 16px;
                width: 20px;
                color: ${Colors.FADEGRAY};
                cursor:pointer;
            }
        }
        .modal-body{
            padding: 18px 16px;
            p{
                &.text-lg{
                    margin:25px 0;
                    font-size: 23px;
                    line-height: 30.11px;
                    font-weight: 700;
                    text-align: center;
                    color: ${Colors.HEADERCOLOR};
                    span {
                        color: ${Colors.PRIMARY};
                    }
                }
            }
            #simple-modal-description {
                position: relative;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                h6 {
                    margin-top: 8px;
                    margin-left: 7px;
                }
            .tooltip-icon {
                    position: relative;
                    top: -10px;
                    right: -5px;
                    width: 16px;
                    color: ${Colors.PRIMARY};
                }
            }
            .stop-campaign{
                .list {
                    margin: 12px 0;
                    h5 {
                        font-size: 14px;
                    }
                    li {
                        margin-bottom: 7px;
                        list-style-type: none;
                        font-size: 14px;
                    }
                }
            }
        }
        .modal-footer{
            padding: 16px 16px;
            display: flex;
            justify-content: space-between;
            border-top: 1px solid rgba(34,51,84,.1);
        }
        &.large{
            width: 900px;
            max-width: 900px;
            @media (max-width: 991px) {
                width: 90%;
            }
        }
    }
    .model-paper{
        background: ${Colors.WHITE};
        border-radius: 6px;
        .MuiPaper-root {
            border-radius: 6px;
            box-shadow: rgb(46 46 46 / 18%) 0px 9px 16px, rgb(92 92 92 / 32%) 0px 2px 2px;
        }
        .model-header{
            position: relative;
            padding: 18px 16px;
            border-bottom: 1px solid rgba(34, 51, 84, 0.1);
            .model-paper-heading {
                position: relative;
                font-size: 14px;
                line-height: 16.41px;
                color: rgb(34, 51, 84);
                font-weight: 700;
            }
            .modal-close{
                position: absolute;
                top: 15px;
                right: 16px;
                width: 20px;
                color: rgb(144, 153, 169);
                cursor: pointer;
            }
        }
        .modal-body {
            padding: 18px 16px;
        }
        .model-footer{
            padding:16px;
            border-top:1px solid rgba(34, 51, 84, 0.1);
        }
    }

    .modal-footer.footer-margin {
        padding: 16px 16px 0 16px;
        margin: 0 -15px;
    }
// Modal Style End ----------------------------------------------------------------------------------------------------
// Table Search Style ---------------------------------------------------------------------------------------------
    .table-search-wrap {
        background: ${Colors.WHITE};
        border-radius: 6px;
        box-shadow: 0px 9px 16px rgb(159 162 191 / 18%), 0px 2px 2px rgb(159 162 191 / 32%);
        .MuiBox-root {
            padding:0px 0px 1px 0 !important;
        }
        .search-box{
            padding-top: 14px !important;
            padding-bottom: 17px !important;
            padding-left: 14px !important;
            width:260px;
            .MuiInputBase-formControl{
                height:36px;
                .MuiOutlinedInput-notchedOutline{
                    border-color: ${Colors.ARROWGRAY};
                }
                .MuiInputBase-input {
                    border-color:${Colors.HEADERCOLOR};
                    background:${Colors.WHITE};
                    border-color:${Colors.HEADERCOLOR};
                    font-size:14px;
                    line-height:25px;
                    &::placeholder{
                        color:${Colors.HEADERCOLOR};
                        opacity:.5;
                    }
                }
                .MuiSvgIcon-root{
                    color:${Colors.BTNPRIMARY};
                    cursor: pointer;
                }
            }
        }
    }
// Table Search Style End -----------------------------------------------------------------------------------------
// Table Style ----------------------------------------------------------------------------------------------------
    .MuiTable-root{
        .MuiTableHead-root{
            background:${Colors.BGGRAY};
            border-top: 1px solid rgba(34, 51, 84, .1);
            border-bottom: 1px solid rgba(34, 51, 84, .1);
            .MuiTableCell-head {
                position:relative;
                padding-left: 14px;
                color: rgba(0, 0, 0, 0.87);
                font-weight: 700;
                line-height: 14.06px;
                font-size: 12px;
                text-transform: uppercase;
                color:${Colors.HEADERCOLOR};
                &.sort-row{
                    padding-right: 28px;
                    span{
                        float: left;
                        margin-top: 7px;
                        margin-right: 5px;
                    }
                }
                .sort {
                    display: flex;
                    flex-direction: column;
                    .MuiSvgIcon-root{
                        margin-top: -5px;
                        margin-bottom: -5px;
                        opacity: .4;
                        &.active{
                            opacity: 1;
                        }
                    }
                }
            }
        }
        .MuiTableBody-root{
            .MuiTableRow-root{
                .camp-name{
                    font-size: 14px;
                    line-height: 16.41px;
                    color: ${Colors.HEADERCOLOR};
                    font-weight: 700;
                }
                .MuiTableCell-root {
                    padding:16px 14px 16px 14px;
                    font-size: 13px;
                    line-height: 15px;
                    color:${Colors.HEADERCOLOR};
                    a{
                        font-size: 14px;
                        line-height: 16px;
                        font-weight: 700;
                        text-decoration: none;
                        color:${Colors.HEADERCOLOR};
                    }
                }
            }
        }
        .more-action {
            position:relative;
            margin-left: auto;
            margin-right: auto;
            display: flex;
            width: 24px;
            height: 24px;
            background: ${Colors.BTN_COLOR};
            border-radius: 3px;
            align-items: center;
            cursor:pointer;
            .MuiSvgIcon-root {
                width: 100%;
                height: 18px;
                color: ${Colors.PRIMARY};
            }
            .more-action-dropdown {
                position: absolute;
                top: 0;
                right: 27px;
                padding-top: 10px;
                padding-right: 22px;
                padding-left: 15px;
                width: 200px;
                background: ${Colors.WHITE};
                border-radius: 6px;
                box-shadow: 0px 9px 16px rgb(159 162 191 / 18%), 0px 2px 2px rgb(159 162 191 / 32%);
                &.position-top {
                    bottom: 0;
                    top: inherit;
                }
                ul{
                    li{
                        border-radius: 4px;
                        margin-bottom: 12px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        list-style-type: none;
                        font-size: 14px;
                        line-height: 16px;
                        color: ${Colors.HEADERCOLOR};
                        &:hover{
                            color:${Colors.PRIMARY};
                            background-color: ${Colors.BUTTON_GRAY}4A;
                            .MuiSvgIcon-root{
                                color:${Colors.PRIMARY};
                            }
                        }
                        .MuiSvgIcon-root {
                            width: 15px;
                            color: ${Colors.HEADERCOLOR};
                        }
                    }
                }
            }
        }
        .checkbox-table-col{
            padding-right:16px !important;
            text-align:center;
            .MuiFormControlLabel-root{
                margin:0;
            }
            .MuiCheckbox-root{
                cursor: default;
            }
        }
    }
// Table Style End  ----------------------------------------------------------------------------------------------------
// Pagination Style ----------------------------------------------------------------------------------------------------
    .MuiPagination-root{
        padding-top: 16px;
        padding-bottom: 18px;
        display: flex;
        justify-content: center;
        .MuiPagination-ul{
            li  {
                margin-right:12px;
                display: flex;
                width: 41px;
                height: 41px;
                border-radius: 6px;
                align-items: center;
                .MuiPaginationItem-root {
                    padding: 0;
                    margin: 0;
                    height: 100%;
                    width: 100%;
                    min-width: 32px;
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 19px;
                    border-radius: 6px;
                    color: ${Colors.HEADERCOLOR};
                    &.Mui-selected {
                        background-color: ${Colors.BTNPRIMARY};
                        box-shadow: 0px 9px 16px rgb(26 117 255 / 18%), 0px 2px 2px rgb(26 117 255 / 32%);
                        color: ${Colors.WHITE};
                }
            }
        }
    }
// Pagination Style End ------------------------------------------------------------------------------------------------
// Stepper Style -------------------------------------------------------------------------------------------------------
    .MuiStepper-root {
        .MuiStepLabel-active, .MuiStepLabel-completed {
            color: ${Colors.HEADERCOLOR} !important;
        }
    }
    .MuiPickersToolbar-toolbar, .MuiPickerDTTabs-tabs, .MuiPickersDay-daySelected {
        background-color: ${Colors.BTNPRIMARY} !important;
    }
    .MuiPickerDTToolbar-toolbar {
        display: inline-block !important;
        .MuiGrid-item:first-child {
            h4 {
                font-size: 32px;
            }
        }
    }
    .MuiGrid-item:last-child {
        display: contents;
            .MuiPickerDTToolbar-separator {
                align-self: center;
            }
        }
    }
    .MuiList-root {
        option {
            padding-left: 6px;
            cursor: pointer;
            line-height: 1.7;
                &:hover {
                    background-color: ${Colors.BUTTON_GRAY}73;
                }
        }
    }
// Stepper Style End -------------------------------------------------------------------------------------------------------
// Loader Style ------------------------------------------------------------------------------------------------------------
    .spinner-wrap {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 99;
        .spiner-container {
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 99;
            width: 30px;
            height: 30px;
            transform: translate(-50%, -50%);
            background: ${Colors.WHITE};
            border-radius: 50%;
            &:before{
                top: 50%;
                left: 50%;
                height: 30px;
                width: 30px;
            }
        }
    }
    .MuiButton-label{
        .spiner-container{
            position:absolute;
            &::before{
                height: 15px !important;
                width: 15px !important;
                border: solid 3px #ccc !important;
                border-bottom-color: blue !important;
            }
        }
    }
    .pagination-loader-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(100% - 77px);
        background: rgba(0, 0, 0, 0.5);
        .pagination-loader{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50% , -50%);
        }
    }

    .chart-loader {
        position: relative;
        min-height: 20rem;
      
        .spiner-container {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        &.height-250 {
            min-height: 250px !important;
        }
      }

      .ctr-text{
        flex-direction: row !important;
        p {
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: rgb(34 51 84 / 50%);
          font-weight: 700;
          font-size: 16px;
          width: 10%;
          span {
            color: rgb(34, 51, 84);
          }
        }
      
        .container-chart{
            width: 90%;
        }
      }
// Loader Style End --------------------------------------------------------------------------------------------------------
// Mobile Responsive -------------------------------------------------------------------------------------------------------
    .logo-thumb{
        display:none;
    }
    .metismenu-navbar{
        .base-view{
            grid-template-columns: 97px auto !important;
        }
        .logo-thumb{
            display:block;
        }
        .full-logo{
            display:none;
        }
        .sidebar-section{
            width:96px;
            // box-shadow: 8px 0px 12px rgb(0 0 0 / 12%), 4px 0px 48px rgb(0 0 0 / 12%);
            border-radius: 0px 24px 24px 0px;
            overflow: unset;
            .metismenu {
                padding-right: 20px;
                padding-left: 25px;
                li {
                    margin-bottom:5px;
                    width: 47px;
                    height: 47px;
                    .nav-links {
                        padding-left: 0;
                        width: 47px;
                        height: 47px;
                        border-radius: 13px;
                        justify-content: center;
                        .MuiSvgIcon-root{
                            opacity:0.5;
                            margin-right:0;
                            fill: ${Colors.DARKGRY};
                        }
                        .nav-icon{
                            margin-right:0;
                        }
                        a.has-arrow{
                            display:none;
                        }
                        &:hover{
                            .MuiSvgIcon-root{
                                opacity:1;
                                fill: ${Colors.WHITE};
                            }
                        }
                        &.active{
                            .MuiSvgIcon-root{
                                opacity:1;
                                fill: ${Colors.WHITE};
                            }
                        }
                        .makeStyles-root-2{
                            align-items: center;
                            display: flex;
                            justify-content: center;
                            .MuiSvgIcon-root{
                                margin-top: 4px !important;
                                margin-right: 0px !important;
                                margin-left: 5px !important;
                            }
                        }
                    }
                }
                .mm-collapse{
                    &.mobile-submenu {
                        position: absolute;
                        top: 0;
                        left: 47px;
                        padding-right: 15px;
                        padding-left: 35px;
                        margin-bottom: 0;
                        margin-left: 0;
                        z-index: 9999;
                        display:block;
                        min-width: 250px;
                        background: ${Colors.BLACK};
                        li{
                            margin-bottom: 0;
                            padding:10px 0;
                            width: 100%;
                            height: 39px;
                        }
                    }
                }
            }
        }
    }
    .loading-dots {
        text-align: center;
        display: flex;
        margin-left: auto;
        z-index: 5;
        .dot {
          color:${Colors.PRIMARY};
          display: inline;
          margin-left: 0.2em;
          margin-right: 0.2em;
          position: relative;
          font-size: 18px;
          font-weight: bold;
          opacity: 0;
          animation: showHideDot 2.5s ease-in-out infinite;
          &.one { animation-delay: 0.2s; }
          &.two { animation-delay: 0.4s; }
          &.three { animation-delay: 0.6s; }
        }
      }
      @keyframes showHideDot {
        0% { opacity: 0; }
        50% { opacity: 1; }
        60% { opacity: 1; }
        100% { opacity: 0; }
      }


      
.info-label {
    background: rgb(235, 249, 255);
    border-radius: 6px;
    padding: 4px 12px;
    color: rgb(24, 84, 209);
    font-size: 13px;
    margin-bottom: 20px;
    display: flex;
    width: fit-content;
    margin-left: auto;
    margin-right: -30px;
    margin-top: -15px;
}
// Mobile Responsive End -----------------------------------------------------------------------------------------------
    .overflow-table{
        overflow: visible !important;
    }
    .drop-heading{
        font-weight:700 !important;
        &:hover{
            background:transparent !important;
        }
    }
    .submenus{
        position: relative !important;
        overflow:visible !important;

        .MuiSvgIcon-root{
            width: 20px;
            height: 14px;
            fill: rgba(0, 83, 214, 1) !important;
        }
        img {
            width: 30px;
            height: 30px;
            border-radius: 6px;
            margin-right: 15px;
            object-fit: contain;
        }

        .custom-dropdown{
            left: -245px !important;
            z-index: 2;
            .sub-dropdown {
                position: inherit !important;
                box-shadow: none !important;
                display: flex;
                flex-direction: column;

                ul.MuiList-padding {
                    background: #fff;
                    box-shadow: rgb(159 162 191 / 18%) 0px 9px 16px, rgb(159 162 191 / 32%) 0px 2px 2px !important;
                    border-radius: 6px;

                    .MuiButtonBase-root {
                        position: inherit !important;
                        box-shadow: none !important;
                        margin-bottom: 6px;
                        padding:0;

                        .MuiListItemText-root {
                            position: inherit !important;
                            box-shadow: none !important;
                            font-size: 14px;
                            line-height: 16.41px;
                        }

                        &.add-new-btn {
                            margin-bottom: 0px !important;
                            padding: 0;
                            height: 47px;
                            .MuiSvgIcon-root {
                                background: rgba(25, 117, 255, .3);
                                border-radius: 20px;
                                border: 2px solid rgba(25, 117, 255, 1);
                                color: rgba(25, 117, 255, 1);
                                font-weight: 700;
                                margin-right: 10px;
                                width: 23px;
                                height: 23px;
                            }
                            .link-settings {
                                color: #1975FF;
                                text-decoration: none;
                                font-weight: 500;
                                font-size: 14px;
                                line-height: 16.41px;
                            }

                            &:hover{
                                background:transparent;
                            }
                        }

                        &:hover{
                            background:transparent;
                        }
                    }
                    .MuiDivider-root{
                        margin-top: 10px;
                    }

                }
            }


        }
    }

    .analytics-error {
        margin-top: 3px;
        margin-left: 14px;
        font-size: 1.1rem;
        color: ${Colors.DEL_RED};
    }
    .bg-backdrop {
        width: 100% !important;
        height: 100% !important;
        position: fixed !important;
        background: transparent !important;
        left: 0 !important;
        top: 0 !important;
        z-index: 1 !important;
    }

    .MuiMenu-list {
        .MuiMenuItem-root {
            height: 44px;
            border-radius: 5px;
            font-size: 14px;
            line-height: 24px;
            color: rgb(34, 51, 84);
            display: flex;
            justify-content: flex-start;
            padding-left: 12px;
        }
    }
    .select-timezone-container fieldset {
        max-width: 100% !important;
    }
    .label-width-288 {
        .MuiFormLabel-root {
            width: 288px;
        }
    }
    .label-width-250 {
        .MuiFormLabel-root {
            width: 250px;
        }
    }
    .label-width-270 {
        .MuiFormLabel-root {
            width: 280px;
        }
    }
    .label-width-330 {
        .MuiFormLabel-root {
            width: 330px;
        }
    }
    .label-width-185 {
        .MuiFormLabel-root {
            width: 185px;
        }
    }
    .label-width-480 {
        .MuiFormLabel-root {
            width: 480px;
        } 
    }
    .label-width-220 {
        .MuiFormLabel-root {
            width: 220px;
        }
    }
    .label-width-170 {
        .MuiFormLabel-root {
            width: 151px;
        }
    }
    .label-width-265 {
        .MuiFormLabel-root {
            width: 265px;
        }
    }
    .loader-position {
        position: absolute;
        left: 56%;
        top: 80%;
    }
    .MuiListSubheader-root {
        font-weight: bold !important;
        margin-left: -10px;
        height: 35px;
        color: ${Colors.HEADERCOLOR} !important;
    }
        &.MuiListSubheader-sticky{
            position: static !important;
        }
    }

    .button-align {
        .MuiButton-label {
            justify-content: flex-end !important;  
        }
    }
    .jobs-table-scroll {
        overflow-y: auto;
        min-height: 150px;
        max-height: 400px;
    }

    // Survey Form

    .survey-mode{
        align-items: stretch !important;
        @media screen and (max-width:1200px) {
            width: 190px !important;
            margin: 0 auto !important;
        }
        .hidden{
            visibility:hidden;
        }
        .arrow-wrap {
            display: flex;
            align-items: center;
            .arrow-mob {
                background: #E8F1FF;
                width: 43px;
                height: 43px;
                border-radius: 6px;
                color: #0061F4;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                @media screen and (max-width:1200px) {
                    background: transparent !important;
                    width: 15px !important;
                    height: 15px;
                }
    
            }
        }
        
        
    }
    .q-survey-box{
        position:relative;
        margin: 0 15px;
        @media screen and (max-width:1200px) {
            width: 100%;
            margin-right: 20px !important;
        }
        .back-arrow {
            margin-left: 15px;
            position: absolute;
            left: 0px;
            font-size: 16px;
            top: 13px;
            color: rgb(7, 49, 130);
        }
        
        .questions {
            // height: calc(100% - 200px);
            // overflow-y: auto;
            display: none;
            padding: 0px 10px;
            margin-bottom: 15px;
            min-height:55%;
            &.active {
                display: block;
            }
        }
        
    }
    
    .survey-template{
        position: relative;
        margin-top: 19px;
        height: 100%;
        background: rgb(255, 255, 255) !important;
        border-radius: 26px !important;
        width: 211px !important;
        max-height: 432px !important;
        overflow-y: hidden !important;
        overflow-x:hidden;

        @media screen and (max-width:1200px) {
            max-height: 323px !important;
            width: 157px !important;
            margin-top: 76px;
            margin-left: 34px;
            border-radius: 17px !important;
        }
        .pr-close-wrapper{
            position: absolute;
            right: 10px;
            top: 15px;
            .MuiSvgIcon-root {
                font-size:20px;
                color: #073182;
            }
        }
        .spiner-container {
            top: 50%;
            position: absolute;
            left: 50%;
        }
        .q-indicator-wrap{
            display: flex;
            height: 20px;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;
            width: 60%;
            margin: 0 auto;
            margin-top: 11px;
            color:#073182;
            .q-indicator{
                // width: 21px;
                background: #DFDDDD;
                height: 2px;
                border-radius: 25px;
                margin-left: 2px;
                margin-right: 2px;
                &.highlight{
                    background: #073182;
                }
            }
        }
        .qs-row {
            margin-bottom: 15px;
            padding: 7px;
            box-sizing: border-box;
            pointer-events: none;
            text-align: left;
    
            .qus-text{
                width: 100%;
                display: block;
                margin-bottom: 7px;
                font-weight: 400;
                color: #223354;
                font-size: 10px !important;
                line-height: 15px;
                word-break: break-all;
    
                span{
                    color: #ef8517;
                    width: 100%;
                    margin-bottom: 5px;
                    display: inline-block;
                }
            }
            .MuiSlider-rail {
                opacity: 1;
                background-color: #C4C4C4 !important;
                height: 4px;
                border-radius: 3px;
                top: 14px;
            }
            .MuiSlider-thumb{
                width: 17px;
                height: 17px;
                background: #073182;
            }
    
            .slider-count{
                color: #223354;
                font-size: 10px;
                margin-bottom: 3px;
            }
            .range-input {
                width: 100%;
                height: 5px;
            }
            .text-area {
                background: transparent;
                color: #223354;
                font-size: 11px;
                border: none;
                border-bottom: 2px solid #1975FF;
                padding-left: 0;
                min-height: 40px;
                width: 100%;
                text-align: left !important;
                padding-top: 0px !important;
            }
            .information-text{
                color: #000;
                font-size: 9px;
                margin-top: 2px;
                text-align:right;
            }
    
            .checkbox-container {
                display: flex;
                flex-direction: column;
    
                label {
                    font-size: 10px;
                    color: rgb(34, 51, 84);
                    display: flex;
                    margin-bottom: 5px;
                    position: relative;
                    line-height: 18px;
                    align-items: baseline;
                    word-break: break-all;
    
                    input {
                        font-size: 11px;
                        color: rgb(255, 255, 255);
                        display: flex;
                        margin-bottom: 10px;
                        margin-right: 15px;
    
                    }
                }
                .checkmark {
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    height: 19px;
                    width: 19px;
                    background-color: rgb(255 255 255);
                    border-radius: 3px;
                    border: 2px solid #C4C4C4;
                    &::after {
                        left: 6px;
                        top: 1px;
                        width: 4px;
                        height: 9px;
                        border-style: solid;
                        border-color: rgb(255 255 255);
                        border-image: initial;
                        border-width: 0px 3px 3px 0px;
                        transform: rotate(45deg);
                        content: "";
                        position: absolute;
                        display: none;
                    }
                }
                input:checked + .checkmark {
                    background-color: #97c0ff;
                    border: 1px solid #97c0ff;
                    &::after {
                        display: block;
                    }
                }
               
            }
    
            .radio-container {
                display: flex;
                flex-direction: column;
    
                label {
                    font-size: 10px;
                    color: #223354;
                    display: flex;
                    margin-bottom: 8px;
                    position:relative;
                    align-items: center;
                    word-break: break-all;
    
                    input {
                        font-size: 11px;
                        color: #fff;
                        display: flex;
                        margin-right:10px;
                        opacity:0;
                        width: 19px;
                        height: 19px;
                    }
                }
                input:checked + .checkmark{
                    background-color: rgb(151, 192, 255);
                    border-color: rgb(151, 192, 255);
                }
                
                .checkmark {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 19px;
                    width: 19px;
                    background-color: #fff;
                    border-radius: 50%;
                    border: 2px solid #C4C4C4;
                }
                .checkmark:after {
                    top: 2px;
                    left: 3px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #fff;
                    content: "";
                    position: absolute;
                    display: none;
                }
                input:checked + .checkmark:after {
                    display: block;
                }
               
            }
    
            &.drop-field{
                pointer-events: auto;
                .MuiInputBase-root {
                    width: 100%;
                    border: 2px solid #D3D6DD;
                    border-radius: 4px;
                    height: 30px;
                    padding: 0 10px;
                }
    
                .MuiSelect-icon{
                    color: #77757F;
                }
                .MuiInput-underline::before{
                    border-color:#fff;
                }
                .MuiInput-underline::after{
                    border-color:#fff;
                }
                .MuiSelect-select {
                    padding-right: 27px;
                    font-size: 11px;
                    color: #77757F;
                }
            }
        }
    
        h4.inapp-full-text-heading {
            color: #073182;
            font-weight: 400;
            font-size: 18px;
            margin: 25px 0 0 0;
            text-align: center;
            line-height: 22px;
            padding-bottom:10px;
        }
    
        h6.inapp-full-text-desc {
            color: rgb(34, 51, 84);
            font-weight: 400;
            margin-top: 8px;
            margin-bottom: 25px;
            font-size: 10px;
            text-align: center;
            line-height: 12px;
            word-break: break-all;
            padding: 0 12px;
        }
       
    
        .survey-btm-btns{
            width: 100%;
            margin-top: 15px;
            padding: 0 15px 15px;
    
            button {
                margin: 0 !important;
                height: auto;
                min-height: 30px;
                min-width: 100% !important;
                background: #1854D1 !important;
                font-size: 11px !important;
                font-weight: 700;
                border-radius: 6px !important;
                word-break: break-all;
                line-height: 16px !important;
            }
    
            .cancel{
                background: transparent !important;
                border: none !important;
                color: #fff !important;
                font-size: 12px !important;
            }
        }
    }


    .default-widget{
        position: absolute;
        width: 99%;
        height: 5em;
        bottom: 0px;
        padding: 0px 0.25rem;
        left: 50%;
        transform: translate(-50%, 20%);
        display: flex;
        -webkit-box-pack: justify;
        justify-content: space-between;
    }
    .survey-widget {
        position: absolute;
        width: 99%;
        height: 100%;
        bottom: 0px;
        padding: 0px 0.25rem;
        left: 50%;
        transform: translate(-50%, 20%);
        display: flex;
        -webkit-box-pack: justify;
        justify-content: space-between;
        flex-wrap: wrap;
        z-index: 3;
        top: 57%;

        .cdCard{
            &:first-child{
                flex-wrap: wrap;
                position: relative;
            }
            &:last-child{
                flex-wrap: wrap;
                position: relative;

                .summaryCard{
                    width: 32.3%;
                }
                
            }
        }
    }

    .survey-wrapper{
        margin-top: 26%;
    }
    .survey-question .add-question-btn {
        width: 42px;
        height: 42px;
        border: 2px solid #1854D1 !important;
        border-radius: 50% !important;
        min-width: 42px !important;
        background: transparent !important;
        color: #1854D1 !important;
        display: flex;
        margin-left: auto;
        margin-right: auto;
    }


    .survey-question{ 
        .inner-wrapper{                 
            .add-survey-bottom{
                display:none;
            }        

            &:last-child{
                        
                .add-survey-bottom{
                    display:block;
                }
                
            }

        }

        .question-row{
            width:100%;
            max-height: fit-content;

            .cr-top-wrapper{
                width:100%;
                height:100%;
            }
        }
    }
    
    .preload-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: unset;

        .breadcrumbs{
            width:100%;
        }

        .preload-right{
            padding-top:0;

            .prload-btn{
                height:44px;
            }
    
            .action-select{
                background: ${Colors.WHITE};
                height: 44px;
    
                &:hover{
                    .MuiOutlinedInput-notchedOutline {
                        border-color: ${Colors.BTNPRIMARY};
                    }
                }
    
                .MuiSelect-outlined.MuiSelect-outlined {
                    padding-right: 32px;
                    border-color: ${Colors.ARROWGRAY};
                    color: ${Colors.HEADERCOLOR};
                    font-size: 14px;
                    line-height: 16.41px;
                }
                .MuiSelect-icon{
                    color: ${Colors.BTNPRIMARY};
                }
                
            }
    
            .settings-btn {
                min-width: 44px !important;
                height: 44px;
                background: ${Colors.WHITE};
                border-color: #D3D6DD;
    
                .MuiSvgIcon-root{
                    color: ${Colors.PRIMARY};
                }
    
                &:hover{
                    background:${Colors.WHITE};
                    box-shadow: none;
                    border-color: ${Colors.BTNPRIMARY};
                }
            }
    
            .device-label{
                font-size:14px;
            }
    
            .device-select{
                .MuiInputBase-root{
                    height:44px;
                }
                .MuiSelect-icon{
                    right:8px;
                }
            }

            
        }
        
    }

    .add-device-btn {
        background-color: rgb(232, 241, 255) !important;
        border-radius: 6px !important;
        padding: 10px !important;
        width: 31px;
        height: 31px;
        margin-left: 10px !important;

        .MuiSvgIcon-root {
            font-size: 20px;
            color:${Colors.PRIMARY};
        }
    }

    .preload-action-items{
        li{
            .MuiTypography-body1{
                font-size: 14px;
                color: rgba(138, 147, 164, 0.4);
            }
            .MuiSvgIcon-root{
                font-size: 19px;
                color: #D0D4DB;
            }

            &:hover{
                .MuiTypography-body1{
                    color: ${Colors.PRIMARY};
                }
                .MuiSvgIcon-root{
                    color: ${Colors.PRIMARY};
                }
            }
        }
    }

    .MuiPopover-paper {
        padding:10px;
        
        li{
            border-radius:5px;

            &:hover{
                background-color: rgba(24, 84, 209, 0.08);
                text-decoration: none;

                .MuiTypography-body1{
                    color: ${Colors.PRIMARY};
                }
                .MuiSvgIcon-root {
                    color: ${Colors.PRIMARY};
                }
            }

            .MuiTypography-body1{
                font-size: 14px;
                color: rgba(138, 147, 164, 0.4);
            }
            .MuiSvgIcon-root {
                font-size: 19px;
                color: rgb(34, 51, 84);
            }
        }
        
        
    }

    
    .more-act-btn {
        background: #F3F3F3;
        width: 18px !important;
        height: 18px !important;
        border-radius: 3px;
        color: ${Colors.PRIMARY};
    }

    #Submit_schedule{
        .MuiFormControlLabel-root{
          width:100%;
        }

        .form-select-box{
            .MuiFormLabel-root{
                z-index: 1;
            }
        }
    }

    .MuiDialogActions-root{
        padding: 16px !important;
    }
    .MuiDialogTitle-root{
        padding:18px 16px !important;

        .MuiIconButton-root {
            color: rgb(144, 153, 169);
            padding: 0;
            width: 20px;

            .MuiSvgIcon-root {
                font-size: 20px;
            }
            
        }
    }

    .hidden {
        display: none;
    }
    .actionmenus{
        .MuiPaper-root{
            min-width:114px !important;
            padding: 5px 6px;

            ul.MuiMenu-list{
                padding:0 !important;

                li{
                    height: 35px;
                    padding: 0px 10px !important;
                    justify-content: space-between;
                    padding:0px 8px !important;

                    .MuiSvgIcon-root{
                        margin-left: 15px;
                    }
                }
            }
        }
    }

    .app-dropdown{

        .MuiPaper-root{
            padding:0;
        }

        .slots-dropdown{
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
                }
    
                .app-version {
                    font-size: 10px;
                    line-height: 11.72px;
                    opacity: .5;
                }
            }
        }

    }

    .MuiCard-root.analytics-card {
       overflow: visible;
   }

    .Mui-disabled{
        .MuiCheckbox-colorPrimary .MuiIconButton-label .MuiSvgIcon-root{
            fill:rgba(0, 0, 0, 0.26) !important;
        }
    }

    .full-template {
        height: 432px;
        margin-left: 19px !important;
        width: 211px !important;
        max-height: 432px !important;
        margin-top: -17px;
        border-radius: 25px !important;
        overflow: hidden;
        position: relative;

        .pr-close-wrapper {
            position: absolute;
            right: 20px;
            top: 15p;x;
        }

        .mobile-preview-bottom {
            padding: 4px 15px 3px 40px;
            background:#ffffff;
        }

        &.mon-full-page{
            background:#fff !important;

            .pr-close-wrapper{
                top: 10px !important;
            }
            .inapp-full-img-wrapper{
                margin-top: 30px !important;
                &.full-height{
                    height: calc(100% - 83px) !important;
                }
            }
            .mobile-preview-bottom{
                padding: 4px 15px 3px 15px !important;
                p{
                    width:80%;
                }
            }
        }
    }

    .Popup-banner {
        border-radius: 0 !important;
        margin-left: 18px !important;
        width: 212px !important;
        overflow: hidden;
        position: relative;
        background:#fff !important;

        .inapp-full-img-wrapper{
            height:auto !important;
            margin-bottom:0 !important;

            img {
                object-fit: cover;
            }
        }
     
        .pr-close-wrapper {
            position: absolute;
            right: 15px !important;
            top: 7px !important;     
            z-index:9;
        }
        .inapp-full-text{
            display:none;
        }

        .mobile-preview-bottom {
            padding: 0px 10px !important;
            height:30px;

            p{
                width:80% !important;
            }
        }
    }
   

    .full-video-template {
        // overflow: hidden;
        // height: 432px;
        // position: relative;
        // margin-left: 18px !important;
        // width: 212px !important;
        // max-height: 432px !important;
        // margin-top: -17px;
        // border-radius: 25px !important;
        // background: #fff !important;
        // align-items: center;
        // display: flex;

        height: 432px;
        margin-left: 19px !important;
        width: 211px !important;
        max-height: 432px !important;
        margin-top: -17px;
        border-radius: 25px !important;
        overflow: hidden;
        position: relative;
        background: #fff !important;

        // .popup-banner-video-inner{
        //     position: relative;
        //     width: 100%;

        //     .pr-close-wrapper {
        //         position: absolute;
        //     right: 20px;
        //     top: 15p;x;
        //     }

        //     .inapp-full-video-wrapper{
        //         position: static !important;

        //         .show-image {
        //             height: auto !important;
        //         }
        //     }

        //     .inapp-full-img-wrapper{
        //         margin-bottom:0 !important;
        //         height:auto !important;

        //         img {
        //             object-fit: cover !important;
        //         }
        //     }
        //     .mobile-preview-bottom {
        //         padding: 4px 15px 1px 0px !important;
        //     }
        // }

        .pr-close-wrapper {
            position: absolute;
            right: 20px;
            top: 15p;x;
        }

        .mobile-preview-bottom {
            padding: 4px 15px 3px 0px !important;
            background:#ffffff;
        }

        

        .banner-video{
            height: calc(100% - 35px) !important;
            display: flex;
            align-items: center;
        }

        .pr-close-wrapper {
            position: absolute;
            right: 20px;
            top: 15px;
        }

        .mobile-prev-box{
            height: calc(100% - 35px) !important;
        }

        
        .inapp-full-video-wrapper {
            align-items: flex-start !important;

            video {
                height: 150px;
                margin: auto 0;
            }
            img{
                margin:auto 0;
            }
        }

        .inapp-full-text{
            display:none;
        }
        
        .mobile-preview-bottom {
            padding: 4px 15px 3px 40px;
            background:#fff;
        }
        .inapp-full-img-wrapper{
            display:flex;
            
            img{
                height: auto !important;
            }
        }
    }

   

    .bottom-banner, .top-banner {
        align-self: flex-end;
        margin-bottom: 45px;
        overflow: hidden;
        position: relative;

        .pr-close-wrapper {
            position: absolute;
            right: 20px;
            top: 15px;
        }
        .mobile-preview-bottom {
            justify-content: center !important;

            
            p{
                background: #7f7f7f;
                border-radius: 3px;
                width: 120px;
                color: #fff !important;
                margin-bottom: 10px;
            }
        }
    }



    .engagement-popup-banner {
        background: rgba(0, 0, 0, .7) !important;
        overflow: hidden;
        height: 432px;
        position: relative;
        margin-top: -17px;
        margin-left: 18px !important;
        width: 212px !important;
        max-height: 432px !important;
        border-radius: 25px !important;
        align-items: center;
        display: flex;

        .popup-banner-video-inner{
            position: relative;
            width: 100%;
            margin:0 10px;

            .pr-close-wrapper {
                position: absolute;
                right: 20px;
                top: 15px;
                z-index:9;
            }

            .inapp-full-video-wrapper{
                position: static !important;
            }

            .inapp-full-img-wrapper{
                margin-bottom:0 !important;

                img{
                    border-radius: 8px 8px 0 0;
                }
            }
            .mobile-preview-bottom {
                padding: 4px 0px 4px !important;
                border-radius: 0 0 8px 8px;
                
            }
        }

        .banner-video{
            height: calc(100% - 75px) !important;
            background: #fff;
            border-radius: 8px 8px 0 0;
        }
        
      
        .inapp-full-img-wrapper{
            height:auto !important;

            img {
                object-fit: cover !important;
            }
        }

        .mobile-preview-bottom {
            justify-content: center !important;
            padding-left: 0;
            margin-top: 0px;
            padding-right:0 !important;
            
            p{
                background: #7f7f7f;
                border-radius: 3px;
                width: 80%;
                color: #fff !important;
                margin-bottom: 10px;
            }
            .MuiSvgIcon-root{
                display:none !important;
            }
        }

        .inapp-full-text {
            display: block !important;
        }
    }

    .engagement-full{
        background:#fff !important;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .pr-close-wrapper{
            top: 10px;
        }

        .mobile-preview-bottom {
            justify-content: center !important;
            padding-left: 0;
            margin-top: 5px;
            padding-right: 0;
            
            p{
                background: #7f7f7f;
                border-radius: 3px;
                width: 120px;
                color: #fff !important;
                margin-bottom: 10px;
            }
            .MuiSvgIcon-root{
                display:none !important;
            }
        }

        .inapp-message-content {
            margin-top: 15px;
        }

        .inapp-full-img-wrapper.full-height {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: auto !important;

            .banner-image {
                height: auto;
                margin-top: 0px;
            }
        }

        .inapp-message-content{

        }
    }

    .engagement-full-video{
        background: rgb(255, 255, 255) !important;
        display: flex;
        flex-direction: column;
        justify-content: center;
        

        .mobile-prev-box{
            margin-bottom:10px;
        }

        .mobile-preview-bottom {
            justify-content: center !important;
            padding-left: 0 !important;
            margin-top: 5px;
            padding-right: 0 !important;
            
            p{
                background: #7f7f7f;
                border-radius: 3px;
                width: 120px;
                color: #fff !important;
                margin-bottom: 0px;
            }
            .MuiSvgIcon-root{
                display:none !important;
            }      
        }
        .pr-close-wrapper{
            z-index: 2;
            right: 10px !important;
            top: 11px !important;
        }

        .banner-video{
            height: auto !important;
            width: 100%;
            display: block;
            margin-top:0px !important;
            flex-direction: column;
            justify-content: center;
            margin-bottom:10px;
        }

        .inapp-full-img-wrapper {
            align-items: flex-start;
            padding-top: 0px;
            height: 100% !important;

            img{
                height:100% !important; 
            }
        }
        .inapp-full-text {
            display: block !important;
        }
        .mobile-prev-box {
            height: calc(100% - 75px) !important;
        }
        .inapp-full-video-wrapper{
            video {
                margin: 0px auto !important;
                height: 150px !important;
            }
            .hide-image{
                margin: 40px auto !important;

            }
            
            .show-image {
                margin-top: 0px !important; 
            }
        }
    }

    .mon-full-video{
        background: rgb(0, 0, 0) !important;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .mobile-prev-box{
            margin-bottom:10px;
        }

        .mobile-preview-bottom {
            justify-content: center !important;
            padding-left: 0 !important;
            margin-top: 5px;
            padding-right: 0 !important;

            p{
                width:80%;
            }
            
              
        }
        .pr-close-wrapper{
            z-index: 2;
        }

        .banner-video{
            height: 100% !important;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .inapp-full-img-wrapper {
            align-items: flex-start;
            padding-top: 0px;
            height: 100% !important;

            img{
                height:100% !important; 
            }
        }
        .inapp-full-text {
            display: block !important;
        }
        .mobile-prev-box {
            height: calc(100% - 75px) !important;
        }
        .inapp-full-video-wrapper{
            video {
                margin: -15px 0px auto !important;
                height: 150px !important;
                object-fit: contain !important;
            }
            .hide-image{
                margin: 40px auto !important;

            }
            
            .show-image {
                margin-top: 0px !important; 
            }
        }
    }


    .engagement-popup-video.popup-banner-video  {
        overflow: hidden;
        height: 432px;
        position: relative;
        margin-top: -17px;
        margin-left: 18px !important;
        width: 212px !important;
        max-height: 432px !important;
        border-radius: 25px !important;

        .pr-close-wrapper{
            top: 5px !important;
            right: 10px !important;
        }

       

        .banner-video{
            height: calc(100% - 75px) !important;
            background: #fff;
            border-radius: 8px 8px 0 0;
        }

        .inapp-full-video-wrapper {
            align-items: flex-start !important;
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            margin-bottom: 9px;

            video {
                margin: 0px auto !important;
                height: 150px !important;
            }
            .MuiSvgIcon-root {
                top: 44% !important;
            }

            .show-image {
                margin-top: 25px !important;
                height: auto !important;
                object-fit: contain !important;
            }
        }

        .inapp-full-img-wrapper {
            align-items: flex-start;
            padding-top: 0px;
            height: auto !important;

            img {
                height: auto !important;
                border-radius: 8px 8px 0 0;
            }
        }

        .inapp-full-text{
            display:block !important;
            b{
                font-weight:700;
            }
        }
        .popup-banner-video-inner{
            margin: 0 10px;
            .mobile-preview-bottom{
                padding-left:0 !important;
                padding-right:0 !important;
            }
        }

        .mobile-preview-bottom {
            justify-content: center !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin: 0;
            border-radius: 0 0 5px 5px;
            
            p{
                background: #7f7f7f;
                border-radius: 3px;
                width: 80%;
                color: #fff !important;
                margin-bottom: 10px;
            }
            .MuiSvgIcon-root{
                display:none !important;
            }      
        }
    }


    .popup-banner-video {
        overflow: hidden;
        height: 432px;
        position: relative;
        margin-left: 18px !important;
        width: 212px !important;
        max-height: 432px !important;
        margin-top: -17px;
        border-radius: 25px !important;
        display: flex;
        align-items: center;
        background: rgba(0, 0, 0, .7) !important;

        .popup-banner-video-inner{
            position: relative;
            width: 100%;

            .pr-close-wrapper {
                position: absolute;
                right: 20px;
                top: 15px;
                z-index:9;
            }

            .inapp-full-video-wrapper{
                position: static !important;
            }

            .inapp-full-img-wrapper{
                margin-bottom:0 !important;
            }
            .mobile-preview-bottom {
                padding: 4px 15px 1px 15px !important;
                p{
                    width:80%;
                }
            }
        }

        

        .banner-video{
            height: calc(100% - 35px) !important;
        }

        
        .inapp-full-video-wrapper {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: flex-start !important;

            video {
                height: 150px !important;
                margin: auto 0;
            }
            .show-image{
                height:auto !important;
            }
        }

        .inapp-full-text{
            display:none;
        }
        
        .mobile-preview-bottom {
            padding: 0px 15px 0px 40px;
        }
        .inapp-full-img-wrapper{
            display:flex;
            height: auto !important;

            img{
                height: auto !important;
                object-fit: cover !important;
            }
        }
    }

    .survey-complete{
        color: rgb(25, 117, 255);
        display: flex;
        align-items: center;
        height: auto;
        -webkit-box-pack: center;
        justify-content: flex-end;
        flex-direction: column;

        .MuiSvgIcon-root {
            margin-bottom: 20px;
            transform: rotate(-35deg);
        }
    }

    .terms{
        margin-top: -10px !important;

        .terms-condition{
            display: flex;
            align-items: center;
            margin-bottom: 5px;

            p {
                font-size: 9px;
                margin-left: 3px;
                color: #223354;
            }
        }
    }

    .campaign-analytics-survey{
        .pr-wrapper-templete {
            // margin-top: 21px;
            margin-left: 77px !important;
        }
        .white-screen {
            // margin-top: 21px;
            margin-left: 77px !important;
        }
        .arrow-mob {
            margin-left: 15px;
            background: #E8F1FF;
            width: 43px;
            height: 43px;
            border-radius: 6px;
            color: #0061F4;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;;
        }
    }

    .scroll-section{
        // height: calc(100% - 120px);
        overflow-y: auto;
    }
    
    .switch-inline{
        display: inline-block;
        width: 220px;
    }

    .message-switch-box{
        display: flex;
        margin-bottom: 15px;


        .switch-inline{
            display: inline-block;
            width: 52px;
            height: 27px;
            margin-left: 10px;

            .switch-label{
                padding-right:0 !important;
            }
        }
        p{
            font-size: 14px;
            line-height: 24px;
            letter-spacing: 0.09px;
            color: rgb(34, 51, 84);
            display: inline-block;
            height: 22px;
            margin-top: 5px;
        }
    }
   
   .MuiSlider-valueLabel {
       top: -50px;
       left: calc(-50% - 13px) !important;
        span {
            width: 55px !important;
            height: 35px !important;
            transform: rotate(0deg) !important;
            border-radius: 2px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }
    }
    
    .condition-apply {
       border: 1px solid ${Colors.PRIMARY};
    }

   .summaryHeader .summaryCard {
        height: 131px;
        box-shadow: rgb(159 162 191 / 18%) 0px 9px 16px, rgb(159 162 191 / 32%) 0px 2px 2px;
        display: flex;
        flex-direction: column;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
    }
    .summaryHeader .summaryCard .content {
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        width: 100%;
        height: 70px;
        -webkit-box-align: center;
        align-items: center;
    }
    .summaryHeader .summaryCard .content .content-badge {
        width: 10%;
        text-align: center;
        -webkit-box-align: center;
        align-items: center;
    }
    .summaryHeader .summaryCard .content .value {
        color: rgb(34, 51, 84);
        font-size: 20px;
        font-weight: 700;
        line-height: 37.5px;
        margin: 0px;
    }
    .summaryHeader .summaryCard .content .badge-template {
        width: 84px;
        height: 21px;
        background: rgb(243, 243, 243);
        border-radius: 3px;
        color: rgb(0, 0, 0);
        font-weight: 700;
        line-height: 21.23px;
        font-size: 13px;
        text-align: center;
    }
    .MuiTooltip-tooltip {
        background-color: ${Colors.HEADERCOLOR} !important;
        font-size: 11px !important;
    }
    .MuiTooltip-arrow {
        color: ${Colors.HEADERCOLOR} !important;
    }
    .apns-modal{
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
