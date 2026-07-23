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
  return (
    <div className="w-72 min-h-screen bg-slate-900 text-white flex flex-col shadow-2xl">
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

      <h1 className="text-2xl font-bold mb-8">
        Active Travels CRM
      </h1>

      <nav className="flex flex-col gap-4">

        <Link
    to="/dashboard"
    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all duration-300"
>
    <LayoutDashboard size={20}/>
    Dashboard
</Link>
        <Link
    to="/customers"
    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all duration-300"
>
    <Users size={20}/>
    Customers
</Link>
        <Link
    to="/leads"
    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all duration-300"
>
    <UserPlus size={20}/>
    Leads</Link>
        <Link
    to="/followups"
    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all duration-300"
>
    <CalendarClock size={20}/>
    Follow Ups
</Link>
        <Link ></Link>

        <Link to="/documents">Documents</Link>
        <Link to="/visa-applications">
         Visa Applications</Link>
         <Link to="/flight-bookings">
  Flight Bookings
</Link>
<Link to="/notifications">
  Notifications
</Link>
        <button
  onClick={logout}
  className="bg-red-600 text-white p-2 rounded mt-6"
>
  Logout
</button>

      </nav>

    </div>
    
  );
}

export default Sidebar;
