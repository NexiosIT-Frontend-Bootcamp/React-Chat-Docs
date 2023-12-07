import { useState, useMemo } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import styles from "./CreateChatroomModal.module.css";
import { CreateChatroomRequest, IUser } from "../../../../types";
import { CreateChatroom } from "../../../../api/Chatroom";
import { useUserContext } from "../../../../contexts";
import { UserSelect } from "../../../../components/molecules/UserSelect";

interface ICreateChatroomModalProps {
	open: boolean;
	onClose: () => void;
	users: IUser[];
}

export const CreateChatroomModal = ({ onClose, open, users }: ICreateChatroomModalProps) => {
	const { jwt, user } = useUserContext();
	const [submitLoading, setSubmitLoading] = useState<boolean>(false);
	const [submitError, setSubmitError] = useState<string>();
	const [name, setName] = useState<string>("");
	const [ids, setIds] = useState<string[]>([]);

	const handleSubmit = async () => {
		setSubmitLoading(true);

		if (jwt) {
			const request: CreateChatroomRequest = {
				name: ids.length > 2 ? name : new Date().getTime().toString() + ids[0],
				allowed_users: ids,
			};

			const response = await CreateChatroom(jwt, request);

			if (response?.isSuccess && response?.chatroom) {
				setSubmitLoading(false);
				handleClose();
			} else {
				setSubmitError(response?.error);
			}
		}
	};

	const handleChangeCheckedUsers = (selectedUsers: IUser[]) => {
		if (user && user.id) {
			setIds([user.id, ...selectedUsers.map((user) => user.id)]);
		}
	};

	const handleClose = () => {
		setName("");
		onClose();
	};

	const showNameField = useMemo(() => {
		return ids.length > 2;
	}, [ids]);

	const valid = useMemo(() => {
		if (ids.length === 1) return false;
		if (ids.length === 2) return true;
		if (ids.length > 2) return name !== "";
		return false;
	}, [name, ids]);

	return (
		<Dialog className={styles.CreateChatroomModal} open={open} onClose={handleClose}>
			<DialogTitle>New Chatroom</DialogTitle>
			<DialogContent>
				<div className={styles.userSelectContainer}>
					{<UserSelect users={users} onChange={handleChangeCheckedUsers} />}
				</div>
				{showNameField && (
					<TextField
						autoFocus
						label="Chatroom Name"
						type="text"
						fullWidth
						variant="standard"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				)}
				{submitError && <Alert severity="error">{submitError}</Alert>}
			</DialogContent>
			<DialogActions style={{ padding: "20px" }}>
				<Button disabled={submitLoading} onClick={handleClose}>
					Cancel
				</Button>
				<Button disabled={submitLoading || !valid} variant="contained" onClick={handleSubmit}>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};
