import { Colors } from '@dr-one/utils';
import styled from 'styled-components';
import { barColor } from '../../../../utils/src/styles/colors';

export const Container = styled.div`
  width: 100%;
  background-color: ${Colors.BACKGROUND};
  color: ${Colors.HEADERCOLOR};
`;
export const Header = styled.header`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
`;
export const Content = styled.div`
  width: 100%;
  padding: 5px 15px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 40vh;
  gap: 15px;
  grid-template-areas: 'AppInstallationsPerDay VideoWatched BannerVisualization';
  > .AppInstallationsPerDay {
    grid-area: AppInstallationsPerDay;
  }
  > .VideoWatched {
    grid-area: VideoWatched;
  }
  > .BannerVisualization {
    grid-area: BannerVisualization;
  }
  @media (max-width: 900px) {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 1fr);
    grid-template-areas:
      'AppInstallationsPerDay'
      'VideoWatched'
      'BannerVisualization';
  }
  @media screen and (min-width: 901px) and (max-width: 1300px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-template-areas:
      'AppInstallationsPerDay VideoWatched'
      'BannerVisualization .';
  }
`;
export const Card = styled.div`
  background-color: ${Colors.WHITE};
  box-shadow: 0px 9px 16px ${barColor[13]}, 0px 2px 2px ${barColor[14]};
  border-radius: 6px;
  padding: 20px;
`;
