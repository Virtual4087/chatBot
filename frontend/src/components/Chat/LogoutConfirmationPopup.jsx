import React from "react";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "../ui/dialog";

const LogoutConfirmationPopup = ({ isOpen, onConfirm, onCancel }) => {
	return (
		<Dialog open={isOpen} onOpenChange={onCancel}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure you want to logout?</DialogTitle>
					<DialogDescription>
						You will need to log back in to access your account.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Logout
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default LogoutConfirmationPopup;