import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PATH_LOGIN, PATH_REGISTER, PATH_ROOT } from "./pages/routes";
import { PageNotFound } from "./pages/notfound";
import { RequireAuth } from "./components";
import { MainPage } from "./pages/main";
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";

function App() {
	return (
		<div className="app-container">
			<BrowserRouter>
				<Routes>
					<Route element={<RequireAuth />}>
						<Route path={PATH_ROOT} element={<MainPage />} />
					</Route>
					<Route element={<RequireAuth expectAuth={false} redirectPath={PATH_ROOT} />}>
						<Route path={PATH_LOGIN} element={<LoginPage />} />
					</Route>
					<Route path={PATH_REGISTER} element={<RegisterPage />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
