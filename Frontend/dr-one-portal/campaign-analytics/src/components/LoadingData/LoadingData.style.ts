import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
.SkeletonLoadingData {
    background-color: rgba(34, 51, 84, 0.8);
    border: 1px solid rgba(34, 51, 84, 0.208);
    color: rgb(238, 238, 238);
    font-size: 18px;
    font-weight: 500;
    left: 50%;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    position: absolute;
    top: 14px;
    transform: translateY(-50%) translateX(-50%);
  }
`;
