import { Colors } from '@dr-one/utils';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 17px 26px 34px 26px;
  background-color: ${Colors.WHITE};
  border-radius: 6px;
  box-shadow: 0px 9px 16px rgba(159, 162, 191, 0.18),
    0px 2px 2px rgba(159, 162, 191, 0.32);

  > .switch {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    > p {
      margin-left: 5px;
      font-size: 14px;
    }

    
  }

  .cc-form-wrapper{
    width:100%;
}

.cus-tracker-wrapper{
    width:100%;
    .switchery-wrap{
        margin-bottom: 35px;
        margin-top: 10px;
        width:100%;

        .MuiFormGroup-root {
            flex-direction: row;
        }

        .MuiIconButton-root{
            top: 1px;
        }

        .switch-label {
            margin-left: 5px;
        }
    }

    
}

.tracker-checkbox-list{
  p{
    color: ${Colors.HEADERCOLOR};
    opacity:0.6;
  }
}

`;
export const Logo = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 15px;

  > article {
    margin-left: 10px;

    > p {
      font-weight: bold;
      font-size: 16px;
      line-height: 18px;
    }

    > small {
      font-weight: 300;
      font-size: 14;
      line-height: 16px;
      opacity: 0.5;
    }

    .qa-icon {
      margin-left: 7px;
      cursor: pointer;
    }
  }
`;

export const Inputs = styled.div`
  

  &.custom-tracker-wrapper{
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    margin-top: 25px;

    .form-row{
      &:last-child{
        margin-bottom:0 !important;
      }
    }
  }
`;
export const CommonUrl = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 15px;
 

  > p {
    margin: 15px 0;
    font-weight: 300;
    font-size: 14px;
    line-height: 24px;
  }
`;

export const Checks = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;

   .MuiFormControlLabel-label{
    font-size: 13px;
  }
 @media screen and (max-width: 769px) {
    height: 40%;
  }


`
