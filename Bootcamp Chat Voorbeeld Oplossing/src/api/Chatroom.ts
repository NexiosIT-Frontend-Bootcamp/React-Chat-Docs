import axios from "axios";
import {
	CreateChatroomRequest,
	CreateChatroomResult,
	DeleteChatroomResult,
	GetChatroomsResult,
	IApiChatroom,
	IChatroom,
} from "../types";
import { DEFAULT_ERROR_MESSAGE } from "../vars/messages";
import { DEFAULT_ERROR_RESULT } from "./shared";
import { getApiBaseUrl, getDefaultHeaders } from "./utils";

export const deserializeChatroom = (apiRoom: IApiChatroom): IChatroom => {
	return {
		allowedUsers: apiRoom.allowed_users,
		id: apiRoom._id,
		name: apiRoom.name,
		unreadMessages: 0,
	};
};

export const GetChatrooms = async (jwt: string): Promise<GetChatroomsResult> => {
	const url = getApiBaseUrl() + "/rooms";

	try {
		const response = await axios.get(url, { headers: getDefaultHeaders(jwt) });

		if (response.data && Array.isArray(response.data)) {
			return {
				isSuccess: true,
				chatrooms: response.data.map((item: IApiChatroom) => deserializeChatroom(item)),
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

export const GetChatroom = async (id: string) => {
	const url = getApiBaseUrl() + `/rooms/${id}`;

	try {
		const response = axios.get(url);
		console.log("get room response", response);
	} catch (e) {
		console.log("get room error", e);
	}
};

export const CreateChatroom = async (jwt: string, chatroom: CreateChatroomRequest): Promise<CreateChatroomResult> => {
	const url = getApiBaseUrl() + "/rooms";

	try {
		const response = await axios.post(url, chatroom, { headers: getDefaultHeaders(jwt) });
		if (response.data && response.data.allowed_users && response.data.name && response.data._id) {
			return {
				isSuccess: true,
				chatroom: deserializeChatroom(response.data),
			};
		} else {
			return DEFAULT_ERROR_RESULT;
		}
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

export const DeleteChatroom = async (jwt: string, chatroomId: string): Promise<DeleteChatroomResult> => {
	const url = getApiBaseUrl() + `/rooms/${chatroomId}`;

	try {
		const response = await axios.delete(url, { headers: getDefaultHeaders(jwt) });
		if (response.status === 200) {
			return {
				isSuccess: true,
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
