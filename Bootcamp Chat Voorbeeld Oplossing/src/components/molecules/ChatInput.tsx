import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Send } from "@mui/icons-material";
import { CircularProgress, Grid, IconButton, Input } from "@mui/material";
import styles from "./ChatInput.module.css";

interface IChatInputProps {
	onSubmitMessage: (message: string) => void;
	submitMessageLoading: boolean;
	enabled: boolean;
}

export const ChatInput = ({ onSubmitMessage, submitMessageLoading, enabled }: IChatInputProps) => {
	const [value, setValue] = useState<string>("");
	const textInput = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (textInput.current) textInput.current.focus();
	});

	const valid = useMemo(() => {
		if (!value || value === "") return false;
		else return true;
	}, [value]);

	const handleClickSubmit = useCallback(() => {
		onSubmitMessage(value);
		setValue("");
	}, [value]);

	const handleInputKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") handleClickSubmit();
		},
		[value]
	);

	return (
		<Grid container padding={2} paddingTop={1.5} className={styles.chatInputContainer}>
			<Grid item xs={11}>
				<Input
					ref={textInput}
					onKeyDown={handleInputKeyDown}
					disabled={!enabled || submitMessageLoading}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					fullWidth
					placeholder="Type Message"
				/>
			</Grid>
			<Grid item xs={1}>
				{submitMessageLoading ? (
					<CircularProgress size={42} />
				) : (
					<IconButton onClick={handleClickSubmit} disabled={!valid || !enabled} color="primary" size="medium">
						<Send fontSize="large" />
					</IconButton>
				)}
			</Grid>
		</Grid>
	);
};
