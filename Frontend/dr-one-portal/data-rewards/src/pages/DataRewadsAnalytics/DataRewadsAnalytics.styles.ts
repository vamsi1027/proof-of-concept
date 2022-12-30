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
  grid-template-columns: 1fr 1fr 1.5fr 1.8fr;
  grid-template-rows: 28vh 28vh 8vh 35vh;
  gap: 15px;
  grid-template-areas:
    'displayCard status videoViews preview'
    'budget budget installed preview'
    'budget budget numberInstalation numberInstalation'
    'avaliable avaliable numberInstalation numberInstalation';
  > .display {
    grid-area: displayCard;
  }
  > .status {
    grid-area: status;
  }
  > .videoViews {
    grid-area: videoViews;
  }
  > .preview {
    grid-area: preview;
    border-top: 7px solid ${Colors.BTNPRIMARY};
  }
  > .budget {
    grid-area: budget;
  }
  > .installed {
    grid-area: installed;
  }
  > .numberInstalation {
    grid-area: numberInstalation;
  }
  > .avaliable {
    grid-area: avaliable;
  }
  > .AppInstallationsPerDay {
    grid-area: AppInstallationsPerDay;
  }
  > .VideoWatched {
    grid-area: VideoWatched;
  }
  > .BannerVisualization {
    grid-area: BannerVisualization;
  }
  @media (min-width: 1101px) and (max-width: 1300px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: repeat(4, 30vh);
    grid-template-areas:
      'displayCard status videoViews '
      'preview preview installed'
      'preview preview budget'
      'numberInstalation numberInstalation avaliable';
  }
  @media screen and (max-width: 1100px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 30vh 30vh 30vh 60vh 30vh 30vh 30vh;
    grid-template-areas:
      'displayCard status '
      'videoViews videoViews'
      'installed installed'
      'preview preview'
      'budget budget'
      'numberInstalation numberInstalation'
      'avaliable avaliable';
  }
`;
export const Card = styled.div`
  background-color: ${Colors.WHITE};
  box-shadow: 0px 9px 16px ${barColor[13]}, 0px 2px 2px ${barColor[14]};
  border-radius: 6px;
  padding: 20px;
`;
