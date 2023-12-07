import React, { useState } from "react";
import { Alert, Box, Button, TextField, Typography, Link } from "@mui/material";
import styles from "./RegisterForm.module.css";
import { PATH_LOGIN } from "../../routes";
import { RegisterUser } from "../../../api/User";

interface IRegisterFormProps {
	onSuccess: () => void;
}

export const RegisterForm = ({ onSuccess }: IRegisterFormProps) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [submitError, setSubmitError] = useState<string>();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrors({});
		setSubmitError(undefined);
		setLoading(true);

		const data = new FormData(event.currentTarget);

		const username = data.get("username")?.toString();
		const email = data.get("email")?.toString();
		const password = data.get("password")?.toString();
		const confirmPassword = data.get("confirm-password")?.toString();

		/** FORMCHECKS */
		let validForm = true;

		// valid password?
		if (password && password.length < 6) {
			validForm = false;
			setErrors({ ...errors, password: "Password needs to be at least 6 characters." });
		}

		// passwords match?
		if (password !== confirmPassword) {
			validForm = false;
			setErrors({ ...errors, "confirm-password": "Passwords do not match." });
		}

		if (validForm && username && email && password) {
			const result = await RegisterUser(username, email, password);

			if (!result.isSuccess) {
				setSubmitError(result.error);
			} else {
				onSuccess();
			}
		}
		setLoading(false);
	};

	return (
		<Box className={styles.registerFormContainer}>
			<Typography variant="h4">Sign Up</Typography>
			<Box component="form" onSubmit={handleSubmit}>
				<TextField
					margin="normal"
					required
					fullWidth
					id="username"
					label="Username"
					name="username"
					autoComplete="username"
					autoFocus
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					id="email"
					label="Email Address"
					name="email"
					autoComplete="email"
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					name="password"
					label="Password"
					type="password"
					id="password"
					autoComplete="current-password"
					error={!!errors["password"]}
					helperText={errors["password"]}
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					name="confirm-password"
					label="Confirm Password"
					type="password"
					id="confirm-password"
					autoComplete="confirm-password"
					error={!!errors["confirm-password"]}
					helperText={errors["confirm-password"]}
				/>
				{submitError && <Alert severity="error">{submitError}</Alert>}
				<Button disabled={loading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
					Sign Up
				</Button>
				<Link href={PATH_LOGIN} variant="body2">
					Already have an account? Sign In
				</Link>
			</Box>
		</Box>
	);
};
