import styled from 'styled-components';

export const Container = styled.div`
    .call-to-action-wrap{
        .MuiGrid-root{

            @media screen and (max-width: 768px) {
                margin-bottom:24px;
             }

            &:last-child{
                @media screen and (max-width: 768px) {
                    margin-bottom:0;
                 }
            }
           
        }   
    }

    .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input {
        padding: 0.5px 4px;
    }

    .survey-question-section{
        margin-top: 25px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius:3px;

        .MuiGrid-container.MuiGrid-spacing-xs-3{
            margin: 0 -12px !important;
        }
        .MuiGrid-grid-md-8 {
            flex-grow: 0;
            max-width: 100%;
            flex-basis: 100%;

            .cr-top-main{
                overflow:hidden;

                .cr-top-wrapper{
                    box-shadow: none !important;
                    margin-bottom: 0;
    
                    .cr-body-content{
                        padding:0;
                    }
                }

            }        
            
        }

        .question-box {
            .MuiGrid-grid-md-8 {
                flex-grow: 0;
                max-width: 66.666667%;
                flex-basis: 66.666667%;
            }
        }

        .qus-right-btn{
            margin-top:3px;
        }

        .radio-label{
            color: rgba(0, 0, 0, 0.38);
        }
    }

    
    
`;