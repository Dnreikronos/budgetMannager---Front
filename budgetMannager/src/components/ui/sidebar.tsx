import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HomeIcon, CurrencyDollarIcon, DocumentTextIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import DasboardsPage from "../../pages/Dashboards/Dashboards";
import ReadBudgetPage from "../../pages/Budget/ReadBudget";
import ReadBillsPage from "../../pages/Bills/ReadBills";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path: string;
  element: React.ReactElement;
}

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const Menus: MenuItem[] = [
    { title: "Dashboard", icon: HomeIcon, path: "/Dashboards", element: <DasboardsPage /> },
    { title: "Budget", icon: CurrencyDollarIcon, path: "/ReadBudget", element: <ReadBudgetPage /> },
    { title: "Bills", icon: DocumentTextIcon, path: "/ReadBills", element: <ReadBillsPage /> },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const sidebarVariants = {
    open: {
      width: "18rem",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    closed: {
      width: "5rem",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const textVariants = {
    open: {
      opacity: 1,
      x: 0,
      display: "block",
      transition: { delay: 0.1, duration: 0.2 }
    },
    closed: {
      opacity: 0,
      x: -10,
      transitionEnd: { display: "none" },
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      initial="open"
      animate={open ? "open" : "closed"}
      variants={sidebarVariants}
      className="bg-gray-800 text-white h-screen p-6 pt-8 relative flex flex-col shadow-md rounded-r-3xl"
    >
      <button
        aria-label="Toggle Sidebar"
        className="absolute cursor-pointer -right-3 top-9 w-8 h-8 border-2 border-white bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <motion.div
          animate={{ rotate: open ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
        </motion.div>
      </button>

      <div className="flex items-center gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src="./src/assets/logo.png"
            alt="Logo"
            className="w-10 h-10"
          />
        </motion.div>
        <motion.h1
          variants={textVariants}
          className="text-2xl font-semibold whitespace-nowrap"
        >
          Budget Manager
        </motion.h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {Menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = location.pathname === menu.path;
            
            return (
              <motion.li
                key={menu.path}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={menu.path}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  <Icon className="w-6 h-6 shrink-0" />
                  <motion.span variants={textVariants} className="whitespace-nowrap">
                    {menu.title}
                  </motion.span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSignOut}
        className="flex items-center gap-4 p-3 mt-6 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors"
      >
        <ArrowRightOnRectangleIcon className="w-6 h-6" />
        <motion.span variants={textVariants} className="whitespace-nowrap">
          Sign Out
        </motion.span>
      </motion.button>
    </motion.div>
  );
};

export default Sidebar;

