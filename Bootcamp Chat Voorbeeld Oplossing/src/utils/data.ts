import { IChatroom, IUser } from "../types";

export interface IChatDisplayData {
	avatar: string;
	primary: string;
	secondary: string;
}

export const getChatDisplayData = (chatroom: IChatroom, users: IUser[], userId?: string): IChatDisplayData => {
	let avatar = "";
	let primary = "";
	let secondary = "";
	// if a private chat (2 members) show initials of other user
	// if its a group chat, show number of participants

	const isGroupChat = chatroom.allowedUsers.length > 2;

	if (isGroupChat) {
		avatar = `${chatroom.allowedUsers.length}`;
		primary = chatroom.name;
		// turn the array of user ids into a list of comma seperated usernames
		secondary = chatroom.allowedUsers
			.filter((id) => id !== userId)
			.map((id) => users.find((user) => user.id === id))
			.map((user) => user?.username)
			.join(", ");
	} else {
		const otherUserId = chatroom.allowedUsers.find((id) => id !== userId);
		const otherUser = users.find((user) => user.id === otherUserId);
		if (otherUserId && otherUser) {
			avatar = otherUser.initials.toUpperCase();
			primary = otherUser.username;
			secondary = "-"; // todo, time of latest message could go here
		}
	}

	return {
		avatar,
		primary,
		secondary,
	};
};
