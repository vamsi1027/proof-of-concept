import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
.campaignAbout {
    background: linear-gradient(
      117.88deg,
      #3b97d3 18.06%,
      #1854d1 49.14%,
      #223354 87.44%
    );
    border-radius: 0.5rem;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin:1rem 0px 70px;
    padding:1rem 30px 6rem;
    position: relative;
  }

  .cdContainer{
    display: flex;
    flex-direction: column;
    width: 100%;

    .cd-data-sec{
      display:flex;
      width: 100%;
      flex-wrap: wrap;     
      

      .cd-item {
        width: 17%;
        margin-bottom: 15px;
        border-right: 1px solid rgba(255, 255, 255, 0.533);
        margin-right: 15px;

        @media screen and (max-width:991px) {
          width: 46%;
        }
      }
    }
  }
  
  .campaignAbout .campaignImg {
    background-color: #fff;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: row;
    height: 10rem;
    justify-content: center;
    margin: auto 0.125rem;
    padding: 0.5rem;
    width: 10rem;
  }
  .error-no-data-push-in-app {
    background: rgba(255, 255, 255, 0.5);
    display: flex;
    justify-content: center;
    margin-top: -45px;
    padding: 20px 0;
  }
`;


