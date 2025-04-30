import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		const payload = { email, password };

		if (!email || !password) {
			setError("Please enter both email and password.");
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch("http://localhost:9090/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Login failed");
				setIsLoading(false);
				return;
			}

			const { token } = data;
			localStorage.setItem("authToken", token);

			navigate("/Dashboards");

		} catch (err) {
			setError("An error occurred. Please try again.");
			setIsLoading(false);
		}
	};

	return (
		<div className="relative flex items-center justify-center min-h-screen bg-gray-100">
			<div className="absolute inset-0 bg-cover bg-center">
				<div className="absolute inset-0 bg-black opacity-70"></div>
			</div>
			<div className="relative bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-md mx-4">
				<h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Login</h1>

				{/* Error Message Display */}
				{error && (
					<p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-md">{error}</p>
				)}

				<form onSubmit={handleLogin} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
							E-mail
						</label>
						<input
							type="email"
							id="email"
							className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
							Password
						</label>
						<input
							type="password"
							id="password"
							className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					{/* Login Button */}
					<div className="flex flex-col gap-4">
						{isLoading ? (
							<Button className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 rounded-md py-2">
								<span className="text-center">Logging in...</span>
							</Button>
						) : (
							<Button
								type="submit"
								className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 rounded-md py-2"
							>
								Login
							</Button>
						)}

						<Button className="w-full bg-gray-100 text-black hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 rounded-md py-2">
							<Link to="/RegisterPage" className="block text-center text-black hover:text-gray-700">
								Don't have an account? Register
							</Link>
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;

