import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/ui/sidebar";
import DataTable from "../../components/ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";

type Bills = {
	id: string;
	value: number;
	budget_id: string;
	category: string;
	status: string;
};

const ReadBillsPage = () => {
	const [bills, setBills] = useState<Bills[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [filteredBills, setFilteredBills] = useState<Bills[]>([]);
	const [search, setSearch] = useState<string>("");

	const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
	const [currentBill, setCurrentBill] = useState<Bills | null>(null);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize] = useState<number>(5);

	const navigate = useNavigate();

	useEffect(() => {
		fetch("http://localhost:9090/Bills")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to fetch bills");
				}
				return response.json();
			})
			.then((data) => {
				setBills(data.Bills || []);
				setFilteredBills(data.Bills || []);
			})
			.catch((error) => setError(error.message))
			.finally(() => setLoading(false));
	}, []);

	const openEditModal = (bill: Bills) => {
		setCurrentBill(bill);
		setEditModalOpen(true);
	};

	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (currentBill) {
			setCurrentBill({ ...currentBill, [e.target.name]: e.target.value });
		}
	};

	const handleSaveEdit = () => {
		if (currentBill) {
			fetch(`http://localhost:9090/Bill/${currentBill.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(currentBill),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Failed to update bill");
					}
					setBills(bills.map((b) => (b.id === currentBill.id ? currentBill : b)));
					setFilteredBills(
						filteredBills.map((b) => (b.id === currentBill.id ? currentBill : b))
					);
					setEditModalOpen(false);
				})
				.catch((error) => console.error("Error updating bill:", error));
		}
	};

	const totalItems = filteredBills.length;
	const totalPages = Math.ceil(totalItems / pageSize);

	const currentData = filteredBills.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value.toLowerCase();
		setSearch(query);
		const filtered = bills.filter(
			(bill) =>
				bill.value.toString().includes(query) ||
				bill.budget_id.toLowerCase().includes(query) ||
				bill.category.toLowerCase().includes(query) ||
				bill.status.toLowerCase().includes(query)
		);
		setFilteredBills(filtered);
	};

	const columns: ColumnDef<Bills>[] = [
		{ accessorKey: "value", header: "Value" },
		{ accessorKey: "category", header: "Category" },
		{ accessorKey: "status", header: "Status" },
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

	const handleDelete = (id: string) => {
		fetch(`http://localhost:9090/Bill/${id}`, { method: "DELETE" })
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to delete bill");
				}
				setBills(bills.filter((bill) => bill.id !== id));
				setFilteredBills(filteredBills.filter((bill) => bill.id !== id));
			})
			.catch((error) => console.error("Error deleting bill:", error));
	};

	return (
		<div className="flex h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
			<Sidebar />

			<div className="flex-1 p-6 flex flex-col justify-center items-center">
				<div className="flex justify-between items-center mb-6 w-full max-w-5xl">
					<h1 className="text-3xl font-extrabold text-gray-800">📊 Bills List</h1>
					<button
						onClick={() => navigate("/CadBills")}
						className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 hover:scale-105 transition-transform duration-200"
					>
						+ Add Bill
					</button>
				</div>

				<div className="mb-4 w-full max-w-5xl">
					<input
						type="text"
						placeholder="Search bills..."
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

				{editModalOpen && currentBill && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
						<div className="bg-white w-1/3 rounded-lg p-6 shadow-lg">
							<h2 className="text-xl font-bold mb-4">Edit Bill</h2>
							<div>
								<label className="block text-sm font-medium mb-1">Value</label>
								<input
									name="value"
									type="number"
									value={currentBill.value}
									onChange={handleEditChange}
									className="w-full mb-3 px-4 py-2 border rounded"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Category</label>
								<input
									name="category"
									value={currentBill.category}
									onChange={handleEditChange}
									className="w-full mb-3 px-4 py-2 border rounded"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Status</label>
								<input
									name="status"
									value={currentBill.status}
									onChange={handleEditChange}
									className="w-full mb-3 px-4 py-2 border rounded"
								/>
							</div>
							<div className="flex justify-end">
								<button
									onClick={handleSaveEdit}
									className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
								>
									Save
								</button>
								<button
									onClick={() => setEditModalOpen(false)}
									className="bg-gray-500 text-white px-4 py-2 ml-3 rounded hover:bg-gray-600"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ReadBillsPage;

