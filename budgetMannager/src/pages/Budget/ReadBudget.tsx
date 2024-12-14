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
	created_at: string;
	updated_at: string;
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
						<div className="animate-pulse space-y-4">
							<div className="h-6 bg-gray-200 rounded w-1/4"></div>
							<div className="h-6 bg-gray-200 rounded w-3/4"></div>
							<div className="h-6 bg-gray-200 rounded w-2/4"></div>
						</div>
					) : error ? (
						<div className="text-center py-12">
							<p className="text-red-500 text-lg font-medium">
								<span className="mr-2">⚠️</span>Error: {error}
							</p>
						</div>
					) : (
						<>
							<div className="overflow-x-auto">
								<DataTable data={currentData} columns={columns} />
							</div>

							<div className="flex justify-between items-center mt-6">
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									className={`px-4 py-2 rounded-lg ${currentPage === 1
										? "bg-gray-300 text-gray-500 cursor-not-allowed"
										: "bg-indigo-600 text-white hover:bg-indigo-700"
										}`}
								>
									Previous
								</button>

								<span className="text-gray-600">
									Page {currentPage} of {totalPages}
								</span>

								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									className={`px-4 py-2 rounded-lg ${currentPage === totalPages
										? "bg-gray-300 text-gray-500 cursor-not-allowed"
										: "bg-indigo-600 text-white hover:bg-indigo-700"
										}`}
								>
									Next
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ReadBudgetPage;

