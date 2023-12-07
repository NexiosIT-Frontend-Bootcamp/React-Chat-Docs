import { Divider, List } from "@mui/material";
import { useUserContext } from "../../contexts";
import { IChatroom, IUser } from "../../types";
import { getChatDisplayData } from "../../utils/data";
import styles from "./ChatList.module.css";
import { ChatListItem } from "./ChatListItem";

interface IChatListProps {
	chatrooms?: IChatroom[];
	users?: IUser[];
	selectedChat?: IChatroom;
	onSelectChat: (chatroom: IChatroom) => void;
	onDeleteChat: (chatroom: IChatroom) => void;
}

export const ChatList = ({ chatrooms = [], users = [], selectedChat, onSelectChat, onDeleteChat }: IChatListProps) => {
	const { user } = useUserContext();
	return (
		<div className={styles.chatListContainer}>
			<List component="nav">
				{chatrooms.map((chatroom, index) => {
					const chatDisplay = getChatDisplayData(chatroom, users, user?.id);
					const { avatar, primary, secondary } = chatDisplay;
					return (
						<div key={index}>
							<ChatListItem
								selected={selectedChat?.id === chatroom.id}
								onClick={() => onSelectChat(chatroom)}
								avatar={avatar}
								primary={primary}
								secondary={secondary}
								onClickDelete={() => onDeleteChat(chatroom)}
								unreadMessages={chatroom.unreadMessages}
							/>
							{index !== chatrooms.length - 1 && <Divider />}
						</div>
					);
				})}
			</List>
		</div>
	);
};
