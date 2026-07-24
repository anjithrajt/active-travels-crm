import { NavLink } from "react-router-dom";
import { CheckSquare } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarClock,
  FileText,
  Plane,
  FolderOpen,
  Bell,
  LogOut,
  PlaneTakeoff,
} from "lucide-react";

function Sidebar() {
const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
const menuClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
    isActive
      ? "bg-blue-600 text-white shadow-lg"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;
  return (
    <div className="w-72 h-screen sticky top-0 bg-slate-900 text-white flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-700">
    <div className="flex items-center gap-3">

        <div className="bg-blue-600 p-3 rounded-xl">
            <PlaneTakeoff size={28}/>
        </div>

        <div>
            <h1 className="text-xl font-bold">
                Active Travels
            </h1>

            <p className="text-slate-400 text-sm">
                CRM Dashboard
            </p>
        </div>

    </div>
</div>

      <nav className="flex flex-col gap-4">
        <NavLink
  to="/dashboard"
  className={menuClass}
>
  <LayoutDashboard size={20}/>
  Dashboard
</NavLink>        
        <NavLink
  to="/customers"
  className={menuClass}
>
  <Users size={20}/>
  Customers
</NavLink>
        <NavLink
  to="/leads"
  className={menuClass}
>
  <UserPlus size={20}/>
  Leads
</NavLink>
        <NavLink
  to="/followups"
  className={menuClass}
>
  <CalendarClock size={20}/>
  Follow Ups
</NavLink>
        <NavLink
  to="/tasks"
  className={menuClass}
>
  <CheckSquare size={20}/>
  Tasks
</NavLink>
        <NavLink
  to="/documents"
  className={menuClass}
>
  <FolderOpen size={20}/>
  Documents
</NavLink>
        <NavLink
  to="/visa-applications"
  className={menuClass}
>
  <FileText size={20}/>
  Visa Applications
</NavLink>
        <NavLink
  to="/flight-bookings"
  className={menuClass}
>
  <Plane size={20}/>
  Flight Bookings
</NavLink>
        <NavLink
  to="/notifications"
  className={menuClass}
>
  <Bell size={20}/>
  Notifications
</NavLink>
        <button
    onClick={logout}
    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 rounded-xl p-3 transition-all duration-300"
>
    <LogOut size={18}/>
    Logout
</button>
      </nav>
      <div className="mt-auto p-5 border-t border-slate-700">

<div className="flex items-center gap-3">

<div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold">
A
</div>

<div>

<p className="font-semibold">
Admin
</p>

<p className="text-sm text-slate-400">
Travel Consultant
</p>

</div>

</div>

</div>

    </div>
    
  );
}

export default Sidebar;
