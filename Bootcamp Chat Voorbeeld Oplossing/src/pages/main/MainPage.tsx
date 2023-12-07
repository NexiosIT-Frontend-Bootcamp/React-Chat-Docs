import { useState, useEffect, useRef, useMemo } from "react";
import { Grid } from "@mui/material";
import { ChatView } from "./components/chatview/ChatView";
import { Sidebar } from "./components/sidebar/Sidebar";
import { IChatmessage, IChatroom, IUser, IWebsocketMessageData } from "../../types";
import { useUserContext } from "../../contexts";
import { CreateChatroomModal } from "./components/create-modal/CreateChatroomModal";
import { GetUsers, deserializeUser } from "../../api/User";
import { getWebsocketBaseUrl } from "../../api/utils";
import { GetMessages, deserializeChatmessage } from "../../api/Chatmessage";
import { GetChatrooms, deserializeChatroom } from "../../api/Chatroom";

export const MainPage = () => {
	const { jwt, user } = useUserContext();

	const [users, setUsers] = useState<IUser[]>([]);
	const [usersLoading, setUsersLoading] = useState<boolean>();
	const [usersError, setUsersError] = useState<string>();

	const [messages, setMessages] = useState<IChatmessage[]>();
	const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
	const [messagesError, setMessagesError] = useState<string>();

	const [chatrooms, setChatrooms] = useState<IChatroom[]>([]);
	const [chatroomsLoading, setChatroomsLoading] = useState<boolean>();
	const [chatroomsError, setChatroomErrors] = useState<string>();

	const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

	const [selectedChatroom, setSelectedChatroom] = useState<IChatroom>();

	// Websocket reference
	const webSocket = useRef<WebSocket | null>(null);

	// Set up websocket
	useEffect(() => {
		if (jwt) {
			webSocket.current = new WebSocket(getWebsocketBaseUrl());

			webSocket.current.onclose = (ev) => {
				console.log("on close")
			}

			webSocket.current.onmessage = (ev: MessageEvent<any>) => {
				if (ev.data) {
					const parsedData: IWebsocketMessageData = JSON.parse(ev.data);

					if (parsedData.event === "new_user") {
						setUsers((oldUsers) => [...(oldUsers || []), deserializeUser(parsedData.data)]);
					}

					if (parsedData.event === "new_message") {
						setMessages((oldMessages) => [...(oldMessages || []), deserializeChatmessage(parsedData.data)]);

						setSelectedChatroom((selectedChatroom) => {
							setChatrooms((chatrooms) =>
								chatrooms.map((room) => {
									const chatroomIdForNewMsg = parsedData.data.chatroom;

									if (room.id !== selectedChatroom?.id && room.id === chatroomIdForNewMsg) {
										return {
											...room,
											unreadMessages: room.unreadMessages + 1,
										};
									}

									return room;
								})
							);
							return selectedChatroom;
						});
					}

					if (parsedData.event === "delete_message") {
						setMessages((oldMessages) =>
							(oldMessages || []).filter((msg) => msg.id !== parsedData.data.id)
						);
					}

					if (parsedData.event === "new_chatroom") {
						setChatrooms((oldChatrooms) => [...(oldChatrooms || []), deserializeChatroom(parsedData.data)]);
					}

					if (parsedData.event === "delete_chatroom") {
						setChatrooms((chatrooms) => (chatrooms || []).filter((room) => room.id !== parsedData.data.id));
						setSelectedChatroom((selectedChatroom) =>
							selectedChatroom?.id === parsedData.data.id ? undefined : selectedChatroom
						);
					}
				}
			};
		}

		// return cleanup function
		return () => {
			if (webSocket.current) {
				webSocket.current.close();
			}
		};
	}, [jwt]);

	useEffect(() => {
		const loadMessages = async () => {
			if (!jwt) return [];

			setMessagesLoading(true);
			setMessagesError(undefined);

			const messagesResponse = await GetMessages(jwt);

			if (messagesResponse.isSuccess) {
				setMessages(messagesResponse.messages);
			} else {
				setMessagesError(messagesResponse.error);
			}

			setMessagesLoading(false);
		};

		const getAllUsers = async () => {
			if (!jwt) return [];

			setUsersError(undefined);
			setUsersLoading(true);

			const allUsersResult = await GetUsers(jwt);

			if (allUsersResult.isSuccess) {
				setUsers(allUsersResult.users || []);
			} else {
				setUsersError(allUsersResult.error);
			}

			setUsersLoading(false);
		};

		const getChatrooms = async () => {
			if (!jwt) return;
			setChatroomsLoading(true);
			setChatroomErrors(undefined);

			const chatroomsResult = await GetChatrooms(jwt);

			if (chatroomsResult.isSuccess) {
				setChatrooms(chatroomsResult.chatrooms || []);
			} else {
				setChatroomErrors(chatroomsResult.error);
			}

			setChatroomsLoading(false);
		};

		loadMessages();
		getAllUsers();
		getChatrooms();
	}, [jwt]);

	const handleSetSelectedChatroom = (chatroom: IChatroom | undefined) => {
		setSelectedChatroom(chatroom);

		if (chatroom) {
			setChatrooms((chatrooms) =>
				chatrooms.map((room) => {
					if (room.id === chatroom.id)
						return {
							...room,
							unreadMessages: 0,
						};

					return room;
				})
			);
		}
	};

	const visibleMessages = useMemo(() => {
		if (!selectedChatroom) return undefined;
		return messages?.filter((msg) => msg.chatroom === selectedChatroom.id);
	}, [messages, selectedChatroom]);

	const visibleChatrooms = useMemo(() => {
		if (!user) return [];
		return chatrooms.filter((room) => room.allowedUsers.includes(user.id));
	}, [chatrooms, user]);

	return (
		<Grid container spacing={0} direction="row" alignItems="flex-start" justifyContent="flex-start">
			<Sidebar
				users={users}
				usersError={usersError}
				usersLoading={usersLoading}
				chatrooms={visibleChatrooms}
				chatroomsError={chatroomsError}
				chatroomsLoading={chatroomsLoading}
				onSelectChatroom={handleSetSelectedChatroom}
				selectedChatroom={selectedChatroom}
				onClickNewChat={() => setCreateModalOpen(true)}
			/>
			<ChatView
				messages={visibleMessages}
				messagesError={messagesError}
				messagesLoading={messagesLoading}
				users={users}
				selectedChatroom={selectedChatroom}
			/>
			<CreateChatroomModal users={users} open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
		</Grid>
	);
};
