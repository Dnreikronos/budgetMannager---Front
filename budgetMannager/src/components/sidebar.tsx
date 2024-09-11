import { useState } from "react";
import LoginPage from "../pages/LoginPage";
import ReadBudgetPage from "../pages/ReadBudget";
import ReadBillsPage from "../pages/ReadBills";
import { Link } from "react-router-dom";

interface MenuItem {
  title: string;
  src: string;
  path: string;
  element: React.ReactElement;
}

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const Menus: MenuItem[] = [
    { title: "Dashboard", src: "Chart_fill", path: "/LoginPage", element: <LoginPage /> },
    { title: "Budget", src: "budget", path: "/ReadBudget", element: <ReadBudgetPage /> },
    { title: "Bills", src: "bills", path: "/ReadBills", element: <ReadBillsPage/> },
  ];

  return (
    <div className="flex">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-black h-screen p-4  pt-8 relative duration-300`}
      >
        <img
          src="./src/assets/control.png"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <img
            src="./src/assets/logo.png"
            className={`cursor-pointer duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Budget Mannager
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-white text-gray-300 top-11 text-sm items-center  gap-x-4
              ${Menu.gap ? "mt-9" : "mt-5"} ${
                index === 0 && "bg-light-white"
              } `}
            >
               <Link to={Menu.path} className="flex items-center w-full h-full -right-4">
                <img src={`./src/assets/${Menu.src}.png`} />
                <span className={`${!open && 'hidden'} origin-left duration-200`}>
                  {Menu.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
