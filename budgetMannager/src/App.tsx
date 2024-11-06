import { useState } from "react";
import ReadBudgetPage from "./pages/Budget/ReadBudget.tsx";
import CadBudgetPage from "./pages/Budget/CadBudget.tsx";
import ReadBillsPage from "./pages/Bills/ReadBills.tsx";
import CadBillsPage from "./pages/Bills/CadBills.tsx";
import LoginPage from "./pages/User/LoginPage.tsx";
import RegisterPage from "./pages/User/RegisterPage.tsx";
import DasboardsPage from "../src/pages/Dashboards/Dashboards.tsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/RegisterPage",
      element: <RegisterPage />,
    },
    {
      path: "/CadBills",
      element: <CadBillsPage />,
    },
    {
      path: "/ReadBudget",
      element: <ReadBudgetPage />,
    },
    {
      path: "/CadBudget",
      element: <CadBudgetPage />,
    },
    {
      path: "/ReadBills",
      element: <ReadBillsPage/>,
    },
    {
      path: "/Dashboards",
      element: <DasboardsPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
