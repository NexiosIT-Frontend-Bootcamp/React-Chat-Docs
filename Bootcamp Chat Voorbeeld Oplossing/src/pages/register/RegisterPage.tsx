import { useCallback } from "react";
import { Grid } from "@mui/material";
import { RegisterForm } from "./components/RegisterForm";
import { useNavigate } from "react-router-dom";
import { PATH_LOGIN } from "../routes";

export const RegisterPage = () => {
	const navigate = useNavigate();

	const handleRegisterSuccess = useCallback(() => {
		navigate(PATH_LOGIN, { replace: true });
	}, [navigate]);

	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justifyContent="center"
			style={{ minHeight: "100vh" }}
		>
			<Grid item xs={3}>
				<RegisterForm onSuccess={handleRegisterSuccess} />
			</Grid>
		</Grid>
	);
};
