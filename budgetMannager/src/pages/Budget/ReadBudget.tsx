import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/ui/sidebar";
import DataTable from "../../components/ui/dataTable";
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

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize] = useState<number>(5);

	const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
	const [currentBudget, setCuurrentBudget] = useState<Budget | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetch("http://localhost:9090/Budgets")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to fetch budgets");
				}
				return response.json();
			})
			.then((data) => {
				setBudgets(data.Budgets || []);
				setFilteredBudgets(data.Budgets || []);
			})
			.catch((error) => setError(error.message))
			.finally(() => setLoading(false));
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
		setCuurrentBudget(budget);
		setEditModalOpen(true);
	}

	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (currentBudget) {
			setCuurrentBudget({ ...currentBudget, [e.target.name]: e.target.value })
		}
	}

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
					setBudgets(
						budgets.map((b) => (b.id === currentBudget.id ? currentBudget : b))
					);
					setFilteredBudgets(
						filteredBudgets.map((b) =>
							b.id === currentBudget.id ? currentBudget : b
						)
					);
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
						onClick={() => openEditModal(row.original)}
						className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
					>
						Edit
					</button>
					<button
						onClick={() => handleDelete(row.original.id)}
						className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
					>
						Delete
					</button>
				</div>
			),
		},
	];

	return (
		<div className="flex h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
			<Sidebar />

			<div className="flex-1 p-6 flex flex-col justify-center items-center">
				<div className="flex justify-between items-center mb-6 w-full max-w-5xl">
					<h1 className="text-3xl font-extrabold text-gray-800">📊 Budgets List</h1>
					<button
						onClick={() => navigate("/CadBudget")}
						className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 hover:scale-105 transition-transform duration-200"
					>
						+ Add Budget
					</button>
				</div>

				<div className="mb-4 w-full max-w-5xl">
					<input
						type="text"
						placeholder="Search budgets..."
						value={search}
						onChange={handleSearch}
						className="px-4 py-2 border rounded-md shadow-sm w-full focus:ring focus:ring-indigo-200"
					/>
				</div>

				<div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl">
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
									className="bg-indigo-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
								>
									Previous
								</button>
								<span>
									Page {currentPage} of {totalPages}
								</span>
								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									className="bg-indigo-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
								>
									Next
								</button>
							</div>
						</>
					)}
				</div>

				{editModalOpen && currentBudget && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
							<h2 className="text-2xl font-bold mb-4">Edit Budget</h2>
							<input
								name="value"
								type="number"
								value={currentBudget.value}
								onChange={handleEditChange}
								className="w-full mb-2 px-4 py-2 border rounded"
								placeholder="Value"
							/>
							<input
								name="currency"
								value={currentBudget.currency}
								onChange={handleEditChange}
								className="w-full mb-2 px-4 py-2 border rounded"
								placeholder="Currency"
							/>
							<button
								onClick={handleSaveEdit}
								className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
							>
								Save
							</button>
							<button
								onClick={() => setEditModalOpen(false)}
								className="bg-gray-500 text-white px-4 py-2 ml-2 rounded hover:bg-gray-600"
							>
								Cancel
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default ReadBudgetPage;

