import styled from 'styled-components';
import { Colors } from "@dr-one/utils";

export const Container = styled.div`

    &.inner-container{
        position:relative;

        .header-main-btn {
            position: absolute;
            right: 0;
            top: 0;
        }

        .action-icons-container{
            display: flex;
    
            .icon-wrap {
                margin-right:10px;
                width: 44px;
                height: 44px;
                background: ${Colors.WHITE};
                border: 1px solid #D3D6DD;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor:pointer;
    
                .MuiSvgIcon-root{
                    color: ${Colors.PRIMARY};
                }
    
                &:last-child{
                    margin-right:0px;
                }
            }
        }
    }
      
    
}
`;

