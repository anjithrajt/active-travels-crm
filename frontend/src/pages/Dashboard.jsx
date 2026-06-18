import { useEffect, useState } from "react";
import axios from "axios";

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
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Dashboard
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mb-6">

  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-gray-500">
      Total Customers
    </h3>
    <p className="text-4xl font-bold">
      {stats.totalCustomers}
    </p>
  </div>

  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-gray-500">
      Total Leads
    </h3>
    <p className="text-4xl font-bold">
      {stats.totalLeads}
    </p>
  </div>

  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-gray-500">
      Destinations
    </h3>
    <p className="text-4xl font-bold">
      {stats.destinations}
    </p>
  </div>

  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-gray-500">
      Visa Applications
    </h3>
    <p className="text-4xl font-bold">
      {stats.totalVisas}
    </p>
  </div>

  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-gray-500">
      Flight Bookings
    </h3>
    <p className="text-4xl font-bold">
      {stats.totalBookings}
    </p>
  </div>

  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-gray-500">
      Revenue
    </h3>
    <p className="text-4xl font-bold">
      ₹{stats.revenue}
    </p>
  </div>

</div>
	<div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-gray-500">
      Pending Follow Ups
    </h3>

    <p className="text-4xl font-bold">
      {stats.pendingFollowups}
    </p>
  </div>
  <div className="bg-yellow-50 border p-6 rounded-lg shadow mb-6">

  <h3 className="text-xl font-bold mb-4">
    Notifications
  </h3>

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
