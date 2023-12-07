import axios from "axios";
import { GetUserResult, GetUsersResult, IApiUser, IUser, LoginResult, RegisterResult } from "../types";
import { DEFAULT_ERROR_MESSAGE } from "../vars/messages";
import { DEFAULT_ERROR_RESULT } from "./shared";
import { getApiBaseUrl, getDefaultHeaders } from "./utils";

const getInitialsFromUsername = (username: string) => {
	return username
		.split(" ")
		.map((string) => string.charAt(0))
		.join("");
};

export const deserializeUser = (apiUser: IApiUser): IUser => {
	return {
		id: apiUser._id,
		email: apiUser.email,
		initials: getInitialsFromUsername(apiUser.username),
		username: apiUser.username,
	};
};

export const RegisterUser = async (username: string, email: string, password: string): Promise<RegisterResult> => {
	const url = getApiBaseUrl() + "/users";

	try {
		await axios.post(url, { username, email, password });
		return {
			isSuccess: true,
		};
	} catch (e) {
		if (axios.isAxiosError(e)) {
			return {
				isSuccess: false,
				error: e.response?.data?.message || DEFAULT_ERROR_MESSAGE,
			};
		} else {
			return DEFAULT_ERROR_RESULT;
		}
	}
};

export const LoginUser = async (email: string, password: string): Promise<LoginResult> => {
	const url = getApiBaseUrl() + "/auth/login";

	try {
		const response = await axios.post(url, { email, password });

		if (response.data && response.data.access_token) {
			return {
				isSuccess: true,
				accessToken: response.data.access_token,
			};
		}

		return DEFAULT_ERROR_RESULT;
	} catch (e) {
		if (axios.isAxiosError(e)) {
			return {
				isSuccess: false,
				error: e.response?.data?.message || DEFAULT_ERROR_MESSAGE,
			};
		} else {
			return DEFAULT_ERROR_RESULT;
		}
	}
};

export const LogoutUser = async (email: string, password: string) => {
	const url = getApiBaseUrl() + "/auth/logout";

	try {
		const response = await axios.post(url, { email, password });
		console.log("logout response", response);
	} catch (e) {
		console.log("logout error", e);
	}
};

// Get a user details for a given token
export const GetUser = async (jwt: string): Promise<GetUserResult> => {
	const url = getApiBaseUrl() + "/users/profile";

	try {
		const response = await axios.get(url, { headers: getDefaultHeaders(jwt) });
		if (response.data) {
			return {
				isSuccess: true,
				user: deserializeUser(response.data),
			};
		}

		return DEFAULT_ERROR_RESULT;
	} catch (e) {
		if (axios.isAxiosError(e)) {
			return {
				isSuccess: false,
				error: e.response?.data?.message || DEFAULT_ERROR_MESSAGE,
			};
		} else {
			return DEFAULT_ERROR_RESULT;
		}
	}
};

export const GetUsers = async (jwt: string): Promise<GetUsersResult> => {
	const url = getApiBaseUrl() + "/users";

	try {
		const response = await axios.get(url, { headers: getDefaultHeaders(jwt) });

		if (response.data && Array.isArray(response.data)) {
			return {
				isSuccess: true,
				users: response.data.map((user: IApiUser) => deserializeUser(user)),
			};
		}

		return DEFAULT_ERROR_RESULT;
	} catch (e) {
		if (axios.isAxiosError(e)) {
			return {
				isSuccess: false,
				error: e.response?.data?.message || DEFAULT_ERROR_MESSAGE,
			};
		} else {
			return DEFAULT_ERROR_RESULT;
		}
	}
};
