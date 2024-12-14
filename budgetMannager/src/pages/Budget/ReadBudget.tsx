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

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9090/Budgets")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch budgets");
        }
        return response.json();
      })
      .then((data) => setBudgets(data.Budgets || []))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const columns: ColumnDef<Budget>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "value", header: "Value" },
    { accessorKey: "currency", header: "Currency" },
    { accessorKey: "start", header: "Start" },
    { accessorKey: "end", header: "End" },
    { accessorKey: "created_at", header: "Created At" },
    { accessorKey: "updated_at", header: "Updated At" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Budgets List</h1>
          <button
            onClick={() => navigate("/CadBudget")}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
          >
            Insert Budget
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg animate-pulse">Loading budgets...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg font-medium">
                <span className="mr-2">⚠️</span>Error: {error}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable data={budgets} columns={columns} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadBudgetPage;

