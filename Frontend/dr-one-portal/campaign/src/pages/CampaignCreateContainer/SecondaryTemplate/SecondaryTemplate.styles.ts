import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.div`
 li {
    position: relative;

    &.template-type-active {
        .checkmark-wrapper {
            position: absolute;
            top: -10px;
            right: -10px;
            display: block;
            padding: 5px 4px 5px;
            width: 28px;
            height: 28px;
            background: ${Colors.SKYBLUE};
            border-radius: 50%;
            border: 2px solid ${Colors.BGGRAY};
        }
    }


}

// li:nth-child(3n){
//     margin-right: 0 !important;
// }

.checkmark-wrapper { display: none; }
`;