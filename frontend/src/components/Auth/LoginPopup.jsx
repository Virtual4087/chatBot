import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import useAuth from "../../hooks/useAuth";

const LoginPopup = ({ isOpen, onOpenChange, onLoginSuccess, onLogin }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const {login, register, error } = useAuth();
	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
		return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false;
	});

	useEffect(() => {
		if (isLoggedIn && onLoginSuccess) {
			console.log("Login successful");
			console.log("Login successful", isLoggedIn);
			onLoginSuccess();
		}
	}, [isLoggedIn, onLoginSuccess]);

	const handleLogin = () => {
		console.log("Login successful");
		console.log(isLoggedIn)
		onLogin(email, password);
	};

	const handleRegister = () => {
		register(name, email, password);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Welcome to Vox</DialogTitle>
					<DialogDescription>
						Login or register to start chatting with your AI assistant.
					</DialogDescription>
				</DialogHeader>
				<Tabs defaultValue="login" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="login">Login</TabsTrigger>
						<TabsTrigger value="register">Register</TabsTrigger>
					</TabsList>
					<TabsContent value="login">
						<div className="space-y-4">
							<div>
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div>
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							{error && <p className="text-red-500 text-sm">{error}</p>}
							<Button className="w-full" onClick={handleLogin}>
								Login
							</Button>
						</div>
					</TabsContent>
					<TabsContent value="register">
						<div className="space-y-4">
							<div>
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									type="text"
									placeholder="Enter your name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div>
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div>
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							{error && <p className="text-red-500 text-sm">{error}</p>}
							<Button className="w-full" onClick={handleRegister}>
								Register
							</Button>
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};

export default LoginPopup;