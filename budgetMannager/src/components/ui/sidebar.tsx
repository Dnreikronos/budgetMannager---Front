import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DasboardsPage from "../../pages/Dashboards/Dashboards.tsx";
import ReadBudgetPage from "../../pages/Budget/ReadBudget.tsx";
import ReadBillsPage from "../../pages/Bills/ReadBills.tsx";
import { HomeIcon, CurrencyDollarIcon, DocumentTextIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

interface MenuItem {
  title: string;
  src: string;
  path: string;
  element: React.ReactElement;
}

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const Menus: MenuItem[] = [
    { title: "Dashboard", src: "Chart_fill", path: "/Dashboards", element: <DasboardsPage /> },
    { title: "Budget", src: "budget", path: "/ReadBudget", element: <ReadBudgetPage /> },
    { title: "Bills", src: "bills", path: "/ReadBills", element: <ReadBillsPage /> },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-72" : "w-20"
        } bg-gray-800 text-white h-screen p-6 pt-8 relative flex flex-col transition-all duration-300 ease-in-out shadow-md rounded-r-3xl`}
      >
        <button
          aria-label="Toggle Sidebar"
          className={`absolute cursor-pointer -right-3 top-9 w-8 h-8 border-2 border-white bg-gray-600 rounded-full transform transition-transform ${
            !open ? "rotate-180" : ""
          }`}
          onClick={() => setOpen(!open)}
        >
          <img
            src="./src/assets/control.png"
            alt="Toggle Sidebar"
            className="w-5 h-5 m-auto"
          />
        </button>

        <div className="flex gap-x-4 items-center mb-8">
          <img
            src="./src/assets/logo.png"
            alt="Logo"
            className={`cursor-pointer transition-transform duration-500 ${open ? "rotate-[360deg]" : ""}`}
          />
          <h1
            className={`text-2xl font-semibold origin-left transition-transform duration-200 ${
              !open ? "scale-0" : "scale-100"
            }`}
          >
            Budget Manager
          </h1>
        </div>

        <ul className="pt-6 flex-grow">
          {Menus.map((menu, index) => {
            const isActive = location.pathname === menu.path;

            return (
              <li
                key={index}
                className={`flex items-center gap-x-4 rounded-md p-2 cursor-pointer hover:bg-gray-700 hover:text-white transition-colors duration-200 relative mt-6 ${
                  isActive ? "bg-gray-600" : ""
                }`}
              >
                <Link to={menu.path} className="flex items-center w-full">
                  {menu.title === "Dashboard" && <HomeIcon className="w-6 h-6 text-white" />}
                  {menu.title === "Budget" && <CurrencyDollarIcon className="w-6 h-6 text-white" />}
                  {menu.title === "Bills" && <DocumentTextIcon className="w-6 h-6 text-white" />}

                  <span
                    className={`ml-4 text-lg font-medium transition-all duration-200 ${!open ? "hidden" : ""}`}
                  >
                    {menu.title}
                  </span>
                </Link>

                <span
                  className={`absolute top-0 left-0 w-1 h-full bg-gray-500 rounded-l-md transform transition-all duration-300 ease-in-out ${
                    isActive ? "scale-100" : "scale-0"
                  }`}
                ></span>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-x-4 w-full p-2 mt-6 text-white hover:bg-red-600 hover:text-white rounded-md transition-colors duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6 text-white" />
            {open && (
              <span className="ml-4 text-lg font-medium transition-all duration-200">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

