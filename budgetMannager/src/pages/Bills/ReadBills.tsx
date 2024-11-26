import { useEffect, useState } from "react";
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
  created_at: string;
  updated_at: string;
};

const ReadBillsPage = () => {
  const [bills, setBills] = useState<Bills[]>([]);

  useEffect(() => {
    fetch("http://localhost:9090/Bills")
      .then((response) => response.json())
      .then((data) => setBills(data.Bills || []))
      .catch((error) => console.error("Error fetching bills:", error));
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
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
  <div className="flex-1 p-6">
    <h1 className="text-3xl font-semibold mb-6 text-gray-800">Bills List</h1>
    <div className="bg-white shadow rounded-lg p-6">
      <DataTable data={bills} columns={columns} />
    </div>
  </div>
</div>
  );
};

export default ReadBillsPage;

