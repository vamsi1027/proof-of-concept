interface Token {
	exp?: number;
}
export const parseJwt = (token: string): Token | null => {
	if (!token) return { exp: undefined };
	let base64Url = token.split('.')[1];
	let base64 = base64Url.replace('-', '+').replace('_', '/');
	return JSON.parse(window.atob(base64));
};
