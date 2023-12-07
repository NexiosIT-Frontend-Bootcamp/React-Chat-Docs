export const getApiBaseUrl = (): string => {
	return "https://lobster-app-osqfh.ondigitalocean.app";
};

export const getWebsocketBaseUrl = (): string => {
	return "ws://lobster-app-osqfh.ondigitalocean.app";
};

export const getDefaultHeaders = (jwt: string) => {
	return {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization: "Bearer " + jwt,
	};
};
