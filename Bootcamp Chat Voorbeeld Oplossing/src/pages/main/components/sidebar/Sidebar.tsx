import { useState, useMemo } from "react";
import { ChatList, SidebarHeader, SidebarSearch } from "../../../../components";
import styles from "./Sidebar.module.css";
import { useUserContext } from "../../../../contexts";
import { IChatroom, IUser } from "../../../../types";
import { DeleteChatroom } from "../../../../api/Chatroom";
import { CircularProgress } from "@mui/material";

interface ISidebarProps {
	onClickNewChat?: () => void;
	onSelectChatroom: (room: IChatroom | undefined) => void;
	selectedChatroom: IChatroom | undefined;
	users: IUser[];
	usersLoading?: boolean;
	usersError?: string;
	chatrooms: IChatroom[];
	chatroomsLoading?: boolean;
	chatroomsError?: string;
}

export const Sidebar = ({
	onClickNewChat,
	onSelectChatroom,
	selectedChatroom,
	users,
	usersError,
	usersLoading,
	chatrooms,
	chatroomsError,
	chatroomsLoading,
}: ISidebarProps) => {
	const { signOut, jwt } = useUserContext();

	const [filterValue, setFilterValue] = useState<string>("");

	const handleDeleteChat = async (chatroom: IChatroom) => {
		if (!jwt) return;
		try {
			await DeleteChatroom(jwt, chatroom.id);
		} catch (e) {
			console.error("Error deleting chatroom: ", e);
		}
	};

	const handleSignOut = () => {
		signOut();
	};

	const handleClickNewChat = () => {
		onClickNewChat?.();
	};

	const filteredChatrooms = useMemo(() => {
		if (!filterValue || filterValue === "") return chatrooms;
		return chatrooms?.filter((room) => {
			if (room.allowedUsers.length > 2) {
				return room.name.toLowerCase().includes(filterValue.toLowerCase());
			} else {
				const fullUsers = room.allowedUsers.map((id) => users?.find((user) => user.id === id));
				return (
					fullUsers.findIndex((user) => user?.username.toLowerCase().includes(filterValue.toLowerCase())) !==
					-1
				);
			}
		});
	}, [filterValue, chatrooms, users]);

	return (
		<div className={styles.sidebarContainer}>
			<SidebarHeader onClickNewChat={handleClickNewChat} onSignOut={handleSignOut} />
			<SidebarSearch value={filterValue} onChange={setFilterValue} />
			{(chatroomsLoading || usersLoading) && <CircularProgress size={42} />}
			{chatroomsError && <div>{chatroomsError}</div>}
			{usersError && <div>{usersError}</div>}
			<ChatList
				selectedChat={selectedChatroom}
				onSelectChat={onSelectChatroom}
				chatrooms={filteredChatrooms}
				users={users}
				onDeleteChat={handleDeleteChat}
			/>
		</div>
	);
};
