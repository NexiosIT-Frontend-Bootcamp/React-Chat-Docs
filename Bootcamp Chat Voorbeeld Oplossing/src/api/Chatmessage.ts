import axios from "axios";
import {
	CreateMessageRequest,
	CreateMessageResult,
	DeleteMessageResult,
	GetMessagesResult,
	IApiChatmessage,
	IChatmessage,
} from "../types";
import { DEFAULT_ERROR_MESSAGE } from "../vars/messages";
import { DEFAULT_ERROR_RESULT } from "./shared";
import { getApiBaseUrl, getDefaultHeaders } from "./utils";

export const deserializeChatmessage = (apiMessage: IApiChatmessage): IChatmessage => {
	return {
		id: apiMessage._id,
		chatroom: apiMessage.chatroom,
		publishedAt: new Date(apiMessage.published_at),
		data: apiMessage.data,
		user: apiMessage.user,
	};
};

export const GetMessages = async (jwt: string): Promise<GetMessagesResult> => {
	const url = getApiBaseUrl() + "/messages";

	try {
		const response = await axios.get(url, { headers: getDefaultHeaders(jwt) });

		if (response.data && Array.isArray(response.data)) {
			return {
				isSuccess: true,
				messages: response.data.map((message: IApiChatmessage) => deserializeChatmessage(message)),
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

export const GetMessage = async (id: string) => {
	const url = getApiBaseUrl() + `/messages/${id}`;

	try {
		const response = await axios.get(url);
		console.log("get message response", response);
	} catch (e) {
		console.log("get message error", e);
	}
};

export const CreateMessage = async (jwt: string, message: CreateMessageRequest): Promise<CreateMessageResult> => {
	const url = getApiBaseUrl() + "/messages";

	try {
		const response = await axios.post(url, message, { headers: getDefaultHeaders(jwt) });

		if (response.data) {
			return {
				isSuccess: true,
				message: deserializeChatmessage(response.data),
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

export const DeleteMessage = async (jwt: string, id: string): Promise<DeleteMessageResult> => {
	const url = getApiBaseUrl() + `/messages/${id}`;

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
