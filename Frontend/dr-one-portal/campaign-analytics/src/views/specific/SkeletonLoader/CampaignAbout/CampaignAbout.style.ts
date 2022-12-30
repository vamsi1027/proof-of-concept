import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
.cxbltl{
  .row{
    padding-left:12px;
  }
}
.campaignAboutSkeleton {
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
    margin: 1rem 0 8rem 0;
    padding: 2rem 1rem 5rem 1rem;
    position: relative;
  }
  
  .campaignAboutSkeleton .img {
    height: 10rem;
    margin: auto 0.125rem;
    width: 10rem;
  }
  .cd-item {
    width: 17%;
    margin-bottom: 15px;
    border-right: 1px solid rgba(255, 255, 255, 0.533);
    margin-right: 15px;

    @media screen and (max-width:991px) {
      width: 46%;
    }
  }
`;


