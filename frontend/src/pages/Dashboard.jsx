import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  UserPlus,
  CalendarClock,
  Globe,
  FileText,
  Plane,
  IndianRupee,
} from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState({
  totalCustomers: 0,
  destinations: 0,
  totalLeads: 0,
  totalVisas: 0,
  totalBookings: 0,
  revenue: 0,
});

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchAlerts();
    fetchNotifications();
  }, []);
  const [notifications, setNotifications] =
  useState([]);
  

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/dashboard/stats"
      );

      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/passport-alerts"
      );

      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
  };
	
  	const fetchNotifications = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/notifications/auto"
    );

    setNotifications(res.data);
  } catch (err) {
    console.error(err);
  }
};
    const StatCard = ({
  title,
  value,
  icon,
  color,
}) => (
  <div
    className={`bg-gradient-to-r ${color} text-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-all duration-300`}
  >
    <div className="flex justify-between items-center">

      <div>

        <p className="text-sm opacity-90">
          {title}
        </p>

        <h2 className="text-4xl font-bold mt-2">
          {value}
        </h2>

      </div>

      <div>{icon}</div>

    </div>
  </div>
);
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Dashboard
      </h2>

      <div className="grid md:grid-cols-4 gap-6 mb-8">

  <StatCard
    title="Customers"
    value={stats.totalCustomers}
    icon={<Users size={40} />}
    color="from-blue-500 to-blue-700"
  />

  <StatCard
    title="Leads"
    value={stats.totalLeads}
    icon={<UserPlus size={40} />}
    color="from-purple-500 to-purple-700"
  />

  <StatCard
    title="Follow Ups"
    value={stats.pendingFollowups || 0}
    icon={<CalendarClock size={40} />}
    color="from-orange-500 to-orange-700"
  />

  <StatCard
    title="Destinations"
    value={stats.destinations}
    icon={<Globe size={40} />}
    color="from-green-500 to-green-700"
  />

  <StatCard
    title="Visa Applications"
    value={stats.totalVisas}
    icon={<FileText size={40} />}
    color="from-cyan-500 to-cyan-700"
  />

  <StatCard
    title="Flight Bookings"
    value={stats.totalBookings}
    icon={<Plane size={40} />}
    color="from-pink-500 to-pink-700"
  />

  <StatCard
    title="Revenue"
    value={`₹${stats.revenue}`}
    icon={<IndianRupee size={40} />}
    color="from-emerald-500 to-emerald-700"
  />
  
  {notifications.length === 0 ? (
    <p>No pending notifications.</p>
  ) : (
    <ul>
      {notifications.map((item, index) => (
        <li
          key={index}
          className="border-b py-2"
        >
          {item.message}
        </li>
      ))}
    </ul>
  )}
  
</div>  
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">

  <h3 className="text-2xl font-bold text-red-600 mb-6">
    🚨 Passport Expiry Alerts
  </h3>
  </div>  

        {alerts.length === 0 ? (
          <p>No passports expiring soon.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  Name
                </th>

                <th className="text-left p-2">
                  Passport Number
                </th>

                <th className="text-left p-2">
                  Expiry Date
                </th>
              </tr>
              
            </thead>

            <tbody>
              
              {alerts.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b"
                >
                  <td className="p-2">
                    {customer.name}
                  </td>

                  <td className="p-2">
                    {customer.passport_number}
                  </td>

                  <td className="p-2">
                    {new Date(
                      customer.passport_expiry
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  );
}

export default Dashboard;
