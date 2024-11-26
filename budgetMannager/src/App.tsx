import ReadBudgetPage from "./pages/Budget/ReadBudget.tsx";
import CadBudgetPage from "./pages/Budget/CadBudget.tsx";
import ReadBillsPage from "./pages/Bills/ReadBills.tsx";
import CadBillsPage from "./pages/Bills/CadBills.tsx";
import LoginPage from "./pages/User/LoginPage.tsx";
import RegisterPage from "./pages/User/RegisterPage.tsx";
import DasboardsPage from "../src/pages/Dashboards/Dashboards.tsx"
import { createBrowserRouter, RouterProvider, Navigate} from "react-router-dom";
import "./index.css";

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem("authToken");

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return element;
};


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
      element: <PrivateRoute element={<CadBillsPage />} />,
    },
    {
      path: "/ReadBudget",
      element: <PrivateRoute element={<ReadBudgetPage />} />,
    },
    {
      path: "/CadBudget",
      element: <PrivateRoute element={<CadBudgetPage />} />,
    },
    {
      path: "/ReadBills",
      element: <PrivateRoute element={<ReadBillsPage />} />,
    },
    {
      path: "/Dashboards",
      element: <PrivateRoute element={<DasboardsPage />} />,
    },
  ]);


  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
