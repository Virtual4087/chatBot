import React, { useEffect, useState } from "react";
import Message from "./Message";
import { ScrollArea } from "../ui/scroll-area";

const ChatWindow = ({ messages, isLoggedIn }) => {
	const [user, setUser] = useState(null);

	// Fetch user from localStorage on component mount
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
			console.log("User fetched from localStorage", user);
		}
	}, [isLoggedIn]);

	return (
		<ScrollArea className="flex-1 p-4 overflow-y-auto rounded-lg">
	
			{!isLoggedIn && (
				<div className="flex flex-col items-center justify-center h-full space-y-6">
					<p className="text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
						Welcome to Vox
					</p>
					<p className="text-xl lg:text-2xl xl:text-3xl text-gray-400 text-center max-w-2xl">
						Please log in to start chatting with your AI companion. Join the conversation and unlock the full experience.
					</p>
				</div>
			)}


			{isLoggedIn && messages.length === 0 && user && (
				<div className="flex flex-col items-center justify-center h-full space-y-6">
					<h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
						Hi {user.name}, I'm Vox
					</h1>
					<p className="text-xl lg:text-2xl xl:text-3xl text-gray-400 text-center max-w-2xl">
						Your personal AI assistant. How can I help you today?
					</p>
				</div>
			)}


			{isLoggedIn && messages.length > 0 && (
				<>
					{messages.map((msg, index) => (
						<Message key={index} text={msg.text} sender={msg.sender} />
					))}
				</>
			)}
		</ScrollArea>
	);
};

export default ChatWindow;