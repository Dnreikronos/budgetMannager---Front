import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../components/ui/sidebar";
import DataTable from "../../components/ui/dataTable";
import Chart from "../../components/ui/Chart";
import AnimatedCard from "../../components/ui/animated-card";
import TableSkeleton from "../../components/ui/table-skeleton";

type Budget = {
	id: string;
	value: number;
	currency: string;
	start: string;
	end: string;
};

type Bills = {
	id: string;
	value: number;
	category: string;
	status: string;
	budget_id: string;
};

const DashboardsPage = () => {
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [bills, setBills] = useState<Bills[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]);
	const [filteredBills, setFilteredBills] = useState<Bills[]>([]);

	useEffect(() => {
		Promise.all([
			fetch("http://localhost:9090/Budgets").then((response) => response.json()),
			fetch("http://localhost:9090/Bills").then((response) => response.json()),
		])
			.then(([budgetData, billData]) => {
				const formattedBudgets = (budgetData.Budgets || []).map((budget: Budget) => ({
					...budget,
					start: formatDate(budget.start),
					end: formatDate(budget.end),
				}));
				setBudgets(formattedBudgets);
				setFilteredBudgets(formattedBudgets);
				setBills(billData.Bills || []);
				setFilteredBills(billData.Bills || []);
			})
			.catch((error) => setError(error.message))
			.finally(() => setLoading(false));
	}, []);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? dateString : date.toISOString().split("T")[0];
	};

	const handleDateFilter = () => {
		if (!startDate && !endDate) {
			setFilteredBudgets(budgets);
			setFilteredBills(bills);
			return;
		}

		const start = startDate ? new Date(startDate) : new Date(0);
		const end = endDate ? new Date(endDate) : new Date(8640000000000000);

		const filteredBudgets = budgets.filter((budget) => {
			const budgetStart = new Date(budget.start);
			const budgetEnd = new Date(budget.end);
			return (
				(budgetStart >= start && budgetStart <= end) ||
				(budgetEnd >= start && budgetEnd <= end) ||
				(budgetStart <= start && budgetEnd >= end)
			);
		});

		setFilteredBudgets(filteredBudgets);

		// Filter bills based on the filtered budgets' IDs
		const filteredBudgetIds = new Set(filteredBudgets.map(budget => budget.id));
		const filteredBills = bills.filter(bill => {
			// Assuming each bill has a budget_id field
			return filteredBudgetIds.has(bill.budget_id);
		});
		setFilteredBills(filteredBills);
	};

	const resetFilters = () => {
		setStartDate("");
		setEndDate("");
		setFilteredBudgets(budgets);
		setFilteredBills(bills);
	};

	const currencyDistribution = filteredBudgets.reduce((acc: any, budget: any) => {
		acc[budget.currency] = (acc[budget.currency] || 0) + budget.value;
		return acc;
	}, {});

	const budgetChartData = {
		labels: Object.keys(currencyDistribution),
		datasets: [
			{
				label: "Budgets by Currency",
				data: Object.values(currencyDistribution),
				backgroundColor: ["#6366f1", "#14b8a6", "#f43f5e", "#8b5cf6"],
				borderColor: ["#4f46e5", "#0d9488", "#e11d48", "#7c3aed"],
				borderWidth: 1,
			},
		],
	};

	const categoryDistribution = filteredBills.reduce((acc: any, bill: any) => {
		acc[bill.category] = (acc[bill.category] || 0) + bill.value;
		return acc;
	}, {});

	const billCategoryChartData = {
		labels: Object.keys(categoryDistribution),
		datasets: [
			{
				label: "Bills by Category",
				data: Object.values(categoryDistribution),
				backgroundColor: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899"],
				borderColor: ["#d97706", "#059669", "#2563eb", "#db2777"],
				borderWidth: 1,
			},
		],
	};

	const billStatusDistribution = filteredBills.reduce((acc: any, bill: any) => {
		acc[bill.status] = (acc[bill.status] || 0) + 1;
		return acc;
	}, {});

	const billStatusChartData = {
		labels: Object.keys(billStatusDistribution),
		datasets: [
			{
				label: "Bill Status Distribution",
				data: Object.values(billStatusDistribution),
				backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
				borderColor: ["#16a34a", "#dc2626", "#d97706"],
				borderWidth: 1,
			},
		],
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	if (error) {
		return (
			<div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
				<Sidebar />
				<div className="flex-1 p-6 flex items-center justify-center">
					<AnimatedCard className="bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700">
						<h2 className="text-xl font-semibold text-red-700 dark:text-red-200">Error</h2>
						<p className="text-red-600 dark:text-red-300 mt-2">{error}</p>
					</AnimatedCard>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
			<Sidebar />

			<motion.div
				initial="hidden"
				animate="visible"
				variants={containerVariants}
				className="flex-1 p-6 overflow-auto"
			>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col space-y-4 mb-6"
				>
					<div className="flex justify-between items-center">
						<h1 className="text-3xl font-extrabold text-black dark:text-white">📊 Dashboard Overview</h1>
					</div>

					<div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4">
						<div className="flex flex-wrap gap-4 items-end">
							<div className="flex-1 min-w-[200px]">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Start Date
								</label>
								<input
									type="date"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
								/>
							</div>
							<div className="flex-1 min-w-[200px]">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									End Date
								</label>
								<input
									type="date"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
								/>
							</div>
							<div className="flex gap-2">
								<button
									onClick={handleDateFilter}
									className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
								>
									Apply Filter
								</button>
								<button
									onClick={resetFilters}
									className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
								>
									Reset
								</button>
							</div>
						</div>
					</div>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					<AnimatedCard delay={0.1} className="bg-white dark:bg-gray-900 text-black dark:text-white">
						<h2 className="text-lg font-semibold mb-2">Total Budgets</h2>
						<p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{filteredBudgets.length}</p>
					</AnimatedCard>

					<AnimatedCard delay={0.2} className="bg-white dark:bg-gray-900 text-black dark:text-white">
						<h2 className="text-lg font-semibold mb-2">Total Bills</h2>
						<p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{filteredBills.length}</p>
					</AnimatedCard>

					<AnimatedCard delay={0.3} className="bg-white dark:bg-gray-900 text-black dark:text-white">
						<h2 className="text-lg font-semibold mb-2">Pending Bills</h2>
						<p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
							{filteredBills.filter((bill) => bill.status === "pending").length}
						</p>
					</AnimatedCard>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
					{loading ? (
						<>
							<AnimatedCard className="bg-white dark:bg-gray-900" >
								<TableSkeleton rows={5} columns={3} />
							</AnimatedCard>
							<AnimatedCard className="bg-white dark:bg-gray-900" >
								<TableSkeleton rows={5} columns={3} />
							</AnimatedCard>
							<AnimatedCard className="bg-white dark:bg-gray-900" >
								<TableSkeleton rows={5} columns={3} />
							</AnimatedCard>
						</>
					) : (
						<>
							<Chart type="pie" data={budgetChartData} title="Budget Distribution" />
							<Chart type="bar" data={billCategoryChartData} title="Bills by Category" />
							<Chart type="pie" data={billStatusChartData} title="Bill Status" />
						</>
					)}
				</div>

				<div className="space-y-6">
					<div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
						<h2 className="text-2xl font-bold text-black dark:text-white mb-4">Budget Details</h2>
						<DataTable
							data={filteredBudgets}
							columns={[
								{ accessorKey: "value", header: "Value" },
								{ accessorKey: "currency", header: "Currency" },
								{ accessorKey: "start", header: "Start" },
								{ accessorKey: "end", header: "End" },
							]}
							loading={loading}
						/>
					</div>

					<div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
						<h2 className="text-2xl font-bold text-black dark:text-white mb-4">Bill Details</h2>
						<DataTable
							data={filteredBills}
							columns={[
								{ accessorKey: "value", header: "Value" },
								{ accessorKey: "category", header: "Category" },
								{ accessorKey: "status", header: "Status" },
							]}
							loading={loading}
						/>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default DashboardsPage;

