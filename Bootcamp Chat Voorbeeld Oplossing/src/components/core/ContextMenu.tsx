import React, { ReactNode, useState } from "react";
import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu } from "@mui/material";

interface IContextMenuProps {
	children?: ReactNode;
	closeOnClick?: boolean;
	size?: "small" | "medium" | "large";
}

export const ContextMenu = ({ children, closeOnClick = true, size = "medium" }: IContextMenuProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<IconButton
				aria-label="more"
				aria-controls={open ? "context-menu" : undefined}
				aria-expanded={open ? "true" : undefined}
				aria-haspopup="true"
				onClick={handleClick}
				size={size}
			>
				<MoreVert fontSize={size} />
			</IconButton>
			<Menu
				id="context-menu"
				anchorEl={anchorEl}
				open={open}
				onClick={closeOnClick ? handleClose : undefined}
				onClose={handleClose}
			>
				{children}
			</Menu>
		</div>
	);
};
