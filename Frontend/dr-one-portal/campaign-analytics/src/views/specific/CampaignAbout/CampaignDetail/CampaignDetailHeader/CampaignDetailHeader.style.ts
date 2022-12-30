import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
.cdHeader {
  align-items: flex-start;
  border-left: 2px solid #fff8;
  display: flex;
  flex-direction: row;
  padding-left: 1rem;
  margin-bottom: 20px;

  @media screen and (max-width:991px) {
    flex-direction: column;
  }
}

.cdHeader .title {
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @media screen and (max-width:991px) {
    margin-bottom: 15px;
  }
}

.cdHeader .title h2 {
  margin-bottom: 4px;
  font-size: 23px;
  line-height: 26.95px;
  font-weight:700;

  span{
    font-weight:400;
  }
}

.cdHeader .title h3 {
  font-size: 18px;
  line-height: 21px;
  font-weight:700;
}

.cdHeader .title h3 span {
  font-size: 18px;
  font-weight:400;
}

.cdHeader .export {
  background-color: ${Colors.WHITE};
  img {
    width: 25px;
    height: 25px;
  }
}
.cdHeader .export:hover {
  background-color: ${Colors.WHITE};
}

.cdHeader .export span {
  font-weight: 600;
  text-transform: none;
}

`;

