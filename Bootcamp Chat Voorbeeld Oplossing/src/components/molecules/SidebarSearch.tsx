import { Search } from "@mui/icons-material";
import { Grid, Input } from "@mui/material";
import styles from "./SidebarSearch.module.css";

interface IProps {
	value: string;
	onChange: (value: string) => void;
}

export const SidebarSearch = ({ onChange, value }: IProps) => {
	return (
		<Grid padding={2} className={styles.sidebarSearchContainer} container flexDirection="row">
			<Input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				fullWidth
				placeholder="Search Chatrooms"
				endAdornment={<Search />}
			/>
		</Grid>
	);
};
