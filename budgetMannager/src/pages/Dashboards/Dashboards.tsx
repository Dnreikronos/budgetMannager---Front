import { useEffect, useState } from "react";
import Chart from "../../components/ui/Chart.tsx"
import Sidebar from "../../components/ui/sidebar.tsx";



const DasboardsPage = () => {
	const [bills, setBills] = useState([]);
	const [budgets, setBudgets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const billsResponse = await fetch("http://localhost:9090/Bills");
				const budgetsResponse = await fetch("http://localhost:9090/Budgets");

				if (!billsResponse.ok || !budgetsResponse.ok) {
					throw new Error("Failed to fetch data");
				}

				const billsData = await billsResponse.json();
				const budgetsData = await budgetsResponse.json();

				setBills(billsData.Bills || []);
				setBudgets(budgetsData.Budgets || []);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}

 const billsByCategory = bills.reduce((acc: any, bill: any) => {
    acc[bill.category] = (acc[bill.category] || 0) + bill.value;
    return acc;
  }, {});

  const budgetsByCurrency = budgets.reduce((acc: any, budget: any) => {
    acc[budget.currency] = (acc[budget.currency] || 0) + budget.value;
    return acc;
  }, {});

  const billsChartData = {
    labels: Object.keys(billsByCategory),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(billsByCategory),
        backgroundColor: ["#f87171", "#60a5fa", "#34d399", "#fbbf24"],
        borderColor: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"],
        borderWidth: 1,
      },
    ],
  };

  const budgetsChartData = {
    labels: Object.keys(budgetsByCurrency),
    datasets: [
      {
        label: "Budgets by Currency",
        data: Object.values(budgetsByCurrency),
        backgroundColor: ["#6366f1", "#14b8a6", "#f43f5e", "#8b5cf6"],
        borderColor: ["#4f46e5", "#0d9488", "#e11d48", "#7c3aed"],
        borderWidth: 1,
      },
    ],
  };




	return (
		<>
			<Sidebar />
		</>
	);
};

export default DasboardsPage;
