import { useState } from "react";
import Sidebar from "../../components/ui/sidebar";
import { useNavigate } from "react-router-dom";

const CadBudget = () => {
	const [value, setValue] = useState<number | string>("");
	const [currency, setCurrency] = useState<string>("");
	const [start, setStart] = useState<string>("");
	const [end, setEnd] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const startRFC = new Date(start).toISOString();
		const endRFC = new Date(end).toISOString();

		const budgetData = {
			value: Number(value),
			currency,
			start: startRFC,
			end: endRFC,
		};

		try {
			const response = await fetch("http://localhost:9090/CreateBudget", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(budgetData),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Failed to create budget");
			}

			navigate("/ReadBudget");
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		navigate("/ReadBudget");
	};

	return (
		<div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
			<Sidebar />

			<div className="flex-1 flex items-center justify-center p-6">
				<div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-extrabold text-black dark:text-white">
							Create New Budget
						</h1>
						<p className="mt-2 text-gray-600 dark:text-gray-400">
							Fill in the details below to create a new budget
						</p>
					</div>

					{error && (
						<div className="text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900 p-4 rounded-md text-sm mb-6" aria-live="polite">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label
									htmlFor="value"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
								>
									Value
								</label>
								<div className="relative">
									<input
										id="value"
										type="number"
										value={value}
										onChange={(e) => setValue(e.target.value)}
										placeholder="Enter value"
										className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
										required
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="currency"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
								>
									Currency
								</label>
								<input
									id="currency"
									type="text"
									value={currency}
									onChange={(e) => setCurrency(e.target.value)}
									placeholder="Enter currency (e.g., USD)"
									className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="start"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
								>
									Start Date
								</label>
								<input
									id="start"
									type="date"
									value={start}
									onChange={(e) => setStart(e.target.value)}
									className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="end"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
								>
									End Date
								</label>
								<input
									id="end"
									type="date"
									value={end}
									onChange={(e) => setEnd(e.target.value)}
									className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
									required
								/>
							</div>
						</div>

						<div className="flex items-center justify-between space-x-4 mt-8">
							<button
								type="submit"
								disabled={loading}
								className={`w-full px-4 py-2 font-medium text-white rounded-lg shadow-lg transition-all duration-200 ${
									loading
										? "bg-gray-400 cursor-not-allowed"
										: "bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:scale-105"
								}`}
							>
								{loading ? (
									<span className="flex items-center justify-center">
										<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Creating...
									</span>
								) : (
									"Create Budget"
								)}
							</button>

							<button
								type="button"
								onClick={handleCancel}
								className="w-full px-4 py-2 font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CadBudget;
