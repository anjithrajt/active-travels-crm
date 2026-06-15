import { Link } from "react-router-dom";

function Sidebar() {
const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-5">

      <h1 className="text-2xl font-bold mb-8">
        Active Travels CRM
      </h1>

      <nav className="flex flex-col gap-4">

        <Link to="/">Dashboard</Link>

        <Link to="/customers">Customers</Link>

        <Link to="/leads">Leads</Link>

        <Link to="/followups">Follow Ups</Link>

        <Link to="/documents">Documents</Link>
        <Link to="/visa-applications">
         Visa Applications</Link>
         <Link to="/flight-bookings">
  Flight Bookings
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
