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
  const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

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

  // Format the date to exclude time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  // Search Filter
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
      {/* Sidebar */}
      <Sidebar className="hidden lg:block" />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Breadcrumb */}
        <div className="mb-4 text-gray-600 text-sm">
          <span
            className="hover:text-indigo-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </span>{" "}
          / Budgets List
        </div>

        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
            📊 Budgets List
          </h1>
          <button
            onClick={() => navigate("/CadBudget")}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 hover:scale-105 transition-transform duration-200"
          >
            + Add Budget
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search budgets..."
            value={search}
            onChange={handleSearch}
            className="px-4 py-2 border rounded-md shadow-sm w-full max-w-md focus:ring focus:ring-indigo-200"
          />
        </div>

        {/* Content Box */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          {loading ? (
            // Skeleton Loader
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-2/4"></div>
            </div>
          ) : error ? (
            // Error Message
            <div className="text-center py-12">
              <p className="text-red-500 text-lg font-medium">
                <span className="mr-2">⚠️</span>Error: {error}
              </p>
            </div>
          ) : filteredBudgets.length === 0 ? (
            // Empty State
            <div className="text-center p-12">
              <p className="text-gray-500 text-lg mb-4">No budgets found.</p>
              <button
                onClick={() => navigate("/CadBudget")}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150"
              >
                Add a Budget
              </button>
            </div>
          ) : (
            // Table
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <DataTable data={filteredBudgets} columns={columns} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadBudgetPage;

