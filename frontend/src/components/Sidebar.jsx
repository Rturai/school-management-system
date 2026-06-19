import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSchool,
  FaUserPlus, // Enrollment ke liye naya icon
} from "react-icons/fa";

const Sidebar = () => {
  // Links ka data array taaki code clean rahe aur asaani se manage ho sake
  const menuItems = [
    { path: "/", name: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/students", name: "Students", icon: <FaUserGraduate /> },
    { path: "/teachers", name: "Teachers", icon: <FaChalkboardTeacher /> },
    { path: "/classes", name: "Classes", icon: <FaSchool /> },
    { path: "/enrollment", name: "Enrollment", icon: <FaUserPlus /> }, // Naya Enrollment Section
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-screen p-5 flex flex-col justify-between select-none">
      
      <div>
        {/* Top Header / Branding */}
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
            <span className="text-white font-black text-lg">S</span>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-wide leading-none">
              School<span className="text-indigo-400">Sync</span>
            </h1>
            <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
              Admin Dashboard
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-slate-800 my-4 px-2"></div>

        {/* Navigation Links */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">
            Core Menu
          </p>
          
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/10 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`
              }
            >
              {/* Icon Animation on Hover */}
              <span className="text-base transition-transform duration-200 group-hover:scale-110 group-hover:text-indigo-400 group-[.isActive]:text-white">
                {item.icon}
              </span>
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom Footer (Optional - looks professional) */}
      <div className="p-2 bg-slate-800/40 rounded-xl border border-slate-800/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-white text-sm">
          A
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-slate-300 truncate">Admin Portal</p>
          <p className="text-[10px] text-slate-500 truncate">v1.0.2 • Live</p>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;