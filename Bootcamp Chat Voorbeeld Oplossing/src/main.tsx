import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import React from "react";
import ReactDOM from "react-dom/client";
import { UserContextProvider } from "./contexts";
import App from "./App.tsx";

const theme = createTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<UserContextProvider>
				<App />
			</UserContextProvider>
		</ThemeProvider>
	</React.StrictMode>
);
