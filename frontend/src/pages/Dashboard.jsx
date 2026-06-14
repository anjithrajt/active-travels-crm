import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    destinations: 0,
  });

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchAlerts();
  }, []);

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

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Dashboard
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
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
            Destinations
          </h3>

          <p className="text-4xl font-bold">
            {stats.destinations}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-red-600 mb-4">
          Passport Expiry Alerts
        </h3>

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
    </div>
  );
}

export default Dashboard;
