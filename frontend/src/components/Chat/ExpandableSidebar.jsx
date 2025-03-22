import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { LogIn, LogOut, Menu, Home, Settings, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LogoutConfirmationPopup from "./LogoutConfirmationPopup";

const ExpandableSidebar = ({
	onLoginClick,
	onLogout,
	onToggle,
	isLoggedIn,
}) => {
	const [isExpanded, setIsExpanded] = useState(true);
	const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
	const [user, setUser] = useState(null);

	// Fetch user from localStorage on component mount
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
			console.log("User fetched from localStorage", user);
		}
	}, [isLoggedIn]);

	const handleLogoutConfirm = () => {
		console.log("Logout successful");
		setIsLogoutPopupOpen(false);
		onLogout();
	};

	const handleToggle = () => {
		const newState = !isExpanded;
		setIsExpanded(newState);
		onToggle(newState);
	};

	const handleLogoutClick = () => {
		setIsLogoutPopupOpen(true);
	};

	const handleLogoutCancel = () => {
		setIsLogoutPopupOpen(false);
	};

	return (
		<div
			className={`fixed h-screen bg-black/95 backdrop-blur-lg border-r border-gray-800 transition-all duration-300 ease-in-out z-10 ${
				isExpanded ? "w-72 lg:w-80 xl:w-96" : "w-16 lg:w-20 xl:w-24"
			} overflow-hidden box-border`}
		>
			{/* Toggle Button */}
			<Button
				className={`p-2 absolute z-50 ${
					isExpanded
						? "top-7 right-5"
						: "top-7 left-1/2 transform -translate-x-1/2"
				} hover:bg-gray-800/50 transition-all duration-300 ease-in-out`}
				variant="ghost"
				onClick={handleToggle}
			>
				<Menu className="size-5 lg:size-6 xl:size-7 text-white" />
			</Button>

			{/* Collapsed State Icons */}
			{!isExpanded && (
				<div className="flex flex-col items-center gap-4 mt-20">
					<Button
						className="w-full justify-center text-gray-300 hover:text-white hover:bg-gray-800/50"
						variant="ghost"
					>
						<Home className="size-5 lg:size-6 xl:size-7 text-white" />
					</Button>
					<Button
						className="w-full justify-center text-gray-300 hover:text-white hover:bg-gray-800/50"
						variant="ghost"
					>
						<Settings className="size-5 lg:size-6 xl:size-7 text-white" />
					</Button>
					<Button
						className="w-full justify-center text-gray-300 hover:text-white hover:bg-gray-800/50"
						variant="ghost"
					>
						<HelpCircle className="size-5 lg:size-6 xl:size-7 text-white" />
					</Button>
				</div>
			)}

			{/* Expanded State Content */}
			<div
				className={`p-6 transition-all duration-300 ease-in-out ${
					isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
			>
				<div
					className={`flex flex-col space-y-4 ${isExpanded ? "" : "hidden"}`}
				>
					<h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
						Vox
					</h1>
					<p className="text-sm lg:text-base xl:text-lg text-gray-400 uppercase tracking-widest font-medium">
						Your AI Companion
					</p>
				</div>

				<div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

				<nav className="space-y-2">
					<Button
						className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800/50"
						variant="ghost"
					>
						<Home className="size-5 lg:size-6 xl:size-7 group-hover:text-purple-400 text-white" />
						<span className="text-sm lg:text-base xl:text-lg">Home</span>
					</Button>
					<Button
						className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800/50"
						variant="ghost"
					>
						<Settings className="size-5 lg:size-6 xl:size-7 group-hover:text-purple-400 text-white" />
						<span className="text-sm lg:text-base xl:text-lg">Settings</span>
					</Button>
					<Button
						className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800/50"
						variant="ghost"
					>
						<HelpCircle className="size-5 lg:size-6 xl:size-7 group-hover:text-purple-400 text-white" />
						<span className="text-sm lg:text-base xl:text-lg">Help</span>
					</Button>
				</nav>
			</div>

			{/* Bottom Section */}
			<div className="absolute bottom-6 left-0 right-0 px-4 box-content">
				{isLoggedIn && user && (
					<div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 mb-4">
						<Avatar className="size-8 lg:size-10 xl:size-12">
							<AvatarImage src="/path/to/avatar.jpg" />
							<AvatarFallback className="text-black">
								{user.name.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						{isExpanded && (
							<div className="flex-1">
								<p className="text-sm lg:text-base xl:text-lg font-medium text-white">
									{user.name}
								</p>
								<p className="text-xs lg:text-sm xl:text-base text-gray-400">
									{user.email}
								</p>
							</div>
						)}
					</div>
				)}

				<Button
					className={`group flex items-center justify-center gap-2 p-2 rounded-lg transition-all duration-300 ease-in-out ${
						isExpanded
							? "w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30"
							: "w-auto mx-auto bg-transparent"
					}`}
					variant="ghost"
					onClick={isLoggedIn ? handleLogoutClick : onLoginClick}
				>
					{isLoggedIn ? (
						<LogOut className="size-5 lg:size-6 xl:size-7 text-white group-hover:text-purple-400 transition-colors" />
					) : (
						<LogIn className="size-5 lg:size-6 xl:size-7 text-white group-hover:text-purple-400 transition-colors" />
					)}
					{isExpanded && (
						<span className="text-sm lg:text-base xl:text-lg font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
							{isLoggedIn ? "Logout" : "Get Started"}
						</span>
					)}
				</Button>
			</div>

			<LogoutConfirmationPopup
				isOpen={isLogoutPopupOpen}
				onConfirm={handleLogoutConfirm}
				onCancel={handleLogoutCancel}
			/>
		</div>
	);
};

export default ExpandableSidebar;