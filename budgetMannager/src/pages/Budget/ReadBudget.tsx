import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/ui/sidebar";
import DataTable from "../../components/ui/dataTable";
import BudgetProgress from "../../components/ui/budgetProgress";
import { ColumnDef } from "@tanstack/react-table";

type Budget = {
	id: string;
	value: number;
	currency: string;
	start: string;
	end: string;
};

const ReadBudgetPage = () => {
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]);
	const [search, setSearch] = useState<string>("");
	const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
	const [bills, setBills] = useState<any[]>([]);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize] = useState<number>(5);

	const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
	const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [budgetsResponse, billsResponse] = await Promise.all([
					fetch("http://localhost:9090/Budgets"),
					fetch("http://localhost:9090/Bills")
				]);

				if (!budgetsResponse.ok || !billsResponse.ok) {
					throw new Error("Failed to fetch data");
				}

				const budgetsData = await budgetsResponse.json();
				const billsData = await billsResponse.json();

				setBudgets(budgetsData.Budgets || []);
				setFilteredBudgets(budgetsData.Budgets || []);
				setBills(billsData.Bills || []);
			} catch (error: any) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value.toLowerCase();
		setSearch(query);
		const filtered = budgets.filter(
			(budget) =>
				budget.value.toString().includes(query) ||
				budget.currency.toLowerCase().includes(query) ||
				formatDate(budget.start).includes(query) ||
				formatDate(budget.end).includes(query)
		);
		setFilteredBudgets(filtered);
	};

	const openEditModal = (budget: Budget) => {
		setCurrentBudget(budget);
		setEditModalOpen(true);
	};

	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (currentBudget) {
			setCurrentBudget({ ...currentBudget, [e.target.name]: e.target.value });
		}
	};

	const handleSaveEdit = () => {
		if (currentBudget) {
			fetch(`http://localhost:9090/Budget/${currentBudget.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(currentBudget),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Failed to update budget");
					}
					setBudgets(budgets.map((b) => (b.id === currentBudget.id ? currentBudget : b)));
					setFilteredBudgets(filteredBudgets.map((b) => (b.id === currentBudget.id ? currentBudget : b)));
					setEditModalOpen(false);
				})
				.catch((error) => console.error("Error updating budget:", error));
		}
	};

	const handleDelete = (id: string) => {
		fetch(`http://localhost:9090/Budget/${id}`, { method: "DELETE" })
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to delete budget");
				}
				setFilteredBudgets(filteredBudgets.filter((budget) => budget.id !== id));
				setBudgets(budgets.filter((budget) => budget.id !== id));
			})
			.catch((error) => console.error("Error deleting budget:", error));
	};

	const getBudgetSpent = (budgetId: string) => {
		return bills
			.filter((bill) => bill.budget_id === budgetId)
			.reduce((total, bill) => total + bill.value, 0);
	};

	const totalItems = filteredBudgets.length;
	const totalPages = Math.ceil(totalItems / pageSize);

	const currentData = filteredBudgets.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const columns: ColumnDef<Budget>[] = [
		{ accessorKey: "value", header: "Value" },
		{ accessorKey: "currency", header: "Currency" },
		{
			accessorKey: "start",
			header: "Start",
			cell: ({ row }) => <span>{formatDate(row.original.start)}</span>,
		},
		{
			accessorKey: "end",
			header: "End",
			cell: ({ row }) => <span>{formatDate(row.original.end)}</span>,
		},
		{
			header: "Actions",
			cell: ({ row }) => (
				<div className="flex gap-2">
					<button
						onClick={() => setSelectedBudget(row.original)}
						className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 transition-colors"
					>
						View
					</button>
					<button
						onClick={() => openEditModal(row.original)}
						className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
					>
						Edit
					</button>
					<button
						onClick={() => handleDelete(row.original.id)}
						className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
					>
						Delete
					</button>
				</div>
			),
		},
	];

	return (
		<div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
			<Sidebar />

			<div className="flex-1 p-6 flex flex-col justify-center items-center">
				<div className="flex justify-between items-center mb-6 w-full max-w-7xl">
					<h1 className="text-3xl font-extrabold text-black dark:text-white">📊 Budgets List</h1>
					<button
						onClick={() => navigate("/CadBudget")}
						className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:scale-105 transition-all duration-200"
					>
						+ Add Budget
					</button>
				</div>

				<div className="mb-4 w-full max-w-7xl">
					<input
						type="text"
						placeholder="Search budgets..."
						value={search}
						onChange={handleSearch}
						className="px-4 py-2 border rounded-md shadow-sm w-full focus:ring focus:ring-indigo-200 bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
					/>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-7xl">
					<div className="lg:col-span-2">
						<div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
							{loading ? (
								<p>Loading...</p>
							) : error ? (
								<p>Error: {error}</p>
							) : (
								<>
									<div className="overflow-x-auto">
										<DataTable data={currentData} columns={columns} />
									</div>

									<div className="flex justify-between items-center mt-6">
										<button
											onClick={() => handlePageChange(currentPage - 1)}
											disabled={currentPage === 1}
											className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded disabled:bg-gray-300 dark:disabled:bg-gray-700 transition-colors"
										>
											Previous
										</button>
										<span className="text-gray-700 dark:text-gray-300">
											Page {currentPage} of {totalPages}
										</span>
										<button
											onClick={() => handlePageChange(currentPage + 1)}
											disabled={currentPage === totalPages}
											className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded disabled:bg-gray-300 dark:disabled:bg-gray-700 transition-colors"
										>
											Next
										</button>
									</div>
								</>
							)}
						</div>
					</div>

					<div className="lg:col-span-1">
						{selectedBudget ? (
							<div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 sticky top-6">
								<h2 className="text-xl font-bold mb-4 text-black dark:text-white">Budget Details</h2>
								<BudgetProgress
									startDate={selectedBudget.start}
									endDate={selectedBudget.end}
									value={selectedBudget.value}
									spent={getBudgetSpent(selectedBudget.id)}
									currency={selectedBudget.currency}
								/>
								<div className="mt-4 space-y-2">
									<p className="text-sm text-gray-600 dark:text-gray-400">
										<span className="font-medium">Currency:</span> {selectedBudget.currency}
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										<span className="font-medium">Start Date:</span> {formatDate(selectedBudget.start)}
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										<span className="font-medium">End Date:</span> {formatDate(selectedBudget.end)}
									</p>
								</div>
							</div>
						) : (
							<div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 sticky top-6">
								<h2 className="text-xl font-bold mb-4 text-black dark:text-white">Select a Budget</h2>
								<p className="text-gray-600 dark:text-gray-400">
									Click on the "View" button next to a budget to see its details and progress.
								</p>
							</div>
						)}
					</div>
				</div>

				{editModalOpen && currentBudget && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
							<h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Edit Budget</h2>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Value
									</label>
									<input
										name="value"
										type="number"
										value={currentBudget.value}
										onChange={handleEditChange}
										className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Currency
									</label>
									<input
										name="currency"
										value={currentBudget.currency}
										onChange={handleEditChange}
										className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
									/>
								</div>
								<div className="flex justify-end space-x-3">
									<button
										onClick={handleSaveEdit}
										className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
									>
										Save
									</button>
									<button
										onClick={() => setEditModalOpen(false)}
										className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ReadBudgetPage;

