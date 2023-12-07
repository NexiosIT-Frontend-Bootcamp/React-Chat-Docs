import React, { useState } from "react";
import { Alert, Box, Button, Link, TextField, Typography } from "@mui/material";
import styles from "./LoginForm.module.css";
import { useUserContext } from "../../../contexts";
import { PATH_REGISTER } from "../../routes";

export interface ILoginFormProps {
	onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: ILoginFormProps) => {
	const { signIn, loading } = useUserContext();
	const [submitError, setSubmitError] = useState<string>();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		const email = data.get("email")?.toString();
		const password = data.get("password")?.toString();

		if (email && password) {
			const result = await signIn(email, password);
			if (!result.isSuccess) {
				setSubmitError(result.error);
			} else {
				// login was a succes, call success callback
				onSuccess();
			}
		}
	};

	return (
		<Box className={styles.loginFormContainer}>
			<Typography variant="h4">Sign In</Typography>
			<Box component="form" onSubmit={handleSubmit}>
				<TextField
					defaultValue=""
					margin="normal"
					required
					fullWidth
					id="email"
					label="Email Address"
					name="email"
					autoComplete="email"
					autoFocus
				/>
				<TextField
					defaultValue=""
					margin="normal"
					required
					fullWidth
					name="password"
					label="Password"
					type="password"
					id="password"
					autoComplete="current-password"
				/>
				{submitError && <Alert severity="error">{submitError}</Alert>}
				<Button disabled={loading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
					Sign In
				</Button>
				<Link href={PATH_REGISTER} variant="body2">
					Don't have an account? Sign Up
				</Link>
			</Box>
		</Box>
	);
};
