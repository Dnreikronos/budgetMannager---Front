import { useState } from "react";
import ReadBudgetPage from "./pages/Budget/ReadBudget.tsx";
import CadBudgetPage from "./pages/Budget/CadBudget.tsx";
import ReadBillsPage from "./pages/Bills/ReadBills.tsx";
import CadBillsPage from "./pages/Bills/CadBills.tsx";
import LoginPage from "./pages/User/LoginPage.tsx";
import NotFoundPage from "./pages/NotFound/NotFoundPage.tsx";
import RegisterPage from "./pages/User/RegisterPage.tsx";
import DasboardsPage from "../src/pages/Dashboards/Dashboards.tsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
      errorElement: <NotFoundPage />,
    },
    {
      path: "/NotFoundPage",
      element: <NotFoundPage />,
    },
    {
      path: "/RegisterPage",
      element: <RegisterPage />,
      errorElement: <NotFoundPage />,
    },
    {
      path: "/CadBills",
      element: <CadBillsPage />,
      errorElement: <NotFoundPage />,
    },
    {
      path: "/ReadBudget",
      element: <ReadBudgetPage />,
      errorElement: <NotFoundPage />,
    },
    {
      path: "/CadBudget",
      element: <CadBudgetPage />,
      errorElement: <NotFoundPage />,
    },
    {
      path: "/ReadBills",
      element: <ReadBillsPage/>,
      errorElement: <NotFoundPage />,
    },
    {
      path: "/Dashboards",
      element: <DasboardsPage />,
      errorElement: <NotFoundPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
