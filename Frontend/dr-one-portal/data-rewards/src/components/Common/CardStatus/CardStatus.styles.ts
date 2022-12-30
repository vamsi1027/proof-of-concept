import styled from 'styled-components';
import { barColor } from '../../../../../utils/src/styles/colors';
interface IPropertiesProps {
  statusCampaign: string;
}
export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  > main {
    width: 100%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
export const Article = styled.article`
  width: 100%;
  height: 102px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const Labels = styled.div`
  height: 100px;
  width: 35%;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  opacity: 0.5;
`;
export const Properties = styled.div<IPropertiesProps>`
  height: 100%;
  width: 60%;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  font-weight: bold;
  > .status {
    color: ${(props) => props.statusCampaign};
    background-color: ${barColor[12]};
    width: 80px;
    text-align: center;
    height: 20px;
    line-height: 20px;
  }
`;
