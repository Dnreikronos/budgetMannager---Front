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
};

const DashboardsPage = () => {
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [bills, setBills] = useState<Bills[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

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
				setBills(billData.Bills || []);
			})
			.catch((error) => setError(error.message))
			.finally(() => setLoading(false));
	}, []);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? dateString : date.toISOString().split("T")[0];
	};

	const currencyDistribution = budgets.reduce((acc: any, budget: any) => {
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

	const categoryDistribution = bills.reduce((acc: any, bill: any) => {
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

	const billStatusDistribution = bills.reduce((acc: any, bill: any) => {
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
			<div className="flex h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
				<Sidebar />
				<div className="flex-1 p-6 flex items-center justify-center">
					<AnimatedCard className="bg-red-50 border-red-200">
						<h2 className="text-xl font-semibold text-red-700">Error</h2>
						<p className="text-red-600 mt-2">{error}</p>
					</AnimatedCard>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
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
					className="flex justify-between items-center mb-6"
				>
					<h1 className="text-3xl font-extrabold text-gray-800">📊 Dashboard Overview</h1>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					<AnimatedCard delay={0.1}>
						<h2 className="text-lg font-semibold mb-2">Total Budgets</h2>
						<p className="text-3xl font-bold text-indigo-600">{budgets.length}</p>
					</AnimatedCard>

					<AnimatedCard delay={0.2}>
						<h2 className="text-lg font-semibold mb-2">Total Bills</h2>
						<p className="text-3xl font-bold text-emerald-600">{bills.length}</p>
					</AnimatedCard>

					<AnimatedCard delay={0.3}>
						<h2 className="text-lg font-semibold mb-2">Pending Bills</h2>
						<p className="text-3xl font-bold text-amber-600">
							{bills.filter((bill) => bill.status === "pending").length}
						</p>
					</AnimatedCard>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
					{loading ? (
						<>
							<AnimatedCard>
								<TableSkeleton rows={5} columns={3} />
							</AnimatedCard>
							<AnimatedCard>
								<TableSkeleton rows={5} columns={3} />
							</AnimatedCard>
							<AnimatedCard>
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
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">Budget Details</h2>
						<DataTable
							data={budgets}
							columns={[
								{ accessorKey: "value", header: "Value" },
								{ accessorKey: "currency", header: "Currency" },
								{ accessorKey: "start", header: "Start" },
								{ accessorKey: "end", header: "End" },
							]}
							loading={loading}
						/>
					</div>

					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">Bill Details</h2>
						<DataTable
							data={bills}
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

