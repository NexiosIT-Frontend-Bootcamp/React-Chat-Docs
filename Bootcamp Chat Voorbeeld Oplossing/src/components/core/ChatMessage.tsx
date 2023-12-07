import { ReactNode } from "react";
import { Card, Typography } from "@mui/material";
import styles from "./ChatMessage.module.css";

interface IChatMessageProps {
	children: ReactNode;
	showTitle?: boolean;
	title: ReactNode;
}

export const ChatMessage = ({ children, showTitle = true, title }: IChatMessageProps) => {
	return (
		<Card className={styles.chatMessageCard}>
			{showTitle && (
				<Typography variant="h6" component="div">
					{title}
				</Typography>
			)}
			{children}
		</Card>
	);
};
