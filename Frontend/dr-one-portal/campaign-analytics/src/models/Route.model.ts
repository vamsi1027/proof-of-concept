export type RouteType = {
	name: string;
	path: string;
	exact?: boolean;
	condition?: boolean | Function;
	component: any;
	redirect?: string;
};
