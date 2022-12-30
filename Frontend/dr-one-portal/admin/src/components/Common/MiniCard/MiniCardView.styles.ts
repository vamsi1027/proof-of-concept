import styled from 'styled-components';

export const Container = styled.div`
	& + div {
		margin-top: 20px;
	}
`;
export const CardBody = styled.div`
	text-align: center;
	h3 {
		font-size: 60px;
		height: 70px;
		margin-bottom: 10.5px;
	}
	h4 {
		color: #F48131;
		font-size: 18px;
    text-align: center;
		label {
			color: #666666;
			font-size: 12px;
			margin-left: 10px;
			position: relative;
			top: -8px;
		}
    svg {
      position: absolute;
      font-size: 1rem;
    }
	}
	span {
		font-weight: 300;
		font-size: 12px;
	}
`;
