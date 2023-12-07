import { useCallback } from "react";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PATH_ROOT } from "../routes";
import { LoginForm } from "./components/LoginForm";

export const LoginPage = () => {
	const navigate = useNavigate();

	const handleLoginSuccess = useCallback(() => {
		navigate(PATH_ROOT, { replace: true });
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
				<LoginForm onSuccess={handleLoginSuccess} />
			</Grid>
		</Grid>
	);
};
