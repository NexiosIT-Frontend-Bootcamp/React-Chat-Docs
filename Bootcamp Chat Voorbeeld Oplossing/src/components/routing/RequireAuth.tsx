import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "../../contexts";
import { PATH_LOGIN } from "../../pages/routes";

interface IProps {
	expectAuth?: boolean;
	redirectPath?: string;
}

export const RequireAuth = ({ expectAuth = true, redirectPath = PATH_LOGIN }: IProps) => {
	const { user, jwt } = useUserContext();
	const isAuthenticated = user !== undefined && jwt !== undefined;
	const location = useLocation();

	if (isAuthenticated !== expectAuth) {
		// Redirect them to the /login page, but save the current location they were
		// trying to go to when they were redirected. This allows us to send them
		// along to that page after they login, which is a nicer user experience
		// than dropping them off on the home page.
		return <Navigate to={redirectPath} state={{ from: location }} />;
	}

	return <Outlet />;
};
