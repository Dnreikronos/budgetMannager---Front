import { useState } from 'react';
import ReadBudgetPage from "./pages/readBudget.tsx";
import CadBudgetPage from "./pages/cadBudget.tsx";
import ReadBillsPage from "./pages/readBills.tsx";
import CadBillsPage from "./pages/cadBills.tsx";
import LoginPage from "./pages/loginPage.tsx";
import NotFoudPage from "./pages/notFoundPage.tsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';

function App() {
  const router = createBrowserRouter([
  {
    path: "/LoginPage",
    element: <LoginPage />,
    errorElement: <NotFoundPage />,
  },
  { 
    path: "/ReadBills",
    element: <ReadBillsPage />,
    errorElement: <NotFoudPage />,
  },
  {
    path: "/CadBills",
    element: <CadBillsPage />,
    errorElement: <NotFoudPage />,
  },
  {
    path: "/ReadBudget",
    element: <ReadBudgetPage />,
    errorElement: <NotFoudPage />,
  },
  {
    path: "/CadBudget",
    element: <CadBudgetPage />,
    errorElement: <NotFoudPage />,
  },
  ]);
   
  return (
  <>
    <RouterProvider router={router} />
  </>

  )

}

export default App
