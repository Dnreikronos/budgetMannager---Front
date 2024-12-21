import { useEffect, useState } from "react";
import Sidebar from "../../components/ui/sidebar";
import DataTable from "../../components/ui/dataTable";
import Chart from "../../components/ui/Chart";

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
  budget_id: string;
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
        setBudgets(budgetData.Budgets || []);
        setBills(billData.Bills || []);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

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
        backgroundColor: ["#6366f1", "#14b8a6", "#f43f5e", "#8b5cf6"],
        borderColor: ["#4f46e5", "#0d9488", "#e11d48", "#7c3aed"],
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
        label: "Bills by Status",
        data: Object.values(billStatusDistribution),
        backgroundColor: ["#6366f1", "#14b8a6", "#f43f5e"],
        borderColor: ["#4f46e5", "#0d9488", "#e11d48"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <Sidebar />

      <div className="flex-1 p-6 flex flex-col justify-center items-center overflow-auto">
        <div className="flex justify-between items-center mb-6 w-full max-w-7xl">
          <h1 className="text-3xl font-extrabold text-gray-800">📊 Dashboards</h1>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl space-y-6">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              <div className="flex flex-wrap justify-center space-x-6">
                <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                  <Chart type="pie" data={budgetChartData} title="Budget Distribution by Currency" />
                </div>

                <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                  <Chart type="bar" data={billCategoryChartData} title="Bill Distribution by Category" />
                </div>

                <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                  <Chart type="pie" data={billStatusChartData} title="Bill Status Distribution" />
                </div>
              </div>

              <div className="overflow-x-auto mt-6">
                <h2 className="text-2xl font-bold text-gray-800">Budget Details</h2>
                <DataTable data={budgets} columns={[
                  { accessorKey: "value", header: "Value" },
                  { accessorKey: "currency", header: "Currency" },
                  { accessorKey: "start", header: "Start" },
                  { accessorKey: "end", header: "End" }
                ]} />
              </div>

              <div className="overflow-x-auto mt-6">
                <h2 className="text-2xl font-bold text-gray-800">Bill Details</h2>
                <DataTable data={bills} columns={[
                  { accessorKey: "value", header: "Value" },
                  { accessorKey: "category", header: "Category" },
                  { accessorKey: "status", header: "Status" },
                ]} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardsPage;

