import styled from 'styled-components';

export const Container = styled.div`
    @keyframes spinner {
        0% {
            transform: translate3d(-50%, -50%, 0) rotate(0deg);
        }
        100% {
            transform: translate3d(-50%, -50%, 0) rotate(360deg);
        }
    }
    
    &.spiner-container:before {
        animation: 1.5s linear infinite spinner;
        animation-play-state: inherit;
        border: solid 5px #ccc;
        border-bottom-color: ${props => props.color};
        border-radius: 50%;
        content: "";
        height: 30px;
        width: 30px;
        position: absolute;
        transform: translate3d(-50%, -50%, 0);
        will-change: transform;
    }
`;
