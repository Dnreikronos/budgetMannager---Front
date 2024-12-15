import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/ui/sidebar";
import DataTable from "../../components/ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";

type Bills = {
  id: string;
  value: number;
  user_id: string;
  budget_id: string;
  category: string;
  status: string;
};

const ReadBillsPage = () => {
  const [bills, setBills] = useState<Bills[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9090/Bills")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch bills");
        }
        return response.json();
      })
      .then((data) => setBills(data.Bills || []))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const columns: ColumnDef<Bills>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "value", header: "Value" },
    { accessorKey: "user_id", header: "User ID" },
    { accessorKey: "budget_id", header: "Budget ID" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "created_at", header: "Created At" },
    { accessorKey: "updated_at", header: "Updated At" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Bills List</h1>
          <button
            onClick={() => navigate("/CadBills")}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
          >
            Insert Bills
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg animate-pulse">Loading bills...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg font-medium">
                <span className="mr-2">⚠️</span>Error: {error}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable data={bills} columns={columns} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadBillsPage;

