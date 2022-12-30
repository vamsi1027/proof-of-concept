import styled from 'styled-components';

export const Container = styled.div`
`;
export const CardBody = styled.div`
	display: flex;
	width: 100%;
	margin: 20px 0;
	justify-content: center;
	align-items: center;
`;

export const TitleContent = styled.div`
  padding:10px;
  p {
    font-weight: 700;
    font-size: 1.3rem;
  }
	small {
    margin-top: 8px;
    display: inline-block;
		font-size: 12px;
		font-weight: normal;
		color: #666666;
		svg {
			margin-right: 10px;
		}
	}
`;
