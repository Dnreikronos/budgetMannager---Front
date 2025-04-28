import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/ui/sidebar";

const CadBills = () => {
	const [value, setValue] = useState<number | string>("");
	const [category, setCategory] = useState<string>("");
	const [status, setStatus] = useState<string>("pending");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [budgets, setBudgets] = useState<any[]>([]);
	const [selectedBudget, setSelectedBudget] = useState<string>("");

	const navigate = useNavigate();

	useEffect(() => {
		const fetchBudgets = async () => {
			try {
				const response = await fetch("http://localhost:9090/Budgets");
				if (!response.ok) throw new Error("Failed to fetch budgets");

				const data = await response.json();
				setBudgets(data.Budgets || []);
			} catch (err: any) {
				setError(err.message || "Error loading budgets");
			}
		};

		fetchBudgets();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const billData = {
			value: Number(value),
			category,
			status,
			budget_id: selectedBudget,
		};

		try {
			const response = await fetch("http://localhost:9090/CreateBill", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(billData),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Failed to create bill");
			}

			navigate("/ReadBills");
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		navigate("/ReadBills");
	};

	return (
		<div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
			<Sidebar />

			<div className="flex-1 flex items-center justify-center p-6">
				<div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6">
					<h1 className="text-2xl font-bold text-black dark:text-white text-center">
						Register a New Bill
					</h1>

					{error && (
						<div className="text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900 p-3 rounded-md text-sm mt-4" aria-live="polite">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4 mt-6">
						<div>
							<label
								htmlFor="value"
								className="block text-sm font-medium text-black dark:text-white"
							>
								Value
							</label>
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

						<div>
							<label
								htmlFor="category"
								className="block text-sm font-medium text-black dark:text-white"
							>
								Category
							</label>
							<input
								id="category"
								type="text"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								placeholder="Enter category"
								className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
								required
							/>
						</div>

						<div>
							<label htmlFor="budget" className="block text-sm font-medium text-black dark:text-white">
								Budget
							</label>
							<select
								id="budget"
								value={selectedBudget}
								onChange={(e) => setSelectedBudget(e.target.value)}
								className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
								required
							>
								<option value="" disabled>Select a budget</option>
								{budgets.map((budget) => (
									<option key={budget.id} value={budget.id}>
										{budget.name || `Budget ${budget.id}`}
									</option>
								))}
							</select>
						</div>

						<div>
							<label
								htmlFor="status"
								className="block text-sm font-medium text-black dark:text-white"
							>
								Status
							</label>
							<select
								id="status"
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
							>
								<option value="pending">Pending</option>
								<option value="paid">Paid</option>
								<option value="unpaid">Unpaid</option>
							</select>
						</div>

						<div className="flex items-center justify-between space-x-4">
							<button
								type="submit"
								disabled={loading}
								className={`w-full bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 rounded-md px-4 py-2 mt-4 ${loading ? "cursor-not-allowed" : ""}`}
							>
								{loading ? "Saving..." : "Save Bill"}
							</button>

							<button
								type="button"
								onClick={handleCancel}
								className="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-md px-4 py-2 mt-4 hover:bg-gray-300 dark:hover:bg-gray-600"
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

export default CadBills;























































































































































