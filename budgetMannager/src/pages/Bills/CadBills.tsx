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
				setBudgets(data.budgets || []);
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
		<div className="flex h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
			<Sidebar />

			<div className="flex-1 flex items-center justify-center p-6">
				<div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
					<h1 className="text-2xl font-bold text-gray-800 text-center">
						Register a New Bill
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
								htmlFor="category"
								className="block text-sm font-medium text-gray-700"
							>
								Category
							</label>
							<input
								id="category"
								type="text"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								placeholder="Enter category"
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								required
							/>
						</div>


						<div>
							<label htmlFor="budget" className="block text-sm font-medium text-gray-700">
								Budget
							</label>
							<select
								id="budget"
								value={selectedBudget}
								onChange={(e) => setSelectedBudget(e.target.value)}
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
								className="block text-sm font-medium text-gray-700"
							>
								Status
							</label>
							<select
								id="status"
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
								className={`w-full px-4 py-2 font-medium text-white rounded ${loading
									? "bg-gray-400 cursor-not-allowed"
									: "bg-indigo-600 hover:bg-indigo-700 transition duration-150"
									}`}
							>
								{loading ? "Saving..." : "Save Bill"}
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

export default CadBills;























































































































































