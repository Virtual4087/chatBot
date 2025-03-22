import { useState, useEffect } from "react";
import users from "../data/users.json";

const useAuth = () => {

	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
		return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false;
	});

	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});

	const [error, setError] = useState(null);

	// Update localStorage whenever isLoggedIn or user changes
	useEffect(() => {
		localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
	}, [isLoggedIn]);

	useEffect(() => {
		localStorage.setItem("user", JSON.stringify(user));
	}, [user]);

	// Login function
	const login = (email, password) => {

		const user = users.find(
			(u) => u.email === email && u.password === password
		);

		if (user) {
			setIsLoggedIn(true);
			setUser({ name: user.name, email: user.email });
			setError(null);
			console.log("Login successful. User:", user);
			window.location.reload();
		} else {
			setError("Invalid email or password");
		}
	};

	// Registration function
	const register = (name, email, password) => {

		const existingUser = users.find((u) => u.email === email);
	
		if (existingUser) {
			setError("Email already registered");
		} else {
			const newUser = { name, email, password };
			
			users.push(newUser);
	
			localStorage.setItem("user", JSON.stringify(newUser));
			localStorage.setItem("isLoggedIn", JSON.stringify(true));
	
			setIsLoggedIn(true);
			setUser({ name, email });
			setError(null);
	
			console.log("Registration successful. User:", newUser);
			window.location.reload();
		}
	};

	// Logout function
	const logout = () => {
		console.log("Logout successful asda");
		setIsLoggedIn(false);
		setUser(null);
		setError(null);
		window.location.reload();
	};

	return {
		isLoggedIn,
		user,
		error,
		login,
		register,
		logout,
	};
};

export default useAuth;