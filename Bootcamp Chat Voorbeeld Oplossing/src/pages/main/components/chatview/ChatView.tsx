import { useState, useMemo } from "react";
import { ChatHistory, ChatInput, ChatViewHeader } from "../../../../components";
import { useUserContext } from "../../../../contexts";
import styles from "./ChatView.module.css";
import { CreateMessageRequest, IChatmessage, IChatroom, IUser } from "../../../../types";
import { CreateMessage } from "../../../../api/Chatmessage";

interface IChatViewProps {
	selectedChatroom: IChatroom | undefined;
	users: IUser[];
	messages: IChatmessage[] | undefined;
	messagesLoading?: boolean;
	messagesError?: string;
}

export const ChatView = ({ selectedChatroom, users, messages, messagesError, messagesLoading }: IChatViewProps) => {
	const { user, jwt } = useUserContext();

	const [submitLoading, setSubmitLoading] = useState<boolean>(false);

	const handleSubmitMessage = async (message: string) => {
		setSubmitLoading(true);

		if (selectedChatroom && jwt && user && user.id) {
			const request: CreateMessageRequest = {
				chatroom: selectedChatroom.id,
				user: user.id,
				data: message,
			};

			await CreateMessage(jwt, request);
		}

		setSubmitLoading(false);
	};

	const isInputEnabled = useMemo(() => {
		return selectedChatroom !== undefined;
	}, [selectedChatroom]);

	return (
		<div className={styles.chatViewContainer}>
			<ChatViewHeader users={users} selectedChat={selectedChatroom} />
			<ChatHistory
				messagesError={messagesError}
				messagesLoading={messagesLoading}
				users={users}
				userId={user?.id}
				messages={
					selectedChatroom
						? messages?.filter((msg) => msg.chatroom === selectedChatroom.id).reverse()
						: undefined
				}
			/>
			<ChatInput
				enabled={isInputEnabled}
				submitMessageLoading={submitLoading}
				onSubmitMessage={handleSubmitMessage}
			/>
		</div>
	);
};
