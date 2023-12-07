import { ReactNode } from "react";
import { Avatar, Badge, Grid, ListItem, ListItemAvatar, MenuItem, Typography } from "@mui/material";
import styles from "./ChatListItem.module.css";
import { ContextMenu } from "../core/ContextMenu";

interface IChatListItemProps {
	primary: ReactNode;
	secondary?: ReactNode;
	avatar?: ReactNode;
	onClick: () => void;
	onClickDelete: () => void;
	selected: boolean;
	unreadMessages?: number;
}

export const ChatListItem = ({
	primary,
	secondary,
	onClick,
	onClickDelete,
	selected,
	avatar,
	unreadMessages,
}: IChatListItemProps) => {
	return (
		<ListItem selected={selected} onClick={onClick} className={styles.chatListItemContainer}>
			<Grid container flexDirection="row">
				<Grid item xs={11}>
					<Grid container flexDirection="row">
						<Grid item xs={2}>
							<ListItemAvatar>
								<Avatar>
									<Typography>{avatar}</Typography>
								</Avatar>
							</ListItemAvatar>
						</Grid>
						<Grid item xs={10}>
							<Grid container flexDirection="column">
								<h4 style={{ margin: 0, padding: 0 }}>{primary}</h4>
								<sub>{secondary}</sub>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={1}>
					<Grid container flexDirection="row">
						<Grid item xs={6}>
							{unreadMessages ? <Badge badgeContent={unreadMessages} color="primary" /> : ""}
						</Grid>
						<Grid item xs={6}>
							<ContextMenu size="small">
								<MenuItem onClick={onClickDelete}>Delete Chatroom</MenuItem>
							</ContextMenu>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</ListItem>
	);
};
