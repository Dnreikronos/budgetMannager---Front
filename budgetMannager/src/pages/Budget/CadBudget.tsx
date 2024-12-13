import { useState } from "react";
import Sidebar from "../../components/ui/sidebar.tsx";
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

			navigate("/ReadBudgets");
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		navigate("/ReadBudgets");
	};


	return (
		<div className="flex h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
			<Sidebar />

			<div className="flex-1 flex items-center justify-center p-6">
				<div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
					<h1 className="text-2xl font-bold text-gray-800 text-center">
						Register a New Budget
					</h1>

					{error && (
						<div className="text-red-600 bg-red-100 p-3 rounded-md text-sm mt-4" aria-live="polite">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4 mt-6">
						<div>
							<label
								htmlFor="value"
								className="block text-sm font-medium text-gray-700"
							>
								Value
							</label>
							<input
								id="value"
								type="number"
								value={value}
								onChange={(e) => setValue(e.target.value)}
								placeholder="Enter value"
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								required
							/>
						</div>

						<div>
							<label
								htmlFor="currency"
								className="block text-sm font-medium text-gray-700"
							>
								Currency
							</label>
							<input
								id="currency"
								type="text"
								value={currency}
								onChange={(e) => setCurrency(e.target.value)}
								placeholder="Enter currency (e.g., USD)"
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								required
							/>
						</div>

						<div>
							<label
								htmlFor="start"
								className="block text-sm font-medium text-gray-700"
							>
								Start Date
							</label>
							<input
								id="start"
								type="date"
								value={start}
								onChange={(e) => setStart(e.target.value)}
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								required
							/>
						</div>

						<div>
							<label
								htmlFor="end"
								className="block text-sm font-medium text-gray-700"
							>
								End Date
							</label>
							<input
								id="end"
								type="date"
								value={end}
								onChange={(e) => setEnd(e.target.value)}
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								required
							/>
						</div>

						<div className="flex items-center justify-between space-x-4">
							<button
								type="submit"
								disabled={loading}
								className={`w-full px-4 py-2 font-medium text-white rounded ${loading
									? "bg-gray-400 cursor-not-allowed"
									: "bg-indigo-600 hover:bg-indigo-700 transition duration-150"
									}`}
							>
								{loading ? "Saving..." : "Save Budget"}
							</button>

							<button
								type="button"
								onClick={handleCancel}
								className="w-full px-4 py-2 font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition duration-150"
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
