import { useState } from "react";
import ReadBudgetPage from "./pages/ReadBudget.tsx";
import CadBudgetPage from "./pages/CadBudget.tsx";
import ReadBillsPage from "./pages/ReadBills.tsx";
import CadBillsPage from "./pages/CadBills.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ReadUserPage from "./pages/ReadUsers.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/LoginPage",
      element: <LoginPage />,
      errorElement: <NotFoundPage />,
    },
    {
      path: "/NotFoundPage",
      element: <NotFoundPage />,
    },
    {
      path: "/ReadBills",
      element: <ReadBillsPage />,
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
      path: "/ReadUsers",
      element: <ReadUserPage />,
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
