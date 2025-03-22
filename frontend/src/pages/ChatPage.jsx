import React, { useState, useEffect } from "react";
import ChatWindow from "../components/Chat/ChatWindow";
import InputBox from "../components/Chat/InputBox";
import StatusIndicator from "../components/Chat/StatusIndicator";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "../components/ui/card";
import LoginPopup from "../components/Auth/LoginPopup";
import ExpandableSidebar from "../components/Chat/ExpandableSidebar";
import useAuth from "../hooks/useAuth";

const ChatPage = () => {
	const [messages, setMessages] = useState([]);
	const [currentStatus, setCurrentStatus] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [eventSource, setEventSource] = useState(null);
	const { login, logout } = useAuth();
	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
		return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false;
	});
	const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

	useEffect(() => {
		return () => {
			if (eventSource) {
				eventSource.close();
			}
		};
	}, [eventSource]);

	const handleLoginSuccess = () => {
		console.log("Login successful", isLoggedIn);
		setIsLoginPopupOpen(false);
	};

	const handleLogin = (email, password) => {
		console.log("Login successful as", isLoggedIn);
		login(email, password);
	};

	const handleLogout = () => {
		logout();
	};

	const handleSendMessage = async (message) => {
		setMessages((prev) => [...prev, { text: message, sender: "user" }]);
		setIsLoading(true);

		const timeout = setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					text: "Error: The API is taking too long to respond. Please try again later.",
					sender: "bot",
				},
			]);
			setIsLoading(false);
			setCurrentStatus(null);
			if (eventSource) eventSource.close();
		}, 30000);

		const es = new EventSource(
			`http://localhost:8000/api/chat/?message=${encodeURIComponent(message)}`
		);
		setEventSource(es);

		es.onmessage = (event) => {
			const data = event.data.replace(/\\n/g, "\n"); // Replace escaped line breaks

			if (data === "[DONE]") {
				clearTimeout(timeout);
				es.close();
				setIsLoading(false);
				setCurrentStatus(null);
			} else if (data === "Scraping links...") {
				setCurrentStatus("Scraping links...");
			} else if (data === "Thinking...") {
				setCurrentStatus("Thinking...");
			} else if (data.startsWith("Error:")) {
				clearTimeout(timeout);
				setMessages((prev) => [
					...prev,
					{
						text: "An error occurred. Check console for more details.",
						sender: "bot",
					},
				]);
				es.close();
				setIsLoading(false);
				setCurrentStatus(null);
				console.error("Backend Error:", data);
			} else {
				setCurrentStatus(null);
				setMessages((prev) => {
					const lastMessage = prev[prev.length - 1];
					if (lastMessage?.sender === "bot") {
						return [
							...prev.slice(0, -1),
							{ text: lastMessage.text + data, sender: "bot" },
						];
					} else {
						return [...prev, { text: data, sender: "bot" }];
					}
				});
			}
		};

		es.onerror = (error) => {
			clearTimeout(timeout);
			console.error("SSE Error:", error);
			setMessages((prev) => [
				...prev,
				{
					text: "Error: Something went wrong. Please check the console for details.",
					sender: "bot",
				},
			]);
			setIsLoading(false);
			es.close();
			setCurrentStatus(null);
		};
	};

	const handleStopResponse = () => {
		if (eventSource) {
			eventSource.close();
			setIsLoading(false);
			setCurrentStatus(null);
			setMessages((prev) => [
				...prev,
				{ text: "Response stopped.", sender: "bot" },
			]);
		}
	};

	return (
		<div className="flex bg-black min-h-screen">
			<ExpandableSidebar
				onLoginClick={() => setIsLoginPopupOpen(true)}
				onToggle={(isExpanded) => setIsSidebarExpanded(isExpanded)}
				isLoggedIn={isLoggedIn}
				onLogout={handleLogout}
			/>

			<div
				className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
					isSidebarExpanded
						? "ml-72 lg:ml-80 xl:ml-96"
						: "ml-16 lg:ml-20 xl:ml-24"
				}`}
			>
				<Card className="flex-1 flex flex-col overflow-hidden rounded-none py-0 relative">
					<CardHeader className="p-4 border-b">
						<CardTitle className="text-xl lg:text-2xl font-bold">
							Chat with Vox
						</CardTitle>
						<CardDescription className="text-sm lg:text-base">
							Your friendly AI assistant. Ask me anything!
						</CardDescription>
					</CardHeader>

					<div className="flex-1 overflow-y-auto p-4">
						<ChatWindow messages={messages} isLoggedIn={isLoggedIn} />
					</div>
	
					<div className="sticky bottom-0 ">
					<div className="w-max px-4 m-auto -mt-4">
						<StatusIndicator status={currentStatus} />
					</div>

					<div className="bg-background border-t p-4 z-10">
						<InputBox
							onSendMessage={handleSendMessage}
							isLoading={isLoading}
							onStopResponse={handleStopResponse}
							isLoggedIn={isLoggedIn}
						/>
					</div>
					</div>
				</Card>
			</div>

			<LoginPopup
				isOpen={isLoginPopupOpen}
				onOpenChange={setIsLoginPopupOpen}
				onLoginSuccess={handleLoginSuccess}
				onLogin={handleLogin}
			/>
		</div>
	);
};

export default ChatPage;