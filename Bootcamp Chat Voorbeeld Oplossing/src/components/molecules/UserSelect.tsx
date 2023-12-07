import { useState, useMemo, useCallback } from "react";
import { Checkbox, List, ListItem } from "@mui/material";
import { IUser } from "../../types";
import { useUserContext } from "../../contexts";

interface IUserSelectProps {
	onChange: (selectedUsers: IUser[]) => void;
	users: IUser[];
}

export const UserSelect = ({ onChange, users }: IUserSelectProps) => {
	const { user: loggedInUser } = useUserContext();

	const [checkedUsers, setCheckedUsers] = useState<IUser[]>([]);

	const handleToggle = useCallback(
		(user: IUser, checked: boolean) => {
			let newSelected;

			if (checked) {
				newSelected = [...checkedUsers, user];
			} else {
				newSelected = checkedUsers.filter((tempUser) => tempUser.id !== user.id);
			}
			
			setCheckedUsers(newSelected);
			onChange(newSelected);
		},
		[checkedUsers]
	);

	const availableUsers = useMemo(() => {
		return users.filter((user) => user.id !== loggedInUser?.id);
	}, [loggedInUser, users]);

	if (availableUsers.length === 0) return <>No users to connect with.</>;

	return (
		<List>
			{availableUsers.map((user, index) => {
				return (
					<ListItem
						key={index}
						secondaryAction={
							<Checkbox
								edge="end"
								onChange={(_, checked) => handleToggle(user, checked)}
								checked={checkedUsers.indexOf(user) !== -1}
							/>
						}
					>
						{user.username}
					</ListItem>
				);
			})}
		</List>
	);
};
