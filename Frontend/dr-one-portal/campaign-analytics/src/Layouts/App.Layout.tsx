import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

/* Prop definition */
type Props = {
	children?: any;
};

const AppLayout: React.FunctionComponent<Props> = ({ children }) => {
	return (
		<BrowserRouter>
			<Switch>{children}</Switch>
		</BrowserRouter>
	);
};

export default React.memo(AppLayout);
