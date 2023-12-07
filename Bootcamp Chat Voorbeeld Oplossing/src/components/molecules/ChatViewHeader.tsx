import { useMemo } from "react";
import { Avatar, Grid, Typography } from "@mui/material";
import styles from "./ChatViewHeader.module.css";
import { IChatroom, IUser } from "../../types";
import { useUserContext } from "../../contexts";
import { getChatDisplayData } from "../../utils/data";

interface IChatViewHeaderProps {
	selectedChat?: IChatroom;
	users: IUser[];
}

export const ChatViewHeader = ({ selectedChat, users }: IChatViewHeaderProps) => {
	const { user } = useUserContext();

	const chatDisplay = useMemo(
		() =>
			selectedChat
				? getChatDisplayData(selectedChat, users, user?.id) // TODO: user list
				: { primary: "", secondary: "", avatar: "" },
		[selectedChat]
	);

	return (
		<Grid padding={1} container flexDirection="row" className={styles.chatViewHeaderContainer}>
			{selectedChat ? (
				<>
					<Avatar sx={{ width: 42, height: 42 }}>
						<Typography>{chatDisplay.avatar}</Typography>
					</Avatar>
					<div className={styles.chatDetails}>
						<Typography variant="body1">{chatDisplay.primary}</Typography>
						<Typography variant="body2">{chatDisplay.secondary}</Typography>
					</div>
				</>
			) : null}
		</Grid>
	);
};
